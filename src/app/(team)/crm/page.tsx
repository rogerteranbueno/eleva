import Link from "next/link";
import { requireTeam } from "@/lib/context";
import { createServiceClient } from "@/lib/supabase/server";
import { advanceParticipation } from "@/app/actions/operations";
import { Card, SectionTitle, Avatar, EmptyState } from "@/components/ui";
import { plural } from "@/lib/format";

export const dynamic = "force-dynamic";

/** Pipeline de entrada (CRM lite). El lead y el alumni son la misma persona
 *  en la misma historia: aquí solo avanza su recorrido de entrada. */
const STAGES: { state: string; label: string; next?: { to: string; label: string } }[] = [
  { state: "lead", label: "Leads", next: { to: "aplicado", label: "Aplicó →" } },
  { state: "aplicado", label: "Aplicaron", next: { to: "registrado", label: "Registrar →" } },
  { state: "registrado", label: "Registrados", next: { to: "pagado", label: "Pago completo →" } },
  { state: "pago_parcial", label: "Pago parcial", next: { to: "pagado", label: "Pago completo →" } },
  { state: "pagado", label: "Pagados", next: { to: "confirmado", label: "Confirmar →" } },
  { state: "confirmado", label: "Confirmados", next: { to: "activo", label: "Activar →" } },
];

export default async function CrmPage() {
  const ctx = await requireTeam(["dueno", "oficinas"]);
  const service = createServiceClient();

  const { data: pipeline } = await service
    .from("participations")
    .select("id, state, source, created_at, person_id, people(full_name), cohorts(name)")
    .eq("organization_id", ctx.organizationId)
    .in("state", STAGES.map((s) => s.state))
    .order("created_at");

  const byStage = new Map<string, NonNullable<typeof pipeline>>();
  for (const p of pipeline ?? []) {
    const list = byStage.get(p.state) ?? [];
    list.push(p);
    byStage.set(p.state, list);
  }

  const total = (pipeline ?? []).length;

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold tracking-tight">CRM · Pipeline de entrada</h1>
        <p className="mt-1 text-sm text-muted">
          {plural(total, "persona en recorrido de entrada", "personas en recorrido de entrada")}.
          El mismo registro acompaña a cada persona de lead a alumni — nada se
          copia entre sistemas.
        </p>
      </header>

      {total === 0 ? (
        <EmptyState title="No hay personas en el pipeline ahora.">
          Cuando el website del centro reciba aplicaciones, aparecerán aquí con
          su fuente y consentimiento.
        </EmptyState>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {STAGES.filter((s) => (byStage.get(s.state) ?? []).length > 0).map((stage) => (
            <section key={stage.state} aria-label={stage.label}>
              <SectionTitle>
                {stage.label} · {(byStage.get(stage.state) ?? []).length}
              </SectionTitle>
              <ul className="space-y-2">
                {(byStage.get(stage.state) ?? []).map((p) => (
                  <li key={p.id}>
                    <Card className="!py-3.5">
                      <div className="flex items-center gap-2.5">
                        <Avatar name={p.people?.full_name ?? "?"} size={32} />
                        <div className="min-w-0 flex-1">
                          <Link
                            href={`/personas/${p.person_id}`}
                            className="block truncate text-sm font-medium hover:text-accent-strong"
                          >
                            {p.people?.full_name}
                          </Link>
                          <p className="truncate text-xs text-faint">
                            {p.cohorts?.name}
                            {p.source && ` · fuente: ${p.source}`}
                          </p>
                        </div>
                      </div>
                      {stage.next && (
                        <form action={advanceParticipation} className="mt-2.5">
                          <input type="hidden" name="participationId" value={p.id} />
                          <input type="hidden" name="toState" value={stage.next.to} />
                          <button
                            type="submit"
                            className="w-full rounded-lg border border-line px-3 py-1.5 text-xs font-medium text-muted transition-colors hover:border-accent hover:text-accent-strong"
                          >
                            {stage.next.label}
                          </button>
                        </form>
                      )}
                    </Card>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}

      <p className="text-xs text-faint max-w-2xl">
        Cada avance queda en el historial de estados de la participación y en la
        auditoría. Los estados canónicos no cambian: lead → aplicado → registrado
        → pago → confirmado → activo.
      </p>
    </div>
  );
}
