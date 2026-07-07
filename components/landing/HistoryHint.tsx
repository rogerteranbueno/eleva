"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"

interface HistoryHintProps {
  variant: 1 | 2 | 3 | 4 | 5
}

const hints = {
  1: {
    body: "Antes de formarte como entrenador, conoce de dónde viene esta industria. Muchos programas actuales siguen usando modelos heredados de los años 70.",
    cta: "Leer la historia",
    href: "/historia-transformacion",
    accent: "amber",
  },
  2: {
    body: "Un diploma no te vuelve entrenador. La presencia, la escucha, la intervención y la ética se entrenan con práctica, supervisión y estándares reales.",
    cta: "Ver el estándar ELEVA",
    href: "/estandar-eleva",
    accent: "violet",
  },
  3: {
    body: "No pagues por calentar una silla. Fórmate para sostener una carrera. PACTO desarrolla competencias reales, no sólo entrega certificados.",
    cta: "Aplicar a PACTO",
    href: "/pacto",
    accent: "violet",
  },
  4: {
    body: "La transformación sin cuidado puede hacer daño. ELEVA integra seguridad psicológica, protocolos, supervisión y criterios profesionales.",
    cta: "Conocer el estándar",
    href: "/estandar-eleva",
    accent: "emerald",
  },
  5: {
    body: "Tu centro no necesita otro gurú. Necesita procesos, equipo y sistema listos para usarse: entrenadores propios, staff profesional y estructura que sostenga el crecimiento.",
    cta: "Agendar diagnóstico",
    href: "/build",
    accent: "violet",
  },
}

const accentMap = {
  amber: "border-amber-500/20 bg-amber-500/4",
  violet: "border-violet-500/20 bg-violet-500/4",
  emerald: "border-emerald-500/20 bg-emerald-500/4",
}

const ctaMap = {
  amber: "text-amber-400 hover:text-amber-300",
  violet: "text-violet-400 hover:text-violet-300",
  emerald: "text-emerald-400 hover:text-emerald-300",
}

export function HistoryHint({ variant }: HistoryHintProps) {
  const h = hints[variant]
  return (
    <div className={`my-6 mx-auto max-w-3xl px-6 py-4 rounded-2xl border ${accentMap[h.accent as keyof typeof accentMap]} flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4`}>
      <p className="text-sm text-muted-foreground leading-snug max-w-xl">{h.body}</p>
      <Link href={h.href} className="shrink-0">
        <button className={`flex items-center gap-1.5 text-sm font-bold whitespace-nowrap ${ctaMap[h.accent as keyof typeof ctaMap]} transition-colors group`}>
          {h.cta}
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </Link>
    </div>
  )
}
