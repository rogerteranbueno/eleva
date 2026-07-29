import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/database.types";
import { emitDomainEvent } from "@/lib/audit";

type Service = SupabaseClient<Database>;

/**
 * Motor de señales v2 — determinista, versionado e idempotente sobre el
 * dominio canónico (ciclo Básico→Avanzado→PL).
 * Una señal es evidencia observable, no un diagnóstico. Cada señal explica
 * su regla y su fuente, y crea (o se suma a) un caso TIPADO: los casos de
 * finanzas solo los ven roles financieros.
 *
 * Dedupe honesto: las condiciones PERSISTENTES (pago vencido, llamada sin
 * hacer, pase sin inscribir) llevan bucket semanal en la llave — descartar
 * el caso no hace desaparecer la condición: reaparece la semana siguiente.
 */

const DEFINITIONS = [
  {
    key: "sin_registro_asistencia",
    version: 2,
    name: "Asistencia sin registrar",
    description: "Un día de etapa ya pasó y quedan personas esperadas sin registro.",
    rule: "Expectativa de asistencia sin registro para un evento de etapa ya terminado.",
    severity: "atencion",
    priority: "media",
    assigned_role: "oficinas",
    kind: "registro",
  },
  {
    key: "ausencia_dia_etapa",
    version: 2,
    name: "Ausencia en día de etapa",
    description: "La persona faltó a un día de su etapa (un Básico son 3 días: cada uno cuenta).",
    rule: "Registro 'ausente' en un evento de etapa de una participación con entrega activa o esperada.",
    severity: "urgente",
    priority: "alta",
    assigned_role: "oficinas",
    kind: "entrega",
  },
  {
    key: "pase_aceptado_sin_inscripcion",
    version: 2,
    name: "Pase aceptado sin inscripción",
    description: "La persona aceptó continuar y su inscripción no se ha concretado.",
    rule: "Pase con estado 'aceptado' sin inscripción a más de 48 horas de la decisión.",
    severity: "urgente",
    priority: "alta",
    assigned_role: "oficinas",
    kind: "pase",
  },
  {
    key: "registro_incompleto_etapa",
    version: 2,
    name: "Registro incompleto para la etapa",
    description: "Una etapa arranca pronto y hay registros sin completar o confirmar.",
    rule: "Participación con registro 'iniciado' o 'incompleto' en una etapa que inicia en menos de 72 horas.",
    severity: "urgente",
    priority: "alta",
    assigned_role: "oficinas",
    kind: "registro",
  },
  {
    key: "installment_vencido",
    version: 2,
    name: "Mensualidad vencida",
    description: "Un cargo sigue sin cubrirse después de su fecha límite.",
    rule: "Cargo pendiente o parcial vencido, neto de asignaciones y descuentos. Bucket semanal.",
    severity: "atencion",
    priority: "alta",
    assigned_role: "oficinas",
    kind: "finanzas",
  },
  {
    key: "pago_no_identificado",
    version: 2,
    name: "Pago sin identificar",
    description: "Entró dinero que nadie ha asignado a un cargo.",
    rule: "Pago sin asignaciones después de 24 horas. Bucket semanal.",
    severity: "atencion",
    priority: "alta",
    assigned_role: "finanzas",
    kind: "finanzas",
  },
  {
    key: "llamada_staff_vencida",
    version: 2,
    name: "Llamada de staff vencida",
    description: "Una llamada de seguimiento esperada no se ha realizado.",
    rule: "Seguimiento con fecha esperada pasada y sin resultado. Bucket semanal. Se asigna al capitán.",
    severity: "atencion",
    priority: "media",
    assigned_role: "capitan",
    kind: "entrega",
  },
  {
    key: "primera_contribucion_sin_respuesta",
    version: 2,
    name: "Primera contribución sin respuesta",
    description: "La primera publicación de una persona en su generación lleva más de 24 horas sin respuesta.",
    rule: "Primer post de una persona en el espacio de su ciclo, con más de 24 horas y cero comentarios.",
    severity: "atencion",
    priority: "media",
    assigned_role: "oficinas",
    kind: "comunidad",
  },
] as const;

type RunResult = { created: number; skipped: number };

