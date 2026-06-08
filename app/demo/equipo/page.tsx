"use client"

import { useState } from "react"
import {
  Users, TrendingUp, TrendingDown, AlertTriangle, CheckCircle2,
  Clock, Calendar, MessageCircle, Eye, Minus, ChevronDown, ChevronUp,
  Shield, Sparkles,
} from "lucide-react"
import { AvatarBadge } from "@/components/demo/AvatarBadge"
import { ActionToast, useActionToast } from "@/components/demo/ActionToast"
import { OnboardingModal } from "@/components/demo/OnboardingModal"
import { COACH_METRICS, COHORTES } from "@/data/creania"
import type { CoachMetrics } from "@/lib/types"
import { cn } from "@/lib/utils"

const ONBOARDING = {
  screenId: "equipo",
  badge: "Vista del dueño · Visibilidad de equipo",
  badgeColor: "violet" as const,
  title: "Sabe exactamente qué hace tu equipo",
  description: "¿Tu coach está teniendo contacto con sus participantes? ¿Completó sus sesiones este mes? Sin ELEVA, nunca sabrías. Aquí todo es visible.",
  tips: [
    { emoji: "🚨", text: "Ana lleva 9 días sin contactar a su generación — ELEVA lo detectó antes de que lo notaras." },
    { emoji: "📉", text: "El momentum de Gen. Norte bajó 7 puntos esta semana. Está vinculado a la sesión perdida de Marco." },
    { emoji: "✅", text: "Daniela completó las 6 sesiones del mes con momentum en alza. Así se ve un coach que trabaja." },
  ],
  cta: "Ver el equipo →",
}

function getMomentumColor(m: number) {
  if (m >= 70) return "text-green-400"
  if (m >= 55) return "text-yellow-400"
  return "text-red-400"
}

function getContactAlert(days: number): { label: string; color: string; icon: React.ReactNode } {
  if (days === 0) return { label: "Hoy", color: "text-green-400", icon: <CheckCircle2 className="w-3.5 h-3.5" /> }
  if (days <= 2) return { label: `Hace ${days} días`, color: "text-green-400", icon: <CheckCircle2 className="w-3.5 h-3.5" /> }
  if (days <= 5) return { label: `Hace ${days} días`, color: "text-yellow-400", icon: <Clock className="w-3.5 h-3.5" /> }
  return { label: `Hace ${days} días`, color: "text-red-400", icon: <AlertTriangle className="w-3.5 h-3.5" /> }
}

function TrendBadge({ trend }: { trend: number }) {
  if (trend > 0)
    return (
      <div className="flex items-center gap-1 text-green-400 text-[11px] font-semibold">
        <TrendingUp className="w-3 h-3" />
        +{trend} pts
      </div>
    )
  if (trend < 0)
    return (
      <div className="flex items-center gap-1 text-red-400 text-[11px] font-semibold">
        <TrendingDown className="w-3 h-3" />
        {trend} pts
      </div>
    )
  return (
    <div className="flex items-center gap-1 text-muted-foreground text-[11px]">
      <Minus className="w-3 h-3" />
      Sin cambio
    </div>
  )
}

function SessionBar({ done, planned }: { done: number; planned: number }) {
  const pct = Math.round((done / planned) * 100)
  const color = pct >= 90 ? "bg-green-500" : pct >= 60 ? "bg-yellow-500" : "bg-red-500"
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-[11px]">
        <span className="text-muted-foreground">Sesiones este mes</span>
        <span className={cn("font-bold", pct >= 90 ? "text-green-400" : pct >= 60 ? "text-yellow-400" : "text-red-400")}>
          {done}/{planned}
        </span>
      </div>
      <div className="h-1.5 rounded-full bg-white/8 overflow-hidden">
        <div className={cn("h-full rounded-full transition-all", color)} style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}

