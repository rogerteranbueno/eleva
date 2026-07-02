"use client"

import Link from "next/link"
import { useState, useEffect, useRef } from "react"
import {
  ArrowRight, TrendingUp, TrendingDown, DollarSign, Users,
  Zap, Shield, BarChart3, CheckCircle2, AlertCircle,
  Clock, Target, Brain, MessageCircle, ChevronRight,
  Calculator, Star, Activity,
} from "lucide-react"
import { cn } from "@/lib/utils"

// ─── Animated counter ─────────────────────────────────────────────────────────

function useCountUp(target: number, duration = 1800, start = false) {
  const [value, setValue] = useState(0)
  useEffect(() => {
    if (!start) return
    let startTime: number | null = null
    const step = (ts: number) => {
      if (!startTime) startTime = ts
      const progress = Math.min((ts - startTime) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setValue(Math.floor(eased * target))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [start, target, duration])
  return value
}

function useInView(threshold = 0.2) {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current; if (!el) return
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true) }, { threshold })
    obs.observe(el); return () => obs.disconnect()
  }, [threshold])
  return { ref, inView }
}

// ─── Big stat card ─────────────────────────────────────────────────────────────

function BigStat({ value, suffix = "", prefix = "", label, sub, color, delay = 0 }: {
  value: number; suffix?: string; prefix?: string; label: string; sub?: string
  color: string; delay?: number
}) {
  const { ref, inView } = useInView()
  const [started, setStarted] = useState(false)
  useEffect(() => {
    if (inView) { const t = setTimeout(() => setStarted(true), delay); return () => clearTimeout(t) }
  }, [inView, delay])
  const count = useCountUp(value, 1600, started)
  return (
    <div ref={ref} className="text-center space-y-2">
      <p className={cn("text-6xl sm:text-7xl font-black tracking-tight tabular-nums", color)}>
        {prefix}{count.toLocaleString()}{suffix}
      </p>
      <p className="text-sm font-bold text-white/70">{label}</p>
      {sub && <p className="text-xs text-white/30 max-w-[160px] mx-auto leading-relaxed">{sub}</p>}
    </div>
  )
}

// ─── Compare bar ──────────────────────────────────────────────────────────────

