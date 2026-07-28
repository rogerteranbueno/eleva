import Link from "next/link";
import { notFound } from "next/navigation";
import { requireTeam } from "@/lib/context";
import { createServiceClient } from "@/lib/supabase/server";
import { saveAttendance } from "@/app/actions/operations";
import { Card, Avatar } from "@/components/ui";
import { dateTime } from "@/lib/format";

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
  const ctx = await requireTeam(["dueno", "oficinas", "entrenador", "staff"]);
  const service = createServiceClient();

  const { data: session } = await service
    .from("sessions")
    .select("id, name, starts_at, cohort_id, cohorts(name)")
    .eq("id", id)
    .eq("organization_id", ctx.organizationId)
    .single();
  if (!session) notFound();

  const [{ data: roster }, { data: existing }] = await Promise.all([
    service
      .from("participations")
      .select("id, people(full_name)")
      .eq("cohort_id", session.cohort_id)
      .in("state", ["confirmado", "activo", "pausa"])
      .order("created_at"),
    service
      .from("attendance_records")
      .select("participation_id, status, corrected")
      .eq("session_id", session.id),
  ]);
  const existingBy = new Map((existing ?? []).map((r) => [r.participation_id, r.status]));

  return (
    <div className="space-y-6 max-w-2xl">
      <nav aria-label="Miga de pan" className="text-sm text-faint">
        <Link href="/agenda" className="hover:text-muted">
          ← Agenda
        </Link>
      </nav>

      <header>
        <h1 className="text-2xl font-bold tracking-tight">
          Pasar lista · {session.name}
        </h1>
        <p className="mt-1 text-sm text-muted">
          {session.cohorts?.name} · {dateTime(session.starts_at)}
        </p>
      </header>

      <form action={saveAttendance}>
        <input type="hidden" name="sessionId" value={session.id} />
        <Card className="!p-0 divide-y divide-line">
          {(roster ?? []).map((pa) => {
            const current = existingBy.get(pa.id);
            return (
              <fieldset key={pa.id} className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
                <legend className="sr-only">{pa.people?.full_name}</legend>
                <span className="flex items-center gap-2.5 text-sm font-medium">
                  <Avatar name={pa.people?.full_name ?? "?"} size={30} />
                  {pa.people?.full_name}
                </span>
                <div className="flex gap-1" role="radiogroup" aria-label={`Asistencia de ${pa.people?.full_name}`}>
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
