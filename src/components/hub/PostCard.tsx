import Link from "next/link";
import { Card, Avatar, Badge } from "@/components/ui";
import { ReactionBar } from "@/components/hub/ReactionBar";
import { PostMenu } from "@/components/hub/PostMenu";
import { POST_TYPE_BY_KIND, FIELD_LABELS } from "@/modules/community/postTypes";
import { createComment } from "@/app/actions/member";
import { timeAgo, plural } from "@/lib/format";

export type PostForCard = {
  id: string;
  kind: string;
  body: string;
  fields: Record<string, string> | null;
  created_at: string;
  edited_at: string | null;
  author_person_id: string;
  people: { id: string; full_name: string } | null;
  comments: {
    id: string;
    body: string;
    created_at: string;
    people: { full_name: string } | null;
  }[];
  post_reactions: { kind: string; person_id: string }[];
  saved_posts?: { person_id: string }[];
  spaces?: { name: string } | null;
};

/**
 * Tarjeta de publicación. Muestra SIEMPRE su audiencia (en qué espacio vive),
 * porque en una red con círculos concéntricos lo peor que puede pasar es que
 * alguien crea que escribió en privado y en realidad escribió al centro.
 */
export function PostCard({
  post,
  personId,
  showSpace = false,
  detail = false,
}: {
  post: PostForCard;
  personId: string;
  showSpace?: boolean;
  detail?: boolean;
}) {
  const typeDef = POST_TYPE_BY_KIND[post.kind];
  const fields = post.fields ?? {};
  const counts: Record<string, number> = {};
  let mine: string | null = null;
  for (const r of post.post_reactions ?? []) {
    counts[r.kind] = (counts[r.kind] ?? 0) + 1;
    if (r.person_id === personId) mine = r.kind;
  }
  const saved = (post.saved_posts ?? []).some((s) => s.person_id === personId);
  const comments = post.comments ?? [];
  const visible = detail ? comments : comments.slice(-2);

  return (
    <Card>
      <div className="flex items-start gap-3">
        <Avatar name={post.people?.full_name ?? "?"} size={34} />
        <div className="min-w-0 flex-1">
          <Link
            href={`/mi/personas/${post.people?.id}`}
            className="text-sm font-medium hover:text-accent-strong"
          >
            {post.people?.full_name}
          </Link>
          <p className="text-xs text-faint">
            <span aria-hidden>{typeDef?.emoji}</span> {typeDef?.label ?? post.kind} ·{" "}
            <Link href={`/mi/comunidad/p/${post.id}`} className="hover:text-muted">
              {timeAgo(post.created_at)}
            </Link>
            {post.edited_at && " · editada"}
            {showSpace && post.spaces?.name && (
              <>
                {" · "}
                <span className="text-muted">{post.spaces.name}</span>
              </>
            )}
          </p>
        </div>
        <PostMenu
          postId={post.id}
          isAuthor={post.author_person_id === personId}
          saved={saved}
          body={post.body}
        />
      </div>

      {Object.keys(fields).length > 0 && (
        <dl className="mt-3 space-y-1.5 rounded-lg bg-raised px-3 py-2.5">
          {Object.entries(fields).map(([key, value]) => (
            <div key={key} className="text-sm">
              <dt className="inline font-semibold text-muted">{FIELD_LABELS[key] ?? key}: </dt>
              <dd className="inline">{value}</dd>
            </div>
          ))}
        </dl>
      )}

      <p className="mt-3 text-sm leading-relaxed whitespace-pre-line">{post.body}</p>

      <ReactionBar postId={post.id} counts={counts} mine={mine} />

      {comments.length > visible.length && (
        <Link
          href={`/mi/comunidad/p/${post.id}`}
          className="mt-3 block text-xs text-accent-strong hover:underline underline-offset-4"
        >
          Ver {plural(comments.length, "respuesta", "respuestas")}
        </Link>
      )}

      {visible.length > 0 && (
        <ul className="mt-3 space-y-2 border-t border-line pt-3">
          {visible.map((c) => (
            <li key={c.id} className="flex items-start gap-2.5">
              <Avatar name={c.people?.full_name ?? "?"} size={26} />
              <div className="min-w-0">
                <p className="text-xs font-medium">
                  {c.people?.full_name}{" "}
                  <span className="font-normal text-faint">{timeAgo(c.created_at)}</span>
                </p>
                <p className="text-sm text-muted">{c.body}</p>
              </div>
            </li>
          ))}
        </ul>
      )}

      {comments.length === 0 && (
        <p className="mt-3 border-t border-line pt-3 text-xs text-faint">
          Aún sin respuestas. Toda primera contribución merece una.
        </p>
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
  );
}

export function PostKindBadge({ kind }: { kind: string }) {
  const def = POST_TYPE_BY_KIND[kind];
  return <Badge variant="neutral">{def?.label ?? kind}</Badge>;
}
