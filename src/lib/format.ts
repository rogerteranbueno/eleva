/** Formato compartido: moneda, fechas y plurales correctos, siempre visibles. */

export function money(cents: number, currency = "MXN") {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

export function dateShort(iso: string | Date, timezone = "America/Mexico_City") {
  return new Intl.DateTimeFormat("es-MX", {
    day: "numeric",
    month: "short",
    timeZone: timezone,
  }).format(new Date(iso));
}

export function dateTime(iso: string | Date, timezone = "America/Mexico_City") {
  return new Intl.DateTimeFormat("es-MX", {
    weekday: "long",
    day: "numeric",
    month: "long",
    hour: "numeric",
    minute: "2-digit",
    timeZone: timezone,
  }).format(new Date(iso));
}

export function relativeDays(iso: string | Date) {
  const diff = Math.round(
    (new Date(iso).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );
  const rtf = new Intl.RelativeTimeFormat("es-MX", { numeric: "auto" });
  return rtf.format(diff, "day");
}

export function hoursAgo(iso: string | Date) {
  return Math.floor((Date.now() - new Date(iso).getTime()) / (1000 * 60 * 60));
}

export function plural(n: number, singular: string, pluralForm: string) {
  return `${n} ${n === 1 ? singular : pluralForm}`;
}
