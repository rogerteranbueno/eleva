import Link from "next/link";
import { requireMember } from "@/lib/context";
import { createUserClient } from "@/lib/supabase/server";
import { createComment } from "@/app/actions/member";
import { Card, SectionTitle, Avatar, EmptyState } from "@/components/ui";
import { Composer } from "@/components/hub/Composer";
import { ReactionBar } from "@/components/hub/ReactionBar";
import { POST_TYPE_BY_KIND, FIELD_LABELS } from "@/modules/community/postTypes";
import { timeAgo } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function MiGeneracionPage() {
  const ctx = await requireMember();
  const supabase = await createUserClient();

  const { data: participation } = await supabase
    .from("participations")
    .select("id, cohort_id, cohorts(id, name)")
    .eq("person_id", ctx.personId)
    .in("state", ["confirmado", "activo", "pausa"])
    .limit(1)
    .maybeSingle();

  if (!participation?.cohorts) {
    return <EmptyState title="Todavía no estás en una generación activa." />;
  }
  const cohort = participation.cohorts;

  const { data: posts } = await supabase
    .from("posts")
    .select(
      "id, kind, body, fields, created_at, author_person_id, people:author_person_id(id, full_name), comments(id, body, created_at, people:author_person_id(full_name)), post_reactions(kind, person_id)"
    )
    .eq("cohort_id", cohort.id)
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-8 max-w-2xl">
      <header>
        <h1 className="text-2xl font-bold tracking-tight">{cohort.name}</h1>
        <p className="mt-1 text-sm text-muted">
          Este espacio es de tu generación: lo que compartes aquí se queda aquí.
        </p>
      </header>

      <Composer
        cohortId={cohort.id}
        authorName={ctx.preferredName}
        isTeam={ctx.isTeam}
      />

      <section aria-label="Conversación">
        <SectionTitle>Conversación</SectionTitle>
        {(posts ?? []).length === 0 ? (
          <EmptyState title="Tu generación todavía no ha empezado a conversar.">
            Comparte tú lo primero — tu grupo lo va a recibir.
          </EmptyState>
        ) : (
          <ul className="space-y-4">
            {posts!.map((post) => {
              const typeDef = POST_TYPE_BY_KIND[post.kind];
              const fields = (post.fields ?? {}) as Record<string, string>;
              const counts: Record<string, number> = {};
              let mine: string | null = null;
              for (const r of post.post_reactions ?? []) {
                counts[r.kind] = (counts[r.kind] ?? 0) + 1;
                if (r.person_id === ctx.personId) mine = r.kind;
              }
              return (
                <li key={post.id}>
                  <Card>
                    <div className="flex items-center gap-3">
                      <Avatar name={post.people?.full_name ?? "?"} size={34} />
                      <div className="min-w-0 flex-1">
                        <Link
                          href={`/mi/personas/${post.people?.id}`}
                          className="text-sm font-medium hover:text-accent-strong"
                        >
                          {post.people?.full_name}
                        </Link>
                        <p className="text-xs text-faint">
                          <span aria-hidden>{typeDef?.emoji}</span>{" "}
                          {typeDef?.label ?? post.kind} · {timeAgo(post.created_at)}
                        </p>
                      </div>
                    </div>

                    {Object.keys(fields).length > 0 && (
                      <dl className="mt-3 space-y-1.5 rounded-lg bg-raised px-3 py-2.5">
                        {Object.entries(fields).map(([key, value]) => (
                          <div key={key} className="text-sm">
                            <dt className="inline font-semibold text-muted">
                              {FIELD_LABELS[key] ?? key}:{" "}
                            </dt>
                            <dd className="inline">{value}</dd>
                          </div>
                        ))}
                      </dl>
                    )}

                    <p className="mt-3 text-sm leading-relaxed">{post.body}</p>

                    <ReactionBar postId={post.id} counts={counts} mine={mine} />

                    {(post.comments ?? []).length > 0 && (
                      <ul className="mt-4 space-y-2 border-t border-line pt-3">
                        {post.comments!.map((c) => (
                          <li key={c.id} className="flex items-start gap-2.5">
                            <Avatar name={c.people?.full_name ?? "?"} size={26} />
                            <div>
                              <p className="text-xs font-medium">{c.people?.full_name}</p>
                              <p className="text-sm text-muted">{c.body}</p>
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}

                    <form action={createComment} className="mt-3 flex gap-2">
                      <input type="hidden" name="postId" value={post.id} />
                      <label htmlFor={`comment-${post.id}`} className="sr-only">
                        Responder
                      </label>
                      <input
                        id={`comment-${post.id}`}
                        name="body"
                        type="text"
                        required
                        placeholder="Responder…"
                        className="flex-1 rounded-lg border border-line bg-raised px-3 py-1.5 text-sm placeholder:text-faint"
                      />
                      <button
                        type="submit"
                        className="rounded-lg border border-line px-3 py-1.5 text-sm text-muted hover:text-foreground"
                      >
                        Enviar
                      </button>
                    </form>
                  </Card>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
