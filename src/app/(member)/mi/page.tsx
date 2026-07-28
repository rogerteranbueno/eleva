import Link from "next/link";
import { requireMember } from "@/lib/context";
import { createServiceClient, createUserClient } from "@/lib/supabase/server";
import { rsvpToEvent, completeMission } from "@/app/actions/member";
import {
  Card,
  SectionTitle,
  Avatar,
  EmptyState,
  POST_KIND_LABEL,
} from "@/components/ui";
import { dateTime, relativeDays, MODALITY_LABEL } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function MiPage() {
  const ctx = await requireMember();
  // Lecturas con el cliente del USUARIO: RLS decide qué existe para esta persona.
  const supabase = await createUserClient();

  const { data: participation } = await supabase
    .from("participations")
    .select("id, state, cohort_id, cohorts(id, name, starts_on, ends_on, status)")
    .eq("person_id", ctx.personId)
    .in("state", ["confirmado", "activo", "pausa"])
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const cohort = participation?.cohorts;

  if (!participation || !cohort) {
    return (
      <EmptyState title={`Hola, ${ctx.preferredName}.`}>
        Todavía no estás en una generación activa. Cuando tu centro confirme tu
        inscripción, aquí verás qué te toca, quién te acompaña y qué está pasando
        en tu grupo.
      </EmptyState>
    );
  }

  const now = new Date().toISOString();
  const [sessions, nextEvents, myRsvps, missions, myCompletions, posts] =
    await Promise.all([
      supabase
        .from("sessions")
        .select("id, name, starts_at")
        .eq("cohort_id", cohort.id)
        .order("starts_at"),
      supabase
        .from("events")
        .select("id, title, description, starts_at, modality, location_text, cohort_id")
        .eq("organization_id", ctx.organizationId)
        .gt("starts_at", now)
        .order("starts_at")
        .limit(3),
      supabase.from("rsvps").select("event_id, status").eq("person_id", ctx.personId),
      supabase
        .from("missions")
        .select("id, title, description, due_on, sequence")
        .eq("cohort_id", cohort.id)
        .order("sequence"),
      supabase
        .from("mission_completions")
        .select("mission_id")
        .eq("participation_id", participation.id),
      supabase
        .from("posts")
        .select("id, kind, body, created_at, people:author_person_id(full_name), comments(id)")
        .eq("cohort_id", cohort.id)
        .order("created_at", { ascending: false })
        .limit(3),
    ]);

  // "Quién te acompaña": nombres del grupo pequeño (visibles por política de
  // compañeros de generación; el join operativo se resuelve en servidor).
  const service = createServiceClient();
  const { data: myGroupRow } = await service
    .from("small_group_members")
    .select("small_group_id, small_groups(name, people:staff_person_id(full_name))")
    .eq("participation_id", participation.id)
    .maybeSingle();
  const { data: groupMates } = myGroupRow
    ? await service
        .from("small_group_members")
        .select("participations(person_id, people(full_name))")
        .eq("small_group_id", myGroupRow.small_group_id)
    : { data: [] };

  const rsvpBy = new Map((myRsvps.data ?? []).map((r) => [r.event_id, r.status]));
  const completedSet = new Set((myCompletions.data ?? []).map((m) => m.mission_id));
  const pendingMissions = (missions.data ?? []).filter((m) => !completedSet.has(m.id));
  const nextEvent = (nextEvents.data ?? [])[0];
  const nextEventUnanswered = nextEvent && !rsvpBy.has(nextEvent.id);
  const pastSessions = (sessions.data ?? []).filter((s) => new Date(s.starts_at) < new Date());
  const nextSession = (sessions.data ?? []).find((s) => new Date(s.starts_at) >= new Date());

  const nextAction = nextEventUnanswered
    ? { label: `Confirma tu lugar en «${nextEvent.title}»`, href: "#proximo-evento" }
    : pendingMissions.length > 0
      ? { label: `Tienes una misión pendiente: ${pendingMissions[0].title}`, href: "#misiones" }
      : { label: "Comparte cómo vas con tu generación", href: "/mi/generacion" };

  return (
    <div className="space-y-8 max-w-2xl">
      <header>
        <h1 className="text-2xl font-bold tracking-tight">
          Hola, {ctx.preferredName}
        </h1>
        <p className="mt-1 text-sm text-muted">
          {cohort.name} · {pastSessions.length} de {sessions.data?.length ?? 0}{" "}
          sesiones realizadas
          {nextSession && ` · próxima: ${dateTime(nextSession.starts_at)}`}
        </p>
      </header>

      <section aria-label="Tu siguiente acción">
        <Link
          href={nextAction.href}
          className="flex items-center justify-between gap-3 rounded-(--radius-card) border border-accent/40 bg-accent-soft px-5 py-4 transition-colors hover:border-accent"
        >
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-accent-strong">
              Tu siguiente acción
            </p>
            <p className="mt-1 font-medium">{nextAction.label}</p>
          </div>
          <span aria-hidden className="text-accent-strong">→</span>
        </Link>
      </section>

      {nextEvent && (
        <section aria-label="Próximo evento" id="proximo-evento">
          <SectionTitle>Próximo evento</SectionTitle>
          <Card>
            <p className="font-semibold">{nextEvent.title}</p>
            <p className="mt-1 text-sm text-muted">{nextEvent.description}</p>
            <p className="mt-2 text-sm">
              {dateTime(nextEvent.starts_at)}{" "}
              <span className="text-faint">
                · {MODALITY_LABEL[nextEvent.modality] ?? nextEvent.modality} ·{" "}
                {nextEvent.location_text}
              </span>
            </p>
            <div className="mt-4 flex items-center gap-2">
              {rsvpBy.get(nextEvent.id) === "confirmado" ? (
                <p className="text-sm font-medium text-ok">
                  ✓ Confirmaste tu lugar. Te esperamos.
                </p>
              ) : rsvpBy.get(nextEvent.id) === "no_puedo" ? (
                <p className="text-sm text-muted">
                  Avisaste que no puedes esta vez. Si algo cambia, aquí puedes
                  confirmarte.
                </p>
              ) : null}
              {rsvpBy.get(nextEvent.id) !== "confirmado" && (
                <>
                  <form action={rsvpToEvent}>
                    <input type="hidden" name="eventId" value={nextEvent.id} />
                    <input type="hidden" name="status" value="confirmado" />
                    <button
                      type="submit"
                      className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-[#0b0a12] hover:opacity-90"
                    >
                      Confirmar mi lugar
                    </button>
                  </form>
                  {!rsvpBy.has(nextEvent.id) && (
                    <form action={rsvpToEvent}>
                      <input type="hidden" name="eventId" value={nextEvent.id} />
                      <input type="hidden" name="status" value="no_puedo" />
                      <button
                        type="submit"
                        className="rounded-lg border border-line px-4 py-2 text-sm text-muted hover:text-foreground"
                      >
                        No puedo esta vez
                      </button>
                    </form>
                  )}
                </>
              )}
            </div>
          </Card>
        </section>
      )}

      {pendingMissions.length > 0 && (
        <section aria-label="Misiones" id="misiones">
          <SectionTitle>Tus misiones</SectionTitle>
          <div className="space-y-3">
            {pendingMissions.map((m) => (
              <Card key={m.id}>
                <p className="font-semibold">{m.title}</p>
                <p className="mt-1 text-sm text-muted">{m.description}</p>
                {m.due_on && (
                  <p className="mt-1 text-xs text-faint">
                    Idealmente antes del {m.due_on} ({relativeDays(m.due_on)})
                  </p>
                )}
                <form action={completeMission} className="mt-3 flex flex-col gap-2 sm:flex-row">
                  <input type="hidden" name="missionId" value={m.id} />
                  <input
                    name="note"
                    type="text"
                    placeholder="¿Qué descubriste? (opcional)"
                    className="flex-1 rounded-lg border border-line bg-raised px-3 py-2 text-sm placeholder:text-faint"
                  />
                  <button
                    type="submit"
                    className="rounded-lg bg-aqua-soft px-4 py-2 text-sm font-semibold text-aqua hover:opacity-90"
                  >
                    La hice ✓
                  </button>
                </form>
              </Card>
            ))}
          </div>
        </section>
      )}

      {myGroupRow && (
        <section aria-label="Quién te acompaña">
          <SectionTitle>Quién te acompaña</SectionTitle>
          <Card>
            <p className="text-sm">
              <span className="font-semibold">{myGroupRow.small_groups?.name}</span>
              <span className="text-muted">
                {" "}
                · te acompaña {myGroupRow.small_groups?.people?.full_name} (staff)
              </span>
            </p>
            <ul className="mt-3 flex flex-wrap gap-3">
              {(groupMates ?? [])
                .filter((m) => m.participations?.person_id !== ctx.personId)
                .map((m, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-muted">
                    <Avatar name={m.participations?.people?.full_name ?? "?"} size={28} />
                    {m.participations?.people?.full_name}
                  </li>
                ))}
            </ul>
          </Card>
        </section>
      )}

      <section aria-label="Conversación reciente">
        <SectionTitle
          action={
            <Link
              href="/mi/generacion"
              className="text-sm text-accent-strong hover:underline underline-offset-4"
            >
              Ver todo →
            </Link>
          }
        >
          En tu generación
        </SectionTitle>
        {(posts.data ?? []).length === 0 ? (
          <EmptyState title="Tu generación todavía no ha empezado a conversar.">
            Sé la primera persona en compartir: una declaración, un aprendizaje o
            una pregunta. Tu grupo la va a recibir.
          </EmptyState>
        ) : (
          <ul className="space-y-2.5">
            {posts.data!.map((p) => (
              <li key={p.id}>
                <Link
                  href="/mi/generacion"
                  className="block rounded-(--radius-card) border border-line bg-surface p-4 hover:bg-raised"
                >
                  <p className="text-xs text-faint">
                    {p.people?.full_name} · {POST_KIND_LABEL[p.kind] ?? p.kind}
                  </p>
                  <p className="mt-1 text-sm line-clamp-2">{p.body}</p>
                  <p className="mt-1.5 text-xs text-faint">
                    {(p.comments ?? []).length === 0
                      ? "Aún sin respuestas"
                      : `${(p.comments ?? []).length} respuesta${(p.comments ?? []).length === 1 ? "" : "s"}`}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
