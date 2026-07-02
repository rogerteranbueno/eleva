"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Target, CheckCircle2, Clock, Calendar, Star, Flame,
  ChevronRight, Bell, AlertCircle, Trophy, TrendingUp,
  MessageSquare, BookOpen, Zap, ArrowRight, Check,
} from "lucide-react"
import { AvatarBadge } from "@/components/demo/AvatarBadge"
import { MomentumGauge } from "@/components/demo/MomentumGauge"
import { ActionToast, useActionToast } from "@/components/demo/ActionToast"
import { useDemoStore } from "@/lib/demo-store"
import { VALERIA, COACHES } from "@/data/level"
import { cn, getMomentumColor } from "@/lib/utils"

// ─── Data ─────────────────────────────────────────────────────────────────────

const PENDING_TASKS = [
  {
    id: "t1",
    type: "mision" as const,
    title: "Misión 10: Conversación difícil pendiente",
    description: "Identifica una conversación que has estado evitando y tenla esta semana.",
    urgency: "overdue" as const,
    daysLeft: -3,
    points: 40,
    link: "/vl2026/mision",
  },
  {
    id: "t2",
    type: "mision" as const,
    title: "Misión 11: Mapa de mis creencias de dinero",
    description: "Escribe 5 creencias que tienes sobre el dinero y de dónde vienen.",
    urgency: "today" as const,
    daysLeft: 0,
    points: 35,
    link: "/vl2026/mision",
  },
  {
    id: "t3",
    type: "coaching" as const,
    title: "Llamada de coaching, semana 12",
    description: "30 min con Ana Reyes para revisar tu avance en el objetivo financiero.",
    urgency: "urgent" as const,
    daysLeft: 2,
    points: 25,
    link: "/vl2026/mision",
  },
  {
    id: "t4",
    type: "pago" as const,
    title: "Pago PL, Mes 4",
    description: "$4,200 MXN vencido hace 3 días.",
    urgency: "overdue" as const,
    daysLeft: -3,
    points: 0,
    link: "/vl2026/mision",
  },
]

const UPCOMING_EVENTS = [
  {
    id: "e1",
    title: "Sesión en vivo, Generación Omega",
    description: "Con tu coach Ana Reyes y todo el grupo",
    date: "Jueves 13 jun",
    time: "7:00 pm",
    daysLeft: 4,
    type: "session" as const,
    confirmed: false,
  },
  {
    id: "e2",
    title: "Webinar: Independencia Financiera en 12 Meses",
    description: "Con Laura Medina · Especialista de tu plan",
    date: "Martes 17 jun",
    time: "8:00 pm",
    daysLeft: 8,
    type: "webinar" as const,
    confirmed: true,
  },
  {
    id: "e3",
    title: "Noche de Invitados, LEVEL",
    description: "Trae a alguien que quieras que viva esto contigo",
    date: "Sábado 21 jun",
    time: "6:00 pm",
    daysLeft: 12,
    type: "invite" as const,
    confirmed: false,
  },
]

const ACHIEVEMENTS = [
  { id: "a1", title: "Primera misión", icon: "🎯", earned: true,  date: "mar 2025" },
  { id: "a2", title: "Racha de 7 días", icon: "🔥", earned: true,  date: "abr 2025" },
  { id: "a3", title: "Racha de 22 días", icon: "⚡", earned: true,  date: "may 2025" },
  { id: "a4", title: "10 misiones", icon: "🏅", earned: false, date: null },
  { id: "a5", title: "Racha de 30 días", icon: "💎", earned: false, date: null },
  { id: "a6", title: "Objetivo 100%", icon: "🏆", earned: false, date: null },
]

// ─── Sub-components ────────────────────────────────────────────────────────────

