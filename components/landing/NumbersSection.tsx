"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { useLang } from "@/lib/i18n"

// ─── Counter hook (moved from page.tsx) ──────────────────────────────────────

export function useCountUp(target: number, duration = 1800) {
  const [value, setValue] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const started = useRef(false)

  const start = useRef(() => {
    if (started.current) return
    started.current = true
    const t0 = performance.now()
    const tick = (now: number) => {
      const p = Math.min((now - t0) / duration, 1)
      const eased = 1 - (1 - p) ** 3
      setValue(Math.round(target * eased))
      if (p < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  })

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) start.current() },
      { threshold: 0.1 }
    )
    observer.observe(el)

    const rect = el.getBoundingClientRect()
    if (rect.top < window.innerHeight && rect.bottom > 0) start.current()

    return () => observer.disconnect()
  }, [target, duration])

  return { value, ref }
}

// ─── StatCounter ─────────────────────────────────────────────────────────────

interface StatDef {
  value: number
  prefix?: string
  suffix: string
  label: string
  sub: string
  color: string
  bg: string
}

export function StatCounter({ stat }: { stat: StatDef }) {
  const { value, ref } = useCountUp(stat.value)
  return (
    <div ref={ref} className={cn("rounded-2xl p-4 lg:p-5 text-center border border-foreground/6 flex flex-col gap-2 overflow-hidden", stat.bg)}>
      <p className={cn("text-3xl lg:text-4xl font-black leading-none break-all", stat.color)}>
        {stat.prefix ?? ""}{value}{stat.suffix}
      </p>
      <p className="text-foreground font-bold text-xs lg:text-sm">{stat.label}</p>
      <p className="text-muted-foreground text-[10px] lg:text-xs leading-relaxed">{stat.sub}</p>
    </div>
  )
}

// ─── NumbersSection ──────────────────────────────────────────────────────────

