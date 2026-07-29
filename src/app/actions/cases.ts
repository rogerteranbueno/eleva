"use server";

import { revalidatePath } from "next/cache";
import { requireCapability, hasCapability } from "@/lib/capabilities";
import { createServiceClient } from "@/lib/supabase/server";
import { logAudit, emitDomainEvent } from "@/lib/audit";
import { runSignalEngine } from "@/modules/operations/signals";

/**
 * Comandos de servidor del ciclo señal → caso → intervención → resultado.
 * Patrón de acción sensible: autorizar → validar → ejecutar → auditar.
 * El tenant sale de la sesión; el id del caso se verifica contra ese tenant.
 */

async function getAuthorizedCase(caseId: string) {
  // La autorización depende del TIPO de caso: los de finanzas solo los
  // operan roles financieros (el entrenador no toca dinero).
  const ctx = await requireCapability(["case.operate.operational", "case.operate.finance"]);
  const service = createServiceClient();
  const { data: caseRow } = await service
    .from("cases")
    .select("id, organization_id, kind, status, subject_person_id, title")
    .eq("id", caseId)
    .eq("organization_id", ctx.organizationId)
    .single();
  if (!caseRow) throw new Error("El caso no existe en tu organización.");
  const allowed = hasCapability(
    ctx,
    caseRow.kind === "finanzas" ? "case.operate.finance" : "case.operate.operational"
  );
  if (!allowed) throw new Error("Este tipo de caso no corresponde a tu rol.");
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
  // Nombre honesto: registrar una intervención (y su borrador) NO es haber
  // ejecutado el contacto — eso lo hace una persona fuera del sistema.
  await emitDomainEvent(service, {
    organizationId: ctx.organizationId,
    name: "intervention.recorded",
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

/** Responde la primera contribución directamente desde el caso: crea el
 *  comentario en el Hub, registra la intervención y avisa a la persona. */
export async function replyFromCase(formData: FormData) {
  const caseId = String(formData.get("caseId"));
  const postId = String(formData.get("postId"));
  const body = String(formData.get("body") ?? "").trim();
  if (!body) throw new Error("Escribe tu respuesta.");

  const { ctx, service, caseRow } = await getAuthorizedCase(caseId);

  const { data: post } = await service
    .from("posts")
    .select("id, author_person_id, space_id, spaces(cycle_id)")
    .eq("id", postId)
    .eq("organization_id", ctx.organizationId)
    .single();
  if (!post) throw new Error("La publicación no existe.");

  const { error } = await service.from("comments").insert({
    organization_id: ctx.organizationId,
    post_id: post.id,
    author_person_id: ctx.personId,
    body,
  });
  if (error) throw new Error("No se pudo publicar la respuesta.");

  await service.from("interventions").insert({
    organization_id: ctx.organizationId,
    case_id: caseRow.id,
    kind: "contactar",
    channel: "ninguno",
    notes: "Respondió la publicación directamente en el Hub de la generación.",
    performed_by: ctx.personId,
  });
  await service
    .from("cases")
    .update({ status: "esperando", updated_at: new Date().toISOString() })
    .eq("id", caseRow.id);
  await service
    .from("signals")
    .update({
      status: "revisada",
      reviewed_at: new Date().toISOString(),
      reviewed_by: ctx.personId,
    })
    .eq("case_id", caseRow.id)
    .eq("status", "abierta");

  await service.from("notifications").insert({
    organization_id: ctx.organizationId,
    person_id: post.author_person_id,
    kind: "comentario",
    text: `${ctx.personName} respondió a tu publicación.`,
    href: `/mi/comunidad/p/${post.id}`,
  });

  await logAudit(service, {
    organizationId: ctx.organizationId,
    actorPersonId: ctx.personId,
    action: "intervention.registered",
    objectType: "case",
    objectId: caseRow.id,
    details: { kind: "respuesta_en_hub", post_id: post.id },
  });
  await emitDomainEvent(service, {
    organizationId: ctx.organizationId,
    name: "first_contribution.responded",
    actor: { type: "person", id: ctx.personId },
    subject: { type: "post", id: post.id },
    scope: post.spaces?.cycle_id ? { type: "cycle", id: post.spaces.cycle_id } : undefined,
  });

  revalidatePath(`/casos/${caseRow.id}`);
  revalidatePath("/hoy");
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
  const ctx = await requireCapability("case.operate.operational");
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
