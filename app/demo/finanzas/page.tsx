"use client"

import { useState } from "react"
import {
  DollarSign, TrendingUp, TrendingDown, AlertTriangle,
  CheckCircle2, MessageCircle, Sparkles, BarChart3, Users,
  ArrowUpRight,
} from "lucide-react"
import { AvatarBadge } from "@/components/demo/AvatarBadge"
import { ActionToast, useActionToast } from "@/components/demo/ActionToast"
import { OnboardingModal } from "@/components/demo/OnboardingModal"
import { FINANCIALS } from "@/data/creania"
import { cn } from "@/lib/utils"

const ONBOARDING = {
  screenId: "finanzas",
  badge: "Vista del dueño · Finanzas",
  badgeColor: "violet" as const,
  title: "Tu centro como negocio",
  description: "Revenue, costos, margen y quién no ha pagado — todo en un lugar. Sin hojas de cálculo, sin perseguir a tu equipo para saber cómo van las finanzas.",
  tips: [
    { emoji: "💰", text: "El desglose por generación te dice exactamente de dónde viene cada peso del mes." },
    { emoji: "📊", text: "El P&L simplificado muestra tu margen real después de coaches y operación." },
    { emoji: "⚡", text: "Los pagos pendientes están listos para enviar recordatorio con un clic." },
  ],
  cta: "Ver las finanzas →",
}

function fmt(n: number) {
  return `$${n.toLocaleString("es-MX")} MXN`
}

function pct(partial: number, total: number) {
  return `${Math.round((partial / total) * 100)}%`
}

