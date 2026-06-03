"use client"

import Link from "next/link"
import { AlertTriangle, Users, Calendar, TrendingUp, Activity, ArrowRight, Zap } from "lucide-react"
import { MomentumGauge } from "@/components/demo/MomentumGauge"
import { OnboardingModal } from "@/components/demo/OnboardingModal"
import { STATS, COHORTES, RECENT_ACTIVITY, CENTER } from "@/data/creania"
import { getMomentumColor } from "@/lib/utils"
import { cn } from "@/lib/utils"

const ONBOARDING = {
  screenId: "pulso",
  badge: "Vista del dueño · Pantalla 1 de 3",
  badgeColor: "violet" as const,
  title: "Pulso del Centro",
  description: "Aquí empieza cada mañana el dueño del centro. En 30 segundos sabes el estado completo de tu operación — sin abrir Excel ni revisar grupos de WhatsApp.",
  tips: [
    { emoji: "🔴", text: "La alerta roja muestra participantes en riesgo automáticamente. Tócala para intervenir." },
    { emoji: "📊", text: "El Momentum Score es el promedio de todos tus participantes activos en tiempo real." },
    { emoji: "⚡", text: "La actividad reciente reemplaza el caos de WhatsApp con señales claras de lo que está pasando." },
  ],
  cta: "Explorar el Pulso →",
}

const ACTIVITY_ICONS: Record<string, string> = {
  success: "🟢",
  specialist: "🔵",
  new: "✨",
  warning: "🟡",
  event: "📅",
}

export default function PulsoPage() {
  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <OnboardingModal config={ONBOARDING} />
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white">Pulso del Centro</h1>
          <p className="text-muted-foreground text-sm mt-0.5 hidden sm:block">{CENTER.fullName} · lunes, 2 de junio</p>
          <p className="text-muted-foreground text-xs mt-0.5 sm:hidden">Creania · lun 2 jun</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 flex-shrink-0 whitespace-nowrap">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-xs font-medium text-green-400">Sistema activo</span>
        </div>
      </div>

      {/* Alert banner */}
      <Link href="/demo/atencion">
        <div className="glass-violet rounded-xl p-4 flex items-center gap-4 hover:bg-violet-600/15 transition-colors cursor-pointer group">
          <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="w-5 h-5 text-red-400" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-white">
              {STATS.atRiskCount} participantes necesitan atención hoy
            </p>
            <p className="text-sm text-muted-foreground">
              Valeria Romo lleva 11 días inactiva · Momentum crítico: 23%
            </p>
          </div>
          <ArrowRight className="w-5 h-5 text-violet-400 group-hover:translate-x-1 transition-transform" />
        </div>
      </Link>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Momentum gauge */}
        <div className="glass rounded-2xl p-6 flex flex-col items-center justify-center gap-4">
          <div className="text-xs uppercase tracking-widest text-muted-foreground font-medium">
            Momentum del Centro
          </div>
          <MomentumGauge score={STATS.averageMomentum} size="lg" />
          <p className="text-xs text-muted-foreground text-center">
            Promedio de {STATS.activeParticipants} participantes activos
          </p>
        </div>

        {/* Stats grid */}
        <div className="lg:col-span-2 grid grid-cols-2 gap-4">
          <StatCard
            icon={<Users className="w-5 h-5 text-cyan-400" />}
            value={STATS.activeParticipants}
            label="Participantes activos"
            sub="+12% vs mes anterior"
            color="cyan"
          />
          <Link href="/demo/atencion">
            <StatCard
              icon={<AlertTriangle className="w-5 h-5 text-red-400" />}
              value={STATS.atRiskCount}
              label="Necesitan atención"
              sub="Toca para intervenir →"
              color="red"
              clickable
            />
          </Link>
          <StatCard
            icon={<Activity className="w-5 h-5 text-violet-400" />}
            value={STATS.activeCohortes}
            label="Cohortes activas"
            sub="Gen. Omega · Norte · Vía 12"
            color="violet"
          />
          <StatCard
            icon={<Calendar className="w-5 h-5 text-yellow-400" />}
            value={`${STATS.nextEventDays} días`}
            label="Próximo evento"
            sub="Sesión en vivo — Gen. Omega"
            color="yellow"
          />
        </div>
      </div>

      {/* Cohortes */}
      <div>
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-widest mb-3">
          Cohortes activas
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {COHORTES.map((c) => (
            <div key={c.id} className="glass rounded-xl p-4 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-semibold text-white text-sm">{c.name}</p>
                  <p className="text-xs text-muted-foreground">{c.phase} · {c.phaseDetail}</p>
                </div>
                <StatusBadge status={c.status} />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold" style={{ color: getMomentumColor(c.momentum) }}>
                    {c.momentum}%
                  </p>
                  <p className="text-[11px] text-muted-foreground">momentum</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-white">{c.participants}</p>
                  <p className="text-[11px] text-muted-foreground">participantes</p>
                </div>
              </div>
              {/* Mini bar */}
              <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-1000"
                  style={{
                    width: `${c.momentum}%`,
                    backgroundColor: getMomentumColor(c.momentum),
                  }}
                />
              </div>
              <p className="text-[11px] text-muted-foreground">Coach: {c.coach}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Recent activity */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Zap className="w-4 h-4 text-yellow-400" />
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-widest">
            Actividad reciente
          </h2>
        </div>
        <div className="glass rounded-xl divide-y divide-border">
          {RECENT_ACTIVITY.map((item, i) => (
            <div key={i} className="flex items-center gap-3 px-4 py-3">
              <span className="text-base flex-shrink-0">{ACTIVITY_ICONS[item.type]}</span>
              <p className="text-sm text-foreground flex-1">{item.text}</p>
              <span className="text-xs text-muted-foreground whitespace-nowrap flex-shrink-0">
                {item.time}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function StatCard({
  icon,
  value,
  label,
  sub,
  color,
  clickable,
}: {
  icon: React.ReactNode
  value: string | number
  label: string
  sub: string
  color: "cyan" | "red" | "violet" | "yellow"
  clickable?: boolean
}) {
  const borders = {
    cyan: "border-cyan-500/20 hover:border-cyan-500/40",
    red: "border-red-500/20 hover:border-red-500/40",
    violet: "border-violet-500/20 hover:border-violet-500/40",
    yellow: "border-yellow-500/20 hover:border-yellow-500/40",
  }

  return (
    <div
      className={cn(
        "glass rounded-xl p-4 space-y-2 transition-colors",
        borders[color],
        clickable && "cursor-pointer"
      )}
    >
      <div className="flex items-center gap-2">
        {icon}
        <span className="text-xs text-muted-foreground font-medium">{label}</span>
      </div>
      <p className="text-3xl font-black text-white">{value}</p>
      <p className="text-xs text-muted-foreground">{sub}</p>
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  if (status === "thriving")
    return (
      <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-500/15 text-green-400 border border-green-500/20 font-medium whitespace-nowrap">
        Muy activa
      </span>
    )
  if (status === "active")
    return (
      <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-400 border border-cyan-500/20 font-medium whitespace-nowrap">
        Activa
      </span>
    )
  return (
    <span className="text-[10px] px-2 py-0.5 rounded-full bg-yellow-500/15 text-yellow-400 border border-yellow-500/20 font-medium whitespace-nowrap">
      Atención
    </span>
  )
}
