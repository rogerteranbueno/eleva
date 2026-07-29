/**
 * Ledger — la ÚNICA fuente de verdad del dinero en ELEVA.
 *
 * La auditoría del 28-jul encontró que /finanzas y /generaciones/[id]
 * reportaban cifras distintas del mismo ciclo ($24,000 de diferencia) porque
 * cada vista calculaba el dinero por su cuenta y solo una filtraba pagos
 * confirmados. Aquí vive el cálculo una sola vez: si una vista no usa este
 * módulo, está mal por construcción.
 *
 * Definiciones canónicas (doc de auditoría §5):
 *   contratado  — cargos válidos menos descuentos y cancelaciones
 *   registrado  — pago capturado, aún no necesariamente confirmado
 *   confirmado  — pago verificado por evidencia o proveedor
 *   asignado    — porción de un pago aplicada a un cargo
 *   devuelto    — salida de caja ligada a un pago
 *   cobrado     — asignaciones de pagos CONFIRMADOS, menos devoluciones
 *   por cobrar  — saldo exigible de cargos, neto de asignaciones confirmadas
 *                 y descuentos aprobados
 *
 * Regla dura: las monedas jamás se suman entre sí. Todo agrega por currency.
 */

import { money } from "@/lib/format";

// ---------------------------------------------------------------------------
// Formas mínimas que espera el ledger. Cualquier consulta que traiga estos
// campos sirve; no exigimos la fila completa.
// ---------------------------------------------------------------------------

export type AllocationLike = {
  amount_cents: number;
  /** El pago del que sale la asignación. Sin él NO se puede saber si cuenta. */
  payments?: { confirmed: boolean } | null;
};

export type DiscountLike = { amount_cents: number; kind?: string | null };

export type ChargeLike = {
  amount_cents: number;
  currency: string;
  status?: string | null;
  due_on?: string | null;
  payment_allocations?: AllocationLike[] | null;
  discounts?: DiscountLike[] | null;
};

export type PaymentLike = {
  amount_cents: number;
  currency: string;
  confirmed: boolean;
  payment_allocations?: { amount_cents: number }[] | null;
  refunds?: { amount_cents: number }[] | null;
};

export type ExpenseLike = { amount_cents: number; currency: string };

/** El select mínimo de un cargo para que el ledger pueda razonar sobre él. */
export const CHARGE_LEDGER_SELECT =
  "amount_cents, currency, status, due_on, payment_allocations(amount_cents, payments(confirmed)), discounts(amount_cents, kind)";

/** El select mínimo de un pago. */
export const PAYMENT_LEDGER_SELECT =
  "amount_cents, currency, confirmed, payment_allocations(amount_cents), refunds(amount_cents)";

// ---------------------------------------------------------------------------
// Cálculos por cargo
// ---------------------------------------------------------------------------

/** Cubierto por dinero real: solo asignaciones de pagos CONFIRMADOS. */
export function chargeConfirmedPaid(charge: ChargeLike): number {
  return (charge.payment_allocations ?? [])
    .filter((a) => a.payments?.confirmed === true)
    .reduce((s, a) => s + a.amount_cents, 0);
}

/** Asignado sin importar confirmación — sirve para explicar por qué falta. */
export function chargeAllocated(charge: ChargeLike): number {
  return (charge.payment_allocations ?? []).reduce((s, a) => s + a.amount_cents, 0);
}

export function chargeDiscounted(charge: ChargeLike): number {
  return (charge.discounts ?? []).reduce((s, d) => s + d.amount_cents, 0);
}

/** Contratado = lo que la persona realmente debe, neto de becas/descuentos. */
export function chargeContracted(charge: ChargeLike): number {
  return charge.amount_cents - chargeDiscounted(charge);
}

/**
 * Saldo exigible: contratado menos lo cubierto por pagos CONFIRMADOS.
 * Un pago registrado pero sin confirmar NO reduce lo que se debe.
 */
export function chargeBalance(charge: ChargeLike): number {
  return Math.max(0, chargeContracted(charge) - chargeConfirmedPaid(charge));
}

/** Diferencia entre lo asignado y lo confirmado: dinero prometido, no cobrado. */
export function chargePendingConfirmation(charge: ChargeLike): number {
  return chargeAllocated(charge) - chargeConfirmedPaid(charge);
}

export function chargeIsOverdue(charge: ChargeLike, today = new Date()): boolean {
  if (!charge.due_on) return false;
  if (charge.status === "cancelado") return false;
  return charge.due_on < today.toISOString().slice(0, 10) && chargeBalance(charge) > 0;
}

