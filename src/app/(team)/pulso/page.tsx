import Link from "next/link";
import { requireTeam, can } from "@/lib/context";
import { createServiceClient } from "@/lib/supabase/server";
import { computePulse } from "@/modules/intelligence/metrics";
import { computeMomentum, MOMENTUM_DEFINITION } from "@/modules/intelligence/momentum";
import { MomentumGauge } from "@/components/MomentumGauge";
import { Card, SectionTitle, MetricStateBadge, PriorityBadge } from "@/components/ui";
import { money, plural } from "@/lib/format";
import { WeeklySummary } from "./WeeklySummary";

export const dynamic = "force-dynamic";

export default async function PulsoPage() {
  const ctx = await requireTeam(["dueno", "oficinas", "finanzas", "entrenador"]);
  const service = createServiceClient();

  const [{ metrics, integrity }, momentum, casesRes, insightsRes] =
    await Promise.all([
      computePulse(service, ctx.organizationId),
      computeMomentum(service, ctx.organizationId),
      service
        .from("cases")
        .select("id", { count: "exact", head: true })
        .eq("organization_id", ctx.organizationId)
        .in("status", ["abierto", "en_progreso", "esperando"]),
      service
        .from("cases")
        .select("id, title, priority, signals(explanation)")
        .eq("organization_id", ctx.organizationId)
        .in("status", ["abierto", "en_progreso"])
        .order("opened_at")
        .limit(4),
    ]);

  const financeAllowed = can.viewFinance(ctx);
  const byId = (id: string) => metrics.find((m) => m.id === id);
  const cash = byId("cash_collected");
  const receivable = byId("receivable");
  const openCases = casesRes.count ?? 0;
  const activeParticipants = momentum.cohorts.reduce(
    (s, c) => s + c.participants.length,
    0
  );

  const visible = financeAllowed
    ? metrics
    : metrics.filter((m) => !["cash_collected", "receivable"].includes(m.id));

  const kpis = [
    ...(financeAllowed && cash
      ? [{ label: "Cobrado (30 días)", value: cash.value, note: cash.stateNote, href: "/finanzas" }]
      : []),
    ...(financeAllowed && receivable
      ? [{ label: "Vencido por cobrar", value: receivable.value, note: receivable.detail, href: "/finanzas" }]
      : []),
    {
      label: "Participantes activos",
      value: String(activeParticipants),
      note: plural(momentum.cohorts.length, "generación activa", "generaciones activas"),
      href: "/generaciones",
    },
    {
      label: "Necesitan atención",
      value: String(openCases),
      note: "casos abiertos en la cola",
      href: "/hoy",
      alert: openCases > 0,
    },
  ];

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-bold tracking-tight">Pulso del centro</h1>
        <p className="mt-1 text-sm text-muted">
          {ctx.organizationName} · cada cifra declara su definición, fuente y
          estado.
        </p>
      </header>

      {integrity.length > 0 && (
        <section
          aria-label="Integridad de datos"
          className="rounded-(--radius-card) border border-gold/40 bg-gold-soft px-4 py-3"
        >
          <p className="text-sm font-semibold text-gold">Integridad de datos</p>
          <ul className="mt-1 space-y-0.5 text-sm text-gold/90">
            {integrity.map((note) => (
              <li key={note}>
                <Link href="/finanzas" className="hover:underline underline-offset-4">
                  {note}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Fila KPI */}
      <section aria-label="Indicadores" className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {kpis.map((kpi) => (
          <Link key={kpi.label} href={kpi.href}>
            <Card className="!p-4 h-full transition-colors hover:border-line-strong">
              <p className="text-xs text-muted">{kpi.label}</p>
              <p
                className={`mt-1 text-2xl font-bold tracking-tight ${
                  "alert" in kpi && kpi.alert ? "text-danger" : ""
                }`}
              >
                {kpi.value}
              </p>
              {kpi.note && <p className="mt-0.5 text-xs text-faint">{kpi.note}</p>}
            </Card>
          </Link>
        ))}
      </section>

      {/* Momentum + generaciones */}
      <section aria-label="Momentum" className="grid gap-4 md:grid-cols-[220px_1fr]">
        <Card className="flex flex-col items-center justify-center gap-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted">
            Momentum del centro
          </p>
          <MomentumGauge score={momentum.center} size="lg" />
          <details className="text-center">
            <summary className="cursor-pointer text-xs text-faint hover:text-muted">
              Cómo se calcula
            </summary>
            <p className="mt-1 text-xs leading-relaxed text-muted">
              {MOMENTUM_DEFINITION}
            </p>
          </details>
        </Card>
        <div className="grid gap-3 sm:grid-cols-2">
          {momentum.cohorts.map((cohort) => (
            <Link key={cohort.cohortId} href={`/generaciones/${cohort.cohortId}`}>
              <Card className="h-full transition-colors hover:border-line-strong">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold">{cohort.name}</p>
                    <p className="mt-0.5 text-xs text-faint">
                      {plural(cohort.participants.length, "participante activo", "participantes activos")}
                    </p>
                  </div>
                  <MomentumGauge score={cohort.score} size="sm" showLabel={false} animated={false} />
                </div>
                {cohort.participants[0] && cohort.participants[0].score < 40 && (
                  <p className="mt-3 text-xs text-muted">
                    Acompañar primero:{" "}
                    <span className="text-danger">
                      {cohort.participants
                        .filter((p) => p.score < 40)
                        .slice(0, 2)
                        .map((p) => p.name)
                        .join(", ")}
                    </span>
                  </p>
                )}
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Resumen semanal (IA) */}
      <WeeklySummary
        organizationId={ctx.organizationId}
        organizationName={ctx.organizationName}
        metrics={metrics}
        centerMomentum={momentum.center}
        openCases={openCases}
        integrity={integrity}
      />

      {/* Insights del sistema */}
      {(insightsRes.data ?? []).length > 0 && (
        <section aria-label="Insights del sistema">
          <SectionTitle
            action={
              <Link
                href="/hoy"
                className="text-sm text-accent-strong hover:underline underline-offset-4"
              >
                Ver toda la cola →
              </Link>
            }
          >
            Insights del sistema
          </SectionTitle>
          <div className="grid gap-3 md:grid-cols-2">
            {insightsRes.data!.map((c) => (
              <Link key={c.id} href={`/casos/${c.id}`}>
                <Card className="h-full !py-4 transition-colors hover:border-line-strong">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold">{c.title}</p>
                    <PriorityBadge priority={c.priority} />
                  </div>
                  {c.signals?.[0] && (
                    <p className="mt-1.5 text-xs text-muted line-clamp-2">
                      {c.signals[0].explanation}
                    </p>
                  )}
                </Card>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Métricas certificadas */}
      <section aria-label="Métricas certificadas">
        <SectionTitle>Métricas certificadas</SectionTitle>
        <div className="grid gap-4 md:grid-cols-2">
          {visible.map((metric) => (
            <Card key={metric.id}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-sm font-medium text-muted">{metric.name}</h2>
                  <p className="mt-1 text-3xl font-bold tracking-tight">
                    {metric.value}
                  </p>
                  {metric.detail && (
                    <p className="mt-0.5 text-xs text-faint">{metric.detail}</p>
                  )}
                  {metric.comparison && (
                    <p className="mt-1 text-xs text-muted">{metric.comparison}</p>
                  )}
                </div>
                <MetricStateBadge state={metric.state} note={metric.stateNote} />
              </div>
              <details className="mt-3">
                <summary className="cursor-pointer text-xs text-faint hover:text-muted">
                  Definición y fuente
                </summary>
                <p className="mt-2 text-xs leading-relaxed text-muted">
                  {metric.definition}
                </p>
                <p className="mt-1 text-xs text-faint">Fuente: {metric.source}</p>
              </details>
              {metric.drill.length > 0 && (
                <details className="mt-2">
                  <summary className="cursor-pointer text-xs text-accent-strong hover:underline underline-offset-4">
                    Ver de dónde sale
                  </summary>
                  <ul className="mt-2 space-y-1">
                    {metric.drill.map((d, i) => (
                      <li key={i} className="text-sm text-muted">
                        {d.href ? (
                          <Link
                            href={d.href}
                            className="hover:text-foreground underline-offset-4 hover:underline"
                          >
                            {d.label}
                          </Link>
                        ) : (
                          d.label
                        )}
                      </li>
                    ))}
                  </ul>
                </details>
              )}
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
