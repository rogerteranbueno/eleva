"use client"

import { motion } from "framer-motion"
import { useInView } from "@/lib/use-in-view"
import { GraduationCap, TrendingUp, LayoutDashboard, ShieldCheck } from "lucide-react"

const DIVISIONES = [
  {
    icon: GraduationCap,
    label: "ELEVA Academy",
    accent: "violet",
    headline: "Formación y certificación interna.",
    bullets: [
      "Entrenadores y coaches certificados",
      "Coordinadores y staff de sala",
      "Equipo de admisiones y ventas",
      "Líderes y directores de área",
      "Diseño de academia propia del centro",
    ],
  },
  {
    icon: TrendingUp,
    label: "ELEVA Growth",
    accent: "emerald",
    headline: "Estrategia para crecer sin improvisar.",
    bullets: [
      "Revenue, precios y nuevas fuentes de ingreso",
      "Expansión a nuevas sedes y ciudades",
      "Continuidad Básico → Avanzado → PL",
      "Programas post-PL y membresías",
      "Enrolamiento ético y comunidad activa",
    ],
  },
  {
    icon: LayoutDashboard,
    label: "ELEVA OS",
    accent: "blue",
    headline: "El sistema operativo del centro.",
    bullets: [
      "Dashboard de pulso en tiempo real",
      "Seguimiento por participante y generación",
      "Momentum Score y alertas de riesgo",
      "CRM, expedientes y comunicación",
      "Misiones, comunidad y especialistas",
    ],
  },
  {
    icon: ShieldCheck,
    label: "ELEVA Standards",
    accent: "amber",
    headline: "Protocolos, ética y calidad.",
    bullets: [
      "Manual de contingencias y seguridad",
      "Estándar de formación de entrenadores",
      "Auditorías operativas y de experiencia",
      "Medición de impacto a 30/90/180 días",
      "Ética profesional y protección al participante",
    ],
  },
]

const ACCENT: Record<string, { card: string; icon: string; badge: string; dot: string }> = {
  violet:  { card: "hover:border-violet-500/35",  icon: "text-violet-400 bg-violet-500/10",  badge: "bg-violet-500/10 text-violet-300 border-violet-500/20",  dot: "bg-violet-500" },
  emerald: { card: "hover:border-emerald-500/35", icon: "text-emerald-400 bg-emerald-500/10", badge: "bg-emerald-500/10 text-emerald-300 border-emerald-500/20", dot: "bg-emerald-500" },
  blue:    { card: "hover:border-blue-500/35",    icon: "text-blue-400 bg-blue-500/10",       badge: "bg-blue-500/10 text-blue-300 border-blue-500/20",          dot: "bg-blue-500" },
  amber:   { card: "hover:border-amber-500/35",   icon: "text-amber-400 bg-amber-500/10",     badge: "bg-amber-500/10 text-amber-300 border-amber-500/20",        dot: "bg-amber-500" },
}

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.09, duration: 0.55, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  }),
}

export function DivisionesSection() {
  const { ref, inView } = useInView(0.1)

  return (
    <section ref={ref} className="py-24 px-6 max-w-6xl mx-auto">
      <motion.div initial="hidden" animate={inView ? "visible" : "hidden"} className="space-y-12">
        <motion.div custom={0} variants={fadeUp} className="text-center max-w-2xl mx-auto">
          <p className="text-xs font-bold text-violet-400 uppercase tracking-widest mb-4">
            Una infraestructura completa
          </p>
          <h2 className="text-4xl sm:text-5xl font-black text-white leading-tight mb-4">
            Cuatro divisiones.<br />
            <span className="text-muted-foreground font-light">Un solo ecosistema.</span>
          </h2>
          <p className="text-muted-foreground text-base">
            No optimizamos una parte del centro. Instalamos un sistema para todo el ciclo.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {DIVISIONES.map((d, i) => {
            const a = ACCENT[d.accent]
            const Icon = d.icon
            return (
              <motion.div
                key={d.label}
                custom={i + 1}
                variants={fadeUp}
                className={`glass rounded-2xl p-6 border border-white/8 transition-colors ${a.card} space-y-5`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${a.icon}`}>
                    <Icon className="w-4.5 h-4.5" />
                  </div>
                  <span className={`text-[10px] px-2.5 py-1 rounded-full border font-bold uppercase tracking-wider ${a.badge}`}>
                    {d.label}
                  </span>
                </div>
                <div>
                  <p className="font-black text-white text-base mb-4">{d.headline}</p>
                  <ul className="space-y-2">
                    {d.bullets.map((b) => (
                      <li key={b} className="flex items-center gap-2.5 text-xs text-foreground/75">
                        <div className={`w-1 h-1 rounded-full flex-shrink-0 ${a.dot}`} />
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            )
          })}
        </div>
      </motion.div>
    </section>
  )
}
