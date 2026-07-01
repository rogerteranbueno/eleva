"use client"

import { useState, useRef, useEffect } from "react"
import {
  Brain,
  Send,
  Sparkles,
  TrendingDown,
  TrendingUp,
  AlertTriangle,
  DollarSign,
  Users,
  Zap,
  ChevronRight,
  CheckCircle,
  RotateCcw,
} from "lucide-react"
import {
  ScatterChart, Scatter, XAxis, YAxis, ZAxis, Tooltip as RTooltip, ResponsiveContainer,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ComposedChart, Bar, Line, Area, CartesianGrid, Legend,
  AreaChart,
  Cell,
} from "recharts"
import { getMomentumColor, cn } from "@/lib/utils"
import { CRM_PARTICIPANTS, COACH_METRICS, FINANCIALS, MOMENTUM_HISTORY } from "@/data/level"

// ─── AI Query definitions ───────────────────────────────────────────────────

const SUGGESTED_QUERIES = [
  { id: "resumen",   label: "Resumen ejecutivo",             icon: "🧭" },
  { id: "riesgo",    label: "¿Quién va a cancelar?",        icon: "🔴" },
  { id: "revenue",   label: "Proyección de ingresos",       icon: "💰" },
  { id: "coaches",   label: "Estado del equipo de coaches", icon: "👥" },
  { id: "cohortes",  label: "¿Qué generación preocupa?",    icon: "📉" },
]

// ─── Chart data ──────────────────────────────────────────────────────────────

const RISK_SCATTER = CRM_PARTICIPANTS.map((p) => ({
  x: p.lastAccessDays,
  y: p.momentum,
  z: p.riskLevel === "high" ? 500 : p.riskLevel === "medium" ? 300 : 150,
  name: p.name.split(" ")[0],
  risk: p.riskLevel,
  momentum: p.momentum,
  days: p.lastAccessDays,
}))

const COACH_RADAR = COACH_METRICS.map((c) => ({
  coach: c.name.split(" ")[0],
  Momentum: c.groupMomentum,
  Sesiones: Math.round((c.sessionsThisMonth / c.sessionsPlanned) * 100),
  Contacto: Math.max(0, 100 - c.lastGroupContactDays * 8),
  Riesgo: Math.max(0, 100 - c.atRiskCount * 10),
  Misiones: c.missedSessions === 0 ? 100 : c.sessionsThisMonth * 15,
}))

const REVENUE_CHART = [
  { mes: "Feb",  cobrado: 198000, pendiente: 42000, proyeccion: null },
  { mes: "Mar",  cobrado: 221000, pendiente: 38000, proyeccion: null },
  { mes: "Abr",  cobrado: 267000, pendiente: 44000, proyeccion: null },
  { mes: "May",  cobrado: 293600, pendiente: 48600, proyeccion: null },
  { mes: "Jun",  cobrado: null,   pendiente: null,  proyeccion: 342200 },
  { mes: "Jul",  cobrado: null,   pendiente: null,  proyeccion: 361000 },
  { mes: "Ago",  cobrado: null,   pendiente: null,  proyeccion: 389000 },
]

const COHORT_MOMENTUM = MOMENTUM_HISTORY.slice(-20).map((d, i) => ({
  day: d.day,
  Omega: d.value,
  Norte: Math.max(20, d.value - 12 + (i % 4 === 0 ? -5 : 2)),
  Via12: Math.min(100, d.value + 10 + (i % 3 === 0 ? 3 : -1)),
}))

const CHURN_PROBABILITY = [
  { name: "Valeria Romo",     prob: 89, color: "#ef4444", days: 11, momentum: 23 },
  { name: "Paola Serrano",    prob: 76, color: "#f97316", days: 9,  momentum: 29 },
  { name: "Roberto Campos",   prob: 61, color: "#f97316", days: 8,  momentum: 31 },
  { name: "Carlos Peñafiel",  prob: 48, color: "#eab308", days: 7,  momentum: 35 },
  { name: "Andrés Mora",      prob: 34, color: "#eab308", days: 4,  momentum: 42 },
  { name: "Ernesto Vargas",   prob: 28, color: "#84cc16", days: 7,  momentum: 37 },
]

