"use client"

import { useState } from "react"
import {
  Brain, Users, Calendar, TrendingUp, AlertTriangle, Heart,
  CheckCircle, ChevronDown, Sparkles, MessageCircle, Zap,
  BookOpen, Target, Clock,
} from "lucide-react"
import { AvatarBadge } from "@/components/demo/AvatarBadge"
import { MomentumGauge } from "@/components/demo/MomentumGauge"
import { ActionToast, useActionToast } from "@/components/demo/ActionToast"
import { cn } from "@/lib/utils"

// ─── Data ─────────────────────────────────────────────────────────────────────

const COACH = { name: "Ana Reyes", avatar: "AR", cohorte: "Generación Omega" }

const NEXT_SESSION = {
  date: "Jueves 5 de junio",
  time: "7:00 PM",
  type: "Sesión en vivo mensual",
  attendanceConfirmed: 30,
  attendanceTotal: 89,
  topic: "Cierre de mes 3 · Revisión de objetivos · Preparación mes 4",
}

const GENERATION_STATS = {
  total: 89,
  atRisk: 8,
  highMomentum: 34,
  avgMomentum: 74,
  missionsCompletedPct: 71,
  lastSessionAttendance: 67,
}

interface Participant {
  id: string
  name: string
  avatar: string
  momentum: number
  lastAccessDays: number
  objective: string
  risk: "high" | "medium" | "low"
  notes?: string
  knownCondition?: string
}

const PARTICIPANTS: Participant[] = [
  { id: "p1",  name: "Valeria Romo",    avatar: "VR", momentum: 23,  lastAccessDays: 11, objective: "Independencia financiera", risk: "high",   knownCondition: "Estrés financiero · separación reciente", notes: "Sin actividad 11 días. Requiere contacto directo." },
  { id: "p2",  name: "Carmen Valdés",   avatar: "CV", momentum: 88,  lastAccessDays: 0,  objective: "Escalar su negocio",       risk: "low",    knownCondition: "Emprendedora · viaja frecuentemente" },
  { id: "p3",  name: "Héctor Ramírez",  avatar: "HR", momentum: 62,  lastAccessDays: 1,  objective: "Mejorar relaciones familia", risk: "low" },
  { id: "p4",  name: "Diego Salinas",   avatar: "DS", momentum: 81,  lastAccessDays: 0,  objective: "Liderazgo en equipo",      risk: "low",    knownCondition: "Líder natural · ha enrolado 3 personas" },
  { id: "p5",  name: "Sofía Garza",     avatar: "SG", momentum: 41,  lastAccessDays: 6,  objective: "Bienestar y salud",        risk: "medium", notes: "Faltó al evento del mes anterior" },
  { id: "p6",  name: "Omar Castillo",   avatar: "OC", momentum: 37,  lastAccessDays: 8,  objective: "Superar miedos",           risk: "high",   knownCondition: "Introversión alta · prefiere 1:1 a grupos" },
  { id: "p7",  name: "Paola Serrano",   avatar: "PS", momentum: 55,  lastAccessDays: 3,  objective: "Cambio de carrera",        risk: "medium", knownCondition: "En proceso de renuncia laboral" },
  { id: "p8",  name: "Martín López",    avatar: "ML", momentum: 76,  lastAccessDays: 1,  objective: "Familia y trabajo",        risk: "low" },
]

const AI_SESSION_INSIGHTS = [
  { icon: "🎯", title: "Abre con reconocimiento grupal", desc: "34 personas tienen momentum >70%. Nombrarlas (sin lista exhaustiva) crea energía positiva desde el inicio y eleva el estándar del grupo." },
  { icon: "🔥", title: "No menciones los ausentes en los primeros 15 min", desc: "Crear FOMO es más efectivo que señalar ausencias. Haz que los presentes sientan que están en el lugar correcto." },
  { icon: "💡", title: "Pregunta de apertura sugerida", desc: "\"¿Cuál fue el mayor reto de este mes y qué hiciste con él?\" — abre a toda la generación, sin presionar a nadie específico." },
  { icon: "⚠️", title: "Valeria y Omar en riesgo crítico", desc: "Ambos tienen momentum <40%. Planea un break-out o check-in individual al finalizar. No los señales en plenario." },
  { icon: "📈", title: "Diego puede co-facilitar el cierre", desc: "Su momentum alto y liderazgo natural lo hacen ideal para cerrar la sesión con su testimonio del mes. Pregúntale antes." },
]

