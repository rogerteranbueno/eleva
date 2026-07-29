import Link from "next/link";
import { requireMember } from "@/lib/context";
import { createUserClient } from "@/lib/supabase/server";
import { Card, SectionTitle, Avatar, EmptyState, Badge } from "@/components/ui";
import { plural } from "@/lib/format";

export const dynamic = "force-dynamic";

/**
 * Directorio del centro con descubrimiento.
 *
 * Antes era una lista de la generación: no se podía encontrar a nadie fuera de
 * ella, así que la red terminaba donde terminaba tu grupo. Ahora se busca por
 * nombre, ciudad, interés, habilidad y disponibilidad para servir — siempre
 * dentro de lo que RLS deja ver a esta persona.
 */
export default async function DirectorioPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; filtro?: string }>;
}) {
  const { q, filtro } = await searchParams;
  const ctx = await requireMember();
  const supabase = await createUserClient();

  const { data: people } = await supabase
    .from("people")
    .select(
      "id, full_name, declaration, bio, city, interests, skills, offers, looking_for, available_to_serve"
    )
    .order("full_name");

  const term = (q ?? "").trim().toLowerCase();
  const matches = (people ?? []).filter((p) => {
    if (p.id === ctx.personId) return false;
    if (filtro === "sirven" && !p.available_to_serve) return false;
    if (filtro === "ofrecen" && (p.offers ?? []).length === 0) return false;
    if (filtro === "buscan" && (p.looking_for ?? []).length === 0) return false;
    if (!term) return true;
    const haystack = [
      p.full_name,
      p.city ?? "",
      p.bio ?? "",
      p.declaration ?? "",
      ...(p.interests ?? []),
      ...(p.skills ?? []),
      ...(p.offers ?? []),
    ]
      .join(" ")
      .toLowerCase();
    return haystack.includes(term);
  });

  const FILTROS = [
    { key: undefined, label: "Todas" },
    { key: "sirven", label: "Disponibles para servir" },
    { key: "ofrecen", label: "Ofrecen algo" },
    { key: "buscan", label: "Buscan algo" },
  ];

  return (
    <div className="space-y-6 max-w-2xl">
      <header>
        <h1 className="text-2xl font-bold tracking-tight">Personas</h1>
        <p className="mt-1 text-sm text-muted">
          Encuentra a alguien de tu centro por lo que sabe, lo que ofrece o lo que busca.
        </p>
      </header>

      <form role="search" className="flex gap-2">
        {filtro && <input type="hidden" name="filtro" value={filtro} />}
        <input
          type="search"
          name="q"
          defaultValue={q ?? ""}
          placeholder="Nombre, ciudad, habilidad o interés"
          aria-label="Buscar personas"
          className="flex-1 rounded-lg border border-line bg-raised px-3 py-2 text-sm placeholder:text-faint"
        />
        <button
          type="submit"
          className="rounded-lg border border-line px-4 py-2 text-sm text-muted hover:text-foreground"
        >
          Buscar
        </button>
      </form>

      <nav aria-label="Filtros" className="-mx-4 overflow-x-auto px-4">
        <ul className="flex gap-2 pb-1">
          {FILTROS.map((f) => (
            <li key={f.label}>
              <Link
                href={`/mi/personas${f.key ? `?filtro=${f.key}` : ""}${q ? `${f.key ? "&" : "?"}q=${encodeURIComponent(q)}` : ""}`}
                aria-current={filtro === f.key ? "page" : undefined}
                className={`inline-block whitespace-nowrap rounded-full border px-3 py-1.5 text-xs transition-colors ${
                  filtro === f.key
                    ? "border-accent bg-accent-soft font-medium text-accent-strong"
                    : "border-line text-muted hover:text-foreground"
                }`}
              >
                {f.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <SectionTitle>{plural(matches.length, "persona", "personas")}</SectionTitle>

      {matches.length === 0 ? (
        <EmptyState title={q ? `Sin resultados para «${q}»` : "Nadie coincide con ese filtro."}>
          Prueba con otra palabra: una ciudad, una habilidad o algo que alguien podría ofrecer.
        </EmptyState>
      ) : (
        <ul className="space-y-2">
          {matches.map((p) => (
            <li key={p.id}>
              <Link
                href={`/mi/personas/${p.id}`}
                className="flex items-start gap-3 rounded-(--radius-card) border border-line bg-surface px-4 py-3 transition-colors hover:bg-raised"
              >
                <Avatar name={p.full_name} size={40} />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">
                    {p.full_name}
                    {p.city && <span className="ml-2 text-xs font-normal text-faint">{p.city}</span>}
                  </p>
                  {(p.bio || p.declaration) && (
                    <p className="mt-0.5 line-clamp-2 text-xs text-muted">
                      {p.bio ?? `“${p.declaration}”`}
                    </p>
                  )}
                  <div className="mt-1.5 flex flex-wrap gap-1">
                    {p.available_to_serve && <Badge variant="aqua">Disponible para servir</Badge>}
                    {(p.skills ?? []).slice(0, 2).map((s) => (
                      <Badge key={s} variant="neutral">
                        {s}
                      </Badge>
                    ))}
                    {(p.looking_for ?? []).slice(0, 1).map((l) => (
                      <Badge key={l} variant="gold">
                        busca: {l}
                      </Badge>
                    ))}
                  </div>
                </div>
                <span aria-hidden className="mt-1 text-faint">
                  →
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
