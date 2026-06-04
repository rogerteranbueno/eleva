"use client"

import { useState, useMemo } from "react"
import {
  Search, Users, CreditCard, AlertTriangle, TrendingUp,
  ChevronDown, CheckCircle2, Clock, XCircle, Star,
  ArrowUpRight, MessageCircle, UserPlus, SlidersHorizontal,
  Sparkles,
} from "lucide-react"
import { AvatarBadge } from "@/components/demo/AvatarBadge"
import { ActionToast, useActionToast } from "@/components/demo/ActionToast"
import { OnboardingModal } from "@/components/demo/OnboardingModal"
import { RegistrationDrawer } from "@/components/demo/RegistrationDrawer"
import { CRM_PARTICIPANTS, COHORTES } from "@/data/creania"
import type { CRMParticipant, PaymentStatus, RiskLevel } from "@/lib/types"
import { cn } from "@/lib/utils"

const ONBOARDING = {
  screenId: "crm",
  badge: "Vista del dueño · Módulo CRM",
  badgeColor: "violet" as const,
  title: "Tu centro, del Excel a la visibilidad total",
  description: "Cada participante en un solo lugar — momentum, pagos, actividad y seguimiento. Ya no necesitas preguntar cómo va cada quien: ELEVA te lo dice antes de que sea tarde.",
  tips: [
    { emoji: "📊", text: "Filtra por estado de pago, riesgo o generación para priorizar sin perder tiempo." },
    { emoji: "⚡", text: "Actúa directo desde la lista: manda un mensaje, asigna coach o actualiza notas." },
    { emoji: "🔍", text: "Busca cualquier participante por nombre y accede a su expediente completo." },
  ],
  cta: "Explorar el CRM →",
}

type Filter = "todos" | "riesgo" | "pago_pendiente" | "activos" | "inactivos"

const FILTER_LABELS: Record<Filter, string> = {
  todos: "Todos",
  activos: "Activos",
  riesgo: "En riesgo",
  pago_pendiente: "Pago pendiente",
  inactivos: "Inactivos",
}

type SortKey = "momentum" | "nombre" | "ultima_actividad" | "pago"

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

function PaymentBadge({ status, amount }: { status: PaymentStatus; amount: number }) {
  if (status === "paid")
    return (
      <div className="flex items-center gap-1 text-green-400 text-[11px] font-medium">
        <CheckCircle2 className="w-3 h-3" />
        <span>Al corriente</span>
      </div>
    )
  if (status === "pending")
    return (
      <div className="flex items-center gap-1 text-yellow-400 text-[11px] font-medium">
        <Clock className="w-3 h-3" />
        <span>${amount.toLocaleString()} pendiente</span>
      </div>
    )
  return (
    <div className="flex items-center gap-1 text-red-400 text-[11px] font-medium">
      <XCircle className="w-3 h-3" />
      <span>${amount.toLocaleString()} vencido</span>
    </div>
  )
}

function RiskDot({ level }: { level: RiskLevel }) {
  if (level === "high") return <div className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0" />
  if (level === "medium") return <div className="w-2 h-2 rounded-full bg-yellow-500 flex-shrink-0" />
  return <div className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0" />
}

function LastAccess({ days }: { days: number }) {
  if (days === 0) return <span className="text-green-400 text-[11px]">Hoy</span>
  if (days === 1) return <span className="text-green-400 text-[11px]">Ayer</span>
  if (days <= 3) return <span className="text-yellow-400 text-[11px]">Hace {days} días</span>
  if (days <= 7) return <span className="text-orange-400 text-[11px]">Hace {days} días</span>
  return <span className="text-red-400 text-[11px] font-medium">Hace {days} días</span>
}

