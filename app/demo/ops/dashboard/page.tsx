"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import {
  AlertTriangle,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Clock,
  DollarSign,
  MessageSquare,
  Phone,
  TrendingDown,
  TrendingUp,
  Users,
  Zap,
  Activity,
} from "lucide-react"
import { AvatarBadge } from "@/components/demo/AvatarBadge"
import { ActionToast, useActionToast } from "@/components/demo/ActionToast"
import {
  TODAY_EVENT,
  PRE_TRAINING_PENDING,
  FINANCIALS,
  AT_RISK_PARTICIPANTS,
  COACH_METRICS,
  RECENT_ACTIVITY,
} from "@/data/level"
import { cn } from "@/lib/utils"

// ─── Derived metrics ──────────────────────────────────────────────────────────

const preTrainingPending = PRE_TRAINING_PENDING.filter((p) => !p.confirmed).length
const overduePayments    = FINANCIALS.pendingParticipants.filter((p) => p.overdueDays > 0).length
const criticalAtRisk     = AT_RISK_PARTICIPANTS.filter((p) => p.riskLevel === "high").length

const URGENCIES = [
  {
    id: "pre",
    count: preTrainingPending,
    label: "sin confirmar",
    sublabel: "Pre-entrenamiento",
    color: "violet",
    href: "/demo/ops/pre-entrenamiento",
  },
  {
    id: "pay",
    count: overduePayments,
    label: "pagos vencidos",
    sublabel: "Cobrar esta semana",
    color: "red",
    href: "/demo/ops/comunidad",
  },
  {
    id: "risk",
    count: criticalAtRisk,
    label: "riesgo crítico",
    sublabel: "Activar hoy",
    color: "yellow",
    href: "/demo/atencion",
  },
]

// ─── Activity icon ────────────────────────────────────────────────────────────

function ActivityDot({ type }: { type: string }) {
  const colors: Record<string, string> = {
    success:    "bg-green-500",
    specialist: "bg-violet-500",
    new:        "bg-cyan-500",
    warning:    "bg-yellow-500",
    event:      "bg-pink-500",
  }
  return <span className={cn("w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1.5", colors[type] ?? "bg-white/20")} />
}

// ─── Coach contact card ───────────────────────────────────────────────────────

