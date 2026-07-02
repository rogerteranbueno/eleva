"use client"

import { useState } from "react"
import {
  ArrowUpRight, CheckCircle, Clock, DollarSign, Target, FileText, Activity,
  MapPin, Zap, Heart, TrendingUp, Lock, Star, ChevronRight,
  BookOpen, Users, Brain, MessageSquare, AlertCircle, Sparkles, CalendarPlus,
  Send, Mail, Smartphone, MessageCircle, CheckCheck,
} from "lucide-react"
import { AvatarBadge } from "@/components/demo/AvatarBadge"
import { MomentumGauge } from "@/components/demo/MomentumGauge"
import { ActionToast, useActionToast } from "@/components/demo/ActionToast"
import { OnboardingModal } from "@/components/demo/OnboardingModal"
import { useDemoStore } from "@/lib/demo-store"
import { VALERIA, COACHES, SPECIALISTS, VALERIA_JOURNEY } from "@/data/level"
import { cn, getMomentumColor } from "@/lib/utils"

const ONBOARDING = {
  screenId: "expediente",
  badge: "Vista del dueño · Pantalla 3 de 3",
  badgeColor: "violet" as const,
  title: "Expediente del participante",
  description: "Todo lo que necesitas saber sobre Valeria en una sola pantalla. Sin Excel, sin buscar en WhatsApp, sin llamar al coach.",
  tips: [
    { emoji: "📑", text: "Navega los tabs: Resumen, Actividad, Objetivos, Pagos y Notas, todo en un lugar." },
    { emoji: "📉", text: "La tab 'Actividad' muestra exactamente cuándo se rompió la racha de Valeria." },
    { emoji: "🚨", text: "En 'Notas' puedes escribir un mensaje y escalar al coach con un solo botón." },
  ],
  cta: "Ver el expediente →",
}

type Tab = "ia" | "journey" | "resumen" | "actividad" | "objetivos" | "pagos" | "comunicacion" | "notas"

