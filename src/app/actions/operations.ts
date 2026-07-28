"use server";

import { revalidatePath } from "next/cache";
import { requireTeam } from "@/lib/context";
import { createServiceClient } from "@/lib/supabase/server";
import { logAudit, emitDomainEvent } from "@/lib/audit";

/** Comandos de servidor de operación: conciliar pagos, pasar lista y
 *  avanzar participaciones. Autorizar → validar → ejecutar → auditar. */

export async function reconcilePayment(formData: FormData) {
  const ctx = await requireTeam(["dueno", "finanzas", "oficinas"]);
  const paymentId = String(formData.get("paymentId"));
  const service = createServiceClient();

  const { data: payment } = await service
    .from("payments")
    .select("id, charge_id, amount_cents, reconciled")
    .eq("id", paymentId)
    .eq("organization_id", ctx.organizationId)
    .single();
  if (!payment) throw new Error("El pago no existe en tu organización.");
  if (payment.reconciled) return;

  await service
    .from("payments")
    .update({
      reconciled: true,
      reconciled_at: new Date().toISOString(),
      reconciled_by: ctx.personId,
    })
    .eq("id", payment.id);

  await logAudit(service, {
    organizationId: ctx.organizationId,
    actorPersonId: ctx.personId,
    action: "payment.reconciled",
    objectType: "payment",
    objectId: payment.id,
    details: { amount_cents: payment.amount_cents },
  });
  await emitDomainEvent(service, {
    organizationId: ctx.organizationId,
    name: "payment.reconciled",
    actor: { type: "person", id: ctx.personId },
    subject: { type: "payment", id: payment.id },
  });

  revalidatePath("/finanzas");
  revalidatePath("/pulso");
}

const ATTENDANCE_STATUSES = ["presente", "ausente", "justificada", "tarde"];

export async function saveAttendance(formData: FormData) {
  const ctx = await requireTeam(["dueno", "oficinas", "entrenador", "staff"]);
  const sessionId = String(formData.get("sessionId"));
  const service = createServiceClient();

  const { data: session } = await service
    .from("sessions")
    .select("id, cohort_id, name")
    .eq("id", sessionId)
    .eq("organization_id", ctx.organizationId)
    .single();
  if (!session) throw new Error("La sesión no existe en tu organización.");

  const { data: existing } = await service
    .from("attendance_records")
    .select("participation_id, status")
    .eq("session_id", session.id);
  const existingBy = new Map((existing ?? []).map((r) => [r.participation_id, r.status]));

  let recorded = 0;
  let corrected = 0;
  for (const [key, value] of formData.entries()) {
    if (!key.startsWith("att_")) continue;
    const participationId = key.slice(4);
    const status = String(value);
    if (!ATTENDANCE_STATUSES.includes(status)) continue;
    const prev = existingBy.get(participationId);
    if (prev === status) continue;

    await service.from("attendance_records").upsert(
      {
        organization_id: ctx.organizationId,
        session_id: session.id,
        participation_id: participationId,
        status,
        recorded_by: ctx.personId,
        corrected: prev !== undefined,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "session_id,participation_id" }
    );
    if (prev !== undefined) corrected++;
    else recorded++;
  }

  await logAudit(service, {
    organizationId: ctx.organizationId,
    actorPersonId: ctx.personId,
    action: corrected > 0 ? "attendance.corrected" : "attendance.recorded",
    objectType: "session",
    objectId: session.id,
    details: { recorded, corrected },
  });
  await emitDomainEvent(service, {
    organizationId: ctx.organizationId,
    name: "attendance.recorded",
    actor: { type: "person", id: ctx.personId },
    subject: { type: "session", id: session.id },
    scope: { type: "cohort", id: session.cohort_id },
    properties: { recorded, corrected },
  });

  revalidatePath("/agenda");
  revalidatePath(`/agenda/${session.id}`);
  revalidatePath("/generaciones");
}

/** Transiciones permitidas en el pipeline (CRM lite). Los estados canónicos
 *  no cambian por cliente; esto solo avanza el recorrido de entrada. */
const PIPELINE_NEXT: Record<string, string[]> = {
  lead: ["aplicado", "no_completo"],
  aplicado: ["registrado", "no_completo"],
  registrado: ["pago_parcial", "pagado"],
  pago_parcial: ["pagado"],
  pagado: ["confirmado"],
  confirmado: ["activo"],
};

export async function advanceParticipation(formData: FormData) {
  const ctx = await requireTeam(["dueno", "oficinas"]);
  const participationId = String(formData.get("participationId"));
  const toState = String(formData.get("toState"));
  const service = createServiceClient();

  const { data: participation } = await service
    .from("participations")
    .select("id, state, person_id, cohort_id")
    .eq("id", participationId)
    .eq("organization_id", ctx.organizationId)
    .single();
  if (!participation) throw new Error("La participación no existe en tu organización.");

  const allowed = PIPELINE_NEXT[participation.state] ?? [];
  if (!allowed.includes(toState)) {
    throw new Error(`No se puede pasar de ${participation.state} a ${toState}.`);
  }

  await service
    .from("participations")
    .update({ state: toState, updated_at: new Date().toISOString() })
    .eq("id", participation.id);

  await service.from("participation_state_history").insert({
    organization_id: ctx.organizationId,
    participation_id: participation.id,
    from_state: participation.state,
    to_state: toState,
    changed_by: ctx.personId,
  });

  await logAudit(service, {
    organizationId: ctx.organizationId,
    actorPersonId: ctx.personId,
    action: "participation.state_changed",
    objectType: "participation",
    objectId: participation.id,
    details: { from: participation.state, to: toState },
  });
  await emitDomainEvent(service, {
    organizationId: ctx.organizationId,
    name:
      toState === "confirmado"
        ? "participation.confirmed"
        : "opportunity.stage_changed",
    actor: { type: "person", id: ctx.personId },
    subject: { type: "participation", id: participation.id },
    scope: { type: "cohort", id: participation.cohort_id },
    properties: { from: participation.state, to: toState },
  });

  revalidatePath("/crm");
}
