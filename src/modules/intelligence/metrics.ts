import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/database.types";
import { money } from "@/lib/format";

type Service = SupabaseClient<Database>;

export type MetricState = "reconciliado" | "provisional" | "estimado";

export type Metric = {
  id: string;
  name: string;
  value: string;
  detail?: string;
  comparison?: string;
  definition: string;
  state: MetricState;
  stateNote?: string;
  source: string;
  drill: { label: string; href?: string }[];
};

/** Suma por moneda → "$120,000 MXN · $600 USD". Las monedas JAMÁS se suman entre sí. */
function byCurrency(rows: { amount_cents: number; currency: string }[]): string {
  const totals = new Map<string, number>();
  for (const r of rows) {
    const cur = r.currency.trim();
    totals.set(cur, (totals.get(cur) ?? 0) + r.amount_cents);
  }
  if (totals.size === 0) return "—";
  return [...totals.entries()]
    .sort(([a], [b]) => (a === "MXN" ? -1 : a.localeCompare(b)))
    .map(([cur, cents]) => money(cents, cur))
    .join(" · ");
}

/**
 * Métricas certificadas v2 del Pulso, sobre el dominio canónico.
 * Reglas duras: la asistencia se divide entre lo ESPERADO (el faltante es
 * "sin registro", nunca desaparece); el cash solo cuenta pagos CONFIRMADOS
 * netos del ledger; las monedas no se mezclan; el pase se mide por paso.
 */