export default function FinanzasPage() {
  const { toast, show, hide } = useActionToast()
  const [reminded, setReminded] = useState<Set<string>>(new Set())
  const [allReminded, setAllReminded] = useState(false)

  function handleRemind(name: string) {
    setReminded((prev) => new Set([...prev, name]))
    show(`Recordatorio enviado a ${name} ✓`)
  }

  function handleRemindAll() {
    setAllReminded(true)
    show("Recordatorios enviados a 4 participantes ✓")
  }

  const collectedPct = Math.round((FINANCIALS.collected / FINANCIALS.monthlyRevenue) * 100)
  const pendingPct = Math.round((FINANCIALS.pending / FINANCIALS.monthlyRevenue) * 100)

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto space-y-6">
      <OnboardingModal config={ONBOARDING} />

      {/* Header */}
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white">Finanzas</h1>
          <p className="text-muted-foreground text-sm mt-0.5">Junio 2025 · Creania Transformación</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl glass border border-green-500/20 text-xs font-semibold text-green-400">
          <TrendingUp className="w-3.5 h-3.5" />
          +{FINANCIALS.vsLastMonth}% vs mayo
        </div>
      </div>

      {/* Revenue overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Ingresos del mes", value: fmt(FINANCIALS.monthlyRevenue), sub: "Mensualidades + inscripciones", color: "text-white", icon: DollarSign, iconColor: "text-violet-400" },
          { label: "Cobrado", value: fmt(FINANCIALS.collected), sub: `${collectedPct}% del total`, color: "text-green-400", icon: CheckCircle2, iconColor: "text-green-400" },
          { label: "Por cobrar", value: fmt(FINANCIALS.pending), sub: `${pendingPct}% pendiente`, color: "text-yellow-400", icon: AlertTriangle, iconColor: "text-yellow-400" },
          { label: "Margen neto", value: `${FINANCIALS.netMargin}%`, sub: fmt(FINANCIALS.netIncome) + "/mes", color: "text-cyan-400", icon: BarChart3, iconColor: "text-cyan-400" },
        ].map(({ label, value, sub, color, icon: Icon, iconColor }) => (
          <div key={label} className="glass rounded-xl p-4 space-y-2">
            <div className="flex items-center gap-2">
              <Icon className={cn("w-3.5 h-3.5", iconColor)} />
              <p className="text-[11px] text-muted-foreground">{label}</p>
            </div>
            <p className={cn("text-xl sm:text-2xl font-black leading-none", color)}>{value}</p>
            <p className="text-[10px] text-muted-foreground">{sub}</p>
          </div>
        ))}
      </div>

      {/* Collected bar */}
      <div className="glass rounded-xl p-5 space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-white">Cobrado vs pendiente</p>
          <span className="text-xs text-muted-foreground">Junio 2025</span>
        </div>
        <div className="h-4 rounded-full bg-white/5 overflow-hidden flex">
          <div
            className="h-full bg-green-500 transition-all"
            style={{ width: `${collectedPct}%` }}
          />
          <div
            className="h-full bg-yellow-500/70 transition-all"
            style={{ width: `${pendingPct}%` }}
          />
        </div>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded bg-green-500" />
            <span className="text-muted-foreground">Cobrado {fmt(FINANCIALS.collected)} ({collectedPct}%)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded bg-yellow-500/70" />
            <span className="text-muted-foreground">Pendiente {fmt(FINANCIALS.pending)} ({pendingPct}%)</span>
          </div>
        </div>
      </div>

      {/* By cohorte */}
      <div className="glass rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-white/6 flex items-center gap-2">
          <Users className="w-4 h-4 text-violet-400" />
          <p className="font-semibold text-white text-sm">Desglose por generación</p>
        </div>
        <div className="divide-y divide-white/4">
          {FINANCIALS.byCohorte.map((c) => {
            const collectedRatio = Math.round((c.collected / c.expected) * 100)
            return (
              <div key={c.name} className="px-5 py-4 space-y-2.5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-white text-sm">{c.name}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {c.participants
                        ? `${c.participants} participantes × ${fmt(c.rate!).replace(" MXN", "")} MXN`
                        : `${c.inscriptions} inscripciones · ticket promedio ${fmt(c.avgTicket!).replace(" MXN", "")} MXN`}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-bold text-white">{fmt(c.expected)}</p>
                    <p className="text-[10px] text-muted-foreground">esperado</p>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-green-400 font-medium">Cobrado: {fmt(c.collected)}</span>
                    <span className={cn("font-semibold", c.pending > 0 ? "text-yellow-400" : "text-green-400")}>
                      {c.pending > 0 ? `Pendiente: ${fmt(c.pending)}` : "Sin pendientes ✓"}
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full bg-white/8 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-green-500 transition-all"
                      style={{ width: `${collectedRatio}%` }}
                    />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* P&L */}
      <div className="glass rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-white/6 flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-cyan-400" />
          <p className="font-semibold text-white text-sm">P&L Simplificado · Junio 2025</p>
        </div>
        <div className="p-5 space-y-3">
          {/* Revenue */}
          <div>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2">Ingresos</p>
            <div className="space-y-1.5">
              <PLRow label="Mensualidades Vía Creania" value={FINANCIALS.mrr} color="text-green-400" />
              <PLRow label="Inscripciones (Despertar + Expansión)" value={FINANCIALS.enrollments} color="text-green-400" />
              <PLRow label="Total ingresos cobrados" value={FINANCIALS.collected} color="text-green-400" bold />
            </div>
          </div>

          <div className="h-px bg-white/6" />

          {/* Costs */}
          <div>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2">Costos</p>
            <div className="space-y-1.5">
              <PLRow label="Coaches (3 asignados)" value={-FINANCIALS.coachesCost} color="text-red-400" />
              <PLRow label="Staff operativo (2 personas)" value={-FINANCIALS.staffCost} color="text-red-400" />
              <PLRow label="Plataforma + herramientas" value={-FINANCIALS.platformCost} color="text-red-400" />
              <PLRow label="Total costos" value={-FINANCIALS.totalCosts} color="text-red-400" bold />
            </div>
          </div>

          <div className="h-px bg-white/6" />

          {/* Net */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-cyan-500/8 border border-cyan-500/20">
            <div>
              <p className="font-bold text-white">Margen neto estimado</p>
              <p className="text-xs text-muted-foreground">Después de todos los costos operativos</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-black text-cyan-400">{FINANCIALS.netMargin}%</p>
              <p className="text-xs text-cyan-400">{fmt(FINANCIALS.netIncome)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Pending payments */}
      <div className="glass rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-white/6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-yellow-400" />
            <p className="font-semibold text-white text-sm">Pagos pendientes · {FINANCIALS.pendingParticipants.length} participantes</p>
          </div>
          <button
            onClick={handleRemindAll}
            disabled={allReminded}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all",
              allReminded
                ? "bg-green-500/10 text-green-400 border border-green-500/20"
                : "bg-yellow-500 hover:bg-yellow-600 text-black"
            )}
          >
            {allReminded ? <><CheckCircle2 className="w-3 h-3" /> Enviados</> : "Recordatorio masivo"}
          </button>
        </div>

        <div className="divide-y divide-white/4">
          {FINANCIALS.pendingParticipants.map((p) => (
            <div key={p.name} className="flex items-center gap-4 px-5 py-3.5">
              <AvatarBadge initials={p.avatar} size="sm" />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-white text-sm">{p.name}</p>
                <p className="text-xs text-muted-foreground">{p.cohorte} · {p.overdueDays > 0 ? `Vencido hace ${p.overdueDays} días` : "Vence este mes"}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className={cn("font-bold text-sm", p.overdueDays > 0 ? "text-red-400" : "text-yellow-400")}>
                  {fmt(p.amount)}
                </p>
              </div>
              <button
                onClick={() => handleRemind(p.name)}
                disabled={reminded.has(p.name) || allReminded}
                className={cn(
                  "flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all flex-shrink-0",
                  reminded.has(p.name) || allReminded
                    ? "bg-green-500/10 text-green-400"
                    : "glass text-muted-foreground hover:text-white hover:border-white/20"
                )}
              >
                {reminded.has(p.name) || allReminded
                  ? <><CheckCircle2 className="w-3 h-3" /> Enviado</>
                  : <><MessageCircle className="w-3 h-3" /> Recordar</>}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Projection */}
      <div className="glass-violet rounded-2xl p-5 space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-violet-400" />
          <p className="font-semibold text-white text-sm">Proyección — Julio 2025</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[
            { label: "Renovaciones esperadas Gen. Omega", value: "85/89", sub: "95% de retención" },
            { label: "Nueva generación proyectada", value: fmt(320000), sub: "~40 nuevas inscripciones" },
            { label: "MRR proyectado julio", value: fmt(FINANCIALS.projectionNextMonth), sub: `+${FINANCIALS.projectionGrowth}% vs junio` },
          ].map(({ label, value, sub }) => (
            <div key={label} className="glass rounded-xl p-3 space-y-1">
              <p className="text-[10px] text-muted-foreground leading-snug">{label}</p>
              <p className="font-bold text-white text-sm">{value}</p>
              <p className="text-[10px] text-violet-400">{sub}</p>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <ArrowUpRight className="w-3.5 h-3.5 text-violet-400" />
          Proyección basada en histórico de retención + inscripciones en curso
        </div>
      </div>

      <ActionToast message={toast.message} visible={toast.visible} onHide={hide} />
    </div>
  )
}

function PLRow({ label, value, color, bold }: { label: string; value: number; color: string; bold?: boolean }) {
  const isNeg = value < 0
  return (
    <div className={cn("flex items-center justify-between text-sm", bold ? "font-bold" : "")}>
      <span className={bold ? "text-white" : "text-muted-foreground"}>{label}</span>
      <span className={color}>{isNeg ? "-" : "+"}{fmt(Math.abs(value))}</span>
    </div>
  )
}
