import Link from "next/link";
import { requireTeam } from "@/lib/context";
import { createServiceClient } from "@/lib/supabase/server";
import { refreshSignals } from "@/app/actions/cases";
import {
  Card,
  SectionTitle,
  PriorityBadge,
  CaseStatusBadge,
  EmptyState,
  Avatar,
} from "@/components/ui";
import { dateShort, plural, relativeDays } from "@/lib/format";

export const dynamic = "force-dynamic";

const PRIORITY_ORDER: Record<string, number> = { alta: 0, media: 1, baja: 2 };

export default async function HoyPage() {
  const ctx = await requireTeam();
  const service = createServiceClient();

  const { data: cases } = await service
    .from("cases")
    .select(
      "id, title, priority, status, due_at, opened_at, subject_person_id, cohort_id, people:subject_person_id(full_name), cohorts(name), signals(id, explanation, definition_id, signal_definitions(name))"
    )
    .eq("organization_id", ctx.organizationId)
    .in("status", ["abierto", "en_progreso", "esperando"])
    .order("opened_at", { ascending: true });

  const queue = (cases ?? []).sort((a, b) => {
    const p = PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
    if (p !== 0) return p;
    const da = a.due_at ? new Date(a.due_at).getTime() : Infinity;
    const db = b.due_at ? new Date(b.due_at).getTime() : Infinity;
    return da - db;
  });

  const { data: resolvedToday } = await service
    .from("cases")
    .select("id, title, closed_reason")
    .eq("organization_id", ctx.organizationId)
    .eq("status", "resuelto")
    .gte("closed_at", new Date(new Date().setHours(0, 0, 0, 0)).toISOString());

  const today = new Intl.DateTimeFormat("es-MX", {
    weekday: "long",
    day: "numeric",
    month: "long",
    timeZone: "America/Mexico_City",
  }).format(new Date());

  const overdue = queue.filter(
    (c) => c.due_at && new Date(c.due_at) < new Date()
  ).length;

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Hola, {ctx.preferredName}
          </h1>
          <p className="mt-1 text-sm text-muted capitalize">{today}</p>
        </div>
        <form action={refreshSignals}>
          <button
            type="submit"
            className="rounded-lg border border-line px-4 py-2 text-sm font-medium text-muted transition-colors hover:border-accent hover:text-accent-strong"
          >
            Actualizar señales
          </button>
        </form>
      </header>

      <section aria-label="Resumen del día" className="grid grid-cols-3 gap-3">
        <Card className="!p-4">
          <p className="text-2xl font-bold">{queue.length}</p>
          <p className="text-xs text-muted">requieren atención</p>
        </Card>
        <Card className="!p-4">
          <p className={`text-2xl font-bold ${overdue > 0 ? "text-danger" : ""}`}>
            {overdue}
          </p>
          <p className="text-xs text-muted">con plazo vencido</p>
        </Card>
        <Card className="!p-4">
          <p className="text-2xl font-bold text-ok">{resolvedToday?.length ?? 0}</p>
          <p className="text-xs text-muted">resueltos hoy</p>
        </Card>
      </section>

      <section aria-label="Cola de trabajo">
        <SectionTitle>Requiere tu atención</SectionTitle>
        {queue.length === 0 ? (
          <EmptyState title="Tu cola está al día.">
            No hay casos abiertos ahora mismo. Pulsa «Actualizar señales» para
            revisar si la operación generó algo nuevo.
          </EmptyState>
        ) : (
          <ul className="space-y-2.5">
            {queue.map((item) => {
              const signal = item.signals?.[0];
              const person = item.people;
              return (
                <li key={item.id}>
                  <Link
                    href={`/casos/${item.id}`}
                    className="flex items-start gap-4 rounded-(--radius-card) border border-line bg-surface p-4 transition-colors hover:border-line-strong hover:bg-raised"
                  >
                    {person ? (
                      <Avatar name={person.full_name} size={38} />
                    ) : (
                      <span className="flex size-[38px] shrink-0 items-center justify-center rounded-full bg-accent-soft text-accent-strong text-sm font-semibold">
                        ✦
                      </span>
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-medium">{item.title}</p>
                        <PriorityBadge priority={item.priority} />
                        {item.status !== "abierto" && (
                          <CaseStatusBadge status={item.status} />
                        )}
                      </div>
                      {signal && (
                        <p className="mt-1 text-sm text-muted line-clamp-2">
                          {signal.explanation}
                        </p>
                      )}
                      <p className="mt-1.5 text-xs text-faint">
                        {item.cohorts?.name && <>{item.cohorts.name} · </>}
                        abierto {dateShort(item.opened_at)}
                        {item.due_at && (
                          <>
                            {" · "}
                            <span
                              className={
                                new Date(item.due_at) < new Date()
                                  ? "text-danger"
                                  : ""
                              }
                            >
                              atender {relativeDays(item.due_at)}
                            </span>
                          </>
                        )}
                      </p>
                    </div>
                    <span aria-hidden className="mt-1 text-faint">
                      →
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      {(resolvedToday?.length ?? 0) > 0 && (
        <section aria-label="Resueltos hoy">
          <SectionTitle>
            {plural(resolvedToday!.length, "caso resuelto hoy", "casos resueltos hoy")}
          </SectionTitle>
          <ul className="space-y-1.5">
            {resolvedToday!.map((c) => (
              <li key={c.id} className="text-sm text-muted">
                <Link
                  href={`/casos/${c.id}`}
                  className="hover:text-foreground underline-offset-4 hover:underline"
                >
                  ✓ {c.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