// ─── Per-query AI responses ──────────────────────────────────────────────────

type QueryId = "resumen" | "riesgo" | "revenue" | "coaches" | "cohortes"

interface AIResponse {
  headline: string
  alert?: { level: "red" | "yellow" | "green"; text: string }
  summary: string
  chart: "scatter" | "radar" | "revenue" | "cohort" | "churn" | "kpis"
  insights: string[]
  actions: string[]
}

const AI_RESPONSES: Record<QueryId, AIResponse> = {
  resumen: {
    headline: "Centro en estado de alerta moderada — acción requerida esta semana",
    alert: { level: "yellow", text: "⚠️ 3 señales críticas detectadas" },
    summary: "El centro opera a 67% de momentum promedio, por debajo del umbral óptimo de 75%. La Generación Norte muestra la caída más preocupante (-7 pts en 2 semanas). Revenue en crecimiento (+12% vs mayo) pero con $48,600 MXN pendientes de cobro. Ana Reyes lleva 9 días sin contacto grupal con Gen. Omega.",
    chart: "kpis",
    insights: [
      "14 participantes bajo umbral crítico — representan $235,200 MXN en riesgo de churn",
      "Gen. Norte cayó de 65% → 58% en 14 días sin intervención del coach",
      "Ana Reyes tiene 3 sesiones sin completar de 6 planeadas este mes",
      "El evento del jueves tiene solo 34% de confirmación (30/89 participantes)",
      "Diego Salinas activo 22 días consecutivos — candidato ideal para embajador",
    ],
    actions: [
      "Activar protocolo de retención para 4 participantes con >50% prob. de churn",
      "Sesión urgente con Ana Reyes sobre sus métricas de contacto",
      "Enviar recordatorio masivo del evento a los 59 sin confirmar",
    ],
  },
  riesgo: {
    headline: "4 participantes en zona de cancelación inminente — $67,200 MXN en riesgo",
    alert: { level: "red", text: "🔴 Acción urgente — ventana de 7 días" },
    summary: "El modelo detecta probabilidad de churn basándose en 3 variables: días de inactividad, momentum actual y patrón de pagos. La correlación más fuerte es la combinación inactividad +7 días + momentum <35% — históricamente el 83% de participantes en ese cuadrante no renueva.",
    chart: "churn",
    insights: [
      "Valeria Romo: 89% — inactiva 11d, momentum 23%, pago vencido 3d. Patrón idéntico a 3 cancelaciones del Q1",
      "Paola Serrano: 76% — 1 misión completada en 8 semanas, pago vencido 7d",
      "Roberto Campos: 61% — cayó de 68% → 31% en 21 días. Velocidad de caída alarmante",
      "Carlos Peñafiel: 48% — tendencia descendente, pago pendiente. Umbral de riesgo en 10 días",
      "Sin intervención esta semana: pérdida estimada $67,200 MXN + costo de reposición (3x)",
    ],
    actions: [
      "Llamada personal del founder a Valeria hoy — no mensaje, llamada",
      "Coach Marco contacta a Paola y Roberto hoy antes de las 6pm",
      "Suspender cobro automático de Carlos por 7 días para evitar fricción",
    ],
  },
  revenue: {
    headline: "Proyección: $389,000 MXN en agosto si se retiene a participantes en riesgo",
    alert: { level: "yellow", text: "⚠️ $67,200 MXN en riesgo si no hay intervención esta semana" },
    summary: "El crecimiento mensual es consistente (+12% promedio). La proyección de $389K en agosto asume retención del 92%. Si los 4 participantes de alto riesgo cancelan, la proyección cae a $321,800 — un delta de $67,200 que cambia el margen de 72% a 63%. El costo de retenerlos (1 llamada, 1 sesión) es ~$800 MXN.",
    chart: "revenue",
    insights: [
      "MRR actual $247,400 · Revenue total incluyendo nuevas inscripciones: $342,200",
      "Margen neto 72.6% ($213,100) — referencia del sector en metodologías de 5 meses: 58-65%",
      "3 pagos vencidos concentran el 90% de la mora: Paola ($8,900), Omar ($4,200), Valeria ($4,200)",
      "Próxima inscripción nueva generación estimada en $94,800 adicionales en julio",
      "Si Gen. Norte convierte al 85% en PL: +$258,720 MXN en el siguiente ciclo",
    ],
    actions: [
      "Enviar recordatorio de pago a Paola Serrano hoy — mayor monto vencido",
      "Preparar oferta de plan de pagos para evitar churn por causa financiera",
      "Definir fecha y cupo para la próxima inscripción — demanda latente identificada",
    ],
  },
  coaches: {
    headline: "Daniela Torres es el benchmark del equipo — Ana Reyes necesita intervención",
    alert: { level: "yellow", text: "⚠️ Ana Reyes: 3 sesiones sin completar, 9 días sin contacto grupal" },
    summary: "El análisis compara a los 3 coaches en 5 dimensiones: momentum del grupo, % de sesiones completadas, frecuencia de contacto, participantes en riesgo activo y cumplimiento de misiones. Daniela Torres lidera en todas las categorías con Gen. Vía 12 al 81%. Ana Reyes tiene el grupo más grande (89) y el mayor número de participantes en riesgo (6).",
    chart: "radar",
    insights: [
      "Daniela Torres: 100% sesiones completadas, contacto grupal hace 0 días, solo 2 en riesgo",
      "Marco Fuentes: recuperándose — momentum subió de 52% → 58% en 10 días tras intervención",
      "Ana Reyes: mayor volumen (89 participantes) pero métricas de contacto en zona crítica",
      "Correlación identificada: cada día adicional sin contacto grupal = -1.2% momentum promedio",
      "Costo de un coach ausente: 3-4 participantes en riesgo adicionales por semana",
    ],
    actions: [
      "Reunión 1:1 con Ana Reyes esta semana — revisar carga y definir plan de contacto",
      "Asignar apoyo: Rodrigo Peña como co-facilitador para Gen. Omega temporalmente",
      "Implementar KPI semanal de coaches visible en dashboard público del equipo",
    ],
  },
  cohortes: {
    headline: "Generación Norte en caída estructural — intervención colectiva esta semana",
    alert: { level: "red", text: "🔴 Norte bajó 7 pts en 14 días — patrón pre-abandono colectivo" },
    summary: "El momentum de Generación Norte lleva 14 días cayendo sin recuperación. La combinación de coach con bajo contacto grupal (12 días) + 3 participantes con inactividad +7 días + fase completada (Expansión) crea el patrón típico de abandono colectivo post-curso. Históricamente, generaciones en este patrón tienen 40% de no-conversión a PL.",
    chart: "cohort",
    insights: [
      "Norte: 58% momentum · -7 pts en 14 días · Marco Fuentes sin contacto grupal hace 12 días",
      "Omega: estable en 74% pero con 6 participantes en riesgo individual — presión interna",
      "Vía 12: liderando con 81% · Daniela Torres contactó hoy · solo 2 en riesgo",
      "Riesgo de no-conversión de Norte a PL: estimado 35-40% sin intervención",
      "Revenue en riesgo si Norte no convierte: $258,720 MXN del siguiente ciclo",
    ],
    actions: [
      "Marco Fuentes: sesión grupal de emergencia con Norte esta semana",
      "Activar testimonios de Diego Salinas y Carmen Valdés en el grupo de Norte",
      "Ofrecer sesión 1:1 gratuita con especialista a los 3 participantes más inactivos de Norte",
    ],
  },
}

