"use client"

import { motion } from "framer-motion"
import { useInView } from "@/lib/use-in-view"
import Link from "next/link"
import { ArrowRight, Clock } from "lucide-react"

export function HistoriaTeaserSection() {
  const { ref, inView } = useInView(0.15)

  return (
    <section ref={ref} className="py-20 px-6">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
        className="max-w-3xl mx-auto rounded-3xl border border-amber-500/15 bg-amber-500/4 p-8 sm:p-10 text-center space-y-5"
      >
        <div className="inline-flex items-center gap-2">
          <Clock className="w-4 h-4 text-amber-400" />
          <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">
            La industria tiene historia
          </span>
        </div>

        <h2 className="text-3xl sm:text-4xl font-black text-foreground leading-tight">
          Tomamos lo valioso del legado.{" "}
          <span className="text-muted-foreground font-light italic">Sin repetir sus errores.</span>
        </h2>

        <p className="text-base text-muted-foreground leading-relaxed max-w-xl mx-auto">
          ELEVA estudia el legado de est, Lifespring, Landmark y los entrenamientos de grupo
          grande para construir un estándar más profesional, medible y cuidadoso con las personas.
        </p>

        <Link href="/historia-transformacion" className="inline-block">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center gap-2.5 px-6 py-3 bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 hover:border-amber-400/60 text-amber-300 font-bold rounded-xl transition-all duration-200 group text-sm"
          >
            Ver historia y fuentes
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </motion.button>
        </Link>
      </motion.div>
    </section>
  )
}