export default function CRMPage() {
  const { toast, show, hide } = useActionToast()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [filter, setFilter] = useState<Filter>("todos")
  const [cohorteFilter, setCohorteFilter] = useState<string>("todas")
  const [sortKey, setSortKey] = useState<SortKey>("momentum")
  const [actioned, setActioned] = useState<Set<string>>(new Set())

  const filtered = useMemo(() => {
    let list = [...CRM_PARTICIPANTS]

    if (query.trim()) {
      const q = query.toLowerCase()
      list = list.filter((p) => p.name.toLowerCase().includes(q))
    }

    if (cohorteFilter !== "todas") {
      list = list.filter((p) => p.cohorteId === cohorteFilter)
    }

    switch (filter) {
      case "riesgo":
        list = list.filter((p) => p.riskLevel !== "low")
        break
      case "pago_pendiente":
        list = list.filter((p) => p.paymentStatus !== "paid")
        break
      case "activos":
        list = list.filter((p) => p.lastAccessDays <= 3)
        break
      case "inactivos":
        list = list.filter((p) => p.lastAccessDays > 7)
        break
    }

    list.sort((a, b) => {
      switch (sortKey) {
        case "momentum": return a.momentum - b.momentum
        case "nombre": return a.name.localeCompare(b.name)
        case "ultima_actividad": return b.lastAccessDays - a.lastAccessDays
        case "pago": {
          const order = { overdue: 0, pending: 1, paid: 2 }
          return order[a.paymentStatus] - order[b.paymentStatus]
        }
        default: return 0
      }
    })

    return list
  }, [query, filter, cohorteFilter, sortKey])

  const stats = useMemo(() => ({
    total: CRM_PARTICIPANTS.length,
    active: CRM_PARTICIPANTS.filter((p) => p.lastAccessDays <= 3).length,
    atRisk: CRM_PARTICIPANTS.filter((p) => p.riskLevel !== "low").length,
    paymentOk: CRM_PARTICIPANTS.filter((p) => p.paymentStatus === "paid").length,
    paymentPending: CRM_PARTICIPANTS.filter((p) => p.paymentStatus !== "paid").length,
  }), [])

  function handleAction(id: string, label: string) {
    setActioned((prev) => new Set([...prev, id]))
    show(`${label} ✓`)
  }

  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto space-y-5">
      <OnboardingModal config={ONBOARDING} />

      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white">Directorio de Participantes</h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            {CRM_PARTICIPANTS.length} registros · actualizado en tiempo real
          </p>
        </div>
        <button
          onClick={() => setDrawerOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold transition-colors"
        >
          <UserPlus className="w-4 h-4" />
          Agregar participante
        </button>
      </div>

      {/* Stats strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Total registros", value: stats.total, icon: Users, color: "text-violet-400" },
          { label: "Activos esta semana", value: stats.active, icon: TrendingUp, color: "text-green-400" },
          { label: "Pago al corriente", value: stats.paymentOk, icon: CreditCard, color: "text-cyan-400" },
          { label: "Requieren atención", value: stats.atRisk + stats.paymentPending, icon: AlertTriangle, color: "text-red-400" },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="glass rounded-xl p-3 sm:p-4">
            <div className="flex items-center gap-2 mb-1">
              <Icon className={cn("w-3.5 h-3.5", color)} />
              <p className="text-[11px] text-muted-foreground">{label}</p>
            </div>
            <p className={cn("text-2xl font-black", color)}>{value}</p>
          </div>
        ))}
      </div>

      {/* Excel callout */}
      <div className="flex items-start gap-3 p-4 rounded-xl bg-violet-500/8 border border-violet-500/20">
        <Sparkles className="w-4 h-4 text-violet-400 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-violet-300 leading-relaxed">
          <span className="font-semibold text-white">Sin ELEVA esto sería un Excel.</span>{" "}
          Filas sin actualizar, pagos que nadie persigue, participantes que abandonan sin que nadie lo note.
          Con ELEVA cada registro se actualiza solo — y el sistema te dice quién necesita atención hoy.
        </p>
      </div>

      {/* Search + Filters */}
      <div className="space-y-3">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar participante..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder:text-muted-foreground focus:outline-none focus:border-violet-500/50 transition-colors"
            />
          </div>
          <CohorteSelect value={cohorteFilter} onChange={setCohorteFilter} />
          <SortSelect value={sortKey} onChange={setSortKey} />
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 flex-wrap">
          {(Object.keys(FILTER_LABELS) as Filter[]).map((f) => (
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
              {FILTER_LABELS[f]}
              {f === "riesgo" && <span className="ml-1.5 text-red-400 font-bold">{stats.atRisk}</span>}
              {f === "pago_pendiente" && <span className="ml-1.5 text-yellow-400 font-bold">{stats.paymentPending}</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Participant list */}
      <div className="glass rounded-2xl overflow-hidden">
        {/* Table header — desktop only */}
        <div className="hidden sm:grid grid-cols-[1fr_130px_100px_100px_120px] gap-4 px-5 py-3 border-b border-white/6 text-[11px] uppercase tracking-widest text-muted-foreground font-medium">
          <span>Participante</span>
          <span>Momentum</span>
          <span>Última actividad</span>
          <span>Pago</span>
          <span></span>
        </div>

        {filtered.length === 0 && (
          <div className="py-12 text-center text-muted-foreground text-sm">
            Sin resultados para esta búsqueda
          </div>
        )}

        <div className="divide-y divide-white/4">
          {filtered.map((p) => (
            <ParticipantRow
              key={p.id}
              participant={p}
              actioned={actioned.has(p.id)}
              onAction={(label) => handleAction(p.id, label)}
            />
          ))}
        </div>
      </div>

      {drawerOpen && (
        <RegistrationDrawer
          onClose={() => setDrawerOpen(false)}
          onSuccess={(name) => {
            setDrawerOpen(false)
            show(`${name} agregado al CRM ✓`)
          }}
        />
      )}
      <ActionToast message={toast.message} visible={toast.visible} onHide={hide} />
    </div>
  )
}

function ParticipantRow({
  participant: p,
  actioned,
  onAction,
}: {
  participant: CRMParticipant
  actioned: boolean
  onAction: (label: string) => void
}) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div
      className={cn(
        "transition-colors",
        p.riskLevel === "high" && p.paymentStatus !== "paid" ? "bg-red-500/4" : ""
      )}
    >
      {/* Main row */}
      <div
        className="grid grid-cols-1 sm:grid-cols-[1fr_130px_100px_100px_120px] gap-3 sm:gap-4 px-4 sm:px-5 py-3.5 cursor-pointer hover:bg-white/2 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        {/* Name + cohorte */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="relative flex-shrink-0">
            <AvatarBadge initials={p.avatar} size="sm" />
            <div className="absolute -bottom-0.5 -right-0.5">
              <RiskDot level={p.riskLevel} />
            </div>
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="text-sm font-semibold text-white truncate">{p.name}</p>
              {p.tag === "destacado" && (
                <span className="flex items-center gap-0.5 text-[10px] text-yellow-400 font-bold">
                  <Star className="w-2.5 h-2.5 fill-yellow-400" />
                  Destacado
                </span>
              )}
              {p.tag === "nuevo" && (
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-400 font-semibold">
                  Nuevo
                </span>
              )}
            </div>
            <p className="text-[11px] text-muted-foreground truncate">
              {p.cohorte} · {p.phaseDetail}
            </p>
          </div>
          {/* Mobile: show payment inline */}
          <div className="sm:hidden ml-auto">
            <PaymentBadge status={p.paymentStatus} amount={p.paymentAmount} />
          </div>
        </div>

        {/* Momentum */}
        <div className="hidden sm:flex items-center gap-2">
          <div className="flex-1 h-1.5 rounded-full bg-white/8 overflow-hidden">
            <div
              className={cn("h-full rounded-full transition-all", getMomentumBg(p.momentum))}
              style={{ width: `${p.momentum}%` }}
            />
          </div>
          <span className={cn("text-sm font-bold w-8 text-right", getMomentumColor(p.momentum))}>
            {p.momentum}%
          </span>
        </div>

        {/* Last access */}
        <div className="hidden sm:flex items-center">
          <LastAccess days={p.lastAccessDays} />
        </div>

        {/* Payment */}
        <div className="hidden sm:flex items-center">
          <PaymentBadge status={p.paymentStatus} amount={p.paymentAmount} />
        </div>

        {/* Actions */}
        <div className="hidden sm:flex items-center gap-1.5 justify-end" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => onAction("Mensaje enviado")}
            className={cn(
              "p-1.5 rounded-lg transition-colors",
              actioned
                ? "text-green-400"
                : "text-muted-foreground hover:text-white hover:bg-white/5"
            )}
            title="Enviar mensaje"
          >
            <MessageCircle className="w-3.5 h-3.5" />
          </button>
          <a
            href="/demo/expediente"
            className="p-1.5 rounded-lg text-muted-foreground hover:text-violet-400 hover:bg-violet-500/10 transition-colors"
            title="Ver expediente"
          >
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
          <button onClick={() => setExpanded(!expanded)} className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground transition-colors">
            <ChevronDown className={cn("w-3.5 h-3.5 transition-transform", expanded ? "rotate-180" : "")} />
          </button>
        </div>
      </div>

      {/* Expanded row */}
      {expanded && (
        <div className="px-4 sm:px-5 pb-4 pt-1 bg-white/2 border-t border-white/4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
            <div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Misiones</p>
              <p className="text-sm font-semibold text-white">{p.missionsCompleted}/{p.missionsTotal} completadas</p>
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Enrolado</p>
              <p className="text-sm font-semibold text-white">{p.enrollDate}</p>
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Coach asignado</p>
              <p className="text-sm font-semibold text-white">
                {p.coachId === "c1" ? "Ana Reyes" : p.coachId === "c2" ? "Marco Fuentes" : "Daniela Torres"}
              </p>
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Momentum</p>
              <p className={cn("text-sm font-bold", getMomentumColor(p.momentum))}>{p.momentum}%</p>
            </div>
          </div>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => onAction("Mensaje enviado")}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg glass text-xs font-medium text-muted-foreground hover:text-white transition-colors"
            >
              <MessageCircle className="w-3 h-3" /> Enviar mensaje
            </button>
            <a
              href="/demo/expediente"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-violet-600 hover:bg-violet-700 text-xs font-medium text-white transition-colors"
            >
              <ArrowUpRight className="w-3 h-3" /> Ver expediente completo
            </a>
          </div>
        </div>
      )}
    </div>
  )
}

function CohorteSelect({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none pl-3 pr-7 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-violet-500/50 transition-colors cursor-pointer"
      >
        <option value="todas">Todas las generaciones</option>
        {COHORTES.map((c) => (
          <option key={c.id} value={c.id}>{c.name}</option>
        ))}
      </select>
      <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
    </div>
  )
}

function SortSelect({ value, onChange }: { value: SortKey; onChange: (v: SortKey) => void }) {
  return (
    <div className="relative">
      <SlidersHorizontal className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as SortKey)}
        className="appearance-none pl-8 pr-7 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-violet-500/50 transition-colors cursor-pointer"
      >
        <option value="momentum">Por momentum</option>
        <option value="nombre">Por nombre</option>
        <option value="ultima_actividad">Por actividad</option>
        <option value="pago">Por pago</option>
      </select>
      <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
    </div>
  )
}
