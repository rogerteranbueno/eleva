"use client"

import { motion } from "framer-motion"
import { useInView } from "@/lib/use-in-view"
import { GraduationCap, LayoutDashboard, TrendingUp } from "lucide-react"

const BLOQUES = [
  {
    icon: GraduationCap,
    title: "Formamos a tu gente",
    body: "Entrenadores, coaches, staff, admisiones y dirección. Habilidades que sí se pueden ver y evaluar, no diplomas por asistencia.",
    accent: "violet",
  },
  {
    icon: LayoutDashboard,
    title: "Ordenamos tu operación",
    body: "Procesos, seguimiento, métricas y una plataforma para ver qué está pasando. Todo lo necesario para operar mejor.",
    accent: "cyan",
  },
  {
    icon: TrendingUp,
    title: "Diseñamos tu crecimiento",
    body: "Más continuidad entre programas, más comunidad activa y mejor base para abrir nuevas sedes sin empezar de cero.",
    accent: "emerald",
  },
]

const ACCENTS: Record<string, { icon: string; box: string }> = {
  violet:  { icon: "text-violet-400",  box: "bg-violet-500/10 border-violet-500/20" },
  cyan:    { icon: "text-cyan-400",    box: "bg-cyan-500/10 border-cyan-500/20" },
  emerald: { icon: "text-emerald-400", box: "bg-emerald-500/10 border-emerald-500/20" },
}

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.55, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  }),
}

export function QueHaceSection() {
  const { ref, inView } = useInView(0.12)

  return (
    <section id="como-funciona" ref={ref} className="py-24 px-6 max-w-6xl mx-auto">
      <motion.div initial="hidden" animate={inView ? "visible" : "hidden"} className="space-y-12">
        <motion.div custom={0} variants={fadeUp} className="max-w-2xl">
          <p className="text-xs font-bold text-violet-400 uppercase tracking-widest mb-4">
            Cómo funciona
          </p>
          <h2 className="text-4xl sm:text-5xl font-black text-foreground leading-tight mb-4">
            ¿Qué hace ELEVA?
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Tres cosas, en este orden: formar, ordenar y crecer.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {BLOQUES.map((b, i) => {
            const a = ACCENTS[b.accent]
            return (
              <motion.div
                key={b.title}
                custom={i + 1}
                variants={fadeUp}
                className="glass rounded-2xl border border-foreground/8 p-7 space-y-4"
              >
                <div className={`w-11 h-11 rounded-xl border flex items-center justify-center ${a.box}`}>
                  <b.icon className={`w-5 h-5 ${a.icon}`} />
                </div>
                <p className="text-xl font-black text-foreground leading-snug">{b.title}</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{b.body}</p>
              </motion.div>
            )
          })}
        </div>
      </motion.div>
    </section>
  )
}
