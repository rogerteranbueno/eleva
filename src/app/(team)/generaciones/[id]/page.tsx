import Link from "next/link";
import { notFound } from "next/navigation";
import { requireCapability, hasCapability } from "@/lib/capabilities";
import { assertCanReadCycle } from "@/lib/scope";
import { createServiceClient } from "@/lib/supabase/server";
import { recordPassStep, enrollFromPass } from "@/app/actions/operations";
import {
  Card,
  SectionTitle,
  Badge,
  RegistrationBadge,
  DeliveryBadge,
  PassBadge,
  EmptyState,
  Avatar,
  PersonLink,
} from "@/components/ui";
import { STAGE_LABEL, EVENT_KIND_LABEL, dateShort, money, plural, roleLabel } from "@/lib/format";
import { CHARGE_LEDGER_SELECT, economyByCurrency } from "@/modules/finance/ledger";

export const dynamic = "force-dynamic";

function PassActionButton({
  passId,
  step,
  label,
}: {
  passId: string;
  step: string;
  label: string;
}) {
  return (
    <form action={recordPassStep} className="inline">
      <input type="hidden" name="passId" value={passId} />
      <input type="hidden" name="step" value={step} />
      <button
        type="submit"
        className="rounded-md border border-line px-2 py-1 text-xs font-medium text-muted transition-colors hover:border-accent hover:text-accent-strong"
      >
        {label}
      </button>
    </form>
  );
}

