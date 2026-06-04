"use client"

import { useState } from "react"
import {
  ArrowUpRight, CheckCircle, Clock, DollarSign, Target, FileText, Activity,
  MapPin, Zap, Heart, TrendingUp, Lock, Star, ChevronRight,
  BookOpen, Users,
} from "lucide-react"
import { AvatarBadge } from "@/components/demo/AvatarBadge"
import { MomentumGauge } from "@/components/demo/MomentumGauge"
import { ActionToast, useActionToast } from "@/components/demo/ActionToast"
import { OnboardingModal } from "@/components/demo/OnboardingModal"
import { useDemoStore } from "@/lib/demo-store"
import { VALERIA, COACHES, SPECIALISTS, VALERIA_JOURNEY } from "@/data/creania"
import { cn, getMomentumColor } from "@/lib/utils"

const ONBOARDING = {
  screenId: "expediente",
  badge: "Vista del dueño · Pantalla 3 de 3",
  badgeColor: "violet" as const,
  title: "Expediente del participante",
  description: "Todo lo que necesitas saber sobre Valeria en una sola pantalla. Sin Excel, sin buscar en WhatsApp, sin llamar al coach.",
  tips: [
    { emoji: "📑", text: "Navega los tabs: Resumen, Actividad, Objetivos, Pagos y Notas — todo en un lugar." },
    { emoji: "📉", text: "La tab 'Actividad' muestra exactamente cuándo se rompió la racha de Valeria." },
    { emoji: "🚨", text: "En 'Notas' puedes escribir un mensaje y escalar al coach con un solo botón." },
  ],
  cta: "Ver el expediente →",
}

type Tab = "journey" | "resumen" | "actividad" | "objetivos" | "pagos" | "notas"

export default function ExpedientePage() {
  const [tab, setTab] = useState<Tab>("journey")
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
    { id: "journey", label: "Journey", icon: <MapPin className="w-3.5 h-3.5" /> },
    { id: "resumen", label: "Resumen", icon: <Activity className="w-3.5 h-3.5" /> },
    { id: "actividad", label: "Actividad", icon: <Clock className="w-3.5 h-3.5" /> },
    { id: "objetivos", label: "Objetivos", icon: <Target className="w-3.5 h-3.5" /> },
    { id: "pagos", label: "Pagos", icon: <DollarSign className="w-3.5 h-3.5" /> },
    { id: "notas", label: "Notas", icon: <FileText className="w-3.5 h-3.5" /> },
  ]

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <OnboardingModal config={ONBOARDING} />
      {/* Profile header — stacks on mobile, row on md+ */}
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

      {/* Tabs — scrollable on mobile */}
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
      {tab === "journey" && <TabJourney momentum={momentum} />}
      {tab === "resumen" && <TabResumen momentum={momentum} />}
      {tab === "actividad" && <TabActividad />}
      {tab === "objetivos" && <TabObjetivos specialist={specialist} />}
      {tab === "pagos" && <TabPagos />}
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
        { label: "Momentum al entrar a Vía Potencius", value: `${VALERIA_JOURNEY.expansion.momentumAtEntry}%` },
      ],
    },
    {
      id: "retener",
      icon: Heart,
      label: "Retener · Vía Potencius",
      color: "pink",
      status: "active" as const,
      title: "Mes 3 de 5 — activa",
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
      title: "Disponible al completar Vía Potencius",
      items: [
        { label: "Mentoría de pares", value: "—" },
        { label: "Referidos generados", value: "—" },
        { label: "Rol en comunidad", value: "—" },
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
                        item.value === "—" ? "text-muted-foreground" : "text-white"
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
                      <span className="text-muted-foreground">Progreso en Vía Potencius</span>
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
                    Se desbloquea al completar Vía Potencius
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
      <StatBox label="Fase actual" value="Mes 3" sub="Vía Potencius — 2 meses restantes" />
      <StatBox label="Pagos" value="Al corriente" sub="Mes 4 vence en 29 días" />
    </div>
  )
}

function TabActividad() {
  const days = VALERIA.activity.slice(-30).reverse()
  return (
    <div className="glass rounded-xl p-5 space-y-4">
      <h3 className="font-semibold text-white">Últimos 30 días de actividad</h3>
      <p className="text-xs text-muted-foreground">El hueco de los últimos 11 días es visible — sin check-ins, sin misiones.</p>
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
            title={`Día ${d.daysAgo} — ${d.active ? "Activo" : "Inactivo"}`}
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
          Objetivo declarado en semana 1 de Vía Potencius. Sin avance registrado en los últimos 11 días.
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
