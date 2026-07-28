"use client"

import { motion } from "framer-motion"
import { useInView } from "@/lib/use-in-view"
import { UserX, EyeOff, Layers } from "lucide-react"

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number]

const PROBLEMAS = [
  {
    icon: UserX,
    title: "El dueño es el cuello de botella",
    body: "Tú facilitas, vendes y administras al mismo tiempo. Cuando fallas o te vas, el centro se detiene. No es sostenible y los dos lo saben.",
    color: "text-red-400",
    bg: "bg-red-500/5 border-red-500/15",
  },
  {
    icon: EyeOff,
    title: "Sin datos, sin defensa",
    body: "Sabes que alguien abandona cuando ya se fue. No hay nada que detecte quién está en riesgo antes — ni quién está listo para el siguiente programa.",
    color: "text-orange-400",
    bg: "bg-orange-500/5 border-orange-500/15",
  },
  {
    icon: Layers,
    title: "Metodología que no se transfiere",
    body: "Cada coach enseña diferente porque el cómo está en tu cabeza, no en un sistema. Si el coach estrella se va, se lleva la mitad del centro.",
    color: "text-amber-400",
    bg: "bg-amber-500/5 border-amber-500/15",
  },
]

export function ProblemaSection() {
  const { ref, inView } = useInView(0.1)

  return (
    <section id="problema" ref={ref} className="py-20 px-6 max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, ease }}
        className="text-center mb-12"
      >
        <p className="text-xs font-bold text-muted-foreground/60 uppercase tracking-widest mb-3">
          Lo que frena a los mejores centros
        </p>
        <h2 className="text-4xl sm:text-5xl font-black text-foreground leading-tight">
          No es la metodología.<br />
          <span className="text-muted-foreground font-light italic">Es la organización detrás.</span>
        </h2>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {PROBLEMAS.map((p, i) => (
          <motion.div
            key={p.title}
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55, ease, delay: i * 0.1 }}
            className={`rounded-2xl border p-6 space-y-4 ${p.bg}`}
          >
            <p.icon className={`w-6 h-6 ${p.color}`} />
            <p className="text-base font-black text-foreground leading-snug">{p.title}</p>
            <p className="text-sm text-muted-foreground leading-relaxed">{p.body}</p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
