import Link from "next/link";
import { requireMember } from "@/lib/context";
import { createUserClient } from "@/lib/supabase/server";
import { markNotificationsRead } from "@/app/actions/member";
import { EmptyState } from "@/components/ui";
import { timeAgo } from "@/lib/format";

export const dynamic = "force-dynamic";

const KIND_EMOJI: Record<string, string> = {
  reaccion: "💫",
  comentario: "💬",
  reconocimiento: "🏅",
  evento: "📅",
  sistema: "✦",
};

export default async function AvisosPage() {
  const ctx = await requireMember();
  const supabase = await createUserClient();

  const { data: notifications } = await supabase
    .from("notifications")
    .select("id, kind, text, href, read, created_at")
    .eq("person_id", ctx.personId)
    .order("created_at", { ascending: false })
    .limit(50);

  const unread = (notifications ?? []).filter((n) => !n.read).length;

  return (
    <div className="space-y-6 max-w-2xl">
      <header className="flex items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Avisos</h1>
          <p className="mt-1 text-sm text-muted">Lo que tu comunidad hizo contigo.</p>
        </div>
        {unread > 0 && (
          <form action={markNotificationsRead}>
            <button
              type="submit"
              className="rounded-lg border border-line px-3 py-1.5 text-xs text-muted hover:text-foreground"
            >
              Marcar leídos ({unread})
            </button>
          </form>
        )}
      </header>

      {(notifications ?? []).length === 0 ? (
        <EmptyState title="Sin avisos por ahora.">
          Cuando alguien reaccione, responda o te reconozca, lo verás aquí.
        </EmptyState>
      ) : (
        <ul className="divide-y divide-line rounded-(--radius-card) border border-line bg-surface">
          {notifications!.map((n) => {
            const inner = (
              <div
                className={`flex items-start gap-3 px-4 py-3 ${
                  n.read ? "opacity-70" : ""
                }`}
              >
                <span aria-hidden className="mt-0.5">
                  {KIND_EMOJI[n.kind] ?? "✦"}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm leading-snug">{n.text}</p>
                  <p className="mt-0.5 text-xs text-faint">{timeAgo(n.created_at)}</p>
                </div>
                {!n.read && (
                  <span aria-label="sin leer" className="mt-1.5 size-2 rounded-full bg-accent" />
                )}
              </div>
            );
            return (
              <li key={n.id}>
                {n.href ? (
                  <Link href={n.href} className="block transition-colors hover:bg-raised">
                    {inner}
                  </Link>
                ) : (
                  inner
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
