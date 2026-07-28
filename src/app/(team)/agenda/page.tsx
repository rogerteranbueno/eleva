import Link from "next/link";
import { requireTeam } from "@/lib/context";
import { createServiceClient } from "@/lib/supabase/server";
import { Card, SectionTitle, Badge, EmptyState } from "@/components/ui";
import { dateTime, MODALITY_LABEL, plural } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function AgendaPage() {
  const ctx = await requireTeam();
  const service = createServiceClient();

  const [{ data: sessions }, { data: events }] = await Promise.all([
    service
      .from("sessions")
      .select("id, name, starts_at, cohorts(id, name), attendance_records(id, status)")
      .eq("organization_id", ctx.organizationId)
      .order("starts_at"),
    service
      .from("events")
      .select("id, title, starts_at, modality, location_text, cohorts(name), rsvps(status)")
      .eq("organization_id", ctx.organizationId)
      .gt("starts_at", new Date(Date.now() - 7 * 24 * 3600_000).toISOString())
      .order("starts_at"),
  ]);

  const now = Date.now();
  const upcoming = (sessions ?? []).filter((s) => new Date(s.starts_at).getTime() >= now);
  const past = (sessions ?? [])
    .filter((s) => new Date(s.starts_at).getTime() < now)
    .reverse();

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-bold tracking-tight">Agenda</h1>
        <p className="mt-1 text-sm text-muted">
          Sesiones y eventos del centro. Pasar lista alimenta señales, momentum y
          Pulso — la asistencia se registra aquí, no en la memoria de nadie.
        </p>
      </header>

      <section aria-label="Próximas sesiones">
        <SectionTitle>Próximas sesiones</SectionTitle>
        {upcoming.length === 0 ? (
          <EmptyState title="No hay sesiones programadas." />
        ) : (
          <ul className="grid gap-3 md:grid-cols-2">
            {upcoming.map((s) => (
              <li key={s.id}>
                <Card className="!py-4">
                  <p className="font-semibold">{s.name} · {s.cohorts?.name}</p>
                  <p className="mt-1 text-sm text-muted">{dateTime(s.starts_at)}</p>
                </Card>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section aria-label="Eventos">
        <SectionTitle>Eventos</SectionTitle>
        {(events ?? []).length === 0 ? (
          <EmptyState title="No hay eventos próximos." />
        ) : (
          <ul className="grid gap-3 md:grid-cols-2">
            {events!.map((e) => {
              const confirmed = (e.rsvps ?? []).filter((r) => r.status === "confirmado").length;
              return (
                <li key={e.id}>
                  <Card className="!py-4">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-semibold">{e.title}</p>
                      <Badge variant={confirmed > 0 ? "aqua" : "neutral"}>
                        {plural(confirmed, "confirmado", "confirmados")}
                      </Badge>
                    </div>
                    <p className="mt-1 text-sm text-muted">
                      {e.cohorts?.name ?? "Todo el centro"} · {dateTime(e.starts_at)}
                    </p>
                    <p className="text-xs text-faint">
                      {MODALITY_LABEL[e.modality] ?? e.modality} · {e.location_text}
                    </p>
                  </Card>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <section aria-label="Pasar lista">
        <SectionTitle>Sesiones realizadas · pasar lista</SectionTitle>
        <ul className="space-y-2">
          {past.map((s) => {
            const records = s.attendance_records ?? [];
            const present = records.filter((r) => ["presente", "tarde"].includes(r.status)).length;
            return (
              <li key={s.id}>
                <Link
                  href={`/agenda/${s.id}`}
                  className="flex items-center justify-between gap-3 rounded-(--radius-card) border border-line bg-surface px-4 py-3 transition-colors hover:bg-raised"
                >
                  <div>
                    <p className="text-sm font-medium">{s.name} · {s.cohorts?.name}</p>
                    <p className="text-xs text-faint">{dateTime(s.starts_at)}</p>
                  </div>
                  {records.length === 0 ? (
                    <Badge variant="gold">Sin lista</Badge>
                  ) : (
                    <Badge variant="ok">
                      {present}/{records.length} presentes
                    </Badge>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
