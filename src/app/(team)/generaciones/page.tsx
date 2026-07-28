import Link from "next/link";
import { requireTeam } from "@/lib/context";
import { createServiceClient } from "@/lib/supabase/server";
import { Badge, EmptyState } from "@/components/ui";
import { plural } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function GeneracionesPage() {
  const ctx = await requireTeam();
  const service = createServiceClient();

  const { data: cohorts } = await service
    .from("cohorts")
    .select(
      "id, name, status, starts_on, ends_on, programs(name), levels(name), locations(name), participations(id)"
    )
    .eq("organization_id", ctx.organizationId)
    .order("starts_on", { ascending: false });

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold tracking-tight">Generaciones</h1>
        <p className="mt-1 text-sm text-muted">
          La unidad real de entrega: planear, operar y comparar.
        </p>
      </header>

      {(cohorts ?? []).length === 0 ? (
        <EmptyState title="Aún no hay generaciones configuradas." />
      ) : (
        <ul className="grid gap-3 md:grid-cols-2">
          {cohorts!.map((c) => (
            <li key={c.id}>
              <Link
                href={`/generaciones/${c.id}`}
                className="block rounded-(--radius-card) border border-line bg-surface p-5 transition-colors hover:border-line-strong hover:bg-raised"
              >
                <div className="flex items-center justify-between gap-2">
                  <h2 className="font-semibold">{c.name}</h2>
                  <Badge
                    variant={
                      c.status === "activa"
                        ? "ok"
                        : c.status === "planeada"
                          ? "accent"
                          : "neutral"
                    }
                  >
                    {c.status === "activa"
                      ? "Activa"
                      : c.status === "planeada"
                        ? "Planeada"
                        : "Cerrada"}
                  </Badge>
                </div>
                <p className="mt-1.5 text-sm text-muted">
                  {c.programs?.name} · Nivel {c.levels?.name}
                </p>
                <p className="mt-1 text-xs text-faint">
                  {c.starts_on} → {c.ends_on ?? "—"} ·{" "}
                  {plural(c.participations?.length ?? 0, "participante", "participantes")}
                  {c.locations?.name && ` · ${c.locations.name}`}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
