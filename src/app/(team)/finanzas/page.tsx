import Link from "next/link";
import { requireTeam } from "@/lib/context";
import { createServiceClient } from "@/lib/supabase/server";
import { reconcilePayment } from "@/app/actions/operations";
import { Card, SectionTitle, Badge, ParticipationStateBadge, EmptyState } from "@/components/ui";
import { money, dateShort } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function FinanzasPage() {
  const ctx = await requireTeam(["dueno", "finanzas", "oficinas"]);
  const service = createServiceClient();

  const [{ data: charges }, { data: payments }] = await Promise.all([
    service
      .from("charges")
      .select("id, concept, amount_cents, currency, due_on, status, person_id, people(full_name), payments(amount_cents)")
      .eq("organization_id", ctx.organizationId)
      .neq("status", "cancelado")
      .order("due_on"),
    service
      .from("payments")
      .select("id, amount_cents, currency, method, reference, paid_at, reconciled, charges(person_id, concept, people(full_name))")
      .eq("organization_id", ctx.organizationId)
      .order("paid_at", { ascending: false }),
  ]);

  const today = new Date().toISOString().slice(0, 10);
  const rows = (charges ?? []).map((c) => {
    const paid = (c.payments ?? []).reduce((s, p) => s + p.amount_cents, 0);
    return { ...c, paid, rest: c.amount_cents - paid, overdue: c.due_on < today && c.status !== "pagado" };
  });
  const unreconciled = (payments ?? []).filter((p) => !p.reconciled);
  const collected30 = (payments ?? [])
    .filter((p) => new Date(p.paid_at).getTime() > Date.now() - 30 * 24 * 3600_000)
    .reduce((s, p) => s + p.amount_cents, 0);
  const receivableOverdue = rows.filter((r) => r.overdue).reduce((s, r) => s + r.rest, 0);

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-bold tracking-tight">Finanzas</h1>
        <p className="mt-1 text-sm text-muted">
          Cobrado ≠ contratado ≠ por cobrar. Cada cifra usa su término exacto y
          las definitivas siempre reconcilian.
        </p>
      </header>

      <section className="grid grid-cols-3 gap-3">
        <Card className="!p-4">
          <p className="text-xs text-muted">Cobrado (30 días)</p>
          <p className="mt-1 text-2xl font-bold">{money(collected30)}</p>
        </Card>
        <Card className="!p-4">
          <p className="text-xs text-muted">Vencido por cobrar</p>
          <p className={`mt-1 text-2xl font-bold ${receivableOverdue > 0 ? "text-gold" : ""}`}>
            {money(receivableOverdue)}
          </p>
        </Card>
        <Card className="!p-4">
          <p className="text-xs text-muted">Pagos sin conciliar</p>
          <p className={`mt-1 text-2xl font-bold ${unreconciled.length > 0 ? "text-danger" : "text-ok"}`}>
            {unreconciled.length}
          </p>
        </Card>
      </section>

      {unreconciled.length > 0 && (
        <section aria-label="Pagos por conciliar">
          <SectionTitle>Pagos por conciliar</SectionTitle>
          <ul className="space-y-2">
            {unreconciled.map((p) => (
              <li key={p.id}>
                <Card className="flex flex-wrap items-center justify-between gap-3 !py-3.5">
                  <div>
                    <p className="text-sm font-medium">
                      {p.charges?.people?.full_name} · {money(p.amount_cents, p.currency.trim())}
                    </p>
                    <p className="text-xs text-faint">
                      {p.charges?.concept} · {p.method}
                      {p.reference && ` · ref ${p.reference}`} · {dateShort(p.paid_at)}
                    </p>
                  </div>
                  <form action={reconcilePayment}>
                    <input type="hidden" name="paymentId" value={p.id} />
                    <button
                      type="submit"
                      className="rounded-lg bg-ok-soft px-4 py-1.5 text-sm font-semibold text-ok hover:opacity-90"
                    >
                      Conciliar ✓
                    </button>
                  </form>
                </Card>
              </li>
            ))}
          </ul>
          <p className="mt-2 text-xs text-faint">
            Conciliar confirma que el pago coincide con el estado de cuenta. La
            acción queda auditada y mueve las métricas del Pulso de provisional a
            reconciliado.
          </p>
        </section>
      )}

      <section aria-label="Cargos">
        <SectionTitle>Cargos</SectionTitle>
        {rows.length === 0 ? (
          <EmptyState title="Sin cargos registrados." />
        ) : (
          <div className="overflow-x-auto rounded-(--radius-card) border border-line">
            <table className="w-full min-w-[640px] bg-surface text-sm">
              <thead>
                <tr className="border-b border-line text-left text-xs uppercase tracking-wider text-faint">
                  <th scope="col" className="px-4 py-3 font-medium">Persona</th>
                  <th scope="col" className="px-4 py-3 font-medium">Concepto</th>
                  <th scope="col" className="px-4 py-3 font-medium text-right">Monto</th>
                  <th scope="col" className="px-4 py-3 font-medium text-right">Pagado</th>
                  <th scope="col" className="px-4 py-3 font-medium">Vence</th>
                  <th scope="col" className="px-4 py-3 font-medium">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {rows.map((c) => (
                  <tr key={c.id} className="hover:bg-raised">
                    <td className="px-4 py-2.5">
                      <Link
                        href={`/personas/${c.person_id}`}
                        className="font-medium hover:text-accent-strong"
                      >
                        {c.people?.full_name}
                      </Link>
                    </td>
                    <td className="px-4 py-2.5 text-muted">{c.concept}</td>
                    <td className="px-4 py-2.5 text-right">{money(c.amount_cents, c.currency.trim())}</td>
                    <td className="px-4 py-2.5 text-right text-muted">{money(c.paid, c.currency.trim())}</td>
                    <td className={`px-4 py-2.5 ${c.overdue ? "text-danger" : "text-muted"}`}>
                      {c.due_on}
                    </td>
                    <td className="px-4 py-2.5">
                      {c.overdue && c.status !== "pagado" ? (
                        <Badge variant="danger">Vencido</Badge>
                      ) : (
                        <ParticipationStateBadge
                          state={c.status === "parcial" ? "pago_parcial" : c.status === "pagado" ? "pagado" : "registrado"}
                        />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
