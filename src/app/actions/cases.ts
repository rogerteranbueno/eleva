"use server";

import { revalidatePath } from "next/cache";
import { requireTeam } from "@/lib/context";
import { createServiceClient } from "@/lib/supabase/server";
import { logAudit, emitDomainEvent } from "@/lib/audit";
import { runSignalEngine } from "@/modules/operations/signals";

/**
 * Comandos de servidor del ciclo señal → caso → intervención → resultado.
 * Patrón de acción sensible: autorizar → validar → ejecutar → auditar.
 * El tenant sale de la sesión; el id del caso se verifica contra ese tenant.
 */

async function getAuthorizedCase(caseId: string) {
  const ctx = await requireTeam(["dueno", "oficinas", "entrenador"]);
  const service = createServiceClient();
  const { data: caseRow } = await service
    .from("cases")
    .select("id, organization_id, status, subject_person_id, title")
    .eq("id", caseId)
    .eq("organization_id", ctx.organizationId)
    .single();
  if (!caseRow) throw new Error("El caso no existe en tu organización.");
  return { ctx, service, caseRow };
}

export async function registerIntervention(formData: FormData) {
  const caseId = String(formData.get("caseId"));
  const kind = String(formData.get("kind"));
  const channel = String(formData.get("channel") || "ninguno");
  const draftMessage = String(formData.get("draftMessage") ?? "").trim();
  const notes = String(formData.get("notes") ?? "").trim();

  const validKinds = [
    "contactar",
    "corregir_dato",
    "reprogramar",
    "ofrecer_opciones",
    "escalar",
    "cerrar_sin_contacto",
  ];
  if (!validKinds.includes(kind)) throw new Error("Tipo de intervención inválido.");

  const { ctx, service, caseRow } = await getAuthorizedCase(caseId);

  const { data: intervention, error } = await service
    .from("interventions")
    .insert({
      organization_id: ctx.organizationId,
      case_id: caseRow.id,
      kind,
      channel,
      draft_message: draftMessage || null,
      notes: notes || null,
      performed_by: ctx.personId,
    })
    .select("id")
    .single();
  if (error) throw error;

  await service
    .from("cases")
    .update({ status: "esperando", updated_at: new Date().toISOString() })
    .eq("id", caseRow.id);

  // La señal queda revisada: hubo acción humana dentro del ciclo.
  await service
    .from("signals")
    .update({
      status: "revisada",
      reviewed_at: new Date().toISOString(),
      reviewed_by: ctx.personId,
    })
    .eq("case_id", caseRow.id)
    .eq("status", "abierta");

  await logAudit(service, {
    organizationId: ctx.organizationId,
    actorPersonId: ctx.personId,
    action: "intervention.registered",
    objectType: "case",
    objectId: caseRow.id,
    details: { kind, channel },
  });
  await emitDomainEvent(service, {
    organizationId: ctx.organizationId,
    name: "intervention.executed",
    actor: { type: "person", id: ctx.personId },
    subject: { type: "case", id: caseRow.id },
    properties: { kind, channel },
  });

  if (!intervention) throw new Error("No se pudo registrar la intervención.");
  revalidatePath(`/casos/${caseRow.id}`);
  revalidatePath("/hoy");
}

export async function recordOutcome(formData: FormData) {
  const caseId = String(formData.get("caseId"));
  const result = String(formData.get("result"));
  const notes = String(formData.get("notes") ?? "").trim();

  const validResults = [
    "respuesta_recibida",
    "dato_corregido",
    "opcion_elegida",
    "asistencia_posterior",
    "pago_resuelto",
    "pausa_solicitada",
    "sin_accion_por_respeto",
    "no_alcanzado",
    "otro",
  ];
  if (!validResults.includes(result)) throw new Error("Resultado inválido.");

  const { ctx, service, caseRow } = await getAuthorizedCase(caseId);

  const { data: lastIntervention } = await service
    .from("interventions")
    .select("id")
    .eq("case_id", caseRow.id)
    .order("performed_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const { error } = await service.from("outcomes").insert({
    organization_id: ctx.organizationId,
    case_id: caseRow.id,
    intervention_id: lastIntervention?.id ?? null,
    result,
    notes: notes || null,
    recorded_by: ctx.personId,
  });
  if (error) throw error;

  // Se registra correlación, no causalidad: el caso cierra como resuelto
  // aunque el resultado sea "no alcanzado"; el aprendizaje queda documentado.
  await service
    .from("cases")
    .update({
      status: "resuelto",
      closed_at: new Date().toISOString(),
      closed_reason: result,
      updated_at: new Date().toISOString(),
    })
    .eq("id", caseRow.id);

  await logAudit(service, {
    organizationId: ctx.organizationId,
    actorPersonId: ctx.personId,
    action: "outcome.recorded",
    objectType: "case",
    objectId: caseRow.id,
    details: { result },
  });
  await emitDomainEvent(service, {
    organizationId: ctx.organizationId,
    name: "outcome.recorded",
    actor: { type: "person", id: ctx.personId },
    subject: { type: "case", id: caseRow.id },
    properties: { result },
  });

  revalidatePath(`/casos/${caseRow.id}`);
  revalidatePath("/hoy");
  revalidatePath("/pulso");
}

export async function dismissCase(formData: FormData) {
  const caseId = String(formData.get("caseId"));
  const reason = String(formData.get("reason") ?? "").trim();
  if (!reason) throw new Error("Descartar un caso requiere un motivo.");

  const { ctx, service, caseRow } = await getAuthorizedCase(caseId);

  await service
    .from("cases")
    .update({
      status: "descartado",
      closed_at: new Date().toISOString(),
      closed_reason: reason,
      updated_at: new Date().toISOString(),
    })
    .eq("id", caseRow.id);

  await service
    .from("signals")
    .update({
      status: "descartada",
      reviewed_at: new Date().toISOString(),
      reviewed_by: ctx.personId,
    })
    .eq("case_id", caseRow.id);

  await logAudit(service, {
    organizationId: ctx.organizationId,
    actorPersonId: ctx.personId,
    action: "case.dismissed",
    objectType: "case",
    objectId: caseRow.id,
    details: { reason },
  });

  revalidatePath("/hoy");
  revalidatePath(`/casos/${caseRow.id}`);
}

export async function generateAIDraft(
  caseId: string,
  channel: string
): Promise<string | null> {
  const { ctx, service, caseRow } = await getAuthorizedCase(caseId);
  if (!caseRow.subject_person_id) return null;

  const [{ data: person }, { data: signals }] = await Promise.all([
    service
      .from("people")
      .select("preferred_name, full_name")
      .eq("id", caseRow.subject_person_id)
      .single(),
    service.from("signals").select("explanation").eq("case_id", caseRow.id),
  ]);
  if (!person) return null;

  const { draftContactMessage } = await import("@/lib/ai");
  return draftContactMessage(service, ctx.organizationId, {
    organizationName: ctx.organizationName,
    personPreferredName: person.preferred_name ?? person.full_name.split(" ")[0],
    channel,
    signals: signals ?? [],
  });
}

export async function refreshSignals() {
  const ctx = await requireTeam(["dueno", "oficinas"]);
  const service = createServiceClient();
  const result = await runSignalEngine(service, ctx.organizationId);
  await logAudit(service, {
    organizationId: ctx.organizationId,
    actorPersonId: ctx.personId,
    action: "signals.refreshed",
    objectType: "organization",
    objectId: ctx.organizationId,
    details: result,
  });
  revalidatePath("/hoy");
}
