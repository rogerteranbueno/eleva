"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useInView } from "@/lib/use-in-view"
import Link from "next/link"
import { ArrowRight, Check, ShieldCheck } from "lucide-react"

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number]

const ERAS = [
  {
    year: "1960s",
    name: "Movimiento\ndel potencial",
    color: "text-sky-400",
    bg: "bg-sky-500/8 border-sky-500/20",
    dot: "bg-sky-500",
    note: "Maslow · Esalen · Rogers",
  },
  {
    year: "1971",
    name: "est →\nLandmark",
    color: "text-amber-400",
    bg: "bg-amber-500/8 border-amber-500/20",
    dot: "bg-amber-500",
    note: "Werner Erhard · 600K personas",
  },
  {
    year: "1974",
    name: "Lifespring",
    color: "text-orange-400",
    bg: "bg-orange-500/8 border-orange-500/20",
    dot: "bg-orange-500",
    note: "Grupos grandes · controversias documentadas",
  },
  {
    year: "90s–2000s",
    name: "LATAM:\nadaptaciones",
    color: "text-rose-400",
    bg: "bg-rose-500/8 border-rose-500/20",
    dot: "bg-rose-500",
    note: "México · Colombia · Argentina",
  },
  {
    year: "2024",
    name: "ELEVA",
    color: "text-violet-300",
    bg: "bg-violet-600/15 border-violet-500/40",
    dot: "bg-violet-500",
    note: "Estándar profesional · medible · ético",
    highlight: true,
  },
]

const LEGACY = [
  "El poder de los grupos grandes para transformar",
  "La inmersión como acelerador del cambio",
  "La comunidad como sostén del proceso",
  "El compromiso público como herramienta",
]

const DIFERENTE = [
  "Sin presión psicológica ni dinámicas de influencia",
  "Coach formado y supervisado, no carismático",
  "Resultados medibles, no solo testimonios",
  "Transparencia radical: fuentes, riesgos y límites",
]

export function HistoriaTeaserSection() {
  const { ref, inView } = useInView(0.1)
  const [activeEra, setActiveEra] = useState<number | null>(null)

  return (
    <section ref={ref} className="py-20 px-4 sm:px-6 overflow-hidden">
      <div className="max-w-5xl mx-auto space-y-12">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease }}
          className="text-center space-y-3"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">
              60 años de industria
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-foreground leading-tight">
            Estudiamos el pasado<br />
            <span className="text-muted-foreground font-light italic">para no repetirlo.</span>
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto text-sm sm:text-base leading-relaxed">
            est, Lifespring, Landmark. Estos programas entrenaron a millones — y dejaron lecciones
            poderosas, buenas y malas. ELEVA construye desde ambas.
          </p>
        </motion.div>

        {/* Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65, ease, delay: 0.15 }}
          className="relative"
        >
          {/* Line */}
          <div className="absolute top-6 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent hidden sm:block" />

          <div className="grid grid-cols-5 gap-2 sm:gap-3">
            {ERAS.map((era, i) => (
              <button
                key={era.year}
                onClick={() => setActiveEra(activeEra === i ? null : i)}
                className={`relative flex flex-col items-center gap-2 p-2 sm:p-3 rounded-xl border transition-all duration-200 text-center group ${
                  era.highlight
                    ? "bg-violet-600/15 border-violet-500/40 shadow-[0_0_20px_rgba(124,58,237,0.15)]"
                    : "border-white/6 hover:border-white/15 bg-white/2 hover:bg-white/4"
                } ${activeEra === i ? "scale-105" : ""}`}
              >
                {/* Dot */}
                <div className={`w-2.5 h-2.5 rounded-full ${era.dot} ${era.highlight ? "shadow-[0_0_8px_rgba(124,58,237,0.8)]" : ""}`} />

                {/* Year */}
                <span className={`text-[10px] sm:text-xs font-bold ${era.color} leading-tight`}>
                  {era.year}
                </span>

                {/* Name */}
                <span className={`text-[10px] sm:text-[11px] font-semibold text-foreground leading-tight whitespace-pre-line ${era.highlight ? "text-violet-100" : ""}`}>
                  {era.name}
                </span>

                {/* Note — only on active or hover */}
                <span className={`text-[9px] sm:text-[10px] text-muted-foreground leading-snug transition-opacity ${activeEra === i ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}>
                  {era.note}
                </span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Contrast columns */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65, ease, delay: 0.25 }}
          className="grid sm:grid-cols-2 gap-4"
        >
          {/* Lo que tomamos */}
          <div className="rounded-2xl border border-amber-500/15 bg-amber-500/4 p-5 sm:p-6 space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-lg">💡</span>
              <p className="text-xs font-bold text-amber-400 uppercase tracking-widest">Lo que heredamos</p>
            </div>
            <ul className="space-y-2.5">
              {LEGACY.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-foreground">
                  <Check className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Lo que no repetimos */}
          <div className="rounded-2xl border border-violet-500/20 bg-violet-500/4 p-5 sm:p-6 space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-lg">🛡️</span>
              <p className="text-xs font-bold text-violet-400 uppercase tracking-widest">Lo que construimos diferente</p>
            </div>
            <ul className="space-y-2.5">
              {DIFERENTE.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-foreground">
                  <ShieldCheck className="w-4 h-4 text-violet-400 flex-shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, ease, delay: 0.4 }}
          className="text-center"
        >
          <Link href="/historia-transformacion">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-2.5 px-6 py-3 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 hover:border-amber-400/50 text-amber-300 font-bold rounded-xl transition-all duration-200 group text-sm"
            >
              Ver historia completa y fuentes académicas
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </motion.button>
          </Link>
          <p className="text-xs text-muted-foreground mt-3">
            Con referencias a Wikipedia, Washington Post, NYT y estudios de salud mental
          </p>
        </motion.div>

      </div>
    </section>
  )
}
