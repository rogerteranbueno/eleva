import Link from "next/link";
import { requireCapability } from "@/lib/capabilities";
import { createServiceClient } from "@/lib/supabase/server";
import { advanceProspect, registerProspectToBasico } from "@/app/actions/operations";
import { Card, SectionTitle, Avatar, Badge, EmptyState } from "@/components/ui";
import { dateShort, plural } from "@/lib/format";

export const dynamic = "force-dynamic";

/** CRM v2: el plano de la relación ANTES de la participación. Convertir crea
 *  la participación y su cargo; el prospecto nunca se confunde con inscrito. */
const STAGES: { status: string; label: string; next?: { to: string; label: string } }[] = [
  { status: "nuevo", label: "Nuevos", next: { to: "contactado", label: "Contactado →" } },
  { status: "contactado", label: "Contactados", next: { to: "cita", label: "Agendó cita →" } },
  { status: "cita", label: "Con cita", next: { to: "interesado", label: "Interesado →" } },
  { status: "interesado", label: "Interesados", next: { to: "registro_iniciado", label: "Inició registro →" } },
  { status: "registro_iniciado", label: "Registro iniciado" },
  { status: "reactivable", label: "Reactivables", next: { to: "contactado", label: "Recontactar →" } },
];

export default async function CrmPage() {
  const ctx = await requireCapability("crm.read");
  const service = createServiceClient();

  const [{ data: prospects }, { data: nextBasico }] = await Promise.all([
    service
      .from("prospects")
      .select(
        "id, crm_status, source, created_at, person_id, people(full_name), stage_runs:target_stage_run_id(name), enrollment_attributions(enroller:enroller_person_id(full_name))"
      )
      .eq("organization_id", ctx.organizationId)
      .not("crm_status", "in", "(convertido,perdido)")
      .order("created_at"),
    service
      .from("stage_runs")
      .select("id, name, starts_on, capacity, stage_participations(registration_status)")
      .eq("organization_id", ctx.organizationId)
      .eq("stage", "basico")
      .eq("status", "planeada")
      .gt("starts_on", new Date().toISOString().slice(0, 10))
      .order("starts_on")
      .limit(1)
      .maybeSingle(),
  ]);

  const byStage = new Map<string, NonNullable<typeof prospects>>();
  for (const p of prospects ?? []) {
    const list = byStage.get(p.crm_status) ?? [];
    list.push(p);
    byStage.set(p.crm_status, list);
  }
  const total = (prospects ?? []).length;
  const confirmados = (nextBasico?.stage_participations ?? []).filter(
    (p) => p.registration_status === "confirmado"
  ).length;

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">CRM · Camino al siguiente Básico</h1>
          <p className="mt-1 text-sm text-muted">
            {plural(total, "prospecto activo", "prospectos activos")}. La relación empieza aquí;
            la participación (y su cargo) nace al registrar.
          </p>
        </div>
        {nextBasico && (
          <Card className="!p-4">
            <p className="text-sm font-semibold">{nextBasico.name}</p>
            <p className="text-xs text-muted">
              inicia {dateShort(nextBasico.starts_on + "T12:00:00")} ·{" "}
              <span className="font-medium text-foreground">
                {confirmados}/{nextBasico.capacity ?? "—"}
              </span>{" "}
              confirmados
            </p>
          </Card>
        )}
      </header>

      {total === 0 ? (
        <EmptyState title="No hay prospectos activos ahora.">
          Cuando el website reciba interesados o el PL genere enrolamientos, aparecerán aquí con su
          fuente y su enrolador.
        </EmptyState>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {STAGES.filter((s) => (byStage.get(s.status) ?? []).length > 0).map((stage) => (
            <section key={stage.status} aria-label={stage.label}>
              <SectionTitle>
                {stage.label} · {(byStage.get(stage.status) ?? []).length}
              </SectionTitle>
              <ul className="space-y-2">
                {(byStage.get(stage.status) ?? []).map((p) => {
                  const enroller = p.enrollment_attributions?.[0]?.enroller?.full_name;
                  return (
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
                              {p.stage_runs?.name ?? "Sin destino"}
                              {p.source && ` · ${p.source}`}
                            </p>
                          </div>
                          {enroller && <Badge variant="aqua">enroló {enroller.split(" ")[0]}</Badge>}
                        </div>
                        <div className="mt-2.5 flex gap-2">
                          {stage.next && (
                            <form action={advanceProspect} className="flex-1">
                              <input type="hidden" name="prospectId" value={p.id} />
                              <input type="hidden" name="toStatus" value={stage.next.to} />
                              <button
                                type="submit"
                                className="w-full rounded-lg border border-line px-3 py-1.5 text-xs font-medium text-muted transition-colors hover:border-accent hover:text-accent-strong"
                              >
                                {stage.next.label}
                              </button>
                            </form>
                          )}
                          {["interesado", "registro_iniciado"].includes(p.crm_status) && (
                            <form action={registerProspectToBasico} className="flex-1">
                              <input type="hidden" name="prospectId" value={p.id} />
                              <button
                                type="submit"
                                className="w-full rounded-lg bg-accent px-3 py-1.5 text-xs font-semibold text-[#0b0a12] transition-opacity hover:opacity-90"
                              >
                                Registrar al Básico
                              </button>
                            </form>
                          )}
                        </div>
                      </Card>
                    </li>
                  );
                })}
              </ul>
            </section>
          ))}
        </div>
      )}

      <p className="text-xs text-faint max-w-2xl">
        «Registrar al Básico» crea la participación confirmada y su cargo en un solo hecho auditado,
        marca el prospecto como convertido y acredita el enrolamiento a quien lo originó.
      </p>
    </div>
  );
}
