"use client"

import React, { useState } from "react"
import Link from "next/link"
import { Bell, Target, ArrowUpRight, Calendar, Filter, MessageSquare, Phone, CheckCircle, Clock, AlertTriangle } from "lucide-react"
import { AvatarBadge } from "@/components/demo/AvatarBadge"
import { ActionToast, useActionToast } from "@/components/demo/ActionToast"
import { OnboardingModal } from "@/components/demo/OnboardingModal"
import { useDemoStore } from "@/lib/demo-store"
import { AT_RISK_PARTICIPANTS, PRE_TRAINING_PENDING } from "@/data/level"
import { getMomentumColor, cn } from "@/lib/utils"

const ONBOARDING = {
  screenId: "atencion",
  badge: "Vista del dueño · Pantalla 2 de 3",
  badgeColor: "violet" as const,
  title: "Participantes en riesgo",
  description: "ELEVA detecta automáticamente quién está perdiendo momentum antes de que abandone. No esperas a que el coach te lo diga — el sistema ya lo sabe.",
  tips: [
    { emoji: "🔴", text: "Valeria lleva 11 días inactiva y está en prioridad máxima. Es la primera de la lista." },
    { emoji: "⚡", text: "Envía un recordatorio, asigna una misión o invita a un evento sin salir de esta pantalla." },
    { emoji: "📋", text: "El tab 'Pre-entrenamiento' muestra quién se inscribió al Básico pero no ha confirmado asistencia." },
  ],
  cta: "Intervenir ahora →",
}

const ACTION_LABELS = {
  reminder: { label: "Recordatorio", icon: Bell,     msg: "Recordatorio enviado ✓" },
  mission:  { label: "Nueva misión", icon: Target,   msg: "Misión asignada ✓" },
  event:    { label: "Invitar a evento", icon: Calendar, msg: "Invitación enviada ✓" },
}

function RiskBadge({ level }: { level: string }) {
  if (level === "high")
    return (
      <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-500/15 text-red-400 border border-red-500/20 font-medium">
        Crítico
      </span>
    )
  return (
    <span className="text-[10px] px-2 py-0.5 rounded-full bg-yellow-500/15 text-yellow-400 border border-yellow-500/20 font-medium">
      Moderado
    </span>
  )
}

// ─── Pre-training panel ───────────────────────────────────────────────────────

