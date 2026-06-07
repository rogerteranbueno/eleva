"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import {
  ArrowRight,
  ChevronLeft,
  Target,
  TrendingUp,
  AlertTriangle,
  BarChart3,
  Star,
  Info,
  ChevronDown,
  Users,
} from "lucide-react"
import { useLang } from "@/lib/i18n"

// ─── Utilities ───────────────────────────────────────────────────────────────

function fmt(n: number, decimals = 0) {
  return n.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
}
function fmtUSD(n: number) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`
  if (n >= 1_000)     return `$${Math.round(n / 1_000)}k`
  return `$${Math.round(n)}`
}

// ─── Slider ──────────────────────────────────────────────────────────────────

function Slider({
  label, sublabel, min, max, step, value, onChange, display, accent = "violet",
}: {
  label: string; sublabel?: string; min: number; max: number; step: number
  value: number; onChange: (v: number) => void; display: string
  accent?: "violet" | "cyan" | "green"
}) {
  const pct = ((value - min) / (max - min)) * 100
  const bg  = { violet: "bg-violet-500", cyan: "bg-cyan-500", green: "bg-emerald-500" }[accent]
  const txt = { violet: "text-violet-400", cyan: "text-cyan-400", green: "text-emerald-400" }[accent]

  return (
    <div className="space-y-2.5">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-sm font-semibold text-foreground">{label}</p>
          {sublabel && <p className="text-xs text-muted-foreground mt-0.5">{sublabel}</p>}
        </div>
        <span className={`text-xl font-black tabular-nums leading-none ${txt}`}>{display}</span>
      </div>
      <div className="relative h-5 flex items-center">
        <div className="absolute inset-x-0 h-1.5 bg-border rounded-full overflow-hidden">
          <div className={`h-full rounded-full transition-all duration-75 ${bg}`} style={{ width: `${pct}%` }} />
        </div>
        <input
          type="range" min={min} max={max} step={step} value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute inset-0 w-full opacity-0 cursor-pointer"
        />
      </div>
      <div className="flex justify-between text-[10px] text-muted-foreground/60 font-medium">
        <span>{min === 500 ? "$500" : min}</span>
        <span>{max >= 1000 ? `$${(max/1000).toFixed(0)}k` : max}</span>
      </div>
    </div>
  )
}

// ─── Tooltip ─────────────────────────────────────────────────────────────────

function Tip({ text }: { text: string }) {
  const [open, setOpen] = useState(false)
  return (
    <span className="relative inline-flex">
      <button onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}
        onClick={() => setOpen(p => !p)} className="text-muted-foreground/50 hover:text-muted-foreground transition-colors">
        <Info className="w-3.5 h-3.5" />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-60 bg-popover border border-border rounded-xl p-3 text-xs text-foreground/70 leading-relaxed z-50 shadow-xl pointer-events-none">
            {text}
            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-border" />
          </motion.div>
        )}
      </AnimatePresence>
    </span>
  )
}

// ─── Expandable assumption ────────────────────────────────────────────────────

function Assumption({ label, children }: { label: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-t border-white/6 first:border-0 pt-2 first:pt-0">
      <button onClick={() => setOpen(p => !p)}
        className="w-full flex items-center justify-between gap-2 py-1.5 text-left group">
        <span className="text-[11px] text-muted-foreground group-hover:text-foreground transition-colors">{label}</span>
        <ChevronDown className={`w-3 h-3 text-muted-foreground/50 flex-shrink-0 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <p className="text-[11px] text-muted-foreground/70 leading-relaxed pb-2 pr-4">{children}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── Enrollment calc engine ──────────────────────────────────────────────────

function calcEnrollment(nivel3: number, inviteAvg: number, price1: number) {
  // Each Level 3 participant is active in 3 of 4 weekends
  // Multiple cohorts run simultaneously → total enrolled per weekend
  const enrolled        = Math.round(nivel3 * inviteAvg)

  // Industry baseline show-up rate: 84% (without follow-up)
  const showUpBaseline  = Math.round(enrolled * 0.84)
  // With ELEVA automated confirmation + ops alerts: ~95%
  const showUpEleva     = Math.round(enrolled * 0.95)
  const extraShowUp     = showUpEleva - showUpBaseline

  // Revenue impact (price of Level 1 basic training)
  const revenueBaseline = showUpBaseline * price1
  const revenueEleva    = showUpEleva    * price1
  const revenueDelta    = revenueEleva   - revenueBaseline

  // Graduation score — enrollment carries 40-50% of total
  // A participant needs ~5 enrollments to graduate comfortably
  const avgEnrolled     = Math.round(inviteAvg * 0.84)   // of their invites who show up
  const needsMore       = avgEnrolled < 4                 // below comfortable threshold
  const graduationRisk  = Math.round(nivel3 * (needsMore ? 0.45 : 0.18))

  return {
    enrolled, showUpBaseline, showUpEleva, extraShowUp,
    revenueBaseline, revenueEleva, revenueDelta,
    avgEnrolled, graduationRisk,
  }
}

