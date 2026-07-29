"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowRight, Clock, AlertTriangle, BadgeCheck,
  Calendar, Copy, Zap, DollarSign, BarChart3, Lock, Star, ClipboardX,
  TrendingUp, Shield, Compass, BookOpen, RefreshCw, LayoutDashboard } from "lucide-react"
import { useInView } from "@/lib/use-in-view"

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number]

const legacy = [
  { icon: Calendar,      text: "Certificaciones otorgadas por asistencia, no por desempeño" },
  { icon: Copy,          text: "Entrenadores formados por imitación, sin competencias evaluadas" },
  { icon: Zap,           text: "Presión grupal e intensidad emocional sin suficiente contención" },
  { icon: DollarSign,    text: "Upsells hacia el siguiente nivel como motor principal" },
  { icon: BarChart3,     text: "Sin métricas de impacto posterior al entrenamiento" },
  { icon: Lock,          text: "Lenguaje cerrado que no dialoga con psicología ni ética clínica" },
  { icon: Star,          text: "Dependencia del carisma de un fundador o entrenador estrella" },
  { icon: ClipboardX,    text: "Staff operando sin protocolos, datos ni estándares formales" },
]

const eleva = [
  { icon: BadgeCheck,    text: "Certificación por desempeño observable y práctica supervisada" },
  { icon: TrendingUp,    text: "Formación progresiva con competencias definidas y evaluables" },
  { icon: Shield,        text: "Seguridad psicológica, criterios de cuidado y protocolos de crisis" },
  { icon: Compass,       text: "Rutas de carrera y desarrollo profesional sostenible" },
  { icon: BarChart3,     text: "Medición de impacto: retención, avance, NPS, datos reales" },
  { icon: BookOpen,      text: "Formación integral: psicología, diseño instruccional, ética y datos" },
  { icon: RefreshCw,     text: "Competencias replicables que no dependen de una sola persona" },
  { icon: LayoutDashboard, text: "Operación con sistema, métricas, playbooks y estándares definidos" },
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
          <h2 className="text-4xl sm:text-5xl font-black text-foreground leading-[1.1] tracking-tight mb-6">
            La transformación no empezó ayer.
            <br />
            <span className="text-foreground/60 font-light italic">Pero tampoco puede seguir operando como hace 50 años.</span>
          </h2>
          <div className="space-y-4 text-lg leading-relaxed text-foreground/75">
            <p>
              Durante décadas, la industria de la transformación personal fue influida por modelos como <strong className="text-foreground">est</strong>, <strong className="text-foreground">Lifespring</strong>, <strong className="text-foreground">Landmark</strong> y otros entrenamientos de alto impacto. Muchos abrieron conversaciones poderosas sobre responsabilidad, lenguaje y posibilidad. Su influencia llegó hasta América Latina y sigue presente en muchos programas actuales.
            </p>
            <p>
              También dejaron preguntas importantes, documentadas públicamente, sobre ética, presión grupal, formación de entrenadores, seguridad psicológica y modelos de negocio basados en enrolamiento.
            </p>
          </div>

          {/* CTA as real amber button */}
          <Link href="/historia-transformacion">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="mt-8 inline-flex items-center gap-2.5 px-6 py-3 bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 hover:border-amber-400/60 text-amber-300 font-bold rounded-xl transition-all duration-200 group text-sm"
            >
              <Clock className="w-4 h-4" />
              Conoce la historia de la industria
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </motion.button>
          </Link>
        </motion.div>

        {/* Comparison table */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65, ease, delay: 0.15 }}
        >
          <p className="text-xs font-bold text-foreground/50 uppercase tracking-widest mb-6">De modelos heredados al estándar ELEVA</p>
          <div className="grid lg:grid-cols-2 gap-4">

            {/* Legacy column */}
            <div className="rounded-2xl border border-red-500/15 bg-red-500/3 p-6 space-y-2">
              <div className="flex items-center gap-2 mb-5">
                <AlertTriangle className="w-4 h-4 text-red-400" />
                <p className="text-sm font-bold text-red-400 uppercase tracking-wide">Modelo heredado</p>
              </div>
              {legacy.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -12 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.4, ease, delay: 0.2 + i * 0.04 }}
                  className="flex items-start gap-3 py-2.5 px-3 rounded-xl hover:bg-red-500/5 transition-colors group"
                >
                  <div className="w-7 h-7 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center shrink-0 mt-0.5">
                    <item.icon className="w-3.5 h-3.5 text-red-400" />
                  </div>
                  <p className="text-sm text-foreground/65 leading-snug">{item.text}</p>
                </motion.div>
              ))}
            </div>

            {/* ELEVA column */}
            <div className="rounded-2xl border border-violet-500/25 bg-violet-500/4 p-6 space-y-2">
              <div className="flex items-center gap-2 mb-5">
                <span className="w-5 h-5 rounded bg-violet-600 flex items-center justify-center text-foreground font-black text-[10px]">E</span>
                <p className="text-sm font-bold text-violet-400 uppercase tracking-wide">Estándar ELEVA</p>
              </div>
              {eleva.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 12 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.4, ease, delay: 0.2 + i * 0.04 }}
                  className="flex items-start gap-3 py-2.5 px-3 rounded-xl hover:bg-violet-500/5 transition-colors group"
                >
                  <div className="w-7 h-7 rounded-lg bg-violet-500/10 border border-violet-500/25 flex items-center justify-center shrink-0 mt-0.5">
                    <item.icon className="w-3.5 h-3.5 text-violet-400" />
                  </div>
                  <p className="text-sm text-foreground/85 leading-snug">{item.text}</p>
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
          className="border-t border-foreground/5 pt-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
        >
          <div className="max-w-xl">
            <p className="text-lg font-black text-foreground leading-tight">
              ELEVA no cancela esa historia.
              <span className="text-violet-400"> La eleva.</span>
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Respetamos lo que la industria construyó. Construimos la siguiente etapa.
            </p>
          </div>
          <div className="flex gap-3 shrink-0">
            <Link href="/estandar-eleva">
              <button className="flex items-center gap-2 px-5 py-3 bg-violet-600 hover:bg-violet-500 text-foreground font-bold rounded-xl transition-colors text-sm group">
                Ver el estándar
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </Link>
            <Link href="/historia-transformacion">
              <button className="flex items-center gap-2 px-5 py-3 glass border border-foreground/10 hover:border-foreground/20 text-foreground/70 font-semibold rounded-xl transition-colors text-sm">
                Ver historia
              </button>
            </Link>
          </div>
        </motion.div>

      </div>
    </section>
  )
}
