import Link from "next/link";
import { requireCapability } from "@/lib/capabilities";
import { readableCycleIds } from "@/lib/scope";
import { createServiceClient } from "@/lib/supabase/server";
import { Badge, EmptyState } from "@/components/ui";
import { STAGE_LABEL, dateShort } from "@/lib/format";

export const dynamic = "force-dynamic";

const CYCLE_STATUS: Record<string, { label: string; variant: "ok" | "accent" | "neutral" | "gold" }> = {
  activa: { label: "Activa", variant: "ok" },
  planeada: { label: "Planeada", variant: "accent" },
  graduada: { label: "Graduada", variant: "gold" },
  cerrada: { label: "Cerrada", variant: "neutral" },
};

const STAGE_STATUS_DOT: Record<string, string> = {
  planeada: "bg-line-strong",
  activa: "bg-ok",
  completada: "bg-accent",
  cerrada: "bg-line-strong",
};

export default async function GeneracionesPage() {
  const ctx = await requireCapability(["cycle.read.all", "cycle.read.assigned"]);
  const scope = await readableCycleIds(ctx);
  const service = createServiceClient();

  const { data: cycles } = await service
    .from("generation_cycles")
    .select(
      "id, name, status, stage_runs(id, stage, name, status, starts_on, ends_on, stage_participations(id, registration_status))"
    )
    .eq("organization_id", ctx.organizationId)
    .order("number", { ascending: false })
    .then((res) =>
      scope === "all"
        ? res
        : { ...res, data: (res.data ?? []).filter((c) => scope.includes(c.id)) }
    );

  const today = new Date().toISOString().slice(0, 10);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold tracking-tight">Generaciones</h1>
        <p className="mt-1 text-sm text-muted">
          El ciclo real de cada generación: Básico → Avanzado → PL → graduación.
        </p>
      </header>

      {(cycles ?? []).length === 0 ? (
        <EmptyState title="Aún no hay generaciones configuradas." />
      ) : (
        <ul className="space-y-3">
          {cycles!.map((c) => {
            const status = CYCLE_STATUS[c.status] ?? CYCLE_STATUS.cerrada;
            const runs = (c.stage_runs ?? []).sort((a, b) =>
              a.starts_on.localeCompare(b.starts_on)
            );
            const current =
              runs.find((r) => r.status === "activa") ??
              runs.find((r) => r.status === "planeada" && r.starts_on >= today);
            return (
              <li key={c.id}>
                <Link
                  href={`/generaciones/${c.id}`}
                  className="block rounded-(--radius-card) border border-line bg-surface p-5 transition-colors hover:border-line-strong hover:bg-raised"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h2 className="font-semibold">{c.name}</h2>
                    <Badge variant={status.variant}>{status.label}</Badge>
                  </div>

                  {/* Línea de tiempo del ciclo */}
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    {runs.map((r, i) => {
                      const confirmados = (r.stage_participations ?? []).filter(
                        (p) => p.registration_status === "confirmado"
                      ).length;
                      return (
                        <span key={r.id} className="flex items-center gap-2">
                          {i > 0 && <span className="text-faint">→</span>}
                          <span className="inline-flex items-center gap-1.5 rounded-full border border-line px-2.5 py-1 text-xs">
                            <span
                              aria-hidden
                              className={`size-1.5 rounded-full ${STAGE_STATUS_DOT[r.status] ?? "bg-line-strong"}`}
                            />
                            <span className="font-medium">{STAGE_LABEL[r.stage]}</span>
                            <span className="text-faint">
                              {dateShort(r.starts_on + "T12:00:00")}
                              {confirmados > 0 && ` · ${confirmados}`}
                            </span>
                          </span>
                        </span>
                      );
                    })}
                  </div>

                  {current && (
                    <p className="mt-2.5 text-xs text-muted">
                      {current.status === "activa" ? "En curso: " : "Próxima etapa: "}
                      <span className="text-foreground font-medium">{current.name}</span>
                      {current.status !== "activa" && <> · inicia {dateShort(current.starts_on + "T12:00:00")}</>}
                    </p>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