// ─── Calc engine ─────────────────────────────────────────────────────────────

function calc(participants: number, leads: number, price: number) {
  // ── ADQUIRIR ─────────────────────────────────────────────────────────────
  // With ELEVA's event calendar + automated CRM, ~72% of leads have had 2+
  // touchpoints before being invited. Cold conversion: ~19%. Warm (tracked
  // + invited at right moment): ~70%. Events alone generate warmer pools.
  const warmLeads    = Math.round(leads * 0.72)
  const coldLeads    = leads - warmLeads
  const enrollNow    = Math.round(leads * 0.19)
  const enrollEleva  = Math.round(warmLeads * 0.70 + coldLeads * 0.19)
  const extraEnroll  = Math.max(0, enrollEleva - enrollNow)
  const adqRevenue   = extraEnroll * price

  // ── RETENER ──────────────────────────────────────────────────────────────
  // ELEVA's activation system (early missions, community onboarding, first-week
  // events) raises baseline engagement — so the at-risk pool starts smaller.
  // Still, ~14% show decline signals monthly. Without intervention: 78% leave.
  // With full system (alert + coach message + automatic re-engagement): ~18%.
  const atRisk       = Math.round(participants * 0.14)
  const lostNow      = Math.round(atRisk * 0.78)
  const lostEleva    = Math.round(atRisk * 0.18)
  const saved        = Math.max(0, lostNow - lostEleva)
  const retRevenue   = saved * price

  // ── ESCALAR ──────────────────────────────────────────────────────────────
  // Continuous activation + events push more participants to 80%+ completion.
  // ~33% reach that threshold monthly. Auto-campaign at peak engagement: 62%
  // convert vs 20% organic. Next tier premium averages 52% above base.
  const highPerf     = Math.round(participants * 0.33)
  const upsellNow    = Math.round(highPerf * 0.20)
  const upsellEleva  = Math.round(highPerf * 0.62)
  const extraUpsell  = Math.max(0, upsellEleva - upsellNow)
  const escRevenue   = extraUpsell * price * 0.52   // next tier ~52% premium

  // ── COMUNIDAD VIP ────────────────────────────────────────────────────────
  // A center running events, certifications and retreats consistently grows
  // its deeply engaged cohort to ~9%. ELEVA identifies them and activates:
  //   1. Coaching certification: ~$800 one-time → $67/month amortized
  //   2. Retreats: 3 per year × $1,500 avg → $375/month per person
  // LTV comparison: standard (8 months) vs VIP (22 months + cert + 3 retreats).
  const vipCount       = Math.round(participants * 0.09)
  const certMonthly    = vipCount * (800 / 12)         // $800 cert / 12 months
  const retreatMonthly = vipCount * (1500 * 3 / 12)    // 3 retreats × $1,500 / 12
  const vipRevenue     = certMonthly + retreatMonthly

  // LTV comparison
  const ltvStandard  = price * 8
  const ltvVIP       = price * 22 + 800 + 4500         // 22 months + cert + 3 retreats
  const ltvMultiple  = ltvVIP / ltvStandard

  const totalMonthly = adqRevenue + retRevenue + escRevenue + vipRevenue
  const totalAnnual  = totalMonthly * 12

  return {
    adquirir: { warmLeads, coldLeads, enrollNow, enrollEleva, extraEnroll, revenue: adqRevenue },
    retener:  { atRisk, lostNow, lostEleva, saved, revenue: retRevenue },
    escalar:  { highPerf, upsellNow, upsellEleva, extraUpsell, revenue: escRevenue },
    vip:      { vipCount, certMonthly, retreatMonthly, ltvStandard, ltvVIP, ltvMultiple, revenue: vipRevenue },
    totalMonthly, totalAnnual,
  }
}

// ─── Stage card ───────────────────────────────────────────────────────────────

type StageColor = "cyan" | "amber" | "violet" | "emerald"

