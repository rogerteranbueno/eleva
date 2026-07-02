"use client"

import { useState } from "react"
import {
  ArrowRight,
  TrendingUp,
  Users,
  Ticket,
  CheckCircle2,
  Clock,
  XCircle,
  ChevronRight,
  Phone,
  MessageCircle,
  Bell,
  Filter,
  Star,
  ArrowDown,
  Sparkles,
} from "lucide-react"
import { AvatarBadge } from "@/components/demo/AvatarBadge"
import { ActionToast, useActionToast } from "@/components/demo/ActionToast"
import {
  PIPELINE_VIA_TO_POSIBILIDAD,
  PIPELINE_POSIBILIDAD_TO_IMPOSIBILIDAD,
  PIPELINE_IMPOSIBILIDAD_TO_VIA,
  BECAS_TRACKING,
  type EnrollmentCommitment,
  type EnrollmentStatus,
} from "@/data/level"
import { cn } from "@/lib/utils"

// ─── Status config ────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<EnrollmentStatus, {
  label: string
  icon: React.ElementType
  pill: string
  border: string
  bg: string
}> = {
  comprometido: {
    label: "Comprometido",
    icon: Clock,
    pill: "bg-yellow-500/15 text-yellow-400 border border-yellow-500/25",
    border: "border-yellow-500/20",
    bg: "bg-yellow-500/5",
  },
  confirmado: {
    label: "Confirmado",
    icon: CheckCircle2,
    pill: "bg-cyan-500/15 text-cyan-400 border border-cyan-500/25",
    border: "border-cyan-500/20",
    bg: "bg-cyan-500/5",
  },
  pagado: {
    label: "Inscrito ✓",
    icon: CheckCircle2,
    pill: "bg-green-500/15 text-green-400 border border-green-500/25",
    border: "border-green-500/20",
    bg: "bg-green-500/5",
  },
  perdido: {
    label: "No continuó",
    icon: XCircle,
    pill: "bg-foreground/[0.06] text-muted-foreground border border-border",
    border: "border-border",
    bg: "bg-foreground/[0.02]",
  },
}

// ─── Pipeline summary stats ────────────────────────────────────────────────

function PipelineStats({
  commitments,
  becasAvailable,
}: {
  commitments: EnrollmentCommitment[]
  becasAvailable: number
}) {
  const comprometidos = commitments.filter((c) => c.status === "comprometido").length
  const confirmados   = commitments.filter((c) => c.status === "confirmado").length
  const pagados       = commitments.filter((c) => c.status === "pagado").length
  const perdidos      = commitments.filter((c) => c.status === "perdido").length
  const total         = commitments.length

  const conversionPct = total > 0
    ? Math.round(((confirmados + pagados) / total) * 100)
    : 0

  return (
    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
      {[
        { label: "Comprometidos",  value: comprometidos, color: "text-yellow-400" },
        { label: "Confirmados",    value: confirmados,   color: "text-cyan-400" },
        { label: "Inscritos",      value: pagados,       color: "text-green-400" },
        { label: "No continuaron", value: perdidos,      color: "text-muted-foreground" },
        { label: "Conversión",     value: `${conversionPct}%`, color: conversionPct >= 50 ? "text-green-400" : "text-yellow-400" },
      ].map((stat) => (
        <div key={stat.label} className="glass rounded-xl p-3 text-center">
          <p className={cn("text-xl font-black", stat.color)}>{stat.value}</p>
          <p className="text-[10px] text-muted-foreground mt-0.5">{stat.label}</p>
        </div>
      ))}
    </div>
  )
}

// ─── Commitment card ──────────────────────────────────────────────────────────

