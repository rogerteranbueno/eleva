import Link from "next/link";
import { notFound } from "next/navigation";
import { requireMember } from "@/lib/context";
import { createUserClient, createServiceClient } from "@/lib/supabase/server";
import { sendMessage } from "@/app/actions/community";
import { Avatar } from "@/components/ui";
import { dateTime } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function ConversacionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const ctx = await requireMember();
  const supabase = await createUserClient();

  // RLS: si no eres miembro de la conversación, no existe.
  const { data: conversation } = await supabase
    .from("conversations")
    .select("id")
    .eq("id", id)
    .maybeSingle();
  if (!conversation) notFound();

  const { data: messages } = await supabase
    .from("messages")
    .select("id, sender_person_id, body, created_at")
    .eq("conversation_id", id)
    .order("created_at");

  const service = createServiceClient();
  const { data: other } = await service
    .from("conversation_members")
    .select("people(id, full_name)")
    .eq("conversation_id", id)
    .neq("person_id", ctx.personId)
    .maybeSingle();

  // Marcar leído al abrir.
  await supabase
    .from("conversation_members")
    .update({ last_read_at: new Date().toISOString() })
    .eq("conversation_id", id)
    .eq("person_id", ctx.personId);

  return (
    <div className="flex h-full flex-col space-y-4 max-w-2xl">
      <nav aria-label="Miga de pan" className="text-sm text-faint">
        <Link href="/mi/mensajes" className="hover:text-muted">
          ← Mensajes
        </Link>
      </nav>

      <header className="flex items-center gap-3">
        <Avatar name={other?.people?.full_name ?? "?"} size={40} />
        <div>
          <h1 className="font-semibold">
            {other?.people ? (
              <Link
                href={`/mi/personas/${other.people.id}`}
                className="hover:text-accent-strong"
              >
                {other.people.full_name}
              </Link>
            ) : (
              "Conversación"
            )}
          </h1>
          <p className="text-xs text-faint">Solo ustedes dos pueden leer esto.</p>
        </div>
      </header>

      <ul className="flex-1 space-y-2.5">
        {(messages ?? []).map((m) => {
          const mine = m.sender_person_id === ctx.personId;
          return (
            <li key={m.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[78%] rounded-2xl px-3.5 py-2 ${
                  mine
                    ? "rounded-br-sm bg-accent-soft text-foreground"
                    : "rounded-bl-sm border border-line bg-surface"
                }`}
              >
                <p className="text-sm leading-relaxed whitespace-pre-line">{m.body}</p>
                <p className="mt-1 text-[11px] text-faint">{dateTime(m.created_at)}</p>
              </div>
            </li>
          );
        })}
      </ul>

      <form action={sendMessage} className="sticky bottom-20 flex gap-2 md:bottom-0">
        <input type="hidden" name="conversationId" value={id} />
        <label htmlFor="msg" className="sr-only">
          Mensaje
        </label>
        <input
          id="msg"
          name="body"
          required
          placeholder="Escribe un mensaje…"
          className="flex-1 rounded-lg border border-line bg-raised px-3 py-2.5 text-sm placeholder:text-faint"
        />
        <button
          type="submit"
          className="rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-[#0b0a12] hover:opacity-90"
        >
          Enviar
        </button>
      </form>
    </div>
  );
}
