"use client"

import { useState } from "react"
import Link from "next/link"
import {
  ChevronLeft, ChevronRight, Users, TrendingDown, CheckCircle2,
  ArrowRight, Lock, MapPin, BookOpen, Heart, TrendingUp, Zap,
  AlertTriangle, Clock, Star, XCircle, PauseCircle,
} from "lucide-react"
import { AvatarBadge } from "@/components/demo/AvatarBadge"
import { cn, getMomentumColor } from "@/lib/utils"
import { COHORT_FUNNELS, LEVEL_PARTICIPANTS } from "@/data/level"

// ─── Types ────────────────────────────────────────────────────────────────────

type DrillState =
  | { mode: "overview" }
  | { mode: "cohort"; cohortId: string }
  | { mode: "level"; cohortId: string; levelId: string }

// ─── Helpers ──────────────────────────────────────────────────────────────────

const LEVEL_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  despertar: Zap,
  expansion: BookOpen,
  via: Heart,
  nivel3: TrendingUp,
}

const LEVEL_COLORS: Record<string, {
  badge: string; bar: string; dot: string; bg: string; text: string; border: string
}> = {
  cyan:   { badge: "bg-cyan-500/15 text-cyan-300 border-cyan-500/25",   bar: "bg-cyan-500",   dot: "bg-cyan-400",   bg: "bg-cyan-500/8",   text: "text-cyan-400",   border: "border-cyan-500/20" },
  yellow: { badge: "bg-yellow-500/15 text-yellow-300 border-yellow-500/25", bar: "bg-yellow-500", dot: "bg-yellow-400", bg: "bg-yellow-500/8", text: "text-yellow-400", border: "border-yellow-500/20" },
  pink:   { badge: "bg-pink-500/15 text-pink-300 border-pink-500/25",   bar: "bg-pink-500",   dot: "bg-pink-400",   bg: "bg-pink-500/8",   text: "text-pink-400",   border: "border-pink-500/20" },
  violet: { badge: "bg-violet-500/15 text-violet-300 border-violet-500/25", bar: "bg-violet-500", dot: "bg-violet-400", bg: "bg-violet-500/8", text: "text-violet-400", border: "border-violet-500/20" },
}

const STATUS_COLOR: Record<string, string> = {
  active:    "text-emerald-400",
  completed: "text-violet-400",
}

function statusBadge(status: "active" | "completed") {
  return status === "active"
    ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/25"
    : "bg-violet-500/15 text-violet-400 border border-violet-500/25"
}

function participantStatusIcon(status: string) {
  if (status === "active")    return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
  if (status === "completed") return <Star className="w-3.5 h-3.5 text-violet-400" />
  if (status === "paused")    return <PauseCircle className="w-3.5 h-3.5 text-yellow-400" />
  return <XCircle className="w-3.5 h-3.5 text-red-400" />
}

// ─── Overview card ─────────────────────────────────────────────────────────────

