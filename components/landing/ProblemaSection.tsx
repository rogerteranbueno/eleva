"use client"

import { motion } from "framer-motion"
import { useInView } from "@/lib/use-in-view"
import { X } from "lucide-react"

const SINTOMAS = [
  "Las inscripciones llegan por WhatsApp y nadie sabe exactamente cuántas hay.",
  "El expediente del participante vive en una hoja de Excel que nadie actualiza.",
  "El seguimiento post-entrenamiento depende del criterio —y la memoria— del coach.",
  "El PL termina y no hay sistema para sostener lo que se prometió en sala.",
  "No sabes quién está perdiendo momentum hasta que ya abandonó.",
  "El crecimiento depende casi por completo de que la última generación enrole bien.",
]

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  }),
}

export function ProblemaSection() {
  const { ref, inView } = useInView(0.15)

  return (
    <section ref={ref} className="py-24 px-6 max-w-5xl mx-auto">
      <motion.div
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        className="space-y-12"
      >
        {/* Header */}
        <motion.div custom={0} variants={fadeUp} className="max-w-3xl">
          <p className="text-xs font-bold text-violet-400 uppercase tracking-widest mb-4">
            El estado natural de la industria
          </p>
          <h2 className="text-4xl sm:text-5xl font-black text-white leading-tight mb-6">
            Lo que te trajo hasta aquí no necesariamente{" "}
            <span className="text-muted-foreground font-normal">
              te llevará a la siguiente etapa.
            </span>
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Los centros de transformación nacen desde una sala poderosa.
            Pero crecen cuando esa sala se convierte en sistema.
          </p>
        </motion.div>

        {/* Síntomas */}
        <motion.div custom={1} variants={fadeUp} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {SINTOMAS.map((s, i) => (
            <motion.div
              key={i}
              custom={i + 2}
              variants={fadeUp}
              className="flex items-start gap-3 px-4 py-3.5 rounded-xl bg-red-500/5 border border-red-500/12"
            >
              <div className="w-5 h-5 rounded-full bg-red-500/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                <X className="w-2.5 h-2.5 text-red-400" />
              </div>
              <p className="text-sm text-foreground/80 leading-snug">{s}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Remate */}
        <motion.div custom={8} variants={fadeUp} className="border-l-2 border-violet-500/40 pl-6 max-w-2xl">
          <p className="text-xl font-bold text-white leading-snug">
            No es falta de compromiso.
          </p>
          <p className="text-xl text-muted-foreground leading-snug">
            Es falta de estructura.
          </p>
        </motion.div>
      </motion.div>
    </section>
  )
}
