"use client"

import { useState } from "react"
import Link from "next/link"
import { Bell, Target, ArrowUpRight, Calendar, Filter, ChevronDown } from "lucide-react"
import { AvatarBadge } from "@/components/demo/AvatarBadge"
import { ActionToast, useActionToast } from "@/components/demo/ActionToast"
import { OnboardingModal } from "@/components/demo/OnboardingModal"
import { useDemoStore } from "@/lib/demo-store"
import { AT_RISK_PARTICIPANTS } from "@/data/creania"
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
    { emoji: "📋", text: "Toca 'Ver expediente' en Valeria para ver su historial completo y escalar al coach." },
  ],
  cta: "Intervenir ahora →",
}

const ACTION_LABELS = {
  reminder: { label: "Recordatorio", icon: Bell, msg: "Recordatorio enviado ✓" },
  mission: { label: "Nueva misión", icon: Target, msg: "Misión asignada ✓" },
  event: { label: "Invitar a evento", icon: Calendar, msg: "Invitación enviada ✓" },
}

export default function AtencionPage() {
  const { state, dispatch } = useDemoStore()
  const { toast, show, hide } = useActionToast()
  const [filter, setFilter] = useState<"all" | "high" | "medium">("all")
  const [actioned, setActioned] = useState<Record<string, Record<string, boolean>>>({})

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
      if (action === "mission") dispatch({ type: "ASSIGN_MISSION" })
      if (action === "event") dispatch({ type: "INVITE_EVENT" })
    }
    show(msg)
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <OnboardingModal config={ONBOARDING} />
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Necesitan Atención</h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            {AT_RISK_PARTICIPANTS.length} participantes con momentum bajo — ordenados por riesgo
          </p>
        </div>
        {/* Filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          {(["all", "high", "medium"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-medium transition-colors",
                filter === f
                  ? "bg-violet-600 text-white"
                  : "glass text-muted-foreground hover:text-foreground"
              )}
            >
              {f === "all" ? "Todos" : f === "high" ? "🔴 Crítico" : "🟡 Moderado"}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div className="space-y-3">
        {filtered.map((p) => {
          const isValeria = p.id === "p1"
          const done = actioned[p.id] || {}
          const momentumValue = isValeria ? state.valeriaMomentum : p.momentum

          return (
            <div
              key={p.id}
              className={cn(
                "glass rounded-xl p-4 transition-colors",
                isValeria ? "border border-red-500/30 bg-red-500/5" : ""
              )}
            >
              <div className="flex items-start gap-4">
                {/* Avatar */}
                <AvatarBadge initials={p.avatar} size="md" />

                {/* Info */}
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

                  {/* Stats row */}
                  <div className="flex items-center gap-4 mt-2 flex-wrap">
                    <div className="flex items-center gap-1.5">
                      <div
                        className="text-sm font-bold"
                        style={{ color: getMomentumColor(momentumValue) }}
                      >
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

                  {/* Action buttons */}
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

                {/* Momentum mini display */}
                <div className="text-right flex-shrink-0 hidden sm:block">
                  <div
                    className="text-2xl font-black"
                    style={{ color: getMomentumColor(momentumValue) }}
                  >
                    {momentumValue}%
                  </div>
                  <div className="text-[10px] text-muted-foreground">momentum</div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <ActionToast message={toast.message} visible={toast.visible} onHide={hide} />
    </div>
  )
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