export function NumbersSection() {
  const { lang } = useLang()
  const { value: heroVal, ref: heroRef } = useCountUp(140)

  const c = lang === "en" ? {
    badge: "02 · Results",
    h2a: "What we observe",
    h2b: "when centers run on data.",
    sub: "These are patterns from centers that operate with a tracking system. Results vary by starting point.",
    heroEyebrow: "Participant growth · 12 months",
    heroLabel: "Active participants",
    heroSub: "in centers with 12+ months in the system, vs. their own baseline without it.",
    stat2Eyebrow: "Conversion",
    stat2Val: "68%",
    stat2Sub: "phase-to-phase continuity with active follow-up",
    stat2Sub2: "vs. under 45% without a system",
    stat3Eyebrow: "Retention",
    stat3Val: "3x",
    stat3Sub: "higher with active Momentum Score vs. no structured follow-up",
    stat4Eyebrow: "Enrollment",
    stat4Val: "80%",
    stat4Sub: "of nurtured leads buy before the first sales call",
    stat5Eyebrow: "Owner's time",
    stat5Val: "~4 hrs",
    stat5Sub: "freed weekly by automating follow-up and reporting",
    footerText: "The",
    footerBold: "+140% participant growth",
    footerText2: "reflects centers with 12+ months using the system, measured against their own starting point. Individual results vary.",
    footerCta: "See the system",
  } : {
    badge: "02 · Resultados",
    h2a: "Lo que observamos",
    h2b: "cuando los centros operan con datos.",
    sub: "Patrones de centros que operan con sistema de seguimiento activo. Los resultados varían según el punto de partida.",
    heroEyebrow: "Crecimiento de participantes · 12 meses",
    heroLabel: "Participantes activos",
    heroSub: "en centros con 12+ meses en el sistema, vs. su propia línea base sin él.",
    stat2Eyebrow: "Conversión",
    stat2Val: "68%",
    stat2Sub: "continuidad fase a fase con seguimiento activo",
    stat2Sub2: "vs. menos del 45% sin sistema",
    stat3Eyebrow: "Retención",
    stat3Val: "3x",
    stat3Sub: "más alta con Momentum Score activo vs. sin seguimiento estructurado",
    stat4Eyebrow: "Enrolamiento",
    stat4Val: "80%",
    stat4Sub: "de los leads que pasaron por nurturing compran antes de la primera llamada",
    stat5Eyebrow: "Tiempo del dueño",
    stat5Val: "~4 hrs",
    stat5Sub: "semanales que se liberan al automatizar seguimiento y reportes",
    footerText: "El",
    footerBold: "+140% en participantes activos",
    footerText2: "refleja centros con 12+ meses usando el sistema, medidos contra su propia línea base. Los resultados individuales varían.",
    footerCta: "Ver el sistema",
  }

  return (
    <section className="section-b relative py-24 overflow-hidden">
      <div className="section-rule absolute top-0 left-0 right-0" />
      <div className="absolute inset-0 bg-gradient-to-br from-violet-950/25 via-transparent to-cyan-950/10 pointer-events-none" />

      <div className="relative max-w-5xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10"
        >
          <div className="flex items-center gap-3 mb-4">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-violet-400 bg-violet-500/10 border border-violet-500/20 px-2.5 py-1 rounded-full">{c.badge}</span>
          </div>
          <h2 className="text-5xl sm:text-6xl font-black text-foreground leading-[1.05] mb-3">
            {c.h2a}<br />
            <span className="gradient-text">{c.h2b}</span>
          </h2>
          <p className="text-muted-foreground text-base max-w-lg">
            {c.sub}
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">

          {/* Hero stat, +240%, spans 2 cols, tall */}
          <motion.div
            ref={heroRef}
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="col-span-2 md:col-span-2 row-span-2 glass-violet rounded-2xl p-7 flex flex-col justify-between min-h-[180px] md:min-h-[220px] relative overflow-hidden group hover:border-violet-500/40 transition-all"
          >
            <div className="absolute -right-8 -bottom-8 w-40 h-40 rounded-full bg-violet-600/10 blur-2xl pointer-events-none group-hover:bg-violet-600/20 transition-colors" />
            <div>
              <p className="text-[10px] uppercase tracking-widest font-bold text-violet-400 mb-2">{c.heroEyebrow}</p>
              <p className="text-7xl sm:text-8xl font-black text-violet-400 leading-none">+{heroVal}%</p>
            </div>
            <div>
              <p className="text-foreground font-bold text-lg">{c.heroLabel}</p>
              <p className="text-sm text-muted-foreground mt-0.5">{c.heroSub}</p>
            </div>
          </motion.div>

          {/* Stat 2, 68% */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="glass rounded-2xl p-5 flex flex-col justify-between hover:border-cyan-500/30 transition-colors"
          >
            <p className="text-[10px] uppercase tracking-widest font-bold text-cyan-400 mb-3">{c.stat2Eyebrow}</p>
            <p className="text-5xl font-black text-cyan-400 leading-none">{c.stat2Val}</p>
            <p className="text-xs text-muted-foreground mt-2 leading-snug">{c.stat2Sub} <span className="text-foreground/60">{c.stat2Sub2}</span></p>
          </motion.div>

          {/* Stat 3, 3x */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.18 }}
            className="glass rounded-2xl p-5 flex flex-col justify-between hover:border-green-500/30 transition-colors"
          >
            <p className="text-[10px] uppercase tracking-widest font-bold text-green-400 mb-3">{c.stat3Eyebrow}</p>
            <p className="text-5xl font-black text-green-400 leading-none">{c.stat3Val}</p>
            <p className="text-xs text-muted-foreground mt-2 leading-snug">{c.stat3Sub}</p>
          </motion.div>

          {/* Stat 4, 80% */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.24 }}
            className="glass rounded-2xl p-5 flex flex-col justify-between hover:border-yellow-500/30 transition-colors"
          >
            <p className="text-[10px] uppercase tracking-widest font-bold text-yellow-400 mb-3">{c.stat4Eyebrow}</p>
            <p className="text-5xl font-black text-yellow-400 leading-none">{c.stat4Val}</p>
            <p className="text-xs text-muted-foreground mt-2 leading-snug">{c.stat4Sub}</p>
          </motion.div>

          {/* Stat 5, 4hrs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="glass rounded-2xl p-5 flex flex-col justify-between hover:border-pink-500/30 transition-colors"
          >
            <p className="text-[10px] uppercase tracking-widest font-bold text-pink-400 mb-3">{c.stat5Eyebrow}</p>
            <p className="text-5xl font-black text-pink-400 leading-none">{c.stat5Val}</p>
            <p className="text-xs text-muted-foreground mt-2 leading-snug">{c.stat5Sub}</p>
          </motion.div>

        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl px-6 py-5 bg-gradient-to-r from-violet-600/12 to-cyan-600/8 border border-violet-500/20"
        >
          <p className="text-sm text-foreground/80 text-center sm:text-left max-w-lg">
            {c.footerText} <span className="text-foreground font-bold">{c.footerBold}</span> {c.footerText2}
          </p>
          <Link href="/vl2026/pulso" className="flex-shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-foreground text-sm font-bold transition-colors whitespace-nowrap">
            {c.footerCta} <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
      <div className="section-rule absolute bottom-0 left-0 right-0" />
    </section>
  )
}