export default function ExpedientePage() {
  const [tab, setTab] = useState<Tab>("ia")
  const [escalateNote, setEscalateNote] = useState("")
  const { state, dispatch } = useDemoStore()
  const { toast, show, hide } = useActionToast()

  const coach = COACHES.find((c) => c.id === VALERIA.coachId)!
  const specialist = SPECIALISTS.find((s) => s.id === VALERIA.objective.specialistId)!
  const momentum = state.valeriaMomentum

  function handleEscalate() {
    dispatch({ type: "ESCALATE" })
    dispatch({ type: "ADD_COACH_NOTE" })
    show(`Escalado a ${coach.name} con nota ✓`)
  }

  const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "ia",      label: "IA",      icon: <Brain className="w-3.5 h-3.5" /> },
    { id: "journey", label: "Journey", icon: <MapPin className="w-3.5 h-3.5" /> },
    { id: "resumen", label: "Resumen", icon: <Activity className="w-3.5 h-3.5" /> },
    { id: "actividad", label: "Actividad", icon: <Clock className="w-3.5 h-3.5" /> },
    { id: "objetivos", label: "Objetivos", icon: <Target className="w-3.5 h-3.5" /> },
    { id: "pagos", label: "Pagos", icon: <DollarSign className="w-3.5 h-3.5" /> },
    { id: "comunicacion", label: "Comunicación", icon: <MessageCircle className="w-3.5 h-3.5" /> },
    { id: "notas", label: "Notas", icon: <FileText className="w-3.5 h-3.5" /> },
  ]

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <OnboardingModal config={ONBOARDING} />
      {/* Profile header, stacks on mobile, row on md+ */}
      <div className="glass rounded-2xl p-5">
        {/* Top row: avatar + name + gauge */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <AvatarBadge initials={VALERIA.avatar} size="md" />
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl font-bold text-white">{VALERIA.name}</h1>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-500/15 text-red-400 border border-red-500/20 font-semibold whitespace-nowrap">
                  En riesgo
                </span>
              </div>
              <p className="text-muted-foreground text-xs mt-0.5 truncate">
                {VALERIA.cohorte} · {VALERIA.phase}
              </p>
            </div>
          </div>
          <MomentumGauge score={momentum} size="sm" />
        </div>
        {/* Bottom row: meta info */}
        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3 text-xs">
          <div>
            <span className="text-muted-foreground">Acceso: </span>
            <span className="text-red-400 font-medium">{VALERIA.lastAccess}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Fase: </span>
            <span className="text-white font-medium">{VALERIA.phaseDetail}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Coach: </span>
            <span className="text-white font-medium">{coach.name}</span>
            <span className="text-red-400 ml-1">(sin contacto {coach.lastContactDaysAgo}d)</span>
          </div>
        </div>
      </div>

      {/* Tabs, scrollable on mobile */}
      <div className="flex gap-1 p-1 glass rounded-xl overflow-x-auto scrollbar-none">
        {TABS.map(({ id, label, icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={cn(
              "flex items-center gap-1 px-3 py-2 rounded-lg text-xs sm:text-sm sm:gap-1.5 sm:px-4 font-medium transition-all whitespace-nowrap",
              tab === id
                ? "bg-violet-600 text-white"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {icon}
            {label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {tab === "ia" && <TabIA specialist={specialist} coach={coach} momentum={momentum} />}
      {tab === "journey" && <TabJourney momentum={momentum} />}
      {tab === "resumen" && <TabResumen momentum={momentum} />}
      {tab === "actividad" && <TabActividad />}
      {tab === "objetivos" && <TabObjetivos specialist={specialist} />}
      {tab === "pagos" && <TabPagos />}
      {tab === "comunicacion" && <TabComunicacion coach={coach} onSend={(msg) => show(`Mensaje enviado a Valeria ✓`)} />}
      {tab === "notas" && (
        <TabNotas
          escalated={state.escalated}
          noteAdded={state.coachNoteAdded}
          coach={coach}
          note={escalateNote}
          setNote={setEscalateNote}
          onEscalate={handleEscalate}
        />
      )}

      <ActionToast message={toast.message} visible={toast.visible} onHide={hide} />
    </div>
  )
}

// ─── Tab IA ───────────────────────────────────────────────────────────────────

const REFERRER = {
  name: "Diego Salinas",
  avatar: "DS",
  cohorte: "Generación Omega",
  phase: "PL · Mes 3",
  momentum: 81,
  totalReferrals: 3,
}

const AI_QUESTIONS = [
  { q: "¿Qué es lo que más te preocupa de tu objetivo de finanzas en este momento?", why: "Abre el bloqueo emocional real sin juzgar el progreso." },
  { q: "Si pudieras cambiar una cosa de las últimas dos semanas, ¿qué sería?", why: "Activa reflexión sin generar culpa por la inactividad." },
  { q: "¿Qué necesitas de mí específicamente para retomar el ritmo esta semana?", why: "Desplaza el rol del coach de evaluador a aliado." },
  { q: "¿Hay algo que no te hemos preguntado que crees que debería saber tu coach?", why: "Abre espacio para información que no captura el sistema." },
]

const AI_AVOID = [
  "No menciones los 11 días de inactividad como un número, genera defensividad.",
  "Evita comparar su progreso con el de otros en la generación.",
  "No empezar la llamada con '¿cómo vas con tus metas?', es lo que espera y cierra.",
]

const AI_FOCUS = [
  { label: "Patrón detectado", value: "Desconexión post-evento. Su última actividad fue 1 día después de la sesión del mes 2.", icon: "🔍" },
  { label: "Fortaleza clave", value: "Activación inicial muy alta (score: Alta). Cuando está conectada, su ritmo es consistente.", icon: "💪" },
  { label: "Riesgo principal", value: "El objetivo de finanzas puede estar generando presión sin soporte técnico. Recomendar sesión con especialista.", icon: "⚠️" },
  { label: "Ventana de oportunidad", value: "Evento en 4 días. Confirmar asistencia personal sube probabilidad de reactivación 70%.", icon: "🎯" },
]

function TabIA({
  specialist,
  coach,
  momentum,
}: {
  specialist: { name: string; specialty: string; avatar: string; available: boolean }
  coach: { name: string; avatar: string; lastContactDaysAgo: number }
  momentum: number
}) {
  const [sessionSuggested, setSessionSuggested] = useState(false)
  const [expandQuestion, setExpandQuestion] = useState<number | null>(null)

  return (
    <div className="space-y-5">
      {/* AI header */}
      <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-violet-500/8 border border-violet-500/20">
        <div className="w-8 h-8 rounded-lg bg-violet-500/20 flex items-center justify-center flex-shrink-0">
          <Brain className="w-4 h-4 text-violet-400" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold text-violet-300">Inteligencia del participante</p>
          <p className="text-[10px] text-muted-foreground">Basado en journey, actividad, pagos y perfil de ingreso · Actualizado hace 2h</p>
        </div>
        <span className="text-[9px] px-2 py-0.5 rounded-full bg-violet-500/20 border border-violet-500/30 text-violet-400 font-bold uppercase tracking-wider whitespace-nowrap">
          IA activa
        </span>
      </div>

      {/* Referral chain */}
      <div className="glass rounded-xl p-4 space-y-3">
        <div className="flex items-center gap-2">
          <Users className="w-3.5 h-3.5 text-cyan-400" />
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">¿Quién la trajo?</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-sm font-black text-cyan-300 flex-shrink-0">
            {REFERRER.avatar}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-white">{REFERRER.name}</p>
            <p className="text-xs text-muted-foreground">{REFERRER.cohorte} · {REFERRER.phase}</p>
            <p className="text-[10px] text-cyan-400 mt-0.5">Ha referido {REFERRER.totalReferrals} personas en total · Momentum {REFERRER.momentum}%</p>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="text-[10px] text-muted-foreground">Referido</p>
            <p className="text-xs font-bold text-white">Amigo</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-cyan-500/5 border border-cyan-500/15 text-xs text-cyan-300">
          <Sparkles className="w-3 h-3 flex-shrink-0" />
          Diego tiene momentum alto, puede ser un aliado para motivar a Valeria si hay resistencia al contacto directo del coach.
        </div>
      </div>

      {/* What we know */}
      <div className="glass rounded-xl p-4 space-y-3">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-3.5 h-3.5 text-yellow-400" />
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">Lo que sabemos</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {AI_FOCUS.map((f) => (
            <div key={f.label} className="bg-white/3 border border-white/6 rounded-xl p-3 space-y-1">
              <div className="flex items-center gap-1.5">
                <span className="text-base leading-none">{f.icon}</span>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide">{f.label}</p>
              </div>
              <p className="text-xs text-white leading-snug">{f.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Questions to ask */}
      <div className="glass rounded-xl p-4 space-y-3">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-3.5 h-3.5 text-violet-400" />
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">Preguntas para hacerle</p>
          <span className="ml-auto text-[9px] px-1.5 py-0.5 rounded bg-violet-500/15 text-violet-400 border border-violet-500/20 font-bold">IA</span>
        </div>
        <p className="text-[11px] text-muted-foreground leading-relaxed">
          Generadas según su perfil, objetivo declarado y patrón de desconexión. Úsalas en ese orden.
        </p>
        <div className="space-y-2">
          {AI_QUESTIONS.map((item, i) => (
            <button
              key={i}
              onClick={() => setExpandQuestion(expandQuestion === i ? null : i)}
              className="w-full text-left bg-white/3 border border-white/6 rounded-xl p-3 hover:border-violet-500/30 transition-colors"
            >
              <div className="flex items-start gap-2.5">
                <span className="text-[10px] font-black text-violet-400 w-4 flex-shrink-0 mt-0.5">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-white leading-snug">&ldquo;{item.q}&rdquo;</p>
                  {expandQuestion === i && (
                    <p className="text-[11px] text-violet-300 mt-2 leading-relaxed border-t border-violet-500/20 pt-2">
                      💡 {item.why}
                    </p>
                  )}
                </div>
                <ChevronRight className={cn("w-3.5 h-3.5 text-muted-foreground flex-shrink-0 mt-0.5 transition-transform", expandQuestion === i && "rotate-90")} />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* What to avoid */}
      <div className="glass rounded-xl p-4 space-y-3">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-3.5 h-3.5 text-red-400" />
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">Qué evitar en la conversación</p>
        </div>
        <div className="space-y-1.5">
          {AI_AVOID.map((tip, i) => (
            <div key={i} className="flex items-start gap-2 px-3 py-2 rounded-lg bg-red-500/5 border border-red-500/10">
              <span className="text-red-400 text-xs flex-shrink-0 mt-0.5">✕</span>
              <p className="text-[11px] text-muted-foreground leading-snug">{tip}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Advanced coach CTA */}
      <div className="rounded-xl border border-cyan-500/25 bg-cyan-500/5 p-4 space-y-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">Acción recomendada por IA</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-sm font-black text-cyan-300 flex-shrink-0">
            {specialist.avatar}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-white">{specialist.name}</p>
            <p className="text-xs text-cyan-400">{specialist.specialty} · Coach avanzada</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">
              El objetivo de Valeria es financiero. Una sesión de 45 min con Laura puede desbloquear el avance y reactivar su momentum.
            </p>
          </div>
        </div>
        {!sessionSuggested ? (
          <button
            onClick={() => setSessionSuggested(true)}
            className="w-full py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-semibold text-sm transition-colors flex items-center justify-center gap-2"
          >
            <CalendarPlus className="w-4 h-4" />
            Proponer sesión a Valeria con {specialist.name}
          </button>
        ) : (
          <div className="w-full py-2.5 rounded-xl border border-green-500/30 text-green-400 text-sm font-semibold flex items-center justify-center gap-2">
            <CheckCircle className="w-4 h-4" />
            Propuesta enviada a Valeria · Esperando confirmación
          </div>
        )}
      </div>
    </div>
  )
}

function TabJourney({ momentum }: { momentum: number }) {
  const stages = [
    {
      id: "adquirir",
      icon: MapPin,
      label: "Adquirir",
      color: "cyan",
      status: "done" as const,
      title: "Primer contacto",
      items: [
        { label: "Cómo llegó", value: VALERIA_JOURNEY.leadSource },
        { label: "Fecha de contacto", value: VALERIA_JOURNEY.leadDate },
        { label: "Evento de entrada", value: VALERIA_JOURNEY.webinarAttended },
      ],
    },
    {
      id: "activar-despertar",
      icon: Zap,
      label: "Activar · Despertar",
      color: "yellow",
      status: "done" as const,
      title: "Curso inicial (3 días)",
      note: VALERIA_JOURNEY.despertar.coachNote,
      items: [
        { label: "Fecha del Despertar", value: VALERIA_JOURNEY.despertar.date },
        { label: "Score de activación", value: VALERIA_JOURNEY.despertar.activationScore },
        { label: "Días hasta Expansión", value: `${VALERIA_JOURNEY.despertar.daysToExpansion} días` },
      ],
    },
    {
      id: "activar-expansion",
      icon: BookOpen,
      label: "Activar · Expansión",
      color: "orange",
      status: "done" as const,
      title: "Preparación profunda (4 días)",
      note: VALERIA_JOURNEY.expansion.coachNote,
      items: [
        { label: "Fecha de Expansión", value: VALERIA_JOURNEY.expansion.date },
        { label: "Contenido consumido", value: `${VALERIA_JOURNEY.expansion.contentPct}%` },
        { label: "Misiones completadas", value: `${VALERIA_JOURNEY.expansion.missionsCompleted} de 8` },
        { label: "Momentum al entrar a PL", value: `${VALERIA_JOURNEY.expansion.momentumAtEntry}%` },
      ],
    },
    {
      id: "retener",
      icon: Heart,
      label: "Retener · PL",
      color: "pink",
      status: "active" as const,
      title: "Mes 3 de 5, activa",
      items: [
        { label: "Objetivo principal", value: VALERIA.objective.title },
        { label: "Avance del objetivo", value: `${VALERIA.objective.progress}%` },
        { label: "Momentum actual", value: `${momentum}%` },
        { label: "Último acceso", value: VALERIA.lastAccess },
      ],
    },
    {
      id: "escalar",
      icon: TrendingUp,
      label: "Escalar",
      color: "violet",
      status: "locked" as const,
      title: "Disponible al completar PL",
      items: [
        { label: "Mentoría de pares", value: "-" },
        { label: "Referidos generados", value: "-" },
        { label: "Rol en comunidad", value: "-" },
      ],
    },
  ]

  const COLORS: Record<string, { badge: string; dot: string; line: string; icon: string; noteBg: string }> = {
    cyan:   { badge: "bg-cyan-500/15 text-cyan-400 border-cyan-500/20",   dot: "bg-cyan-500",   line: "bg-cyan-500/30",   icon: "text-cyan-400",   noteBg: "bg-cyan-500/8 border-cyan-500/20" },
    yellow: { badge: "bg-yellow-500/15 text-yellow-400 border-yellow-500/20", dot: "bg-yellow-500", line: "bg-yellow-500/30", icon: "text-yellow-400", noteBg: "bg-yellow-500/8 border-yellow-500/20" },
    orange: { badge: "bg-orange-500/15 text-orange-400 border-orange-500/20", dot: "bg-orange-500", line: "bg-orange-500/30", icon: "text-orange-400", noteBg: "bg-orange-500/8 border-orange-500/20" },
    pink:   { badge: "bg-pink-500/15 text-pink-400 border-pink-500/20",   dot: "bg-pink-500",   line: "bg-pink-500/30",   icon: "text-pink-400",   noteBg: "bg-pink-500/8 border-pink-500/20" },
    violet: { badge: "bg-violet-500/15 text-violet-400 border-violet-500/20", dot: "bg-violet-500/40", line: "bg-violet-500/20", icon: "text-violet-400/50", noteBg: "" },
  }

  return (
    <div className="space-y-0">
      {stages.map((stage, i) => {
        const c = COLORS[stage.color]
        const Icon = stage.icon
        const isLast = i === stages.length - 1
        const isLocked = stage.status === "locked"
        const isActive = stage.status === "active"

        return (
          <div key={stage.id} className="flex gap-4">
            {/* Timeline line + dot */}
            <div className="flex flex-col items-center flex-shrink-0">
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center border-2 flex-shrink-0",
                isLocked
                  ? "bg-white/5 border-white/10"
                  : isActive
                  ? "bg-pink-500/20 border-pink-500/40 ring-2 ring-pink-500/20"
                  : "bg-white/8 border-white/15"
              )}>
                {isLocked
                  ? <Lock className="w-3.5 h-3.5 text-muted-foreground" />
                  : <Icon className={cn("w-3.5 h-3.5", c.icon)} />}
              </div>
              {!isLast && (
                <div className={cn("w-0.5 flex-1 min-h-[24px] my-1", c.line)} />
              )}
            </div>

            {/* Content */}
            <div className={cn("flex-1 pb-5", isLast ? "pb-2" : "")}>
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className={cn("text-[10px] px-2 py-0.5 rounded-full border font-bold", c.badge)}>
                  {stage.label}
                </span>
                {isActive && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-pink-500/15 text-pink-400 border border-pink-500/20 font-bold flex items-center gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-pink-400 animate-pulse" />
                    En curso
                  </span>
                )}
              </div>

              <div className={cn(
                "glass rounded-xl p-4 space-y-3",
                isLocked ? "opacity-50" : "",
                isActive ? "border border-pink-500/25 bg-pink-500/5" : ""
              )}>
                <p className="font-semibold text-white text-sm">{stage.title}</p>

                <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                  {stage.items.map((item) => (
                    <div key={item.label}>
                      <p className="text-[10px] text-muted-foreground">{item.label}</p>
                      <p className={cn(
                        "text-xs font-semibold mt-0.5",
                        item.value === "-" ? "text-muted-foreground" : "text-white"
                      )}>{item.value}</p>
                    </div>
                  ))}
                </div>

                {"note" in stage && stage.note && (
                  <div className={cn("rounded-lg px-3 py-2 border", c.noteBg)}>
                    <p className="text-[10px] text-muted-foreground mb-0.5 flex items-center gap-1">
                      <Star className="w-2.5 h-2.5" /> Nota del coach
                    </p>
                    <p className="text-xs text-foreground italic leading-relaxed">&ldquo;{stage.note}&rdquo;</p>
                  </div>
                )}

                {isActive && (
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-muted-foreground">Progreso en PL</span>
                      <span className="text-pink-400 font-semibold">Mes 3/5</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-white/8 overflow-hidden">
                      <div className="h-full rounded-full bg-pink-500" style={{ width: "60%" }} />
                    </div>
                  </div>
                )}

                {isLocked && (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Lock className="w-3 h-3" />
                    Se desbloquea al completar PL
                  </div>
                )}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

function TabResumen({ momentum }: { momentum: number }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
      <StatBox label="Racha actual" value="0 días" sub="Rota hace 11 días" alert />
      <StatBox label="Mejor racha" value="22 días" sub="Alcanzada hace 3 semanas" />
      <StatBox label="Misiones completadas" value="3 / 12" sub="3 pendientes este mes" alert />
      <StatBox label="Momentum" value={`${momentum}%`} sub="Cayó 47 puntos en 2 semanas" alert />
      <StatBox label="Fase actual" value="Mes 3" sub="PL, 2 meses restantes" />
      <StatBox label="Pagos" value="Al corriente" sub="Mes 4 vence en 29 días" />
    </div>
  )
}

function TabActividad() {
  const days = VALERIA.activity.slice(-30).reverse()
  return (
    <div className="glass rounded-xl p-5 space-y-4">
      <h3 className="font-semibold text-white">Últimos 30 días de actividad</h3>
      <p className="text-xs text-muted-foreground">El hueco de los últimos 11 días es visible, sin check-ins, sin misiones.</p>
      <div className="flex flex-wrap gap-1.5">
        {days.map((d, i) => (
          <div
            key={i}
            className={cn(
              "w-7 h-7 rounded-md flex items-center justify-center text-[10px] font-bold transition-colors",
              d.active
                ? "bg-violet-600/60 text-violet-200 border border-violet-500/40"
                : d.daysAgo <= 11
                ? "bg-red-500/20 text-red-400 border border-red-500/20"
                : "bg-white/5 text-muted-foreground border border-white/5"
            )}
            title={`Día ${d.daysAgo}, ${d.active ? "Activo" : "Inactivo"}`}
          >
            {d.daysAgo}
          </div>
        ))}
      </div>
      <div className="flex gap-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-violet-600/60" />
          Activo
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-red-500/20" />
          Inactivo (últimos 11 días)
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-white/5" />
          Sin actividad
        </div>
      </div>
    </div>
  )
}

function TabObjetivos({ specialist }: { specialist: { name: string; specialty: string; avatar: string; available: boolean } }) {
  return (
    <div className="space-y-4">
      <div className="glass rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-white">{VALERIA.objective.title}</h3>
          <span className="text-sm font-bold text-yellow-400">{VALERIA.objective.progress}%</span>
        </div>
        <div className="h-2 rounded-full bg-white/5 overflow-hidden">
          <div
            className="h-full rounded-full bg-yellow-400 transition-all duration-1000"
            style={{ width: `${VALERIA.objective.progress}%` }}
          />
        </div>
        <p className="text-xs text-muted-foreground">
          Objetivo declarado en semana 1 de PL. Sin avance registrado en los últimos 11 días.
        </p>
      </div>
      <div className="glass-violet rounded-xl p-5">
        <p className="text-xs text-muted-foreground mb-3 font-medium">Especialista sugerido para este objetivo</p>
        <div className="flex items-center gap-3">
          <AvatarBadge initials={specialist.avatar} size="md" color="cyan" />
          <div>
            <p className="font-semibold text-white">{specialist.name}</p>
            <p className="text-sm text-cyan-400">{specialist.specialty}</p>
          </div>
          <div className={cn(
            "ml-auto px-3 py-1.5 rounded-lg text-xs font-medium",
            specialist.available
              ? "bg-green-500/15 text-green-400 border border-green-500/20"
              : "bg-muted text-muted-foreground"
          )}>
            {specialist.available ? "Disponible" : "Ocupada"}
          </div>
        </div>
      </div>
    </div>
  )
}

function TabPagos() {
  return (
    <div className="glass rounded-xl overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Concepto</th>
            <th className="text-right px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Monto</th>
            <th className="text-right px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Fecha</th>
            <th className="text-right px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Estado</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {VALERIA.payments.map((p, i) => (
            <tr key={i} className="hover:bg-white/2 transition-colors">
              <td className="px-5 py-3 text-foreground">{p.concept}</td>
              <td className="px-5 py-3 text-right font-medium text-white">${p.amount.toLocaleString()} MXN</td>
              <td className="px-5 py-3 text-right text-muted-foreground">{p.date}</td>
              <td className="px-5 py-3 text-right">
                {p.status === "paid" ? (
                  <span className="text-xs px-2 py-1 rounded-full bg-green-500/15 text-green-400">Pagado</span>
                ) : (
                  <span className="text-xs px-2 py-1 rounded-full bg-yellow-500/15 text-yellow-400">Pendiente</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function TabNotas({
  escalated,
  noteAdded,
  coach,
  note,
  setNote,
  onEscalate,
}: {
  escalated: boolean
  noteAdded: boolean
  coach: { name: string; avatar: string; lastContactDaysAgo: number }
  note: string
  setNote: (v: string) => void
  onEscalate: () => void
}) {
  return (
    <div className="space-y-4">
      {/* Existing note */}
      <div className="glass rounded-xl p-5 space-y-3">
        <div className="flex items-center gap-3">
          <AvatarBadge initials={coach.avatar} size="sm" color="violet" />
          <div>
            <p className="font-semibold text-white text-sm">{coach.name}</p>
            <p className="text-xs text-red-400">{VALERIA.coachNoteDate} (sin seguimiento desde entonces)</p>
          </div>
        </div>
        <p className="text-sm text-foreground italic leading-relaxed">
          &quot;{VALERIA.coachNote}&quot;
        </p>
      </div>

      {/* Escalate */}
      {!escalated ? (
        <div className="glass-violet rounded-xl p-5 space-y-4">
          <h3 className="font-semibold text-white">Escalar a {coach.name}</h3>
          <p className="text-xs text-muted-foreground">
            Envíale una nota + alerta para que contacte a Valeria hoy.
          </p>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder={`Nota para ${coach.name}: Valeria lleva 11 días inactiva, necesita contacto urgente...`}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:border-violet-500/50 transition-colors"
            rows={3}
          />
          <button
            onClick={onEscalate}
            className="flex items-center gap-2 px-5 py-2.5 bg-violet-600 hover:bg-violet-700 text-white rounded-lg text-sm font-semibold transition-colors"
          >
            <ArrowUpRight className="w-4 h-4" />
            Escalar a {coach.name}
          </button>
        </div>
      ) : (
        <div className="glass rounded-xl p-5 flex items-center gap-3 border border-green-500/20">
          <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
          <div>
            <p className="font-semibold text-green-400">Escalado exitosamente</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {coach.name} recibió la alerta y tu nota. Notificación enviada.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

function StatBox({ label, value, sub, alert }: { label: string; value: string; sub: string; alert?: boolean }) {
  return (
    <div className={cn("glass rounded-xl p-4 space-y-1", alert ? "border border-red-500/20" : "")}>
      <p className="text-xs text-muted-foreground font-medium">{label}</p>
      <p className={cn("text-2xl font-bold", alert ? "text-red-400" : "text-white")}>{value}</p>
      <p className="text-xs text-muted-foreground">{sub}</p>
    </div>
  )
}

// ─── Tab Comunicación ──────────────────────────────────────────────────────────

const COMMS_LOG = [
  { id: "c1", canal: "whatsapp" as const, fecha: "04 jun 2026 · 10:15", contenido: "Hola Valeria 👋 Soy Ana, tu coach. ¿Cómo vas esta semana con tu objetivo? Aquí para ti.", estado: "respondido" as const, respuesta: "Hola Ana, gracias. Ha sido difícil pero voy a retomar. 🙏" },
  { id: "c2", canal: "email" as const,    fecha: "01 jun 2026 · 09:00", contenido: "Recap de la semana 12 de PL, tus avances y lo que viene.", estado: "abierto" as const },
  { id: "c3", canal: "app" as const,      fecha: "28 may 2026 · 08:00", contenido: "Nueva misión disponible: Registro de hábitos semana 3. Tienes hasta el viernes.", estado: "enviado" as const },
  { id: "c4", canal: "whatsapp" as const, fecha: "25 may 2026 · 18:30", contenido: "Recordatorio: sesión grupal Gen. Omega mañana domingo 10am. ¡Te esperamos! 🌟", estado: "leido" as const },
  { id: "c5", canal: "email" as const,    fecha: "20 may 2026 · 09:00", contenido: "Recap semana 10, Valeria, esta semana fue increíble para tu generación. Lee aquí.", estado: "abierto" as const },
  { id: "c6", canal: "sms" as const,      fecha: "15 may 2026 · 11:00", contenido: "Hola Valeria, recordatorio pago Mes 4 ($4,200), vence el 1 de junio. Escríbenos.", estado: "enviado" as const },
  { id: "c7", canal: "app" as const,      fecha: "10 may 2026 · 08:00", contenido: "¡Felicidades! Completaste la misión de la semana 8. Tu racha llega a 15 días 🔥", estado: "leido" as const },
]

const CANAL_META: Record<string, { icon: React.ReactNode; label: string; color: string; bg: string }> = {
  whatsapp: { icon: <MessageSquare className="w-3 h-3" />, label: "WhatsApp", color: "text-green-400",  bg: "bg-green-500/10 border-green-500/20" },
  email:    { icon: <Mail className="w-3 h-3" />,          label: "Email",     color: "text-blue-400",   bg: "bg-blue-500/10 border-blue-500/20" },
  app:      { icon: <Smartphone className="w-3 h-3" />,    label: "In-app",    color: "text-violet-400", bg: "bg-violet-500/10 border-violet-500/20" },
  sms:      { icon: <Send className="w-3 h-3" />,          label: "SMS",       color: "text-cyan-400",   bg: "bg-cyan-500/10 border-cyan-500/20" },
}

const ESTADO_META: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  enviado:    { label: "Enviado",    color: "text-muted-foreground", icon: <CheckCheck className="w-3 h-3" /> },
  leido:      { label: "Leído",      color: "text-blue-400",         icon: <CheckCheck className="w-3 h-3" /> },
  abierto:    { label: "Abierto",    color: "text-yellow-400",       icon: <CheckCheck className="w-3 h-3" /> },
  respondido: { label: "Respondido", color: "text-green-400",        icon: <CheckCircle className="w-3 h-3" /> },
}

function TabComunicacion({
  coach,
  onSend,
}: {
  coach: { name: string; avatar: string }
  onSend: (msg: string) => void
}) {
  const [composing, setComposing] = useState(false)
  const [draft, setDraft] = useState("")
  const [canal, setCanal] = useState<"whatsapp" | "email">("whatsapp")
  const [sent, setSent] = useState(false)

  function handleSend() {
    if (!draft.trim()) return
    setSent(true)
    onSend(draft)
    setTimeout(() => { setSent(false); setComposing(false); setDraft("") }, 2000)
  }

  return (
    <div className="space-y-5">
      {/* Summary bar */}
      <div className="grid grid-cols-3 gap-3">
        <div className="glass rounded-xl p-3 text-center">
          <p className="text-lg font-black text-white">7</p>
          <p className="text-[10px] text-muted-foreground mt-0.5">Mensajes enviados</p>
        </div>
        <div className="glass rounded-xl p-3 text-center">
          <p className="text-lg font-black text-green-400">1</p>
          <p className="text-[10px] text-muted-foreground mt-0.5">Respuestas recibidas</p>
        </div>
        <div className="glass rounded-xl p-3 text-center">
          <p className="text-lg font-black text-red-400">hace 2d</p>
          <p className="text-[10px] text-muted-foreground mt-0.5">Último contacto</p>
        </div>
      </div>

      {/* Next followup banner */}
      <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-yellow-500/8 border border-yellow-500/20">
        <Clock className="w-4 h-4 text-yellow-400 flex-shrink-0" />
        <div className="flex-1">
          <p className="text-xs font-semibold text-yellow-300">Próximo seguimiento sugerido</p>
          <p className="text-[11px] text-muted-foreground">Viernes 7 de junio, llamada de 15 min con Ana Reyes</p>
        </div>
        <button
          onClick={() => { setComposing(true); setCanal("whatsapp") }}
          className="text-[10px] px-2.5 py-1 rounded-lg bg-yellow-500/20 border border-yellow-500/30 text-yellow-300 font-bold whitespace-nowrap hover:bg-yellow-500/30 transition-colors"
        >
          Contactar ahora
        </button>
      </div>

      {/* Compose toggle */}
      {!composing ? (
        <button
          onClick={() => setComposing(true)}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-white/10 hover:border-violet-500/40 text-sm text-muted-foreground hover:text-white transition-colors"
        >
          <Send className="w-4 h-4" />
          Enviar mensaje a Valeria
        </button>
      ) : (
        <div className="glass rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-white">Nuevo mensaje</p>
            <button onClick={() => setComposing(false)} className="text-xs text-muted-foreground hover:text-foreground">Cancelar</button>
          </div>
          <div className="flex gap-2">
            {(["whatsapp", "email"] as const).map((c) => {
              const m = CANAL_META[c]
              return (
                <button
                  key={c}
                  onClick={() => setCanal(c)}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-colors",
                    canal === c ? `${m.bg} ${m.color}` : "border-white/10 text-muted-foreground hover:border-white/20"
                  )}
                >
                  {m.icon}{m.label}
                </button>
              )
            })}
          </div>
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder={canal === "whatsapp" ? "Escribe tu WhatsApp aquí..." : "Escribe tu email aquí..."}
            rows={3}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:border-violet-500/50 transition-colors"
          />
          {!sent ? (
            <button
              onClick={handleSend}
              disabled={!draft.trim()}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-700 disabled:opacity-40 text-white text-sm font-semibold transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
              Enviar {canal === "whatsapp" ? "WhatsApp" : "Email"}
            </button>
          ) : (
            <div className="flex items-center gap-2 text-green-400 text-sm font-semibold">
              <CheckCircle className="w-4 h-4" />
              Mensaje enviado a Valeria ✓
            </div>
          )}
        </div>
      )}

      {/* Communication log */}
      <div className="space-y-0">
        <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold mb-3 px-1">Historial de comunicación</p>
        {COMMS_LOG.map((entry, i) => {
          const cMeta = CANAL_META[entry.canal]
          const eMeta = ESTADO_META[entry.estado]
          const isLast = i === COMMS_LOG.length - 1
          return (
            <div key={entry.id} className="flex gap-3">
              <div className="flex flex-col items-center flex-shrink-0">
                <div className={cn("w-7 h-7 rounded-full flex items-center justify-center border flex-shrink-0", cMeta.bg, cMeta.color)}>
                  {cMeta.icon}
                </div>
                {!isLast && <div className="w-px flex-1 bg-white/8 my-1 min-h-[12px]" />}
              </div>
              <div className={cn("flex-1 pb-4", isLast ? "pb-1" : "")}>
                <div className="glass rounded-xl p-3 space-y-1.5">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-1.5">
                      <span className={cn("text-[10px] font-bold px-1.5 py-0.5 rounded border", cMeta.bg, cMeta.color)}>{cMeta.label}</span>
                      <span className="text-[10px] text-muted-foreground">{entry.fecha}</span>
                    </div>
                    <div className={cn("flex items-center gap-1 text-[10px] font-semibold", eMeta.color)}>
                      {eMeta.icon}
                      {eMeta.label}
                    </div>
                  </div>
                  <p className="text-xs text-foreground leading-snug">{entry.contenido}</p>
                  {"respuesta" in entry && entry.respuesta && (
                    <div className="mt-2 pl-3 border-l-2 border-green-500/30">
                      <p className="text-[10px] text-muted-foreground mb-0.5">Respuesta de Valeria</p>
                      <p className="text-xs text-green-300 italic">&ldquo;{entry.respuesta}&rdquo;</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