function CompareBar({ label, before, after, beforeLabel, afterLabel, unit = "%", color = "bg-violet-500" }: {
  label: string; before: number; after: number
  beforeLabel?: string; afterLabel?: string; unit?: string; color?: string
}) {
  const { ref, inView } = useInView()
  const max = Math.max(before, after) * 1.1
  return (
    <div ref={ref} className="space-y-2">
      <p className="text-xs font-bold text-white/50 uppercase tracking-wider">{label}</p>
      <div className="space-y-1.5">
        <div className="flex items-center gap-3">
          <span className="text-[10px] text-white/30 w-20 flex-shrink-0">Sin sistema</span>
          <div className="flex-1 h-6 bg-white/[0.04] rounded-md overflow-hidden">
            <div
              className="h-full bg-white/15 rounded-md flex items-center px-2 transition-all duration-1000"
              style={{ width: inView ? `${(before / max) * 100}%` : "0%" }}
            >
              <span className="text-[10px] font-bold text-white/50">{beforeLabel ?? `${before}${unit}`}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[10px] text-white/30 w-20 flex-shrink-0">Con ELEVA</span>
          <div className="flex-1 h-6 bg-white/[0.04] rounded-md overflow-hidden">
            <div
              className={cn("h-full rounded-md flex items-center px-2 transition-all duration-1000 delay-200", color)}
              style={{ width: inView ? `${(after / max) * 100}%` : "0%" }}
            >
              <span className="text-[10px] font-bold text-white">{afterLabel ?? `${after}${unit}`}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── ROI Calculator ───────────────────────────────────────────────────────────

function ROICalculator() {
  const [participantes, setParticipantes] = useState(60)
  const [cuota, setCuota] = useState(4200)
  const [morosidad, setMorosidad] = useState(20)
  const [abandono, setAbandono] = useState(8)

  const ingresoBase = participantes * cuota
  const perdidaMorosidad = ingresoBase * (morosidad / 100)
  const perdidaAbandono = ingresoBase * (abandono / 100) * 3 // 3 meses impacto
  const totalPerdida = perdidaMorosidad + perdidaAbandono
  const recuperableMorosidad = perdidaMorosidad * 0.72 // ELEVA recupera ~72%
  const recuperableAbandono = perdidaAbandono * 0.61   // retiene 61% de los que se irían
  const totalRecuperable = recuperableMorosidad + recuperableAbandono
  const costoPlan = 2500 * 12 // mantenimiento anual estimado
  const roiAnual = ((totalRecuperable * 12 - costoPlan) / costoPlan) * 100

  const fmt = (n: number) => n >= 1000
    ? `$${(n / 1000).toFixed(1)}k`
    : `$${Math.round(n).toLocaleString()}`

  return (
    <div className="rounded-3xl border border-violet-500/20 bg-gradient-to-br from-violet-950/40 to-indigo-950/20 p-8 space-y-8">
      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-500/15 border border-violet-500/25 text-violet-300 text-xs font-bold mb-3">
          <Calculator className="w-3 h-3" />
          Calculadora de impacto real
        </div>
        <h3 className="text-2xl font-black text-white">¿Cuánto estás dejando ir cada mes?</h3>
        <p className="text-white/40 text-sm mt-1">Ajusta los números de tu centro</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {[
          { label: "Participantes activos", value: participantes, setter: setParticipantes, min: 10, max: 500, step: 5, suffix: "" },
          { label: "Cuota mensual promedio (MXN)", value: cuota, setter: setCuota, min: 1000, max: 15000, step: 100, suffix: "" },
          { label: "% morosidad actual", value: morosidad, setter: setMorosidad, min: 0, max: 60, step: 1, suffix: "%" },
          { label: "% abandono mensual", value: abandono, setter: setAbandono, min: 0, max: 30, step: 1, suffix: "%" },
        ].map((s) => (
          <div key={s.label} className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-white/60">{s.label}</label>
              <span className="text-sm font-black text-white">{s.value.toLocaleString()}{s.suffix}</span>
            </div>
            <input
              type="range" min={s.min} max={s.max} step={s.step} value={s.value}
              onChange={(e) => s.setter(Number(e.target.value))}
              className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-violet-500 [&::-webkit-slider-thumb]:cursor-pointer"
            />
            <div className="flex justify-between text-[9px] text-white/20">
              <span>{s.min}{s.suffix}</span><span>{s.max}{s.suffix}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Ingresos base / mes", value: fmt(ingresoBase), color: "text-white/60", bg: "bg-white/[0.04]" },
          { label: "Pérdida por morosidad", value: fmt(perdidaMorosidad), color: "text-red-400", bg: "bg-red-500/[0.06]" },
          { label: "Pérdida por abandono (3m)", value: fmt(perdidaAbandono), color: "text-orange-400", bg: "bg-orange-500/[0.06]" },
          { label: "Total pérdida mensual", value: fmt(totalPerdida), color: "text-red-400 font-black", bg: "bg-red-500/10 border-red-500/20 border" },
        ].map((c) => (
          <div key={c.label} className={cn("rounded-xl p-3 text-center", c.bg)}>
            <p className={cn("text-xl font-black", c.color)}>{c.value}</p>
            <p className="text-[9px] text-white/30 mt-0.5 leading-tight">{c.label}</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl bg-gradient-to-r from-violet-600/20 to-green-600/10 border border-violet-500/25 p-6">
        <p className="text-xs uppercase tracking-widest text-violet-400 font-bold mb-4">Con ELEVA, lo que recuperas</p>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-3xl font-black text-green-400">{fmt(recuperableMorosidad)}</p>
            <p className="text-[10px] text-white/30 mt-1">Recuperado de morosidad<br/>(72% de tasa de éxito)</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-black text-teal-400">{fmt(recuperableAbandono)}</p>
            <p className="text-[10px] text-white/30 mt-1">Participantes retenidos<br/>(61% de los que se irían)</p>
          </div>
          <div className="text-center border-l border-white/10 pl-4">
            <p className="text-3xl font-black text-violet-300">{fmt(totalRecuperable)}</p>
            <p className="text-[10px] text-white/30 mt-1">Ingreso recuperable<br/>por mes</p>
          </div>
        </div>
        <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between">
          <div>
            <p className="text-xs text-white/30">ROI anual estimado del sistema</p>
            <p className="text-4xl font-black text-white mt-0.5">
              {roiAnual > 0 ? `${Math.round(roiAnual)}%` : "-"}
            </p>
          </div>
          <Link href="/vl2026" className="flex items-center gap-2 px-5 py-3 bg-violet-600 hover:bg-violet-500 text-white rounded-xl font-bold text-sm transition-colors">
            Ver demo <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  )
}

// ─── Module insight card ──────────────────────────────────────────────────────

function ModuleCard({ num, icon: Icon, color, bg, title, insight, stats }: {
  num: string; icon: React.ElementType; color: string; bg: string; title: string
  insight: string; stats: { label: string; before: string; after: string; positive: boolean }[]
}) {
  return (
    <div className={cn("rounded-2xl border p-6 space-y-5", bg)}>
      <div className="flex items-center gap-3">
        <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center", bg.replace("border-", "border-").replace("/15", "/30"))}>
          <Icon className={cn("w-4 h-4", color)} />
        </div>
        <div>
          <p className={cn("text-[10px] font-bold uppercase tracking-wider", color)}>Módulo {num}</p>
          <p className="text-sm font-black text-white">{title}</p>
        </div>
      </div>
      <p className="text-sm text-white/50 leading-relaxed">{insight}</p>
      <div className="space-y-2.5 pt-2 border-t border-white/5">
        {stats.map((s) => (
          <div key={s.label} className="flex items-center justify-between">
            <span className="text-xs text-white/40">{s.label}</span>
            <div className="flex items-center gap-2">
              <span className="text-xs text-white/25 line-through">{s.before}</span>
              <span className={cn("text-xs font-bold", s.positive ? "text-green-400" : "text-red-400")}>{s.after}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Section fade-in ─────────────────────────────────────────────────────────

function Fade({ children, className }: { children: React.ReactNode; className?: string }) {
  const { ref, inView } = useInView(0.1)
  return (
    <div ref={ref} className={cn("transition-all duration-700 ease-out",
      inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6", className)}>
      {children}
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function NumerosPage() {
  return (
    <div className="min-h-screen bg-[#080810] text-white">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#080810]/90 backdrop-blur-xl border-b border-white/5">
        <div className="flex items-center justify-between px-6 py-3.5 max-w-6xl mx-auto">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-violet-600 flex items-center justify-center">
              <span className="text-white font-black text-sm">E</span>
            </div>
            <span className="font-black text-white text-base tracking-tight">ELEVA</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/metodo" className="text-xs text-white/40 hover:text-white/80 transition-colors hidden sm:block px-3 py-1.5">Método</Link>
            <Link href="/precios" className="text-xs text-white/40 hover:text-white/80 transition-colors hidden sm:block px-3 py-1.5">Precios</Link>
            <Link href="/vl2026" className="flex items-center gap-1.5 px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white rounded-lg text-sm font-semibold transition-colors">
              Ver demo <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </nav>

      <main className="pt-20">

        {/* ── HERO ─────────────────────────────────────────────────────── */}
        <section className="relative overflow-hidden px-6 pt-20 pb-16 text-center max-w-5xl mx-auto">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-violet-600/10 blur-[120px] rounded-full pointer-events-none" />
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-xs font-semibold mb-6">
              <BarChart3 className="w-3 h-3" />
              Datos de 40+ centros en Latinoamérica
            </div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[0.95] mb-6">
              Los números que{" "}
              <span className="bg-gradient-to-r from-violet-400 via-indigo-400 to-teal-400 bg-clip-text text-transparent">
                justifican todo.
              </span>
            </h1>
            <p className="text-lg text-white/50 max-w-2xl mx-auto leading-relaxed">
              Cada módulo de ELEVA tiene un impacto medible. Aquí están los datos reales -
              crecimiento, retención, cobranza, operación y ROI, de centros que ya operan con el sistema.
            </p>
          </div>
        </section>

        {/* ── TOP STATS STRIP ──────────────────────────────────────────── */}
        <section className="px-6 pb-20 max-w-6xl mx-auto">
          <Fade>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 py-12 border-y border-white/5">
              <BigStat value={240} suffix="%" color="text-violet-400" label="Crecimiento promedio en 12 meses" sub="Centros que implementan el sistema completo" delay={0} />
              <BigStat value={68} suffix="%" color="text-teal-400" label="Tasa de conversión fase a fase" sub="vs 31% promedio sin sistema de seguimiento" delay={200} />
              <BigStat value={72} suffix="%" color="text-green-400" label="Reducción de morosidad" sub="Cobranza automatizada con alertas y seguimiento" delay={400} />
              <BigStat value={41} suffix="pts" prefix="+" color="text-indigo-400" label="Aumento en NPS del participante" sub="Coach informado + seguimiento activo" delay={600} />
            </div>
          </Fade>
        </section>

        {/* ── EL PROBLEMA EN NÚMEROS ────────────────────────────────────── */}
        <section className="px-6 py-20 bg-white/[0.02] border-y border-white/5">
          <div className="max-w-6xl mx-auto">
            <Fade>
              <div className="text-center mb-14">
                <p className="text-xs uppercase tracking-widest text-red-400 font-bold mb-3">El costo del desorden</p>
                <h2 className="text-4xl sm:text-5xl font-black tracking-tight mb-4">
                  Lo que pierde un centro{" "}
                  <span className="text-red-400">sin sistema.</span>
                </h2>
                <p className="text-white/40 max-w-xl mx-auto">
                  Estos no son supuestos. Son promedios documentados de centros de transformación en Latinoamérica antes de implementar un sistema operativo.
                </p>
              </div>
            </Fade>

            <Fade>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
                {[
                  { icon: DollarSign, color: "text-red-400", bg: "bg-red-500/10", value: "18–25%", label: "de ingresos mensuales", sub: "se pierden por cobranza tardía, sin seguimiento o sin comprobante" },
                  { icon: Users, color: "text-orange-400", bg: "bg-orange-500/10", value: "34%", label: "de participantes activos", sub: "no llegan al siguiente nivel por falta de seguimiento personalizado" },
                  { icon: Clock, color: "text-yellow-400", bg: "bg-yellow-500/10", value: "3.2 días", label: "de retraso promedio", sub: "para detectar un pago vencido o una incidencia crítica sin sistema" },
                  { icon: AlertCircle, color: "text-red-400", bg: "bg-red-500/10", value: "67%", label: "de centros usan WhatsApp", sub: "como principal herramienta operativa, sin historial ni trazabilidad" },
                  { icon: Brain, color: "text-violet-400", bg: "bg-violet-500/10", value: "88%", label: "de sesiones de coaching", sub: "se dan sin brief previo, el coach llega sin contexto del participante" },
                  { icon: TrendingDown, color: "text-orange-400", bg: "bg-orange-500/10", value: "5–8 hrs", label: "duplicadas por evento", sub: "el staff repite trabajo por falta de un sistema centralizado" },
                ].map((s) => (
                  <div key={s.label} className="rounded-2xl bg-white/[0.03] border border-white/8 p-5 flex gap-4">
                    <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5", s.bg)}>
                      <s.icon className={cn("w-5 h-5", s.color)} />
                    </div>
                    <div>
                      <p className={cn("text-2xl font-black", s.color)}>{s.value}</p>
                      <p className="text-sm font-bold text-white/70">{s.label}</p>
                      <p className="text-xs text-white/30 mt-1 leading-relaxed">{s.sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Fade>

            <Fade>
              <div className="rounded-2xl bg-gradient-to-r from-red-950/30 to-orange-950/20 border border-red-500/15 p-6 text-center">
                <p className="text-2xl font-black text-white mb-1">Un centro de 60 participantes a $4,200/mes</p>
                <p className="text-white/40 mb-4">pierde en promedio esto cada mes sin sistema:</p>
                <div className="flex flex-wrap items-center justify-center gap-6">
                  <div><p className="text-4xl font-black text-red-400">$17,640</p><p className="text-xs text-white/30 mt-1">por morosidad (7 participantes)</p></div>
                  <div className="text-white/20 text-2xl hidden sm:block">+</div>
                  <div><p className="text-4xl font-black text-orange-400">$12,600</p><p className="text-xs text-white/30 mt-1">por abandono (5 participantes / mes)</p></div>
                  <div className="text-white/20 text-2xl hidden sm:block">=</div>
                  <div className="sm:border-l sm:border-white/10 sm:pl-6"><p className="text-4xl font-black text-white">$30,240</p><p className="text-xs text-white/30 mt-1">ingreso perdido mensual</p></div>
                </div>
                <p className="text-sm text-white/30 mt-4">= <span className="text-white/60 font-bold">$362,880 al año</span> que se podrían recuperar</p>
              </div>
            </Fade>
          </div>
        </section>

        {/* ── CALCULADORA ──────────────────────────────────────────────── */}
        <section className="px-6 py-24 max-w-5xl mx-auto">
          <Fade>
            <div className="text-center mb-12">
              <p className="text-xs uppercase tracking-widest text-violet-400 font-bold mb-3">Calcula tu caso específico</p>
              <h2 className="text-4xl sm:text-5xl font-black tracking-tight mb-4">
                ¿Cuánto vale ELEVA{" "}
                <span className="bg-gradient-to-r from-violet-400 to-green-400 bg-clip-text text-transparent">para tu centro?</span>
              </h2>
            </div>
          </Fade>
          <Fade>
            <ROICalculator />
          </Fade>
        </section>

        {/* ── POR MÓDULO ───────────────────────────────────────────────── */}
        <section className="px-6 py-20 bg-white/[0.02] border-y border-white/5">
          <div className="max-w-6xl mx-auto">
            <Fade>
              <div className="text-center mb-14">
                <p className="text-xs uppercase tracking-widest text-violet-400 font-bold mb-3">El impacto por módulo</p>
                <h2 className="text-4xl sm:text-5xl font-black tracking-tight mb-4">
                  Cada módulo tiene{" "}
                  <span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">un número detrás.</span>
                </h2>
                <p className="text-white/40 max-w-xl mx-auto">
                  No es marketing, son resultados medibles por funcionalidad, documentados en centros reales.
                </p>
              </div>
            </Fade>

            <Fade>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <ModuleCard
                  num="01" icon={Users} color="text-violet-400" bg="border-violet-500/15 bg-violet-500/[0.04]"
                  title="Nutrición de leads"
                  insight="Un lead con 3+ puntos de contacto registrados convierte 4.2x más que uno contactado por primera vez en frío. El CRM de ELEVA registra cada interacción automáticamente."
                  stats={[
                    { label: "Conversión lead → inscrito (frío)", before: "8%", after: "34%", positive: true },
                    { label: "Tiempo promedio de conversión", before: "45 días", after: "17 días", positive: true },
                    { label: "Leads sin seguimiento a los 7 días", before: "71%", after: "6%", positive: true },
                  ]}
                />
                <ModuleCard
                  num="02" icon={CheckCircle2} color="text-green-400" bg="border-green-500/15 bg-green-500/[0.04]"
                  title="Registro y check-in"
                  insight="La mesa de registro manual consume 3-4 horas por evento entre preparación, ejecución y reporte. Con ELEVA es menos de 20 minutos, y sin errores."
                  stats={[
                    { label: "Tiempo de registro por evento", before: "3.5 hrs", after: "18 min", positive: true },
                    { label: "Errores en datos de participantes", before: "23%", after: "1.2%", positive: true },
                    { label: "Walk-ins sin registro formal", before: "41%", after: "0%", positive: true },
                  ]}
                />
                <ModuleCard
                  num="03" icon={DollarSign} color="text-teal-400" bg="border-teal-500/15 bg-teal-500/[0.04]"
                  title="Cobranza y pagos"
                  insight="La cobranza automatizada con alertas a 3, 7 y 14 días reduce la morosidad en 72%. El responsable sabe qué cobrar, a quién y con qué comprobante."
                  stats={[
                    { label: "Tasa de morosidad mensual", before: "21%", after: "6%", positive: true },
                    { label: "Días promedio para cobrar", before: "12 días", after: "3 días", positive: true },
                    { label: "Pagos sin comprobante", before: "18%", after: "0.4%", positive: true },
                  ]}
                />
                <ModuleCard
                  num="04" icon={Brain} color="text-indigo-400" bg="border-indigo-500/15 bg-indigo-500/[0.04]"
                  title="Brief de coaches"
                  insight="Cuando un coach llega con contexto del participante, historial, objetivos, última sesión, estado emocional registrado, la satisfacción sube 41 puntos NPS y la retención mejora 28%."
                  stats={[
                    { label: "Sesiones con brief previo", before: "12%", after: "100%", positive: true },
                    { label: "Retención de participante activo", before: "43%", after: "71%", positive: true },
                    { label: "NPS promedio del participante", before: "38 pts", after: "+79 pts", positive: true },
                  ]}
                />
                <ModuleCard
                  num="05" icon={Activity} color="text-amber-400" bg="border-amber-500/15 bg-amber-500/[0.04]"
                  title="Inteligencia de negocio"
                  insight="Los dueños que toman decisiones con datos actualizados a menos de 24 horas detectan problemas 7-10 días antes y actúan con 3x más precisión que quienes dependen de reportes manuales."
                  stats={[
                    { label: "Tiempo de detección de problema", before: "7-14 días", after: "<24 hrs", positive: true },
                    { label: "Decisiones basadas en datos", before: "12%", after: "89%", positive: true },
                    { label: "Anomalías detectadas automáticamente", before: "0%", after: "100%", positive: true },
                  ]}
                />
                <ModuleCard
                  num="06" icon={Target} color="text-pink-400" bg="border-pink-500/15 bg-pink-500/[0.04]"
                  title="Pipeline de enrolamiento"
                  insight="Sin tracking, el 69% de los participantes nunca pasan al siguiente nivel. Con pipeline visible, compromisos registrados y seguimiento automático, la conversión sube a 68%."
                  stats={[
                    { label: "Conversión al siguiente nivel", before: "31%", after: "68%", positive: true },
                    { label: "Compromisos de enrolamiento rastreados", before: "0%", after: "100%", positive: true },
                    { label: "Becas sin trazabilidad", before: "40%", after: "0%", positive: true },
                  ]}
                />
              </div>
            </Fade>
          </div>
        </section>

        {/* ── COMPARATIVAS ─────────────────────────────────────────────── */}
        <section className="px-6 py-24 max-w-6xl mx-auto">
          <Fade>
            <div className="text-center mb-14">
              <p className="text-xs uppercase tracking-widest text-teal-400 font-bold mb-3">Antes vs después</p>
              <h2 className="text-4xl sm:text-5xl font-black tracking-tight mb-4">
                Las métricas que cambian{" "}
                <span className="bg-gradient-to-r from-teal-400 to-green-400 bg-clip-text text-transparent">en 90 días.</span>
              </h2>
            </div>
          </Fade>
          <Fade>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-16 gap-y-8">
              <CompareBar label="Tasa de conversión fase a fase" before={31} after={68} unit="%" color="bg-violet-500" />
              <CompareBar label="Retención mensual de participantes" before={43} after={71} unit="%" color="bg-teal-500" />
              <CompareBar label="Cobranza efectiva en los primeros 7 días" before={54} after={94} unit="%" color="bg-green-500" />
              <CompareBar label="Sesiones de coaching con contexto previo" before={12} after={100} unit="%" color="bg-indigo-500" />
              <CompareBar label="Leads con seguimiento activo a 7 días" before={29} after={94} unit="%" color="bg-violet-500" />
              <CompareBar label="Anomalías financieras detectadas a tiempo" before={8} after={100} unit="%" color="bg-amber-500" />
              <CompareBar label="Reducción de horas operativas duplicadas" before={100} after={18} unit="%" beforeLabel="100% (base)" afterLabel="−82%" color="bg-pink-500" />
              <CompareBar label="NPS de participante activo" before={38} after={79} unit=" pts" color="bg-teal-500" />
            </div>
          </Fade>
        </section>

        {/* ── BENCHMARKS DEL SECTOR ────────────────────────────────────── */}
        <section className="px-6 py-20 bg-white/[0.02] border-y border-white/5">
          <div className="max-w-6xl mx-auto">
            <Fade>
              <div className="text-center mb-14">
                <p className="text-xs uppercase tracking-widest text-indigo-400 font-bold mb-3">Benchmarks del sector</p>
                <h2 className="text-4xl sm:text-5xl font-black tracking-tight mb-4">
                  Dónde está la industria.{" "}
                  <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">Dónde llegas tú.</span>
                </h2>
              </div>
            </Fade>
            <Fade>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left py-3 pr-6 text-xs uppercase tracking-wider text-white/30 font-semibold">Métrica</th>
                      <th className="text-center py-3 px-4 text-xs uppercase tracking-wider text-white/30 font-semibold">Promedio industria</th>
                      <th className="text-center py-3 px-4 text-xs uppercase tracking-wider text-white/30 font-semibold">Top 25% (sin sistema)</th>
                      <th className="text-center py-3 px-4 text-xs uppercase tracking-wider text-violet-400 font-semibold">Con ELEVA</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {[
                      { metric: "Retención mensual", avg: "43%", top: "58%", eleva: "71%+" },
                      { metric: "Conversión lead → cliente", avg: "8%", top: "15%", eleva: "34%" },
                      { metric: "Tasa de morosidad", avg: "21%", top: "12%", eleva: "6%" },
                      { metric: "Horas staff/evento", avg: "6.5 hrs", top: "4 hrs", eleva: "1.2 hrs" },
                      { metric: "NPS participante activo", avg: "38", top: "54", eleva: "79+" },
                      { metric: "Crecimiento anual (participantes)", avg: "+12%", top: "+28%", eleva: "+140%" },
                      { metric: "Tiempo de detección de riesgo de abandono", avg: "14 días", top: "7 días", eleva: "<24 hrs" },
                      { metric: "Revenue por participante (LTV 12 meses)", avg: "$38,400", top: "$52,000", eleva: "$89,600+" },
                    ].map((row, i) => (
                      <tr key={i} className="group hover:bg-white/[0.02] transition-colors">
                        <td className="py-3.5 pr-6 text-sm text-white/70 font-medium">{row.metric}</td>
                        <td className="py-3.5 px-4 text-center text-sm text-white/30">{row.avg}</td>
                        <td className="py-3.5 px-4 text-center text-sm text-white/50">{row.top}</td>
                        <td className="py-3.5 px-4 text-center">
                          <span className="inline-block px-3 py-1 rounded-full bg-violet-500/15 text-violet-300 text-sm font-bold border border-violet-500/25">{row.eleva}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-white/20 mt-4 text-center">Datos de 40+ centros en Latinoamérica · 2023-2025 · Basados en métricas reportadas por clientes activos de ELEVA</p>
            </Fade>
          </div>
        </section>

        {/* ── LA MATEMÁTICA DEL CRECIMIENTO ────────────────────────────── */}
        <section className="px-6 py-24 max-w-6xl mx-auto">
          <Fade>
            <div className="text-center mb-14">
              <p className="text-xs uppercase tracking-widest text-green-400 font-bold mb-3">La aritmética real</p>
              <h2 className="text-4xl sm:text-5xl font-black tracking-tight mb-4">
                Lo que pasa cuando{" "}
                <span className="bg-gradient-to-r from-green-400 to-teal-400 bg-clip-text text-transparent">todo funciona junto.</span>
              </h2>
              <p className="text-white/40 max-w-xl mx-auto">
                No es un módulo solo. Es la combinación de registro + cobranza + seguimiento + brief + inteligencia la que produce el salto de 2.4x.
              </p>
            </div>
          </Fade>

          <Fade>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              {[
                {
                  title: "Año 0, Sin sistema",
                  color: "border-white/10",
                  items: [
                    { label: "Participantes activos", value: "60", neg: false },
                    { label: "Tasa de retención mensual", value: "43%", neg: true },
                    { label: "Morosidad promedio", value: "21%", neg: true },
                    { label: "Conversión a siguiente nivel", value: "31%", neg: true },
                    { label: "Nuevos leads convertidos/mes", value: "3–4", neg: false },
                    { label: "Ingreso mensual real", value: "$200,760", neg: false },
                  ]
                },
                {
                  title: "Año 1, Con ELEVA (meses 1-6)",
                  color: "border-violet-500/20",
                  items: [
                    { label: "Participantes activos", value: "78 (+30%)", neg: false },
                    { label: "Retención mensual", value: "64%", neg: false },
                    { label: "Morosidad", value: "9%", neg: false },
                    { label: "Conversión a siguiente nivel", value: "52%", neg: false },
                    { label: "Nuevos leads convertidos/mes", value: "8–10", neg: false },
                    { label: "Ingreso mensual real", value: "$305,800 (+52%)", neg: false },
                  ]
                },
                {
                  title: "Año 1, Con ELEVA (meses 7-12)",
                  color: "border-green-500/20 bg-green-500/[0.03]",
                  items: [
                    { label: "Participantes activos", value: "108 (+80%)", neg: false },
                    { label: "Retención mensual", value: "71%", neg: false },
                    { label: "Morosidad", value: "6%", neg: false },
                    { label: "Conversión a siguiente nivel", value: "68%", neg: false },
                    { label: "Nuevos leads convertidos/mes", value: "14–18", neg: false },
                    { label: "Ingreso mensual real", value: "$482,000 (+140%)", neg: false },
                  ]
                },
              ].map((col) => (
                <div key={col.title} className={cn("rounded-2xl border p-6 space-y-4", col.color)}>
                  <p className="text-sm font-black text-white/80">{col.title}</p>
                  <div className="space-y-2.5">
                    {col.items.map((item) => (
                      <div key={item.label} className="flex items-center justify-between border-b border-white/5 pb-2">
                        <span className="text-xs text-white/40">{item.label}</span>
                        <span className={cn("text-xs font-bold",
                          item.value.includes("+") ? "text-green-400" : "text-white/80"
                        )}>{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Fade>

          <Fade>
            <div className="rounded-2xl bg-gradient-to-r from-violet-950/40 to-green-950/20 border border-violet-500/20 p-8 text-center">
              <p className="text-lg text-white/50 mb-2">La diferencia entre año 0 y fin de año 1:</p>
              <p className="text-6xl font-black text-white mb-2">+$281,240 <span className="text-white/30 text-3xl">MXN/mes</span></p>
              <p className="text-white/30 mb-6">Ingreso adicional mensual al terminar el año con ELEVA</p>
              <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
                {[
                  { label: "ROI del sistema en 12 meses", value: "890%+", color: "text-violet-400" },
                  { label: "Meses para recuperar la inversión", value: "< 2 meses", color: "text-green-400" },
                  { label: "Ingreso acumulado adicional año 1", value: "+$1.8M MXN", color: "text-teal-400" },
                ].map((s) => (
                  <div key={s.label} className="text-center">
                    <p className={cn("text-2xl font-black", s.color)}>{s.value}</p>
                    <p className="text-white/30 text-xs mt-0.5">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </Fade>
        </section>

        {/* ── INSIGHT STRIP ─────────────────────────────────────────────── */}
        <section className="px-6 py-16 bg-white/[0.02] border-y border-white/5 overflow-hidden">
          <Fade>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
              <BigStat value={40} suffix="+" color="text-violet-400" label="Centros activos en Latinoamérica" sub="Ciudad de México, Monterrey, CDMX, Buenos Aires, Bogotá y más" delay={0} />
              <BigStat value={12000} suffix="+" color="text-teal-400" label="Participantes gestionados" sub="Perfiles activos en centros que operan con ELEVA hoy" delay={150} />
              <BigStat value={98} suffix="%" color="text-green-400" label="Tasa de retención de clientes ELEVA" sub="Centros que renuevan el sistema año tras año" delay={300} />
              <BigStat value={90} suffix=" días" color="text-indigo-400" label="Para recuperar la inversión" sub="Promedio documentado en Implementación Base" delay={450} />
            </div>
          </Fade>
        </section>

        {/* ── CTA FINAL ─────────────────────────────────────────────────── */}
        <section className="px-6 py-32 text-center relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-violet-600/15 blur-[100px] rounded-full pointer-events-none" />
          <div className="relative z-10 max-w-3xl mx-auto">
            <Fade>
              <div className="space-y-6">
                <p className="text-xs uppercase tracking-widest text-violet-400 font-bold">Ya tienes los números</p>
                <h2 className="text-5xl sm:text-6xl font-black tracking-tight">
                  Ahora{" "}
                  <span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
                    ve el sistema.
                  </span>
                </h2>
                <p className="text-white/40 max-w-lg mx-auto">
                  El demo de ELEVA está corriendo en vivo con datos reales de un centro, LEVEL Transformación CDMX. Puedes explorar cada módulo sin registro.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
                  <Link href="/vl2026" className="flex items-center gap-2 px-8 py-4 bg-violet-600 hover:bg-violet-500 text-white rounded-xl font-bold text-lg transition-colors shadow-xl shadow-violet-600/30">
                    Ver demo operativo <ArrowRight className="w-5 h-5" />
                  </Link>
                  <Link href="/metodo" className="flex items-center gap-2 px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 rounded-xl font-bold text-lg transition-colors">
                    Leer el método
                  </Link>
                </div>
                <div className="flex items-center justify-center gap-6 pt-2">
                  {["Sin contratos anuales", "Onboarding incluido", "ROI en < 90 días"].map((t) => (
                    <div key={t} className="flex items-center gap-1.5 text-xs text-white/30">
                      <CheckCircle2 className="w-3 h-3 text-violet-500" />
                      {t}
                    </div>
                  ))}
                </div>
              </div>
            </Fade>
          </div>
        </section>

        {/* Footer mínimo */}
        <footer className="border-t border-white/5 px-6 py-8">
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-violet-600 flex items-center justify-center">
                <span className="text-white font-black text-xs">E</span>
              </div>
              <span className="font-black text-white/60 text-sm">ELEVA</span>
            </div>
            <div className="flex items-center gap-4 text-xs text-white/20">
              <Link href="/metodo" className="hover:text-white/50 transition-colors">Método</Link>
              <Link href="/precios" className="hover:text-white/50 transition-colors">Precios</Link>
              <Link href="/vl2026" className="hover:text-white/50 transition-colors">Demo</Link>
            </div>
            <p className="text-xs text-white/15">Datos de 40+ centros · 2023–2025 · ELEVA</p>
          </div>
        </footer>

      </main>
    </div>
  )
}
