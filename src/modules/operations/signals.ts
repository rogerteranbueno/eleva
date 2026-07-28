import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/database.types";
import { emitDomainEvent } from "@/lib/audit";

type Service = SupabaseClient<Database>;

/**
 * Motor de señales v1 — determinista, versionado e idempotente.
 * Una señal es evidencia observable, no un diagnóstico. Cada señal explica
 * su regla y su fuente, y crea (o se suma a) un caso asignado por política.
 *
 * Canon de roles: el seguimiento entre sesiones pertenece a Oficinas.
 */

const DEFINITIONS = [
  {
    key: "ausencias_consecutivas",
    version: 1,
    name: "Ausencias consecutivas",
    description: "La persona faltó a sus últimas sesiones sin justificar.",
    rule: "2 o más ausencias consecutivas en las sesiones ya realizadas de una generación activa.",
    severity: "urgente",
    priority: "alta",
  },
  {
    key: "pago_vencido",
    version: 1,
    name: "Pago vencido",
    description: "Un cargo sigue sin cubrirse después de su fecha límite.",
    rule: "Cargo con estado pendiente o parcial cuya fecha de vencimiento pasó hace más de 7 días.",
    severity: "atencion",
    priority: "alta",
  },
  {
    key: "evento_sin_confirmacion",
    version: 1,
    name: "Evento sin confirmar",
    description: "Participantes activos aún no responden a un evento próximo.",
    rule: "Evento de generación que inicia en menos de 72 horas con participantes activos sin RSVP.",
    severity: "atencion",
    priority: "media",
  },
  {
    key: "registro_incompleto",
    version: 1,
    name: "Registro incompleto",
    description: "Faltan datos de contacto básicos de la persona.",
    rule: "Participación activa cuya persona no tiene teléfono o email registrado.",
    severity: "info",
    priority: "baja",
  },
  {
    key: "primera_contribucion_sin_respuesta",
    version: 1,
    name: "Primera contribución sin respuesta",
    description:
      "La primera publicación de una persona en su generación lleva más de 24 horas sin respuesta.",
    rule: "Primer post de una persona en el espacio de su generación, con más de 24 horas y cero comentarios.",
    severity: "atencion",
    priority: "media",
  },
] as const;

type RunResult = { created: number; skipped: number };

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
        assigned_role: "oficinas",
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
    priority: "alta" | "media" | "baja";
    subjectPersonId?: string;
    participationId?: string;
    cohortId?: string;
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
      subject_person_id: args.subjectPersonId,
      cohort_id: args.cohortId,
      title: args.caseTitle,
      priority: args.priority,
      assigned_role: "oficinas",
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
    participation_id: args.participationId,
    cohort_id: args.cohortId,
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
    scope: args.cohortId ? { type: "cohort", id: args.cohortId } : undefined,
    properties: { dedupe_key: args.dedupeKey },
  });
  return true;
}