const PALETTE: Record<StageColor, {
  section: string; tag: string; tagText: string; val: string; bar: string; row: string; icon: string
}> = {
  cyan:    { section: "bg-cyan-500/6 border-cyan-500/20",    tag: "bg-cyan-500/10 border-cyan-500/25",    tagText: "text-cyan-400",    val: "text-cyan-400",    bar: "bg-cyan-500",    row: "bg-cyan-500/8",    icon: "text-cyan-400"    },
  amber:   { section: "bg-amber-500/6 border-amber-500/20",  tag: "bg-amber-500/10 border-amber-500/25",  tagText: "text-amber-400",   val: "text-amber-400",   bar: "bg-amber-500",   row: "bg-amber-500/8",   icon: "text-amber-400"   },
  violet:  { section: "bg-violet-500/6 border-violet-500/20",tag: "bg-violet-500/10 border-violet-500/25",tagText: "text-violet-400",  val: "text-violet-400",  bar: "bg-violet-500",  row: "bg-violet-500/8",  icon: "text-violet-400"  },
  emerald: { section: "bg-emerald-500/6 border-emerald-500/20",tag:"bg-emerald-500/10 border-emerald-500/25",tagText:"text-emerald-400",val:"text-emerald-400",  bar: "bg-emerald-500", row: "bg-emerald-500/8", icon: "text-emerald-400" },
}

function StageCard({
  color, stage, icon: Icon, headline, why, metrics, revenue, delay = 0, children,
}: {
  color: StageColor; stage: string
  icon: React.ComponentType<{ className?: string }>
  headline: string; why: string
  metrics: { label: string; before: string; after: string; emphasis?: boolean }[]
  revenue: number; delay?: number
  children?: React.ReactNode
}) {
  const p = PALETTE[color]

  return (
    <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.35 }}
      className={`rounded-2xl border p-5 sm:p-6 ${p.section}`}>

      {/* Header row */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-start gap-3">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center border flex-shrink-0 ${p.tag}`}>
            <Icon className={`w-4.5 h-4.5 ${p.icon}`} />
          </div>
          <div>
            <span className={`text-[10px] font-black uppercase tracking-[0.18em] ${p.tagText}`}>{stage}</span>
            <p className="text-sm font-bold text-foreground mt-0.5 leading-snug">{headline}</p>
          </div>
        </div>
        <div className="text-right flex-shrink-0">
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider">mensual</p>
          <p className={`text-2xl font-black tabular-nums ${p.val}`}>{fmtUSD(revenue)}</p>
        </div>
      </div>

      {/* Why explanation */}
      <p className="text-xs text-muted-foreground leading-relaxed mb-4 border-l-2 border-white/10 pl-3">
        {why}
      </p>

      {/* Metrics comparison */}
      <div className="space-y-1.5 mb-4">
        {metrics.map((m, i) => (
          <div key={i} className={`flex items-center justify-between gap-3 rounded-lg px-3 py-2 ${m.emphasis ? p.row : "bg-white/3"}`}>
            <span className="text-xs text-muted-foreground leading-snug flex-1">{m.label}</span>
            <div className="flex items-center gap-2 flex-shrink-0 text-xs font-medium">
              <span className="text-foreground/35 line-through tabular-nums">{m.before}</span>
              <span className={m.emphasis ? p.val : "text-foreground/70"}>{m.after}</span>
            </div>
          </div>
        ))}
      </div>

      {children}
    </motion.div>
  )
}

// ─── Nav ─────────────────────────────────────────────────────────────────────

