"use client"

import { useState } from "react"
import {
  DollarSign, TrendingUp, TrendingDown, AlertTriangle, AlertCircle,
  CheckCircle2, MessageCircle, Sparkles, BarChart3, Users,
  ArrowUpRight, History, ArrowDownLeft, ArrowUpRight as ArrowOut,
  Plus, Edit3, Trash2, ClipboardList,
} from "lucide-react"
import { AvatarBadge } from "@/components/demo/AvatarBadge"
import { ActionToast, useActionToast } from "@/components/demo/ActionToast"
import { OnboardingModal } from "@/components/demo/OnboardingModal"
import { FINANCIALS, CENTERS, FINANCIAL_ANOMALIES, type FinancialAnomaly } from "@/data/level"
import { cn } from "@/lib/utils"
import { InfoTooltip } from "@/components/demo/InfoTooltip"
import { useDemoStore } from "@/lib/demo-store"

const ONBOARDING = {
  screenId: "finanzas",
  badge: "Vista del dueño · Finanzas",
  badgeColor: "violet" as const,
  title: "Tu centro como negocio",
  description: "Revenue, costos, margen y quién no ha pagado, todo en un lugar. Sin hojas de cálculo, sin perseguir a tu equipo para saber cómo van las finanzas.",
  tips: [
    { emoji: "💰", text: "El desglose por generación te dice exactamente de dónde viene cada peso del mes." },
    { emoji: "📊", text: "El P&L simplificado muestra tu margen real después de coaches y operación." },
    { emoji: "⚡", text: "Los pagos pendientes están listos para enviar recordatorio con un clic." },
  ],
  cta: "Ver las finanzas →",
}

type FinTab = "resumen" | "historial" | "anomalias"

const ANOMALY_CFG: Record<string, { label: string; color: string; bg: string }> = {
  "pago-sin-comprobante":  { label: "Pago sin comprobante",  color: "text-red-400",    bg: "border-red-500/25 bg-red-500/5" },
  "activo-sin-pago":       { label: "Activo sin pago",       color: "text-red-400",    bg: "border-red-500/25 bg-red-500/5" },
  "beca-sin-autorizacion": { label: "Beca no autorizada",    color: "text-orange-400", bg: "border-orange-500/25 bg-orange-500/5" },
  "comprobante-duplicado": { label: "Comprobante duplicado", color: "text-orange-400", bg: "border-orange-500/25 bg-orange-500/5" },
  "monto-distinto":        { label: "Monto distinto al plan",color: "text-yellow-400", bg: "border-yellow-500/25 bg-yellow-500/5" },
  "gasto-sin-comprobante": { label: "Gasto sin comprobante", color: "text-yellow-400", bg: "border-yellow-500/25 bg-yellow-500/5" },
  "reembolso-pendiente":   { label: "Reembolso pendiente",   color: "text-violet-400", bg: "border-violet-500/25 bg-violet-500/5" },
  "registro-no-autorizado":{ label: "Registro no autorizado",color: "text-red-400",    bg: "border-red-500/25 bg-red-500/5" },
}

