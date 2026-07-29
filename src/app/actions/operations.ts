"use server";

import { revalidatePath } from "next/cache";
import { requireCapability, hasCapability } from "@/lib/capabilities";
import { createServiceClient } from "@/lib/supabase/server";
import { logAudit, emitDomainEvent } from "@/lib/audit";
import type { Database } from "@/lib/database.types";

/** Comandos de servidor de operación v2 sobre el dominio canónico:
 *  pasar lista contra expectativas, registrar pasos del pase, CRM de
 *  prospectos y seguimiento de staff. Autorizar → validar → ejecutar → auditar. */

const ATTENDANCE_STATUSES = ["presente", "ausente", "justificada", "tarde"];

export async function saveAttendance(formData: FormData) {
  const ctx = await requireCapability(["attendance.write.all", "attendance.write.assigned"]);
  const eventId = String(formData.get("eventId"));
  const service = createServiceClient();

  const { data: event } = await service
    .from("event_occurrences")
    .select("id, name, stage_run_id, cycle_id")
    .eq("id", eventId)
    .eq("organization_id", ctx.organizationId)
    .single();
  if (!event) throw new Error("El evento no existe en tu organización.");

  // Staff puro: solo puede registrar a su grupo asignado.
  const staffOnly = !hasCapability(ctx, "attendance.write.all");
  let allowedParticipations: Set<string> | null = null;
  if (staffOnly) {
    const { data: groups } = await service
      .from("small_groups")
      .select("small_group_members(stage_participation_id)")
      .eq("staff_person_id", ctx.personId);
    allowedParticipations = new Set(
      (groups ?? []).flatMap((g) =>
        (g.small_group_members ?? []).map((m) => m.stage_participation_id)
      )
    );
  }

  const { data: existing } = await service
    .from("attendance_records")
    .select("stage_participation_id, status")
    .eq("event_occurrence_id", event.id);
  const existingBy = new Map(
    (existing ?? []).map((r) => [r.stage_participation_id, r.status])
  );

  let recorded = 0;
  let corrected = 0;
  for (const [key, value] of formData.entries()) {
    if (!key.startsWith("att_")) continue;
    const participationId = key.slice(4);
    const status = String(value);
    if (!ATTENDANCE_STATUSES.includes(status)) continue;
    if (allowedParticipations && !allowedParticipations.has(participationId)) continue;
    const prev = existingBy.get(participationId);
    if (prev === status) continue;

    await service.from("attendance_records").upsert(
      {
        organization_id: ctx.organizationId,
        event_occurrence_id: event.id,
        stage_participation_id: participationId,
        status,
        recorded_by: ctx.personId,
        corrected: prev !== undefined,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "event_occurrence_id,stage_participation_id" }
    );
    if (prev !== undefined) corrected++;
    else recorded++;
  }

  await logAudit(service, {
    organizationId: ctx.organizationId,
    actorPersonId: ctx.personId,
    action: corrected > 0 ? "attendance.corrected" : "attendance.recorded",
    objectType: "event_occurrence",
    objectId: event.id,
    details: { recorded, corrected },
  });
  await emitDomainEvent(service, {
    organizationId: ctx.organizationId,
    name: "attendance.recorded",
    actor: { type: "person", id: ctx.personId },
    subject: { type: "event_occurrence", id: event.id },
    scope: event.stage_run_id ? { type: "stage_run", id: event.stage_run_id } : undefined,
    properties: { recorded, corrected },
  });

  revalidatePath("/agenda");
  revalidatePath(`/agenda/${event.id}`);
  revalidatePath("/generaciones");
}

// ---------------------------------------------------------------------------
// El pase: cada paso es un hecho registrado con marca de tiempo.
// ---------------------------------------------------------------------------

const PASS_STEPS: Record<
  string,
  { from: string[]; set: Record<string, unknown>; event: string }
