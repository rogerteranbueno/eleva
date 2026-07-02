"use client"

import { motion } from "framer-motion"
import { useInView } from "@/lib/use-in-view"
import { GraduationCap, Settings2, ShieldCheck } from "lucide-react"

const PILLARS = [
  {
    icon: GraduationCap,
    accent: "violet",
    label: "Formación",
    headline: "Entrenadores que conocen su oficio.",
    body: "Coaches, coordinadores, admisiones, staff de sala y directores certificados bajo estándares propios del centro.",
  },
  {
    icon: Settings2,
    accent: "blue",
    label: "Sistema",
    headline: "Procesos que no dependen de la memoria.",
    body: "Tecnología, seguimiento, dashboards, continuidad y datos para tomar decisiones con claridad, no por intuición.",
  },
  {
    icon: ShieldCheck,
    accent: "amber",
    label: "Estándar",
    headline: "Calidad que puede prometerse y medirse.",
    body: "Protocolos, ética, seguridad psicológica, auditorías y métricas de impacto que sostienen las promesas que se hacen en sala.",
  },
]

const ACCENT: Record<string, { icon: string; badge: string; border: string }> = {
  violet: {
    icon: "text-violet-400",
    badge: "bg-violet-500/10 text-violet-300 border-violet-500/20",
    border: "border-violet-500/20 hover:border-violet-500/40",
  },
  blue: {
    icon: "text-blue-400",
    badge: "bg-blue-500/10 text-blue-300 border-blue-500/20",
    border: "border-blue-500/20 hover:border-blue-500/40",
  },
  amber: {
    icon: "text-amber-400",
    badge: "bg-amber-500/10 text-amber-300 border-amber-500/20",
    border: "border-amber-500/20 hover:border-amber-500/40",
  },
}

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.55, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  }),
}

export function TesisSection() {
  const { ref, inView } = useInView(0.15)

  return (
    <section ref={ref} className="py-24 px-6 max-w-6xl mx-auto">
      <motion.div initial="hidden" animate={inView ? "visible" : "hidden"} className="space-y-14">
        {/* Header */}
        <motion.div custom={0} variants={fadeUp} className="text-center max-w-2xl mx-auto">
          <p className="text-xs font-bold text-violet-400 uppercase tracking-widest mb-4">
            La tesis de ELEVA
          </p>
          <h2 className="text-4xl sm:text-5xl font-black text-white leading-tight mb-4">
            No venimos a reemplazar tu esencia.
          </h2>
          <p className="text-2xl text-muted-foreground font-light">
            La volvemos entrenable, medible y escalable.
          </p>
        </motion.div>

        {/* Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {PILLARS.map((p, i) => {
            const a = ACCENT[p.accent]
            const Icon = p.icon
            return (
              <motion.div
                key={p.label}
                custom={i + 1}
                variants={fadeUp}
                className={`glass rounded-2xl p-7 border transition-colors space-y-5 ${a.border}`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center ${a.icon}`}>
                    <Icon className="w-4.5 h-4.5" />
                  </div>
                  <span className={`text-[11px] px-2.5 py-1 rounded-full border font-bold uppercase tracking-wider ${a.badge}`}>
                    {p.label}
                  </span>
                </div>
                <div>
                  <p className="font-black text-white text-lg leading-snug mb-2">{p.headline}</p>
                  <p className="text-base text-muted-foreground leading-relaxed">{p.body}</p>
                </div>
              </motion.div>
            )
          })}
        </div>
      </motion.div>
    </section>
  )
}
