import Link from "next/link";
import { requireCapability, hasCapability } from "@/lib/capabilities";
import { readablePersonIds, applyScope } from "@/lib/scope";
import { createServiceClient } from "@/lib/supabase/server";
import { Avatar, DeliveryBadge, EmptyState } from "@/components/ui";

export const dynamic = "force-dynamic";

export default async function PersonasPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const ctx = await requireCapability(["people.read.assigned", "people.read.operational"]);
  const service = createServiceClient();

  // El directorio se recorta al ámbito del rol: el staff ve a su grupo, no a
  // las 63 personas del centro.
  const scope = await readablePersonIds(ctx);
  const contactAllowed = hasCapability(ctx, "people.read.contact");

  let query = service
    .from("people")
    .select(
      "id, full_name, email, phone, organization_memberships!inner(organization_id), stage_participations(delivery_status, created_at, stage_runs(name, status, generation_cycles(name, status)))"
    )
    .eq("organization_memberships.organization_id", ctx.organizationId)
    .order("full_name");
  query = applyScope(query, "id", scope);
  if (q) query = query.ilike("full_name", `%${q}%`);
  const { data: people } = await query;

  const rows = (people ?? []).map((p) => {
    const parts = [...(p.stage_participations ?? [])].sort((a, b) =>
      (b.created_at ?? "").localeCompare(a.created_at ?? "")
    );
    const current =
      parts.find((pa) => pa.stage_runs?.status === "activa") ??
      parts.find((pa) => pa.stage_runs?.generation_cycles?.status === "activa") ??
      parts[0];
    return { ...p, participation: current };
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
                    {p.participation?.stage_runs
                      ? `${p.participation.stage_runs.generation_cycles?.name} · ${p.participation.stage_runs.name}`
                      : "Sin generación"}
                    {contactAllowed && !p.phone && " · sin teléfono"}
                    {contactAllowed && !p.email && " · sin email"}
                  </p>
                </div>
                {p.participation && (
                  <DeliveryBadge status={p.participation.delivery_status} />
                )}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
