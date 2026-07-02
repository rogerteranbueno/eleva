"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowRight, ChevronDown } from "lucide-react"

const PILLARS = ["Academia", "Consultoría", "Operación", "Datos", "Comunidad"]

const STATS = [
  { value: "+$500M", label: "mercado LATAM de transformación" },
  { value: "40+", label: "centros operando con ELEVA" },
  { value: "3.2x", label: "crecimiento promedio con sistema" },
]

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-6 text-center overflow-hidden pt-28 pb-20">
      {/* Glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-violet-600/8 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-indigo-600/5 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
        className="relative max-w-5xl mx-auto w-full"
      >
        {/* Pill badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15 }}
          className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-violet-600/12 border border-violet-500/25 text-violet-300 text-xs font-semibold mb-10 tracking-wide"
        >
          <div className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
          La primera firma institucional para centros de transformación en LATAM
        </motion.div>

        {/* Headline */}
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-black text-foreground leading-[1.04] tracking-tight mb-6 max-w-4xl mx-auto">
          Convierte tu centro de transformación en una{" "}
          <span className="gradient-text">institución escalable.</span>
        </h1>

        {/* Sub */}
        <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-4">
          ELEVA forma entrenadores, profesionaliza equipos e instala sistemas de crecimiento
          para centros que quieren expandirse sin perder su esencia.
        </p>

        {/* Pillar pills */}
        <div className="flex items-center justify-center gap-2 flex-wrap mb-10">
          {PILLARS.map((p, i) => (
            <span key={p} className="text-[11px] text-muted-foreground/70 font-medium">
              {p}{i < PILLARS.length - 1 && <span className="ml-2 text-foreground/15">·</span>}
            </span>
          ))}
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-14">
          <Link href="/build">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2 px-8 py-4 bg-violet-600 hover:bg-violet-500 text-foreground rounded-xl text-base font-bold transition-colors shadow-lg shadow-violet-600/25 glow-violet"
            >
              Agendar diagnóstico
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </Link>
          <a href="#programas">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-2 px-6 py-3.5 bg-foreground/5 hover:bg-foreground/8 border border-foreground/10 hover:border-foreground/18 text-foreground rounded-xl text-sm font-semibold transition-all"
            >
              Ver programas
            </motion.button>
          </a>
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl mx-auto"
        >
          {STATS.map(({ value, label }) => (
            <div key={label} className="text-center">
              <p className="text-3xl font-black text-foreground mb-1">{value}</p>
              <p className="text-xs text-muted-foreground leading-snug">{label}</p>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll hint */}
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2.2 }}
        className="absolute bottom-8 flex flex-col items-center gap-2 text-muted-foreground/50"
      >
        <span className="text-[10px] uppercase tracking-widest">Lo que te trajo hasta aquí</span>
        <ChevronDown className="w-4 h-4" />
      </motion.div>
    </section>
  )
}