> = {
  evaluar: {
    from: ["no_evaluado"],
    set: { pass_status: "elegible", evaluated_at: "now" },
    event: "pass.evaluated",
  },
  conversar: {
    from: ["elegible"],
    set: { pass_status: "conversado", conversed_at: "now" },
    event: "pass.conversed",
  },
  ofrecer: {
    from: ["conversado"],
    set: { pass_status: "ofrecido", offered_at: "now" },
    event: "pass.offered",
  },
  aceptar: {
    from: ["conversado", "ofrecido"],
    set: { pass_status: "aceptado", decided_at: "now" },
    event: "pass.accepted",
  },
  declinar: {
    from: ["conversado", "ofrecido"],
    set: { pass_status: "declinado", decided_at: "now" },
    event: "pass.declined",
  },
  diferir: {
    from: ["conversado", "ofrecido", "aceptado"],
    set: { pass_status: "diferido", decided_at: "now" },
    event: "pass.deferred",
  },
};

export async function recordPassStep(formData: FormData) {
  const ctx = await requireCapability("pass.record");
  const passId = String(formData.get("passId"));
  const step = String(formData.get("step"));
  const notes = formData.get("notes") ? String(formData.get("notes")) : undefined;
  const spec = PASS_STEPS[step];
  if (!spec) throw new Error(`Paso de pase desconocido: ${step}.`);

  const service = createServiceClient();
  const { data: pass } = await service
    .from("continuity_passes")
    .select("id, pass_status, next_status, from_participation_id, to_stage_run_id")
    .eq("id", passId)
    .eq("organization_id", ctx.organizationId)
    .single();
  if (!pass) throw new Error("El pase no existe en tu organización.");
  if (!spec.from.includes(pass.pass_status)) {
    throw new Error(`No se puede «${step}» desde el estado ${pass.pass_status}.`);
  }

  const patch: Database["public"]["Tables"]["continuity_passes"]["Update"] = {
    recorded_by: ctx.personId,
  };
  for (const [k, v] of Object.entries(spec.set)) {
    (patch as Record<string, unknown>)[k] = v === "now" ? new Date().toISOString() : v;
  }
  if (notes) patch.notes = notes;
  await service.from("continuity_passes").update(patch).eq("id", pass.id);

  await logAudit(service, {
    organizationId: ctx.organizationId,
    actorPersonId: ctx.personId,
    action: spec.event,
    objectType: "continuity_pass",
    objectId: pass.id,
    details: { from: pass.pass_status, step },
  });
  await emitDomainEvent(service, {
    organizationId: ctx.organizationId,
    name: spec.event,
    actor: { type: "person", id: ctx.personId },
    subject: { type: "continuity_pass", id: pass.id },
  });

  revalidatePath("/generaciones");
}

/** Inscribir desde un pase aceptado: crea la participación en la etapa destino
 *  y su cargo según el precio de la etapa. Un solo comando, un solo hecho. */
export async function enrollFromPass(formData: FormData) {
  const ctx = await requireCapability("pass.enroll");
  const passId = String(formData.get("passId"));
  const service = createServiceClient();

  const { data: pass } = await service
    .from("continuity_passes")
    .select(
      "id, pass_status, next_status, to_stage_run_id, stage_participations!continuity_passes_from_participation_id_fkey(person_id)"
    )
    .eq("id", passId)
    .eq("organization_id", ctx.organizationId)
    .single();
  if (!pass) throw new Error("El pase no existe en tu organización.");
  if (pass.pass_status !== "aceptado") throw new Error("Solo se inscribe un pase aceptado.");
  if (pass.next_status !== "sin_intencion" && pass.next_status !== "reservado") {
    throw new Error("Esta inscripción ya se concretó.");
  }
  if (!pass.to_stage_run_id) throw new Error("El pase no tiene etapa destino.");

  const { data: run } = await service
    .from("stage_runs")
    .select("id, name, price_cents, currency, starts_on")
    .eq("id", pass.to_stage_run_id)
    .single();
  if (!run) throw new Error("La etapa destino no existe.");

  const personId = pass.stage_participations!.person_id;
  const { data: sp, error: spError } = await service
    .from("stage_participations")
    .upsert(
      {
        organization_id: ctx.organizationId,
        person_id: personId,
        stage_run_id: run.id,
        registration_status: "confirmado",
        delivery_status: "esperado",
        source: "pase",
        registered_at: new Date().toISOString(),
      },
      { onConflict: "person_id,stage_run_id" }
    )
    .select("id")
    .single();
  if (spError) throw spError;

  if (run.price_cents && run.price_cents > 0) {
    const { data: existingCharge } = await service
      .from("charges")
      .select("id")
      .eq("stage_participation_id", sp.id)
      .maybeSingle();
    if (!existingCharge) {
      await service.from("charges").insert({
        organization_id: ctx.organizationId,
        person_id: personId,
        stage_participation_id: sp.id,
        concept: run.name,
        amount_cents: run.price_cents,
        currency: run.currency,
        due_on: run.starts_on,
      });
    }
  }

  await service
    .from("continuity_passes")
    .update({
      next_status: "inscrito",
      enrolled_at: new Date().toISOString(),
      recorded_by: ctx.personId,
    })
    .eq("id", pass.id);

  await logAudit(service, {
    organizationId: ctx.organizationId,
    actorPersonId: ctx.personId,
    action: "pass.enrolled",
    objectType: "continuity_pass",
    objectId: pass.id,
    details: { stage_run: run.name },
  });
  await emitDomainEvent(service, {
    organizationId: ctx.organizationId,
    name: "pass.enrolled",
    actor: { type: "person", id: ctx.personId },
    subject: { type: "person", id: personId },
    scope: { type: "stage_run", id: run.id },
  });

  revalidatePath("/generaciones");
  revalidatePath("/hoy");
}