function CommitmentCard({
  commitment,
  onContact,
}: {
  commitment: EnrollmentCommitment
  onContact: (name: string, channel: string) => void
}) {
  const cfg = STATUS_CONFIG[commitment.status]
  const StatusIcon = cfg.icon

  if (commitment.status === "perdido") {
    return (
      <div className={cn(
        "rounded-xl border p-3 opacity-50",
        cfg.border, cfg.bg
      )}>
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <AvatarBadge initials={commitment.fromAvatar} size="xs" color="auto" />
            <div className="min-w-0">
              <p className="text-xs font-medium text-foreground truncate">{commitment.fromName}</p>
              <p className="text-[10px] text-muted-foreground truncate">→ {commitment.inviteeName}</p>
            </div>
          </div>
          <span className={cn("text-[9px] px-1.5 py-0.5 rounded-full font-semibold whitespace-nowrap flex-shrink-0", cfg.pill)}>
            No continuó
          </span>
        </div>
        {commitment.notes && (
          <p className="text-[10px] text-muted-foreground mt-2 leading-relaxed">{commitment.notes}</p>
        )}
      </div>
    )
  }

  return (
    <div className={cn(
      "rounded-xl border p-3 space-y-2.5 transition-all hover:border-white/15",
      cfg.border, cfg.bg
    )}>
      {/* Header: who invited whom */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <AvatarBadge initials={commitment.fromAvatar} size="xs" color="auto" />
          <div className="min-w-0">
            <div className="flex items-center gap-1">
              <p className="text-xs font-semibold text-foreground truncate">{commitment.fromName}</p>
              {commitment.becaUsed && (
                <span className="flex-shrink-0 flex items-center gap-0.5 text-[9px] font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-1 rounded-full">
                  <Ticket className="w-2 h-2" />
                  Beca
                </span>
              )}
            </div>
            <p className="text-[10px] text-muted-foreground">{commitment.fromCohorte}</p>
          </div>
        </div>
        <span className={cn("text-[9px] px-1.5 py-0.5 rounded-full font-semibold whitespace-nowrap flex-shrink-0", cfg.pill)}>
          {cfg.label}
        </span>
      </div>

      {/* Arrow → invitee */}
      <div className="flex items-center gap-2 pl-1">
        <ArrowRight className="w-3 h-3 text-muted-foreground flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-foreground">{commitment.inviteeName}</p>
          <p className="text-[10px] text-muted-foreground">{commitment.inviteeRelation} · {commitment.inviteePhone}</p>
        </div>
      </div>

      {/* Dates + notes */}
      {commitment.notes && (
        <p className="text-[10px] text-muted-foreground leading-relaxed pl-1 border-l-2 border-white/10">
          {commitment.notes}
        </p>
      )}

      {/* Footer: date + actions */}
      <div className="flex items-center justify-between gap-2 pt-0.5">
        <p className="text-[10px] text-muted-foreground">
          Comprometido: {commitment.committedDate}
          {commitment.lastContactDate && ` · Último contacto: ${commitment.lastContactDate}`}
        </p>
        {commitment.status !== "pagado" && (
          <div className="flex items-center gap-1">
            <button
              onClick={() => onContact(commitment.inviteeName, "WhatsApp")}
              className="p-1 rounded-lg hover:bg-green-500/15 text-muted-foreground hover:text-green-400 transition-colors"
              title="WhatsApp"
            >
              <MessageCircle className="w-3 h-3" />
            </button>
            <button
              onClick={() => onContact(commitment.inviteeName, "llamada")}
              className="p-1 rounded-lg hover:bg-blue-500/15 text-muted-foreground hover:text-blue-400 transition-colors"
              title="Llamar"
            >
              <Phone className="w-3 h-3" />
            </button>
            <button
              onClick={() => onContact(commitment.inviteeName, "notificación")}
              className="p-1 rounded-lg hover:bg-violet-500/15 text-muted-foreground hover:text-violet-400 transition-colors"
              title="Notificación"
            >
              <Bell className="w-3 h-3" />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Pipeline column ──────────────────────────────────────────────────────────

function PipelineColumn({
  title,
  subtitle,
  fromLevel,
  toLevel,
  fromColor,
  toColor,
  commitments,
  onContact,
  filterStatus,
}: {
  title: string
  subtitle: string
  fromLevel: string
  toLevel: string
  fromColor: string
  toColor: string
  commitments: EnrollmentCommitment[]
  onContact: (name: string, channel: string) => void
  filterStatus: EnrollmentStatus | "todos"
}) {
  const filtered = filterStatus === "todos"
    ? commitments
    : commitments.filter((c) => c.status === filterStatus)

  const active   = commitments.filter((c) => c.status !== "perdido").length
  const perdidos = commitments.filter((c) => c.status === "perdido").length

  return (
    <div className="flex flex-col gap-3 min-w-0">
      {/* Column header */}
      <div className="glass rounded-xl p-3 space-y-2">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-sm font-bold text-foreground leading-tight">{title}</h3>
          <div className="flex items-center gap-1">
            <span className="text-[10px] font-bold text-green-400">{active} activos</span>
            {perdidos > 0 && <span className="text-[10px] text-muted-foreground">· {perdidos} perdidos</span>}
          </div>
        </div>
        <p className="text-[11px] text-muted-foreground leading-snug">{subtitle}</p>
        {/* Level flow pill */}
        <div className="flex items-center gap-1.5">
          <span className={cn("text-[9px] font-bold px-2 py-0.5 rounded-full", fromColor)}>{fromLevel}</span>
          <ArrowRight className="w-2.5 h-2.5 text-muted-foreground flex-shrink-0" />
          <span className={cn("text-[9px] font-bold px-2 py-0.5 rounded-full", toColor)}>{toLevel}</span>
        </div>
      </div>

      {/* Cards */}
      <div className="space-y-2">
        {filtered.length === 0 ? (
          <div className="rounded-xl border border-border bg-foreground/[0.02] p-4 text-center">
            <p className="text-xs text-muted-foreground">Sin registros con este filtro</p>
          </div>
        ) : (
          filtered.map((c) => (
            <CommitmentCard key={c.id} commitment={c} onContact={onContact} />
          ))
        )}
      </div>
    </div>
  )
}

// ─── Becas panel ──────────────────────────────────────────────────────────────

function BecasPanel() {
  const totalAvailable = BECAS_TRACKING.reduce((s, b) => s + b.becasAvailable, 0)
  const totalEarned    = BECAS_TRACKING.reduce((s, b) => s + b.becasEarned, 0)
  const totalUsed      = BECAS_TRACKING.reduce((s, b) => s + b.becasUsed, 0)

  return (
    <div className="glass rounded-xl overflow-hidden border border-amber-500/20">
      {/* Header */}
      <div className="bg-amber-500/10 px-4 py-3 flex items-center justify-between border-b border-amber-500/15">
        <div className="flex items-center gap-2">
          <Ticket className="w-4 h-4 text-amber-400" />
          <div>
            <p className="text-xs font-bold text-amber-400">Becas disponibles</p>
            <p className="text-[10px] text-muted-foreground">Ganadas en revisiones de promesas, para enrolar a La Posibilidad</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-2xl font-black text-amber-400">{totalAvailable}</p>
          <p className="text-[10px] text-muted-foreground">{totalUsed}/{totalEarned} usadas</p>
        </div>
      </div>

      {/* Per-participant breakdown */}
      <div className="divide-y divide-white/5">
        {BECAS_TRACKING.filter((b) => b.becasAvailable > 0 || b.becasEarned > 0).map((b) => (
          <div key={b.ownerId} className="flex items-center gap-3 px-4 py-2.5">
            <AvatarBadge initials={b.ownerAvatar} size="xs" color="auto" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-foreground">{b.ownerName}</p>
              <p className="text-[10px] text-muted-foreground">{b.ownerCohorte} · {b.earnedAt}</p>
            </div>
            <div className="flex items-center gap-2">
              {/* Beca dots */}
              <div className="flex gap-0.5">
                {Array.from({ length: b.becasEarned }).map((_, i) => (
                  <div
                    key={i}
                    className={cn(
                      "w-2 h-2 rounded-full",
                      i < b.becasUsed ? "bg-amber-500/30" : "bg-amber-400"
                    )}
                  />
                ))}
              </div>
              <span className={cn(
                "text-[10px] font-bold px-1.5 py-0.5 rounded-full",
                b.becasAvailable > 0
                  ? "text-amber-400 bg-amber-500/15 border border-amber-500/25"
                  : "text-muted-foreground bg-foreground/[0.04] border border-border"
              )}>
                {b.becasAvailable > 0 ? `${b.becasAvailable} libre${b.becasAvailable > 1 ? "s" : ""}` : "Sin becas"}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="px-4 py-3 border-t border-amber-500/15 bg-amber-500/5">
        <p className="text-[10px] text-amber-300/70 leading-relaxed">
          Las becas son personales e intransferibles. Expiran si no se usan antes del siguiente fin de semana del participante.
        </p>
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

const ALL_COMMITMENTS = [
  ...PIPELINE_VIA_TO_POSIBILIDAD,
  ...PIPELINE_POSIBILIDAD_TO_IMPOSIBILIDAD,
  ...PIPELINE_IMPOSIBILIDAD_TO_VIA,
]

const FILTER_OPTIONS: Array<{ value: EnrollmentStatus | "todos"; label: string }> = [
  { value: "todos",        label: "Todos" },
  { value: "comprometido", label: "Comprometidos" },
  { value: "confirmado",   label: "Confirmados" },
  { value: "pagado",       label: "Inscritos" },
  { value: "perdido",      label: "No continuaron" },
]

export default function EnrolamientoPage() {
  const { toast, show, hide } = useActionToast()
  const [filterStatus, setFilterStatus] = useState<EnrollmentStatus | "todos">("todos")
  const [showBecas, setShowBecas] = useState(false)

  const totalActive = ALL_COMMITMENTS.filter((c) => c.status !== "perdido").length
  const totalPaid   = ALL_COMMITMENTS.filter((c) => c.status === "pagado").length
  const totalBecas  = BECAS_TRACKING.reduce((s, b) => s + b.becasAvailable, 0)

  function handleContact(inviteeName: string, channel: string) {
    show(`Contactando a ${inviteeName} por ${channel} ✓`)
  }

  return (
    <div className="p-5 max-w-6xl mx-auto space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-foreground">Pipeline de Enrolamiento</h1>
          <p className="text-muted-foreground text-xs mt-0.5">
            Quién está invitando a quién · En tiempo real para el próximo ciclo
          </p>
        </div>
        <button
          onClick={() => setShowBecas((p) => !p)}
          className={cn(
            "flex items-center gap-1.5 px-3 py-2 rounded-lg border text-xs font-semibold transition-all",
            showBecas
              ? "bg-amber-500/20 border-amber-500/40 text-amber-400"
              : "bg-amber-500/10 border-amber-500/25 text-amber-400 hover:bg-amber-500/15"
          )}
        >
          <Ticket className="w-3.5 h-3.5" />
          {totalBecas} becas
        </button>
      </div>

      {/* Becas panel, collapsible */}
      {showBecas && <BecasPanel />}

      {/* How it works */}
      <div className="glass rounded-xl p-4 space-y-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-violet-400" />
          <p className="text-xs font-bold text-foreground">El ciclo de crecimiento del centro</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {[
            { label: "VIA activos enrolan", color: "bg-violet-500/15 text-violet-400 border-violet-500/30" },
            { label: "→ La Posibilidad (Despertar)", color: "bg-cyan-500/15 text-cyan-400 border-cyan-500/30" },
            { label: "→ La Imposibilidad (Expansión)", color: "bg-yellow-500/15 text-yellow-400 border-yellow-500/30" },
            { label: "→ VIA (PL)", color: "bg-pink-500/15 text-pink-400 border-pink-500/30" },
            { label: "→ Vuelven a enrolar", color: "bg-green-500/15 text-green-400 border-green-500/30" },
          ].map((item, i) => (
            <span key={i} className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full border", item.color)}>
              {item.label}
            </span>
          ))}
        </div>
        <div className="grid grid-cols-3 gap-3 pt-1 border-t border-white/5">
          <div className="text-center">
            <p className="text-lg font-black text-foreground">{totalActive}</p>
            <p className="text-[10px] text-muted-foreground">En pipeline activo</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-black text-green-400">{totalPaid}</p>
            <p className="text-[10px] text-muted-foreground">Inscritos este ciclo</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-black text-amber-400">{totalBecas}</p>
            <p className="text-[10px] text-muted-foreground">Becas sin usar</p>
          </div>
        </div>
      </div>

      {/* Filter bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-0.5">
        <Filter className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
        {FILTER_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => setFilterStatus(opt.value)}
            className={cn(
              "flex-shrink-0 text-xs font-semibold px-3 py-1.5 rounded-full border transition-all",
              filterStatus === opt.value
                ? "bg-violet-500/20 border-violet-500/40 text-violet-400"
                : "bg-foreground/[0.04] border-border text-muted-foreground hover:text-foreground hover:bg-foreground/[0.06]"
            )}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Overall stats */}
      <PipelineStats commitments={ALL_COMMITMENTS} becasAvailable={totalBecas} />

      {/* Three pipeline columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <PipelineColumn
          title="VIA → La Posibilidad"
          subtitle="Participantes de VIA invitando personas a su primer Despertar"
          fromLevel="VIA"
          toLevel="La Posibilidad"
          fromColor="bg-violet-500/20 text-violet-400"
          toColor="bg-cyan-500/20 text-cyan-400"
          commitments={PIPELINE_VIA_TO_POSIBILIDAD}
          onContact={handleContact}
          filterStatus={filterStatus}
        />
        <PipelineColumn
          title="Posibilidad → La Imposibilidad"
          subtitle="Egresados del Despertar invitados a su próxima Expansión"
          fromLevel="La Posibilidad"
          toLevel="La Imposibilidad"
          fromColor="bg-cyan-500/20 text-cyan-400"
          toColor="bg-yellow-500/20 text-yellow-400"
          commitments={PIPELINE_POSIBILIDAD_TO_IMPOSIBILIDAD}
          onContact={handleContact}
          filterStatus={filterStatus}
        />
        <PipelineColumn
          title="Imposibilidad → VIA"
          subtitle="Egresados de Expansión siendo invitados a PL"
          fromLevel="La Imposibilidad"
          toLevel="VIA"
          fromColor="bg-yellow-500/20 text-yellow-400"
          toColor="bg-pink-500/20 text-pink-400"
          commitments={PIPELINE_IMPOSIBILIDAD_TO_VIA}
          onContact={handleContact}
          filterStatus={filterStatus}
        />
      </div>

      {/* Footer note */}
      <div className="glass rounded-xl p-4 flex items-start gap-3">
        <TrendingUp className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-xs font-bold text-foreground">¿Cómo aumentar la conversión?</p>
          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
            El contacto en las primeras 48 horas después del compromiso tiene 3x más probabilidad de convertirse en inscripción.
            Los "comprometidos" sin contacto en los últimos 3 días requieren intervención del coach de su cohorte, no del staff.
            Las becas disponibles son el argumento más poderoso: reduce la fricción económica del primer paso.
          </p>
        </div>
      </div>

      <ActionToast message={toast.message} visible={toast.visible} onHide={hide} />
    </div>
  )
}
