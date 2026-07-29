"use server";

import { revalidatePath } from "next/cache";
import { requireCapability } from "@/lib/capabilities";
import { createServiceClient } from "@/lib/supabase/server";
import { logAudit, emitDomainEvent } from "@/lib/audit";

/** Comandos del ledger. Reglas duras: un pago se REPARTE con asignaciones
 *  (nunca "pertenece" a un cargo); el estado del cargo se DERIVA del ledger;
 *  las monedas no se mezclan; becas y devoluciones llevan aprobación. */


/** Recalcula el estado de un cargo desde asignaciones + descuentos. */
async function refreshChargeStatus(
  service: ReturnType<typeof createServiceClient>,
  chargeId: string
) {
  const { data: charge } = await service
    .from("charges")
    .select("id, amount_cents, status, payment_allocations(amount_cents), discounts(amount_cents)")
    .eq("id", chargeId)
    .single();
  if (!charge || charge.status === "cancelado") return;
  const covered =
    (charge.payment_allocations ?? []).reduce((s, a) => s + a.amount_cents, 0) +
    (charge.discounts ?? []).reduce((s, d) => s + d.amount_cents, 0);
  const status =
    covered >= charge.amount_cents ? "pagado" : covered > 0 ? "parcial" : "pendiente";
  if (status !== charge.status) {
    await service
      .from("charges")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", chargeId);
  }
}

export async function allocatePayment(formData: FormData) {
  const ctx = await requireCapability("finance.write");
  const paymentId = String(formData.get("paymentId"));
  const chargeId = String(formData.get("chargeId"));
  const service = createServiceClient();

  const [{ data: payment }, { data: charge }] = await Promise.all([
    service
      .from("payments")
      .select("id, amount_cents, currency, person_id, payment_allocations(amount_cents)")
      .eq("id", paymentId)
      .eq("organization_id", ctx.organizationId)
      .single(),
    service
      .from("charges")
      .select("id, person_id, amount_cents, currency, concept, payment_allocations(amount_cents), discounts(amount_cents)")
      .eq("id", chargeId)
      .eq("organization_id", ctx.organizationId)
      .single(),
  ]);
  if (!payment) throw new Error("El pago no existe en tu organización.");
  if (!charge) throw new Error("El cargo no existe en tu organización.");
  if (payment.currency.trim() !== charge.currency.trim()) {
    throw new Error("Las monedas no se mezclan: el pago y el cargo deben ser de la misma moneda.");
  }

  const paymentFree =
    payment.amount_cents -
    (payment.payment_allocations ?? []).reduce((s, a) => s + a.amount_cents, 0);
  const chargeRest =
    charge.amount_cents -
    (charge.payment_allocations ?? []).reduce((s, a) => s + a.amount_cents, 0) -
    (charge.discounts ?? []).reduce((s, d) => s + d.amount_cents, 0);
  const requested = formData.get("amountCents")
    ? Number(formData.get("amountCents"))
    : Math.min(paymentFree, chargeRest);
  const amount = Math.min(requested, paymentFree, chargeRest);
  if (!Number.isFinite(amount) || amount <= 0) {
    throw new Error("No hay monto disponible por asignar entre este pago y este cargo.");
  }

  const { error } = await service.from("payment_allocations").insert({
    organization_id: ctx.organizationId,
    payment_id: payment.id,
    charge_id: charge.id,
    amount_cents: Math.round(amount),
  });
  if (error) throw error;

  // Un pago sin persona que se asigna a un cargo queda identificado.
  if (!payment.person_id && charge.person_id) {
    await service.from("payments").update({ person_id: charge.person_id }).eq("id", payment.id);
  }
  await refreshChargeStatus(service, charge.id);

  await logAudit(service, {
    organizationId: ctx.organizationId,
    actorPersonId: ctx.personId,
    action: "payment.allocated",
    objectType: "payment",
    objectId: payment.id,
    details: { charge: charge.concept, amount_cents: Math.round(amount) },
  });
  await emitDomainEvent(service, {
    organizationId: ctx.organizationId,
    name: "payment.allocated",
    actor: { type: "person", id: ctx.personId },
    subject: { type: "payment", id: payment.id },
    properties: { charge_id: charge.id, amount_cents: Math.round(amount) },
  });

  revalidatePath("/finanzas");
  revalidatePath("/pulso");
}