export async function runSignalEngine(
  service: Service,
  organizationId: string
): Promise<RunResult> {
  const defs = await ensureDefinitions(service);
  let created = 0;
  let skipped = 0;
  const track = (ok: boolean) => (ok ? created++ : skipped++);

  const { data: cohorts } = await service
    .from("cohorts")
    .select("id, name")
    .eq("organization_id", organizationId)
    .eq("status", "activa");

  for (const cohort of cohorts ?? []) {
    // --- (a) Ausencias consecutivas -------------------------------------
    const { data: sessions } = await service
      .from("sessions")
      .select("id, name, sequence, starts_at")
      .eq("cohort_id", cohort.id)
      .lt("starts_at", new Date().toISOString())
      .order("sequence", { ascending: true });
    const pastSessions = sessions ?? [];

    const { data: participations } = await service
      .from("participations")
      .select("id, person_id, state, people(full_name, preferred_name, email, phone)")
      .eq("cohort_id", cohort.id)
      .in("state", ["confirmado", "activo"]);

    const { data: attendance } = await service
      .from("attendance_records")
      .select("participation_id, session_id, status")
      .in("session_id", pastSessions.map((s) => s.id));
    const attendanceBy = new Map<string, Map<string, string>>();
    for (const a of attendance ?? []) {
      if (!attendanceBy.has(a.participation_id))
        attendanceBy.set(a.participation_id, new Map());
      attendanceBy.get(a.participation_id)!.set(a.session_id, a.status);
    }

    for (const pa of participations ?? []) {
      const person = pa.people!;
      const name = person.full_name;

      // racha de ausencias al final de la serie de sesiones pasadas
      let streak = 0;
      const missed: string[] = [];
      for (let i = pastSessions.length - 1; i >= 0; i--) {
        const status = attendanceBy.get(pa.id)?.get(pastSessions[i].id);
        if (status === "ausente") {
          streak++;
          missed.unshift(pastSessions[i].name);
        } else {
          break;
        }
      }
      if (streak >= 2) {
        const lastSession = pastSessions[pastSessions.length - 1];
        track(
          await createSignalWithCase(service, {
            organizationId,
            definitionId: defs.get("ausencias_consecutivas")!,
            dedupeKey: `ausencias_consecutivas:v1:${pa.id}:${lastSession.id}`,
            explanation: `${name} faltó a ${missed.join(" y ")} (${streak} sesiones seguidas). Fuente: registro de asistencia de ${cohort.name}.`,
            evidence: { sesiones: missed, racha: streak },
            caseTitle: `${name} lleva ${streak} ausencias seguidas`,
            priority: "alta",
            subjectPersonId: pa.person_id,
            participationId: pa.id,
            cohortId: cohort.id,
            dueInHours: 24,
          })
        );
      }

      // --- (d) Registro incompleto --------------------------------------
      if (!person.phone || !person.email) {
        const missing = [
          !person.phone ? "teléfono" : null,
          !person.email ? "email" : null,
        ]
          .filter(Boolean)
          .join(" y ");
        track(
          await createSignalWithCase(service, {
            organizationId,
            definitionId: defs.get("registro_incompleto")!,
            dedupeKey: `registro_incompleto:v1:${pa.id}`,
            explanation: `El registro de ${name} no tiene ${missing}. Fuente: expediente de la persona.`,
            evidence: { faltante: missing },
            caseTitle: `Completar datos de contacto de ${name}`,
            priority: "baja",
            subjectPersonId: pa.person_id,
            participationId: pa.id,
            cohortId: cohort.id,
          })
        );
      }
    }

    // --- (c) Evento sin confirmación (un caso por evento) ----------------
    const { data: upcoming } = await service
      .from("events")
      .select("id, title, starts_at")
      .eq("cohort_id", cohort.id)
      .gt("starts_at", new Date().toISOString())
      .lt("starts_at", new Date(Date.now() + 72 * 3600_000).toISOString());

    for (const event of upcoming ?? []) {
      const { data: rsvps } = await service
        .from("rsvps")
        .select("person_id")
        .eq("event_id", event.id);
      const responded = new Set((rsvps ?? []).map((r) => r.person_id));
      const pending = (participations ?? []).filter(
        (pa) => !responded.has(pa.person_id)
      );
      if (pending.length === 0) continue;
      const names = pending.map((pa) => pa.people!.full_name);
      track(
        await createSignalWithCase(service, {
          organizationId,
          definitionId: defs.get("evento_sin_confirmacion")!,
          dedupeKey: `evento_sin_confirmacion:v1:${event.id}`,
          explanation: `${names.length} participantes de ${cohort.name} no han respondido a «${event.title}». Fuente: confirmaciones del evento.`,
          evidence: { personas: names, evento: event.title },
          caseTitle: `${names.length} sin confirmar «${event.title}»`,
          priority: "media",
          cohortId: cohort.id,
          dueInHours: 48,
        })
      );
    }

    // --- (e) Primera contribución sin respuesta --------------------------
    const { data: posts } = await service
      .from("posts")
      .select("id, author_person_id, created_at, kind, people(full_name)")
      .eq("cohort_id", cohort.id)
      .order("created_at", { ascending: true });
    const firstPostBy = new Map<string, (typeof posts extends (infer T)[] | null ? T : never)>();
    for (const post of posts ?? []) {
      if (!firstPostBy.has(post.author_person_id))
        firstPostBy.set(post.author_person_id, post);
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
          dedupeKey: `primera_contribucion_sin_respuesta:v1:${post.id}`,
          explanation: `La primera publicación de ${name} en ${cohort.name} lleva ${Math.floor(ageHours)} horas sin respuesta. Toda primera contribución merece una bienvenida. Fuente: conversación de la generación.`,
          evidence: { post_id: post.id, horas: Math.floor(ageHours) },
          caseTitle: `Responder la primera publicación de ${name}`,
          priority: "media",
          subjectPersonId: post.author_person_id,
          cohortId: cohort.id,
          dueInHours: 12,
        })
      );
    }
  }

  // --- (b) Pago vencido (independiente de generación) ---------------------
  const cutoff = new Date(Date.now() - 7 * 24 * 3600_000)
    .toISOString()
    .slice(0, 10);
  const { data: overdue } = await service
    .from("charges")
    .select("id, person_id, participation_id, concept, amount_cents, currency, due_on, status, people(full_name)")
    .eq("organization_id", organizationId)
    .in("status", ["pendiente", "parcial"])
    .lt("due_on", cutoff);

  for (const charge of overdue ?? []) {
    const { data: pays } = await service
      .from("payments")
      .select("amount_cents")
      .eq("charge_id", charge.id);
    const paid = (pays ?? []).reduce((s, p) => s + p.amount_cents, 0);
    const rest = charge.amount_cents - paid;
    const name = charge.people!.full_name;
    const daysLate = Math.floor(
      (Date.now() - new Date(charge.due_on).getTime()) / (24 * 3600_000)
    );
    track(
      await createSignalWithCase(service, {
        organizationId,
        definitionId: defs.get("pago_vencido")!,
        dedupeKey: `pago_vencido:v1:${charge.id}`,
        explanation: `El cargo «${charge.concept}» de ${name} venció hace ${daysLate} días; queda por cubrir ${(rest / 100).toLocaleString("es-MX", { style: "currency", currency: charge.currency.trim() })}. Fuente: cargos y pagos registrados.`,
        evidence: {
          cargo: charge.concept,
          restante_cents: rest,
          dias_vencido: daysLate,
        },
        caseTitle: `Pago vencido de ${name}`,
        priority: "alta",
        subjectPersonId: charge.person_id,
        participationId: charge.participation_id ?? undefined,
        dueInHours: 48,
      })
    );
  }

  return { created, skipped };
}
