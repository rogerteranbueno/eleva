import Link from "next/link";
import { requireTeam } from "@/lib/context";
import { createServiceClient } from "@/lib/supabase/server";
import { Avatar, ParticipationStateBadge, EmptyState } from "@/components/ui";

export const dynamic = "force-dynamic";

export default async function PersonasPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const ctx = await requireTeam();
  const service = createServiceClient();

  let query = service
    .from("people")
    .select(
      "id, full_name, email, phone, organization_memberships!inner(organization_id), participations(state, cohorts(name, status))"
    )
    .eq("organization_memberships.organization_id", ctx.organizationId)
    .order("full_name");
  if (q) query = query.ilike("full_name", `%${q}%`);
  const { data: people } = await query;

  const rows = (people ?? []).map((p) => {
    const active = p.participations?.find(
      (pa) => pa.cohorts?.status === "activa"
    );
    const latest = active ?? p.participations?.[p.participations.length - 1];
    return { ...p, participation: latest };
  });

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Personas</h1>
          <p className="mt-1 text-sm text-muted">
            {rows.length} personas en {ctx.organizationName}
          </p>
        </div>
        <form className="flex gap-2" role="search">
          <input
            type="search"
            name="q"
            defaultValue={q ?? ""}
            placeholder="Buscar por nombre"
            aria-label="Buscar personas"
            className="w-56 rounded-lg border border-line bg-raised px-3 py-2 text-sm placeholder:text-faint"
          />
          <button
            type="submit"
            className="rounded-lg border border-line px-3 py-2 text-sm text-muted hover:text-foreground"
          >
            Buscar
          </button>
        </form>
      </header>

      {rows.length === 0 ? (
        <EmptyState title={q ? `Sin resultados para «${q}»` : "Aún no hay personas"}>
          {q ? "Prueba con otro nombre o revisa la ortografía." : null}
        </EmptyState>
      ) : (
        <ul className="divide-y divide-line rounded-(--radius-card) border border-line bg-surface">
          {rows.map((p) => (
            <li key={p.id}>
              <Link
                href={`/personas/${p.id}`}
                className="flex items-center gap-4 px-4 py-3 transition-colors hover:bg-raised"
              >
                <Avatar name={p.full_name} />
                <div className="min-w-0 flex-1">
                  <p className="font-medium">{p.full_name}</p>
                  <p className="truncate text-xs text-faint">
                    {p.participation?.cohorts?.name ?? "Sin generación"}
                    {!p.phone && " · sin teléfono"}
                    {!p.email && " · sin email"}
                  </p>
                </div>
                {p.participation && (
                  <ParticipationStateBadge state={p.participation.state} />
                )}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
