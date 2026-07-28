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

export function timeAgo(iso: string | Date) {
  const hours = hoursAgo(iso);
  if (hours < 1) return "hace unos minutos";
  if (hours < 24) return `hace ${plural(hours, "hora", "horas")}`;
  return `hace ${plural(Math.floor(hours / 24), "día", "días")}`;
}

export function roleLabel(role: string) {
  const map: Record<string, string> = {
    dueno: "Dirección",
    oficinas: "Oficinas",
    entrenador: "Entrenador",
    staff: "Staff",
    dream_team: "Dream Team",
    finanzas: "Finanzas",
    participante: "Participante",
  };
  return map[role] ?? role;
}

export const MODALITY_LABEL: Record<string, string> = {
  presencial: "Presencial",
  online: "Online",
  hibrida: "Híbrida",
};
