import { createServiceClient } from "@/lib/supabase/server";
import { getWeeklySummary } from "@/lib/ai";
import type { Metric } from "@/modules/intelligence/metrics";
import { SectionTitle, Badge } from "@/components/ui";

/** Resumen semanal del Pulso — generado por Claude cuando hay API key,
 *  plantilla determinista cuando no. Siempre etiquetado con su fuente. */
export async function WeeklySummary({
  organizationId,
  organizationName,
  metrics,
  centerMomentum,
  openCases,
  integrity,
}: {
  organizationId: string;
  organizationName: string;
  metrics: Metric[];
  centerMomentum: number;
  openCases: number;
  integrity: string[];
}) {
  const service = createServiceClient();
  const summary = await getWeeklySummary(service, organizationId, {
    metrics,
    centerMomentum,
    openCases,
    integrity,
    organizationName,
  });

  if (summary.lines.length === 0) return null;

  return (
    <section aria-label="Resumen semanal">
      <SectionTitle
        action={
          summary.source === "claude" ? (
            <Badge variant="accent">IA · Claude</Badge>
          ) : (
            <Badge variant="neutral">Resumen automático</Badge>
          )
        }
      >
        Resumen de la semana
      </SectionTitle>
      <div className="rounded-(--radius-card) border border-accent/25 bg-accent-soft/40 p-5">
        <ul className="space-y-2">
          {summary.lines.map((line, i) => (
            <li key={i} className="flex gap-2.5 text-sm leading-relaxed">
              <span aria-hidden className="text-accent-strong shrink-0">✦</span>
              {line}
            </li>
          ))}
        </ul>
        <p className="mt-3 text-xs text-faint">
          {summary.source === "claude"
            ? "Generado por IA con las métricas certificadas del centro. Propone y explica; las decisiones son del equipo."
            : "Resumen automático a partir de las métricas certificadas. Conecta la IA para un análisis narrativo."}
        </p>
      </div>
    </section>
  );
}
