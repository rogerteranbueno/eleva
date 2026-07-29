import Link from "next/link";
import { requireMember } from "@/lib/context";
import { createUserClient } from "@/lib/supabase/server";
import { joinSpace } from "@/app/actions/community";
import { Composer } from "@/components/hub/Composer";
import { PostCard, type PostForCard } from "@/components/hub/PostCard";
import { Card, SectionTitle, Badge, EmptyState, Avatar } from "@/components/ui";
import { listSpacesFor, defaultSpace, SPACE_KIND_HINT, SPACE_KIND_LABEL } from "@/modules/community/spaces";
import { plural, timeAgo } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function ComunidadPage({
  searchParams,
}: {
  searchParams: Promise<{ espacio?: string }>;
}) {
  const { espacio } = await searchParams;
  const ctx = await requireMember();
  // Cliente de USUARIO: RLS decide qué espacios existen para esta persona.
  const supabase = await createUserClient();

  const spaces = await listSpacesFor(supabase, ctx.personId);
  if (spaces.length === 0) {
    return (
      <EmptyState title="Todavía no perteneces a ningún espacio.">
        Cuando tu centro confirme tu inscripción, aquí vivirá la conversación de tu
        generación y la del centro.
      </EmptyState>
    );
  }

  const active =
    spaces.find((s) => s.slug === espacio) ?? defaultSpace(spaces) ?? spaces[0];

  const { data: posts } = await supabase
    .from("posts")
    .select(
      "id, kind, body, fields, created_at, edited_at, author_person_id, people:author_person_id(id, full_name), comments(id, body, created_at, people:author_person_id(full_name)), post_reactions(kind, person_id), saved_posts(person_id), spaces(name)"
    )
    .eq("space_id", active.id)
    .is("deleted_at", null)
    .order("created_at", { ascending: false })
    .limit(30);

  // Lo primero que importa al entrar: lo que espera respuesta tuya.
  const { data: mentions } = await supabase
    .from("post_mentions")
    .select("post_id, posts(id, body, people:author_person_id(full_name))")
    .eq("person_id", ctx.personId)
    .limit(3);

  const sinRespuesta = (posts ?? []).filter(
    (p) => (p.comments ?? []).length === 0 && p.author_person_id !== ctx.personId
  );

  return (
    <div className="space-y-6 max-w-2xl">
      <header>
        <h1 className="text-2xl font-bold tracking-tight">Comunidad</h1>
        <p className="mt-1 text-sm text-muted">
          Tu generación, tu centro y sus círculos. Cada espacio tiene su propia audiencia.
        </p>
      </header>

      {/* Pestañas de espacios */}
      <nav aria-label="Espacios" className="-mx-4 overflow-x-auto px-4">
        <ul className="flex gap-2 pb-1">
          {spaces.map((s) => (
            <li key={s.id}>
              <Link
                href={`/mi/comunidad?espacio=${s.slug}`}
                aria-current={s.id === active.id ? "page" : undefined}
                className={`inline-block whitespace-nowrap rounded-full border px-3.5 py-1.5 text-sm transition-colors ${
                  s.id === active.id
                    ? "border-accent bg-accent-soft font-medium text-accent-strong"
                    : "border-line text-muted hover:border-line-strong hover:text-foreground"
                }`}
              >
                {s.kind === "circulo" || s.kind === "grupo" ? s.name : SPACE_KIND_LABEL[s.kind]}
                {!s.isMember && <span className="ml-1 text-xs text-faint">+</span>}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Cabecera del espacio activo */}
      <Card className="!py-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className="font-semibold">{active.name}</h2>
            <p className="mt-0.5 text-sm text-muted">
              {active.purpose ?? SPACE_KIND_HINT[active.kind]}
            </p>
            <p className="mt-1 text-xs text-faint">
              {plural(active.memberCount, "persona", "personas")}
              {active.hostName && ` · anfitriona: ${active.hostName}`}
              {active.ritual && ` · ${active.ritual}`}
            </p>
          </div>
          {active.canJoin && (
            <form action={joinSpace}>
              <input type="hidden" name="spaceId" value={active.id} />
              <button
                type="submit"
                className="rounded-lg bg-accent px-3.5 py-1.5 text-xs font-semibold text-[#0b0a12] hover:opacity-90"
              >
                Unirme
              </button>
            </form>
          )}
        </div>
      </Card>

      {/* Menciones: lo que te espera */}
      {(mentions ?? []).length > 0 && (
        <section aria-label="Te mencionaron">
          <SectionTitle>Te mencionaron</SectionTitle>
          <ul className="space-y-2">
            {(mentions ?? []).map((m) => (
              <li key={m.post_id}>
                <Link
                  href={`/mi/comunidad/p/${m.post_id}`}
                  className="block rounded-(--radius-card) border border-accent/30 bg-accent-soft/30 px-4 py-3 text-sm hover:border-accent"
                >
                  <span className="font-medium">{m.posts?.people?.full_name}</span>{" "}
                  <span className="text-muted line-clamp-1">{m.posts?.body}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {active.isMember ? (
        <Composer
          spaceId={active.id}
          spaceName={active.name}
          authorName={ctx.preferredName}
          isTeam={ctx.isTeam}
        />
      ) : (
        <Card className="!py-4">
          <p className="text-sm text-muted">
            Estás viendo este espacio como visitante. Únete para poder participar.
          </p>
        </Card>
      )}

      {/* Lo que espera respuesta */}
      {sinRespuesta.length > 0 && (
        <div className="rounded-(--radius-card) border border-gold/30 bg-gold-soft/30 px-4 py-3">
          <p className="text-sm text-gold">
            {plural(sinRespuesta.length, "publicación sigue", "publicaciones siguen")} sin
            respuesta. Responder una es la forma más simple de sostener este lugar.
          </p>
        </div>
      )}

      <section aria-label="Conversación">
        {(posts ?? []).length === 0 ? (
          <EmptyState title={`${active.name} todavía no ha empezado a conversar.`}>
            Comparte tú lo primero — quien esté aquí lo va a recibir.
          </EmptyState>
        ) : (
          <ul className="space-y-4">
            {(posts ?? []).map((post) => (
              <li key={post.id}>
                <PostCard post={post as unknown as PostForCard} personId={ctx.personId} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
