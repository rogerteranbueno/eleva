"use client"

import { useState } from "react"
import { CheckCircle, Upload, Flame, ChevronRight, Lock } from "lucide-react"
import { useDemoStore } from "@/lib/demo-store"
import { ActionToast, useActionToast } from "@/components/demo/ActionToast"
import { CURRENT_MISSION } from "@/data/creania"
import { cn } from "@/lib/utils"

const ALL_MISSIONS = [
  { week: 1, title: "Tu primera declaración de compromiso", completed: true },
  { week: 2, title: "Mapa de valores personales", completed: true },
  { week: 3, title: "Conversación difícil que has evitado", completed: true },
  { week: 4, title: "Plan financiero inicial", completed: false, isCurrent: false, locked: false },
  { week: 5, title: "Revisión de relaciones clave", completed: false, locked: true },
  { week: 6, title: "Objetivo de 90 días documentado", completed: false, locked: true },
]

export default function MisionPage() {
  const { state, dispatch } = useDemoStore()
  const { toast, show, hide } = useActionToast()
  const [evidenceText, setEvidenceText] = useState("")
  const [showEvidenceForm, setShowEvidenceForm] = useState(false)

  function handleComplete() {
    dispatch({ type: "COMPLETE_MISSION" })
    show("¡Misión completada! Momentum +15 ✓")
    setShowEvidenceForm(false)
  }

  const completed = state.missionCompleted

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Mi Misión</h1>
        <p className="text-muted-foreground text-sm mt-0.5">Vía Creania · Semana 12 de 20</p>
      </div>

      {/* Streak */}
      <div className="glass rounded-xl p-4 flex items-center gap-4">
        <div className={cn(
          "w-12 h-12 rounded-xl flex items-center justify-center",
          completed ? "bg-orange-500/20" : "bg-white/5"
        )}>
          <Flame className={cn("w-6 h-6", completed ? "text-orange-400" : "text-muted-foreground")} />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className={cn(
              "text-3xl font-black",
              completed ? "text-orange-400" : "text-muted-foreground"
            )}>
              {completed ? 1 : 0}
            </span>
            <span className="text-muted-foreground text-sm">días de racha</span>
          </div>
          <p className="text-xs text-muted-foreground">
            {completed
              ? "¡Racha reiniciada! Sigue así."
              : "Racha rota · Tu mejor racha: 22 días"}
          </p>
        </div>
        {completed && (
          <div className="flex items-center gap-1.5 text-green-400 text-xs font-semibold">
            <CheckCircle className="w-4 h-4" />
            Activa
          </div>
        )}
      </div>

      {/* Current mission */}
      <div className={cn(
        "rounded-xl p-5 space-y-4 transition-colors",
        completed
          ? "glass border border-green-500/30 bg-green-500/5"
          : "glass-violet"
      )}>
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-violet-400">
            Semana {CURRENT_MISSION.week}
          </span>
          <span className={cn(
            "text-xs px-2.5 py-1 rounded-full font-medium",
            completed
              ? "bg-green-500/20 text-green-400"
              : "bg-yellow-500/20 text-yellow-400"
          )}>
            {completed ? "Completada ✓" : `Vence en ${CURRENT_MISSION.dueInDays} días`}
          </span>
        </div>

        <div>
          <h2 className="text-lg font-bold text-white">{CURRENT_MISSION.title}</h2>
          <p className="text-sm text-foreground/80 mt-2 leading-relaxed">
            {CURRENT_MISSION.description}
          </p>
        </div>

        {!completed && (
          <>
            {!showEvidenceForm ? (
              <button
                onClick={() => setShowEvidenceForm(true)}
                className="w-full py-3 bg-violet-600 hover:bg-violet-700 text-white rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2"
              >
                <CheckCircle className="w-4 h-4" />
                Marcar como completada
              </button>
            ) : (
              <div className="space-y-3">
                <textarea
                  value={evidenceText}
                  onChange={(e) => setEvidenceText(e.target.value)}
                  placeholder="¿Qué hiciste? ¿Qué aprendiste? ¿Qué acción tomaste hacia tu objetivo de finanzas?"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:border-violet-500/50 transition-colors"
                  rows={4}
                />
                <div className="flex gap-2">
                  <button className="flex items-center gap-2 px-4 py-2 rounded-lg glass text-sm text-muted-foreground hover:text-foreground transition-colors">
                    <Upload className="w-4 h-4" />
                    Subir foto
                  </button>
                  <button
                    onClick={handleComplete}
                    className="flex-1 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg text-sm font-semibold transition-colors"
                  >
                    Enviar y completar
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {completed && (
          <div className="flex items-center gap-3 pt-1">
            <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
            <p className="text-sm text-green-400 font-medium">
              Misión completada hoy. Tu momentum subió +15 puntos.
            </p>
          </div>
        )}
      </div>

      {/* Progress */}
      <div className="glass rounded-xl p-5 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-white text-sm">Progreso en Vía Creania</h3>
          <span className="text-sm font-bold text-violet-400">
            {completed ? 4 : 3} / 12 misiones
          </span>
        </div>
        <div className="h-2 rounded-full bg-white/5 overflow-hidden">
          <div
            className="h-full rounded-full bg-violet-600 transition-all duration-1000"
            style={{ width: `${((completed ? 4 : 3) / 12) * 100}%` }}
          />
        </div>
      </div>

      {/* Mission list */}
      <div className="space-y-2">
        <p className="text-xs text-muted-foreground uppercase tracking-widest font-medium">Todas las misiones</p>
        {ALL_MISSIONS.map((m) => {
          const isCurrent = m.week === 4
          const isDone = m.completed || (isCurrent && completed)
          return (
            <div
              key={m.week}
              className={cn(
                "flex items-center gap-3 p-3 rounded-lg",
                isDone ? "glass opacity-70" : isCurrent ? "glass-violet" : "glass opacity-50"
              )}
            >
              <div className={cn(
                "w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0",
                isDone ? "bg-green-500/20 text-green-400"
                : isCurrent ? "bg-violet-600 text-white"
                : m.locked ? "bg-white/5 text-muted-foreground"
                : "bg-white/10 text-foreground"
              )}>
                {isDone ? <CheckCircle className="w-3.5 h-3.5" /> : m.locked ? <Lock className="w-3 h-3" /> : m.week}
              </div>
              <p className={cn("text-sm flex-1", isDone ? "line-through text-muted-foreground" : "text-foreground")}>
                Semana {m.week}: {m.title}
              </p>
              {isCurrent && !isDone && (
                <ChevronRight className="w-4 h-4 text-violet-400" />
              )}
            </div>
          )
        })}
      </div>

      <ActionToast message={toast.message} visible={toast.visible} onHide={hide} />
    </div>
  )
}