function PreTrainingPanel({
  confirmed,
  setConfirmed,
}: {
  confirmed: Record<string, boolean>
  setConfirmed: React.Dispatch<React.SetStateAction<Record<string, boolean>>>
}) {
  const [contacted, setContacted] = useState<Record<string, boolean>>({})
  const { toast, show, hide } = useActionToast()

  const pending  = PRE_TRAINING_PENDING.filter(p => !p.confirmed && !confirmed[p.id])
  const done     = PRE_TRAINING_PENDING.filter(p => p.confirmed || confirmed[p.id])
  const showRate = Math.round(((done.length) / PRE_TRAINING_PENDING.length) * 100)

  return (
    <div className="space-y-5">

      {/* Summary header */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Inscritos total", value: PRE_TRAINING_PENDING.length, color: "text-foreground" },
          { label: "Sin confirmar", value: pending.length, color: "text-amber-400" },
          { label: "Confirmados", value: done.length, color: "text-emerald-400" },
        ].map(({ label, value, color }) => (
          <div key={label} className="glass rounded-xl p-3 text-center">
            <p className={`text-2xl font-black ${color}`}>{value}</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Progress bar */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Tasa de confirmación actual</span>
          <span className={`font-black ${showRate >= 90 ? "text-emerald-400" : showRate >= 75 ? "text-amber-400" : "text-red-400"}`}>
            {showRate}%
          </span>
        </div>
        <div className="h-2 bg-white/6 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${showRate >= 90 ? "bg-emerald-500" : showRate >= 75 ? "bg-amber-500" : "bg-red-500"}`}
            style={{ width: `${showRate}%` }}
          />
        </div>
        <p className="text-[10px] text-muted-foreground">
          Entrenamiento básico: <span className="text-foreground font-semibold">viernes 13 jun, 10:00am</span>
          {showRate < 90 && <span className="text-amber-400 ml-2">· Objetivo: 95%+</span>}
        </p>
      </div>

      {/* Pending list */}
      {pending.length > 0 && (
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest text-amber-400 mb-3 flex items-center gap-1.5">
            <AlertTriangle className="w-3 h-3" />
            Sin confirmar — {pending.length} personas
          </p>
          <div className="space-y-2">
            {pending.map((p) => (
              <div key={p.id}
                className="glass rounded-xl p-4 border border-amber-500/15 bg-amber-500/3">
                <div className="flex items-start gap-3">
                  <AvatarBadge initials={p.avatar} size="md" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-semibold text-white text-sm">{p.name}</p>
                        <p className="text-[11px] text-muted-foreground mt-0.5">
                          Inscrito por <span className="text-foreground font-medium">{p.enrolledBy}</span>
                          {" · "}inscripción {p.enrollDate}
                        </p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-xs font-bold text-amber-400">{p.daysUntilTraining}d</p>
                        <p className="text-[10px] text-muted-foreground">para el entreno</p>
                      </div>
                    </div>

                    {p.contactAttempts > 0 && (
                      <p className="text-[10px] text-muted-foreground mt-1.5 flex items-center gap-1">
                        <Clock className="w-2.5 h-2.5" />
                        {p.contactAttempts} intento{p.contactAttempts > 1 ? "s" : ""} de contacto
                      </p>
                    )}

                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={() => { setContacted(prev => ({ ...prev, [p.id]: true })); show(`Recordatorio enviado a ${p.name} ✓`) }}
                        disabled={!!contacted[p.id]}
                        className={cn(
                          "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                          contacted[p.id]
                            ? "bg-green-500/15 text-green-400 border border-green-500/20 cursor-default"
                            : "glass text-muted-foreground hover:text-white hover:border-violet-500/40"
                        )}
                      >
                        <MessageSquare className="w-3 h-3" />
                        {contacted[p.id] ? "Enviado ✓" : "Enviar recordatorio"}
                      </button>
                      <button
                        onClick={() => { setConfirmed(prev => ({ ...prev, [p.id]: true })); show(`${p.name} confirmado ✓`) }}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium glass text-muted-foreground hover:text-emerald-400 hover:border-emerald-500/40 transition-all"
                      >
                        <CheckCircle className="w-3 h-3" />
                        Marcar confirmado
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Confirmed */}
      {done.length > 0 && (
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest text-emerald-400 mb-3 flex items-center gap-1.5">
            <CheckCircle className="w-3 h-3" />
            Confirmados — {done.length} personas
          </p>
          <div className="space-y-2">
            {done.map((p) => (
              <div key={p.id} className="glass rounded-xl p-3 opacity-70">
                <div className="flex items-center gap-3">
                  <AvatarBadge initials={p.avatar} size="sm" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white">{p.name}</p>
                    <p className="text-[10px] text-muted-foreground">Invitado por {p.enrolledBy}</p>
                  </div>
                  <span className="text-emerald-400 text-xs font-medium">Confirmado ✓</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {pending.length === 0 && (
        <div className="text-center py-8">
          <CheckCircle className="w-10 h-10 text-emerald-400 mx-auto mb-3" />
          <p className="text-sm font-bold text-white">100% confirmados</p>
          <p className="text-xs text-muted-foreground mt-1">Todos los inscritos confirmaron asistencia</p>
        </div>
      )}

      <ActionToast message={toast.message} visible={toast.visible} onHide={hide} />
    </div>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function AtencionPage() {
  const { state, dispatch } = useDemoStore()
  const { toast, show, hide } = useActionToast()
  const [view, setView]   = useState<"riesgo" | "pretraining">("riesgo")
  const [filter, setFilter] = useState<"all" | "high" | "medium">("all")
  const [actioned, setActioned] = useState<Record<string, Record<string, boolean>>>({})
  const [preConfirmed, setPreConfirmed] = useState<Record<string, boolean>>({})

  const filtered = AT_RISK_PARTICIPANTS.filter((p) =>
    filter === "all" ? true : p.riskLevel === filter
  )

  function handleAction(participantId: string, action: string, msg: string) {
    setActioned((prev) => ({
      ...prev,
      [participantId]: { ...(prev[participantId] || {}), [action]: true },
    }))
    if (participantId === "p1") {
      if (action === "reminder") dispatch({ type: "SEND_REMINDER" })
      if (action === "mission")  dispatch({ type: "ASSIGN_MISSION" })
      if (action === "event")    dispatch({ type: "INVITE_EVENT" })
    } else {
      // Any action on any at-risk participant marks one as resolved
      if (action === "reminder" || action === "mission") {
        dispatch({ type: "RESOLVE_ATENCION" })
      }
    }
    show(msg)
  }

  const unconfirmedCount = PRE_TRAINING_PENDING.filter(p => !p.confirmed && !preConfirmed[p.id]).length

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <OnboardingModal config={ONBOARDING} />

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Necesitan Atención</h1>
        <p className="text-muted-foreground text-sm mt-0.5">
          {AT_RISK_PARTICIPANTS.length} participantes detectados por el sistema · actúa directo desde aquí
        </p>
      </div>

      {/* Tab switcher */}
      <div className="flex gap-1 p-1 bg-white/4 rounded-xl border border-white/8">
        <button
          onClick={() => setView("riesgo")}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-semibold transition-all",
            view === "riesgo" ? "bg-red-500/20 text-red-300 border border-red-500/20" : "text-muted-foreground hover:text-foreground"
          )}
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          En riesgo de abandono
          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-red-500/20 text-red-400 font-bold">
            {Math.max(0, AT_RISK_PARTICIPANTS.length - state.atencionResolved)}
          </span>
        </button>
        <button
          onClick={() => setView("pretraining")}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-semibold transition-all",
            view === "pretraining" ? "bg-amber-500/20 text-amber-300 border border-amber-500/20" : "text-muted-foreground hover:text-foreground"
          )}
        >
          <Clock className="w-3.5 h-3.5" />
          Pre-entrenamiento Básico
          {unconfirmedCount > 0 && (
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 font-bold">
              {unconfirmedCount} sin confirmar
            </span>
          )}
        </button>
      </div>

      {/* ── At-risk view ── */}
      {view === "riesgo" && (
        <>
          {/* Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            {(["all", "high", "medium"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-medium transition-colors",
                  filter === f ? "bg-violet-600 text-white" : "glass text-muted-foreground hover:text-foreground"
                )}
              >
                {f === "all" ? "Todos" : f === "high" ? "🔴 Crítico" : "🟡 Moderado"}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            {filtered.map((p) => {
              const isValeria    = p.id === "p1"
              const done         = actioned[p.id] || {}
              const momentumValue = isValeria ? state.valeriaMomentum : p.momentum

              return (
                <div key={p.id}
                  className={cn("glass rounded-xl p-4 transition-colors",
                    isValeria ? "border border-red-500/30 bg-red-500/5" : "")}>
                  <div className="flex items-start gap-4">
                    <AvatarBadge initials={p.avatar} size="md" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-semibold text-white">{p.name}</p>
                        <RiskBadge level={p.riskLevel} />
                        {isValeria && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/30 font-medium">
                            Prioridad máxima
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {p.cohorte} · {p.phase}
                      </p>
                      <div className="flex items-center gap-4 mt-2 flex-wrap">
                        <div className="flex items-center gap-1.5">
                          <div className="text-sm font-bold" style={{ color: getMomentumColor(momentumValue) }}>
                            {momentumValue}%
                          </div>
                          <span className="text-xs text-muted-foreground">momentum</span>
                        </div>
                        {p.inactiveDays > 0 && (
                          <div className="text-xs text-muted-foreground">
                            <span className="text-red-400 font-medium">{p.inactiveDays} días</span> inactivo
                          </div>
                        )}
                        {p.pendingMissions > 0 && (
                          <div className="text-xs text-muted-foreground">
                            <span className="text-yellow-400 font-medium">{p.pendingMissions}</span> misión{p.pendingMissions > 1 ? "es" : ""} pendiente
                          </div>
                        )}
                      </div>
                      <div className="grid grid-cols-3 gap-1.5 mt-3 sm:flex sm:flex-wrap sm:gap-2">
                        {Object.entries(ACTION_LABELS).map(([key, { label, icon: Icon, msg }]) => (
                          <button
                            key={key}
                            onClick={() => handleAction(p.id, key, msg)}
                            disabled={!!done[key]}
                            className={cn(
                              "flex items-center justify-center gap-1 px-2 py-1.5 rounded-lg text-xs font-medium transition-all sm:justify-start sm:gap-1.5 sm:px-3",
                              done[key]
                                ? "bg-green-500/15 text-green-400 border border-green-500/20 cursor-default"
                                : "glass text-muted-foreground hover:text-white hover:border-violet-500/40"
                            )}
                          >
                            <Icon className="w-3 h-3" />
                            {done[key] ? "Enviado ✓" : label}
                          </button>
                        ))}
                        {isValeria && (
                          <Link href="/demo/expediente" className="col-span-3 sm:col-span-1">
                            <button className="flex items-center justify-center gap-1.5 w-full px-3 py-1.5 rounded-lg text-xs font-medium bg-violet-600 text-white hover:bg-violet-700 transition-colors">
                              <ArrowUpRight className="w-3 h-3" />
                              Ver expediente
                            </button>
                          </Link>
                        )}
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0 hidden sm:block">
                      <div className="text-2xl font-black" style={{ color: getMomentumColor(momentumValue) }}>
                        {momentumValue}%
                      </div>
                      <div className="text-[10px] text-muted-foreground">momentum</div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </>
      )}

      {/* ── Pre-training view ── */}
      {view === "pretraining" && <PreTrainingPanel confirmed={preConfirmed} setConfirmed={setPreConfirmed} />}

      <ActionToast message={toast.message} visible={toast.visible} onHide={hide} />
    </div>
  )
}