// ─── Subcomponents ───────────────────────────────────────────────────────────

function KPIsDashboard() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: "MRR", value: "$247,400", sub: "+12% vs mayo", color: "text-green-400", icon: <DollarSign className="w-4 h-4" /> },
          { label: "En riesgo", value: "14", sub: "$235K en juego", color: "text-red-400", icon: <AlertTriangle className="w-4 h-4" /> },
          { label: "Momentum", value: "67%", sub: "Umbral: 75%", color: "text-yellow-400", icon: <TrendingDown className="w-4 h-4" /> },
          { label: "Retención", value: "94%", sub: "Meta: 90%", color: "text-cyan-400", icon: <Users className="w-4 h-4" /> },
        ].map((k) => (
          <div key={k.label} className="glass rounded-xl p-3">
            <div className="flex items-center gap-2 mb-1">
              <span className={k.color}>{k.icon}</span>
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider">{k.label}</span>
            </div>
            <p className={`text-xl font-black ${k.color}`}>{k.value}</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">{k.sub}</p>
          </div>
        ))}
      </div>
      <div className="glass rounded-xl p-3">
        <p className="text-xs text-muted-foreground mb-2">Momentum del centro — 30 días</p>
        <ResponsiveContainer width="100%" height={80}>
          <AreaChart data={MOMENTUM_HISTORY.slice(-20)} margin={{ top: 2, right: 4, left: -25, bottom: 0 }}>
            <defs>
              <linearGradient id="kpiGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#7C3AED" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="day" tick={false} axisLine={false} tickLine={false} />
            <YAxis domain={[0, 100]} tick={false} axisLine={false} tickLine={false} />
            <Area type="monotone" dataKey="value" stroke="#7C3AED" strokeWidth={2} fill="url(#kpiGrad)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

