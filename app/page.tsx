"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import {
  ArrowRight,
  ChevronDown,
  ChevronRight,
  Star,
  BarChart3,
  AlertTriangle,
  Menu,
  X,
  Sun,
  Moon,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useLang } from "@/lib/i18n"

import { ForWhoSection } from "@/components/landing/ForWhoSection"
import { ProblemSection } from "@/components/landing/ProblemSection"
import { GrowthEngineSection } from "@/components/landing/GrowthEngineSection"
import { NumbersSection } from "@/components/landing/NumbersSection"
import { InsightsSection } from "@/components/landing/InsightsSection"
import { HowItWorksSection } from "@/components/landing/HowItWorksSection"
import { TodoIncluidoSection } from "@/components/landing/TodoIncluidoSection"
import { BuildTeaserSection } from "@/components/landing/BuildTeaserSection"
import { TestimonialsSection } from "@/components/landing/TestimonialsSection"
import { PricingTeaser } from "@/components/landing/PricingTeaser"
import { DemoSection } from "@/components/landing/DemoSection"
import { FinalCTASection } from "@/components/landing/FinalCTASection"
import { Footer } from "@/components/landing/Footer"

// ─── Theme hook ───────────────────────────────────────────────────────────────

function useTheme() {
  const [light, setLight] = useState(false)
  useEffect(() => {
    const saved = localStorage.getItem("eleva-theme")
    if (saved === "light") { setLight(true); document.documentElement.classList.add("light") }
  }, [])
  const toggle = () => {
    setLight((prev) => {
      const next = !prev
      document.documentElement.classList.toggle("light", next)
      localStorage.setItem("eleva-theme", next ? "light" : "dark")
      return next
    })
  }
  return { light, toggle }
}

// ─── Nav ──────────────────────────────────────────────────────────────────────

