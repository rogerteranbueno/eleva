import Link from "next/link";
import { notFound } from "next/navigation";
import { requireTeam } from "@/lib/context";
import { createServiceClient } from "@/lib/supabase/server";
import {
  Card,
  SectionTitle,
  Avatar,
  ParticipationStateBadge,
  Badge,
} from "@/components/ui";
import { dateTime } from "@/lib/format";
import { roleLabel } from "@/components/AppShell";

export const dynamic = "force-dynamic";

export default async function GeneracionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const ctx = await requireTeam();
  const service = createServiceClient();

  const { data: cohort } = await service
    .from("cohorts")
    .select(
      "id, name, status, starts_on, ends_on, programs(name), levels(name), locations(name)"
    )
    .eq("id", id)
    .eq("organization_id", ctx.organizationId)
    .single();
  if (!cohort) notFound();

  const [team, groups, roster, sessions, attendance] = await Promise.all([
    service
      .from("team_assignments")
      .select("role, people(id, full_name)")
      .eq("cohort_id", id),
    service
      .from("small_groups")
      .select("id, name, people:staff_person_id(full_name), small_group_members(participations(person_id, people(id, full_name)))")
      .eq("cohort_id", id),
    service
      .from("participations")
      .select("id, state, person_id, people(id, full_name)")
      .eq("cohort_id", id)
      .order("state"),
    service
      .from("sessions")
      .select("id, name, sequence, starts_at")
      .eq("cohort_id", id)
      .order("sequence"),
    service
      .from("attendance_records")
      .select("participation_id, session_id, status")
      .in(
        "session_id",
        (
          await service.from("sessions").select("id").eq("cohort_id", id)
        ).data?.map((s) => s.id) ?? []
      ),
  ]);

  const pastSessions = (sessions.data ?? []).filter(
    (s) => new Date(s.starts_at) < new Date()
  );
  const attendanceBy = new Map<string, Map<string, string>>();
  for (const a of attendance.data ?? []) {
    if (!attendanceBy.has(a.participation_id))
      attendanceBy.set(a.participation_id, new Map());
    attendanceBy.get(a.participation_id)!.set(a.session_id, a.status);
  }

  return (
    <div className="space-y-8">
      <nav aria-label="Miga de pan" className="text-sm text-faint">
        <Link href="/generaciones" className="hover:text-muted">
          ← Generaciones
        </Link>
      </nav>

      <header>
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-bold tracking-tight">{cohort.name}</h1>
          <Badge variant={cohort.status === "activa" ? "ok" : "neutral"}>
            {cohort.status === "activa" ? "Activa" : cohort.status === "planeada" ? "Planeada" : "Cerrada"}
          </Badge>
        </div>
        <p className="mt-1 text-sm text-muted">
          {cohort.programs?.name} · Nivel {cohort.levels?.name} ·{" "}
          {cohort.starts_on} → {cohort.ends_on ?? "—"}
          {cohort.locations?.name && ` · ${cohort.locations.name}`}
        </p>
      </header>

      <section aria-label="Equipo">
        <SectionTitle>Equipo asignado</SectionTitle>
        <ul className="flex flex-wrap gap-2">
          {(team.data ?? []).map((t, i) => (
            <li
              key={i}
              className="flex items-center gap-2 rounded-full border border-line bg-surface py-1 pl-1 pr-3 text-sm"
            >
              <Avatar name={t.people?.full_name ?? "?"} size={26} />
              {t.people?.full_name}
              <span className="text-xs text-faint">· {roleLabel(t.role)}</span>
            </li>
          ))}
        </ul>
      </section>

      <section aria-label="Grupos pequeños">
        <SectionTitle>Grupos pequeños</SectionTitle>
        <div className="grid gap-3 md:grid-cols-3">
          {(groups.data ?? []).map((g) => (
            <Card key={g.id} className="!p-4">
              <p className="font-semibold text-sm">{g.name}</p>
              <p className="text-xs text-faint">
                Staff: {g.people?.full_name ?? "sin asignar"}
              </p>
              <ul className="mt-2 space-y-1">
                {(g.small_group_members ?? []).map((m, i) => (
                  <li key={i} className="text-sm text-muted">
                    <Link
                      href={`/personas/${m.participations?.people?.id}`}
                      className="hover:text-foreground underline-offset-4 hover:underline"
                    >
                      {m.participations?.people?.full_name}
                    </Link>
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      </section>

      <section aria-label="Roster y asistencia">
        <SectionTitle>
          Roster · {roster.data?.length ?? 0} personas
        </SectionTitle>
        <div className="overflow-x-auto rounded-(--radius-card) border border-line">
          <table className="w-full min-w-[560px] bg-surface text-sm">
            <thead>
              <tr className="border-b border-line text-left text-xs uppercase tracking-wider text-faint">
                <th scope="col" className="px-4 py-3 font-medium">Persona</th>
                <th scope="col" className="px-4 py-3 font-medium">Estado</th>
                {pastSessions.map((s) => (
                  <th
                    scope="col"
                    key={s.id}
                    className="px-2 py-3 text-center font-medium"
                    title={dateTime(s.starts_at)}
                  >
                    {s.name.replace("Sesión ", "S")}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {(roster.data ?? []).map((pa) => (
                <tr key={pa.id} className="hover:bg-raised">
                  <td className="px-4 py-2.5">
                    <Link
                      href={`/personas/${pa.people?.id}`}
                      className="font-medium hover:text-accent-strong"
                    >
                      {pa.people?.full_name}
                    </Link>
                  </td>
                  <td className="px-4 py-2.5">
                    <ParticipationStateBadge state={pa.state} />
                  </td>
                  {pastSessions.map((s) => {
                    const status = attendanceBy.get(pa.id)?.get(s.id);
                    return (
                      <td key={s.id} className="px-2 py-2.5 text-center">
                        <span
                          aria-label={status ?? "sin registro"}
                          className={
                            status === "presente" || status === "tarde"
                              ? "text-ok"
                              : status === "justificada"
                                ? "text-gold"
                                : status === "ausente"
                                  ? "text-danger"
                                  : "text-faint"
                          }
                        >
                          {status === "presente" || status === "tarde"
                            ? "✓"
                            : status === "justificada"
                              ? "J"
                              : status === "ausente"
                                ? "✗"
                                : "·"}
                        </span>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