function AnomalyCard({ a, onResolve }: { a: FinancialAnomaly; onResolve: () => void }) {
  const cfg = ANOMALY_CFG[a.type] ?? { label: a.type, color: "text-muted-foreground", bg: "border-border bg-foreground/[0.02]" }
  return (
    <div className={cn("rounded-xl border p-3.5 space-y-2", cfg.bg)}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <AlertCircle className={cn("w-4 h-4 flex-shrink-0", cfg.color)} />
          <span className={cn("text-[10px] font-bold uppercase tracking-wider", cfg.color)}>{cfg.label}</span>
        </div>
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <span className={cn(
            "text-[9px] font-bold px-1.5 py-0.5 rounded-full",
            a.status === "pendiente"    ? "bg-red-500/15 text-red-400 border border-red-500/25" :
            a.status === "en-revision"  ? "bg-yellow-500/15 text-yellow-400 border border-yellow-500/25" :
            "bg-green-500/15 text-green-400 border border-green-500/25"
          )}>
            {a.status === "pendiente" ? "Pendiente" : a.status === "en-revision" ? "En revisión" : "Resuelta"}
          </span>
        </div>
      </div>
      <p className="text-xs text-foreground/80 leading-relaxed">{a.description}</p>
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {a.amount != null && (
            <span className="text-xs font-bold text-foreground">${a.amount.toLocaleString("es-MX")} MXN</span>
          )}
          <span className="text-[10px] text-muted-foreground">{a.detectedAt} · {a.assignedTo}</span>
        </div>
        {a.status !== "resuelta" && (
          <button
            onClick={onResolve}
            className="text-[10px] font-semibold text-green-400 hover:text-green-300 transition-colors flex-shrink-0"
          >
            Marcar resuelta →
          </button>
        )}
      </div>
    </div>
  )
}

type FinEntry = {
  id: string
  type: "ingreso" | "egreso"
  category: string
  description: string
  amount: number
  date: string
  registeredBy: string
  note?: string
}

