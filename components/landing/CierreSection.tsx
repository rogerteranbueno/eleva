"use client"

import { motion } from "framer-motion"
import { useInView } from "@/lib/use-in-view"
import Link from "next/link"
import { ArrowRight, Calendar } from "lucide-react"

export function CierreSection() {
  const { ref, inView } = useInView(0.1)

  return (
    <section ref={ref} className="py-32 px-6">
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
        className="max-w-4xl mx-auto"
      >
        {/* Decorative rule */}
        <div className="flex items-center gap-4 mb-16 max-w-xs mx-auto sm:max-w-none">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-foreground/10 to-transparent" />
          <div className="w-1 h-1 rounded-full bg-violet-400" />
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-foreground/10 to-transparent" />
        </div>

        <div className="text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
            className="space-y-5"
          >
            <p className="text-xs font-bold text-violet-400 uppercase tracking-widest">
              La siguiente generación
            </p>
            <h2 className="text-5xl sm:text-6xl lg:text-7xl font-black text-foreground leading-[1.05] tracking-tight">
              La siguiente generación<br />
              de centros no se construye<br />
              <span className="text-muted-foreground font-light italic">sólo en la sala.</span>
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="max-w-2xl mx-auto space-y-4 text-muted-foreground text-lg leading-relaxed"
          >
            <p>
              Se construye con formación real de entrenadores, con sistemas que funcionan cuando el dueño no está, con datos que permiten tomar decisiones antes de que los problemas escalen.
            </p>
            <p>
              ELEVA existe para que los centros que ya tienen la metodología y la comunidad puedan convertirse en instituciones que duran.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
          >
            <Link href="/build">
              <button className="flex items-center gap-2.5 px-8 py-4 bg-violet-600 hover:bg-violet-500 text-foreground font-black rounded-xl transition-colors text-base group">
                <Calendar className="w-4.5 h-4.5" />
                Agendar diagnóstico gratuito
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </Link>
            <Link href="/build">
              <button className="flex items-center gap-2.5 px-8 py-4 glass border border-foreground/10 hover:border-foreground/20 text-foreground font-bold rounded-xl transition-colors text-base">
                Aplicar a PACTO
              </button>
            </Link>
          </motion.div>

          {/* Trust badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.45, duration: 0.5 }}
            className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2 pt-2"
          >
            {["Sin contratos anuales", "Onboarding incluido", "ROI medible en < 90 días", "Selección de centros"].map((t) => (
              <p key={t} className="text-xs text-muted-foreground flex items-center gap-1.5">
                <span className="w-1 h-1 rounded-full bg-emerald-400 inline-block" />
                {t}
              </p>
            ))}
          </motion.div>
        </div>
      </motion.div>
    </section>
  )
}