// ---------------------------------------------------------------------------
// CRM de prospectos (el plano ANTES de la participación)
// ---------------------------------------------------------------------------

const CRM_NEXT: Record<string, string[]> = {
  nuevo: ["contactado", "perdido"],
  contactado: ["cita", "interesado", "perdido"],
  cita: ["interesado", "perdido"],
  interesado: ["registro_iniciado", "perdido"],
  registro_iniciado: ["convertido", "perdido"],
  perdido: ["reactivable"],
  reactivable: ["contactado"],
};

export async function advanceProspect(formData: FormData) {
  const ctx = await requireCapability("crm.write");
  const prospectId = String(formData.get("prospectId"));
  const toStatus = String(formData.get("toStatus"));
  const service = createServiceClient();

  const { data: prospect } = await service
    .from("prospects")
    .select("id, crm_status, person_id")
    .eq("id", prospectId)
    .eq("organization_id", ctx.organizationId)
    .single();
  if (!prospect) throw new Error("El prospecto no existe en tu organización.");
  const allowed = CRM_NEXT[prospect.crm_status] ?? [];
  if (!allowed.includes(toStatus)) {
    throw new Error(`No se puede pasar de ${prospect.crm_status} a ${toStatus}.`);
  }

  await service
    .from("prospects")
    .update({ crm_status: toStatus, updated_at: new Date().toISOString() })
    .eq("id", prospect.id);

  await logAudit(service, {
    organizationId: ctx.organizationId,
    actorPersonId: ctx.personId,
    action: "prospect.stage_changed",
    objectType: "prospect",
    objectId: prospect.id,
    details: { from: prospect.crm_status, to: toStatus },
  });
  await emitDomainEvent(service, {
    organizationId: ctx.organizationId,
    name: "opportunity.stage_changed",
    actor: { type: "person", id: ctx.personId },
    subject: { type: "prospect", id: prospect.id },
    properties: { from: prospect.crm_status, to: toStatus },
  });

  revalidatePath("/crm");
}

/** Registrar un prospecto al Básico destino: crea la participación (registro
 *  iniciado→confirmado), el cargo de la etapa, marca el prospecto convertido
 *  y actualiza la atribución de quien lo enroló. */
