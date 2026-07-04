"use client"

import { motion } from "framer-motion"
import { useInView } from "@/lib/use-in-view"
import { TrendingUp, GraduationCap, Users, LayoutDashboard, ShieldAlert } from "lucide-react"

const MARCOS = [
  {
    icon: TrendingUp,
    name: "Center Maturity Model™",
    short: "CMM",
    accent: "violet",
    description:
      "5 niveles que determinan en qué etapa de madurez se encuentra un centro, desde operación reactiva hasta institución escalable. La base de todo diagnóstico ELEVA.",
    levels: ["Reactivo", "Estabilizado", "Sistematizado", "Escalable", "Institucional"],
  },
  {
    icon: GraduationCap,
    name: "Trainer Readiness Standard™",
    short: "TRS",
    accent: "blue",
    description:
      "El estándar que define qué hace a un entrenador listo para liderar sala. Incluye competencias técnicas, presencia, intervención ética y conocimiento operativo.",
    levels: ["Observador", "Asistente", "Entrenador Jr.", "Entrenador Senior", "Formador"],
  },
  {
    icon: Users,
    name: "Participant Continuity System™",
    short: "PCS",
    accent: "emerald",
    description:
      "El modelo de seguimiento que mantiene a los participantes avanzando de básico a avanzado a nivel 3, y de ahí a la comunidad activa. Medible en cada transición.",
    levels: ["Básico", "Avanzado", "Nivel 3", "Graduado", "Champion"],
  },
  {
    icon: LayoutDashboard,
    name: "Transformation OS™",
    short: "TOS",
    accent: "amber",
    description:
      "La arquitectura operativa del centro: datos, dashboards, flujos de seguimiento, comunicación y comunidad integrados en un solo sistema.",
    levels: ["Admisiones", "Activación", "Retención", "Comunidad", "Revolución"],
  },
  {
    icon: ShieldAlert,
    name: "Risk & Contingency Protocol™",
    short: "RCP",
    accent: "red",
    description:
      "El sistema de gestión de riesgo operativo y psicológico: identificación temprana, respuesta graduada, protocolos de sala y comunicación con participantes.",
    levels: ["Monitoreo", "Señal temprana", "Intervención", "Seguimiento", "Cierre"],
  },
]

const ACCENT: Record<string, { badge: string; card: string; pill: string; dot: string }> = {
  violet:  { badge: "bg-violet-500/10 text-violet-300 border-violet-500/20",  card: "hover:border-violet-500/25",  pill: "bg-violet-500/8 text-violet-400 border-violet-500/15",  dot: "bg-violet-500" },
  blue:    { badge: "bg-blue-500/10 text-blue-300 border-blue-500/20",        card: "hover:border-blue-500/25",    pill: "bg-blue-500/8 text-blue-400 border-blue-500/15",        dot: "bg-blue-500" },
  emerald: { badge: "bg-emerald-500/10 text-emerald-300 border-emerald-500/20", card: "hover:border-emerald-500/25", pill: "bg-emerald-500/8 text-emerald-400 border-emerald-500/15", dot: "bg-emerald-500" },
  amber:   { badge: "bg-amber-500/10 text-amber-300 border-amber-500/20",     card: "hover:border-amber-500/25",   pill: "bg-amber-500/8 text-amber-400 border-amber-500/15",     dot: "bg-amber-500" },
  red:     { badge: "bg-red-500/10 text-red-300 border-red-500/20",           card: "hover:border-red-500/25",     pill: "bg-red-500/8 text-red-400 border-red-500/15",           dot: "bg-red-500" },
}

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  }),
}

export function MarcosSection() {
  const { ref, inView } = useInView(0.06)

  return (
    <section ref={ref} className="py-24 px-6 max-w-6xl mx-auto">
      <motion.div initial="hidden" animate={inView ? "visible" : "hidden"} className="space-y-12">
        <motion.div custom={0} variants={fadeUp} className="text-center max-w-2xl mx-auto space-y-3">
          <p className="text-xs font-bold text-violet-400 uppercase tracking-widest">
            Marcos de referencia propietarios
          </p>
          <h2 className="text-4xl sm:text-5xl font-black text-foreground leading-tight">
            No opiniones.<br />
            <span className="text-muted-foreground font-light">Estándares con nombre propio.</span>
          </h2>
          <p className="text-muted-foreground text-base">
            Cinco frameworks desarrollados a partir del trabajo con centros de transformación en LATAM. La base intelectual detrás de cada implementación ELEVA.
          </p>
        </motion.div>

        <div className="space-y-4">
          {MARCOS.map((m, i) => {
            const a = ACCENT[m.accent]
            const Icon = m.icon
            return (
              <motion.div
                key={m.name}
                custom={i + 1}
                variants={fadeUp}
                className={`glass rounded-2xl border border-foreground/6 transition-colors p-6 ${a.card}`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start gap-5">
                  {/* Left */}
                  <div className="flex items-start gap-3 sm:w-72 flex-shrink-0">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 bg-foreground/5`}>
                      <Icon className={`w-4.5 h-4.5 ${a.badge.split(" ")[1]}`} />
                    </div>
                    <div>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full border font-bold uppercase tracking-wider ${a.badge}`}>
                        {m.short}
                      </span>
                      <p className="font-black text-foreground text-sm leading-snug mt-1.5">{m.name}</p>
                    </div>
                  </div>

                  {/* Middle */}
                  <p className="text-xs text-muted-foreground leading-relaxed flex-1">{m.description}</p>

                  {/* Right: levels */}
                  <div className="flex flex-wrap gap-1.5 sm:justify-end sm:w-64 flex-shrink-0">
                    {m.levels.map((l, li) => (
                      <span key={l} className={`text-[10px] px-2.5 py-1 rounded-full border font-bold flex items-center gap-1.5 ${a.pill}`}>
                        <span className="text-muted-foreground font-normal">{li + 1}.</span> {l}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        <motion.div custom={6} variants={fadeUp} className="text-center">
          <p className="text-xs text-muted-foreground">
            Todos los marcos son parte del sistema de implementación PACTO y están incluidos en la documentación del centro.
          </p>
        </motion.div>
      </motion.div>
    </section>
  )
}
