import Link from "next/link";
import type { ReactNode } from "react";

/* Primitivas de UI. Regla: color semántico, jerarquía clara,
   nada de tarjetas dentro de tarjetas. */

export function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-(--radius-card) border border-line bg-surface p-5 ${className}`}
    >
      {children}
    </div>
  );
}

export function SectionTitle({
  children,
  action,
}: {
  children: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-3 mb-3">
      <h2 className="text-sm font-semibold uppercase tracking-wider text-muted">
        {children}
      </h2>
      {action}
    </div>
  );
}

const badgeVariants = {
  accent: "bg-accent-soft text-accent-strong",
  aqua: "bg-aqua-soft text-aqua",
  gold: "bg-gold-soft text-gold",
  danger: "bg-danger-soft text-danger",
  ok: "bg-ok-soft text-ok",
  neutral: "bg-raised text-muted",
} as const;

export function Badge({
  children,
  variant = "neutral",
}: {
  children: ReactNode;
  variant?: keyof typeof badgeVariants;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap ${badgeVariants[variant]}`}
    >
      {children}
    </span>
  );
}

export function PriorityBadge({ priority }: { priority: string }) {
  const map: Record<string, { label: string; variant: keyof typeof badgeVariants }> = {
    alta: { label: "Prioridad alta", variant: "danger" },
    media: { label: "Prioridad media", variant: "gold" },
    baja: { label: "Prioridad baja", variant: "neutral" },
  };
  const item = map[priority] ?? map.baja;
  return <Badge variant={item.variant}>{item.label}</Badge>;
}

export function CaseStatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; variant: keyof typeof badgeVariants }> = {
    abierto: { label: "Abierto", variant: "accent" },
    en_progreso: { label: "En progreso", variant: "aqua" },
    esperando: { label: "Esperando respuesta", variant: "gold" },
    resuelto: { label: "Resuelto", variant: "ok" },
    descartado: { label: "Descartado", variant: "neutral" },
  };
  const item = map[status] ?? map.abierto;
  return <Badge variant={item.variant}>{item.label}</Badge>;
}

export function MetricStateBadge({
  state,
  note,
}: {
  state: "reconciliado" | "provisional" | "estimado";
  note?: string;
}) {
  const map = {
    reconciliado: { label: "Reconciliado", variant: "ok" as const },
    provisional: { label: "Provisional", variant: "gold" as const },
    estimado: { label: "Estimado", variant: "neutral" as const },
  };
  const item = map[state];
  return <Badge variant={item.variant}>{note ? `${item.label} · ${note}` : item.label}</Badge>;
}

export function ParticipationStateBadge({ state }: { state: string }) {
  const labels: Record<string, { label: string; variant: keyof typeof badgeVariants }> = {
    lead: { label: "Lead", variant: "neutral" },
    aplicado: { label: "Aplicó", variant: "neutral" },
    registrado: { label: "Registrada", variant: "accent" },
    pago_parcial: { label: "Pago parcial", variant: "gold" },
    pagado: { label: "Pagado", variant: "aqua" },
    confirmado: { label: "Confirmada", variant: "aqua" },
    activo: { label: "Activa", variant: "ok" },
    pausa: { label: "En pausa", variant: "gold" },
    completo: { label: "Completó", variant: "ok" },
    no_completo: { label: "No completó", variant: "neutral" },
    elegible_siguiente: { label: "Elegible al siguiente", variant: "accent" },
    inscrito_siguiente: { label: "Inscrita al siguiente", variant: "aqua" },
    alumni: { label: "Alumni", variant: "neutral" },
  };
  const item = labels[state] ?? { label: state, variant: "neutral" as const };
  return <Badge variant={item.variant}>{item.label}</Badge>;
}

export const POST_KIND_LABEL: Record<string, string> = {
  declaracion: "Declaración",
  aprendizaje: "Aprendizaje",
  pregunta: "Pregunta",
  celebracion: "Celebración",
  evidencia: "Evidencia",
  aviso: "Aviso",
};

export function EmptyState({
  title,
  children,
}: {
  title: string;
  children?: ReactNode;
}) {
  return (
    <div className="rounded-(--radius-card) border border-dashed border-line-strong px-6 py-10 text-center">
      <p className="font-medium text-foreground">{title}</p>
      {children && <div className="mt-2 text-sm text-muted">{children}</div>}
    </div>
  );
}

export function Avatar({ name, size = 36 }: { name: string; size?: number }) {
  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((p) => p[0])
    .join("")
    .toUpperCase();
  const hue =
    (Array.from(name).reduce((s, ch) => s + ch.charCodeAt(0), 0) % 5) * 60;
  const palette = [
    "bg-accent-soft text-accent-strong",
    "bg-aqua-soft text-aqua",
    "bg-gold-soft text-gold",
    "bg-ok-soft text-ok",
    "bg-danger-soft text-danger",
  ];
  return (
    <span
      aria-hidden
      className={`inline-flex items-center justify-center rounded-full font-semibold shrink-0 ${palette[hue / 60]}`}
      style={{ width: size, height: size, fontSize: size * 0.36 }}
    >
      {initials}
    </span>
  );
}

export function PersonLink({
  id,
  name,
  href,
}: {
  id?: string | null;
  name: string;
  href?: string;
}) {
  const url = href ?? (id ? `/personas/${id}` : undefined);
  if (!url) return <span>{name}</span>;
  return (
    <Link href={url} className="hover:text-accent-strong underline-offset-4 hover:underline">
      {name}
    </Link>
  );
}