export async function registerProspectToBasico(formData: FormData) {
  const ctx = await requireCapability("crm.write");
  const prospectId = String(formData.get("prospectId"));
  const service = createServiceClient();

  const { data: prospect } = await service
    .from("prospects")
    .select("id, person_id, crm_status, target_stage_run_id")
    .eq("id", prospectId)
    .eq("organization_id", ctx.organizationId)
    .single();
  if (!prospect) throw new Error("El prospecto no existe en tu organización.");
  if (!prospect.target_stage_run_id) throw new Error("El prospecto no tiene Básico destino.");
  if (prospect.crm_status === "convertido") return;

  const { data: run } = await service
    .from("stage_runs")
    .select("id, name, price_cents, currency, starts_on")
    .eq("id", prospect.target_stage_run_id)
    .single();
  if (!run) throw new Error("La etapa destino no existe.");

  const { data: sp, error: spError } = await service
    .from("stage_participations")
    .upsert(
      {
        organization_id: ctx.organizationId,
        person_id: prospect.person_id,
        stage_run_id: run.id,
        registration_status: "confirmado",
        delivery_status: "esperado",
        source: "crm",
        registered_at: new Date().toISOString(),
      },
      { onConflict: "person_id,stage_run_id" }
    )
    .select("id")
    .single();
  if (spError) throw spError;

  if (run.price_cents && run.price_cents > 0) {
    const { data: existingCharge } = await service
      .from("charges")
      .select("id")
      .eq("stage_participation_id", sp.id)
      .maybeSingle();
    if (!existingCharge) {
      await service.from("charges").insert({
        organization_id: ctx.organizationId,
        person_id: prospect.person_id,
        stage_participation_id: sp.id,
        concept: run.name,
        amount_cents: run.price_cents,
        currency: run.currency,
        due_on: run.starts_on,
      });
    }
  }

  await service
    .from("prospects")
    .update({ crm_status: "convertido", updated_at: new Date().toISOString() })
    .eq("id", prospect.id);
  await service
    .from("enrollment_attributions")
    .update({ status: "registrado" })
    .eq("prospect_id", prospect.id);

  await logAudit(service, {
    organizationId: ctx.organizationId,
    actorPersonId: ctx.personId,
    action: "prospect.registered",
    objectType: "prospect",
    objectId: prospect.id,
    details: { stage_run: run.name },
  });
  await emitDomainEvent(service, {
    organizationId: ctx.organizationId,
    name: "participation.confirmed",
    actor: { type: "person", id: ctx.personId },
    subject: { type: "person", id: prospect.person_id },
    scope: { type: "stage_run", id: run.id },
  });

  revalidatePath("/crm");
}

// ---------------------------------------------------------------------------
// Seguimiento de staff: registrar el resultado de una llamada
// ---------------------------------------------------------------------------

const CALL_RESULTS = ["contactada", "sin_respuesta", "reagendada", "escalada"];

export async function recordFollowUp(formData: FormData) {
  const ctx = await requireCapability(["followup.read.own", "followup.read.coverage"]);
  const callId = String(formData.get("callId"));
  const resultado = String(formData.get("resultado"));
  const notes = formData.get("notes") ? String(formData.get("notes")) : null;
  if (!CALL_RESULTS.includes(resultado)) throw new Error("Resultado inválido.");
  const service = createServiceClient();

  const { data: call } = await service
    .from("follow_up_interactions")
    .select("id, staff_person_id, done_at, stage_participation_id")
    .eq("id", callId)
    .eq("organization_id", ctx.organizationId)
    .single();
  if (!call) throw new Error("La llamada no existe en tu organización.");
  // Staff puro solo registra SU seguimiento.
  const supervisor = hasCapability(ctx, "followup.read.coverage");
  if (!supervisor && call.staff_person_id !== ctx.personId) {
    throw new Error("Solo puedes registrar tu propio seguimiento.");
  }

  await service
    .from("follow_up_interactions")
    .update({ done_at: new Date().toISOString(), resultado, notes })
    .eq("id", call.id);

  await logAudit(service, {
    organizationId: ctx.organizationId,
    actorPersonId: ctx.personId,
    action: "follow_up.recorded",
    objectType: "follow_up",
    objectId: call.id,
    details: { resultado },
  });
  await emitDomainEvent(service, {
    organizationId: ctx.organizationId,
    name: "follow_up.recorded",
    actor: { type: "person", id: ctx.personId },
    subject: { type: "follow_up", id: call.id },
    properties: { resultado },
  });

  revalidatePath("/mi-grupo");
  revalidatePath("/cobertura");
}
