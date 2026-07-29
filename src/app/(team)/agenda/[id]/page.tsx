import Link from "next/link";
import { notFound } from "next/navigation";
import { requireCapability, hasCapability } from "@/lib/capabilities";
import { createServiceClient } from "@/lib/supabase/server";
import { saveAttendance } from "@/app/actions/operations";
import { Card, Avatar, Badge } from "@/components/ui";
import { dateTime, EVENT_KIND_LABEL } from "@/lib/format";

export const dynamic = "force-dynamic";

const STATUSES = [
  { value: "presente", label: "Presente" },
  { value: "tarde", label: "Tarde" },
  { value: "justificada", label: "Justificada" },
  { value: "ausente", label: "Ausente" },
];

export default async function CheckInPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const ctx = await requireCapability(["attendance.write.all", "attendance.write.assigned"]);
  const service = createServiceClient();

  const { data: event } = await service
    .from("event_occurrences")
    .select("id, name, kind, starts_at, stage_run_id, stage_runs(name, generation_cycles(name))")
    .eq("id", id)
    .eq("organization_id", ctx.organizationId)
    .single();
  if (!event) notFound();

  // El roster es LO ESPERADO: sin expectativa no hay fila; sin registro, la
  // fila queda visible como faltante — nunca desaparece.
  const [{ data: expectations }, { data: existing }] = await Promise.all([
    service
      .from("attendance_expectations")
      .select("stage_participation_id, stage_participations(id, person_id, delivery_status, people(full_name))")
      .eq("event_occurrence_id", event.id)
      .eq("expected", true),
    service
      .from("attendance_records")
      .select("stage_participation_id, status, corrected")
      .eq("event_occurrence_id", event.id),
  ]);
  const existingBy = new Map((existing ?? []).map((r) => [r.stage_participation_id, r.status]));

  // Staff puro: solo su grupo asignado.
  const staffOnly = !hasCapability(ctx, "attendance.write.all");
  let allowed: Set<string> | null = null;
  if (staffOnly) {
    const { data: groups } = await service
      .from("small_groups")
      .select("small_group_members(stage_participation_id)")
      .eq("staff_person_id", ctx.personId);
    allowed = new Set(
      (groups ?? []).flatMap((g) =>
        (g.small_group_members ?? []).map((m) => m.stage_participation_id)
      )
    );
  }

  const roster = (expectations ?? [])
    .filter((e) => !allowed || allowed.has(e.stage_participation_id))
    .map((e) => e.stage_participations!)
    .sort((a, b) => (a.people?.full_name ?? "").localeCompare(b.people?.full_name ?? ""));

  const unrecorded = roster.filter((r) => !existingBy.has(r.id)).length;
  const context = event.stage_runs
    ? `${event.stage_runs.generation_cycles?.name ?? ""} · ${event.stage_runs.name}`.replace(/^ · /, "")
    : "Todo el centro";

  return (
    <div className="space-y-6 max-w-2xl">
      <nav aria-label="Miga de pan" className="text-sm text-faint">
        <Link href="/agenda" className="hover:text-muted">
          ← Agenda
        </Link>
      </nav>

      <header>
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-2xl font-bold tracking-tight">Pasar lista · {event.name}</h1>
          <Badge variant="accent">{EVENT_KIND_LABEL[event.kind] ?? event.kind}</Badge>
        </div>
        <p className="mt-1 text-sm text-muted">
          {context} · {dateTime(event.starts_at)}
        </p>
        {unrecorded > 0 && (
          <p className="mt-1.5 text-xs text-gold">
            {unrecorded} de {roster.length} esperados siguen sin registro: mientras falten, la
            métrica de asistencia queda provisional.
          </p>
        )}
        {staffOnly && (
          <p className="mt-1.5 text-xs text-faint">Estás viendo solo a tu grupo asignado.</p>
        )}
      </header>

      <form action={saveAttendance}>
        <input type="hidden" name="eventId" value={event.id} />
        <Card className="!p-0 divide-y divide-line">
          {roster.map((pa) => {
            const current = existingBy.get(pa.id);
            return (
              <fieldset
                key={pa.id}
                className="flex flex-wrap items-center justify-between gap-3 px-4 py-3"
              >
                <legend className="sr-only">{pa.people?.full_name}</legend>
                <span className="flex items-center gap-2.5 text-sm font-medium">
                  <Avatar name={pa.people?.full_name ?? "?"} size={30} />
                  {pa.people?.full_name}
                  {!current && <span className="text-xs font-normal text-gold">sin registro</span>}
                </span>
                <div
                  className="flex gap-1"
                  role="radiogroup"
                  aria-label={`Asistencia de ${pa.people?.full_name}`}
                >
                  {STATUSES.map((s) => (
                    <label
                      key={s.value}
                      className="cursor-pointer rounded-lg border border-line px-2.5 py-1 text-xs text-muted transition-colors has-checked:border-accent has-checked:bg-accent-soft has-checked:text-accent-strong hover:text-foreground"
                    >
                      <input
                        type="radio"
                        name={`att_${pa.id}`}
                        value={s.value}
                        defaultChecked={current === s.value}
                        className="sr-only"
                      />
                      {s.label}
                    </label>
                  ))}
                </div>
              </fieldset>
            );
          })}
        </Card>
        <div className="mt-4 flex items-center justify-between gap-3">
          <p className="text-xs text-faint">
            Las correcciones a registros existentes quedan auditadas.
          </p>
          <button
            type="submit"
            className="rounded-lg bg-accent px-5 py-2 text-sm font-semibold text-[#0b0a12] hover:opacity-90"
          >
            Guardar asistencia
          </button>
        </div>
      </form>
    </div>
  );
}
