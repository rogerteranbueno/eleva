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
    coach: "Coach",
    capitan: "Capitán",
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

/** Vocabulario canónico del ciclo (doc 18). Nunca "cohorte", nunca "sesión N". */
export const STAGE_LABEL: Record<string, string> = {
  basico: "Básico",
  avanzado: "Avanzado",
  pl: "PL",
};

export const EVENT_KIND_LABEL: Record<string, string> = {
  dia_basico: "Día de Básico",
  dia_avanzado: "Día de Avanzado",
  hito_pl: "Hito del PL",
  graduacion: "Graduación",
  actividad_equipo: "Actividad de equipo",
  llamada: "Llamada",
  evento_centro: "Evento del centro",
  evento_alumni: "Evento alumni",
};

export const PASS_STATUS_LABEL: Record<string, string> = {
  no_evaluado: "Sin evaluar",
  elegible: "Elegible",
  conversado: "Conversado",
  ofrecido: "Ofrecido",
  aceptado: "Aceptado",
  declinado: "Declinado",
  diferido: "Diferido",
};

export const NEXT_STATUS_LABEL: Record<string, string> = {
  sin_intencion: "Sin inscripción",
  reservado: "Reservado",
  inscrito: "Inscrito",
  iniciado: "Iniciado",
  no_show: "No llegó",
};

export const REGISTRATION_LABEL: Record<string, string> = {
  invitado: "Invitado",
  iniciado: "Registro iniciado",
  incompleto: "Registro incompleto",
  confirmado: "Confirmado",
  cancelado: "Cancelado",
};

export const DELIVERY_LABEL: Record<string, string> = {
  esperado: "Por comenzar",
  activo: "Activo",
  pausa: "En pausa",
  retirado: "Retirado",
  completo: "Completó",
  no_completo: "No completó",
};
