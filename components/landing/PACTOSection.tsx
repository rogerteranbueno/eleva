"use client"

import { motion } from "framer-motion"
import { useInView } from "@/lib/use-in-view"
import Link from "next/link"
import { ArrowRight, Check, Zap } from "lucide-react"

const MODULOS = [
  "Fundamentos de transformación responsable",
  "Observador, lenguaje e interpretación",
  "Presencia y escucha del entrenador",
  "Diseño de experiencias transformacionales",
  "Intervención, corrección y seguridad psicológica",
  "Staff, roles y operación de sala",
  "Admisiones, enrolamiento y ventas éticas",
  "PL continuity y programas posteriores",
  "Data, dashboards y seguimiento con ELEVA OS",
  "Academia interna del centro",
  "Expansión y nuevas sedes",
  "Proyecto final de implementación",
]

const ENTREGABLES = [
  "Ruta de formación de entrenadores diseñada",
  "Staff entrenado y certificado",
  "Procesos críticos documentados",
  "ELEVA OS instalado y en uso",
  "Métricas operativas activas",
  "Modelo de continuidad post-PL",
  "Plan de crecimiento a 90 días",
  "Roadmap de nuevas fuentes de ingreso",
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
            Programa de Aceleración para Coaches y Centros de Transformación.
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
              No es una capacitación. Es capacidad instalada.
            </p>
          </div>

          <div className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Left: what it is */}
            <div className="space-y-6">
              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3">Qué es</p>
                <p className="text-foreground leading-relaxed">
                  Una implementación intensiva para profesionalizar la formación, operación,
                  seguimiento y crecimiento de tu centro. No viene a decirte cómo entrenar -
                  viene a instalar la estructura que permite que tu entrenamiento escale.
                </p>
              </div>
              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3">Para quién es</p>
                <p className="text-foreground leading-relaxed">
                  Centros con comunidad activa, entrenamientos en curso y ambición de crecer -
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

              <Link href="/build">
                <button className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-violet-600 hover:bg-violet-500 text-foreground font-bold rounded-xl transition-colors group">
                  Aplicar a PACTO
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </Link>
            </div>

            {/* Right: modules + deliverables */}
            <div className="space-y-7">
              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4">12 Módulos</p>
                <ul className="space-y-2">
                  {MODULOS.map((m, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-xs text-foreground/80">
                      <span className="text-violet-400 font-black flex-shrink-0 mt-0.5 text-[10px]">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      {m}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="border-t border-foreground/6 pt-6">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4">
                  Lo que el centro tiene al terminar
                </p>
                <ul className="space-y-1.5">
                  {ENTREGABLES.map((e) => (
                    <li key={e} className="flex items-center gap-2.5 text-xs text-foreground/80">
                      <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                      {e}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
}
