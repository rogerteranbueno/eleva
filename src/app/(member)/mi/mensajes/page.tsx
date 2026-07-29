import Link from "next/link";
import { requireMember } from "@/lib/context";
import { createUserClient, createServiceClient } from "@/lib/supabase/server";
import { resolveMessageRequest, resolveConnection } from "@/app/actions/community";
import { Card, SectionTitle, Avatar, EmptyState, Badge } from "@/components/ui";
import { timeAgo } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function MensajesPage() {
  const ctx = await requireMember();
  const supabase = await createUserClient();

  // RLS: solo devuelve conversaciones de las que esta persona es miembro.
  const { data: memberships } = await supabase
    .from("conversation_members")
    .select("conversation_id, last_read_at, conversations(id, last_message_at)")
    .eq("person_id", ctx.personId);

  const convIds = (memberships ?? []).map((m) => m.conversation_id);
  const { data: messages } = convIds.length
    ? await supabase
        .from("messages")
        .select("id, conversation_id, sender_person_id, body, created_at")
        .in("conversation_id", convIds)
        .order("created_at", { ascending: false })
    : { data: [] };

  // El nombre de la otra persona se resuelve en servidor.
  const service = createServiceClient();
  const { data: others } = convIds.length
    ? await service
        .from("conversation_members")
        .select("conversation_id, person_id, people(id, full_name)")
        .in("conversation_id", convIds)
        .neq("person_id", ctx.personId)
    : { data: [] };
  const otherBy = new Map(
    (others ?? []).map((o) => [o.conversation_id, o.people])
  );

  const threads = (memberships ?? [])
    .map((m) => {
      const last = (messages ?? []).find((x) => x.conversation_id === m.conversation_id);
      const unread =
        !!last &&
        last.sender_person_id !== ctx.personId &&
        (!m.last_read_at || last.created_at > m.last_read_at);
      return { id: m.conversation_id, other: otherBy.get(m.conversation_id), last, unread };
    })
    .filter((t) => t.last)
    .sort((a, b) => (b.last!.created_at ?? "").localeCompare(a.last!.created_at ?? ""));

  const [{ data: msgRequests }, { data: connRequests }] = await Promise.all([
    supabase
      .from("message_requests")
      .select("id, body, created_at, from_person_id")
      .eq("to_person_id", ctx.personId)
      .eq("status", "pendiente"),
    supabase
      .from("connection_requests")
      .select("id, message, created_at, from_person_id")
      .eq("to_person_id", ctx.personId)
      .eq("status", "pendiente"),
  ]);

  const senderIds = [
    ...(msgRequests ?? []).map((r) => r.from_person_id),
    ...(connRequests ?? []).map((r) => r.from_person_id),
  ];
  const { data: senders } = senderIds.length
    ? await service.from("people").select("id, full_name").in("id", senderIds)
    : { data: [] };
  const nameOf = (id: string) =>
    (senders ?? []).find((s) => s.id === id)?.full_name ?? "Alguien del centro";

  return (
    <div className="space-y-6 max-w-2xl">
      <header>
        <h1 className="text-2xl font-bold tracking-tight">Mensajes</h1>
        <p className="mt-1 text-sm text-muted">
          Conversaciones privadas entre dos personas.{" "}
          <strong className="text-foreground">Tu centro no puede leerlas.</strong>
        </p>
      </header>

      {(connRequests ?? []).length > 0 && (
        <section aria-label="Solicitudes de conexión">
          <SectionTitle>Quieren conectar contigo</SectionTitle>
          <ul className="space-y-2">
            {(connRequests ?? []).map((r) => (
              <li key={r.id}>
                <Card className="!py-3.5">
                  <div className="flex items-center gap-2.5">
                    <Avatar name={nameOf(r.from_person_id)} size={32} />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium">{nameOf(r.from_person_id)}</p>
                      {r.message && <p className="text-xs text-muted">{r.message}</p>}
                    </div>
                  </div>
                  <div className="mt-2.5 flex gap-2">
                    <form action={resolveConnection} className="flex-1">
                      <input type="hidden" name="requestId" value={r.id} />
                      <input type="hidden" name="accept" value="1" />
                      <button
                        type="submit"
                        className="w-full rounded-lg bg-accent px-3 py-1.5 text-xs font-semibold text-[#0b0a12]"
                      >
                        Aceptar
                      </button>
                    </form>
                    <form action={resolveConnection} className="flex-1">
                      <input type="hidden" name="requestId" value={r.id} />
                      <input type="hidden" name="accept" value="0" />
                      <button
                        type="submit"
                        className="w-full rounded-lg border border-line px-3 py-1.5 text-xs text-muted"
                      >
                        Ahora no
                      </button>
                    </form>
                  </div>
                </Card>
              </li>
            ))}
          </ul>
        </section>
      )}

      {(msgRequests ?? []).length > 0 && (
        <section aria-label="Solicitudes de mensaje">
          <SectionTitle>Solicitudes de mensaje</SectionTitle>
          <p className="-mt-1 mb-2 text-xs text-faint">
            De personas con las que aún no estás conectada. Nadie te escribe sin que tú lo
            permitas.
          </p>
          <ul className="space-y-2">
            {(msgRequests ?? []).map((r) => (
              <li key={r.id}>
                <Card className="!py-3.5">
                  <div className="flex items-center gap-2.5">
                    <Avatar name={nameOf(r.from_person_id)} size={32} />
                    <p className="text-sm font-medium">{nameOf(r.from_person_id)}</p>
                    <span className="ml-auto text-xs text-faint">{timeAgo(r.created_at)}</span>
                  </div>
                  <p className="mt-2 text-sm text-muted">{r.body}</p>
                  <div className="mt-2.5 flex gap-2">
                    <form action={resolveMessageRequest} className="flex-1">
                      <input type="hidden" name="requestId" value={r.id} />
                      <input type="hidden" name="accept" value="1" />
                      <button
                        type="submit"
                        className="w-full rounded-lg bg-accent px-3 py-1.5 text-xs font-semibold text-[#0b0a12]"
                      >
                        Aceptar y responder
                      </button>
                    </form>
                    <form action={resolveMessageRequest} className="flex-1">
                      <input type="hidden" name="requestId" value={r.id} />
                      <input type="hidden" name="accept" value="0" />
                      <button
                        type="submit"
                        className="w-full rounded-lg border border-line px-3 py-1.5 text-xs text-muted"
                      >
                        Descartar
                      </button>
                    </form>
                  </div>
                </Card>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section aria-label="Conversaciones">
        <SectionTitle>Conversaciones</SectionTitle>
        {threads.length === 0 ? (
          <EmptyState title="Todavía no tienes conversaciones.">
            Desde el perfil de alguien de tu centro puedes enviarle un mensaje.
          </EmptyState>
        ) : (
          <ul className="space-y-2">
            {threads.map((t) => (
              <li key={t.id}>
                <Link
                  href={`/mi/mensajes/${t.id}`}
                  className="flex items-center gap-3 rounded-(--radius-card) border border-line bg-surface px-4 py-3 transition-colors hover:bg-raised"
                >
                  <Avatar name={t.other?.full_name ?? "?"} size={38} />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium">
                      {t.other?.full_name ?? "Conversación"}
                      {t.unread && (
                        <span className="ml-2">
                          <Badge variant="accent">nuevo</Badge>
                        </span>
                      )}
                    </p>
                    <p className="truncate text-xs text-muted">{t.last?.body}</p>
                  </div>
                  <span className="shrink-0 text-xs text-faint">
                    {t.last && timeAgo(t.last.created_at)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
