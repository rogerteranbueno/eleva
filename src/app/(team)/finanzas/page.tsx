import { requireCapability } from "@/lib/capabilities";
import { createServiceClient } from "@/lib/supabase/server";
import { allocatePayment, confirmPayment, closeBatch } from "@/app/actions/finance";
import { Card, SectionTitle, Badge, EmptyState, PersonLink } from "@/components/ui";
import { money, dateShort, timeAgo, plural } from "@/lib/format";
import {
  chargeBalance,
  chargeIsOverdue,
  chargeConfirmedPaid,
  chargePendingConfirmation,
  collectedByCurrency,
  economyByCurrency,
  isUnidentified,
  formatByCurrency,
} from "@/modules/finance/ledger";

export const dynamic = "force-dynamic";

export default async function FinanzasPage() {
  const ctx = await requireCapability("finance.read");
  const service = createServiceClient();
  const canClose = ctx.roles.some((r) => ["dueno", "finanzas"].includes(r));

  const [{ data: payments }, { data: charges }, { data: batches }, { data: expenses }, { data: refunds }] =
    await Promise.all([
      service
        .from("payments")
        .select(
          "id, amount_cents, currency, method, reference, paid_at, confirmed, person_id, reconciliation_batch_id, people:person_id(full_name), payment_allocations(amount_cents, charges(concept)), refunds(amount_cents)"
        )
        .eq("organization_id", ctx.organizationId)
        .order("paid_at", { ascending: false }),
      service
        .from("charges")
        .select(
          "id, concept, amount_cents, currency, due_on, status, person_id, people(full_name), stage_participations(stage_runs(name, generation_cycles(name))), payment_allocations(amount_cents, payments(confirmed)), discounts(amount_cents, kind)"
        )
        .eq("organization_id", ctx.organizationId)
        .order("due_on"),
      service
        .from("reconciliation_batches")
        .select("id, period_start, period_end, status, closed_at, people:closed_by(full_name)")
        .eq("organization_id", ctx.organizationId)
        .order("period_start", { ascending: false }),
      service
        .from("expenses")
        .select("id, category, concept, amount_cents, currency, incurred_on, stage_runs(name)")
        .eq("organization_id", ctx.organizationId)
        .order("incurred_on", { ascending: false }),
      service
        .from("refunds")
        .select("id, amount_cents, currency, reason, created_at, payments(people:person_id(full_name))")
        .eq("organization_id", ctx.organizationId),
    ]);

  const pays = payments ?? [];
  const allCharges = charges ?? [];

  // Todo el dinero se calcula en modules/finance/ledger.ts — una sola vez, para
  // todas las vistas. Si esta página volviera a sumar por su cuenta, volvería a
  // contradecir a /generaciones y al Pulso.
  const unidentified = pays.filter(isUnidentified);
  const unconfirmed = pays.filter((p) => !p.confirmed);

  const openCharges = allCharges
    .map((c) => ({ ...c, rest: chargeBalance(c) }))
    .filter((c) => c.rest > 0);
  const overdueCharges = openCharges.filter((c) => chargeIsOverdue(c));

  // Economía por generación (el ciclo sale de la participación del cargo).
  const chargesByCycle = new Map<string, typeof allCharges>();
  for (const c of allCharges) {
    const cycleName =
      c.stage_participations?.stage_runs?.generation_cycles?.name ?? "Sin generación";
    chargesByCycle.set(cycleName, [...(chargesByCycle.get(cycleName) ?? []), c]);
  }
  const economyByCycle = [...chargesByCycle.entries()].map(([name, cs]) => ({
    name,
    totals: economyByCurrency({ charges: cs }),
  }));

  const recent = pays.filter(
    (p) => new Date(p.paid_at).getTime() > Date.now() - 30 * 24 * 3600_000
  );
  const cashTotals = collectedByCurrency(recent);
  const overdueTotals = economyByCurrency({ charges: overdueCharges });

  return (
    <div className="space-y-10">
      <header>
        <h1 className="text-2xl font-bold tracking-tight">Finanzas</h1>
        <p className="mt-1 text-sm text-muted">
          El ledger completo: un pago se reparte a cargos, el dinero sin identificar es visible, y
          las monedas jamás se suman entre sí.
        </p>
      </header>

      {/* KPIs */}
      <section aria-label="Resumen" className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Card className="!p-4">
          <p className="text-xl font-bold tabular-nums">
            {formatByCurrency(cashTotals, "cobrado")}
          </p>
          <p className="text-xs text-muted">cobrado confirmado (30 días)</p>
          {cashTotals.some((t) => t.devuelto > 0) && (
            <p className="text-[11px] text-faint">
              neto de {formatByCurrency(cashTotals, "devuelto")} devueltos
            </p>
          )}
        </Card>
        <Card className="!p-4">
          <p className="text-xl font-bold tabular-nums text-danger">
            {formatByCurrency(overdueTotals, "porCobrar")}
          </p>
          <p className="text-xs text-muted">vencido por cobrar (neto)</p>
        </Card>
        <Card className="!p-4">
          <p className={`text-xl font-bold ${unidentified.length ? "text-gold" : ""}`}>
            {unidentified.length}
          </p>
          <p className="text-xs text-muted">pagos sin identificar</p>
        </Card>
        <Card className="!p-4">
          <p className={`text-xl font-bold ${unconfirmed.length ? "text-gold" : ""}`}>
            {unconfirmed.length}
          </p>
          <p className="text-xs text-muted">pagos por confirmar</p>
        </Card>
      </section>

      {/* Pagos sin identificar */}
      {unidentified.length > 0 && (
        <section aria-label="Pagos sin identificar">
          <SectionTitle>Dinero sin identificar</SectionTitle>
          <ul className="space-y-2.5">
            {unidentified.map((p) => (
              <li key={p.id} className="rounded-(--radius-card) border border-gold/40 bg-surface p-4">
                <div className="flex flex-wrap items-center gap-2 text-sm">
                  <span className="text-lg font-bold tabular-nums">
                    {money(p.amount_cents, p.currency.trim())}
                  </span>
                  <span className="text-muted">
                    {p.method}
                    {p.reference && ` · ref. ${p.reference}`} · {timeAgo(p.paid_at)}
                  </span>
                  {p.people?.full_name && (
                    <Badge variant="neutral">dice ser de {p.people.full_name}</Badge>
                  )}
                </div>
                <form action={allocatePayment} className="mt-3 flex flex-wrap items-center gap-2">
                  <input type="hidden" name="paymentId" value={p.id} />
                  <label htmlFor={`charge-${p.id}`} className="text-xs text-muted">
                    Asignar a:
                  </label>
                  <select
                    id={`charge-${p.id}`}
                    name="chargeId"
                    required
                    className="min-w-0 flex-1 rounded-lg border border-line bg-raised px-2.5 py-1.5 text-xs"
                    defaultValue=""
                  >
                    <option value="" disabled>
                      Elige el cargo…
                    </option>
                    {openCharges
                      .filter((c) => c.currency.trim() === p.currency.trim())
                      .map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.people?.full_name} · {c.concept} · debe{" "}
                          {money(c.rest, c.currency.trim())}
                        </option>
                      ))}
                  </select>
                  <button
                    type="submit"
                    className="rounded-lg bg-accent px-3 py-1.5 text-xs font-semibold text-[#0b0a12] hover:opacity-90"
                  >
                    Asignar
                  </button>
                </form>
              </li>
            ))}
          </ul>
          <p className="mt-2 text-xs text-faint">
            Asignar identifica el pago, recalcula el estado del cargo y queda auditado. Solo se
            ofrecen cargos de la misma moneda.
          </p>
        </section>
      )}

      {/* Pagos por confirmar */}
      {unconfirmed.length > 0 && (
        <section aria-label="Pagos por confirmar">
          <SectionTitle>Por confirmar evidencia</SectionTitle>
          <ul className="space-y-2">
            {unconfirmed.map((p) => (
              <li
                key={p.id}
                className="flex flex-wrap items-center gap-3 rounded-(--radius-card) border border-line bg-surface px-4 py-3 text-sm"
              >
                <span className="font-bold tabular-nums">
                  {money(p.amount_cents, p.currency.trim())}
                </span>
                <span className="min-w-0 flex-1 text-muted">
                  {p.people?.full_name ?? "Sin identificar"} · {p.method}
                  {p.reference && ` · ${p.reference}`} · {timeAgo(p.paid_at)}
                </span>
                <form action={confirmPayment}>
                  <input type="hidden" name="paymentId" value={p.id} />
                  <button
                    type="submit"
                    className="rounded-lg border border-line px-3 py-1.5 text-xs font-medium text-muted hover:border-accent hover:text-accent-strong"
                  >
                    Confirmar evidencia
                  </button>
                </form>
              </li>
            ))}
          </ul>
          <p className="mt-2 text-xs text-faint">
            Un pago sin confirmar cuenta como provisional en el Pulso, nunca como cobrado.
          </p>
        </section>
      )}

      {/* Cargos vencidos */}
      <section aria-label="Vencido por cobrar">
        <SectionTitle>Vencido por cobrar</SectionTitle>
        {overdueCharges.length === 0 ? (
          <EmptyState title="Nada vencido: el ledger está al día." />
        ) : (
          <ul className="space-y-2">
            {overdueCharges
              .sort((a, b) => b.rest - a.rest)
              .map((c) => (
                <li
                  key={c.id}
                  className="flex flex-wrap items-center gap-3 rounded-(--radius-card) border border-line bg-surface px-4 py-3 text-sm"
                >
                  <span className="min-w-0 flex-1">
                    <PersonLink id={c.person_id} name={c.people?.full_name ?? "Sin persona"} />{" "}
                    <span className="text-muted">
                      · {c.concept} · venció {dateShort(c.due_on + "T12:00:00")}
                    </span>
                  </span>
                  {(c.discounts ?? []).length > 0 && (
                    <Badge variant="aqua">{c.discounts![0].kind}</Badge>
                  )}
                  <span className="font-bold tabular-nums text-danger">
                    {money(c.rest, c.currency.trim())}
                  </span>
                </li>
              ))}
          </ul>
        )}
      </section>

      {/* Conciliación por batch */}
      <section aria-label="Conciliación">
        <SectionTitle>Conciliación por periodo</SectionTitle>
        <ul className="space-y-2">
          {(batches ?? []).map((b) => {
            const inBatch = pays.filter((p) => p.reconciliation_batch_id === b.id);
            const pendingConfirm = inBatch.filter((p) => !p.confirmed).length;
            const pendingAlloc = inBatch.filter(isUnidentified).length;
            const batchTotals = collectedByCurrency(inBatch);
            return (
              <li
                key={b.id}
                className="flex flex-wrap items-center gap-3 rounded-(--radius-card) border border-line bg-surface px-4 py-3 text-sm"
              >
                <span className="min-w-0 flex-1">
                  {dateShort(b.period_start + "T12:00:00")} →{" "}
                  {dateShort(b.period_end + "T12:00:00")}
                  <span className="text-muted"> · {plural(inBatch.length, "pago", "pagos")}</span>
                  {batchTotals.some((t) => t.cobrado > 0) && (
                    <span className="text-muted"> · {formatByCurrency(batchTotals, "cobrado")}</span>
                  )}
                  {(pendingConfirm > 0 || pendingAlloc > 0) && (
                    <span className="text-gold">
                      {pendingConfirm > 0 && ` · ${pendingConfirm} sin confirmar`}
                      {pendingAlloc > 0 && ` · ${pendingAlloc} sin asignar`}
                    </span>
                  )}
                </span>
                {b.status === "cerrada" ? (
                  <Badge variant="ok">
                    Cerrada{b.people?.full_name ? ` por ${b.people.full_name}` : ""}
                  </Badge>
                ) : (
                  <>
                    <Badge variant="gold">Abierta</Badge>
                    {canClose && (
                      <form action={closeBatch}>
                        <input type="hidden" name="batchId" value={b.id} />
                        <button
                          type="submit"
                          className="rounded-lg border border-line px-3 py-1.5 text-xs font-medium text-muted hover:border-accent hover:text-accent-strong"
                          title={
                            pendingConfirm > 0 || pendingAlloc > 0
                              ? "Faltan pagos por confirmar o por asignar dentro del periodo"
                              : "Cerrar el periodo"
                          }
                        >
                          Cerrar periodo
                        </button>
                      </form>
                    )}
                  </>
                )}
              </li>
            );
          })}
        </ul>
        <p className="mt-2 text-xs text-faint">
          Cerrar un periodo exige que todos sus pagos tengan evidencia confirmada. Lo cerrado es lo
          único que el Pulso reporta como reconciliado.
        </p>
      </section>

      {/* Economía por generación */}
      <section aria-label="Economía por generación">
        <SectionTitle>Economía por generación</SectionTitle>
        <div className="grid gap-3 md:grid-cols-2">
          {economyByCycle.map(({ name, totals }) => (
            <Card key={name}>
              <h3 className="font-semibold">{name}</h3>
              <dl className="mt-2.5 space-y-1 text-sm">
                {totals.map((t) => (
                  <div key={t.currency} className="flex flex-wrap gap-x-4 gap-y-0.5">
                    <span className="text-muted">
                      Contratado:{" "}
                      <strong className="text-foreground">{money(t.contratado, t.currency)}</strong>
                    </span>
                    <span className="text-muted">
                      Cobrado: <strong className="text-ok">{money(t.cobrado, t.currency)}</strong>
                    </span>
                    <span className="text-muted">
                      Por cobrar:{" "}
                      <strong className={t.porCobrar > 0 ? "text-gold" : "text-foreground"}>
                        {money(t.porCobrar, t.currency)}
                      </strong>
                    </span>
                    {t.porConfirmar > 0 && (
                      <span className="text-faint">
                        (+{money(t.porConfirmar, t.currency)} registrado sin confirmar)
                      </span>
                    )}
                  </div>
                ))}
              </dl>
            </Card>
          ))}
        </div>
        <p className="mt-2 text-xs text-faint">
          Cobrado = pagos confirmados menos devoluciones. Un pago registrado sin evidencia
          confirmada no es caja: se reporta aparte y nunca reduce lo que se debe.
        </p>
      </section>

      {/* Gastos y devoluciones */}
      <section aria-label="Gastos" className="grid gap-6 md:grid-cols-2">
        <div>
          <SectionTitle>Gastos por etapa</SectionTitle>
          {(expenses ?? []).length === 0 ? (
            <p className="text-sm text-muted">Sin gastos registrados.</p>
          ) : (
            <ul className="space-y-1.5 text-sm">
              {(expenses ?? []).map((e) => (
                <li key={e.id} className="flex items-center justify-between gap-3">
                  <span className="min-w-0 flex-1 truncate text-muted">
                    {e.stage_runs?.name ?? "Centro"} · {e.concept}
                    <span className="text-faint"> · {e.category}</span>
                  </span>
                  <span className="font-medium tabular-nums">
                    {money(e.amount_cents, e.currency.trim())}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div>
          <SectionTitle>Devoluciones</SectionTitle>
          {(refunds ?? []).length === 0 ? (
            <p className="text-sm text-muted">Sin devoluciones.</p>
          ) : (
            <ul className="space-y-1.5 text-sm">
              {(refunds ?? []).map((r) => (
                <li key={r.id} className="flex items-center justify-between gap-3">
                  <span className="min-w-0 flex-1 truncate text-muted">
                    {r.payments?.people?.full_name ?? "—"} · {r.reason}
                  </span>
                  <span className="font-medium tabular-nums text-danger">
                    −{money(r.amount_cents, r.currency.trim())}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
}