export async function confirmPayment(formData: FormData) {
  const ctx = await requireCapability("finance.write");
  const paymentId = String(formData.get("paymentId"));
  const service = createServiceClient();

  const { data: payment } = await service
    .from("payments")
    .select("id, confirmed")
    .eq("id", paymentId)
    .eq("organization_id", ctx.organizationId)
    .single();
  if (!payment) throw new Error("El pago no existe en tu organización.");
  if (payment.confirmed) return;

  await service.from("payments").update({ confirmed: true }).eq("id", payment.id);
  await logAudit(service, {
    organizationId: ctx.organizationId,
    actorPersonId: ctx.personId,
    action: "payment.confirmed",
    objectType: "payment",
    objectId: payment.id,
  });

  revalidatePath("/finanzas");
  revalidatePath("/pulso");
}

export async function closeBatch(formData: FormData) {
  const ctx = await requireCapability("finance.close_period");
  const batchId = String(formData.get("batchId"));
  const service = createServiceClient();

  const { data: batch } = await service
    .from("reconciliation_batches")
    .select("id, status, period_start, period_end")
    .eq("id", batchId)
    .eq("organization_id", ctx.organizationId)
    .single();
  if (!batch) throw new Error("La batch no existe en tu organización.");
  if (batch.status === "cerrada") return;

  // Un periodo cerrado es el único dato que el Pulso reporta como reconciliado:
  // no puede cerrarse con dinero sin confirmar NI con dinero sin identificar.
  const { data: inBatch } = await service
    .from("payments")
    .select("id, confirmed, payment_allocations(id)")
    .eq("reconciliation_batch_id", batch.id);
  const unconfirmed = (inBatch ?? []).filter((p) => !p.confirmed).length;
  const unallocated = (inBatch ?? []).filter(
    (p) => (p.payment_allocations ?? []).length === 0
  ).length;
  if (unconfirmed > 0 || unallocated > 0) {
    const faltas = [
      unconfirmed > 0 ? `${unconfirmed} sin confirmar` : null,
      unallocated > 0 ? `${unallocated} sin asignar a ningún cargo` : null,
    ]
      .filter(Boolean)
      .join(" y ");
    throw new Error(
      `El periodo tiene pagos ${faltas}. Resuélvelos o sácalos del periodo antes de cerrar.`
    );
  }

  await service
    .from("reconciliation_batches")
    .update({ status: "cerrada", closed_by: ctx.personId, closed_at: new Date().toISOString() })
    .eq("id", batch.id);

  await logAudit(service, {
    organizationId: ctx.organizationId,
    actorPersonId: ctx.personId,
    action: "batch.closed",
    objectType: "reconciliation_batch",
    objectId: batch.id,
    details: { period: `${batch.period_start} → ${batch.period_end}` },
  });

  revalidatePath("/finanzas");
}

