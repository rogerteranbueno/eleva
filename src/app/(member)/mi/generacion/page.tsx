import { requireMember } from "@/lib/context";
import { createUserClient } from "@/lib/supabase/server";
import { createPost, createComment } from "@/app/actions/member";
import {
  Card,
  SectionTitle,
  Avatar,
  EmptyState,
  POST_KIND_LABEL,
} from "@/components/ui";
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
    return (
      <EmptyState title="Todavía no estás en una generación activa." />
    );
  }
  const cohort = participation.cohorts;

  const { data: posts } = await supabase
    .from("posts")
    .select(
      "id, kind, body, created_at, people:author_person_id(full_name), comments(id, body, created_at, people:author_person_id(full_name))"
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

      <section aria-label="Publicar">
        <Card>
          <form action={createPost} className="space-y-3">
            <input type="hidden" name="cohortId" value={cohort.id} />
            <div className="flex gap-2">
              <label htmlFor="kind" className="sr-only">
                Tipo de publicación
              </label>
              <select
                id="kind"
                name="kind"
                className="rounded-lg border border-line bg-raised px-3 py-2 text-sm"
              >
                <option value="declaracion">Declaración</option>
                <option value="aprendizaje">Aprendizaje</option>
                <option value="pregunta">Pregunta</option>
                <option value="celebracion">Celebración</option>
                <option value="evidencia">Evidencia</option>
              </select>
            </div>
            <label htmlFor="body" className="sr-only">
              Tu publicación
            </label>
            <textarea
              id="body"
              name="body"
              rows={3}
              required
              placeholder={`¿Qué quieres compartir con tu generación, ${ctx.preferredName}?`}
              className="w-full rounded-lg border border-line bg-raised px-3 py-2 text-sm leading-relaxed placeholder:text-faint"
            />
            <div className="flex justify-end">
              <button
                type="submit"
                className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-[#0b0a12] hover:opacity-90"
              >
                Compartir
              </button>
            </div>
          </form>
        </Card>
      </section>

      <section aria-label="Conversación">
        <SectionTitle>Conversación</SectionTitle>
        {(posts ?? []).length === 0 ? (
          <EmptyState title="Tu generación todavía no ha empezado a conversar.">
            Comparte tú lo primero — tu grupo lo va a recibir.
          </EmptyState>
        ) : (
          <ul className="space-y-4">
            {posts!.map((post) => (
              <li key={post.id}>
                <Card>
                  <div className="flex items-center gap-3">
                    <Avatar name={post.people?.full_name ?? "?"} size={34} />
                    <div>
                      <p className="text-sm font-medium">{post.people?.full_name}</p>
                      <p className="text-xs text-faint">
                        {POST_KIND_LABEL[post.kind] ?? post.kind} ·{" "}
                        {timeAgo(post.created_at)}
                      </p>
                    </div>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed">{post.body}</p>

                  {(post.comments ?? []).length > 0 && (
                    <ul className="mt-4 space-y-2 border-t border-line pt-3">
                      {post.comments!.map((c) => (
                        <li key={c.id} className="flex items-start gap-2.5">
                          <Avatar name={c.people?.full_name ?? "?"} size={26} />
                          <div>
                            <p className="text-xs font-medium">
                              {c.people?.full_name}
                            </p>
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
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