function SimNav() {
  const { lang, setLang } = useLang()
  return (
    <div className="sticky top-0 z-40 bg-background/85 backdrop-blur-xl border-b border-border">
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ChevronLeft className="w-4 h-4" />
          {lang === "en" ? "Back" : "Volver"}
        </Link>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-violet-600 flex items-center justify-center">
            <span className="text-white font-black text-xs">E</span>
          </div>
          <span className="font-black text-foreground text-sm tracking-tight">ELEVA</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setLang(lang === "es" ? "en" : "es")}
            className="px-2.5 py-1.5 rounded-lg text-[12px] font-bold text-muted-foreground hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5 transition-colors tracking-wider"
          >
            {lang === "es" ? "EN" : "ES"}
          </button>
          <Link href="/demo">
            <button className="flex items-center gap-1.5 px-4 py-1.5 bg-violet-600 hover:bg-violet-700 text-white rounded-lg text-xs font-bold transition-colors">
              {lang === "en" ? "See demo" : "Ver demo"} <ArrowRight className="w-3 h-3" />
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function SimuladorPage() {
  const [tab,          setTab]          = useState<"revenue" | "enrolamiento">("revenue")
  const [participants, setParticipants] = useState(80)
  const [leads,        setLeads]        = useState(35)
  const [price,        setPrice]        = useState(350)
  // Enrollment funnel inputs
  const [nivel3,       setNivel3]       = useState(18)
  const [inviteAvg,    setInviteAvg]    = useState(4)
  const [price1,       setPrice1]       = useState(650)

  const r  = useMemo(() => calc(participants, leads, price), [participants, leads, price])
  const re = useMemo(() => calcEnrollment(nivel3, inviteAvg, price1), [nivel3, inviteAvg, price1])

  const stages = [
    { label: "Adquirir", color: "bg-cyan-500",    revenue: r.adquirir.revenue },
    { label: "Retener",  color: "bg-amber-500",   revenue: r.retener.revenue  },
    { label: "Escalar",  color: "bg-violet-500",  revenue: r.escalar.revenue  },
    { label: "VIP",      color: "bg-emerald-500", revenue: r.vip.revenue      },
  ]
  const maxRevenue = Math.max(...stages.map(s => s.revenue), 1)

  return (
    <div className="min-h-screen bg-background">

      {/* Nav */}
      <SimNav />

      <div className="max-w-6xl mx-auto px-6 py-12 md:py-16">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12 max-w-2xl">
          <div className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-violet-400 bg-violet-500/10 border border-violet-500/20 px-3 py-1.5 rounded-full mb-5">
            <BarChart3 className="w-3 h-3" />
            Simulador de impacto
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-foreground leading-[1.05] mb-4">
            Tu centro tiene revenue<br />
            <span className="gradient-text">que hoy no ves.</span>
          </h1>
          <p className="text-muted-foreground text-base leading-relaxed">
            Ajusta los tres números de tu operación. El simulador te muestra cuánto dinero estás dejando ir cada mes en los cuatro momentos donde ELEVA hace la diferencia,{" "}
            <span className="text-foreground font-medium">sin contratar más staff, sin cambiar tu metodología.</span>
          </p>
        </motion.div>

        {/* ── Tab switcher ─────────────────────────────────────────────── */}
        <div id="enrolamiento" className="flex gap-1 p-1 bg-white/4 rounded-xl border border-white/8 w-fit mb-10">
          {([
            { id: "revenue",      label: "Revenue mensual" },
            { id: "enrolamiento", label: "Motor de enrolamiento" },
          ] as const).map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
                tab === t.id
                  ? "bg-violet-600 text-white shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Two-column layout */}
        <div className={tab === "revenue" ? "" : "hidden"}>
        <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-8 lg:gap-10 items-start">

          {/* ── Inputs ─────────────────────────────────────────────────────── */}
          <div className="lg:sticky lg:top-20 space-y-6">

            <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="glass rounded-2xl p-6 space-y-7">
              <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">Tu centro</p>
              <Slider label="Participantes activos" sublabel="Miembros con membresía vigente"
                min={20} max={500} step={5} value={participants} onChange={setParticipants}
                display={fmt(participants)} accent="violet" />
              <Slider label="Leads nuevos por mes" sublabel="Personas que contactan o conocen tu centro"
                min={5} max={200} step={5} value={leads} onChange={setLeads}
                display={fmt(leads)} accent="cyan" />
              <Slider label="Precio de membresía" sublabel="Valor mensual de tu programa principal (USD)"
                min={100} max={1500} step={50} value={price} onChange={setPrice}
                display={`$${fmt(price)}`} accent="green" />
            </motion.div>

            {/* Assumptions */}
            <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.18 }}
              className="glass rounded-2xl p-5">
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-3">
                Supuestos del modelo
              </p>
              <div className="space-y-0">
                <Assumption label="¿Por qué 70% de conversión cálida y 72% de leads cálidos?">
                  Con el calendario de eventos de ELEVA activo, la mayoría de los leads tiene 2+ puntos de contacto antes de ser invitado: asistió a un webinar, respondió contenido o fue a un evento presencial. Eso sube la conversión de 19% (frío) a ~70% (cálido). El 72% de leads cálidos refleja un centro con eventos regulares y seguimiento activo de señales de interés.
                </Assumption>
                <Assumption label="¿Por qué 14% en riesgo y solo 18% de abandono con intervención?">
                  Con el sistema de activación completo (misión día 1, onboarding a comunidad, primer evento en semana 1), el nivel de desconexión base es más alto. Más gente muestra señales, pero también la intervención es más precisa. Un coach con contexto específico + mensaje sugerido + re-engagement automático logra rescatar hasta el 82% de los casos.
                </Assumption>
                <Assumption label="¿Por qué 33% listos para escalar y 62% de upsell?">
                  La activación continua y los eventos de comunidad llevan a más participantes a completar 80%+ de sus misiones. El 62% de upsell refleja una campaña activada en el momento de máxima motivación, no un email genérico, sino una oferta personalizada basada en el historial de cada persona.
                </Assumption>
                <Assumption label="¿Por qué 9% VIP y 3 retiros al año?">
                  Un centro que corre eventos regulares, tiene una comunidad viva y ofrece certificaciones naturalmente genera un cohort VIP más grande. 9% es alcanzable con un año de operación completa. Los 3 retiros anuales (↑ desde 2) reflejan un centro con demanda establecida; a $1,500 por persona son experiencias premium pero accesibles para quien ya está profundamente comprometido.
                </Assumption>
              </div>
            </motion.div>
          </div>

          {/* ── Results ────────────────────────────────────────────────────── */}
          <div className="space-y-4">

            {/* ADQUIRIR */}
            <StageCard color="cyan" stage="Adquirir" icon={Target} delay={0.15}
              headline="Leads que ya te conocen pero nadie contacta en el momento correcto"
              why={`De tus ${leads} leads este mes, ~${r.adquirir.warmLeads} ya interactuaron con tu marca: webinars, eventos, contenido, mensajes. Con el calendario de ELEVA activo, ese porcentaje sube aún más. El sistema detecta cada señal y genera la alerta de "momento de invitar" en tiempo real, subiendo la conversión de 19% a 70%.`}
              revenue={r.adquirir.revenue}
              metrics={[
                { label: "Leads cálidos sin trackear", before: `${r.adquirir.warmLeads} tratados como fríos`, after: `${r.adquirir.warmLeads} con timing correcto` },
                { label: "Conversión promedio actual → con ELEVA", before: "19%", after: "70%", emphasis: true },
                { label: "Enrolamientos adicionales / mes", before: `${r.adquirir.enrollNow} personas`, after: `+${r.adquirir.extraEnroll} más`, emphasis: true },
              ]}
            />

            {/* RETENER */}
            <StageCard color="amber" stage="Retener" icon={AlertTriangle} delay={0.22}
              headline="Participantes en riesgo que se van antes de que notes que algo pasó"
              why={`~${r.retener.atRisk} participantes están mostrando señales de desconexión este mes. El sistema de activación de ELEVA amortigua el churn desde el día 1, y los que caen reciben una alerta con nombre, contexto y mensaje sugerido. Con el sistema completo activo, el abandono baja de 78% a 18% de los casos detectados.`}
              revenue={r.retener.revenue}
              metrics={[
                { label: "Participantes en riesgo detectados", before: "0 visibles", after: `${r.retener.atRisk} identificados` },
                { label: "Abandono sin intervención → con intervención", before: `${r.retener.lostNow} se van`, after: `${r.retener.lostEleva} se van`, emphasis: true },
                { label: "Participantes rescatados / mes", before: "0", after: `+${r.retener.saved} retenidos`, emphasis: true },
              ]}
            />

            {/* ESCALAR */}
            <StageCard color="violet" stage="Escalar" icon={TrendingUp} delay={0.29}
              headline="Participantes en su momento de mayor motivación a los que nadie les ofrece más"
              why={`Con activación continua y eventos de comunidad, ~${r.escalar.highPerf} participantes llegan al 80%+ de misiones completadas. Están en su pico de motivación. Sin campaña activa, solo ~${r.escalar.upsellNow} suben solos. ELEVA detecta el momento exacto y lanza una oferta personalizada, no un email genérico, sino una propuesta basada en su historial.`}
              revenue={r.escalar.revenue}
              metrics={[
                { label: "Participantes en pico de compromiso (80%+ misiones)", before: `${r.escalar.highPerf} sin campaña`, after: `${r.escalar.highPerf} activados` },
                { label: "Upsell espontáneo → con campaña automática", before: `${r.escalar.upsellNow} solos`, after: `${r.escalar.upsellEleva} con ELEVA`, emphasis: true },
                { label: "Conversiones adicionales / mes", before: "0", after: `+${r.escalar.extraUpsell} personas`, emphasis: true },
              ]}
            />

            {/* VIP */}
            <StageCard color="emerald" stage="Comunidad VIP" icon={Star} delay={0.36}
              headline="El 9% más comprometido de tu centro está listo para productos de alto valor"
              why={`Un centro con eventos regulares, certificaciones y retiros genera un cohort VIP más profundo. Son ~${r.vip.vipCount} personas que lideran, refieren y viven tu metodología. ELEVA los identifica por comportamiento (no por intuición) y activa tres productos de alto valor: certificación de coaching, retiros de transformación (3 al año) y mentoría avanzada.`}
              revenue={r.vip.revenue}
              metrics={[
                { label: "Participantes VIP identificados por ELEVA", before: "0 visibles", after: `${r.vip.vipCount} perfiles` },
                { label: "Revenue por certificación de coaching ($800)", before: "$0", after: `+${fmtUSD(r.vip.certMonthly)}/mes`, emphasis: true },
                { label: "Revenue por retiros (3×$1,500/año)", before: "$0", after: `+${fmtUSD(r.vip.retreatMonthly)}/mes`, emphasis: true },
              ]}
            >
              {/* LTV comparison */}
              <div className="mt-1 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
                <p className="text-[10px] uppercase tracking-widest text-emerald-400 font-black mb-3">LTV por participante</p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-[10px] text-muted-foreground mb-1">Participante estándar</p>
                    <p className="text-lg font-black text-foreground/60 tabular-nums line-through">{fmtUSD(r.vip.ltvStandard)}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{fmtUSD(price)} × 8 meses</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground mb-1">Participante VIP</p>
                    <p className="text-xl font-black text-emerald-400 tabular-nums">{fmtUSD(r.vip.ltvVIP)}</p>
                    <p className="text-[10px] text-emerald-400/70 mt-0.5 font-semibold">
                      {r.vip.ltvMultiple.toFixed(1)}x más LTV
                    </p>
                  </div>
                </div>
                <div className="mt-3 flex gap-2">
                  <div className="flex-1 h-1.5 rounded-full bg-border overflow-hidden">
                    <div className="h-full bg-foreground/20 rounded-full" style={{ width: `${(r.vip.ltvStandard / r.vip.ltvVIP) * 100}%` }} />
                  </div>
                  <div className="flex-none" style={{ flexBasis: `${((r.vip.ltvVIP - r.vip.ltvStandard) / r.vip.ltvVIP) * 100}%` }}>
                    <div className="h-1.5 rounded-full bg-emerald-500" />
                  </div>
                </div>
                <p className="text-[10px] text-muted-foreground mt-1.5">
                  22 meses de retención + certificación de coaching + 3 retiros / año
                </p>
              </div>
            </StageCard>

            {/* ── Total ─────────────────────────────────────────────────── */}
            <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.44 }}
              className="rounded-2xl bg-gradient-to-br from-violet-600/18 via-violet-600/10 to-cyan-500/8 border border-violet-500/30 p-6">

              <p className="text-xs font-black uppercase tracking-widest text-violet-400 mb-1">
                Revenue no capturado
              </p>
              <p className="text-sm text-foreground/60 mb-5">
                Lo que tu centro pierde cada mes por no tener visibilidad conductual completa
              </p>

              {/* Breakdown bars */}
              <div className="space-y-2 mb-6">
                {stages.map((s) => (
                  <div key={s.label} className="flex items-center gap-3">
                    <span className="text-[10px] w-16 text-right text-muted-foreground font-medium flex-shrink-0">{s.label}</span>
                    <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                      <motion.div
                        className={`h-full rounded-full ${s.color}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${(s.revenue / maxRevenue) * 100}%` }}
                        transition={{ delay: 0.5, duration: 0.6, ease: "easeOut" }}
                      />
                    </div>
                    <span className="text-xs font-bold text-foreground/70 tabular-nums w-14 flex-shrink-0">
                      {fmtUSD(s.revenue)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Total numbers */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="glass rounded-xl p-4 text-center">
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1.5">Mensual</p>
                  <p className="text-3xl sm:text-4xl font-black text-violet-400 tabular-nums">{fmtUSD(r.totalMonthly)}</p>
                  <p className="text-[10px] text-muted-foreground mt-1">USD / mes</p>
                </div>
                <div className="glass rounded-xl p-4 text-center">
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1.5">Anual</p>
                  <p className="text-3xl sm:text-4xl font-black text-cyan-400 tabular-nums">{fmtUSD(r.totalAnnual)}</p>
                  <p className="text-[10px] text-muted-foreground mt-1">USD / año</p>
                </div>
              </div>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Link href="/demo" className="flex-1">
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-sm font-bold transition-colors shadow-lg shadow-violet-600/25">
                    Ver cómo ELEVA lo recupera
                    <ArrowRight className="w-4 h-4" />
                  </motion.button>
                </Link>
                <Link href="/build">
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 border border-border hover:border-border/80 text-foreground rounded-xl text-sm font-medium transition-colors">
                    Hablar con el equipo
                  </motion.button>
                </Link>
              </div>
            </motion.div>

            <p className="text-[11px] text-muted-foreground text-center leading-relaxed px-2">
              Estimaciones basadas en los patrones conductuales observados en la red de centros con ELEVA.
              Los resultados reales varían por centro, metodología y nivel de implementación.
            </p>
          </div>
        </div>
        </div>{/* end revenue tab */}

        {/* ── Enrollment funnel tab ──────────────────────────────────────── */}
        <div className={tab === "enrolamiento" ? "" : "hidden"}>
          <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-8 lg:gap-10 items-start">

            {/* Inputs */}
            <div className="lg:sticky lg:top-20 space-y-6">
              <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}
                className="glass rounded-2xl p-6 space-y-7">
                <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">Tu Nivel 3</p>
                <Slider
                  label="Participantes en Nivel 3 activo"
                  sublabel="Personas en su último nivel, en los 3 fines de enrolamiento"
                  min={5} max={60} step={1} value={nivel3} onChange={setNivel3}
                  display={String(nivel3)} accent="violet"
                />
                <Slider
                  label="Invitados promedio por participante"
                  sublabel="Personas que cada uno logra inscribir en sus 3 fines"
                  min={1} max={10} step={1} value={inviteAvg} onChange={setInviteAvg}
                  display={String(inviteAvg)} accent="cyan"
                />
                <Slider
                  label="Precio del Básico (Nivel 1)"
                  sublabel="Lo que paga cada persona inscrita por el entrenamiento (USD)"
                  min={200} max={2000} step={50} value={price1} onChange={setPrice1}
                  display={`$${price1}`} accent="green"
                />
              </motion.div>

              <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="glass rounded-2xl p-5">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-3">
                  Supuestos del modelo
                </p>
                <div className="space-y-0">
                  <Assumption label="¿Por qué 84% de show-up sin sistema?">
                    Entre la inscripción y el entrenamiento pasan 15 días. En ese tiempo la gente duda, se ocupa o simplemente olvida. Sin recordatorios activos ni seguimiento del equipo de operaciones, la tasa promedio de asistencia es ~84% en centros sin sistema de confirmación.
                  </Assumption>
                  <Assumption label="¿Por qué 95% con ELEVA?">
                    ELEVA envía recordatorios automáticos a los 15, 7, 3 y 1 días antes. Los no-confirmados generan alertas al equipo de operaciones. El resultado observado en centros con seguimiento activo es 93–97% de presencia — usamos 95% como referencia conservadora.
                  </Assumption>
                  <Assumption label="¿Qué es el riesgo de graduación?">
                    Para graduarse del Nivel 3, el enrolamiento vale +40% del puntaje. Un participante que invitó a 4 personas y 3 llegaron está en zona segura. Uno que solo logró 1 o 2 necesita apoyo activo — ELEVA los identifica y activa al coach para intervenir antes del último fin de semana.
                  </Assumption>
                </div>
              </motion.div>
            </div>

            {/* Results */}
            <div className="space-y-4">

              {/* Funnel overview */}
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.12 }}
                className="rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-5 sm:p-6">
                <p className="text-[10px] font-black uppercase tracking-widest text-cyan-400 mb-4">
                  Funnel de un fin de semana
                </p>

                <div className="grid grid-cols-3 gap-3 mb-6">
                  {[
                    { label: "Inscritos", value: re.enrolled, color: "text-cyan-400", sub: `${nivel3} × ${inviteAvg} invitados` },
                    { label: "Sin sistema", value: re.showUpBaseline, color: "text-red-400", sub: `${Math.round(re.showUpBaseline/re.enrolled*100)}% show-up` },
                    { label: "Con ELEVA", value: re.showUpEleva, color: "text-violet-400", sub: `95% show-up` },
                  ].map((item) => (
                    <div key={item.label} className="text-center glass rounded-xl p-4">
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">{item.label}</p>
                      <p className={`text-3xl font-black tabular-nums ${item.color}`}>{item.value}</p>
                      <p className="text-[10px] text-muted-foreground mt-1">{item.sub}</p>
                    </div>
                  ))}
                </div>

                {/* Bar visual */}
                <div className="space-y-3">
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Sin sistema: {re.showUpBaseline} personas</span>
                      <span>{Math.round(re.showUpBaseline/re.enrolled*100)}%</span>
                    </div>
                    <div className="h-3 bg-white/6 rounded-full overflow-hidden">
                      <motion.div className="h-full bg-red-500/60 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${(re.showUpBaseline / re.enrolled) * 100}%` }}
                        transition={{ duration: 0.6, ease: "easeOut" }} />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Con ELEVA: {re.showUpEleva} personas</span>
                      <span>95%</span>
                    </div>
                    <div className="h-3 bg-white/6 rounded-full overflow-hidden">
                      <motion.div className="h-full bg-violet-500 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: "95%" }}
                        transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }} />
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-3 rounded-xl bg-violet-500/8 border border-violet-500/20 p-3">
                  <div>
                    <p className="text-[10px] text-violet-400/70 uppercase tracking-widest font-semibold">Extra por fin de semana</p>
                    <p className="text-2xl font-black text-violet-400 tabular-nums">+{re.extraShowUp} personas</p>
                  </div>
                  <div className="w-px h-10 bg-white/10" />
                  <div>
                    <p className="text-[10px] text-cyan-400/70 uppercase tracking-widest font-semibold">Revenue adicional</p>
                    <p className="text-2xl font-black text-cyan-400 tabular-nums">{fmtUSD(re.revenueDelta)}</p>
                  </div>
                </div>
              </motion.div>

              {/* Annual impact */}
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5 sm:p-6">
                <p className="text-[10px] font-black uppercase tracking-widest text-emerald-400 mb-4">
                  Impacto anual estimado
                </p>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="glass rounded-xl p-4 text-center">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1">Por ciclo de enrolamiento</p>
                    <p className="text-3xl font-black text-emerald-400 tabular-nums">{fmtUSD(re.revenueDelta)}</p>
                  </div>
                  <div className="glass rounded-xl p-4 text-center">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1">× 4 ciclos / año</p>
                    <p className="text-3xl font-black text-cyan-400 tabular-nums">{fmtUSD(re.revenueDelta * 4)}</p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Un centro con 4 ciclos de enrolamiento al año captura ese revenue adicional cada vez. Sin contratar más staff, sin cambiar el programa.
                </p>
              </motion.div>

              {/* Graduation risk */}
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.28 }}
                className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-5 sm:p-6">
                <p className="text-[10px] font-black uppercase tracking-widest text-amber-400 mb-1">
                  Riesgo de no-graduación
                </p>
                <p className="text-xs text-muted-foreground mb-4">
                  Participantes de Nivel 3 con enrolados insuficientes para alcanzar el puntaje mínimo
                </p>

                <div className="flex items-center gap-4">
                  <div>
                    <p className="text-4xl font-black text-amber-400 tabular-nums">{re.graduationRisk}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">personas en riesgo</p>
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Con un promedio de {re.avgEnrolled} enrolados por participante, {re.graduationRisk > 0 ? "hay personas que necesitan apoyo activo del coach para llegar al umbral mínimo antes del 4to fin de semana" : "todos están en zona segura de graduación"}. ELEVA lo detecta con tiempo suficiente para actuar.
                    </p>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-4 gap-2">
                  {[
                    { label: "Enrolados necesarios", value: "4–5" },
                    { label: "Promedio actual", value: String(re.avgEnrolled) },
                    { label: "Peso en puntaje", value: "40%+" },
                    { label: "Alertas ELEVA", value: re.graduationRisk > 0 ? `${re.graduationRisk} activas` : "✓ Ok" },
                  ].map((item) => (
                    <div key={item.label} className="text-center glass rounded-xl p-3">
                      <p className="text-xs font-bold text-amber-400">{item.value}</p>
                      <p className="text-[9px] text-muted-foreground mt-0.5 leading-tight">{item.label}</p>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* CTA */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Link href="/demo" className="flex-1">
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-sm font-bold transition-colors shadow-lg shadow-violet-600/25">
                    Ver el seguimiento en el demo
                    <ArrowRight className="w-4 h-4" />
                  </motion.button>
                </Link>
                <Link href="/build">
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 border border-border hover:border-border/80 text-foreground rounded-xl text-sm font-medium transition-colors">
                    Hablar con el equipo
                  </motion.button>
                </Link>
              </div>

              <p className="text-[11px] text-muted-foreground text-center leading-relaxed px-2">
                Basado en datos de show-up observados en centros de transformación con y sin seguimiento activo de confirmaciones.
              </p>
            </div>
          </div>
        </div>{/* end enrolamiento tab */}

      </div>
    </div>
  )
}
