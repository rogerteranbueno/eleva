import Link from "next/link";
import { notFound } from "next/navigation";
import { requireMember } from "@/lib/context";
import { createUserClient } from "@/lib/supabase/server";
import { PostCard, type PostForCard } from "@/components/hub/PostCard";
import { Badge } from "@/components/ui";
import { dateTime } from "@/lib/format";

export const dynamic = "force-dynamic";

/** Permalink de una publicación: una conversación tiene su propia dirección,
 *  para poder volver desde un aviso o compartirla dentro del centro. */
export default async function PostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const ctx = await requireMember();
  const supabase = await createUserClient();

  const { data: post } = await supabase
    .from("posts")
    .select(
      "id, kind, body, fields, created_at, edited_at, author_person_id, people:author_person_id(id, full_name), comments(id, body, created_at, people:author_person_id(full_name)), post_reactions(kind, person_id), saved_posts(person_id), spaces(id, name, slug, kind)"
    )
    .eq("id", id)
    .is("deleted_at", null)
    .maybeSingle();

  // Si RLS no la devuelve, para esta persona la publicación no existe.
  if (!post) notFound();

  return (
    <div className="space-y-5 max-w-2xl">
      <nav aria-label="Miga de pan" className="flex items-center gap-2 text-sm text-faint">
        <Link
          href={`/mi/comunidad?espacio=${post.spaces?.slug ?? ""}`}
          className="hover:text-muted"
        >
          ← {post.spaces?.name ?? "Comunidad"}
        </Link>
      </nav>

      <PostCard post={post as unknown as PostForCard} personId={ctx.personId} detail showSpace />

      <p className="text-xs text-faint">
        Publicada el {dateTime(post.created_at)} en{" "}
        <strong className="text-muted">{post.spaces?.name}</strong>.{" "}
        <Badge variant="neutral">Solo quien pertenece a ese espacio puede verla</Badge>
      </p>
    </div>
  );
}