export default async function CyclePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  // Finanzas no opera el ciclo: sin capacidad de ciclo no entra, ni por URL.
  const ctx = await requireCapability(["cycle.read.all", "cycle.read.assigned"]);
  await assertCanReadCycle(ctx, id);
  const service = createServiceClient();

  const { data: cycle } = await service
    .from("generation_cycles")
    .select("id, name, status")
    .eq("id", id)
    .eq("organization_id", ctx.organizationId)
    .single();
  if (!cycle) notFound();

  const { data: runs } = await service
    .from("stage_runs")
    .select("id, stage, name, status, starts_on, ends_on, capacity, price_cents, currency")
    .eq("cycle_id", cycle.id)
    .order("starts_on");
  const runIds = (runs ?? []).map((r) => r.id);

  const [{ data: parts }, { data: events }, { data: team }, { data: groups }] =
    await Promise.all([
      runIds.length
        ? service
            .from("stage_participations")
            .select(
              "id, person_id, stage_run_id, registration_status, delivery_status, source, people(full_name)"
            )
            .in("stage_run_id", runIds)
        : Promise.resolve({ data: [] as never[] }),
      runIds.length
        ? service
            .from("event_occurrences")
            .select(
              "id, name, kind, starts_at, stage_run_id, attendance_expectations(id), attendance_records(id, status)"
            )
            .in("stage_run_id", runIds)
            .order("starts_at")
        : Promise.resolve({ data: [] as never[] }),
      runIds.length
        ? service
            .from("team_assignments")
            .select("id, role, person_id, stage_run_id, reports_to_person_id, people:person_id(full_name)")
            .in("stage_run_id", runIds)
            .lte("starts_at", new Date().toISOString())
            .or(`ends_at.is.null,ends_at.gt.${new Date().toISOString()}`)
        : Promise.resolve({ data: [] as never[] }),
      runIds.length
        ? service
            .from("small_groups")
            .select("id, name, stage_run_id, staff_person_id, people:staff_person_id(full_name), small_group_members(id)")
            .in("stage_run_id", runIds)
        : Promise.resolve({ data: [] as never[] }),
    ]);

  const partsByRun = new Map<string, NonNullable<typeof parts>>();
  for (const p of parts ?? []) {
    partsByRun.set(p.stage_run_id, [...(partsByRun.get(p.stage_run_id) ?? []), p]);
  }

  // ── Ventana del pase: desde la última etapa completada ────────────────────
  const completedRuns = (runs ?? []).filter((r) => r.status === "completada");
  const passWindowRun = completedRuns.sort((a, b) => b.ends_on.localeCompare(a.ends_on))[0];
  let passes: {
    id: string;
    pass_status: string;
    next_status: string;
    notes: string | null;
    person_id: string;
    person_name: string;
  }[] = [];
  if (passWindowRun) {
    const { data } = await service
      .from("continuity_passes")
      .select(
        "id, pass_status, next_status, notes, stage_participations!continuity_passes_from_participation_id_fkey!inner(stage_run_id, person_id, people(full_name))"
      )
      .eq("organization_id", ctx.organizationId)
      .eq("stage_participations.stage_run_id", passWindowRun.id);
    passes = (data ?? []).map((p) => ({
      id: p.id,
      pass_status: p.pass_status,
      next_status: p.next_status,
      notes: p.notes,
      person_id: p.stage_participations!.person_id,
      person_name: p.stage_participations!.people!.full_name,
    }));
  }
  const funnel = {
    elegibles: passes.filter((p) => p.pass_status !== "no_evaluado").length,
    conversados: passes.filter((p) => !["no_evaluado", "elegible"].includes(p.pass_status)).length,
    aceptados: passes.filter((p) => p.pass_status === "aceptado").length,
    inscritos: passes.filter((p) => ["inscrito", "iniciado"].includes(p.next_status)).length,
  };
  const PASS_ORDER: Record<string, number> = {
    aceptado: 0,
    elegible: 1,
    conversado: 2,
    ofrecido: 2,
    no_evaluado: 3,
    diferido: 4,
    declinado: 5,
  };
  const passQueue = [...passes].sort((a, b) => {
    const enrolledA = ["inscrito", "iniciado"].includes(a.next_status) ? 1 : 0;
    const enrolledB = ["inscrito", "iniciado"].includes(b.next_status) ? 1 : 0;
    if (enrolledA !== enrolledB) return enrolledA - enrolledB;
    return (PASS_ORDER[a.pass_status] ?? 9) - (PASS_ORDER[b.pass_status] ?? 9);
  });

  // ── Enrolamientos originados en este ciclo ────────────────────────────────
  const { data: attribs } = runIds.length
    ? await service
        .from("enrollment_attributions")
        .select(
          "id, status, enrolled:enrolled_person_id(full_name), enroller:enroller_person_id(id, full_name), context_stage_run_id"
        )
        .in("context_stage_run_id", runIds)
    : { data: [] as never[] };

  // ── Economía del ciclo (solo roles financieros) ───────────────────────────
  // El cálculo vive en modules/finance/ledger.ts, el mismo que usa /finanzas y
  // el Pulso: no puede volver a haber dos verdades del mismo ciclo.
  const showFinance = hasCapability(ctx, "finance.read");
  let economy: { label: string; value: string }[] = [];
  if (showFinance && runIds.length) {
    const partIds = (parts ?? []).map((p) => p.id);
    const [{ data: cycleCharges }, { data: expenses }] = await Promise.all([
      partIds.length
        ? service
            .from("charges")
            .select(CHARGE_LEDGER_SELECT)
            .in("stage_participation_id", partIds)
        : Promise.resolve({ data: [] as never[] }),
      service.from("expenses").select("amount_cents, currency").in("stage_run_id", runIds),
    ]);
    economy = economyByCurrency({
      charges: cycleCharges ?? [],
      expenses: expenses ?? [],
    }).flatMap((t) => [
      { label: `Contratado (${t.currency})`, value: money(t.contratado, t.currency) },
      { label: `Cobrado (${t.currency})`, value: money(t.cobrado, t.currency) },
      { label: `Por cobrar (${t.currency})`, value: money(t.porCobrar, t.currency) },
      ...(t.gastos > 0
        ? [
            { label: `Gastos (${t.currency})`, value: money(t.gastos, t.currency) },
            {
              label: `Margen sobre cobrado (${t.currency})`,
              value: money(t.margenSobreCobrado, t.currency),
            },
          ]
        : []),
    ]);
  }

  const canPass = hasCapability(ctx, "pass.record");
  const canEnroll = hasCapability(ctx, "pass.enroll");

  return (
    <div className="space-y-10">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{cycle.name}</h1>
          <p className="mt-1 text-sm text-muted">
            El ciclo completo: cada etapa, su pase y su gente.
          </p>
        </div>
        <Badge
          variant={cycle.status === "activa" ? "ok" : cycle.status === "graduada" ? "gold" : "neutral"}
        >
          {cycle.status === "activa" ? "Activa" : cycle.status === "graduada" ? "Graduada" : cycle.status === "planeada" ? "Planeada" : "Cerrada"}
        </Badge>
      </header>

      {/* ── Etapas ── */}
      <section aria-label="Etapas del ciclo">
        <SectionTitle>Etapas</SectionTitle>
        <div className="grid gap-3 lg:grid-cols-3">
          {(runs ?? []).map((run) => {
            const roster = partsByRun.get(run.id) ?? [];
            const confirmados = roster.filter((p) => p.registration_status === "confirmado").length;
            const runEvents = (events ?? []).filter((e) => e.stage_run_id === run.id);
            return (
              <Card key={run.id}>
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-semibold">{STAGE_LABEL[run.stage]}</h3>
                  <Badge
                    variant={
                      run.status === "activa" ? "ok" : run.status === "completada" ? "accent" : "neutral"
                    }
                  >
                    {run.status === "activa"
                      ? "En curso"
                      : run.status === "completada"
                        ? "Completada"
                        : run.status === "planeada"
                          ? "Planeada"
                          : "Cerrada"}
                  </Badge>
                </div>
                <p className="mt-1 text-xs text-faint">
                  {dateShort(run.starts_on + "T12:00:00")} → {dateShort(run.ends_on + "T12:00:00")}
                  {run.capacity ? ` · ${confirmados}/${run.capacity} lugares` : ` · ${confirmados} confirmados`}
                </p>
                {runEvents.length > 0 && (
                  <ul className="mt-3 space-y-1.5 border-t border-line pt-3">
                    {runEvents.map((e) => {
                      const expected = (e.attendance_expectations ?? []).length;
                      const present = (e.attendance_records ?? []).filter((r) =>
                        ["presente", "tarde"].includes(r.status)
                      ).length;
                      const recorded = (e.attendance_records ?? []).length;
                      const past = new Date(e.starts_at) < new Date();
                      return (
                        <li key={e.id} className="flex items-center justify-between gap-2 text-sm">
                          <Link
                            href={`/agenda/${e.id}`}
                            className="min-w-0 truncate text-muted hover:text-foreground"
                          >
                            <span className="text-faint">{EVENT_KIND_LABEL[e.kind]}</span> · {e.name}
                          </Link>
                          {past && expected > 0 ? (
                            <span className="shrink-0 text-xs tabular-nums">
                              <span className={present / expected >= 0.85 ? "text-ok" : "text-gold"}>
                                {present}/{expected}
                              </span>
                              {recorded < expected && (
                                <span className="text-danger"> · {expected - recorded} sin registro</span>
                              )}
                            </span>
                          ) : (
                            <span className="shrink-0 text-xs text-faint">{dateShort(e.starts_at)}</span>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                )}
              </Card>
            );
          })}
        </div>
      </section>

      {/* ── Ventana del pase ── */}
      {passWindowRun && passes.length > 0 && (
        <section aria-label="Pase de continuidad">
          <SectionTitle>Pase · {passWindowRun.name} → siguiente etapa</SectionTitle>
          <Card className="mb-3 !p-4">
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
              {(
                [
                  ["Elegibles", funnel.elegibles],
                  ["Conversados", funnel.conversados],
                  ["Aceptados", funnel.aceptados],
                  ["Inscritos", funnel.inscritos],
                ] as const
              ).map(([label, n], i) => (
                <span key={label} className="flex items-center gap-6">
                  {i > 0 && <span aria-hidden className="text-faint">→</span>}
                  <span>
                    <span className="text-xl font-bold tabular-nums">{n}</span>{" "}
                    <span className="text-xs text-muted">{label}</span>
                  </span>
                </span>
              ))}
              {funnel.aceptados - funnel.inscritos > 0 && (
                <Badge variant="gold">
                  {plural(funnel.aceptados - funnel.inscritos, "aceptado sin inscribir", "aceptados sin inscribir")}
                </Badge>
              )}
            </div>
          </Card>
          <ul className="space-y-2">
            {passQueue.map((p) => {
              const enrolled = ["inscrito", "iniciado"].includes(p.next_status);
              return (
                <li
                  key={p.id}
                  className="flex flex-wrap items-center gap-3 rounded-(--radius-card) border border-line bg-surface px-4 py-3"
                >
                  <Avatar name={p.person_name} size={30} />
                  <div className="min-w-0 flex-1">
                    <PersonLink id={p.person_id} name={p.person_name} />
                    {p.notes && <p className="text-xs text-faint">{p.notes}</p>}
                  </div>
                  <PassBadge passStatus={p.pass_status} nextStatus={p.next_status} />
                  {canPass && !enrolled && (
                    <span className="flex flex-wrap gap-1.5">
                      {p.pass_status === "no_evaluado" && (
                        <PassActionButton passId={p.id} step="evaluar" label="Marcar elegible" />
                      )}
                      {p.pass_status === "elegible" && (
                        <PassActionButton passId={p.id} step="conversar" label="Registrar conversación" />
                      )}
                      {["conversado", "ofrecido"].includes(p.pass_status) && (
                        <>
                          <PassActionButton passId={p.id} step="aceptar" label="Aceptó" />
                          <PassActionButton passId={p.id} step="declinar" label="Declinó" />
                          <PassActionButton passId={p.id} step="diferir" label="Diferir" />
                        </>
                      )}
                      {p.pass_status === "aceptado" && canEnroll && (
                        <form action={enrollFromPass} className="inline">
                          <input type="hidden" name="passId" value={p.id} />
                          <button
                            type="submit"
                            className="rounded-md bg-accent px-2.5 py-1 text-xs font-semibold text-white transition-opacity hover:opacity-90"
                          >
                            Inscribir + cargo
                          </button>
                        </form>
                      )}
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
          <p className="mt-2 text-xs text-faint">
            Cada paso queda auditado con quién y cuándo. Inscribir crea la participación y su cargo en un
            solo hecho.
          </p>
        </section>
      )}

      {/* ── Equipo del ciclo ── */}
      <section aria-label="Equipo">
        <SectionTitle>Equipo que sirve este ciclo</SectionTitle>
        {(team ?? []).length === 0 ? (
          <EmptyState title="Sin asignaciones de equipo vigentes." />
        ) : (
          <div className="grid gap-3 md:grid-cols-2">
            {(runs ?? [])
              .filter((r) => (team ?? []).some((t) => t.stage_run_id === r.id))
              .map((run) => {
                const runTeam = (team ?? []).filter((t) => t.stage_run_id === run.id);
                const runGroups = (groups ?? []).filter((g) => g.stage_run_id === run.id);
                const order: Record<string, number> = { entrenador: 0, coach: 1, capitan: 2, staff: 3 };
                return (
                  <Card key={run.id}>
                    <h3 className="font-semibold">{run.name}</h3>
                    <ul className="mt-2.5 space-y-1.5">
                      {runTeam
                        .sort((a, b) => (order[a.role] ?? 9) - (order[b.role] ?? 9))
                        .map((t) => (
                          <li key={t.id} className="flex items-center gap-2.5 text-sm">
                            <Avatar name={t.people?.full_name ?? "—"} size={26} />
                            <PersonLink id={t.person_id} name={t.people?.full_name ?? "—"} />
                            <Badge
                              variant={
                                t.role === "entrenador" ? "accent" : t.role === "capitan" ? "aqua" : "neutral"
                              }
                            >
                              {roleLabel(t.role)}
                            </Badge>
                          </li>
                        ))}
                    </ul>
                    {runGroups.length > 0 && (
                      <div className="mt-3 border-t border-line pt-3">
                        <p className="text-xs font-medium uppercase tracking-wider text-faint">
                          Grupos pequeños
                        </p>
                        <ul className="mt-1.5 space-y-1 text-sm text-muted">
                          {runGroups.map((g) => (
                            <li key={g.id}>
                              {g.name} · {g.people?.full_name ?? "sin staff"} ·{" "}
                              {plural((g.small_group_members ?? []).length, "persona", "personas")}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </Card>
                );
              })}
          </div>
        )}
      </section>

      {/* ── Enrolamientos originados ── */}
      {(attribs ?? []).length > 0 && (
        <section aria-label="Enrolamientos">
          <SectionTitle>Enrolamientos originados en este ciclo</SectionTitle>
          <ul className="space-y-2">
            {(attribs ?? []).map((a) => (
              <li
                key={a.id}
                className="flex flex-wrap items-center gap-2 rounded-(--radius-card) border border-line bg-surface px-4 py-3 text-sm"
              >
                <span className="font-medium">{a.enrolled?.full_name}</span>
                <span className="text-faint">enrolado por</span>
                <PersonLink id={a.enroller?.id} name={a.enroller?.full_name ?? "—"} />
                <Badge
                  variant={a.status === "confirmado" ? "ok" : a.status === "registrado" ? "aqua" : "neutral"}
                >
                  {a.status === "lead"
                    ? "Lead"
                    : a.status === "registrado"
                      ? "Registrado"
                      : a.status === "confirmado"
                        ? "Confirmado"
                        : "No avanzó"}
                </Badge>
              </li>
            ))}
          </ul>
          <p className="mt-2 text-xs text-faint">
            El PL llena el siguiente Básico: cada enrolamiento queda atribuido a quien lo originó.
          </p>
        </section>
      )}

      {/* ── Economía ── */}
      {showFinance && economy.length > 0 && (
        <section aria-label="Economía del ciclo">
          <SectionTitle
            action={
              <Link href="/finanzas" className="text-xs text-muted hover:text-accent-strong">
                Ver finanzas →
              </Link>
            }
          >
            Economía del ciclo
          </SectionTitle>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
            {economy.map((e) => (
              <Card key={e.label} className="!p-4">
                <p className="text-lg font-bold tabular-nums">{e.value}</p>
                <p className="text-xs text-muted">{e.label}</p>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* ── Roster por etapa ── */}
      <section aria-label="Roster">
        <SectionTitle>Roster por etapa</SectionTitle>
        <div className="space-y-4">
          {(runs ?? [])
            .filter((r) => (partsByRun.get(r.id) ?? []).length > 0)
            .map((run) => (
              <Card key={run.id} className="!p-0 overflow-hidden">
                <div className="border-b border-line bg-raised px-4 py-2.5">
                  <h3 className="text-sm font-semibold">
                    {run.name} · {plural((partsByRun.get(run.id) ?? []).length, "persona", "personas")}
                  </h3>
                </div>
                <ul className="divide-y divide-line">
                  {(partsByRun.get(run.id) ?? [])
                    .sort((a, b) =>
                      (a.people?.full_name ?? "").localeCompare(b.people?.full_name ?? "")
                    )
                    .map((p) => (
                      <li key={p.id} className="flex flex-wrap items-center gap-2.5 px-4 py-2.5">
                        <Avatar name={p.people?.full_name ?? "—"} size={28} />
                        <span className="min-w-0 flex-1 text-sm">
                          <PersonLink id={p.person_id} name={p.people?.full_name ?? "—"} />
                          {p.source && <span className="ml-2 text-xs text-faint">vía {p.source}</span>}
                        </span>
                        <RegistrationBadge status={p.registration_status} />
                        <DeliveryBadge status={p.delivery_status} />
                      </li>
                    ))}
                </ul>
              </Card>
            ))}
        </div>
        <p className="mt-2 text-xs text-faint">
          Registro y entrega son planos separados: una persona puede estar confirmada y retirada a la vez —
          eso es información, no contradicción.
        </p>
      </section>
    </div>
  );
}