/** Bucket semanal ISO para condiciones persistentes: "2026-W31". */
function isoWeek(d = new Date()): string {
  const date = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
  const day = date.getUTCDay() || 7;
  date.setUTCDate(date.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  const week = Math.ceil(((date.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  return `${date.getUTCFullYear()}-W${String(week).padStart(2, "0")}`;
}

async function ensureDefinitions(service: Service) {
  const defs = new Map<string, string>();
  for (const d of DEFINITIONS) {
    const { data: existing } = await service
      .from("signal_definitions")
      .select("id")
      .eq("key", d.key)
      .eq("version", d.version)
      .maybeSingle();
    if (existing) {
      defs.set(d.key, existing.id);
      continue;
    }
    const { data: inserted, error } = await service
      .from("signal_definitions")
      .insert({
        key: d.key,
        version: d.version,
        name: d.name,
        description: d.description,
        rule: d.rule,
        severity: d.severity,
        assigned_role: d.assigned_role,
      })
      .select("id")
      .single();
    if (error) throw error;
    defs.set(d.key, inserted.id);
  }
  return defs;
}

async function createSignalWithCase(
  service: Service,
  args: {
    organizationId: string;
    definitionId: string;
    dedupeKey: string;
    explanation: string;
    evidence: Record<string, unknown>;
    caseTitle: string;
    caseKind: "finanzas" | "entrega" | "pase" | "registro" | "comunidad" | "operacion";
    priority: "alta" | "media" | "baja";
    assignedRole?: string;
    subjectPersonId?: string;
    stageParticipationId?: string;
    stageRunId?: string;
    cycleId?: string;
    dueInHours?: number;
  }
): Promise<boolean> {
  const { data: existing } = await service
    .from("signals")
    .select("id")
    .eq("dedupe_key", args.dedupeKey)
    .maybeSingle();
  if (existing) return false;

  const { data: caseRow, error: caseError } = await service
    .from("cases")
    .insert({
      organization_id: args.organizationId,
      kind: args.caseKind,
      subject_person_id: args.subjectPersonId,
      stage_run_id: args.stageRunId,
      cycle_id: args.cycleId,
      title: args.caseTitle,
      priority: args.priority,
      assigned_role: args.assignedRole ?? "oficinas",
      due_at: args.dueInHours
        ? new Date(Date.now() + args.dueInHours * 3600_000).toISOString()
        : null,
    })
    .select("id")
    .single();
  if (caseError) throw caseError;

  const { error: signalError } = await service.from("signals").insert({
    organization_id: args.organizationId,
    definition_id: args.definitionId,
    case_id: caseRow.id,
    subject_person_id: args.subjectPersonId,
    stage_participation_id: args.stageParticipationId,
    stage_run_id: args.stageRunId,
    dedupe_key: args.dedupeKey,
    explanation: args.explanation,
    evidence: args.evidence as never,
  });
  if (signalError) throw signalError;

  await emitDomainEvent(service, {
    organizationId: args.organizationId,
    name: "signal.created",
    subject: args.subjectPersonId
      ? { type: "person", id: args.subjectPersonId }
      : { type: "case", id: caseRow.id },
    scope: args.stageRunId ? { type: "stage_run", id: args.stageRunId } : undefined,
    properties: { dedupe_key: args.dedupeKey, kind: args.caseKind },
  });
  return true;
}

export async function runSignalEngine(
  service: Service,
  organizationId: string
): Promise<RunResult> {
  const defs = await ensureDefinitions(service);
  const week = isoWeek();
  const nowIso = new Date().toISOString();
  let created = 0;
  let skipped = 0;
  const track = (ok: boolean) => (ok ? created++ : skipped++);

  // Etapas relevantes: activas, recién completadas o por comenzar.
  const { data: runs } = await service
    .from("stage_runs")
    .select("id, cycle_id, stage, name, starts_on, ends_on, status")
    .eq("organization_id", organizationId)
    .in("status", ["planeada", "activa", "completada"]);
  const runById = new Map((runs ?? []).map((r) => [r.id, r]));

  // ── (a) Asistencia sin registrar + (b) ausencias en días de etapa ────────
  const { data: pastEvents } = await service
    .from("event_occurrences")
    .select("id, name, kind, stage_run_id, starts_at")
    .eq("organization_id", organizationId)
    .in("kind", ["dia_basico", "dia_avanzado", "hito_pl"])
    .lt("starts_at", nowIso)
    .gt("starts_at", new Date(Date.now() - 30 * 24 * 3600_000).toISOString());

  for (const event of pastEvents ?? []) {
    const run = event.stage_run_id ? runById.get(event.stage_run_id) : null;
    if (!run) continue;
    const { data: expectations } = await service
      .from("attendance_expectations")
      .select(
        "stage_participation_id, stage_participations(id, person_id, delivery_status, people(full_name, preferred_name))"
      )
      .eq("event_occurrence_id", event.id)
      .eq("expected", true);
    const { data: records } = await service
      .from("attendance_records")
      .select("stage_participation_id, status")
      .eq("event_occurrence_id", event.id);
    const recordBy = new Map((records ?? []).map((r) => [r.stage_participation_id, r.status]));

    // (a) sin registro — solo cuenta si la entrega sigue viva (retirados no)
    const unrecorded = (expectations ?? []).filter((e) => {
      const sp = e.stage_participations!;
      return !recordBy.has(e.stage_participation_id) && sp.delivery_status !== "retirado";
    });
    if (unrecorded.length > 0) {
      const names = unrecorded.map((e) => e.stage_participations!.people!.full_name);
      track(
        await createSignalWithCase(service, {
          organizationId,
          definitionId: defs.get("sin_registro_asistencia")!,
          dedupeKey: `sin_registro_asistencia:v2:${event.id}:${week}`,
          explanation: `«${event.name}» de ${run.name} terminó y ${names.length === 1 ? `${names[0]} sigue` : `${names.length} personas siguen`} sin registro de asistencia. Sin registro no hay métrica honesta. Fuente: expectativas vs registros del evento.`,
          evidence: { personas: names, evento: event.name },
          caseTitle: `Registrar asistencia de «${event.name}» · ${run.name}`,
          caseKind: "registro",
          priority: "media",
          stageRunId: run.id,
          cycleId: run.cycle_id,
          dueInHours: 24,
        })
      );
    }

    // (b) ausencias — persona por persona
    for (const e of expectations ?? []) {
      const sp = e.stage_participations!;
      if (recordBy.get(e.stage_participation_id) !== "ausente") continue;
      if (!["activo", "esperado", "completo"].includes(sp.delivery_status)) continue;
      const name = sp.people!.full_name;
      track(
        await createSignalWithCase(service, {
          organizationId,
          definitionId: defs.get("ausencia_dia_etapa")!,
          dedupeKey: `ausencia_dia_etapa:v2:${sp.id}:${event.id}`,
          explanation: `${name} faltó a «${event.name}» de ${run.name}. En una etapa corta cada día es parte del proceso. Fuente: registro de asistencia del evento.`,
          evidence: { evento: event.name, etapa: run.name },
          caseTitle: `${name} faltó a «${event.name}»`,
          caseKind: "entrega",
          priority: "alta",
          subjectPersonId: sp.person_id,
          stageParticipationId: sp.id,
          stageRunId: run.id,
          cycleId: run.cycle_id,
          dueInHours: 24,
        })
      );
    }
  }

  // ── (c) Pase aceptado sin inscripción ────────────────────────────────────
  const { data: acceptedPasses } = await service
    .from("continuity_passes")
    .select(
      "id, decided_at, to_stage_run_id, from_participation_id, stage_participations!continuity_passes_from_participation_id_fkey(person_id, stage_run_id, people(full_name))"
    )
    .eq("organization_id", organizationId)
    .eq("pass_status", "aceptado")
    .eq("next_status", "sin_intencion");

  for (const pass of acceptedPasses ?? []) {
    const decidedHours = pass.decided_at
      ? (Date.now() - new Date(pass.decided_at).getTime()) / 3600_000
      : Infinity;
    if (decidedHours < 48) continue;
    const sp = pass.stage_participations!;
    const name = sp.people!.full_name;
    const target = pass.to_stage_run_id ? runById.get(pass.to_stage_run_id) : null;
    track(
      await createSignalWithCase(service, {
        organizationId,
        definitionId: defs.get("pase_aceptado_sin_inscripcion")!,
        dedupeKey: `pase_aceptado_sin_inscripcion:v2:${pass.id}:${week}`,
        explanation: `${name} aceptó continuar${target ? ` al ${target.name}` : ""} hace ${Math.floor(decidedHours / 24)} días y su inscripción no se ha concretado. La ventana entre etapas es corta. Fuente: registro del pase.`,
        evidence: { pase_id: pass.id, dias_desde_decision: Math.floor(decidedHours / 24) },
        caseTitle: `Concretar inscripción de ${name}${target ? ` · ${target.name}` : ""}`,
        caseKind: "pase",
        priority: "alta",
        subjectPersonId: sp.person_id,
        stageParticipationId: pass.from_participation_id,
        stageRunId: pass.to_stage_run_id ?? sp.stage_run_id,
        dueInHours: 24,
      })
    );
  }

  // ── (d) Registro incompleto con etapa por comenzar ───────────────────────
  const soonRuns = (runs ?? []).filter((r) => {
    const start = new Date(r.starts_on + "T00:00:00");
    const hours = (start.getTime() - Date.now()) / 3600_000;
    return hours > 0 && hours < 24 * 8;
  });
  for (const run of soonRuns) {
    const { data: incomplete } = await service
      .from("stage_participations")
      .select("id, person_id, registration_status, people(full_name)")
      .eq("stage_run_id", run.id)
      .in("registration_status", ["iniciado", "incompleto"]);
    for (const sp of incomplete ?? []) {
      const name = sp.people!.full_name;
      track(
        await createSignalWithCase(service, {
          organizationId,
          definitionId: defs.get("registro_incompleto_etapa")!,
          dedupeKey: `registro_incompleto_etapa:v2:${sp.id}:${week}`,
          explanation: `${run.name} inicia el ${new Date(run.starts_on + "T00:00:00").toLocaleDateString("es-MX", { day: "numeric", month: "long" })} y el registro de ${name} sigue ${sp.registration_status === "iniciado" ? "sin completar" : "incompleto"}. Fuente: plano de registro de la participación.`,
          evidence: { etapa: run.name, estado_registro: sp.registration_status },
          caseTitle: `Completar registro de ${name} · ${run.name}`,
          caseKind: "registro",
          priority: "alta",
          subjectPersonId: sp.person_id,
          stageParticipationId: sp.id,
          stageRunId: run.id,
          cycleId: run.cycle_id,
          dueInHours: 24,
        })
      );
    }
  }

  // ── (e) Mensualidad / cargo vencido (neto de asignaciones y descuentos) ──
  const today = new Date().toISOString().slice(0, 10);
  const { data: overdue } = await service
    .from("charges")
    .select(
      "id, person_id, stage_participation_id, concept, amount_cents, currency, due_on, people(full_name), payment_allocations(amount_cents), discounts(amount_cents)"
    )
    .eq("organization_id", organizationId)
    .in("status", ["pendiente", "parcial"])
    .lt("due_on", today);

  for (const charge of overdue ?? []) {
    const allocated = (charge.payment_allocations ?? []).reduce((s, a) => s + a.amount_cents, 0);
    const discounted = (charge.discounts ?? []).reduce((s, d) => s + d.amount_cents, 0);
    const rest = charge.amount_cents - allocated - discounted;
    if (rest <= 0) continue;
    const name = charge.people?.full_name ?? "Persona sin identificar";
    const daysLate = Math.floor(
      (Date.now() - new Date(charge.due_on + "T00:00:00").getTime()) / (24 * 3600_000)
    );
    track(
      await createSignalWithCase(service, {
        organizationId,
        definitionId: defs.get("installment_vencido")!,
        dedupeKey: `installment_vencido:v2:${charge.id}:${week}`,
        explanation: `El cargo «${charge.concept}» de ${name} venció hace ${daysLate} días; queda por cubrir ${(rest / 100).toLocaleString("es-MX", { style: "currency", currency: charge.currency.trim() })}. Fuente: ledger (cargo − asignaciones − descuentos).`,
        evidence: { cargo: charge.concept, restante_cents: rest, dias_vencido: daysLate, moneda: charge.currency.trim() },
        caseTitle: `Cargo vencido de ${name}`,
        caseKind: "finanzas",
        priority: "alta",
        subjectPersonId: charge.person_id ?? undefined,
        stageParticipationId: charge.stage_participation_id ?? undefined,
        dueInHours: 48,
      })
    );
  }

  // ── (f) Pago sin identificar ─────────────────────────────────────────────
  const { data: allPays } = await service
    .from("payments")
    .select("id, amount_cents, currency, method, reference, paid_at, payment_allocations(amount_cents)")
    .eq("organization_id", organizationId)
    .lt("paid_at", new Date(Date.now() - 24 * 3600_000).toISOString());
  for (const pay of allPays ?? []) {
    if ((pay.payment_allocations ?? []).length > 0) continue;
    track(
      await createSignalWithCase(service, {
        organizationId,
        definitionId: defs.get("pago_no_identificado")!,
        dedupeKey: `pago_no_identificado:v2:${pay.id}:${week}`,
        explanation: `Hay ${(pay.amount_cents / 100).toLocaleString("es-MX", { style: "currency", currency: pay.currency.trim() })} recibidos por ${pay.method}${pay.reference ? ` (ref. ${pay.reference})` : ""} sin asignar a ningún cargo. El dinero sin identificar no es ingreso certificado. Fuente: pagos sin asignaciones.`,
        evidence: { pago_id: pay.id, monto_cents: pay.amount_cents, referencia: pay.reference },
        caseTitle: `Identificar pago de ${(pay.amount_cents / 100).toLocaleString("es-MX", { style: "currency", currency: pay.currency.trim() })}`,
        caseKind: "finanzas",
        priority: "alta",
        assignedRole: "finanzas",
        dueInHours: 48,
      })
    );
  }

  // ── (g) Llamada de staff vencida ─────────────────────────────────────────
  const { data: lateCalls } = await service
    .from("follow_up_interactions")
    .select(
      "id, expected_on, staff_person_id, stage_participation_id, stage_participations(person_id, stage_run_id, people(full_name))"
    )
    .eq("organization_id", organizationId)
    .is("done_at", null)
    .lt("expected_on", today);
  for (const call of lateCalls ?? []) {
    const sp = call.stage_participations!;
    const { data: staff } = await service
      .from("people")
      .select("full_name")
      .eq("id", call.staff_person_id)
      .single();
    const name = sp.people!.full_name;
    const run = runById.get(sp.stage_run_id);
    track(
      await createSignalWithCase(service, {
        organizationId,
        definitionId: defs.get("llamada_staff_vencida")!,
        dedupeKey: `llamada_staff_vencida:v2:${call.id}:${week}`,
        explanation: `La llamada de ${staff?.full_name ?? "staff"} a ${name}${run ? ` (${run.name})` : ""} estaba esperada para el ${new Date(call.expected_on + "T00:00:00").toLocaleDateString("es-MX", { day: "numeric", month: "long" })} y no tiene resultado registrado. Fuente: seguimiento de staff.`,
        evidence: { llamada_id: call.id, staff: staff?.full_name, esperada: call.expected_on },
        caseTitle: `Llamada pendiente: ${staff?.full_name ?? "staff"} → ${name}`,
        caseKind: "entrega",
        priority: "media",
        assignedRole: "capitan",
        subjectPersonId: sp.person_id,
        stageParticipationId: call.stage_participation_id,
        stageRunId: sp.stage_run_id,
        dueInHours: 24,
      })
    );
  }

  // ── (h) Primera contribución sin respuesta (por ciclo) ───────────────────
  // El espacio ES la audiencia: se recorren todos los espacios del centro,
  // no solo las generaciones — una primera contribución en el círculo de
  // alumni merece la misma bienvenida.
  const { data: spaces } = await service
    .from("spaces")
    .select("id, name, cycle_id")
    .eq("organization_id", organizationId)
    .is("archived_at", null);
  for (const cycle of spaces ?? []) {
    const { data: posts } = await service
      .from("posts")
      .select("id, author_person_id, created_at, people(full_name)")
      .eq("space_id", cycle.id)
      .is("deleted_at", null)
      .order("created_at", { ascending: true });
    const firstPostBy = new Map<string, NonNullable<typeof posts>[number]>();
    for (const post of posts ?? []) {
      if (!firstPostBy.has(post.author_person_id)) firstPostBy.set(post.author_person_id, post);
    }
    for (const post of firstPostBy.values()) {
      const ageHours = (Date.now() - new Date(post.created_at).getTime()) / 3600_000;
      if (ageHours < 24) continue;
      const { count } = await service
        .from("comments")
        .select("id", { count: "exact", head: true })
        .eq("post_id", post.id);
      if ((count ?? 0) > 0) continue;
      const name = post.people!.full_name;
      track(
        await createSignalWithCase(service, {
          organizationId,
          definitionId: defs.get("primera_contribucion_sin_respuesta")!,
          dedupeKey: `primera_contribucion_sin_respuesta:v2:${post.id}`,
          explanation: `La primera publicación de ${name} en ${cycle.name} lleva ${Math.floor(ageHours)} horas sin respuesta. Toda primera contribución merece una bienvenida. Fuente: conversación del ciclo.`,
          evidence: { post_id: post.id, horas: Math.floor(ageHours) },
          caseTitle: `Responder la primera publicación de ${name}`,
          caseKind: "comunidad",
          priority: "media",
          subjectPersonId: post.author_person_id,
          cycleId: cycle.cycle_id ?? undefined,
          dueInHours: 12,
        })
      );
    }
  }

  return { created, skipped };
}
