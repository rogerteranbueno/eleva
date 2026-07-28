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

/**
 * Métricas certificadas v0 del Pulso. Cada una declara definición, fuente,
 * estado de calidad y drill-down. Ninguna cifra se presenta como definitiva
 * si su fuente no reconcilia — se etiqueta provisional y se explica por qué.
 */
export async function computePulse(
  service: Service,
  organizationId: string
): Promise<{ metrics: Metric[]; integrity: string[] }> {
  const metrics: Metric[] = [];
  const integrity: string[] = [];
  const now = Date.now();

  const { data: activeCohorts } = await service
    .from("cohorts")
    .select("id, name")
    .eq("organization_id", organizationId)
    .eq("status", "activa");
  const cohortIds = (activeCohorts ?? []).map((c) => c.id);

  // --- Asistencia (show rate) ---------------------------------------------
  {
    const { data: sessions } = await service
      .from("sessions")
      .select("id, name, starts_at")
      .in("cohort_id", cohortIds)
      .lt("starts_at", new Date().toISOString())
      .order("starts_at", { ascending: false });
    const past = sessions ?? [];
    const recent = past.slice(0, 2).map((s) => s.id);
    const previous = past.slice(2, 4).map((s) => s.id);

    async function rate(ids: string[]) {
      if (ids.length === 0) return null;
      const { data } = await service
        .from("attendance_records")
        .select("status, session_id")
        .in("session_id", ids);
      const rows = data ?? [];
      if (rows.length === 0) return null;
      const present = rows.filter((r) =>
        ["presente", "tarde"].includes(r.status)
      ).length;
      return { pct: Math.round((present / rows.length) * 100), n: rows.length };
    }

    const r1 = await rate(recent);
    const r0 = await rate(previous);
    metrics.push({
      id: "show_rate",
      name: "Asistencia",
      value: r1 ? `${r1.pct}%` : "—",
      detail: r1 ? `últimas 2 sesiones · ${r1.n} registros` : "sin sesiones registradas",
      comparison:
        r1 && r0
          ? `${r1.pct - r0.pct >= 0 ? "+" : ""}${r1.pct - r0.pct} pts vs. las 2 sesiones previas (${r0.pct}%)`
          : undefined,
      definition:
        "Presentes y llegadas tarde ÷ registros de asistencia esperados, en las últimas 2 sesiones de generaciones activas. Las justificadas no cuentan como presencia.",
      state: "reconciliado",
      source: "Registro de asistencia por sesión",
      drill: (activeCohorts ?? []).map((c) => ({
        label: c.name,
        href: `/generaciones/${c.id}`,
      })),
    });
  }

  // --- Cobrado (cash collected, 30 días) ----------------------------------
  {
    const since = new Date(now - 30 * 24 * 3600_000).toISOString();
    const { data: pays } = await service
      .from("payments")
      .select("amount_cents, reconciled, charge_id, charges(person_id, people(full_name))")
      .eq("organization_id", organizationId)
      .gte("paid_at", since);
    const rows = pays ?? [];
    const total = rows.reduce((s, p) => s + p.amount_cents, 0);
    const unreconciled = rows.filter((p) => !p.reconciled);
    if (unreconciled.length > 0) {
      integrity.push(
        `${unreconciled.length} pagos por ${money(unreconciled.reduce((s, p) => s + p.amount_cents, 0))} siguen sin conciliar.`
      );
    }
    metrics.push({
      id: "cash_collected",
      name: "Cobrado (30 días)",
      value: money(total),
      detail: `${rows.length} pagos`,
      definition:
        "Suma de pagos confirmados en los últimos 30 días. Es dinero cobrado, no ingreso contratado ni devengado.",
      state: unreconciled.length > 0 ? "provisional" : "reconciliado",
      stateNote:
        unreconciled.length > 0
          ? `${unreconciled.length} pagos sin conciliar`
          : undefined,
      source: "Pagos registrados y conciliación de Oficinas",
      drill: unreconciled.slice(0, 6).map((p) => ({
        label: `Sin conciliar · ${p.charges?.people?.full_name ?? "—"} · ${money(p.amount_cents)}`,
        href: p.charges?.person_id ? `/personas/${p.charges.person_id}` : undefined,
      })),
    });
  }

  // --- Por cobrar vencido (accounts receivable) ---------------------------
  {
    const today = new Date().toISOString().slice(0, 10);
    const { data: charges } = await service
      .from("charges")
      .select("id, amount_cents, due_on, person_id, people(full_name)")
      .eq("organization_id", organizationId)
      .in("status", ["pendiente", "parcial"])
      .lt("due_on", today);
    const rows = charges ?? [];
    let totalDue = 0;
    const drill: Metric["drill"] = [];
    for (const c of rows) {
      const { data: pays } = await service
        .from("payments")
        .select("amount_cents")
        .eq("charge_id", c.id);
      const rest = c.amount_cents - (pays ?? []).reduce((s, p) => s + p.amount_cents, 0);
      totalDue += rest;
      drill.push({
        label: `${c.people?.full_name ?? "—"} · ${money(rest)} · venció ${c.due_on}`,
        href: `/personas/${c.person_id}`,
      });
    }
    metrics.push({
      id: "receivable",
      name: "Vencido por cobrar",
      value: money(totalDue),
      detail: `${rows.length} cargos vencidos`,
      definition:
        "Cargos con fecha de vencimiento pasada, netos de pagos aplicados, a la fecha de corte de hoy. No incluye cargos con vencimiento futuro.",
      state: "reconciliado",
      source: "Cargos y pagos registrados",
      drill: drill.slice(0, 8),
    });
  }

  // --- Señales atendidas <24h ---------------------------------------------
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
        new Date(s.reviewed_at).getTime() - new Date(s.detected_at).getTime() <=
          24 * 3600_000
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

  // --- Activación de la generación ----------------------------------------
  {
    const drill: Metric["drill"] = [];
    let active = 0;
    let total = 0;
    for (const cohort of activeCohorts ?? []) {
      const { data: parts } = await service
        .from("participations")
        .select("id, person_id, people(full_name)")
        .eq("cohort_id", cohort.id)
        .in("state", ["confirmado", "activo"]);
      const rows = parts ?? [];
      total += rows.length;
      const personIds = rows.map((r) => r.person_id);
      const partIds = rows.map((r) => r.id);
      const [posts, rsvps, missions] = await Promise.all([
        service.from("posts").select("author_person_id").eq("cohort_id", cohort.id).in("author_person_id", personIds),
        service.from("rsvps").select("person_id").in("person_id", personIds),
        service.from("mission_completions").select("participation_id").in("participation_id", partIds),
      ]);
      const activeSet = new Set([
        ...(posts.data ?? []).map((p) => p.author_person_id),
        ...(rsvps.data ?? []).map((r) => r.person_id),
      ]);
      const partToPerson = new Map(rows.map((r) => [r.id, r.person_id]));
      for (const m of missions.data ?? []) {
        const pid = partToPerson.get(m.participation_id);
        if (pid) activeSet.add(pid);
      }
      active += rows.filter((r) => activeSet.has(r.person_id)).length;
      for (const r of rows.filter((r) => !activeSet.has(r.person_id)).slice(0, 5)) {
        drill.push({
          label: `Sin actividad aún · ${r.people?.full_name}`,
          href: `/personas/${r.person_id}`,
        });
      }
    }
    metrics.push({
      id: "hub_activation",
      name: "Activación en el Hub",
      value: total > 0 ? `${Math.round((active / total) * 100)}%` : "—",
      detail: `${active} de ${total} participantes con al menos una acción`,
      definition:
        "Participantes activos con al menos una publicación, confirmación de evento o misión completada en su generación. Mide participación real, no visitas.",
      state: "reconciliado",
      source: "Actividad del Hub de la generación",
      drill,
    });
  }

  // --- Continuidad entre niveles ------------------------------------------
  {
    const { data: closed } = await service
      .from("cohorts")
      .select("id, name")
      .eq("organization_id", organizationId)
      .eq("status", "cerrada")
      .order("starts_on", { ascending: false })
      .limit(1);
    const last = closed?.[0];
    if (last) {
      const { data: parts } = await service
        .from("participations")
        .select("state, person_id, people(full_name)")
        .eq("cohort_id", last.id);
      const rows = parts ?? [];
      const eligible = rows.filter((r) =>
        ["elegible_siguiente", "inscrito_siguiente"].includes(r.state)
      );
      const enrolled = rows.filter((r) => r.state === "inscrito_siguiente");
      metrics.push({
        id: "continuity",
        name: `Continuidad · ${last.name}`,
        value:
          eligible.length > 0
            ? `${Math.round((enrolled.length / eligible.length) * 100)}%`
            : "—",
        detail: `${enrolled.length} de ${eligible.length} personas elegibles ya se inscribieron al siguiente nivel`,
        definition:
          "Personas elegibles al siguiente nivel que ya se inscribieron ÷ personas elegibles de la última generación cerrada. La elegibilidad la define el centro; no es una meta de venta.",
        state: "reconciliado",
        source: "Estados de participación de la generación",
        drill: eligible
          .filter((r) => r.state === "elegible_siguiente")
          .slice(0, 6)
          .map((r) => ({
            label: `Elegible, sin inscribir · ${r.people?.full_name}`,
            href: `/personas/${r.person_id}`,
          })),
      });
    }
  }

  return { metrics, integrity };
}
