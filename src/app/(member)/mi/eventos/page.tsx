import { requireMember } from "@/lib/context";
import { createUserClient } from "@/lib/supabase/server";
import { rsvpToEvent } from "@/app/actions/member";
import { Card, SectionTitle, EmptyState, Badge } from "@/components/ui";
import { dateTime } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function MisEventosPage() {
  const ctx = await requireMember();
  const supabase = await createUserClient();

  const now = new Date().toISOString();
  const [{ data: upcoming }, { data: myRsvps }] = await Promise.all([
    supabase
      .from("events")
      .select("id, title, description, starts_at, modality, location_text, cohort_id, cohorts(name)")
      .eq("organization_id", ctx.organizationId)
      .gt("starts_at", now)
      .order("starts_at"),
    supabase.from("rsvps").select("event_id, status").eq("person_id", ctx.personId),
  ]);

  const rsvpBy = new Map((myRsvps ?? []).map((r) => [r.event_id, r.status]));

  return (
    <div className="space-y-6 max-w-2xl">
      <header>
        <h1 className="text-2xl font-bold tracking-tight">Eventos</h1>
        <p className="mt-1 text-sm text-muted">
          Lo que viene para ti y para tu centro. Confirmar ayuda a tu equipo a
          prepararte un buen lugar.
        </p>
      </header>

      <SectionTitle>Próximos</SectionTitle>
      {(upcoming ?? []).length === 0 ? (
        <EmptyState title="No hay eventos próximos.">
          Cuando tu centro publique el siguiente, lo verás aquí primero.
        </EmptyState>
      ) : (
        <ul className="space-y-3">
          {upcoming!.map((event) => {
            const status = rsvpBy.get(event.id);
            return (
              <li key={event.id}>
                <Card>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold">{event.title}</p>
                      <p className="mt-0.5 text-xs text-faint">
                        {event.cohorts?.name ?? "Todo el centro"}
                      </p>
                    </div>
                    {status === "confirmado" && <Badge variant="ok">Confirmado</Badge>}
                    {status === "no_puedo" && <Badge variant="neutral">No puedo</Badge>}
                  </div>
                  <p className="mt-2 text-sm text-muted">{event.description}</p>
                  <p className="mt-2 text-sm">
                    {dateTime(event.starts_at)}{" "}
                    <span className="text-faint">
                      · {event.modality} · {event.location_text}
                    </span>
                  </p>
                  {status !== "confirmado" && (
                    <div className="mt-3 flex gap-2">
                      <form action={rsvpToEvent}>
                        <input type="hidden" name="eventId" value={event.id} />
                        <input type="hidden" name="status" value="confirmado" />
                        <button
                          type="submit"
                          className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-[#0b0a12] hover:opacity-90"
                        >
                          Confirmar mi lugar
                        </button>
                      </form>
                      {!status && (
                        <form action={rsvpToEvent}>
                          <input type="hidden" name="eventId" value={event.id} />
                          <input type="hidden" name="status" value="no_puedo" />
                          <button
                            type="submit"
                            className="rounded-lg border border-line px-4 py-2 text-sm text-muted hover:text-foreground"
                          >
                            No puedo esta vez
                          </button>
                        </form>
                      )}
                    </div>
                  )}
                </Card>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