function ChurnChart() {
  return (
    <div className="space-y-3">
      {CHURN_PROBABILITY.map((p) => (
        <div key={p.name} className="flex items-center gap-3">
          <div className="w-28 text-xs text-foreground truncate flex-shrink-0">{p.name.split(" ")[0]}</div>
          <div className="flex-1 h-5 rounded-full bg-white/5 overflow-hidden relative">
            <div
              className="h-full rounded-full transition-all duration-700 flex items-center"
              style={{ width: `${p.prob}%`, backgroundColor: p.color + "90" }}
            />
            <span className="absolute inset-0 flex items-center px-2 text-[10px] font-bold" style={{ color: p.color }}>
              {p.prob}%
            </span>
          </div>
          <div className="flex-shrink-0 text-[10px] text-muted-foreground w-20 text-right">
            {p.days}d · {p.momentum}%
          </div>
        </div>
      ))}
      <p className="text-[10px] text-muted-foreground text-center pt-1">
        Probabilidad de churn · días inactivos · momentum actual
      </p>
    </div>
  )
}

function RevenueViz() {
  return (
    <ResponsiveContainer width="100%" height={180}>
      <ComposedChart data={REVENUE_CHART} margin={{ top: 5, right: 5, left: -15, bottom: 0 }}>
        <defs>
          <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#7C3AED" stopOpacity={0.8} />
            <stop offset="100%" stopColor="#7C3AED" stopOpacity={0.3} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
        <XAxis dataKey="mes" tick={{ fill: "#6B6B8A", fontSize: 10 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: "#6B6B8A", fontSize: 9 }} axisLine={false} tickLine={false}
          tickFormatter={(v) => `$${(v/1000).toFixed(0)}k`} />
        <RTooltip
          contentStyle={{ background: "#1A1A26", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontSize: 11 }}
          formatter={(v) => [`$${Number(v).toLocaleString()} MXN`, ""]}
        />
        <Bar dataKey="cobrado" fill="url(#barGrad)" radius={[4, 4, 0, 0]} name="Cobrado" />
        <Bar dataKey="pendiente" fill="rgba(234,179,8,0.3)" radius={[4, 4, 0, 0]} name="Pendiente" />
        <Line dataKey="proyeccion" stroke="#06b6d4" strokeWidth={2} strokeDasharray="5 5"
          dot={{ fill: "#06b6d4", r: 3 }} name="Proyección" />
      </ComposedChart>
    </ResponsiveContainer>
  )
}

function CoachRadar() {
  const COLORS = ["#7C3AED", "#06b6d4", "#10b981"]
  const dims = ["Momentum", "Sesiones", "Contacto", "Riesgo", "Misiones"]
  return (
    <div className="space-y-2">
      <ResponsiveContainer width="100%" height={200}>
        <RadarChart data={dims.map((d) => ({
          dim: d,
          Ana: COACH_RADAR[0][d as keyof typeof COACH_RADAR[0]] as number,
          Marco: COACH_RADAR[1][d as keyof typeof COACH_RADAR[1]] as number,
          Daniela: COACH_RADAR[2][d as keyof typeof COACH_RADAR[2]] as number,
        }))}>
          <PolarGrid stroke="rgba(255,255,255,0.08)" />
          <PolarAngleAxis dataKey="dim" tick={{ fill: "#6B6B8A", fontSize: 10 }} />
          <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
          {["Ana", "Marco", "Daniela"].map((c, i) => (
            <Radar key={c} name={c} dataKey={c} stroke={COLORS[i]} fill={COLORS[i]} fillOpacity={0.12} strokeWidth={2} />
          ))}
          <Legend iconType="circle" iconSize={8}
            formatter={(v) => <span style={{ fontSize: 11, color: "#A0A0B8" }}>{v}</span>} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  )
}