function Nav() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { light, toggle } = useTheme()
  const { lang, setLang } = useLang()

  const navLinks = lang === "en"
    ? { features: "Features", pricing: "Pricing", diagnose: "Free diagnosis", simulate: "Simulate", demo: "See demo" }
    : { features: "Funcionalidades", pricing: "Precios", diagnose: "Diagnóstico gratis", simulate: "Simular", demo: "Ver demo" }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/85 backdrop-blur-xl border-b border-border transition-colors duration-300">
      <div className="flex items-center justify-between px-6 py-3.5 max-w-7xl mx-auto">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center flex-shrink-0">
            <span className="text-white font-black text-sm">E</span>
          </div>
          <span className="font-black text-foreground text-lg tracking-tight">ELEVA</span>
        </div>
        <div className="flex items-center gap-1">
          <Link href="/metodo" className="text-[13px] text-muted-foreground hover:text-foreground transition-colors hidden sm:block px-3 py-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/5">
            {lang === "en" ? "Method" : "Método"}
          </Link>
          <Link href="/numeros" className="text-[13px] text-muted-foreground hover:text-foreground transition-colors hidden sm:block px-3 py-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/5">
            {lang === "en" ? "Numbers" : "Números"}
          </Link>
          <Link href="/funcionalidades" className="text-[13px] text-muted-foreground hover:text-foreground transition-colors hidden sm:block px-3 py-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/5">
            {navLinks.features}
          </Link>
          <Link href="/precios" className="text-[13px] text-muted-foreground hover:text-foreground transition-colors hidden sm:block px-3 py-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/5">
            {navLinks.pricing}
          </Link>
          <Link href="/build" className="text-[13px] text-muted-foreground hover:text-foreground transition-colors hidden lg:block px-3 py-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/5">
            {navLinks.diagnose}
          </Link>
          <Link href="/simulador" className="text-[13px] text-muted-foreground hover:text-foreground transition-colors hidden sm:block px-3 py-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/5">
            {navLinks.simulate}
          </Link>
          <button
            onClick={toggle}
            className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5 transition-colors hidden sm:flex items-center"
            aria-label={lang === "en" ? "Toggle theme" : "Cambiar tema"}
            title={light ? (lang === "en" ? "Dark mode" : "Modo oscuro") : (lang === "en" ? "Light mode" : "Modo claro")}
          >
            {light ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </button>
          <button
            onClick={() => setLang(lang === "es" ? "en" : "es")}
            className="hidden sm:flex items-center px-2.5 py-1.5 rounded-lg text-[12px] font-bold text-muted-foreground hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5 transition-colors tracking-wider"
            aria-label="Toggle language"
          >
            {lang === "es" ? "EN" : "ES"}
          </button>
          <Link href="/demo">
            <button className="flex items-center gap-1.5 px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg text-[13px] font-semibold transition-colors ml-1">
              {navLinks.demo} <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </Link>
          <button
            onClick={() => setMobileOpen((p) => !p)}
            className="sm:hidden p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            aria-label="Menú"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="sm:hidden border-t border-border overflow-hidden"
          >
            <div className="px-6 py-4 space-y-1 bg-background/95">
              <Link href="/metodo" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-foreground hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                <ChevronRight className="w-4 h-4 text-violet-400" />{lang === "en" ? "Method" : "Método"}
              </Link>
              <Link href="/numeros" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-foreground hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                <ChevronRight className="w-4 h-4 text-violet-400" />{lang === "en" ? "Numbers" : "Números"}
              </Link>
              <Link href="/funcionalidades" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-foreground hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                <ChevronRight className="w-4 h-4 text-violet-400" />{navLinks.features}
              </Link>
              <Link href="/precios" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-foreground hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                <ChevronRight className="w-4 h-4 text-violet-400" />{navLinks.pricing}
              </Link>
              <Link href="/build" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-foreground hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                <ChevronRight className="w-4 h-4 text-violet-400" />{navLinks.diagnose}
              </Link>
              <Link href="/simulador" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-foreground hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                <ChevronRight className="w-4 h-4 text-violet-400" />{navLinks.simulate}
              </Link>
              <button onClick={() => { toggle(); setMobileOpen(false) }} className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5 transition-colors w-full text-left">
                {light ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                {light ? (lang === "en" ? "Dark mode" : "Modo oscuro") : (lang === "en" ? "Light mode" : "Modo claro")}
              </button>
              <button onClick={() => { setLang(lang === "es" ? "en" : "es"); setMobileOpen(false) }} className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5 transition-colors w-full text-left font-bold tracking-wider">
                {lang === "es" ? "🇺🇸 English" : "🇲🇽 Español"}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}

// ─── Product Preview Mockup ───────────────────────────────────────────────────

function ProductPreview() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7, duration: 0.6 }}
      className="relative mt-14 max-w-3xl mx-auto"
    >
      <div className="absolute inset-x-0 top-8 h-40 bg-violet-600/25 blur-3xl rounded-full pointer-events-none" />
      <div className="relative rounded-2xl border border-white/12 overflow-hidden shadow-2xl bg-[#0e0e1a]">
        {/* App bar */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-white/8 bg-white/2">
          <div className="w-5 h-5 rounded bg-violet-600 flex items-center justify-center flex-shrink-0">
            <span className="text-white font-black text-[9px]">E</span>
          </div>
          <span className="text-[11px] font-bold text-white">ELEVA</span>
          <span className="text-[10px] text-muted-foreground">· Pulso del Centro</span>
          <div className="ml-auto flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-green-500/15 border border-green-500/25">
            <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            <span className="text-[9px] font-semibold text-green-400">Sistema activo</span>
          </div>
        </div>
        {/* Alert */}
        <div className="mx-4 mt-4 flex items-center gap-3 bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2.5">
          <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-[11px] font-semibold text-white">14 participantes necesitan atención hoy</p>
            <p className="text-[10px] text-muted-foreground">Momentum crítico · intervención recomendada</p>
          </div>
          <span className="text-[10px] font-semibold text-violet-400 whitespace-nowrap">Ver →</span>
        </div>
        {/* Stats row */}
        <div className="grid grid-cols-4 gap-3 p-4">
          {[
            { label: "Momentum", val: "71%", color: "text-violet-400", trend: "+4 pts" },
            { label: "Activos", val: "247", color: "text-cyan-400", trend: "+12%" },
            { label: "En riesgo", val: "14", color: "text-red-400", trend: "↑3" },
            { label: "Próx. evento", val: "4 días", color: "text-yellow-400", trend: "34% conf." },
          ].map((s) => (
            <div key={s.label} className="bg-white/3 rounded-xl p-3">
              <p className={cn("text-lg font-black leading-none", s.color)}>{s.val}</p>
              <p className="text-[9px] text-muted-foreground mt-1">{s.label}</p>
              <p className="text-[9px] text-white/40 mt-0.5">{s.trend}</p>
            </div>
          ))}
        </div>
        {/* Mini cohortes */}
        <div className="mx-4 mb-4 grid grid-cols-3 gap-2">
          {[
            { name: "Gen. Omega", pct: 78, color: "#7C3AED" },
            { name: "Gen. Norte", pct: 58, color: "#f97316" },
            { name: "Vía 12", pct: 84, color: "#10b981" },
          ].map((c) => (
            <div key={c.name} className="bg-white/3 rounded-xl p-3 space-y-2">
              <p className="text-[10px] font-semibold text-white">{c.name}</p>
              <div className="h-1 rounded-full bg-white/8 overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${c.pct}%`, backgroundColor: c.color }} />
              </div>
              <p className="text-[9px] text-muted-foreground">{c.pct}% momentum</p>
            </div>
          ))}
        </div>
        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-[#0e0e1a] to-transparent pointer-events-none" />
      </div>
      <p className="text-center text-[11px] text-muted-foreground/60 mt-3">
        Vista del dueño · datos ficticios del demo
      </p>
    </motion.div>
  )
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

function Hero() {
  const { lang } = useLang()

  const c = lang === "en" ? {
    badge: "Software + implementation team for transformation centers",
    h1a: "Your center can grow",
    h1b: "2.4x",
    h1c: "in 12 months.",
    sub: "You know in real time who is about to drop out, how much money you lose per enrollment weekend, and what's holding back your next cohort.",
    subEm: "Without hiring more staff. Without changing your methodology.",
    cta1: "See the live demo",
    cta2: "Simulate my impact",
    stats: [
      { value: "+140%", label: "avg growth · 2.4x" },
      { value: "68%", label: "phase-to-phase conversion" },
      { value: "40+", label: "centers in Latin America" },
    ],
    social1: "40+ centers already operating with ELEVA",
    social2: "Trusted by directors and coaches",
    scroll: "How do they do it?",
  } : {
    badge: "Software + equipo de implementación para centros de transformación",
    h1a: "Tu centro puede crecer",
    h1b: "2.4 veces",
    h1c: "en 12 meses.",
    sub: "Sabes en tiempo real quién está a punto de abandonar, cuánto dinero pierdes por fin de semana de enrolamiento y qué frena a tu próxima generación.",
    subEm: "Sin contratar más staff. Sin cambiar tu metodología.",
    cta1: "Ver el demo en vivo",
    cta2: "Simular mi impacto",
    stats: [
      { value: "+140%", label: "crecimiento prom. · 2.4x" },
      { value: "68%", label: "conversión fase a fase" },
      { value: "40+", label: "centros en Latinoamérica" },
    ],
    social1: "40+ centros ya operan con ELEVA",
    social2: "Aprobado por directores y coaches",
    scroll: "¿Cómo lo logran?",
  }

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-6 text-center overflow-hidden pt-28 pb-16">
      {/* Glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-violet-600/10 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-cyan-600/6 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="relative max-w-4xl mx-auto w-full"
      >
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-600/15 border border-violet-500/30 text-violet-400 text-xs font-semibold mb-8"
        >
          <div className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
          {c.badge}
        </motion.div>

        {/* Headline */}
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-black text-foreground leading-[1.05] tracking-tight mb-6">
          {c.h1a}{" "}
          <span className="gradient-text">{c.h1b}</span>{" "}
          {c.h1c}
        </h1>

        {/* Sub-headline */}
        <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-10">
          {c.sub}{" "}
          <span className="text-foreground font-medium">{c.subEm}</span>
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-10">
          <Link href="/demo">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2 px-8 py-4 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-base font-bold transition-colors glow-violet shadow-lg shadow-violet-600/30"
            >
              {c.cta1}
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </Link>
          <Link href="/simulador">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2 px-6 py-3.5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-foreground rounded-xl text-sm font-semibold transition-all"
            >
              <BarChart3 className="w-4 h-4 text-violet-400" />
              {c.cta2}
            </motion.button>
          </Link>
        </div>

        {/* Stat pills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-wrap items-center justify-center gap-3 mb-6"
        >
          {c.stats.map(({ value, label }) => (
            <div
              key={label}
              className="flex items-center gap-2 px-4 py-2 rounded-full glass border border-white/8"
            >
              <span className="text-sm font-black text-foreground">{value}</span>
              <span className="text-xs text-muted-foreground">{label}</span>
            </div>
          ))}
        </motion.div>

        {/* Social proof */}
        <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground flex-wrap">
          <div className="flex items-center gap-2">
            <div className="flex -space-x-1">
              {[["GDL","bg-violet-600"],["MTY","bg-cyan-700"],["CDMX","bg-emerald-700"],["BA","bg-violet-800"]].map(([i, bg]) => (
                <div key={i} className={cn("w-7 h-7 rounded-full border-2 border-background flex items-center justify-center text-[8px] font-bold text-white", bg)}>
                  {i}
                </div>
              ))}
            </div>
            <span className="font-semibold text-foreground/80">{c.social1}</span>
          </div>
          <div className="hidden sm:flex items-center gap-1.5">
            <div className="flex gap-0.5">
              {[1,2,3,4,5].map((s) => (
                <Star key={s} className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <span>{c.social2}</span>
          </div>
        </div>

        {/* Product preview */}
        <ProductPreview />
      </motion.div>

      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute bottom-8 flex flex-col items-center gap-2 text-muted-foreground"
      >
        <span className="text-xs">{c.scroll}</span>
        <ChevronDown className="w-4 h-4" />
      </motion.div>
    </section>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function HomePage() {
  return (
    <>
      <Nav />
      <main className="pt-16">
        <Hero />
        <ForWhoSection />
        <ProblemSection />
        <NumbersSection />
        <GrowthEngineSection compact />
        <InsightsSection />
        <HowItWorksSection />
        <TodoIncluidoSection />
        <BuildTeaserSection />
        <TestimonialsSection />
        <PricingTeaser />
        <DemoSection />
        <FinalCTASection />
      </main>
      <Footer />
    </>
  )
}