function AlertFlags({ coach }: { coach: CoachMetrics }) {
  const flags: { text: string; level: "critical" | "warning" }[] = []

  if (coach.lastGroupContactDays >= 7)
    flags.push({ text: `Sin contacto grupal hace ${coach.lastGroupContactDays} días`, level: "critical" })
  else if (coach.lastGroupContactDays >= 4)
    flags.push({ text: `Último contacto grupal hace ${coach.lastGroupContactDays} días`, level: "warning" })

  if (coach.lastOneOnOneDays >= 10)
    flags.push({ text: `Sin 1:1 con participantes hace ${coach.lastOneOnOneDays} días`, level: "critical" })
  else if (coach.lastOneOnOneDays >= 6)
    flags.push({ text: `Último 1:1 hace ${coach.lastOneOnOneDays} días`, level: "warning" })

  if (coach.missedSessions >= 2)
    flags.push({ text: `${coach.missedSessions} sesiones perdidas este mes`, level: "critical" })
  else if (coach.missedSessions === 1)
    flags.push({ text: "1 sesión perdida este mes", level: "warning" })

  if (coach.momentumTrend <= -5)
    flags.push({ text: `Momentum del grupo bajó ${Math.abs(coach.momentumTrend)} pts esta semana`, level: "critical" })

  if (flags.length === 0) return null

  return (
    <div className="space-y-1.5 mt-3">
      {flags.map((f, i) => (
        <div
          key={i}
          className={cn(
            "flex items-start gap-2 px-3 py-2 rounded-lg text-xs",
            f.level === "critical"
              ? "bg-red-500/10 text-red-400 border border-red-500/20"
              : "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
          )}
        >
          <AlertTriangle className="w-3 h-3 flex-shrink-0 mt-0.5" />
          {f.text}
        </div>
      ))}
    </div>
  )
}

