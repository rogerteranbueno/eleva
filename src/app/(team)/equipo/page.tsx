import Link from "next/link";
import { requireCapability } from "@/lib/capabilities";
import { createServiceClient } from "@/lib/supabase/server";
import { Card, SectionTitle, Avatar, Badge } from "@/components/ui";
import { dateShort, roleLabel } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function EquipoPage() {
  const ctx = await requireCapability("team.read");
  const service = createServiceClient();

  const [{ data: assignments }, { data: teamAssignments }] = await Promise.all([
    service
      .from("role_assignments")
      .select("role, starts_at, ends_at, organization_memberships!inner(person_id, people(id, full_name, email))")
      .eq("organization_id", ctx.organizationId)
      .neq("role", "participante")
      .order("role"),
    service
      .from("team_assignments")
      .select("role, person_id, ends_at, stage_runs(name, generation_cycles(id, name))")
      .eq("organization_id", ctx.organizationId),
  ]);

  const now = new Date().toISOString();
  const cohortsBy = new Map<string, { name: string; id: string }[]>();
  for (const ta of teamAssignments ?? []) {
    if (!ta.stage_runs?.generation_cycles) continue;
    if (ta.ends_at && ta.ends_at <= now) continue;
    const list = cohortsBy.get(ta.person_id) ?? [];
    list.push({
      name: `${ta.stage_runs.generation_cycles.name} · ${ta.stage_runs.name.split(" ")[0]}`,
      id: ta.stage_runs.generation_cycles.id,
    });
    cohortsBy.set(ta.person_id, list);
  }

  const active = (assignments ?? []).filter(
    (a) => a.starts_at <= now && (!a.ends_at || a.ends_at > now)
  );
  const expired = (assignments ?? []).filter((a) => a.ends_at && a.ends_at <= now);

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-bold tracking-tight">Equipo</h1>
        <p className="mt-1 text-sm text-muted">
          Roles con vigencia: una asignación vencida pierde acceso sin que nadie
          tenga que acordarse.
        </p>
      </header>

      <section aria-label="Equipo activo">
        <SectionTitle>Asignaciones vigentes</SectionTitle>
        <ul className="grid gap-3 md:grid-cols-2">
          {active.map((a, i) => {
            const person = a.organization_memberships?.people;
            const cohorts = person ? (cohortsBy.get(person.id) ?? []) : [];
            return (
              <li key={i}>
                <Card className="flex items-start gap-3 !py-4">
                  <Avatar name={person?.full_name ?? "?"} size={40} />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <Link
                        href={`/personas/${person?.id}`}
                        className="font-semibold hover:text-accent-strong"
                      >
                        {person?.full_name}
                      </Link>
                      <Badge variant="accent">{roleLabel(a.role)}</Badge>
                    </div>
                    <p className="mt-0.5 truncate text-xs text-faint">{person?.email}</p>
                    {cohorts.length > 0 && (
                      <p className="mt-1.5 text-xs text-muted">
                        {cohorts.map((c, j) => (
                          <span key={`${c.id}-${j}`}>
                            {j > 0 && " · "}
                            <Link
                              href={`/generaciones/${c.id}`}
                              className="hover:text-foreground underline-offset-4 hover:underline"
                            >
                              {c.name}
                            </Link>
                          </span>
                        ))}
                      </p>
                    )}
                    <p className="mt-1 text-xs text-faint">
                      Vigente desde {dateShort(a.starts_at)}
                      {a.ends_at && ` · hasta ${dateShort(a.ends_at)}`}
                    </p>
                  </div>
                </Card>
              </li>
            );
          })}
        </ul>
      </section>

      {expired.length > 0 && (
        <section aria-label="Asignaciones vencidas">
          <SectionTitle>Asignaciones vencidas</SectionTitle>
          <ul className="space-y-1.5">
            {expired.map((a, i) => (
              <li key={i} className="text-sm text-faint">
                {a.organization_memberships?.people?.full_name} · {roleLabel(a.role)} ·
                venció {a.ends_at ? dateShort(a.ends_at) : "—"} — sin acceso de equipo
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
