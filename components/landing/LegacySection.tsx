"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowRight, Clock, AlertTriangle } from "lucide-react"
import { useInView } from "@/lib/use-in-view"

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number]

const legacy = [
  "Certificaciones otorgadas por asistencia, no por desempeño",
  "Entrenadores formados por imitación, sin competencias evaluadas",
  "Presión grupal e intensidad emocional sin suficiente contención",
  "Upsells hacia el siguiente nivel como motor principal",
  "Sin métricas de impacto posterior al entrenamiento",
  "Lenguaje cerrado que no dialoga con psicología ni ética clínica",
  "Dependencia del carisma de un fundador o entrenador estrella",
  "Staff operando sin protocolos, datos ni estándares formales",
]

const eleva = [
  "Certificación por desempeño observable y práctica supervisada",
  "Formación progresiva con competencias definidas y evaluables",
  "Seguridad psicológica, criterios de cuidado y protocolos de crisis",
  "Rutas de carrera y desarrollo profesional sostenible",
  "Medición de impacto: retención, avance, NPS, datos reales",
  "Formación integral: psicología, diseño instruccional, ética y datos",
  "Competencias replicables que no dependen de una sola persona",
  "Operación con sistema, métricas, playbooks y estándares definidos",
]

export function LegacySection() {
  const { ref, inView } = useInView(0.08)

  return (
    <section ref={ref} className="py-28 px-6">
      <div className="max-w-6xl mx-auto space-y-16">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65, ease }}
          className="max-w-3xl"
        >
          <div className="flex items-center gap-2 mb-6">
            <Clock className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">La industria tiene historia</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-black text-white leading-[1.1] tracking-tight mb-6">
            La transformación no empezó ayer.
            <br />
            <span className="text-white/60 font-light italic">Pero tampoco puede seguir operando como hace 50 años.</span>
          </h2>
          <div className="space-y-4 text-lg leading-relaxed text-white/75">
            <p>
              Durante décadas, la industria de la transformación personal fue influida por modelos como <strong className="text-white">est</strong>, <strong className="text-white">Lifespring</strong>, <strong className="text-white">Landmark</strong> y otros entrenamientos de alto impacto. Muchos abrieron conversaciones poderosas sobre responsabilidad, lenguaje y posibilidad. Su influencia llegó hasta América Latina y sigue presente en muchos programas actuales.
            </p>
            <p>
              También dejaron preguntas importantes — documentadas públicamente — sobre ética, presión grupal, formación de entrenadores, seguridad psicológica y modelos de negocio basados en enrolamiento.
            </p>
          </div>
          <Link href="/historia-transformacion">
            <button className="mt-6 flex items-center gap-2 text-sm text-amber-400 hover:text-amber-300 font-semibold transition-colors group">
              Conoce la historia de la industria
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </Link>
        </motion.div>

        {/* Comparison table */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65, ease, delay: 0.15 }}
        >
          <p className="text-xs font-bold text-white/50 uppercase tracking-widest mb-6">De modelos heredados al estándar ELEVA</p>
          <div className="grid lg:grid-cols-2 gap-4">

            {/* Legacy column */}
            <div className="rounded-2xl border border-red-500/15 bg-red-500/3 p-6 space-y-3">
              <div className="flex items-center gap-2 mb-5">
                <AlertTriangle className="w-4 h-4 text-red-400" />
                <p className="text-sm font-bold text-red-400 uppercase tracking-wide">Modelo heredado</p>
              </div>
              {legacy.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -12 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.45, ease, delay: 0.2 + i * 0.04 }}
                  className="flex items-start gap-2.5"
                >
                  <span className="text-red-500 text-lg leading-none shrink-0 mt-0.5">✗</span>
                  <p className="text-sm text-white/65 leading-snug">{item}</p>
                </motion.div>
              ))}
            </div>

            {/* ELEVA column */}
            <div className="rounded-2xl border border-violet-500/25 bg-violet-500/4 p-6 space-y-3">
              <div className="flex items-center gap-2 mb-5">
                <span className="w-4 h-4 rounded bg-violet-600 flex items-center justify-center text-white font-black text-[9px]">E</span>
                <p className="text-sm font-bold text-violet-400 uppercase tracking-wide">Estándar ELEVA</p>
              </div>
              {eleva.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 12 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.45, ease, delay: 0.2 + i * 0.04 }}
                  className="flex items-start gap-2.5"
                >
                  <span className="text-violet-400 text-lg leading-none shrink-0 mt-0.5">✓</span>
                  <p className="text-sm text-white/80 leading-snug">{item}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Statement + CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease, delay: 0.4 }}
          className="border-t border-white/5 pt-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
        >
          <div className="max-w-xl">
            <p className="text-lg font-black text-white leading-tight">
              ELEVA no cancela esa historia.
              <span className="text-violet-400"> La eleva.</span>
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Respetamos lo que la industria construyó. Construimos la siguiente etapa.
            </p>
          </div>
          <div className="flex gap-3 shrink-0">
            <Link href="/estandar-eleva">
              <button className="flex items-center gap-2 px-5 py-3 bg-violet-600 hover:bg-violet-500 text-white font-bold rounded-xl transition-colors text-sm group">
                Ver el estándar
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </Link>
            <Link href="/historia-transformacion">
              <button className="flex items-center gap-2 px-5 py-3 glass border border-white/10 hover:border-white/20 text-white/70 font-semibold rounded-xl transition-colors text-sm">
                Ver historia
              </button>
            </Link>
          </div>
        </motion.div>

      </div>
    </section>
  )
}
