import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/database.types";

type Service = SupabaseClient<Database>;

/**
 * Momentum — participación activa 0-100, determinista y explicable.
 * Ventana: 30 días. Pesos: asistencia 40 · misiones 25 · conversación 20 · eventos 15.
 * En el OS es una herramienta operativa del equipo; al participante solo se le
 * muestra el propio ("tu ritmo") — nunca rankings ni comparaciones públicas.
 */

export const MOMENTUM_DEFINITION =
  "Participación activa de los últimos 30 días: asistencia a sesiones (40%), misiones completadas (25%), conversación en su generación (20%) y confirmación/asistencia a eventos (15%). No mide valor personal; señala dónde acompañar.";

export type PersonMomentum = {
  personId: string;
  participationId: string;
  name: string;
  score: number;
  factors: { asistencia: number; misiones: number; conversacion: number; eventos: number };
};

export type CohortMomentum = {
  cohortId: string;
  name: string;
  score: number;
  participants: PersonMomentum[];
};

export function momentumLabel(score: number) {
  if (score >= 70) return "En racha";
  if (score >= 40) return "Irregular";
  return "Necesita acompañamiento";
}

export function momentumColor(score: number) {
  if (score >= 70) return "var(--ok)";
  if (score >= 40) return "var(--gold)";
  return "var(--danger)";
}

export async function computeMomentum(
  service: Service,
  organizationId: string
): Promise<{ center: number; cohorts: CohortMomentum[] }> {
  const since = new Date(Date.now() - 30 * 24 * 3600_000).toISOString();

  const { data: cohorts } = await service
    .from("cohorts")
    .select("id, name")
    .eq("organization_id", organizationId)
    .eq("status", "activa");

  const results: CohortMomentum[] = [];

  for (const cohort of cohorts ?? []) {
    const [{ data: parts }, { data: sessions }, { data: missions }, { data: events }] =
      await Promise.all([
        service
          .from("participations")
          .select("id, person_id, people(full_name)")
          .eq("cohort_id", cohort.id)
          .in("state", ["confirmado", "activo", "pausa"]),
        service
          .from("sessions")
          .select("id")
          .eq("cohort_id", cohort.id)
          .gte("starts_at", since)
          .lt("starts_at", new Date().toISOString()),
        service.from("missions").select("id").eq("cohort_id", cohort.id),
        service
          .from("events")
          .select("id")
          .eq("organization_id", organizationId)
          .or(`cohort_id.eq.${cohort.id},cohort_id.is.null`)
          .gte("starts_at", since),
      ]);

    const sessionIds = (sessions ?? []).map((s) => s.id);
    const missionIds = (missions ?? []).map((m) => m.id);
    const eventIds = (events ?? []).map((e) => e.id);
    const partIds = (parts ?? []).map((p) => p.id);
    const personIds = (parts ?? []).map((p) => p.person_id);

    const [attendance, completions, rsvps, posts, comments] = await Promise.all([
      sessionIds.length
        ? service
            .from("attendance_records")
            .select("participation_id, status")
            .in("session_id", sessionIds)
        : Promise.resolve({ data: [] as { participation_id: string; status: string }[] }),
      missionIds.length && partIds.length
        ? service
            .from("mission_completions")
            .select("participation_id, mission_id")
            .in("mission_id", missionIds)
            .in("participation_id", partIds)
        : Promise.resolve({ data: [] as { participation_id: string; mission_id: string }[] }),
      eventIds.length && personIds.length
        ? service.from("rsvps").select("person_id").in("event_id", eventIds).in("person_id", personIds)
        : Promise.resolve({ data: [] as { person_id: string }[] }),
      service
        .from("posts")
        .select("author_person_id")
        .eq("cohort_id", cohort.id)
        .gte("created_at", since),
      personIds.length
        ? service
            .from("comments")
            .select("author_person_id")
            .in("author_person_id", personIds)
            .gte("created_at", since)
        : Promise.resolve({ data: [] as { author_person_id: string }[] }),
    ]);

    const attendedBy = new Map<string, number>();
    for (const a of attendance.data ?? []) {
      if (["presente", "tarde"].includes(a.status)) {
        attendedBy.set(a.participation_id, (attendedBy.get(a.participation_id) ?? 0) + 1);
      }
    }
    const missionsBy = new Map<string, number>();
    for (const m of completions.data ?? []) {
      missionsBy.set(m.participation_id, (missionsBy.get(m.participation_id) ?? 0) + 1);
    }
    const rsvpBy = new Map<string, number>();
    for (const r of rsvps.data ?? []) {
      rsvpBy.set(r.person_id, (rsvpBy.get(r.person_id) ?? 0) + 1);
    }
    const talkBy = new Map<string, number>();
    for (const p of [...(posts.data ?? []), ...(comments.data ?? [])]) {
      talkBy.set(p.author_person_id, (talkBy.get(p.author_person_id) ?? 0) + 1);
    }

    const participants: PersonMomentum[] = (parts ?? []).map((pa) => {
      const asistencia = sessionIds.length
        ? Math.min(1, (attendedBy.get(pa.id) ?? 0) / sessionIds.length)
        : 1;
      const misiones = missionIds.length
        ? Math.min(1, (missionsBy.get(pa.id) ?? 0) / missionIds.length)
        : 1;
      // Conversación y eventos saturan con poco: participar ya cuenta.
      const conversacion = Math.min(1, (talkBy.get(pa.person_id) ?? 0) / 2);
      const eventos = eventIds.length
        ? Math.min(1, (rsvpBy.get(pa.person_id) ?? 0) / Math.min(eventIds.length, 2))
        : 1;
      const score = Math.round(
        (asistencia * 0.4 + misiones * 0.25 + conversacion * 0.2 + eventos * 0.15) * 100
      );
      return {
        personId: pa.person_id,
        participationId: pa.id,
        name: pa.people?.full_name ?? "—",
        score,
        factors: {
          asistencia: Math.round(asistencia * 100),
          misiones: Math.round(misiones * 100),
          conversacion: Math.round(conversacion * 100),
          eventos: Math.round(eventos * 100),
        },
      };
    });

    results.push({
      cohortId: cohort.id,
      name: cohort.name,
      score: participants.length
        ? Math.round(participants.reduce((s, p) => s + p.score, 0) / participants.length)
        : 0,
      participants: participants.sort((a, b) => a.score - b.score),
    });
  }

  const all = results.flatMap((c) => c.participants);
  return {
    center: all.length ? Math.round(all.reduce((s, p) => s + p.score, 0) / all.length) : 0,
    cohorts: results,
  };
}
