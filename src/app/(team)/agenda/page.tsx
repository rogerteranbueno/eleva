import Link from "next/link";
import { requireCapability } from "@/lib/capabilities";
import { createServiceClient } from "@/lib/supabase/server";
import { SectionTitle, Badge, EmptyState } from "@/components/ui";
import { dateTime, EVENT_KIND_LABEL, MODALITY_LABEL, plural } from "@/lib/format";

export const dynamic = "force-dynamic";

const KIND_VARIANT: Record<string, "accent" | "aqua" | "gold" | "ok" | "neutral"> = {
  dia_basico: "accent",
  dia_avanzado: "accent",
  hito_pl: "aqua",
  graduacion: "gold",
  actividad_equipo: "ok",
  llamada: "neutral",
  evento_centro: "neutral",
  evento_alumni: "neutral",
};

const ATTENDANCE_KINDS = new Set(["dia_basico", "dia_avanzado", "hito_pl", "graduacion"]);

export default async function AgendaPage() {
  const ctx = await requireCapability(["cycle.read.all", "cycle.read.assigned"]);
  const service = createServiceClient();

  const { data: events } = await service
    .from("event_occurrences")
    .select(
      "id, name, kind, starts_at, modality, location_text, stage_runs(name, generation_cycles(name)), attendance_expectations(id), attendance_records(id, status), rsvps(status)"
    )
    .eq("organization_id", ctx.organizationId)
    .gt("starts_at", new Date(Date.now() - 30 * 24 * 3600_000).toISOString())
    .order("starts_at");

  const now = Date.now();
  const upcoming = (events ?? []).filter((e) => new Date(e.starts_at).getTime() >= now);
  const past = (events ?? [])
    .filter((e) => new Date(e.starts_at).getTime() < now)
    .reverse();

  const contextOf = (e: NonNullable<typeof events>[number]) =>
    e.stage_runs
      ? `${e.stage_runs.generation_cycles?.name ?? ""} · ${e.stage_runs.name}`.replace(/^ · /, "")
      : "Todo el centro";

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-bold tracking-tight">Agenda</h1>
        <p className="mt-1 text-sm text-muted">
          Días de etapa, hitos, actividades y eventos del centro. Pasar lista alimenta señales,
          momentum y Pulso — la asistencia se registra aquí, no en la memoria de nadie.
        </p>
      </header>

      <section aria-label="Próximos">
        <SectionTitle>Próximos</SectionTitle>
        {upcoming.length === 0 ? (
          <EmptyState title="No hay eventos programados." />
        ) : (
          <ul className="grid gap-3 md:grid-cols-2">
            {upcoming.map((e) => {
              const confirmed = (e.rsvps ?? []).filter((r) => r.status === "confirmado").length;
              return (
                <li key={e.id}>
                  <div className="rounded-(--radius-card) border border-line bg-surface p-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="font-semibold">{e.name}</p>
                      <Badge variant={KIND_VARIANT[e.kind] ?? "neutral"}>
                        {EVENT_KIND_LABEL[e.kind] ?? e.kind}
                      </Badge>
                    </div>
                    <p className="mt-1 text-sm text-muted">
                      {contextOf(e)} · {dateTime(e.starts_at)}
                    </p>
                    <p className="mt-0.5 text-xs text-faint">
                      {MODALITY_LABEL[e.modality] ?? e.modality}
                      {e.location_text && ` · ${e.location_text}`}
                      {confirmed > 0 && ` · ${plural(confirmed, "confirmado", "confirmados")}`}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <section aria-label="Pasar lista">
        <SectionTitle>Realizados · pasar lista</SectionTitle>
        {past.length === 0 ? (
          <EmptyState title="Aún no hay eventos realizados en 30 días." />
        ) : (
          <ul className="space-y-2">
            {past.map((e) => {
              const expected = (e.attendance_expectations ?? []).length;
              const records = e.attendance_records ?? [];
              const present = records.filter((r) => ["presente", "tarde"].includes(r.status)).length;
              const takesAttendance = ATTENDANCE_KINDS.has(e.kind) || expected > 0;
              const body = (
                <>
                  <div>
                    <p className="text-sm font-medium">
                      {e.name}
                      <span className="ml-2 text-xs text-faint">{EVENT_KIND_LABEL[e.kind]}</span>
                    </p>
                    <p className="text-xs text-faint">
                      {contextOf(e)} · {dateTime(e.starts_at)}
                    </p>
                  </div>
                  {takesAttendance ? (
                    records.length === 0 ? (
                      <Badge variant="gold">Sin lista</Badge>
                    ) : records.length < expected ? (
                      <Badge variant="gold">
                        {present}/{expected} · {expected - records.length} sin registro
                      </Badge>
                    ) : (
                      <Badge variant="ok">
                        {present}/{expected} presentes
                      </Badge>
                    )
                  ) : (
                    <Badge variant="neutral">Sin lista requerida</Badge>
                  )}
                </>
              );
              return (
                <li key={e.id}>
                  {takesAttendance ? (
                    <Link
                      href={`/agenda/${e.id}`}
                      className="flex items-center justify-between gap-3 rounded-(--radius-card) border border-line bg-surface px-4 py-3 transition-colors hover:bg-raised"
                    >
                      {body}
                    </Link>
                  ) : (
                    <div className="flex items-center justify-between gap-3 rounded-(--radius-card) border border-line bg-surface px-4 py-3">
                      {body}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
