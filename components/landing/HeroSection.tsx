"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowRight, ChevronDown, Building2, GraduationCap } from "lucide-react"

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number]

export function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex flex-col items-center justify-center px-6 text-center overflow-hidden pt-28 pb-20">
      {/* Glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-violet-600/8 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-indigo-600/5 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.75, ease }}
        className="relative max-w-4xl mx-auto w-full"
      >
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, ease }}
          className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-violet-600/12 border border-violet-500/25 text-violet-300 text-xs font-semibold mb-10 tracking-wide"
        >
          <div className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
          Para centros de transformación en LATAM
        </motion.div>

        {/* Headline */}
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-black text-foreground leading-[1.04] tracking-tight mb-5 max-w-4xl mx-auto">
          Tu metodología funciona.{" "}
          <span className="gradient-text">El centro todavía depende solo de ti.</span>
        </h1>

        {/* Sub */}
        <p className="text-lg sm:text-xl text-muted-foreground max-w-xl mx-auto leading-relaxed mb-8">
          El límite de los mejores centros no es la metodología — es la organización detrás de ella.
          ELEVA forma tu equipo, ordena tu operación e instala los datos para crecer.
        </p>

        {/* Path cards */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.55, ease }}
          className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto mb-10"
        >
          <a
            href="#problema"
            className="group flex-1 flex items-center gap-4 text-left px-5 py-4 rounded-xl border border-violet-500/25 bg-violet-500/6 hover:bg-violet-500/12 hover:border-violet-500/45 transition-all"
          >
            <div className="w-9 h-9 rounded-lg bg-violet-500/15 flex items-center justify-center flex-shrink-0">
              <Building2 className="w-4 h-4 text-violet-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-foreground">Dirijo un centro</p>
              <p className="text-xs text-muted-foreground leading-snug mt-0.5">Quiero ordenar operación, equipo y crecimiento</p>
            </div>
            <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-violet-400 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
          </a>

          <Link
            href="/academia"
            className="group flex-1 flex items-center gap-4 text-left px-5 py-4 rounded-xl border border-foreground/8 bg-foreground/3 hover:bg-foreground/6 hover:border-foreground/15 transition-all"
          >
            <div className="w-9 h-9 rounded-lg bg-foreground/8 flex items-center justify-center flex-shrink-0">
              <GraduationCap className="w-4 h-4 text-foreground/60" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-foreground">Soy coach o entrenador</p>
              <p className="text-xs text-muted-foreground leading-snug mt-0.5">Quiero certificarme y mejorar mi facilitación</p>
            </div>
            <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground group-hover:translate-x-0.5 transition-all flex-shrink-0" />
          </Link>
        </motion.div>

        {/* Primary CTA */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.38, duration: 0.5, ease }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3"
        >
          <Link href="/build">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2 px-8 py-4 bg-violet-600 hover:bg-violet-500 text-foreground rounded-xl text-base font-bold transition-colors shadow-lg shadow-violet-600/25 glow-violet"
            >
              Solicitar diagnóstico
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </Link>
          <a href="#como-empezar">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-2 px-6 py-3.5 bg-foreground/5 hover:bg-foreground/8 border border-foreground/10 hover:border-foreground/18 text-foreground rounded-xl text-sm font-semibold transition-all"
            >
              Ver cómo funciona
            </motion.button>
          </a>
        </motion.div>
      </motion.div>

      {/* Scroll hint */}
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2.2 }}
        className="absolute bottom-8 flex flex-col items-center gap-2 text-muted-foreground/40"
      >
        <ChevronDown className="w-4 h-4" />
      </motion.div>
    </section>
  )
}
