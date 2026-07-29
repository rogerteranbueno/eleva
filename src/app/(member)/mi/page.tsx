import Link from "next/link";
import { requireMember } from "@/lib/context";
import { createServiceClient, createUserClient } from "@/lib/supabase/server";
import { rsvpToEvent, completeMission, markReadingDone } from "@/app/actions/member";
import { Card, SectionTitle, Avatar, Badge, EmptyState, POST_KIND_LABEL } from "@/components/ui";
import { dateTime, dateShort, relativeDays, MODALITY_LABEL, EVENT_KIND_LABEL, plural } from "@/lib/format";

export const dynamic = "force-dynamic";

type EventRow = {
  id: string;
  name: string;
  kind: string;
  description: string | null;
  starts_at: string;
  modality: string;
  location_text: string | null;
};

function RsvpButtons({
  event,
  status,
}: {
  event: EventRow;
  status: string | undefined;
}) {
  if (status === "confirmado") {
    return <p className="text-sm font-medium text-ok">✓ Confirmaste tu lugar. Te esperamos.</p>;
  }
  return (
    <div className="flex items-center gap-2">
      {status === "no_puedo" && (
        <p className="text-sm text-muted">Avisaste que no puedes. Si algo cambia:</p>
      )}
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
  );
}

export default async function MiPage() {
  const ctx = await requireMember();
  // Lecturas con el cliente del USUARIO: RLS decide qué existe para esta persona.
  const supabase = await createUserClient();

  const { data: parts } = await supabase
    .from("stage_participations")
    .select(
      "id, delivery_status, registration_status, stage_run_id, stage_runs(id, stage, name, status, starts_on, ends_on, cycle_id, generation_cycles(id, name, status))"
    )
    .eq("person_id", ctx.personId)
    .order("created_at");

  const all = parts ?? [];
  const inActiveCycle = all.filter(
    (p) => p.stage_runs?.generation_cycles?.status === "activa"
  );

  // ── Determinar la etapa vital ────────────────────────────────────────────
  const plPart = inActiveCycle.find(
    (p) => p.stage_runs?.stage === "pl" && ["activo", "esperado", "pausa"].includes(p.delivery_status)
  );
  const windowPart = !plPart
    ? inActiveCycle.find((p) => p.stage_runs?.stage === "basico" && p.delivery_status === "completo")
    : null;
  const preBasicoPart =
    !plPart && !windowPart
      ? inActiveCycle.find(
          (p) => p.stage_runs?.stage === "basico" && p.delivery_status === "esperado"
        )
      : null;
  const alumniPart = all.find(
    (p) => p.stage_runs?.stage === "pl" && p.delivery_status === "completo"
  );

  const currentPart = plPart ?? windowPart ?? preBasicoPart ?? alumniPart ?? inActiveCycle[0] ?? all[0];
  const cycle = currentPart?.stage_runs?.generation_cycles;

  if (!currentPart || !cycle) {
    return (
      <EmptyState title={`Hola, ${ctx.preferredName}.`}>
        Todavía no estás en una generación. Cuando tu centro confirme tu inscripción, aquí verás qué
        te toca, quién te acompaña y qué está pasando en tu grupo.
      </EmptyState>
    );
  }

  const mode = plPart ? "pl" : windowPart ? "ventana" : preBasicoPart ? "pre" : "alumni";
  const now = new Date().toISOString();

  // Etapas del ciclo (para la siguiente etapa en la ventana).
  const { data: cycleRuns } = await supabase
    .from("stage_runs")
    .select("id, stage, name, status, starts_on")
    .eq("cycle_id", cycle.id)
    .order("starts_on");
  const nextRun =
    mode === "ventana"
      ? (cycleRuns ?? []).find((r) => r.stage === "avanzado" && r.starts_on >= now.slice(0, 10))
      : mode === "pre"
        ? currentPart.stage_runs
        : null;

  // Eventos: de mis etapas + del centro.
  const myRunIds = all.map((p) => p.stage_run_id);
  const [{ data: stageEvents }, { data: centerEvents }, { data: myRsvps }] = await Promise.all([
    myRunIds.length
      ? supabase
          .from("event_occurrences")
          .select("id, name, kind, description, starts_at, modality, location_text")
          .in("stage_run_id", myRunIds)
          .gt("starts_at", now)
          .order("starts_at")
          .limit(4)
      : Promise.resolve({ data: [] as EventRow[] }),
    supabase
      .from("event_occurrences")
      .select("id, name, kind, description, starts_at, modality, location_text")
      .in("kind", ["evento_centro", "evento_alumni"])
      .gt("starts_at", now)
      .order("starts_at")
      .limit(2),
    supabase.from("rsvps").select("event_occurrence_id, status").eq("person_id", ctx.personId),
  ]);
  const rsvpBy = new Map((myRsvps ?? []).map((r) => [r.event_occurrence_id, r.status]));
  const upcoming: EventRow[] = [...(stageEvents ?? []), ...(centerEvents ?? [])].sort((a, b) =>
    a.starts_at.localeCompare(b.starts_at)
  );
  const nextEvent = upcoming[0];

  // Misiones y libros de mis etapas vigentes.
  const currentRunIds =
    mode === "pl"
      ? [plPart!.stage_run_id]
      : mode === "ventana" && nextRun
        ? [windowPart!.stage_run_id, nextRun.id]
        : [currentPart.stage_run_id];
  const partByRun = new Map(all.map((p) => [p.stage_run_id, p.id]));

  const [{ data: missions }, { data: myCompletions }, { data: readings }, { data: myReadings }] =
    await Promise.all([
      supabase
        .from("missions")
        .select("id, title, description, due_on, sequence, stage_run_id")
        .in("stage_run_id", currentRunIds.length ? currentRunIds : ["00000000-0000-0000-0000-000000000000"])
        .order("sequence"),
      supabase
        .from("mission_completions")
        .select("mission_id")
        .in("stage_participation_id", all.map((p) => p.id)),
      mode === "pl"
        ? supabase
            .from("reading_assignments")
            .select("id, title, author, due_on")
            .eq("stage_run_id", plPart!.stage_run_id)
            .order("due_on")
        : Promise.resolve({ data: [] as never[] }),
      mode === "pl"
        ? supabase
            .from("reading_progress")
            .select("assignment_id")
            .eq("stage_participation_id", plPart!.id)
        : Promise.resolve({ data: [] as never[] }),
    ]);
  const completedSet = new Set((myCompletions ?? []).map((m) => m.mission_id));
  const pendingMissions = (missions ?? []).filter((m) => !completedSet.has(m.id));
  const readSet = new Set((myReadings ?? []).map((r) => r.assignment_id));
  const currentBook = (readings ?? []).find((r) => !readSet.has(r.id));

  // Grupo pequeño y enrolamientos: joins operativos resueltos en servidor.
  // El nombre de quien TÚ enrolaste es tuyo aunque RLS aún no te muestre su perfil.
  const service = createServiceClient();
  const { data: myEnrollments } =
    mode === "pl" || mode === "alumni"
      ? await service
          .from("enrollment_attributions")
          .select("id, status, enrolled:enrolled_person_id(full_name)")
          .eq("enroller_person_id", ctx.personId)
          .eq("organization_id", ctx.organizationId)
      : { data: [] as never[] };
  const { data: myGroupRow } = await service
    .from("small_group_members")
    .select("small_group_id, small_groups(name, people:staff_person_id(full_name))")
    .in(
      "stage_participation_id",
      all.length ? all.map((p) => p.id) : ["00000000-0000-0000-0000-000000000000"]
    )
    .order("id", { ascending: false })
    .limit(1)
    .maybeSingle();
  const { data: groupMates } = myGroupRow
    ? await service
        .from("small_group_members")
        .select("stage_participations(person_id, people(full_name))")
        .eq("small_group_id", myGroupRow.small_group_id)
    : { data: [] };

  // Conversación reciente del ciclo.
  const { data: posts } = await supabase
    .from("posts")
    .select(
      "id, kind, body, created_at, people:author_person_id(full_name), comments(id), spaces!inner(cycle_id)"
    )
    .eq("spaces.cycle_id", cycle.id)
    .is("deleted_at", null)
    .order("created_at", { ascending: false })
    .limit(3);

  // ── Siguiente acción por etapa ───────────────────────────────────────────
  const nextEventUnanswered = nextEvent && !rsvpBy.has(nextEvent.id);
  const nextAction =
    mode === "ventana" && nextRun && nextEventUnanswered
      ? { label: `Tu ${nextRun.name} es ${relativeDays(nextRun.starts_on + "T12:00:00")}: confirma tu lugar`, href: "#proximo-evento" }
      : mode === "pl" && currentBook
        ? pendingMissions.length > 0
          ? { label: `Avanza tu misión: ${pendingMissions[0].title}`, href: "#misiones" }
          : { label: `Libro del mes: «${currentBook.title}»`, href: "#libro" }
        : nextEventUnanswered
          ? { label: `Confirma tu lugar en «${nextEvent.name}»`, href: "#proximo-evento" }
          : pendingMissions.length > 0
            ? { label: `Tienes una misión pendiente: ${pendingMissions[0].title}`, href: "#misiones" }
            : { label: "Comparte cómo vas con tu generación", href: "/mi/generacion" };

  const headline =
    mode === "pl"
      ? `${cycle.name} · PL en curso`
      : mode === "ventana"
        ? `${cycle.name} · completaste tu Básico`
        : mode === "pre"
          ? `${cycle.name} · tu Básico está por comenzar`
          : `${cycle.name} · graduada${alumniPart ? "" : ""}`;

  return (
    <div className="space-y-8 max-w-2xl">
      <header>
        <h1 className="text-2xl font-bold tracking-tight">Hola, {ctx.preferredName}</h1>
        <p className="mt-1 text-sm text-muted">{headline}</p>
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
          <SectionTitle>
            {EVENT_KIND_LABEL[nextEvent.kind] ?? "Próximo evento"}
          </SectionTitle>
          <Card>
            <div className="flex items-center justify-between gap-2">
              <p className="font-semibold">{nextEvent.name}</p>
              <Badge variant="accent">{dateShort(nextEvent.starts_at)}</Badge>
            </div>
            {nextEvent.description && (
              <p className="mt-1 text-sm text-muted">{nextEvent.description}</p>
            )}
            <p className="mt-2 text-sm">
              {dateTime(nextEvent.starts_at)}{" "}
              <span className="text-faint">
                · {MODALITY_LABEL[nextEvent.modality] ?? nextEvent.modality}
                {nextEvent.location_text && ` · ${nextEvent.location_text}`}
              </span>
            </p>
            <div className="mt-4">
              <RsvpButtons event={nextEvent} status={rsvpBy.get(nextEvent.id)} />
            </div>
          </Card>
          {upcoming.length > 1 && (
            <p className="mt-2 text-xs text-faint">
              Después: {upcoming.slice(1, 3).map((e) => `${e.name} (${dateShort(e.starts_at)})`).join(" · ")}
            </p>
          )}
        </section>
      )}

      {mode === "pl" && currentBook && (
        <section aria-label="Libro en curso" id="libro">
          <SectionTitle>Libro del mes</SectionTitle>
          <Card>
            <p className="font-semibold">«{currentBook.title}»</p>
            <p className="text-sm text-muted">
              {currentBook.author}
              {currentBook.due_on && ` · para el ${dateShort(currentBook.due_on + "T12:00:00")}`}
            </p>
            <form action={markReadingDone} className="mt-3">
              <input type="hidden" name="assignmentId" value={currentBook.id} />
              <button
                type="submit"
                className="rounded-lg bg-aqua-soft px-4 py-2 text-sm font-semibold text-aqua hover:opacity-90"
              >
                Lo terminé ✓
              </button>
            </form>
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
                    Idealmente antes del {dateShort(m.due_on + "T12:00:00")} ({relativeDays(m.due_on + "T12:00:00")})
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

      {(mode === "pl" || mode === "alumni") && (
        <section aria-label="Tus enrolamientos">
          <SectionTitle>Tus enrolamientos</SectionTitle>
          {(myEnrollments ?? []).length === 0 ? (
            <Card>
              <p className="text-sm text-muted">
                Compartir lo que estás viviendo es parte del PL. Cuando invites a alguien y tu centro
                lo registre, su camino aparecerá aquí.
              </p>
            </Card>
          ) : (
            <ul className="space-y-2">
              {(myEnrollments ?? []).map((a) => (
                <li
                  key={a.id}
                  className="flex items-center justify-between gap-3 rounded-(--radius-card) border border-line bg-surface px-4 py-3 text-sm"
                >
                  <span className="font-medium">{a.enrolled?.full_name}</span>
                  <Badge
                    variant={
                      a.status === "confirmado" ? "ok" : a.status === "registrado" ? "aqua" : "neutral"
                    }
                  >
                    {a.status === "lead"
                      ? "En camino"
                      : a.status === "registrado"
                        ? "Se registró"
                        : a.status === "confirmado"
                          ? "Confirmada"
                          : "No avanzó"}
                  </Badge>
                </li>
              ))}
            </ul>
          )}
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
                .filter((m) => m.stage_participations?.person_id !== ctx.personId)
                .map((m, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-muted">
                    <Avatar name={m.stage_participations?.people?.full_name ?? "?"} size={28} />
                    {m.stage_participations?.people?.full_name}
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
              href="/mi/comunidad"
              className="text-sm text-accent-strong hover:underline underline-offset-4"
            >
              Ver todo →
            </Link>
          }
        >
          En tu generación
        </SectionTitle>
        {(posts ?? []).length === 0 ? (
          <EmptyState title="Tu generación todavía no ha empezado a conversar.">
            Sé la primera persona en compartir: una declaración, un aprendizaje o una pregunta. Tu
            grupo la va a recibir.
          </EmptyState>
        ) : (
          <ul className="space-y-2.5">
            {posts!.map((p) => (
              <li key={p.id}>
                <Link
                  href="/mi/comunidad"
                  className="block rounded-(--radius-card) border border-line bg-surface p-4 hover:bg-raised"
                >
                  <p className="text-xs text-faint">
                    {p.people?.full_name} · {POST_KIND_LABEL[p.kind] ?? p.kind}
                  </p>
                  <p className="mt-1 text-sm line-clamp-2">{p.body}</p>
                  <p className="mt-1.5 text-xs text-faint">
                    {(p.comments ?? []).length === 0
                      ? "Aún sin respuestas"
                      : plural((p.comments ?? []).length, "respuesta", "respuestas")}
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
