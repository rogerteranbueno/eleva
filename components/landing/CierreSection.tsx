"use client"

import { motion } from "framer-motion"
import { useInView } from "@/lib/use-in-view"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number]

export function CierreSection() {
  const { ref, inView } = useInView(0.1)

  return (
    <section ref={ref} className="py-32 px-6">
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, ease }}
        className="max-w-3xl mx-auto text-center space-y-8"
      >
        <div className="space-y-5">
          <p className="text-xs font-bold text-violet-400 uppercase tracking-widest">El primer paso</p>
          <h2 className="text-5xl sm:text-6xl lg:text-7xl font-black text-foreground leading-[1.05] tracking-tight">
            Empieza por saber<br />
            exactamente<br />
            <span className="text-muted-foreground font-light italic">dónde estás.</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
            El Diagnóstico 360 es tres semanas de revisión profunda: ventas, operación, equipo, continuidad y riesgos.
            Sales con un plan claro de 90 días.
          </p>
        </div>

        <Link href="/build">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center gap-2.5 px-8 py-4 bg-violet-600 hover:bg-violet-500 text-foreground font-black rounded-xl transition-colors text-base group shadow-lg shadow-violet-600/20"
          >
            Solicitar Diagnóstico 360
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </motion.button>
        </Link>

        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2 pt-2">
          {[
            "Llamada de calificación previa sin costo",
            "Te respondemos en menos de 24 horas",
            "Si no vemos fit, te lo decimos de frente",
          ].map((t) => (
            <p key={t} className="text-xs text-muted-foreground flex items-center gap-1.5">
              <span className="w-1 h-1 rounded-full bg-emerald-400 inline-block" />
              {t}
            </p>
          ))}
        </div>
      </motion.div>
    </section>
  )
}
