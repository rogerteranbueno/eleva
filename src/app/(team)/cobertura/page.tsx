import Link from "next/link";
import { requireCapability, hasCapability } from "@/lib/capabilities";
import { createServiceClient } from "@/lib/supabase/server";
import { Card, SectionTitle, Badge, EmptyState, Avatar, PersonLink } from "@/components/ui";
import { dateShort, dateTime, EVENT_KIND_LABEL, plural } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function CoberturaPage() {
  const ctx = await requireCapability("followup.read.coverage");
  const service = createServiceClient();
  const nowIso = new Date().toISOString();
  const today = nowIso.slice(0, 10);

  // Etapas donde tengo asignación vigente de capitán (o soy dirección/oficinas: todas las activas).
  const isCaptainOnly = !hasCapability(ctx, "cycle.read.all");
  let runIds: string[] = [];
  if (isCaptainOnly) {
    const { data: mine } = await service
      .from("team_assignments")
      .select("stage_run_id")
      .eq("person_id", ctx.personId)
      .eq("role", "capitan")
      .lte("starts_at", nowIso)
      .or(`ends_at.is.null,ends_at.gt.${nowIso}`);
    runIds = [...new Set((mine ?? []).map((t) => t.stage_run_id))];
  } else {
    const { data: active } = await service
      .from("stage_runs")
      .select("id")
      .eq("organization_id", ctx.organizationId)
      .in("status", ["activa", "planeada"]);
    runIds = (active ?? []).map((r) => r.id);
  }

  if (runIds.length === 0) {
    return (
      <div className="space-y-6">
        <header>
          <h1 className="text-2xl font-bold tracking-tight">Cobertura</h1>
        </header>
        <EmptyState title="No tienes una etapa asignada como capitán ahora.">
          Las asignaciones de servicio tienen vigencia; cuando sirvas una etapa, su cobertura vivirá
          aquí.
        </EmptyState>
      </div>
    );
  }

  const [{ data: runs }, { data: staffTeam }, { data: groups }, { data: events }] =
    await Promise.all([
      service
        .from("stage_runs")
        .select("id, name, stage, starts_on, generation_cycles(id, name)")
        .in("id", runIds),
      service
        .from("team_assignments")
        .select("id, person_id, role, stage_run_id, people:person_id(full_name)")
        .in("stage_run_id", runIds)
        .eq("role", "staff")
        .lte("starts_at", nowIso)
        .or(`ends_at.is.null,ends_at.gt.${nowIso}`),
      service
        .from("small_groups")
        .select("id, name, stage_run_id, staff_person_id, small_group_members(stage_participation_id)")
        .in("stage_run_id", runIds),
      service
        .from("event_occurrences")
        .select("id, name, kind, starts_at, rsvps(status)")
        .in("stage_run_id", runIds)
        .gt("starts_at", nowIso)
        .order("starts_at")
        .limit(4),
    ]);

  // Seguimiento de las participaciones de mis etapas.
  const { data: spOfRuns } = await service
    .from("stage_participations")
    .select("id")
    .in("stage_run_id", runIds);
  const spIds = (spOfRuns ?? []).map((s) => s.id);
  const { data: calls } = spIds.length
    ? await service
        .from("follow_up_interactions")
        .select(
          "id, staff_person_id, expected_on, done_at, resultado, stage_participations(person_id, people(full_name))"
        )
        .in("stage_participation_id", spIds)
    : { data: [] as never[] };

  type Call = NonNullable<typeof calls>[number];
  const byStaff = new Map<string, { name: string; done: number; pending: number; overdue: Call[] }>();
  for (const t of staffTeam ?? []) {
    byStaff.set(t.person_id, { name: t.people?.full_name ?? "—", done: 0, pending: 0, overdue: [] });
  }
  for (const c of calls ?? []) {
    const entry = byStaff.get(c.staff_person_id);
    if (!entry) continue;
    if (c.done_at) entry.done++;
    else {
      entry.pending++;
      if (c.expected_on < today) entry.overdue.push(c);
    }
  }
  const totalOverdue = [...byStaff.values()].reduce((s, v) => s + v.overdue.length, 0);
  const groupsByStaff = new Map<string, NonNullable<typeof groups>>();
  for (const g of groups ?? []) {
    if (!g.staff_person_id) continue;
    groupsByStaff.set(g.staff_person_id, [...(groupsByStaff.get(g.staff_person_id) ?? []), g]);
  }

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-bold tracking-tight">Cobertura · {ctx.preferredName}</h1>
        <p className="mt-1 text-sm text-muted">
          {(runs ?? []).map((r) => `${r.generation_cycles?.name} · ${r.name}`).join(" — ")}. Tu
          trabajo: que nadie del equipo cargue solo y que ningún seguimiento se caiga.
        </p>
      </header>

      <section aria-label="Resumen" className="grid grid-cols-3 gap-3">
        <Card className="!p-4">
          <p className="text-2xl font-bold">{(staffTeam ?? []).length}</p>
          <p className="text-xs text-muted">staff sirviendo</p>
        </Card>
        <Card className="!p-4">
          <p className={`text-2xl font-bold ${totalOverdue > 0 ? "text-danger" : "text-ok"}`}>
            {totalOverdue}
          </p>
          <p className="text-xs text-muted">seguimientos vencidos</p>
        </Card>
        <Card className="!p-4">
          <p className="text-2xl font-bold">
            {[...byStaff.values()].reduce((s, v) => s + v.done, 0)}
          </p>
          <p className="text-xs text-muted">llamadas realizadas</p>
        </Card>
      </section>

      <section aria-label="Staff">
        <SectionTitle>Tu equipo de staff</SectionTitle>
        {byStaff.size === 0 ? (
          <EmptyState title="Sin staff asignado en tus etapas." />
        ) : (
          <ul className="space-y-2.5">
            {[...byStaff.entries()]
              .sort(([, a], [, b]) => b.overdue.length - a.overdue.length)
              .map(([personId, s]) => (
                <li key={personId} className="rounded-(--radius-card) border border-line bg-surface p-4">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <Avatar name={s.name} size={32} />
                    <PersonLink id={personId} name={s.name} />
                    <span className="text-xs text-faint">
                      {(groupsByStaff.get(personId) ?? [])
                        .map(
                          (g) =>
                            `${g.name} (${(g.small_group_members ?? []).length})`
                        )
                        .join(" · ") || "sin grupo"}
                    </span>
                    <span className="ml-auto flex items-center gap-2 text-xs">
                      <Badge variant="ok">{s.done} hechas</Badge>
                      {s.pending > 0 && <Badge variant="neutral">{s.pending} pendientes</Badge>}
                      {s.overdue.length > 0 && (
                        <Badge variant="danger">{s.overdue.length} vencidas</Badge>
                      )}
                    </span>
                  </div>
                  {s.overdue.length > 0 && (
                    <ul className="mt-2.5 space-y-1 border-t border-line pt-2.5 text-sm text-muted">
                      {s.overdue.map((c) => (
                        <li key={c.id}>
                          ⚠ {c.stage_participations?.people?.full_name} · esperada{" "}
                          {dateShort(c.expected_on + "T12:00:00")}
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
          </ul>
        )}
        <p className="mt-2 text-xs text-faint">
          Los seguimientos vencidos también generan un caso asignado a capitanía en{" "}
          <Link href="/hoy" className="underline underline-offset-4 hover:text-muted">
            Hoy
          </Link>
          .
        </p>
      </section>

      <section aria-label="Próximos eventos">
        <SectionTitle>Lo que viene</SectionTitle>
        {(events ?? []).length === 0 ? (
          <EmptyState title="Sin eventos próximos en tus etapas." />
        ) : (
          <ul className="grid gap-3 md:grid-cols-2">
            {(events ?? []).map((e) => {
              const confirmed = (e.rsvps ?? []).filter((r) => r.status === "confirmado").length;
              return (
                <li key={e.id}>
                  <Card className="!py-4">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-semibold">{e.name}</p>
                      <Badge variant="accent">{EVENT_KIND_LABEL[e.kind] ?? e.kind}</Badge>
                    </div>
                    <p className="mt-1 text-sm text-muted">{dateTime(e.starts_at)}</p>
                    {confirmed > 0 && (
                      <p className="text-xs text-faint">
                        {plural(confirmed, "confirmado", "confirmados")}
                      </p>
                    )}
                  </Card>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