function CohortTrend() {
  return (
    <ResponsiveContainer width="100%" height={180}>
      <AreaChart data={COHORT_MOMENTUM} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
        <defs>
          {[["omegaG","#7C3AED"], ["norteG","#f97316"], ["via12G","#10b981"]].map(([id, color]) => (
            <linearGradient key={id} id={id} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.3} />
              <stop offset="95%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          ))}
        </defs>
        <XAxis dataKey="day" tick={{ fill: "#6B6B8A", fontSize: 9 }} tickLine={false} axisLine={false} interval={4} />
        <YAxis domain={[0, 100]} tick={{ fill: "#6B6B8A", fontSize: 9 }} tickLine={false} axisLine={false} />
        <RTooltip
          contentStyle={{ background: "#1A1A26", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontSize: 11 }}
          formatter={(v, name) => [`${v}%`, String(name)]}
        />
        <Area type="monotone" dataKey="Omega" stroke="#7C3AED" fill="url(#omegaG)" strokeWidth={2} />
        <Area type="monotone" dataKey="Norte" stroke="#f97316" fill="url(#norteG)" strokeWidth={2} />
        <Area type="monotone" dataKey="Via12" stroke="#10b981" fill="url(#via12G)" strokeWidth={2} />
        <Legend iconType="circle" iconSize={8}
          formatter={(v) => <span style={{ fontSize: 11, color: "#A0A0B8" }}>{v === "Via12" ? "Vía 12" : v}</span>} />
      </AreaChart>
    </ResponsiveContainer>
  )
}

function ScatterRiskMap() {
  const colorMap: Record<string, string> = { high: "#ef4444", medium: "#f97316", low: "#10b981" }
  return (
    <div className="space-y-2">
      <ResponsiveContainer width="100%" height={200}>
        <ScatterChart margin={{ top: 5, right: 10, left: -15, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
          <XAxis type="number" dataKey="x" name="Días inactivo" domain={[0, 15]}
            tick={{ fill: "#6B6B8A", fontSize: 9 }} label={{ value: "Días inactivo", position: "insideBottom", fill: "#6B6B8A", fontSize: 9, dy: 10 }} />
          <YAxis type="number" dataKey="y" name="Momentum" domain={[0, 100]}
            tick={{ fill: "#6B6B8A", fontSize: 9 }} label={{ value: "Momentum %", angle: -90, fill: "#6B6B8A", fontSize: 9, dx: -5 }} />
          <ZAxis type="number" dataKey="z" range={[30, 200]} />
          <RTooltip cursor={{ strokeDasharray: "3 3" }}
            contentStyle={{ background: "#1A1A26", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontSize: 11 }}
            content={({ payload }) => {
              if (!payload?.length) return null
              const d = payload[0].payload
              return (
                <div className="bg-[#1A1A26] border border-white/10 rounded-lg p-2.5 text-xs">
                  <p className="font-bold text-white">{d.name}</p>
                  <p className="text-muted-foreground">Momentum: {d.momentum}%</p>
                  <p className="text-muted-foreground">Inactivo: {d.days} días</p>
                  <p style={{ color: colorMap[d.risk] }} className="font-semibold capitalize">{d.risk === "high" ? "Alto riesgo" : d.risk === "medium" ? "Riesgo medio" : "Saludable"}</p>
                </div>
              )
            }}
          />
          <Scatter data={RISK_SCATTER} name="Participantes">
            {RISK_SCATTER.map((entry, i) => (
              <Cell key={i} fill={colorMap[entry.risk]} fillOpacity={0.75} />
            ))}
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>
      <div className="flex items-center justify-center gap-4 text-[10px] text-muted-foreground">
        {[["#ef4444","Alto riesgo"],["#f97316","Riesgo medio"],["10b981","Saludable"]].map(([c,l]) => (
          <span key={l} className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: c }} />
            {l}
          </span>
        ))}
      </div>
    </div>
  )
}

function ChartRenderer({ chart }: { chart: AIResponse["chart"] }) {
  if (chart === "kpis")   return <KPIsDashboard />
  if (chart === "churn")  return <ChurnChart />
  if (chart === "revenue") return <RevenueViz />
  if (chart === "radar")  return <CoachRadar />
  if (chart === "cohort") return <CohortTrend />
  if (chart === "scatter") return <ScatterRiskMap />
  return null
}

// ─── Main page ───────────────────────────────────────────────────────────────

export default function InteligenciaPage() {
  const [activeId, setActiveId]   = useState<QueryId | null>(null)
  const [thinking, setThinking]   = useState(false)
  const [response, setResponse]   = useState<AIResponse | null>(null)
  const [input, setInput]         = useState("")
  const [actionDone, setActionDone] = useState<Set<number>>(new Set())
  const responseRef = useRef<HTMLDivElement>(null)

  function runQuery(id: QueryId) {
    if (thinking) return
    setActiveId(id)
    setResponse(null)
    setActionDone(new Set())
    setThinking(true)
    setTimeout(() => {
      setThinking(false)
      setResponse(AI_RESPONSES[id])
      setTimeout(() => responseRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100)
    }, 1800)
  }

  function handleInput() {
    const q = input.trim().toLowerCase()
    if (!q) return
    const map: [string[], QueryId][] = [
      [["cancel","churn","abandon","pierde","baja","riesgo"], "riesgo"],
      [["ingreso","revenue","dinero","cobr","pago","finanz"], "revenue"],
      [["coach","equipo","staff","ana","marco","daniela"],    "coaches"],
      [["generaci","cohorte","norte","omega","vía","v12"],    "cohortes"],
    ]
    const match = map.find(([kws]) => kws.some((k) => q.includes(k)))
    runQuery(match ? match[1] : "resumen")
    setInput("")
  }

  const alertColors = {
    red:    "bg-red-500/10 border-red-500/30 text-red-400",
    yellow: "bg-yellow-500/10 border-yellow-500/30 text-yellow-400",
    green:  "bg-green-500/10 border-green-500/30 text-green-400",
  }

  return (
    <div className="p-5 max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center">
          <Brain className="w-5 h-5 text-violet-400" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white">Inteligencia Artificial</h1>
          <p className="text-xs text-muted-foreground">Análisis en tiempo real · LEVEL CDMX</p>
        </div>
        <div className="ml-auto flex items-center gap-1.5 text-xs text-green-400 font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          Analizando datos
        </div>
      </div>

      {/* Query input */}
      <div className="glass rounded-xl p-4 space-y-3">
        <p className="text-xs text-muted-foreground font-medium">¿Qué quieres saber sobre tu centro?</p>
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleInput()}
            placeholder="Ej: ¿Qué participantes van a cancelar este mes?"
            className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-muted-foreground focus:outline-none focus:border-violet-500/50 transition-colors"
          />
          <button
            onClick={handleInput}
            disabled={!input.trim() || thinking}
            className="px-3 py-2.5 rounded-lg bg-violet-600 hover:bg-violet-700 disabled:opacity-40 text-white transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>

        {/* Suggested queries */}
        <div className="flex flex-wrap gap-2">
          {SUGGESTED_QUERIES.map((q) => (
            <button
              key={q.id}
              onClick={() => runQuery(q.id as QueryId)}
              disabled={thinking}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all",
                activeId === q.id
                  ? "bg-violet-600/20 border-violet-500/50 text-violet-300"
                  : "bg-white/5 border-white/10 text-muted-foreground hover:text-foreground hover:border-white/20"
              )}
            >
              <span>{q.icon}</span>
              {q.label}
            </button>
          ))}
        </div>
      </div>

      {/* Thinking state */}
      {thinking && (
        <div className="glass rounded-xl p-5 flex items-center gap-4">
          <div className="w-8 h-8 rounded-lg bg-violet-600/20 flex items-center justify-center">
            <Brain className="w-4 h-4 text-violet-400 animate-pulse" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-white font-medium">Analizando datos del centro...</p>
            <p className="text-xs text-muted-foreground mt-0.5">Cruzando momentum, pagos, actividad y cohortes</p>
          </div>
          <div className="flex gap-1">
            {[0,1,2].map((i) => (
              <span key={i} className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-bounce"
                style={{ animationDelay: `${i * 150}ms` }} />
            ))}
          </div>
        </div>
      )}

      {/* AI Response */}
      {response && !thinking && (
        <div ref={responseRef} className="space-y-4">
          {/* Headline + alert */}
          <div className="glass rounded-xl p-5 space-y-3">
            <div className="flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-violet-400 flex-shrink-0 mt-0.5" />
              <h2 className="font-bold text-white text-sm leading-snug">{response.headline}</h2>
            </div>
            {response.alert && (
              <div className={cn("flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-semibold", alertColors[response.alert.level])}>
                {response.alert.text}
              </div>
            )}
            <p className="text-sm text-muted-foreground leading-relaxed">{response.summary}</p>
          </div>

          {/* Chart */}
          <div className="glass rounded-xl p-5">
            <p className="text-xs text-muted-foreground uppercase tracking-widest font-medium mb-4">Visualización</p>
            <ChartRenderer chart={response.chart} />
          </div>

          {/* Insights */}
          <div className="glass rounded-xl p-5 space-y-3">
            <p className="text-xs text-muted-foreground uppercase tracking-widest font-medium">Insights detectados</p>
            <div className="space-y-2">
              {response.insights.map((insight, i) => (
                <div key={i} className="flex items-start gap-2.5 p-2.5 rounded-lg hover:bg-white/3 transition-colors">
                  <div className={cn(
                    "w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0",
                    i === 0 ? "bg-red-400" : i === 1 ? "bg-orange-400" : i === 2 ? "bg-yellow-400" : "bg-muted-foreground"
                  )} />
                  <p className="text-sm text-foreground leading-relaxed">{insight}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Recommended actions */}
          <div className="glass-violet rounded-xl p-5 space-y-3">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-violet-400" />
              <p className="text-xs text-muted-foreground uppercase tracking-widest font-medium">Acciones recomendadas</p>
            </div>
            <div className="space-y-2">
              {response.actions.map((action, i) => (
                <div key={i} className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-white/5 transition-colors">
                  <button
                    onClick={() => setActionDone((prev) => { const n = new Set(prev); n.has(i) ? n.delete(i) : n.add(i); return n })}
                    className={cn(
                      "w-5 h-5 rounded border flex items-center justify-center flex-shrink-0 transition-colors",
                      actionDone.has(i) ? "border-green-500 bg-green-500/20" : "border-border"
                    )}
                  >
                    {actionDone.has(i) && <CheckCircle className="w-3 h-3 text-green-400" />}
                  </button>
                  <p className={cn("text-sm flex-1 leading-snug", actionDone.has(i) && "line-through text-muted-foreground")}>
                    {action}
                  </p>
                  <ChevronRight className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                </div>
              ))}
            </div>
          </div>

          {/* New query prompt */}
          <button
            onClick={() => { setActiveId(null); setResponse(null); setInput(""); window.scrollTo({ top: 0, behavior: "smooth" }) }}
            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl glass border border-white/10 hover:border-violet-500/30 text-sm font-medium text-muted-foreground hover:text-white transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            Hacer otra pregunta
          </button>
        </div>
      )}

      {/* Empty state */}
      {!thinking && !response && (
        <div className="glass rounded-xl p-8 text-center space-y-3">
          <Brain className="w-10 h-10 text-violet-400/40 mx-auto" />
          <p className="text-sm text-muted-foreground">Haz una pregunta o selecciona una sugerencia arriba</p>
          <p className="text-xs text-muted-foreground/60">El análisis cruza momentum, pagos, actividad y cohortes en tiempo real</p>
        </div>
      )}
    </div>
  )
}
