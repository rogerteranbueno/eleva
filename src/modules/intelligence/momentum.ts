import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/database.types";

type Service = SupabaseClient<Database>;

/**
 * Momentum v2 — participación activa 0-100, determinista y explicable,
 * sobre el dominio canónico: la unidad es el CICLO (generación) y la
 * asistencia se mide contra EXPECTATIVAS, nunca contra "sesiones genéricas".
 * Ventana: 30 días. Pesos: asistencia 40 · misiones 25 · conversación 20 · eventos 15.
 * Es una herramienta operativa del equipo; al participante solo se le muestra
 * el propio ("tu ritmo") — nunca rankings ni comparaciones públicas.
 */

export const MOMENTUM_DEFINITION =
  "Participación activa de los últimos 30 días: asistencia a días de etapa contra lo esperado (40%), misiones completadas (25%), conversación en su generación (20%) y confirmación de eventos (15%). No mide valor personal; señala dónde acompañar.";

export type PersonMomentum = {
  personId: string;
  participationId: string;
  name: string;
  score: number;
  factors: { asistencia: number; misiones: number; conversacion: number; eventos: number };
};

export type CycleMomentum = {
  cycleId: string;
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
): Promise<{ center: number; cycles: CycleMomentum[] }> {
  const since = new Date(Date.now() - 30 * 24 * 3600_000).toISOString();
  const nowIso = new Date().toISOString();

  const { data: cycles } = await service
    .from("generation_cycles")
    .select("id, name, stage_runs(id, stage, status)")
    .eq("organization_id", organizationId)
    .eq("status", "activa");

  const results: CycleMomentum[] = [];

  for (const cycle of cycles ?? []) {
    const runIds = (cycle.stage_runs ?? []).map((r) => r.id);
    if (runIds.length === 0) continue;

    // Personas del ciclo: participaciones vivas (esperado/activo/completo),
    // una por persona (la más reciente).
    const { data: parts } = await service
      .from("stage_participations")
      .select("id, person_id, stage_run_id, delivery_status, created_at, people(full_name)")
      .in("stage_run_id", runIds)
      .eq("registration_status", "confirmado")
      .in("delivery_status", ["esperado", "activo", "completo"])
      .order("created_at", { ascending: true });
    const byPerson = new Map<string, NonNullable<typeof parts>[number]>();
    for (const p of parts ?? []) byPerson.set(p.person_id, p);
    const people = [...byPerson.values()];
    if (people.length === 0) continue;
    const partIds = (parts ?? []).map((p) => p.id);
    const personIds = people.map((p) => p.person_id);

    const [expectations, records, missions, completions, events, rsvps, posts, comments] =
      await Promise.all([
        service
          .from("attendance_expectations")
          .select("stage_participation_id, event_occurrences!inner(starts_at)")
          .in("stage_participation_id", partIds)
          .eq("expected", true)
          .gte("event_occurrences.starts_at", since)
          .lt("event_occurrences.starts_at", nowIso),
        service
          .from("attendance_records")
          .select("stage_participation_id, status")
          .in("stage_participation_id", partIds),
        service.from("missions").select("id, stage_run_id").in("stage_run_id", runIds),
        service
          .from("mission_completions")
          .select("stage_participation_id, mission_id")
          .in("stage_participation_id", partIds),
        service
          .from("event_occurrences")
          .select("id")
          .eq("organization_id", organizationId)
          .gte("starts_at", since),
        service.from("rsvps").select("person_id, event_occurrence_id").in("person_id", personIds),
        service
          .from("posts")
          .select("author_person_id, spaces!inner(cycle_id)")
          .eq("spaces.cycle_id", cycle.id)
          .gte("created_at", since),
        service
          .from("comments")
          .select("author_person_id")
          .in("author_person_id", personIds)
          .gte("created_at", since),
      ]);

    const expectedBy = new Map<string, number>();
    for (const e of expectations.data ?? []) {
      expectedBy.set(
        e.stage_participation_id,
        (expectedBy.get(e.stage_participation_id) ?? 0) + 1
      );
    }
    const attendedBy = new Map<string, number>();
    for (const a of records.data ?? []) {
      if (["presente", "tarde"].includes(a.status)) {
        attendedBy.set(
          a.stage_participation_id,
          (attendedBy.get(a.stage_participation_id) ?? 0) + 1
        );
      }
    }
    const missionsByRun = new Map<string, number>();
    for (const m of missions.data ?? []) {
      missionsByRun.set(m.stage_run_id, (missionsByRun.get(m.stage_run_id) ?? 0) + 1);
    }
    const missionsBy = new Map<string, number>();
    for (const m of completions.data ?? []) {
      missionsBy.set(
        m.stage_participation_id,
        (missionsBy.get(m.stage_participation_id) ?? 0) + 1
      );
    }
    const recentEventIds = new Set((events.data ?? []).map((e) => e.id));
    const rsvpBy = new Map<string, number>();
    for (const r of rsvps.data ?? []) {
      if (!recentEventIds.has(r.event_occurrence_id)) continue;
      rsvpBy.set(r.person_id, (rsvpBy.get(r.person_id) ?? 0) + 1);
    }
    const talkBy = new Map<string, number>();
    for (const p of [...(posts.data ?? []), ...(comments.data ?? [])]) {
      talkBy.set(p.author_person_id, (talkBy.get(p.author_person_id) ?? 0) + 1);
    }

    // Suma por persona sobre TODAS sus participaciones del ciclo.
    const partsOf = new Map<string, string[]>();
    for (const p of parts ?? []) {
      partsOf.set(p.person_id, [...(partsOf.get(p.person_id) ?? []), p.id]);
    }

    const participants: PersonMomentum[] = people.map((pa) => {
      const ids = partsOf.get(pa.person_id) ?? [pa.id];
      const expected = ids.reduce((s, id) => s + (expectedBy.get(id) ?? 0), 0);
      const attended = ids.reduce((s, id) => s + (attendedBy.get(id) ?? 0), 0);
      const missionTotal = ids.reduce(
        (s, id) =>
          s +
          (missionsByRun.get(
            (parts ?? []).find((x) => x.id === id)?.stage_run_id ?? ""
          ) ?? 0),
        0
      );
      const missionDone = ids.reduce((s, id) => s + (missionsBy.get(id) ?? 0), 0);

      const asistencia = expected > 0 ? Math.min(1, attended / expected) : 1;
      const misiones = missionTotal > 0 ? Math.min(1, missionDone / missionTotal) : 1;
      // Conversación y eventos saturan con poco: participar ya cuenta.
      const conversacion = Math.min(1, (talkBy.get(pa.person_id) ?? 0) / 2);
      const eventos = Math.min(1, (rsvpBy.get(pa.person_id) ?? 0) / 1);
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
      cycleId: cycle.id,
      name: cycle.name,
      score: participants.length
        ? Math.round(participants.reduce((s, p) => s + p.score, 0) / participants.length)
        : 0,
      participants: participants.sort((a, b) => a.score - b.score),
    });
  }

  const all = results.flatMap((c) => c.participants);
  return {
    center: all.length ? Math.round(all.reduce((s, p) => s + p.score, 0) / all.length) : 0,
    cycles: results,
  };
}
