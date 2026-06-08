"use client"

import { useState } from "react"
import {
  AlertTriangle,
  CheckCircle,
  ChevronDown,
  Copy,
  MessageSquare,
  TrendingDown,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react"
import { AvatarBadge } from "@/components/demo/AvatarBadge"
import { ActionToast, useActionToast } from "@/components/demo/ActionToast"
import {
  COACH_METRICS,
  COHORTES,
  AT_RISK_PARTICIPANTS,
  FINANCIALS,
} from "@/data/creania"
import { cn } from "@/lib/utils"

// ─── Message templates ────────────────────────────────────────────────────────

const TEMPLATES = [
  {
    id: "event",
    label: "Recordatorio de evento",
    icon: "📅",
    text: "Hola [nombre] 👋 Te recordamos que el próximo jueves tienes sesión en vivo con tu generación a las 7pm. ¡No te lo pierdas!",
  },
  {
    id: "payment",
    label: "Aviso de pago pendiente",
    icon: "💳",
    text: "Hola [nombre], notamos que tienes un pago pendiente en tu cuenta. ¿Hay algo en lo que podamos ayudarte? Escríbenos para resolverlo.",
  },
  {
    id: "welcome",
    label: "Bienvenida al centro",
    icon: "🎉",
    text: "¡Bienvenido/a a Creania, [nombre]! Estamos muy contentos de tenerte. Tu coach [coach] se pondrá en contacto contigo en las próximas horas.",
  },
  {
    id: "absence",
    label: "Seguimiento de ausencia",
    icon: "🤝",
    text: "Hola [nombre], notamos que no pudiste estar en la sesión de hoy. Estamos aquí para apoyarte — cuéntanos cómo estás.",
  },
]

// ─── Cohorte card ─────────────────────────────────────────────────────────────

function CohortCard({
  cohorteId,
  onContactCoach,
}: {
  cohorteId: string
  onContactCoach: (name: string) => void
}) {
  const [open, setOpen] = useState(false)

  const cohorte = COHORTES.find((c) => c.id === cohorteId)
  const metrics = COACH_METRICS.find((m) => m.cohorteId === cohorteId)
  const atRiskInCohorte = AT_RISK_PARTICIPANTS.filter((p) => {
    if (cohorteId === "omega") return p.cohorte === "Generación Omega"
    if (cohorteId === "norte") return p.cohorte === "Generación Norte"
    return p.cohorte === "Generación Vía 12"
  })

  if (!cohorte || !metrics) return null

  const trendUp = metrics.momentumTrend > 0
  const urgency = metrics.atRiskCount >= 6 ? "red" : metrics.atRiskCount >= 3 ? "yellow" : "green"
  const statusColors: Record<string, string> = {
    active:    "text-violet-400 bg-violet-500/10",
    attention: "text-yellow-400 bg-yellow-500/10",
    thriving:  "text-green-400 bg-green-500/10",
  }

  return (
    <div className="glass rounded-xl overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setOpen((p) => !p)}
        className="w-full flex items-center gap-3 p-4 hover:bg-white/2 transition-colors text-left"
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-sm font-bold text-white">{cohorte.name}</p>
            <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-semibold", statusColors[cohorte.status] ?? "text-muted-foreground bg-white/5")}>
              {cohorte.phase}
            </span>
          </div>
          <div className="flex items-center gap-3 mt-1">
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Users className="w-3 h-3" />{cohorte.participants} participantes
            </span>
            <span className="flex items-center gap-1 text-xs">
              <span className="text-white font-semibold">{metrics.groupMomentum}%</span>
              {trendUp
                ? <TrendingUp className="w-3 h-3 text-green-400" />
                : <TrendingDown className="w-3 h-3 text-red-400" />
              }
            </span>
            {metrics.atRiskCount > 0 && (
              <span className={cn(
                "flex items-center gap-0.5 text-[10px] font-semibold",
                urgency === "red" ? "text-red-400" : urgency === "yellow" ? "text-yellow-400" : "text-green-400"
              )}>
                <AlertTriangle className="w-2.5 h-2.5" />
                {metrics.atRiskCount} en riesgo
              </span>
            )}
          </div>
        </div>
        <ChevronDown className={cn("w-4 h-4 text-muted-foreground flex-shrink-0 transition-transform", open && "rotate-180")} />
      </button>

      {open && (
        <div className="border-t border-white/5 p-4 space-y-4">
          {/* Coach contact */}
          <div className="flex items-center gap-3 p-3 rounded-lg bg-white/3 border border-white/6">
            <AvatarBadge initials={metrics.avatar} size="sm" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white">{metrics.name}</p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[10px] text-muted-foreground">
                  Último contacto grupal:
                </span>
                <span className={cn(
                  "text-[10px] font-semibold",
                  metrics.lastGroupContactDays > 5 ? "text-red-400" :
                  metrics.lastGroupContactDays > 2 ? "text-yellow-400" : "text-green-400"
                )}>
                  {metrics.lastGroupContactDays === 0 ? "hoy" : `hace ${metrics.lastGroupContactDays} días`}
                </span>
              </div>
            </div>
            <button
              onClick={() => onContactCoach(metrics.name)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-cyan-600/15 hover:bg-cyan-600/25 border border-cyan-500/20 text-cyan-400 text-xs font-semibold transition-colors flex-shrink-0"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              Contactar
            </button>
          </div>

          {/* Sesiones */}
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-white/3 border border-white/6 rounded-lg p-3 text-center">
              <p className="text-lg font-black text-white">{metrics.sessionsThisMonth}/{metrics.sessionsPlanned}</p>
              <p className="text-[10px] text-muted-foreground">sesiones del mes</p>
            </div>
            <div className="bg-white/3 border border-white/6 rounded-lg p-3 text-center">
              <p className={cn("text-lg font-black", metrics.missedSessions > 0 ? "text-red-400" : "text-green-400")}>
                {metrics.missedSessions}
              </p>
              <p className="text-[10px] text-muted-foreground">sesiones perdidas</p>
            </div>
          </div>

          {/* At-risk participants */}
          {atRiskInCohorte.length > 0 && (
            <div className="space-y-2">
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">
                En riesgo — comunicar al coach
              </p>
              {atRiskInCohorte.slice(0, 4).map((p) => (
                <div key={p.id} className="flex items-center gap-2.5">
                  <AvatarBadge initials={p.avatar} size="xs" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-white font-medium truncate">{p.name}</p>
                    <p className="text-[10px] text-muted-foreground">
                      Momentum {p.momentum}% · {p.inactiveDays}d sin actividad
                    </p>
                  </div>
                  <span className={cn(
                    "text-[10px] font-bold px-1.5 py-0.5 rounded-full",
                    p.riskLevel === "high" ? "bg-red-500/15 text-red-400" : "bg-yellow-500/15 text-yellow-400"
                  )}>
                    {p.riskLevel === "high" ? "Crítico" : "Moderado"}
                  </span>
                </div>
              ))}
              {atRiskInCohorte.length > 4 && (
                <p className="text-[10px] text-muted-foreground pl-1">
                  +{atRiskInCohorte.length - 4} más — ver en Atención
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ComunidadPage() {
  const { toast, show, hide } = useActionToast()
  const [copiedId, setCopiedId] = useState<string | null>(null)

  function contactCoach(name: string) {
    show(`Abriendo WhatsApp con ${name} ✓`)
  }

  function copyTemplate(id: string, text: string) {
    setCopiedId(id)
    show("Plantilla copiada al portapapeles ✓")
    setTimeout(() => setCopiedId(null), 2000)
  }

  const totalAtRisk   = AT_RISK_PARTICIPANTS.length
  const criticalRisk  = AT_RISK_PARTICIPANTS.filter((p) => p.riskLevel === "high").length
  const totalPending  = FINANCIALS.pendingParticipants.length

  return (
    <div className="p-5 max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-white">Hub de Comunidad</h1>
        <p className="text-muted-foreground text-xs mt-0.5">
          Visibilidad de cohortes · contacto directo con coaches
        </p>
      </div>

      {/* Summary strip */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Participantes activos", value: "247", color: "text-white" },
          { label: "En riesgo crítico",     value: String(criticalRisk), color: "text-red-400" },
          { label: "Pagos pendientes",      value: String(totalPending), color: "text-yellow-400" },
        ].map((s) => (
          <div key={s.label} className="glass rounded-xl p-3 text-center">
            <p className={cn("text-2xl font-black", s.color)}>{s.value}</p>
            <p className="text-[9px] text-muted-foreground leading-tight mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Cohortes */}
      <div className="space-y-3">
        <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">
          Estado por generación
        </p>
        {["omega", "norte", "via12"].map((id) => (
          <CohortCard key={id} cohorteId={id} onContactCoach={contactCoach} />
        ))}
      </div>

      {/* Message templates */}
      <div className="space-y-3">
        <div>
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold mb-1">
            Plantillas de mensajes
          </p>
          <p className="text-[11px] text-muted-foreground">
            Copia la plantilla y envíala por el canal que necesites
          </p>
        </div>
        <div className="space-y-2">
          {TEMPLATES.map((t) => (
            <div key={t.id} className="glass rounded-xl p-3.5 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{t.icon}</span>
                  <p className="text-sm font-semibold text-white">{t.label}</p>
                </div>
                <button
                  onClick={() => copyTemplate(t.id, t.text)}
                  className={cn(
                    "flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors",
                    copiedId === t.id
                      ? "bg-green-600/20 text-green-400 border border-green-500/20"
                      : "bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-white border border-white/8"
                  )}
                >
                  {copiedId === t.id ? <CheckCircle className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  {copiedId === t.id ? "Copiado" : "Copiar"}
                </button>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">{t.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Overdue payments — notify coaches */}
      <div className="space-y-3">
        <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">
          Pagos vencidos — coordinar con coaches
        </p>
        <div className="glass rounded-xl divide-y divide-white/5">
          {FINANCIALS.pendingParticipants.map((p) => (
            <div key={p.name} className="flex items-center gap-3 px-4 py-3">
              <AvatarBadge initials={p.avatar} size="sm" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">{p.name}</p>
                <p className="text-[10px] text-muted-foreground">
                  {p.cohorte}
                  {p.overdueDays > 0 && (
                    <span className="text-red-400"> · vencido hace {p.overdueDays}d</span>
                  )}
                  {p.overdueDays === 0 && (
                    <span className="text-yellow-400"> · pendiente</span>
                  )}
                </p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-sm font-bold text-white">${p.amount.toLocaleString()}</p>
                {p.overdueDays > 0 && (
                  <button
                    onClick={() => show(`Aviso enviado al coach de ${p.name} ✓`)}
                    className="text-[10px] text-cyan-400 hover:text-cyan-300 font-medium"
                  >
                    Avisar coach
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <ActionToast message={toast.message} visible={toast.visible} onHide={hide} />
    </div>
  )
}
