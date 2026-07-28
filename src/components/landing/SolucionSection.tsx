"use client"

import { motion } from "framer-motion"
import { useInView } from "@/lib/use-in-view"
import { GraduationCap, LayoutDashboard, TrendingUp } from "lucide-react"

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number]

const PASOS = [
  {
    num: "01",
    icon: GraduationCap,
    title: "Formamos a tu gente",
    body: "Coaches internos que saben facilitar, no solo asistir. Staff con roles claros y evaluados. Sin depender de freelancers que no conocen tu metodología.",
    accent: "violet",
  },
  {
    num: "02",
    icon: LayoutDashboard,
    title: "Ordenamos tu operación",
    body: "Procesos documentados, seguimiento activo y datos de quién está en riesgo y quién está listo para el siguiente paso. Todo en un solo panel.",
    accent: "cyan",
  },
  {
    num: "03",
    icon: TrendingUp,
    title: "Construimos el crecimiento",
    body: "Más continuidad entre programas, segunda sede con el mismo sistema, más ingresos sin más horas tuyas. Crecimiento que no depende de que tú estés.",
    accent: "emerald",
  },
]

const ACCENTS: Record<string, { icon: string; num: string; box: string }> = {
  violet:  { icon: "text-violet-400",  num: "text-violet-500/40", box: "bg-violet-500/10 border-violet-500/20" },
  cyan:    { icon: "text-cyan-400",    num: "text-cyan-500/40",   box: "bg-cyan-500/10 border-cyan-500/20" },
  emerald: { icon: "text-emerald-400", num: "text-emerald-500/40", box: "bg-emerald-500/10 border-emerald-500/20" },
}

export function SolucionSection() {
  const { ref, inView } = useInView(0.1)

  return (
    <section id="como-funciona" ref={ref} className="py-20 px-6 max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, ease }}
        className="mb-12"
      >
        <p className="text-xs font-bold text-violet-400 uppercase tracking-widest mb-3">La respuesta</p>
        <h2 className="text-4xl sm:text-5xl font-black text-foreground leading-tight max-w-xl">
          ELEVA hace tres cosas,<br />
          <span className="text-muted-foreground font-light">en este orden.</span>
        </h2>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {PASOS.map((p, i) => {
          const a = ACCENTS[p.accent]
          return (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.55, ease, delay: i * 0.1 }}
              className="glass rounded-2xl border border-foreground/8 p-7 space-y-5"
            >
              <div className="flex items-center justify-between">
                <div className={`w-11 h-11 rounded-xl border flex items-center justify-center ${a.box}`}>
                  <p.icon className={`w-5 h-5 ${a.icon}`} />
                </div>
                <span className={`text-4xl font-black tabular-nums ${a.num}`}>{p.num}</span>
              </div>
              <p className="text-lg font-black text-foreground leading-snug">{p.title}</p>
              <p className="text-sm text-muted-foreground leading-relaxed">{p.body}</p>
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}