function CoachCard({ coach, onAction }: { coach: CoachMetrics; onAction: (label: string) => void }) {
  const [expanded, setExpanded] = useState(false)
  const groupContact = getContactAlert(coach.lastGroupContactDays)
  const oneOnOne = getContactAlert(coach.lastOneOnOneDays)
  const cohorteData = COHORTES.find((c) => c.id === coach.cohorteId)

  const hasIssues = coach.lastGroupContactDays >= 4 || coach.missedSessions > 0 || coach.momentumTrend <= -5
  const hasCritical = coach.lastGroupContactDays >= 7 || coach.missedSessions >= 2 || coach.momentumTrend <= -5

  return (
    <div
      className={cn(
        "glass rounded-2xl overflow-hidden transition-colors",
        hasCritical ? "border border-red-500/25 bg-red-500/3" : hasIssues ? "border border-yellow-500/20" : "border border-green-500/15"
      )}
    >
      {/* Header */}
      <div className="p-5 pb-4">
        <div className="flex items-start gap-4">
          <div className="relative flex-shrink-0">
            <AvatarBadge initials={coach.avatar} size="md" />
            {hasCritical
              ? <div className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-red-500 border-2 border-background" />
              : hasIssues
              ? <div className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-yellow-500 border-2 border-background" />
              : <div className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-green-500 border-2 border-background" />
            }
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-bold text-white">{coach.name}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{coach.cohorte}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className={cn("text-2xl font-black", getMomentumColor(coach.groupMomentum))}>
                  {coach.groupMomentum}%
                </p>
                <TrendBadge trend={coach.momentumTrend} />
              </div>
            </div>

            {/* Quick stats */}
            <div className="grid grid-cols-3 gap-3 mt-3">
              <div className="text-center">
                <p className="text-lg font-black text-white">{coach.participantCount}</p>
                <p className="text-[10px] text-muted-foreground">participantes</p>
              </div>
              <div className="text-center border-x border-white/6">
                <p className={cn("text-lg font-black", coach.atRiskCount > 5 ? "text-red-400" : coach.atRiskCount > 2 ? "text-yellow-400" : "text-green-400")}>
                  {coach.atRiskCount}
                </p>
                <p className="text-[10px] text-muted-foreground">en riesgo</p>
              </div>
              <div className="text-center">
                <p className={cn("text-lg font-black", coach.missedSessions > 0 ? "text-red-400" : "text-green-400")}>
                  {coach.missedSessions > 0 ? coach.missedSessions : "0"}
                </p>
                <p className="text-[10px] text-muted-foreground">
                  {coach.missedSessions > 0 ? "ses. perdidas" : "ses. perdidas"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Alert flags */}
        <AlertFlags coach={coach} />
      </div>

      {/* Expandable detail */}
      <div className="border-t border-white/6">
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center justify-between w-full px-5 py-3 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <span>Ver actividad detallada</span>
          {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>

        {expanded && (
          <div className="px-5 pb-5 space-y-4 border-t border-white/4">
            <SessionBar done={coach.sessionsThisMonth} planned={coach.sessionsPlanned} />

            <div className="grid grid-cols-2 gap-3">
              <div className="glass rounded-xl p-3 space-y-1">
                <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-muted-foreground">
                  <Users className="w-3 h-3" />
                  Último contacto grupal
                </div>
                <div className={cn("flex items-center gap-1.5 text-sm font-semibold", groupContact.color)}>
                  {groupContact.icon}
                  {groupContact.label}
                </div>
              </div>
              <div className="glass rounded-xl p-3 space-y-1">
                <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-muted-foreground">
                  <MessageCircle className="w-3 h-3" />
                  Último 1:1 con participante
                </div>
                <div className={cn("flex items-center gap-1.5 text-sm font-semibold", oneOnOne.color)}>
                  {oneOnOne.icon}
                  {oneOnOne.label}
                </div>
              </div>
            </div>

            {/* Momentum visual */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-muted-foreground">Momentum de la generación</span>
                <span className={cn("font-bold", getMomentumColor(coach.groupMomentum))}>{coach.groupMomentum}%</span>
              </div>
              <div className="h-2 rounded-full bg-white/8 overflow-hidden">
                <div
                  className={cn(
                    "h-full rounded-full transition-all",
                    coach.groupMomentum >= 70 ? "bg-green-500" : coach.groupMomentum >= 55 ? "bg-yellow-500" : "bg-red-500"
                  )}
                  style={{ width: `${coach.groupMomentum}%` }}
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 flex-wrap pt-1">
              <button
                onClick={() => onAction(`Mensaje enviado a ${coach.name}`)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg glass text-xs font-medium text-muted-foreground hover:text-white transition-colors"
              >
                <MessageCircle className="w-3 h-3" /> Enviar mensaje
              </button>
              <button
                onClick={() => onAction(`Revisión agendada con ${coach.name}`)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg glass text-xs font-medium text-muted-foreground hover:text-white transition-colors"
              >
                <Calendar className="w-3 h-3" /> Agendar revisión
              </button>
              <a
                href={`/demo/crm?cohorte=${coach.cohorteId}`}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-violet-600 hover:bg-violet-700 text-xs font-medium text-white transition-colors"
              >
                <Eye className="w-3 h-3" /> Ver su generación
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function EquipoPage() {
  const { toast, show, hide } = useActionToast()

  const totalIssues = COACH_METRICS.reduce((acc, c) => acc + (c.lastGroupContactDays >= 4 ? 1 : 0) + (c.missedSessions > 0 ? 1 : 0), 0)
  const avgMomentum = Math.round(COACH_METRICS.reduce((acc, c) => acc + c.groupMomentum, 0) / COACH_METRICS.length)
  const totalAtRisk = COACH_METRICS.reduce((acc, c) => acc + c.atRiskCount, 0)
  const totalMissed = COACH_METRICS.reduce((acc, c) => acc + c.missedSessions, 0)

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto space-y-5">
      <OnboardingModal config={ONBOARDING} />

      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-white">Visibilidad de Equipo</h1>
        <p className="text-muted-foreground text-sm mt-0.5">
          {COACH_METRICS.length} coaches · actividad en tiempo real
        </p>
      </div>

      {/* Anti-fraud callout */}
      <div className="flex items-start gap-3 p-4 rounded-xl bg-violet-500/8 border border-violet-500/20">
        <Shield className="w-4 h-4 text-violet-400 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-xs text-white font-semibold mb-0.5">Visibilidad total, cero sorpresas</p>
          <p className="text-xs text-violet-300 leading-relaxed">
            Sin ELEVA, no sabrías si tu coach asistió a sus sesiones, cuándo fue la última vez que contactó a un participante en riesgo o por qué el momentum de una generación está bajando. ELEVA registra todo automáticamente.
          </p>
        </div>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Momentum promedio", value: `${avgMomentum}%`, color: "text-violet-400" },
          { label: "Participantes en riesgo", value: totalAtRisk, color: "text-red-400" },
          { label: "Sesiones perdidas", value: totalMissed, color: totalMissed > 0 ? "text-red-400" : "text-green-400" },
          { label: "Alertas activas", value: totalIssues, color: totalIssues > 0 ? "text-yellow-400" : "text-green-400" },
        ].map(({ label, value, color }) => (
          <div key={label} className="glass rounded-xl p-3 sm:p-4">
            <p className="text-[11px] text-muted-foreground mb-1">{label}</p>
            <p className={cn("text-2xl font-black", color)}>{value}</p>
          </div>
        ))}
      </div>

      {/* IA callout */}
      {totalMissed > 0 && (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-red-500/8 border border-red-500/20">
          <Sparkles className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-xs text-white font-semibold mb-0.5">
              ELEVA detectó {totalMissed} sesión{totalMissed !== 1 ? "es" : ""} no realizada{totalMissed !== 1 ? "s" : ""} este mes
            </p>
            <p className="text-xs text-red-300 leading-relaxed">
              Ana Reyes lleva 9 días sin contactar a su generación. Generación Omega tiene 6 participantes en riesgo y el momentum del grupo bajó 2 puntos esta semana. Si no hay contacto esta semana, proyección indica que 2–3 más entrarán en riesgo crítico.
            </p>
          </div>
        </div>
      )}

      {/* Coach cards */}
      <div className="space-y-4">
        <p className="text-[11px] uppercase tracking-widest text-muted-foreground font-medium">
          Coaches activos · {COACH_METRICS.length} asignados
        </p>
        {COACH_METRICS.map((coach) => (
          <CoachCard key={coach.id} coach={coach} onAction={show} />
        ))}
      </div>

      {/* Activity log */}
      <div className="glass rounded-2xl p-5 space-y-3">
        <p className="text-sm font-semibold text-white">Registro de actividad reciente</p>
        <div className="space-y-2.5">
          {[
            { time: "hace 45 min", text: "Daniela Torres completó sesión semanal con Gen. Vía 12", type: "ok" },
            { time: "hace 2 hrs",  text: "Marco Fuentes tuvo 1:1 con Andrés Mora (momentum subió 4 pts)", type: "ok" },
            { time: "hace 3 hrs",  text: "Ana Reyes no ha agendado sesión grupal esta semana", type: "warn" },
            { time: "hace 1 día",  text: "Marco Fuentes — sesión grupal reprogramada (momentum bajó -7 pts)", type: "warn" },
            { time: "hace 9 días", text: "Ana Reyes — último contacto registrado con Generación Omega", type: "critical" },
          ].map((entry, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className={cn(
                "w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1.5",
                entry.type === "ok" ? "bg-green-500" : entry.type === "warn" ? "bg-yellow-500" : "bg-red-500"
              )} />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-foreground leading-relaxed">{entry.text}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">{entry.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <ActionToast message={toast.message} visible={toast.visible} onHide={hide} />
    </div>
  )
}