function UrgencyBadge({ urgency, daysLeft }: { urgency: string; daysLeft: number }) {
  if (urgency === "overdue") return (
    <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-500/15 text-red-400 border border-red-500/20 font-bold">
      Vencido hace {Math.abs(daysLeft)} {Math.abs(daysLeft) === 1 ? "día" : "días"}
    </span>
  )
  if (urgency === "today") return (
    <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/20 font-bold animate-pulse">
      Hoy
    </span>
  )
  if (urgency === "urgent") return (
    <span className="text-[10px] px-2 py-0.5 rounded-full bg-orange-500/15 text-orange-400 border border-orange-500/20 font-bold">
      {daysLeft}d restantes
    </span>
  )
  return null
}

function TaskTypeIcon({ type }: { type: "mision" | "coaching" | "pago" }) {
  if (type === "mision")   return <BookOpen className="w-4 h-4 text-violet-400" />
  if (type === "coaching") return <MessageSquare className="w-4 h-4 text-emerald-400" />
  if (type === "pago")     return <AlertCircle className="w-4 h-4 text-red-400" />
  return null
}

// ─── Main page ─────────────────────────────────────────────────────────────────

export default function MiPanelPage() {
  const { state } = useDemoStore()
  const { toast, show, hide } = useActionToast()
  const [done, setDone] = useState<Record<string, boolean>>({})
  const [confirmedEvents, setConfirmedEvents] = useState<Record<string, boolean>>({})

  const coach = COACHES.find(c => c.id === VALERIA.coachId)!
  const momentum = state.valeriaMomentum

  const pendingCount = PENDING_TASKS.filter(t => !done[t.id]).length
  const overdueCount = PENDING_TASKS.filter(t => t.urgency === "overdue" && !done[t.id]).length

  // Journey progress (PL Mes 3 of 5)
  const JOURNEY_STEPS = [
    { label: "Básico", done: true,  icon: Zap,       color: "bg-cyan-500" },
    { label: "Avanzado", done: true,  icon: BookOpen,  color: "bg-yellow-500" },
    { label: "Vía (M1)",  done: true,  icon: Star,      color: "bg-pink-400" },
    { label: "Vía (M2)",  done: true,  icon: Star,      color: "bg-pink-500" },
    { label: "Vía (M3)",  done: false, current: true, icon: Star, color: "bg-pink-600" },
    { label: "Vía (M4)",  done: false, icon: Star,      color: "bg-pink-700" },
    { label: "Vía (M5)",  done: false, icon: Star,      color: "bg-pink-800" },
    { label: "Nivel 3",   done: false, icon: Trophy,    color: "bg-violet-600" },
  ]
  const progressPct = Math.round((4 / 7) * 100) // 4 completed of 7 stages before Nivel 3

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">

      {/* ── Header, personal greeting ── */}
      <div className="glass rounded-2xl p-5">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <AvatarBadge initials={VALERIA.avatar} size="md" />
            <div>
              <h1 className="text-xl font-bold text-white">Hola, Valeria 👋</h1>
              <p className="text-muted-foreground text-sm">{VALERIA.cohorte} · {VALERIA.phase} · {VALERIA.phaseDetail}</p>
            </div>
          </div>
          <MomentumGauge score={momentum} size="sm" />
        </div>

        {/* Urgent alert */}
        {overdueCount > 0 && (
          <div className="mt-3 flex items-center gap-2.5 p-3 rounded-xl bg-red-500/8 border border-red-500/20">
            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
            <p className="text-sm text-red-300">
              Tienes <span className="font-bold">{overdueCount} {overdueCount === 1 ? "pendiente vencido" : "pendientes vencidos"}</span> que están afectando tu momentum.
            </p>
          </div>
        )}

        {/* Momentum message */}
        {momentum < 40 && (
          <div className="mt-2 flex items-center gap-2.5 p-3 rounded-xl bg-amber-500/8 border border-amber-500/20">
            <Flame className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <div>
              <p className="text-sm text-amber-300">Tu momentum está bajo. Completar una misión hoy puede ayudar a recuperar tu racha.</p>
              <Link href="/vl2026/mision" className="text-xs text-amber-400 font-semibold mt-0.5 flex items-center gap-1 hover:gap-2 transition-all">
                Ver mis misiones <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* ── Journey progress ── */}
      <div className="glass rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-white text-sm">Mi camino</h2>
          <span className="text-xs text-muted-foreground">{progressPct}% completado</span>
        </div>

        <div className="relative mb-4">
          <div className="h-2 bg-white/8 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 via-pink-500 to-violet-600 rounded-full transition-all duration-700"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>

        <div className="flex gap-1 overflow-x-auto scrollbar-none pb-1">
          {JOURNEY_STEPS.map((step, i) => {
            const Icon = step.icon
            return (
              <div key={i} className="flex flex-col items-center gap-1 min-w-[64px]">
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center border-2 flex-shrink-0",
                  step.done
                    ? `${step.color} border-transparent`
                    : "current" in step && step.current
                    ? "bg-pink-500/20 border-pink-500 ring-2 ring-pink-500/30"
                    : "bg-white/5 border-white/15"
                )}>
                  {step.done
                    ? <Check className="w-3.5 h-3.5 text-white" />
                    : "current" in step && step.current
                    ? <Icon className="w-3.5 h-3.5 text-pink-400" />
                    : <Icon className="w-3.5 h-3.5 text-white/30" />}
                </div>
                <span className={cn(
                  "text-[9px] text-center leading-tight font-medium",
                  step.done ? "text-white" : "current" in step && step.current ? "text-pink-400" : "text-white/30"
                )}>
                  {step.label}
                </span>
              </div>
            )
          })}
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-2 mt-4">
          {[
            { label: "Misiones", value: `${VALERIA.missionsCompleted}/${VALERIA.missionsTotal}`, icon: Target, color: "text-violet-400" },
            { label: "Racha activa", value: `${VALERIA.streak} días`, icon: Flame, color: VALERIA.streak > 0 ? "text-amber-400" : "text-red-400" },
            { label: "Mejor racha", value: `${VALERIA.bestStreak} días`, icon: Trophy, color: "text-emerald-400" },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="glass rounded-xl p-2.5 text-center">
              <Icon className={cn("w-4 h-4 mx-auto mb-1", color)} />
              <p className={cn("text-sm font-bold", color)}>{value}</p>
              <p className="text-[10px] text-muted-foreground">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Pending tasks ── */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-bold text-white">
            Pendientes
            {pendingCount > 0 && (
              <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-red-500/15 text-red-400 border border-red-500/20 font-bold">
                {pendingCount}
              </span>
            )}
          </h2>
          <Link href="/vl2026/mision" className="text-xs text-violet-400 hover:text-violet-300 flex items-center gap-1">
            Ver misiones <ChevronRight className="w-3 h-3" />
          </Link>
        </div>

        {pendingCount === 0 ? (
          <div className="glass rounded-xl p-6 text-center">
            <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-2" />
            <p className="text-sm font-bold text-white">¡Al corriente!</p>
            <p className="text-xs text-muted-foreground mt-1">No tienes pendientes. Revisa si hay misiones nuevas.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {PENDING_TASKS.filter(t => !done[t.id]).map(task => (
              <div
                key={task.id}
                className={cn(
                  "glass rounded-xl p-4",
                  task.urgency === "overdue" ? "border border-red-500/25 bg-red-500/3" :
                  task.urgency === "today"   ? "border border-amber-500/25 bg-amber-500/3" :
                  task.urgency === "urgent"  ? "border border-orange-500/20" : ""
                )}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex-shrink-0">
                    <TaskTypeIcon type={task.type} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 flex-wrap">
                      <p className="text-sm font-semibold text-white leading-tight">{task.title}</p>
                      <UrgencyBadge urgency={task.urgency} daysLeft={task.daysLeft} />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{task.description}</p>
                    {task.points > 0 && (
                      <p className="text-[10px] text-violet-400 mt-1.5">+{task.points} pts al completar</p>
                    )}
                  </div>
                </div>
                <div className="flex gap-2 mt-3">
                  <Link href={task.link} className="flex-1">
                    <button className="w-full py-1.5 px-3 rounded-lg bg-violet-600/15 text-violet-300 border border-violet-500/20 text-xs font-medium hover:bg-violet-600/25 transition-colors flex items-center justify-center gap-1.5">
                      Hacer ahora <ArrowRight className="w-3 h-3" />
                    </button>
                  </Link>
                  {task.type !== "pago" && (
                    <button
                      onClick={() => { setDone(p => ({ ...p, [task.id]: true })); show(`${task.title.split(":")[0]} marcada ✓`) }}
                      className="py-1.5 px-3 rounded-lg glass text-muted-foreground hover:text-emerald-400 text-xs font-medium transition-colors flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-3 h-3" />
                      Marcar hecha
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Upcoming events ── */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-bold text-white">Próximos eventos</h2>
        </div>
        <div className="space-y-2">
          {UPCOMING_EVENTS.map(event => {
            const isConfirmed = event.confirmed || confirmedEvents[event.id]
            return (
              <div key={event.id} className="glass rounded-xl p-4 flex items-start gap-3">
                <div className={cn(
                  "w-10 h-10 rounded-xl flex flex-col items-center justify-center flex-shrink-0 border text-center",
                  event.daysLeft <= 4 ? "bg-violet-500/15 border-violet-500/25" : "bg-white/5 border-white/10"
                )}>
                  <Calendar className={cn("w-3.5 h-3.5", event.daysLeft <= 4 ? "text-violet-400" : "text-muted-foreground")} />
                  <span className={cn("text-[9px] font-bold leading-none mt-0.5",
                    event.daysLeft <= 4 ? "text-violet-400" : "text-muted-foreground")}>
                    {event.daysLeft}d
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white leading-tight">{event.title}</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">{event.description}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    {event.date} · {event.time}
                  </p>
                </div>
                <div className="flex-shrink-0">
                  {isConfirmed ? (
                    <span className="text-[10px] px-2 py-1 rounded-lg bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 font-bold flex items-center gap-1">
                      <Check className="w-2.5 h-2.5" /> Confirmado
                    </span>
                  ) : (
                    <button
                      onClick={() => { setConfirmedEvents(p => ({ ...p, [event.id]: true })); show(`Asistencia confirmada ✓`) }}
                      className="text-[10px] px-2 py-1 rounded-lg bg-violet-600/15 text-violet-400 border border-violet-500/20 font-medium hover:bg-violet-600/25 transition-colors"
                    >
                      Confirmar
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* ── Achievements ── */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-bold text-white">Mis logros</h2>
          <Link href="/vl2026/logros" className="text-xs text-violet-400 hover:text-violet-300 flex items-center gap-1">
            Ver todos <ChevronRight className="w-3 h-3" />
          </Link>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {ACHIEVEMENTS.map(a => (
            <div
              key={a.id}
              className={cn(
                "glass rounded-xl p-3 text-center",
                !a.earned && "opacity-35"
              )}
            >
              <span className="text-2xl">{a.icon}</span>
              <p className={cn("text-[11px] font-semibold mt-1.5 leading-tight",
                a.earned ? "text-white" : "text-muted-foreground")}>
                {a.title}
              </p>
              {a.date && (
                <p className="text-[9px] text-muted-foreground mt-0.5">{a.date}</p>
              )}
              {!a.earned && (
                <p className="text-[9px] text-muted-foreground mt-0.5">🔒</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── Coach card ── */}
      <div className="glass rounded-xl p-4 flex items-center gap-3">
        <AvatarBadge initials={coach.avatar} size="sm" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-white">{coach.name}</p>
          <p className="text-xs text-muted-foreground">Tu coach · {coach.cohorte}</p>
        </div>
        <button
          onClick={() => show("Mensaje enviado a Ana Reyes ✓")}
          className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg bg-violet-600/15 text-violet-400 border border-violet-500/20 hover:bg-violet-600/25 transition-colors"
        >
          <MessageSquare className="w-3 h-3" />
          Escribir
        </button>
      </div>

      <ActionToast message={toast.message} visible={toast.visible} onHide={hide} />
    </div>
  )
}