function CoachCard({ metric }: { metric: typeof COACH_METRICS[number] }) {
  const { toast, show, hide } = useActionToast()
  const urgency = metric.atRiskCount >= 6 ? "red" : metric.atRiskCount >= 3 ? "yellow" : "green"
  const trendUp = metric.momentumTrend > 0

  function contactCoach() {
    show(`Contactando a ${metric.name} por WhatsApp ✓`)
  }

  return (
    <div className="glass rounded-xl p-4 space-y-3">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <AvatarBadge initials={metric.avatar} size="sm" />
          <div>
            <p className="text-sm font-semibold text-white">{metric.name}</p>
            <p className="text-[10px] text-muted-foreground">{metric.cohorte}</p>
          </div>
        </div>
        <div className={cn(
          "flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold",
          urgency === "red"    ? "bg-red-500/15 text-red-400" :
          urgency === "yellow" ? "bg-yellow-500/15 text-yellow-400" :
          "bg-green-500/15 text-green-400"
        )}>
          <AlertTriangle className="w-2.5 h-2.5" />
          {metric.atRiskCount} en riesgo
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-2 text-center">
        <div>
          <p className="text-sm font-bold text-white">{metric.participantCount}</p>
          <p className="text-[9px] text-muted-foreground">participantes</p>
        </div>
        <div>
          <div className="flex items-center justify-center gap-0.5">
            <p className="text-sm font-bold text-white">{metric.groupMomentum}%</p>
            {trendUp
              ? <TrendingUp className="w-3 h-3 text-green-400" />
              : <TrendingDown className="w-3 h-3 text-red-400" />
            }
          </div>
          <p className="text-[9px] text-muted-foreground">momentum</p>
        </div>
        <div>
          <p className={cn("text-sm font-bold", metric.lastGroupContactDays > 5 ? "text-red-400" : "text-white")}>
            {metric.lastGroupContactDays === 0 ? "hoy" : `${metric.lastGroupContactDays}d`}
          </p>
          <p className="text-[9px] text-muted-foreground">último contacto</p>
        </div>
      </div>

      {/* Action */}
      <button
        onClick={contactCoach}
        className="w-full flex items-center justify-center gap-1.5 py-2 rounded-lg bg-cyan-600/15 hover:bg-cyan-600/25 border border-cyan-500/20 text-cyan-400 text-xs font-semibold transition-colors"
      >
        <MessageSquare className="w-3.5 h-3.5" />
        Enviar mensaje a {metric.name.split(" ")[0]}
      </button>
      <ActionToast message={toast.message} visible={toast.visible} onHide={hide} />
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function OpsDashboardPage() {
  const [checkedInSim] = useState(0)

  const greeting = useMemo(() => {
    const h = new Date().getHours()
    return h < 13 ? "Buenos días" : h < 20 ? "Buenas tardes" : "Buenas noches"
  }, [])

  const totalUrgencies = URGENCIES.reduce((s, u) => s + u.count, 0)

  return (
    <div className="p-5 max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-white">{greeting}, Karla</h1>
            <p className="text-muted-foreground text-xs mt-0.5">Operaciones · LEVEL CDMX</p>
          </div>
          {totalUrgencies > 0 && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-500/15 border border-red-500/20">
              <Zap className="w-3.5 h-3.5 text-red-400" />
              <span className="text-xs font-bold text-red-400">{totalUrgencies} pendientes</span>
            </div>
          )}
        </div>
      </div>

      {/* Urgency cards */}
      <div>
        <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold mb-3">
          Acciones prioritarias de hoy
        </p>
        <div className="grid grid-cols-3 gap-3">
          {URGENCIES.map((u) => (
            <Link
              key={u.id}
              href={u.href}
              className={cn(
                "glass rounded-xl p-3 text-center group hover:border-white/15 transition-all",
                u.count > 0 ? "border border-white/8" : "opacity-60"
              )}
            >
              <p className={cn(
                "text-2xl font-black",
                u.color === "red"    ? "text-red-400" :
                u.color === "yellow" ? "text-yellow-400" :
                "text-violet-400"
              )}>
                {u.count}
              </p>
              <p className="text-[10px] text-white font-semibold leading-tight mt-0.5">{u.label}</p>
              <p className="text-[9px] text-muted-foreground mt-0.5 leading-tight">{u.sublabel}</p>
              <ChevronRight className="w-3 h-3 text-muted-foreground mx-auto mt-1.5 group-hover:text-white transition-colors" />
            </Link>
          ))}
        </div>
      </div>

      {/* Today's event */}
      <div>
        <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold mb-3">
          Evento de hoy
        </p>
        <div className="glass rounded-xl p-4 space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-violet-500/20 flex items-center justify-center flex-shrink-0">
              <Calendar className="w-5 h-5 text-violet-400" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-white text-sm">{TODAY_EVENT.name}</p>
              <div className="flex flex-wrap items-center gap-3 mt-1">
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="w-3 h-3" />{TODAY_EVENT.time}
                </span>
                <span className="text-xs text-muted-foreground">{TODAY_EVENT.location}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-1 border-t border-white/5 text-center">
            <div>
              <p className="text-lg font-black text-white">{TODAY_EVENT.expectedAttendees}</p>
              <p className="text-[9px] text-muted-foreground">Esperados</p>
            </div>
            <div>
              <p className="text-lg font-black text-cyan-400">{TODAY_EVENT.registeredCount}</p>
              <p className="text-[9px] text-muted-foreground">Confirmados</p>
            </div>
            <div>
              <p className="text-lg font-black text-green-400">{checkedInSim}</p>
              <p className="text-[9px] text-muted-foreground">En sala</p>
            </div>
          </div>

          <Link
            href="/demo/ops/registro"
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg bg-green-600 hover:bg-green-700 text-white text-sm font-semibold transition-colors"
          >
            <CheckCircle2 className="w-4 h-4" />
            Abrir Mesa de Registro
          </Link>
        </div>
      </div>

      {/* Coach contacts */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">
            Contacto con coaches
          </p>
          <Link href="/demo/ops/comunidad" className="text-[10px] text-violet-400 hover:text-violet-300 flex items-center gap-1">
            Ver comunidad <ChevronRight className="w-3 h-3" />
          </Link>
        </div>
        <div className="space-y-3">
          {COACH_METRICS.map((m) => (
            <CoachCard key={m.id} metric={m} />
          ))}
        </div>
      </div>

      {/* Recent activity */}
      <div>
        <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold mb-3">
          Actividad reciente
        </p>
        <div className="glass rounded-xl divide-y divide-white/5">
          {RECENT_ACTIVITY.map((item, i) => (
            <div key={i} className="flex items-start gap-3 px-4 py-3">
              <ActivityDot type={item.type} />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-white leading-snug">{item.text}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">{item.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Financial snapshot */}
      <div>
        <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold mb-3">
          Resumen financiero del mes
        </p>
        <div className="glass rounded-xl p-4 space-y-3">
          <div className="grid grid-cols-3 gap-3 text-center">
            <div>
              <p className="text-base font-black text-white">
                ${(FINANCIALS.collected / 1000).toFixed(0)}k
              </p>
              <p className="text-[9px] text-muted-foreground">cobrado</p>
            </div>
            <div>
              <p className="text-base font-black text-red-400">
                ${(FINANCIALS.pending / 1000).toFixed(0)}k
              </p>
              <p className="text-[9px] text-muted-foreground">pendiente</p>
            </div>
            <div>
              <p className="text-base font-black text-green-400">{FINANCIALS.netMargin}%</p>
              <p className="text-[9px] text-muted-foreground">margen</p>
            </div>
          </div>

          {FINANCIALS.pendingParticipants.filter((p) => p.overdueDays > 0).length > 0 && (
            <div className="pt-2 border-t border-white/5 space-y-2">
              <p className="text-[10px] text-red-400 font-semibold uppercase tracking-wider">
                Pagos vencidos — avisar a su coach
              </p>
              {FINANCIALS.pendingParticipants
                .filter((p) => p.overdueDays > 0)
                .map((p) => (
                  <div key={p.name} className="flex items-center gap-2">
                    <AvatarBadge initials={p.avatar} size="xs" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-white font-medium truncate">{p.name}</p>
                      <p className="text-[10px] text-muted-foreground">{p.cohorte} · vencido hace {p.overdueDays}d</p>
                    </div>
                    <span className="text-xs font-bold text-red-400">${p.amount.toLocaleString()}</span>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
