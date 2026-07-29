"use client"

import { motion } from "framer-motion"
import { useInView } from "@/lib/use-in-view"
import Link from "next/link"
import { ArrowRight, Users, TrendingUp, DollarSign } from "lucide-react"

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number]

const STATS = [
  { icon: Users,      before: "89",   after: "247",    label: "participantes activos" },
  { icon: TrendingUp, before: "28%",  after: "8%",     label: "churn mes 1" },
  { icon: DollarSign, before: "$38k", after: "$112k",  label: "ingresos / mes" },
]

export function CasoTeaserSection() {
  const { ref, inView } = useInView(0.1)

  return (
    <section ref={ref} className="py-20 px-6 max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.65, ease }}
        className="rounded-3xl border border-violet-500/20 bg-violet-600/5 overflow-hidden"
      >
        {/* Top label */}
        <div className="border-b border-violet-500/12 px-8 py-4 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-violet-400 animate-pulse" />
            <span className="text-xs font-bold text-violet-400 uppercase tracking-widest">Caso real · NDA</span>
          </div>
          <span className="text-xs text-muted-foreground">Centro de transformación · Medellín, Colombia · 12 meses</span>
        </div>

        <div className="p-8 sm:p-10 space-y-8">
          {/* Pull quote */}
          <p className="text-2xl sm:text-3xl font-black text-foreground leading-snug max-w-2xl">
            "Pasé de ser el único coach de mi centro a tener tres coaches formados y abrir una segunda sede.
            Sin cambiar la metodología.{" "}
            <span className="text-violet-300">Cambiando la organización."</span>
          </p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 sm:gap-6 max-w-lg">
            {STATS.map((s) => (
              <div key={s.label} className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-foreground/40 tabular-nums">{s.before}</span>
                  <span className="text-foreground/20 text-xs">→</span>
                  <span className="text-lg font-black text-violet-300 tabular-nums">{s.after}</span>
                </div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Link */}
          <Link
            href="/caso"
            className="inline-flex items-center gap-2 text-sm font-bold text-violet-400 hover:text-violet-300 transition-colors group"
          >
            Leer el caso completo
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </motion.div>
    </section>
  )
}