const HISTORIAL: FinEntry[] = [
  { id: "h1",  type: "ingreso", category: "Mensualidad",   description: "Pago PL, Valeria Romo",       amount: 4200,  date: "04 jun 2025 · 09:12",  registeredBy: "Karla Ríos (Ops)" },
  { id: "h2",  type: "ingreso", category: "Mensualidad",   description: "Pago PL, Diego Salinas",      amount: 4200,  date: "04 jun 2025 · 08:45",  registeredBy: "Sistema automático" },
  { id: "h3",  type: "egreso",  category: "Coach",         description: "Honorarios Ana Reyes, Junio",            amount: 18000, date: "03 jun 2025 · 14:00",  registeredBy: "Ricardo Vargas (Dueño)" },
  { id: "h4",  type: "egreso",  category: "Coach",         description: "Honorarios Marco Díaz, Junio",           amount: 18000, date: "03 jun 2025 · 13:58",  registeredBy: "Ricardo Vargas (Dueño)" },
  { id: "h5",  type: "egreso",  category: "Plataforma",    description: "Suscripción ELEVA, Junio 2025",        amount: 8500,  date: "01 jun 2025 · 00:00",  registeredBy: "Sistema automático" },
  { id: "h6",  type: "ingreso", category: "Inscripción",   description: "Despertar, 6 nuevos participantes",      amount: 41400, date: "31 may 2025 · 18:20",  registeredBy: "Karla Ríos (Ops)", note: "Generación Norte, sesión mayo" },
  { id: "h7",  type: "ingreso", category: "Mensualidad",   description: "Cobro masivo PL, 38 pagos",   amount: 159600,date: "01 may 2025 · 09:00",  registeredBy: "Sistema automático", note: "38 de 42 cobraron en fecha" },
  { id: "h8",  type: "egreso",  category: "Operativo",     description: "Renta sala Despertar, mayo",             amount: 12000, date: "28 may 2025 · 11:00",  registeredBy: "Karla Ríos (Ops)" },
  { id: "h9",  type: "egreso",  category: "Marketing",     description: "Pauta redes sociales, mayo",             amount: 4500,  date: "25 may 2025 · 10:00",  registeredBy: "Ricardo Vargas (Dueño)" },
  { id: "h10", type: "ingreso", category: "Membresía",     description: "Membresía Expansión, 3 nuevos",          amount: 3600,  date: "20 may 2025 · 16:30",  registeredBy: "Karla Ríos (Ops)" },
]

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
  const [tab, setTab] = useState<FinTab>("resumen")
  const [entries, setEntries] = useState<FinEntry[]>(HISTORIAL)
  const [showAddEntry, setShowAddEntry] = useState(false)
  const [newEntry, setNewEntry] = useState({ type: "ingreso" as "ingreso" | "egreso", description: "", amount: "", category: "" })
  const [anomalies, setAnomalies] = useState<FinancialAnomaly[]>(FINANCIAL_ANOMALIES)

  const openAnomalies = anomalies.filter((a) => a.status !== "resuelta")

  function resolveAnomaly(id: string) {
    setAnomalies((prev) => prev.map((a) => a.id === id ? { ...a, status: "resuelta" as const } : a))
    show("Anomalía marcada como resuelta ✓")
  }
  const { state } = useDemoStore()
  const center = CENTERS.find((c) => c.id === state.selectedCenter) ?? CENTERS[0]

  function handleRemind(name: string) {
    setReminded((prev) => new Set([...prev, name]))
    show(`Recordatorio enviado a ${name} ✓`)
  }

  function handleRemindAll() {
    setAllReminded(true)
    show("Recordatorios enviados a 4 participantes ✓")
  }

  function handleAddEntry() {
    if (!newEntry.description || !newEntry.amount) return
    const e: FinEntry = {
      id: `h${Date.now()}`,
      type: newEntry.type,
      category: newEntry.category || (newEntry.type === "ingreso" ? "Ingreso" : "Egreso"),
      description: newEntry.description,
      amount: Number(newEntry.amount),
      date: new Date().toLocaleString("es-MX", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }),
      registeredBy: "Ricardo Vargas (Dueño)",
    }
    setEntries((prev) => [e, ...prev])
    setNewEntry({ type: "ingreso", description: "", amount: "", category: "" })
    setShowAddEntry(false)
    show(`${newEntry.type === "ingreso" ? "Ingreso" : "Egreso"} registrado ✓`)
  }

  const monthlyRevenue = center.monthlyRevenue
  const collected = center.collected
  const pending = center.pending
  const netMargin = center.netMargin
  const netIncome = Math.round(collected * (netMargin / 100))
  const vsLastMonth = center.monthlyGrowth
  const collectedPct = Math.round((collected / monthlyRevenue) * 100)
  const pendingPct = Math.round((pending / monthlyRevenue) * 100)

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto space-y-6">
      <OnboardingModal config={ONBOARDING} />

      {/* Header */}
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white">Finanzas</h1>
          <p className="text-muted-foreground text-sm mt-0.5">Junio 2025 · {center.fullName}</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl glass border border-green-500/20 text-xs font-semibold text-green-400">
          <TrendingUp className="w-3.5 h-3.5" />
          +{vsLastMonth}% vs mayo
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 glass rounded-xl w-fit">
        {([
          { id: "resumen",   label: "Resumen",    icon: BarChart3 },
          { id: "historial", label: "Historial",  icon: History },
          { id: "anomalias", label: "Anomalías",  icon: AlertTriangle, badge: openAnomalies.length },
        ] as { id: FinTab; label: string; icon: React.ElementType; badge?: number }[]).map(({ id, label, icon: Icon, badge }) => (
          <button key={id} onClick={() => setTab(id)}
            className={cn("flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all",
              tab === id ? "bg-violet-600 text-white" : "text-muted-foreground hover:text-white")}>
            <Icon className="w-3.5 h-3.5" />
            {label}
            {badge != null && badge > 0 && (
              <span className="text-[9px] font-black bg-red-500 text-white px-1.5 py-0.5 rounded-full">{badge}</span>
            )}
          </button>
        ))}
      </div>

      {tab === "historial" && (
        <div className="space-y-4">
          {/* Add entry */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">{entries.length} movimientos registrados</p>
            <button onClick={() => setShowAddEntry(v => !v)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold transition-all">
              <Plus className="w-3.5 h-3.5" /> Registrar movimiento
            </button>
          </div>

          {showAddEntry && (
            <div className="glass rounded-xl p-4 space-y-3 border border-violet-500/20">
              <p className="text-xs font-semibold text-violet-300 uppercase tracking-wider">Nuevo movimiento</p>
              <div className="flex gap-2">
                {(["ingreso", "egreso"] as const).map(t => (
                  <button key={t} onClick={() => setNewEntry(e => ({ ...e, type: t }))}
                    className={cn("flex-1 py-2 rounded-lg text-xs font-semibold border transition-all capitalize",
                      newEntry.type === t
                        ? t === "ingreso" ? "bg-green-500/15 border-green-500/30 text-green-400" : "bg-red-500/15 border-red-500/30 text-red-400"
                        : "glass border-white/10 text-muted-foreground")}>
                    {t === "ingreso" ? "↓ Ingreso" : "↑ Egreso"}
                  </button>
                ))}
              </div>
              <input placeholder="Descripción del movimiento..." value={newEntry.description}
                onChange={e => setNewEntry(v => ({ ...v, description: e.target.value }))}
                className="w-full px-3 py-2.5 rounded-lg glass border border-white/10 text-white text-sm placeholder-muted-foreground focus:outline-none focus:border-violet-500/50 bg-transparent" />
              <div className="grid grid-cols-2 gap-2">
                <input placeholder="Categoría (ej. Coach)" value={newEntry.category}
                  onChange={e => setNewEntry(v => ({ ...v, category: e.target.value }))}
                  className="px-3 py-2.5 rounded-lg glass border border-white/10 text-white text-sm placeholder-muted-foreground focus:outline-none focus:border-violet-500/50 bg-transparent" />
                <input placeholder="Monto (MXN)" type="number" value={newEntry.amount}
                  onChange={e => setNewEntry(v => ({ ...v, amount: e.target.value }))}
                  className="px-3 py-2.5 rounded-lg glass border border-white/10 text-white text-sm placeholder-muted-foreground focus:outline-none focus:border-violet-500/50 bg-transparent" />
              </div>
              <button onClick={handleAddEntry}
                className="w-full py-2.5 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold transition-all">
                Guardar movimiento
              </button>
            </div>
          )}

          {/* Entry list */}
          <div className="glass rounded-2xl overflow-hidden">
            <div className="divide-y divide-white/4">
              {entries.map((e) => (
                <div key={e.id} className="flex items-start gap-3 px-5 py-3.5">
                  <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5",
                    e.type === "ingreso" ? "bg-green-500/15" : "bg-red-500/15")}>
                    {e.type === "ingreso"
                      ? <ArrowDownLeft className="w-4 h-4 text-green-400" />
                      : <ArrowOut className="w-4 h-4 text-red-400" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={cn("text-[10px] font-semibold px-1.5 py-0.5 rounded",
                        e.type === "ingreso" ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400")}>
                        {e.category}
                      </span>
                      <span className="text-[10px] text-muted-foreground">{e.date}</span>
                    </div>
                    <p className="font-medium text-white text-sm mt-0.5 leading-snug">{e.description}</p>
                    {e.note && <p className="text-[11px] text-muted-foreground mt-0.5 italic">{e.note}</p>}
                    <p className="text-[10px] text-muted-foreground mt-0.5">Registrado por: {e.registeredBy}</p>
                  </div>
                  <p className={cn("font-bold text-sm flex-shrink-0", e.type === "ingreso" ? "text-green-400" : "text-red-400")}>
                    {e.type === "ingreso" ? "+" : "-"}{fmt(e.amount)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === "resumen" && (<>

      {/* Revenue overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {([
          {
            label: "Ingresos del mes", value: fmt(monthlyRevenue), sub: "Mensualidades + inscripciones",
            color: "text-white", icon: DollarSign, iconColor: "text-violet-400",
            tip: <InfoTooltip title="Ingresos del mes" source="Suma de mensualidades cobradas + inscripciones nuevas en el mes en curso." formula="MRR = Σ(cuota × participantes_activos)" why="Es el MRR (Monthly Recurring Revenue), la métrica base para proyectar crecimiento y tomar decisiones de inversión." benchmark=">$200K MXN/mes para un centro de 80+ participantes" side="bottom" />,
          },
          {
            label: "Cobrado", value: fmt(collected), sub: `${collectedPct}% del total`,
            color: "text-green-400", icon: CheckCircle2, iconColor: "text-green-400",
            tip: <InfoTooltip title="Cobrado este mes" source="Pagos confirmados recibidos en la cuenta del centro, ya reconciliados." why="Distingue el ingreso real (cash in) del ingreso devengado. Es lo que puedes gastar hoy." benchmark=">85% cobrado a mitad de mes es saludable" action="Si baja de 75%, revisar quién falta y priorizar recordatorios." side="bottom" />,
          },
          {
            label: "Por cobrar", value: fmt(pending), sub: `${pendingPct}% pendiente`,
            color: "text-yellow-400", icon: AlertTriangle, iconColor: "text-yellow-400",
            tip: <InfoTooltip title="Por cobrar" source="Mensualidades de participantes activos que aún no han pagado el mes en curso." why="Si el pendiente supera 20% del MRR, hay presión de flujo de caja. Cada día adicional de retraso aumenta la probabilidad de no cobro." action="Enviar recordatorio automático a los 3 días de vencimiento; seguimiento manual a los 7." side="bottom" />,
          },
          {
            label: "Margen neto", value: `${netMargin}%`, sub: fmt(netIncome) + "/mes",
            color: "text-cyan-400", icon: BarChart3, iconColor: "text-cyan-400",
            tip: <InfoTooltip title="Margen neto" source="(Ingresos cobrados − Costos totales) ÷ Ingresos × 100" formula="Margen = (MRR − Costos) / MRR" why="Mide la rentabilidad real del centro. Un margen >60% indica un modelo de negocio escalable sin depender de volumen masivo." benchmark=">55% excelente · 40-55% sano · <40% revisar estructura de costos" side="bottom" />,
          },
        ] as const).map(({ label, value, sub, color, icon: Icon, iconColor, tip }) => (
          <div key={label} className="glass rounded-xl p-4 space-y-2">
            <div className="flex items-center gap-1.5">
              <Icon className={cn("w-3.5 h-3.5", iconColor)} />
              <p className="text-[11px] text-muted-foreground flex-1">{label}</p>
              {tip}
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
            <span className="text-muted-foreground">Cobrado {fmt(collected)} ({collectedPct}%)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded bg-yellow-500/70" />
            <span className="text-muted-foreground">Pendiente {fmt(pending)} ({pendingPct}%)</span>
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
              <PLRow label="Mensualidades PL" value={center.mrr} color="text-green-400" />
              <PLRow label="Inscripciones (Despertar + Expansión)" value={monthlyRevenue - center.mrr} color="text-green-400" />
              <PLRow label="Total ingresos cobrados" value={collected} color="text-green-400" bold />
            </div>
          </div>

          <div className="h-px bg-white/6" />

          {/* Costs, scaled by coaches count */}
          <div>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2">Costos</p>
            <div className="space-y-1.5">
              <PLRow label={`Coaches (${center.coaches} asignados)`} value={-center.coaches * 18000} color="text-red-400" />
              <PLRow label="Staff operativo" value={-Math.round(center.coaches * 9000)} color="text-red-400" />
              <PLRow label="Plataforma + herramientas" value={-8500} color="text-red-400" />
              <PLRow label="Total costos" value={-(center.coaches * 18000 + Math.round(center.coaches * 9000) + 8500)} color="text-red-400" bold />
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
              <p className="text-2xl font-black text-cyan-400">{netMargin}%</p>
              <p className="text-xs text-cyan-400">{fmt(netIncome)}</p>
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

      {/* Anomalías del sistema */}
      <div className="glass rounded-2xl p-5 space-y-4 border border-orange-500/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-orange-400" />
            <p className="font-semibold text-white text-sm">Alertas del sistema</p>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-orange-500/15 text-orange-400 border border-orange-500/20 font-bold">6 detectadas</span>
        </div>
        <div className="space-y-2">
          {[
            { label: "Participantes activos sin pago registrado", count: 3, action: "Revisar expedientes", color: "red", tip: "Pueden estar en cohorte sin haber concluido el proceso de pago." },
            { label: "Pago registrado sin comprobante adjunto", count: 1, action: "Ver movimiento", color: "orange", tip: "Registrado por staff, requiere comprobante para cierres mensuales." },
            { label: "Monto pagado distinto al plan acordado", count: 2, action: "Ver acuerdos", color: "orange", tip: "Probable pago parcial sin nota de acuerdo. Verificar con ops." },
            { label: "Campaña de cobranza enviada sin seguimiento", count: 1, action: "Ver campaña", color: "yellow", tip: "La campaña del 28 de mayo no tuvo respuesta registrada." },
            { label: "Participante con saldo vencido y momentum alto", count: 1, action: "Ver participante", color: "yellow", tip: "Diego Salinas tiene momentum 94% pero pago pendiente. Recordatorio amable recomendado." },
            { label: "Participante completado con saldo pendiente", count: 0, action: "-", color: "green", tip: "Sin casos detectados este mes." },
          ].map(({ label, count, action, color, tip }) => (
            <details key={label} className={cn(
              "group rounded-xl border transition-colors",
              color === "red"    ? "border-red-500/20 bg-red-500/3" :
              color === "orange" ? "border-orange-500/20 bg-orange-500/3" :
              color === "yellow" ? "border-yellow-500/20 bg-yellow-500/3" :
              "border-green-500/20 bg-green-500/3"
            )}>
              <summary className="flex items-center justify-between p-3 cursor-pointer list-none select-none">
                <div className="flex items-center gap-2.5">
                  <div className={cn(
                    "w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black flex-shrink-0",
                    color === "red"    ? "bg-red-500/20 text-red-400" :
                    color === "orange" ? "bg-orange-500/20 text-orange-400" :
                    color === "yellow" ? "bg-yellow-500/20 text-yellow-400" :
                    "bg-green-500/20 text-green-400"
                  )}>
                    {count === 0 ? "✓" : count}
                  </div>
                  <p className="text-xs text-foreground leading-snug">{label}</p>
                </div>
                {count > 0 && (
                  <span className="text-[10px] text-muted-foreground whitespace-nowrap ml-2 flex-shrink-0 group-open:hidden">ver →</span>
                )}
              </summary>
              <div className="px-3 pb-3 space-y-2">
                <p className="text-[11px] text-muted-foreground leading-snug">{tip}</p>
                {count > 0 && (
                  <button
                    onClick={() => {}}
                    className={cn(
                      "text-[10px] px-2.5 py-1 rounded-lg font-semibold border transition-colors",
                      color === "red"    ? "border-red-500/30 text-red-400 hover:bg-red-500/10" :
                      color === "orange" ? "border-orange-500/30 text-orange-400 hover:bg-orange-500/10" :
                      "border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/10"
                    )}
                  >
                    {action}
                  </button>
                )}
              </div>
            </details>
          ))}
        </div>
        <p className="text-[10px] text-muted-foreground">ELEVA detecta estas anomalías automáticamente cada 24 horas. Resuélvelas antes del cierre mensual.</p>
      </div>

      {/* Projection */}
      <div className="glass-violet rounded-2xl p-5 space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-violet-400" />
          <p className="font-semibold text-white text-sm">Proyección, Julio 2025</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[
            { label: "Renovaciones esperadas Gen. Omega", value: "85/89", sub: "95% de retención" },
            { label: "Nueva generación proyectada", value: fmt(320000), sub: "~40 nuevas inscripciones" },
            { label: "MRR proyectado julio", value: fmt(Math.round(monthlyRevenue * 1.06)), sub: `+6% vs junio` },
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
      </>)}

      {/* ── Anomalías tab ─────────────────────────────────────────── */}
      {tab === "anomalias" && (
        <div className="space-y-4">
          {/* Explanation */}
          <div className="glass rounded-xl p-4 space-y-2 border border-orange-500/15">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-orange-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-white">Anomalías detectadas automáticamente</p>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  ELEVA monitorea cada movimiento financiero y detecta inconsistencias, pagos sin comprobante, participantes activos
                  sin pago registrado, becas no autorizadas, comprobantes duplicados. Esto no es solo un dashboard: es disciplina financiera.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 pt-1 border-t border-white/5">
              <div className="text-center">
                <p className="text-xl font-black text-red-400">{anomalies.filter(a => a.severity === "alta" && a.status !== "resuelta").length}</p>
                <p className="text-[10px] text-muted-foreground">Severidad alta</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-black text-yellow-400">{anomalies.filter(a => a.severity === "media" && a.status !== "resuelta").length}</p>
                <p className="text-[10px] text-muted-foreground">Severidad media</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-black text-green-400">{anomalies.filter(a => a.status === "resuelta").length}</p>
                <p className="text-[10px] text-muted-foreground">Resueltas</p>
              </div>
            </div>
          </div>

          {/* Alta severity */}
          {anomalies.filter(a => a.severity === "alta").length > 0 && (
            <div className="space-y-2">
              <p className="text-[10px] uppercase tracking-widest text-red-400 font-semibold">🔴 Alta prioridad, resolver antes del cierre</p>
              {anomalies.filter(a => a.severity === "alta").map((a) => (
                <AnomalyCard key={a.id} a={a} onResolve={() => resolveAnomaly(a.id)} />
              ))}
            </div>
          )}

          {/* Media severity */}
          {anomalies.filter(a => a.severity === "media").length > 0 && (
            <div className="space-y-2">
              <p className="text-[10px] uppercase tracking-widest text-yellow-400 font-semibold">🟡 Prioridad media, esta semana</p>
              {anomalies.filter(a => a.severity === "media").map((a) => (
                <AnomalyCard key={a.id} a={a} onResolve={() => resolveAnomaly(a.id)} />
              ))}
            </div>
          )}

          {/* Baja */}
          {anomalies.filter(a => a.severity === "baja").length > 0 && (
            <div className="space-y-2">
              <p className="text-[10px] uppercase tracking-widest text-violet-400 font-semibold">🔵 Bajo impacto, revisar cuando puedas</p>
              {anomalies.filter(a => a.severity === "baja").map((a) => (
                <AnomalyCard key={a.id} a={a} onResolve={() => resolveAnomaly(a.id)} />
              ))}
            </div>
          )}

          {openAnomalies.length === 0 && (
            <div className="text-center py-12 space-y-2">
              <CheckCircle2 className="w-10 h-10 text-green-400/40 mx-auto" />
              <p className="text-sm font-semibold text-green-400">Todo en orden</p>
              <p className="text-xs text-muted-foreground">Sin anomalías activas. El sistema seguirá monitoreando.</p>
            </div>
          )}

          {/* SOP note */}
          <div className="glass rounded-xl p-4 border border-violet-500/15 space-y-2">
            <p className="text-xs font-bold text-violet-400">¿Cómo evitar anomalías futuras?</p>
            <div className="space-y-1.5">
              {[
                "Cada pago debe tener comprobante adjunto antes de marcar como 'pagado'",
                "Los descuentos y becas requieren autorización firmada del dueño en el sistema",
                "El corte de caja debe realizarse al final de cada evento presencial",
                "Los participantes activos sin pago en 7 días generan alerta automática al coach",
                "Los reembolsos tienen plazo máximo de 5 días hábiles para aprobación",
              ].map((rule, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                  <span className="text-violet-400 font-bold flex-shrink-0 mt-0.5">{i + 1}.</span>
                  <span className="leading-relaxed">{rule}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

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