// ---------------------------------------------------------------------------
// Agregados por moneda
// ---------------------------------------------------------------------------

export type CurrencyTotals = {
  currency: string;
  contratado: number;
  cobrado: number;
  porCobrar: number;
  porConfirmar: number;
  devuelto: number;
  gastos: number;
  /** Cobrado − gastos. NO es utilidad contable: es caja menos costo directo. */
  margenSobreCobrado: number;
};

const EMPTY = (currency: string): CurrencyTotals => ({
  currency,
  contratado: 0,
  cobrado: 0,
  porCobrar: 0,
  porConfirmar: 0,
  devuelto: 0,
  gastos: 0,
  margenSobreCobrado: 0,
});

/**
 * Economía de un conjunto de cargos, pagos y gastos, agrupada por moneda.
 * Es el mismo cálculo para un ciclo, una etapa o el centro completo.
 */
export function economyByCurrency(args: {
  charges: ChargeLike[];
  expenses?: ExpenseLike[];
  /** Pagos del ámbito — solo se usan para restar devoluciones a la caja. */
  payments?: PaymentLike[];
}): CurrencyTotals[] {
  const map = new Map<string, CurrencyTotals>();
  const bucket = (currency: string) => {
    const key = currency.trim();
    if (!map.has(key)) map.set(key, EMPTY(key));
    return map.get(key)!;
  };

  for (const charge of args.charges) {
    if (charge.status === "cancelado") continue;
    const b = bucket(charge.currency);
    b.contratado += chargeContracted(charge);
    b.cobrado += chargeConfirmedPaid(charge);
    b.porCobrar += chargeBalance(charge);
    b.porConfirmar += chargePendingConfirmation(charge);
  }

  for (const payment of args.payments ?? []) {
    const devuelto = (payment.refunds ?? []).reduce((s, r) => s + r.amount_cents, 0);
    if (devuelto > 0) bucket(payment.currency).devuelto += devuelto;
  }

  for (const expense of args.expenses ?? []) {
    bucket(expense.currency).gastos += expense.amount_cents;
  }

  for (const b of map.values()) {
    // Caja real: lo confirmado menos lo que salió de vuelta.
    b.cobrado -= b.devuelto;
    b.margenSobreCobrado = b.cobrado - b.gastos;
  }

  return [...map.values()].sort((a, b) =>
    a.currency === "MXN" ? -1 : b.currency === "MXN" ? 1 : a.currency.localeCompare(b.currency)
  );
}

/**
 * Caja cobrada de un conjunto de pagos, por moneda: SOLO confirmados,
 * menos devoluciones. Es la definición que usan el Pulso y /finanzas.
 */
export function collectedByCurrency(payments: PaymentLike[]): CurrencyTotals[] {
  const map = new Map<string, CurrencyTotals>();
  for (const p of payments) {
    const key = p.currency.trim();
    if (!map.has(key)) map.set(key, EMPTY(key));
    const b = map.get(key)!;
    const devuelto = (p.refunds ?? []).reduce((s, r) => s + r.amount_cents, 0);
    if (p.confirmed) b.cobrado += p.amount_cents;
    else b.porConfirmar += p.amount_cents;
    b.devuelto += devuelto;
  }
  for (const b of map.values()) {
    b.cobrado -= b.devuelto;
    b.margenSobreCobrado = b.cobrado;
  }
  return [...map.values()].sort((a, b) =>
    a.currency === "MXN" ? -1 : b.currency === "MXN" ? 1 : a.currency.localeCompare(b.currency)
  );
}

/** Un pago sin ninguna asignación es dinero que entró y nadie identificó. */
export function paymentUnallocated(payment: PaymentLike): number {
  const allocated = (payment.payment_allocations ?? []).reduce(
    (s, a) => s + a.amount_cents,
    0
  );
  return payment.amount_cents - allocated;
}

export function isUnidentified(payment: PaymentLike): boolean {
  return (payment.payment_allocations ?? []).length === 0;
}

// ---------------------------------------------------------------------------
// Presentación
// ---------------------------------------------------------------------------

/** "$120,000 · USD 600" — nunca un solo número que mezcle monedas. */
export function formatByCurrency(
  totals: CurrencyTotals[],
  field: keyof Omit<CurrencyTotals, "currency"> = "cobrado"
): string {
  const parts = totals
    .filter((t) => t[field] !== 0)
    .map((t) => money(t[field], t.currency));
  return parts.length > 0 ? parts.join(" · ") : "—";
}
