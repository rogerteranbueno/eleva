import Link from "next/link";
import { requireTeam, can } from "@/lib/context";
import { createServiceClient } from "@/lib/supabase/server";
import { computePulse } from "@/modules/intelligence/metrics";
import { Card, SectionTitle, MetricStateBadge } from "@/components/ui";

export const dynamic = "force-dynamic";

export default async function PulsoPage() {
  const ctx = await requireTeam(["dueno", "oficinas", "finanzas", "entrenador"]);
  const service = createServiceClient();
  const { metrics, integrity } = await computePulse(service, ctx.organizationId);

  const visible = can.viewFinance(ctx)
    ? metrics
    : metrics.filter((m) => !["cash_collected", "receivable"].includes(m.id));

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-bold tracking-tight">Pulso del centro</h1>
        <p className="mt-1 text-sm text-muted">
          Cada cifra declara su definición, su fuente y su estado. Ninguna se
          presenta como definitiva sin reconciliar.
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
              <li key={note}>{note}</li>
            ))}
          </ul>
        </section>
      )}

      <section className="grid gap-4 md:grid-cols-2">
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
      </section>

      <section>
        <SectionTitle>Cómo leer este pulso</SectionTitle>
        <p className="text-sm leading-relaxed text-muted max-w-2xl">
          El Pulso no es un tablero de vanidad: existe para decidir. Si una
          métrica está <em>provisional</em>, primero reconcilia su fuente. Si un
          número te sorprende, usa «Ver de dónde sale» para llegar a las personas
          y eventos que lo componen — la cifra y su detalle siempre deben
          coincidir.
        </p>
      </section>
    </div>
  );
}