export async function grantDiscount(formData: FormData) {
  const ctx = await requireCapability("finance.approve");
  const chargeId = String(formData.get("chargeId"));
  const amountCents = Math.round(Number(formData.get("amountCents")));
  const kind = String(formData.get("kind"));
  const reason = String(formData.get("reason") ?? "").trim();
  if (!["beca", "descuento", "ajuste"].includes(kind)) throw new Error("Tipo inválido.");
  if (!reason) throw new Error("Toda beca o descuento lleva motivo.");
  if (!Number.isFinite(amountCents) || amountCents <= 0) throw new Error("Monto inválido.");
  const service = createServiceClient();

  const { data: charge } = await service
    .from("charges")
    .select("id, concept, amount_cents, payment_allocations(amount_cents), discounts(amount_cents)")
    .eq("id", chargeId)
    .eq("organization_id", ctx.organizationId)
    .single();
  if (!charge) throw new Error("El cargo no existe en tu organización.");
  const covered =
    (charge.payment_allocations ?? []).reduce((s, a) => s + a.amount_cents, 0) +
    (charge.discounts ?? []).reduce((s, d) => s + d.amount_cents, 0);
  if (covered + amountCents > charge.amount_cents) {
    throw new Error("El descuento excede lo que queda por cubrir del cargo.");
  }

  await service.from("discounts").insert({
    organization_id: ctx.organizationId,
    charge_id: charge.id,
    amount_cents: amountCents,
    kind,
    reason,
    approved_by: ctx.personId,
  });
  await refreshChargeStatus(service, charge.id);

  await logAudit(service, {
    organizationId: ctx.organizationId,
    actorPersonId: ctx.personId,
    action: "discount.granted",
    objectType: "charge",
    objectId: charge.id,
    details: { kind, amount_cents: amountCents, reason },
  });

  revalidatePath("/finanzas");
}

export async function registerRefund(formData: FormData) {
  const ctx = await requireCapability("finance.approve");
  const paymentId = String(formData.get("paymentId"));
  const amountCents = Math.round(Number(formData.get("amountCents")));
  const reason = String(formData.get("reason") ?? "").trim();
  if (!reason) throw new Error("Toda devolución lleva motivo.");
  if (!Number.isFinite(amountCents) || amountCents <= 0) throw new Error("Monto inválido.");
  const service = createServiceClient();

  const { data: payment } = await service
    .from("payments")
    .select("id, amount_cents, currency, refunds(amount_cents)")
    .eq("id", paymentId)
    .eq("organization_id", ctx.organizationId)
    .single();
  if (!payment) throw new Error("El pago no existe en tu organización.");
  const refunded = (payment.refunds ?? []).reduce((s, r) => s + r.amount_cents, 0);
  if (refunded + amountCents > payment.amount_cents) {
    throw new Error("La devolución excede el monto del pago.");
  }

  await service.from("refunds").insert({
    organization_id: ctx.organizationId,
    payment_id: payment.id,
    amount_cents: amountCents,
    currency: payment.currency,
    reason,
    approved_by: ctx.personId,
  });

  await logAudit(service, {
    organizationId: ctx.organizationId,
    actorPersonId: ctx.personId,
    action: "refund.registered",
    objectType: "payment",
    objectId: payment.id,
    details: { amount_cents: amountCents, reason },
  });

  revalidatePath("/finanzas");
}

export async function registerExpense(formData: FormData) {
  const ctx = await requireCapability("finance.approve");
  const category = String(formData.get("category"));
  const concept = String(formData.get("concept") ?? "").trim();
  const amountCents = Math.round(Number(formData.get("amountMxn")) * 100);
  const stageRunId = formData.get("stageRunId") ? String(formData.get("stageRunId")) : null;
  if (!concept) throw new Error("El gasto lleva concepto.");
  if (!Number.isFinite(amountCents) || amountCents <= 0) throw new Error("Monto inválido.");
  const service = createServiceClient();

  if (stageRunId) {
    const { data: run } = await service
      .from("stage_runs")
      .select("id")
      .eq("id", stageRunId)
      .eq("organization_id", ctx.organizationId)
      .single();
    if (!run) throw new Error("La etapa no existe en tu organización.");
  }

  await service.from("expenses").insert({
    organization_id: ctx.organizationId,
    stage_run_id: stageRunId,
    category,
    concept,
    amount_cents: amountCents,
    incurred_on: new Date().toISOString().slice(0, 10),
    recorded_by: ctx.personId,
  });

  await logAudit(service, {
    organizationId: ctx.organizationId,
    actorPersonId: ctx.personId,
    action: "expense.recorded",
    objectType: "expense",
    objectId: stageRunId ?? "centro",
    details: { category, concept, amount_cents: amountCents },
  });

  revalidatePath("/finanzas");
}