const PRE_SESSION_CHECKLIST = [
  "Revisar lista de confirmados (30/89)",
  "Mensaje personal a Valeria y Omar antes de la sesión",
  "Preparar pregunta de apertura",
  "Coordinar break-out con Diego al final",
  "Compartir agenda con el grupo 1h antes",
]

function getMomentumColor(m: number) {
  if (m >= 70) return "text-green-400"
  if (m >= 50) return "text-yellow-400"
  if (m >= 35) return "text-orange-400"
  return "text-red-400"
}

function getMomentumBg(m: number) {
  if (m >= 70) return "bg-green-500"
  if (m >= 50) return "bg-yellow-500"
  if (m >= 35) return "bg-orange-500"
  return "bg-red-500"
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function CoachPage() {
  const { toast, show, hide } = useActionToast()
  const [checkedItems, setCheckedItems] = useState<Set<number>>(new Set())
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [filter, setFilter] = useState<"todos" | "riesgo" | "activos">("todos")

  function toggleCheck(i: number) {
    setCheckedItems((prev) => {
      const next = new Set(prev)
      if (next.has(i)) next.delete(i)
      else next.add(i)
      return next
    })
  }

  const filtered = PARTICIPANTS.filter((p) => {
    if (filter === "riesgo") return p.risk !== "low"
    if (filter === "activos") return p.lastAccessDays <= 2
    return true
  })

  const atRiskCount = PARTICIPANTS.filter((p) => p.risk !== "low").length

  return (
    <div className="p-5 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <AvatarBadge initials={COACH.avatar} size="sm" color="violet" />
            <div>
              <h1 className="text-xl font-bold text-white">{COACH.name}</h1>
              <p className="text-xs text-violet-400">{COACH.cohorte} · Coach asignada</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          <span className="text-xs font-medium text-green-400">Activa</span>
        </div>
      </div>

      {/* Next session card */}
      <div className="glass-violet rounded-2xl p-5 space-y-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-violet-500/20 flex items-center justify-center flex-shrink-0">
            <Calendar className="w-5 h-5 text-violet-400" />
          </div>
          <div className="flex-1">
            <p className="text-[10px] uppercase tracking-widest text-violet-400 font-semibold">Próxima sesión</p>
            <p className="font-bold text-white text-sm mt-0.5">{NEXT_SESSION.type}</p>
            <p className="text-xs text-muted-foreground">{NEXT_SESSION.date} · {NEXT_SESSION.time}</p>
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{NEXT_SESSION.topic}</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="text-center bg-white/5 rounded-xl py-2.5">
            <p className="text-xl font-black text-white">{NEXT_SESSION.attendanceConfirmed}</p>
            <p className="text-[10px] text-muted-foreground">Confirmados</p>
          </div>
          <div className="text-center bg-white/5 rounded-xl py-2.5">
            <p className="text-xl font-black text-muted-foreground">{NEXT_SESSION.attendanceTotal - NEXT_SESSION.attendanceConfirmed}</p>
            <p className="text-[10px] text-muted-foreground">Sin confirmar</p>
          </div>
          <div className="text-center bg-white/5 rounded-xl py-2.5">
            <p className="text-xl font-black text-violet-300">{Math.round((NEXT_SESSION.attendanceConfirmed / NEXT_SESSION.attendanceTotal) * 100)}%</p>
            <p className="text-[10px] text-muted-foreground">Confirmación</p>
          </div>
        </div>

        {/* Pre-session checklist */}
        <div>
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold mb-2">Checklist pre-sesión</p>
          <div className="space-y-1.5">
            {PRE_SESSION_CHECKLIST.map((item, i) => (
              <button
                key={i}
                onClick={() => toggleCheck(i)}
                className="w-full flex items-center gap-2.5 text-left group"
              >
                <div className={cn(
                  "w-4 h-4 rounded flex items-center justify-center flex-shrink-0 border transition-colors",
                  checkedItems.has(i)
                    ? "bg-green-500/30 border-green-500/60"
                    : "border-white/20 group-hover:border-white/40"
                )}>
                  {checkedItems.has(i) && <CheckCircle className="w-3 h-3 text-green-400" />}
                </div>
                <span className={cn("text-xs transition-colors", checkedItems.has(i) ? "text-muted-foreground line-through" : "text-foreground")}>
                  {item}
                </span>
              </button>
            ))}
          </div>
          {checkedItems.size === PRE_SESSION_CHECKLIST.length && (
            <div className="mt-3 flex items-center gap-2 text-green-400 text-xs font-semibold">
              <CheckCircle className="w-3.5 h-3.5" />
              Lista completa · ¡listo para la sesión!
            </div>
          )}
        </div>
      </div>

      {/* Generation overview */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Users className="w-3.5 h-3.5 text-cyan-400" />
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">Estado de la generación</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[
            { label: "Total participantes",     value: GENERATION_STATS.total,                    color: "text-white",        icon: Users },
            { label: "Momentum alto (>70%)",    value: GENERATION_STATS.highMomentum,             color: "text-green-400",    icon: TrendingUp },
            { label: "Requieren atención",      value: GENERATION_STATS.atRisk,                   color: "text-red-400",      icon: AlertTriangle },
            { label: "Momentum promedio",       value: `${GENERATION_STATS.avgMomentum}%`,        color: "text-violet-400",   icon: Heart },
            { label: "Misiones completadas",    value: `${GENERATION_STATS.missionsCompletedPct}%`, color: "text-cyan-400",   icon: Target },
            { label: "Asistencia última sesión",value: GENERATION_STATS.lastSessionAttendance,    color: "text-yellow-400",   icon: Calendar },
          ].map(({ label, value, color, icon: Icon }) => (
            <div key={label} className="glass rounded-xl p-3 space-y-1">
              <div className="flex items-center gap-1.5">
                <Icon className={cn("w-3.5 h-3.5", color)} />
                <p className="text-[10px] text-muted-foreground">{label}</p>
              </div>
              <p className={cn("text-2xl font-black", color)}>{value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* AI session insights */}
      <div className="glass rounded-2xl p-5 space-y-4">
        <div className="flex items-center gap-2">
          <Brain className="w-4 h-4 text-violet-400" />
          <p className="text-sm font-bold text-white">IA · Guía para la sesión del jueves</p>
          <span className="ml-auto text-[9px] px-2 py-0.5 rounded-full bg-violet-500/15 text-violet-400 border border-violet-500/20 font-bold">IA</span>
        </div>
        <div className="space-y-2.5">
          {AI_SESSION_INSIGHTS.map((insight, i) => (
            <div key={i} className="flex items-start gap-3 bg-white/3 border border-white/6 rounded-xl p-3">
              <span className="text-lg flex-shrink-0 leading-none mt-0.5">{insight.icon}</span>
              <div>
                <p className="text-xs font-bold text-white leading-snug">{insight.title}</p>
                <p className="text-[11px] text-muted-foreground mt-1 leading-relaxed">{insight.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Participant list */}
      <div className="space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Users className="w-3.5 h-3.5 text-muted-foreground" />
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">Participantes</p>
          </div>
          <div className="flex gap-1.5">
            {(["todos", "riesgo", "activos"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  "px-2.5 py-1 rounded-full text-[10px] font-semibold border transition-colors",
                  filter === f
                    ? "bg-violet-600/30 border-violet-500/50 text-violet-300"
                    : "bg-white/4 border-white/8 text-muted-foreground hover:border-white/20"
                )}
              >
                {f === "todos" ? "Todos" : f === "riesgo" ? `En riesgo (${atRiskCount})` : "Activos hoy"}
              </button>
            ))}
          </div>
        </div>

        <div className="glass rounded-xl overflow-hidden divide-y divide-white/4">
          {filtered.map((p) => (
            <div key={p.id}>
              <button
                onClick={() => setExpandedId(expandedId === p.id ? null : p.id)}
                className="w-full grid grid-cols-[1fr_110px_80px_32px] sm:grid-cols-[1fr_150px_100px_80px_32px] gap-3 px-4 py-3 hover:bg-white/2 transition-colors text-left"
              >
                {/* Name */}
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="relative flex-shrink-0">
                    <AvatarBadge initials={p.avatar} size="sm" />
                    <div className={cn(
                      "absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full border border-[#12121e]",
                      p.risk === "high" ? "bg-red-500" : p.risk === "medium" ? "bg-yellow-500" : "bg-green-500"
                    )} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-white truncate">{p.name}</p>
                    <p className="text-[10px] text-muted-foreground truncate">{p.objective}</p>
                  </div>
                </div>
                {/* Momentum bar */}
                <div className="hidden sm:flex items-center gap-2">
                  <div className="flex-1 h-1.5 rounded-full bg-white/8 overflow-hidden">
                    <div className={cn("h-full rounded-full", getMomentumBg(p.momentum))} style={{ width: `${p.momentum}%` }} />
                  </div>
                  <span className={cn("text-xs font-bold w-8 text-right", getMomentumColor(p.momentum))}>{p.momentum}%</span>
                </div>
                {/* Last access */}
                <div className="flex items-center">
                  <span className={cn("text-xs", p.lastAccessDays === 0 ? "text-green-400" : p.lastAccessDays <= 3 ? "text-yellow-400" : "text-red-400")}>
                    {p.lastAccessDays === 0 ? "Hoy" : `${p.lastAccessDays}d`}
                  </span>
                </div>
                {/* Action */}
                <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => show(`Mensaje enviado a ${p.name} ✓`)}
                    className="p-1 rounded text-muted-foreground hover:text-cyan-400 transition-colors"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                  </button>
                </div>
                <ChevronDown className={cn("w-3.5 h-3.5 text-muted-foreground transition-transform self-center", expandedId === p.id && "rotate-180")} />
              </button>

              {expandedId === p.id && (
                <div className="px-4 pb-4 bg-white/2 border-t border-white/4 space-y-2.5">
                  {p.knownCondition && (
                    <div className="flex items-start gap-2 mt-3 px-3 py-2 rounded-lg bg-violet-500/8 border border-violet-500/15">
                      <Sparkles className="w-3.5 h-3.5 text-violet-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-[10px] font-semibold text-violet-400">Lo que sabemos</p>
                        <p className="text-[11px] text-muted-foreground mt-0.5">{p.knownCondition}</p>
                      </div>
                    </div>
                  )}
                  {p.notes && (
                    <div className="flex items-start gap-2 px-3 py-2 rounded-lg bg-red-500/5 border border-red-500/15">
                      <AlertTriangle className="w-3.5 h-3.5 text-red-400 flex-shrink-0 mt-0.5" />
                      <p className="text-[11px] text-red-300">{p.notes}</p>
                    </div>
                  )}
                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={() => show(`Mensaje enviado a ${p.name} ✓`)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg glass text-xs text-muted-foreground hover:text-white transition-colors"
                    >
                      <MessageCircle className="w-3 h-3" /> Mensaje
                    </button>
                    <a
                      href="/demo/expediente"
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-violet-600/20 border border-violet-500/30 text-xs text-violet-300 hover:text-violet-200 transition-colors"
                    >
                      <Brain className="w-3 h-3" /> Ver IA
                    </a>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <ActionToast message={toast.message} visible={toast.visible} onHide={hide} />
    </div>
  )
}