function CohortCard({ cohort, onClick }: {
  cohort: typeof COHORT_FUNNELS[0]
  onClick: () => void
}) {
  const maxCount = cohort.levels[0].count
  const activeLevels = cohort.levels.filter(l => l.status !== "upcoming")
  const lastActive = activeLevels[activeLevels.length - 1]
  const dropTotal = maxCount - lastActive.count

  return (
    <button
      onClick={onClick}
      className="glass rounded-2xl p-5 text-left w-full hover:border-violet-500/40 transition-all group hover:bg-white/3"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <h3 className="font-bold text-white text-base">{cohort.name}</h3>
            <span className={cn("text-[10px] px-2 py-0.5 rounded-full font-bold", statusBadge(cohort.status))}>
              {cohort.status === "active" ? "Activa" : "Completada"}
            </span>
          </div>
          <p className="text-xs text-muted-foreground">{cohort.currentPhase} · Inicio: {cohort.startDate}</p>
        </div>
        <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-violet-400 transition-colors flex-shrink-0 mt-1" />
      </div>

      {/* Mini funnel */}
      <div className="space-y-1.5 mb-4">
        {cohort.levels.map((level, i) => {
          const c = LEVEL_COLORS[level.color]
          const widthPct = level.status === "upcoming" ? 0 : Math.round((level.count / maxCount) * 100)
          const Icon = LEVEL_ICONS[level.id] ?? Users

          return (
            <div key={level.id} className="flex items-center gap-2">
              <Icon className={cn("w-3 h-3 flex-shrink-0", level.status === "upcoming" ? "text-white/20" : c.text)} />
              <div className="flex-1 h-5 bg-white/5 rounded-md overflow-hidden relative">
                {level.status !== "upcoming" ? (
                  <div
                    className={cn("h-full rounded-md flex items-center px-2 transition-all", c.bar, "opacity-80")}
                    style={{ width: `${Math.max(widthPct, 8)}%` }}
                  />
                ) : (
                  <div className="h-full flex items-center px-2">
                    <Lock className="w-2.5 h-2.5 text-white/20" />
                  </div>
                )}
              </div>
              <span className={cn("text-xs font-bold w-8 text-right flex-shrink-0",
                level.status === "upcoming" ? "text-white/20" : c.text)}>
                {level.status === "upcoming" ? "-" : level.count}
              </span>
            </div>
          )
        })}
      </div>

      {/* Stats row */}
      <div className="flex items-center gap-4 text-[11px]">
        <div>
          <span className="text-muted-foreground">Inicial: </span>
          <span className="text-white font-semibold">{maxCount}</span>
        </div>
        <div>
          <span className="text-muted-foreground">Hoy: </span>
          <span className={cn("font-semibold", STATUS_COLOR[cohort.status])}>{lastActive.count}</span>
        </div>
        {dropTotal > 0 && (
          <div className="flex items-center gap-1 text-red-400">
            <TrendingDown className="w-3 h-3" />
            <span>-{dropTotal} ({Math.round((dropTotal / maxCount) * 100)}%)</span>
          </div>
        )}
      </div>
    </button>
  )
}

// ─── Funnel level step ─────────────────────────────────────────────────────────

