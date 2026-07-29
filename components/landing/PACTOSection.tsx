"use client"

import { motion } from "framer-motion"
import { useInView } from "@/lib/use-in-view"
import Link from "next/link"
import { ArrowRight, Check, Zap } from "lucide-react"

const ENTREGABLES = [
  "Tu academia interna diseñada",
  "Equipo entrenado y evaluado",
  "Procesos documentados y listos para usarse",
  "ELEVA OS instalado y en uso",
  "Seguimiento después del programa, operando",
  "Plan de crecimiento a 90 días",
]

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.07, duration: 0.55, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  }),
}

export function PACTOSection() {
  const { ref, inView } = useInView(0.08)

  return (
    <section id="programas" ref={ref} className="py-24 px-6 max-w-6xl mx-auto">
      <motion.div initial="hidden" animate={inView ? "visible" : "hidden"} className="space-y-12">

        {/* Header */}
        <motion.div custom={0} variants={fadeUp} className="space-y-2">
          <p className="text-xs font-bold text-violet-400 uppercase tracking-widest">
            Producto estrella
          </p>
          <div className="flex items-start gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-violet-600 flex items-center justify-center">
                <Zap className="w-5 h-5 text-foreground" />
              </div>
              <h2 className="text-5xl sm:text-6xl font-black text-foreground tracking-tight">PACTO</h2>
            </div>
          </div>
          <p className="text-lg text-muted-foreground max-w-xl">
            La forma más rápida de profesionalizar tu centro.
          </p>
        </motion.div>

        {/* Main card */}
        <motion.div
          custom={1}
          variants={fadeUp}
          className="rounded-3xl border border-violet-500/20 bg-violet-600/5 overflow-hidden"
        >
          {/* Top bar */}
          <div className="bg-violet-600/10 border-b border-violet-500/15 px-8 py-5">
            <p className="text-sm font-bold text-violet-300">
              No es un curso. Es una implementación.
            </p>
          </div>

          <div className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Left: what it is */}
            <div className="space-y-6">
              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3">Qué es</p>
                <p className="text-foreground leading-relaxed">
                  En PACTO diseñamos tu academia interna, entrenamos a tu equipo, documentamos
                  procesos, instalamos ELEVA OS y te dejamos un plan claro de crecimiento.
                  No viene a decirte cómo entrenar: ordena lo que pasa antes y después de la sala.
                </p>
              </div>
              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3">Para quién es</p>
                <p className="text-foreground leading-relaxed">
                  Centros con comunidad activa, entrenamientos en curso y ganas de crecer,
                  pero que siguen dependiendo de improvisación, entrenadores externos
                  o decisiones tomadas sin datos.
                </p>
              </div>

              {/* Price */}
              <div className="glass rounded-2xl p-5 border border-foreground/8 space-y-1">
                <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold">Inversión</p>
                <p className="text-3xl font-black text-foreground">Desde USD $15,000</p>
                <p className="text-xs text-muted-foreground">
                  Si contratas el Diagnóstico 360 antes, el monto se descuenta del proyecto.
                </p>
              </div>
            </div>

            {/* Right: deliverables + link to full scope */}
            <div className="space-y-7">
              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4">
                  Lo que tu centro tiene al terminar
                </p>
                <ul className="space-y-2.5">
                  {ENTREGABLES.map((e) => (
                    <li key={e} className="flex items-center gap-2.5 text-sm text-foreground/85">
                      <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      {e}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="border-t border-foreground/6 pt-6 space-y-3">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  El programa completo cubre 12 módulos: formación, operación de sala,
                  admisiones, seguimiento, datos y expansión.
                </p>
                <Link href="/pacto">
                  <button className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-foreground/6 hover:bg-foreground/10 border border-foreground/10 hover:border-foreground/20 text-foreground font-bold rounded-xl transition-all group">
                    Ver alcance completo de PACTO
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
}