export async function computePulse(
  service: Service,
  organizationId: string
): Promise<{ metrics: Metric[]; integrity: string[] }> {
  const metrics: Metric[] = [];
  const integrity: string[] = [];
  const now = Date.now();
  const nowIso = new Date(now).toISOString();
  const today = nowIso.slice(0, 10);

  const { data: cycles } = await service
    .from("generation_cycles")
    .select("id, name, status, stage_runs(id, stage, name, starts_on, ends_on, capacity, status)")
    .eq("organization_id", organizationId)
    .in("status", ["activa", "planeada"]);
  const activeCycles = (cycles ?? []).filter((c) => c.status === "activa");
  const allRuns = (cycles ?? []).flatMap((c) =>
    (c.stage_runs ?? []).map((r) => ({ ...r, cycleId: c.id, cycleName: c.name }))
  );

  // ── Asistencia contra lo esperado (14 días) ────────────────────────────────
  {
    const since = new Date(now - 14 * 24 * 3600_000).toISOString();
    const { data: events } = await service
      .from("event_occurrences")
      .select("id, name, stage_run_id")
      .eq("organization_id", organizationId)
      .in("kind", ["dia_basico", "dia_avanzado", "hito_pl", "graduacion"])
      .gte("starts_at", since)
      .lt("starts_at", nowIso);
    const eventIds = (events ?? []).map((e) => e.id);

    let expected = 0;
    let present = 0;
    let unrecorded = 0;
    if (eventIds.length > 0) {
      const [{ data: exps }, { data: recs }] = await Promise.all([
        service
          .from("attendance_expectations")
          .select("event_occurrence_id, stage_participation_id")
          .in("event_occurrence_id", eventIds)
          .eq("expected", true),
        service
          .from("attendance_records")
          .select("event_occurrence_id, stage_participation_id, status")
          .in("event_occurrence_id", eventIds),
      ]);
      const recBy = new Map(
        (recs ?? []).map((r) => [`${r.event_occurrence_id}:${r.stage_participation_id}`, r.status])
      );
      expected = (exps ?? []).length;
      for (const e of exps ?? []) {
        const st = recBy.get(`${e.event_occurrence_id}:${e.stage_participation_id}`);
        if (!st) unrecorded++;
        else if (["presente", "tarde"].includes(st)) present++;
      }
    }
    if (unrecorded > 0) {
      integrity.push(
        `${unrecorded} asistencias esperadas siguen sin registro: la métrica de asistencia es provisional hasta registrarlas.`
      );
    }
    metrics.push({
      id: "show_rate",
      name: "Asistencia",
      value: expected > 0 ? `${Math.round((present / expected) * 100)}%` : "—",
      detail:
        expected > 0
          ? `${present} presentes de ${expected} esperados · ${unrecorded} sin registro`
          : "sin días de etapa en 14 días",
      definition:
        "Presentes y llegadas tarde ÷ asistencias ESPERADAS en días de etapa de los últimos 14 días. El faltante cuenta como 'sin registro' en el denominador: nunca desaparece.",
      state: unrecorded > 0 ? "provisional" : "reconciliado",
      stateNote: unrecorded > 0 ? `${unrecorded} esperados sin registro` : undefined,
      source: "Expectativas y registros de asistencia por evento",
      drill: [...new Set((events ?? []).map((e) => e.stage_run_id))].map((rid) => {
        const run = allRuns.find((r) => r.id === rid);
        return { label: run?.name ?? "Etapa", href: run ? `/generaciones/${run.cycleId}` : undefined };
      }),
    });
  }

  // ── Cobrado confirmado (30 días, por moneda) ──────────────────────────────
  {
    const since = new Date(now - 30 * 24 * 3600_000).toISOString();
    const { data: pays } = await service
      .from("payments")
      .select("id, amount_cents, currency, confirmed, person_id, reconciliation_batch_id, payment_allocations(amount_cents), people:person_id(full_name)")
      .eq("organization_id", organizationId)
      .gte("paid_at", since);
    const rows = pays ?? [];
    const confirmed = rows.filter((p) => p.confirmed);
    const unconfirmed = rows.filter((p) => !p.confirmed);
    const unidentified = rows.filter((p) => (p.payment_allocations ?? []).length === 0);
    if (unconfirmed.length > 0) {
      integrity.push(
        `${unconfirmed.length} pagos por ${byCurrency(unconfirmed)} siguen sin confirmar evidencia: cuentan como provisionales, no como cobrado.`
      );
    }
    if (unidentified.length > 0) {
      integrity.push(
        `${unidentified.length} pago(s) por ${byCurrency(unidentified)} sin asignar a ningún cargo (dinero sin identificar).`
      );
    }
    metrics.push({
      id: "cash_collected",
      name: "Cobrado (30 días)",
      value: byCurrency(confirmed),
      detail: `${confirmed.length} pagos confirmados${unconfirmed.length ? ` · ${unconfirmed.length} por confirmar` : ""}`,
      definition:
        "Suma de pagos CONFIRMADOS de los últimos 30 días, por moneda (las monedas no se suman entre sí). Es dinero cobrado, no ingreso contratado ni devengado.",
      state: unconfirmed.length > 0 || unidentified.length > 0 ? "provisional" : "reconciliado",
      stateNote:
        unconfirmed.length > 0
          ? `${unconfirmed.length} pagos sin confirmar`
          : unidentified.length > 0
            ? `${unidentified.length} sin identificar`
            : undefined,
      source: "Ledger: pagos confirmados y sus asignaciones",
      drill: [
        ...unidentified.slice(0, 3).map((p) => ({
          label: `Sin identificar · ${money(p.amount_cents, p.currency.trim())}`,
          href: "/finanzas",
        })),
        { label: "Ver finanzas", href: "/finanzas" },
      ],
    });
  }

  // ── Vencido por cobrar (neto, por moneda) ─────────────────────────────────
  {
    const { data: charges } = await service
      .from("charges")
      .select(
        "id, amount_cents, currency, due_on, person_id, people(full_name), payment_allocations(amount_cents), discounts(amount_cents)"
      )
      .eq("organization_id", organizationId)
      .in("status", ["pendiente", "parcial"])
      .lt("due_on", today);
    const rows = (charges ?? [])
      .map((c) => {
        const allocated = (c.payment_allocations ?? []).reduce((s, a) => s + a.amount_cents, 0);
        const discounted = (c.discounts ?? []).reduce((s, d) => s + d.amount_cents, 0);
        return { ...c, rest: c.amount_cents - allocated - discounted };
      })
      .filter((c) => c.rest > 0);
    metrics.push({
      id: "receivable",
      name: "Vencido por cobrar",
      value: byCurrency(rows.map((r) => ({ amount_cents: r.rest, currency: r.currency }))),
      detail: `${rows.length} cargos vencidos`,
      definition:
        "Cargos vencidos a hoy, netos de asignaciones de pago y descuentos aprobados, por moneda. No incluye cargos con vencimiento futuro.",
      state: "reconciliado",
      source: "Ledger: cargos − asignaciones − descuentos",
      drill: rows
        .sort((a, b) => b.rest - a.rest)
        .slice(0, 6)
        .map((c) => ({
          label: `${c.people?.full_name ?? "Sin persona"} · ${money(c.rest, c.currency.trim())} · venció ${c.due_on}`,
          href: c.person_id ? `/personas/${c.person_id}` : "/finanzas",
        })),
    });
  }

  // ── Funnel del pase (última ventana Básico→Avanzado) ──────────────────────
  {
    const lastBasico = allRuns
      .filter((r) => r.stage === "basico" && r.status === "completada")
      .sort((a, b) => b.ends_on.localeCompare(a.ends_on))[0];
    if (lastBasico) {
      const { data: passes } = await service
        .from("continuity_passes")
        .select(
          "pass_status, next_status, stage_participations!continuity_passes_from_participation_id_fkey!inner(stage_run_id, person_id, people(full_name))"
        )
        .eq("organization_id", organizationId)
        .eq("stage_participations.stage_run_id", lastBasico.id);
      const rows = passes ?? [];
      const n = (f: (p: (typeof rows)[number]) => boolean) => rows.filter(f).length;
      const elegibles = n((p) => p.pass_status !== "no_evaluado");
      const conversados = n((p) => !["no_evaluado", "elegible"].includes(p.pass_status));
      const aceptados = n((p) => p.pass_status === "aceptado");
      const inscritos = n((p) => ["inscrito", "iniciado"].includes(p.next_status));
      const cola = n((p) => p.pass_status === "aceptado" && p.next_status === "sin_intencion");
      metrics.push({
        id: "pass_funnel",
        name: `Pase · ${lastBasico.name} → Avanzado`,
        value: elegibles > 0 ? `${Math.round((inscritos / elegibles) * 100)}%` : "—",
        detail: `${elegibles} elegibles → ${conversados} conversados → ${aceptados} aceptados → ${inscritos} inscritos`,
        comparison: cola > 0 ? `${cola} aceptado(s) sin inscribir: la cola de la ventana` : undefined,
        definition:
          "Personas inscritas a la siguiente etapa ÷ elegibles evaluados del último Básico completado. Cada paso del pase (elegible → conversado → aceptado → inscrito) es medible por separado.",
        state: "reconciliado",
        source: "Registro del pase (continuity_passes) con marca de tiempo por paso",
        drill: [{ label: `Ver la ventana de ${lastBasico.cycleName}`, href: `/generaciones/${lastBasico.cycleId}` }],
      });
    }
  }

  // ── Ocupación del siguiente Básico ────────────────────────────────────────
  {
    const nextBasico = allRuns
      .filter((r) => r.stage === "basico" && r.status === "planeada" && r.starts_on > today)
      .sort((a, b) => a.starts_on.localeCompare(b.starts_on))[0];
    if (nextBasico) {
      const [{ data: parts }, { data: prospects }] = await Promise.all([
        service
          .from("stage_participations")
          .select("id, registration_status")
          .eq("stage_run_id", nextBasico.id),
        service
          .from("prospects")
          .select("id, crm_status")
          .eq("target_stage_run_id", nextBasico.id)
          .not("crm_status", "in", "(perdido,convertido)"),
      ]);
      // Atribuciones de enrolamiento sobre los prospectos de este Básico.
      let attributed = 0;
      const prospectIds = (prospects ?? []).map((p) => p.id);
      if (prospectIds.length > 0) {
        const { count } = await service
          .from("enrollment_attributions")
          .select("id", { count: "exact", head: true })
          .in("prospect_id", prospectIds);
        attributed = count ?? 0;
      }
      const confirmados = (parts ?? []).filter((p) => p.registration_status === "confirmado").length;
      const enProceso = (parts ?? []).filter((p) =>
        ["iniciado", "incompleto", "invitado"].includes(p.registration_status)
      ).length;
      const cap = nextBasico.capacity ?? 0;
      metrics.push({
        id: "next_basico",
        name: `Ocupación · ${nextBasico.name}`,
        value: cap > 0 ? `${Math.round((confirmados / cap) * 100)}%` : `${confirmados}`,
        detail: `${confirmados} confirmados de ${cap} lugares · ${enProceso} registros en proceso · ${(prospects ?? []).length} prospectos activos`,
        comparison:
          attributed > 0 ? `${attributed} llegan por enrolamiento (PL y staff)` : undefined,
        definition:
          "Registros confirmados ÷ capacidad del siguiente Básico planeado. El pipeline (prospectos y registros en proceso) se reporta aparte, nunca inflado como inscritos.",
        state: "reconciliado",
        source: "Plano de registro + CRM de prospectos + atribuciones de enrolamiento",
        drill: [{ label: "Ver CRM", href: "/crm" }],
      });
    }
  }

  // ── Señales atendidas <24h ────────────────────────────────────────────────
  {
    const since = new Date(now - 7 * 24 * 3600_000).toISOString();
    const { data: signals } = await service
      .from("signals")
      .select("detected_at, reviewed_at, status")
      .eq("organization_id", organizationId)
      .gte("detected_at", since);
    const rows = signals ?? [];
    const reviewed = rows.filter(
      (s) =>
        s.reviewed_at &&
        new Date(s.reviewed_at).getTime() - new Date(s.detected_at).getTime() <= 24 * 3600_000
    );
    metrics.push({
      id: "signal_sla",
      name: "Señales atendidas en 24 h",
      value: rows.length > 0 ? `${Math.round((reviewed.length / rows.length) * 100)}%` : "—",
      detail: `${reviewed.length} de ${rows.length} señales de los últimos 7 días`,
      definition:
        "Señales cuya revisión (intervención registrada o descarte con motivo) ocurrió dentro de las 24 horas posteriores a su detección, sobre las señales detectadas en 7 días.",
      state: "reconciliado",
      source: "Motor de señales y registro de intervenciones",
      drill: [{ label: "Ver cola de hoy", href: "/hoy" }],
    });
  }

  // ── Cobertura de seguimiento (llamadas de staff, 7 días) ──────────────────
  {
    const since = new Date(now - 7 * 24 * 3600_000).toISOString().slice(0, 10);
    const { data: calls } = await service
      .from("follow_up_interactions")
      .select("id, done_at, expected_on")
      .eq("organization_id", organizationId)
      .gte("expected_on", since)
      .lte("expected_on", today);
    const rows = calls ?? [];
    const done = rows.filter((c) => c.done_at).length;
    if (rows.length > 0) {
      metrics.push({
        id: "follow_up_coverage",
        name: "Cobertura de seguimiento",
        value: `${Math.round((done / rows.length) * 100)}%`,
        detail: `${done} de ${rows.length} llamadas esperadas esta semana ya tienen resultado`,
        definition:
          "Llamadas de staff con resultado registrado ÷ llamadas esperadas de los últimos 7 días. Mide la cobertura del acompañamiento, no juzga a nadie.",
        state: "reconciliado",
        source: "Seguimiento de staff (llamadas esperadas vs realizadas)",
        drill: [{ label: "Ver cobertura", href: "/cobertura" }],
      });
    }
  }

  // ── Activación post-etapa (48 h) ──────────────────────────────────────────
  {
    let activated = 0;
    let total = 0;
    const details: string[] = [];
    for (const cycle of activeCycles) {
      const lastDone = (cycle.stage_runs ?? [])
        .filter((r) => r.status === "completada")
        .sort((a, b) => b.ends_on.localeCompare(a.ends_on))[0];
      if (!lastDone) continue;
      const windowStart = new Date(lastDone.ends_on + "T00:00:00").toISOString();
      const windowEnd = new Date(
        new Date(lastDone.ends_on + "T23:59:59").getTime() + 48 * 3600_000
      ).toISOString();
      const { data: parts } = await service
        .from("stage_participations")
        .select("person_id")
        .eq("stage_run_id", lastDone.id)
        .eq("delivery_status", "completo");
      const personIds = (parts ?? []).map((p) => p.person_id);
      if (personIds.length === 0) continue;
      const [posts, comments, reactions] = await Promise.all([
        service
          .from("posts")
          .select("author_person_id, spaces!inner(cycle_id)")
          .eq("spaces.cycle_id", cycle.id)
          .in("author_person_id", personIds)
          .gte("created_at", windowStart)
          .lte("created_at", windowEnd),
        service
          .from("comments")
          .select("author_person_id")
          .in("author_person_id", personIds)
          .gte("created_at", windowStart)
          .lte("created_at", windowEnd),
        service
          .from("post_reactions")
          .select("person_id")
          .in("person_id", personIds)
          .gte("created_at", windowStart)
          .lte("created_at", windowEnd),
      ]);
      const activeSet = new Set([
        ...(posts.data ?? []).map((p) => p.author_person_id),
        ...(comments.data ?? []).map((c) => c.author_person_id),
        ...(reactions.data ?? []).map((r) => r.person_id),
      ]);
      activated += personIds.filter((p) => activeSet.has(p)).length;
      total += personIds.length;
      details.push(`${cycle.name}: ${personIds.filter((p) => activeSet.has(p)).length}/${personIds.length}`);
    }
    if (total > 0) {
      metrics.push({
        id: "hub_activation",
        name: "Activación 48 h post-etapa",
        value: `${Math.round((activated / total) * 100)}%`,
        detail: details.join(" · "),
        definition:
          "Personas que completaron la última etapa de su ciclo y publicaron, comentaron o reaccionaron en su generación dentro de las 48 horas posteriores al cierre. Mide si el fuego del fin de semana llega al Hub.",
        state: "reconciliado",
        source: "Actividad del Hub por ciclo en la ventana post-etapa",
        drill: activeCycles.map((c) => ({ label: c.name, href: `/generaciones/${c.id}` })),
      });
    }
  }

  return { metrics, integrity };
}