function FunnelStep({ level, prevCount, maxCount, isLast, onClick }: {
  level: typeof COHORT_FUNNELS[0]["levels"][0]
  prevCount: number
  maxCount: number
  isLast: boolean
  onClick: () => void
}) {
  const c = LEVEL_COLORS[level.color]
  const Icon = LEVEL_ICONS[level.id] ?? Users
  const isUpcoming = level.status === "upcoming"
  const isActive = level.status === "active"
  const widthPct = isUpcoming ? 0 : Math.round((level.count / maxCount) * 100)
  const dropped = prevCount - level.count

  return (
    <div>
      <button
        onClick={isUpcoming ? undefined : onClick}
        disabled={isUpcoming}
        className={cn(
          "w-full text-left glass rounded-2xl p-4 transition-all",
          !isUpcoming && "hover:border-violet-500/40 hover:bg-white/3 cursor-pointer group",
          isActive && "border border-pink-500/20 bg-pink-500/3",
          isUpcoming && "opacity-40 cursor-default",
        )}
      >
        <div className="flex items-start gap-3">
          {/* Icon */}
          <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 border",
            isUpcoming ? "bg-white/3 border-white/10" : `${c.bg} ${c.border}`)}>
            {isUpcoming
              ? <Lock className="w-4 h-4 text-white/30" />
              : <Icon className={cn("w-4 h-4", c.text)} />}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-0.5">
              <span className={cn("text-[10px] px-2 py-0.5 rounded-full border font-bold", c.badge)}>
                {level.label}
              </span>
              {isActive && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-pink-500/15 text-pink-400 border border-pink-500/20 font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-pink-400 animate-pulse inline-block" />
                  En curso
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground">{level.sublabel}</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">
              Coach: <span className="text-foreground">{level.coach}</span>
              {level.startDate !== "-" && (
                <> · {level.startDate}{level.endDate ? ` → ${level.endDate}` : ""}</>
              )}
            </p>
          </div>

          {/* Count */}
          <div className="text-right flex-shrink-0">
            {!isUpcoming && (
              <>
                <p className={cn("text-2xl font-black", c.text)}>{level.count}</p>
                <p className="text-[10px] text-muted-foreground">personas</p>
              </>
            )}
            {!isUpcoming && !isLast && <ChevronRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-violet-400 mt-1 ml-auto transition-colors" />}
          </div>
        </div>

        {/* Progress bar */}
        {!isUpcoming && (
          <div className="mt-3">
            <div className="h-2 bg-white/5 rounded-full overflow-hidden">
              <div
                className={cn("h-full rounded-full transition-all", c.bar)}
                style={{ width: `${widthPct}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] mt-1">
              <span className={cn("font-semibold", c.text)}>{widthPct}% del inicio</span>
              {dropped > 0 && (
                <span className="text-red-400 flex items-center gap-0.5">
                  <TrendingDown className="w-2.5 h-2.5" />
                  -{dropped} vs nivel anterior
                </span>
              )}
            </div>
          </div>
        )}

        {/* Notes */}
        {level.notes && !isUpcoming && (
          <p className={cn("text-[10px] mt-2.5 rounded-lg px-3 py-2 border", c.bg, c.border, c.text, "opacity-90")}>
            {level.notes}
          </p>
        )}
      </button>

      {/* Connector arrow */}
      {!isLast && (
        <div className="flex items-center justify-center my-1">
          <div className="flex flex-col items-center gap-0.5">
            <div className="w-0.5 h-3 bg-white/15 rounded-full" />
            <ArrowRight className="w-3 h-3 text-white/20 rotate-90" />
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Participant list in level ─────────────────────────────────────────────────

function ParticipantList({ cohortId, levelId, onBack }: {
  cohortId: string
  levelId: string
  onBack: () => void
}) {
  const cohort = COHORT_FUNNELS.find(c => c.id === cohortId)!
  const level  = cohort.levels.find(l => l.id === levelId)!
  const parts  = LEVEL_PARTICIPANTS[cohortId]?.[levelId] ?? []
  const [sortBy, setSortBy] = useState<"momentum" | "risk" | "name">("momentum")

  const sorted = [...parts].sort((a, b) => {
    if (sortBy === "momentum") return b.momentum - a.momentum
    if (sortBy === "risk") {
      const r = { high: 0, medium: 1, low: 2 }
      return r[a.riskLevel] - r[b.riskLevel]
    }
    return a.name.localeCompare(b.name)
  })

  const active   = parts.filter(p => p.status === "active").length
  const dropped  = parts.filter(p => p.status === "dropped").length
  const paused   = parts.filter(p => p.status === "paused").length
  const atRisk   = parts.filter(p => p.riskLevel === "high" && p.status === "active").length
  const avgMom   = parts.filter(p=>p.status==="active").length > 0
    ? Math.round(parts.filter(p=>p.status==="active").reduce((s,p)=>s+p.momentum,0) / parts.filter(p=>p.status==="active").length)
    : 0

  const c = LEVEL_COLORS[level.color]
  const Icon = LEVEL_ICONS[level.id] ?? Users

  return (
    <div className="space-y-5">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm">
        <button onClick={onBack} className="flex items-center gap-1 text-muted-foreground hover:text-white transition-colors">
          <ChevronLeft className="w-4 h-4" />
          {cohort.name}
        </button>
        <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
        <span className="text-white font-semibold">{level.label}</span>
      </div>

      {/* Header card */}
      <div className={cn("glass rounded-2xl p-4 border", c.border)}>
        <div className="flex items-center gap-3 mb-3">
          <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center border", c.bg, c.border)}>
            <Icon className={cn("w-4 h-4", c.text)} />
          </div>
          <div>
            <h2 className="font-bold text-white">{level.label}, {cohort.name}</h2>
            <p className="text-xs text-muted-foreground">{level.sublabel}</p>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {[
            { label: "Total",   value: parts.length, color: "text-white" },
            { label: "Activos", value: active,        color: "text-emerald-400" },
            { label: "En riesgo", value: atRisk,      color: "text-red-400" },
            { label: "Promedio mom.", value: `${avgMom}%`, color: getMomentumColor(avgMom) },
          ].map(({ label, value, color }) => (
            <div key={label} className="glass rounded-xl p-2.5 text-center">
              <p className={cn("text-lg font-black", color)}>{value}</p>
              <p className="text-[9px] text-muted-foreground leading-tight">{label}</p>
            </div>
          ))}
        </div>

        {(dropped > 0 || paused > 0) && (
          <div className="flex gap-2 mt-2">
            {dropped > 0 && (
              <span className="text-[10px] px-2 py-1 rounded-lg bg-red-500/10 text-red-400 border border-red-500/15">
                {dropped} abandonaron
              </span>
            )}
            {paused > 0 && (
              <span className="text-[10px] px-2 py-1 rounded-lg bg-yellow-500/10 text-yellow-400 border border-yellow-500/15">
                {paused} pausaron
              </span>
            )}
          </div>
        )}
      </div>

      {/* Sort */}
      <div className="flex gap-2 items-center">
        <span className="text-xs text-muted-foreground">Ordenar:</span>
        {(["momentum", "risk", "name"] as const).map(s => (
          <button
            key={s}
            onClick={() => setSortBy(s)}
            className={cn("text-xs px-3 py-1.5 rounded-lg font-medium transition-colors",
              sortBy === s ? "bg-violet-600 text-white" : "glass text-muted-foreground hover:text-foreground")}
          >
            {s === "momentum" ? "Momentum" : s === "risk" ? "Riesgo" : "Nombre"}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="space-y-2">
        {sorted.map(p => (
          <div
            key={p.id}
            className={cn(
              "glass rounded-xl p-3.5 flex items-center gap-3",
              p.status === "dropped" ? "opacity-50" : "",
              p.riskLevel === "high" && p.status === "active" ? "border border-red-500/20 bg-red-500/3" : "",
            )}
          >
            <AvatarBadge initials={p.avatar} size="sm" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-sm font-semibold text-white truncate">{p.name}</p>
                {p.riskLevel === "high" && p.status === "active" && (
                  <AlertTriangle className="w-3 h-3 text-red-400 flex-shrink-0" />
                )}
              </div>
              <div className="flex items-center gap-3 mt-0.5 text-[10px] text-muted-foreground">
                <span>{p.missionsCompleted}/{p.missionsTotal} misiones</span>
                {p.lastAccessDays > 0 && (
                  <span className={p.lastAccessDays > 7 ? "text-red-400" : ""}>
                    {p.lastAccessDays}d inactivo
                  </span>
                )}
                {p.note && <span className="text-yellow-400/80 italic truncate">{p.note}</span>}
              </div>
            </div>

            {/* Momentum */}
            {p.status === "active" && (
              <div className="text-right flex-shrink-0 mr-2">
                <p className="text-sm font-black" style={{ color: getMomentumColor(p.momentum) }}>
                  {p.momentum}%
                </p>
                <p className="text-[9px] text-muted-foreground">mom.</p>
              </div>
            )}

            {/* Status icon + expediente link */}
            <div className="flex items-center gap-2 flex-shrink-0">
              {participantStatusIcon(p.status)}
              {p.id === "p1" && p.status === "active" && (
                <Link href="/vl2026/expediente">
                  <button className="flex items-center gap-1 text-[10px] px-2 py-1 rounded-lg bg-violet-600/15 text-violet-400 border border-violet-500/20 hover:bg-violet-600/25 transition-colors">
                    <ChevronRight className="w-2.5 h-2.5" />
                    Ver
                  </button>
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Cohort funnel detail ──────────────────────────────────────────────────────

function CohortFunnel({ cohortId, onBack, onDrillLevel }: {
  cohortId: string
  onBack: () => void
  onDrillLevel: (levelId: string) => void
}) {
  const cohort = COHORT_FUNNELS.find(c => c.id === cohortId)!
  const maxCount = cohort.levels[0].count
  const activeLevels = cohort.levels.filter(l => l.status !== "upcoming")
  const lastActive = activeLevels[activeLevels.length - 1]
  const dropTotal = maxCount - lastActive.count
  const retentionTotal = Math.round((lastActive.count / maxCount) * 100)

  return (
    <div className="space-y-5">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm">
        <button onClick={onBack} className="flex items-center gap-1 text-muted-foreground hover:text-white transition-colors">
          <ChevronLeft className="w-4 h-4" />
          Todas las generaciones
        </button>
        <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
        <span className="text-white font-semibold">{cohort.name}</span>
      </div>

      {/* Header */}
      <div className="glass rounded-2xl p-5">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-xl font-bold text-white">{cohort.name}</h2>
              <span className={cn("text-[10px] px-2 py-0.5 rounded-full font-bold", statusBadge(cohort.status))}>
                {cohort.status === "active" ? "Activa" : "Completada"}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">{cohort.currentPhase} · Inicio: {cohort.startDate}</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-black text-white">{retentionTotal}%</p>
            <p className="text-[10px] text-muted-foreground">retención total</p>
          </div>
        </div>
        <div className="flex gap-4 mt-3 text-xs">
          <div><span className="text-muted-foreground">Inicial: </span><span className="text-white font-semibold">{maxCount}</span></div>
          <div><span className="text-muted-foreground">Activos hoy: </span><span className="text-emerald-400 font-semibold">{lastActive.count}</span></div>
          {dropTotal > 0 && <div><span className="text-muted-foreground">Salieron: </span><span className="text-red-400 font-semibold">{dropTotal}</span></div>}
          <div><span className="text-muted-foreground">Momentum prom.: </span><span className="font-semibold" style={{ color: getMomentumColor(cohort.avgMomentum) }}>{cohort.avgMomentum}%</span></div>
        </div>
      </div>

      {/* Funnel steps */}
      <div>
        <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium mb-3 px-1">
          Embudo de transformación, toca cada nivel para ver los participantes
        </p>
        {cohort.levels.map((level, i) => (
          <FunnelStep
            key={level.id}
            level={level}
            prevCount={i === 0 ? maxCount : cohort.levels[i - 1].count}
            maxCount={maxCount}
            isLast={i === cohort.levels.length - 1}
            onClick={() => onDrillLevel(level.id)}
          />
        ))}
      </div>
    </div>
  )
}

// ─── Main page ─────────────────────────────────────────────────────────────────

export default function CohortesPage() {
  const [drill, setDrill] = useState<DrillState>({ mode: "overview" })

  const active    = COHORT_FUNNELS.filter(c => c.status === "active")
  const completed = COHORT_FUNNELS.filter(c => c.status === "completed")

  const totalActive = active.reduce((s, c) => {
    const activeLevels = c.levels.filter(l => l.status !== "upcoming")
    return s + activeLevels[activeLevels.length - 1].count
  }, 0)
  const totalInitial = active.reduce((s, c) => s + c.levels[0].count, 0)

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">

      {/* ── Overview ── */}
      {drill.mode === "overview" && (
        <>
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Generaciones</h1>
              <p className="text-muted-foreground text-sm mt-0.5">
                Embudo de transformación por cohorte · Toca una generación para hacer zoom
              </p>
            </div>
          </div>

          {/* Summary stats */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Participantes activos hoy", value: totalActive, color: "text-emerald-400" },
              { label: "Inscritos histórico (ciclos activos)", value: totalInitial, color: "text-white" },
              { label: "Retención promedio",
                value: `${Math.round((totalActive / totalInitial) * 100)}%`,
                color: "text-violet-400" },
            ].map(({ label, value, color }) => (
              <div key={label} className="glass rounded-xl p-3 text-center">
                <p className={cn("text-2xl font-black", color)}>{value}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5 leading-tight">{label}</p>
              </div>
            ))}
          </div>

          {/* Active cohorts */}
          <div>
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium mb-3 px-1">
              Generaciones activas ({active.length})
            </p>
            <div className="grid gap-3 sm:grid-cols-1 lg:grid-cols-3">
              {active.map(c => (
                <CohortCard
                  key={c.id}
                  cohort={c}
                  onClick={() => setDrill({ mode: "cohort", cohortId: c.id })}
                />
              ))}
            </div>
          </div>

          {/* Completed cohorts */}
          {completed.length > 0 && (
            <div>
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium mb-3 px-1">
                Generaciones completadas ({completed.length})
              </p>
              <div className="grid gap-3 sm:grid-cols-1 lg:grid-cols-2">
                {completed.map(c => (
                  <CohortCard
                    key={c.id}
                    cohort={c}
                    onClick={() => setDrill({ mode: "cohort", cohortId: c.id })}
                  />
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* ── Cohort detail ── */}
      {drill.mode === "cohort" && (
        <CohortFunnel
          cohortId={drill.cohortId}
          onBack={() => setDrill({ mode: "overview" })}
          onDrillLevel={(levelId) => setDrill({ mode: "level", cohortId: drill.cohortId, levelId })}
        />
      )}

      {/* ── Level participant list ── */}
      {drill.mode === "level" && (
        <ParticipantList
          cohortId={drill.cohortId}
          levelId={drill.levelId}
          onBack={() => setDrill({ mode: "cohort", cohortId: drill.cohortId })}
        />
      )}
    </div>
  )
}
