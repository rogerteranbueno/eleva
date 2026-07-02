"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowRight, Users, Zap, MapPin, RefreshCw, BookOpen, Briefcase } from "lucide-react"
import { useInView } from "@/lib/use-in-view"
import { AcredittaBadge } from "@/components/AcredittaBadge"

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number]

const networkBenefits = [
  {
    icon: Users,
    title: "Comunidad de práctica",
    body: "Acceso a la red de coaches y entrenadores certificados ELEVA en LATAM. Pares, mentores y colegas que entienden el contexto.",
    accent: "violet",
  },
  {
    icon: MapPin,
    title: "Acceso a la cancha",
    body: "Los entrenadores en formación tienen acceso a centros afiliados ELEVA para practicar, co-facilitar y acumular horas supervisadas en condiciones reales.",
    accent: "emerald",
  },
  {
    icon: RefreshCw,
    title: "Actualización semestral",
    body: "El currículo ELEVA Academy se actualiza cada 6 meses con casos reales, investigación aplicada y feedback de la red. Los certificados reciben actualizaciones sin costo adicional.",
    accent: "blue",
  },
  {
    icon: Zap,
    title: "Supervisión post-certificación",
    body: "La formación no termina con el diploma. La red ofrece sesiones de supervisión grupal, revisión de casos y acompañamiento continuo para coaches activos.",
    accent: "violet",
  },
  {
    icon: BookOpen,
    title: "Biblioteca de recursos ELEVA",
    body: "Protocolos, marcos de trabajo, guías de facilitación, casos de estudio y materiales de apoyo — todo disponible en el ecosistema ELEVA OS.",
    accent: "blue",
  },
  {
    icon: Briefcase,
    title: "Oportunidades de práctica profesional",
    body: "Los centros partner buscan talento dentro de la red ELEVA. Ser certificado abre puertas a colaboraciones, proyectos y roles dentro del ecosistema.",
    accent: "emerald",
  },
]

const accentMap = {
  violet: { icon: "text-violet-400 bg-violet-500/10", dot: "bg-violet-400" },
  emerald: { icon: "text-emerald-400 bg-emerald-500/10", dot: "bg-emerald-400" },
  blue: { icon: "text-blue-400 bg-blue-500/10", dot: "bg-blue-400" },
  amber: { icon: "text-amber-400 bg-amber-500/10", dot: "bg-amber-400" },
}

export function ElevaNetworkSection() {
  const { ref, inView } = useInView(0.08)

  return (
    <section ref={ref} className="py-28 px-6 border-t border-white/5">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65, ease }}
          className="grid lg:grid-cols-2 gap-12 items-end mb-16"
        >
          <div className="space-y-5">
            <p className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Red ELEVA</p>
            <h2 className="text-4xl sm:text-5xl font-black text-white leading-[1.1] tracking-tight">
              La formación no termina
              <br />
              con el diploma.
              <span className="text-white/40 font-light italic block mt-1">Empieza.</span>
            </h2>
          </div>
          <div className="space-y-4">
            <p className="text-white/70 leading-relaxed">
              Los coaches certificados ELEVA entran a una red activa de práctica, supervisión y crecimiento continuo. No formamos entrenadores para que tengan un certificado — los formamos para que tengan una carrera.
            </p>
            <p className="text-white/70 leading-relaxed">
              La red ELEVA garantiza acceso a la <strong className="text-white/90">cancha</strong>: centros afiliados donde practicar, mentores que han facilitado miles de horas, y una comunidad que entiende exactamente el contexto en el que operas.
            </p>
            <AcredittaBadge size="md" className="mt-2" />
          </div>
        </motion.div>

        {/* Bento grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {networkBenefits.map((b, i) => {
            const a = accentMap[b.accent as keyof typeof accentMap]
            const Icon = b.icon
            // First card spans 2 cols on lg
            const isFeature = i === 1
            return (
              <motion.div
                key={b.title}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.55, ease, delay: i * 0.07 }}
                className={`glass rounded-2xl border border-white/6 p-6 space-y-4 hover:border-white/12 transition-colors ${isFeature ? "lg:col-span-1 row-span-1" : ""}`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${a.icon}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="space-y-2">
                  <p className="font-black text-white text-base leading-tight">{b.title}</p>
                  <p className="text-base text-white/75 leading-relaxed">{b.body}</p>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease, delay: 0.45 }}
          className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-4 p-6 rounded-2xl border border-white/5 glass"
        >
          {[
            { val: "40+",   label: "Coaches certificados en la red" },
            { val: "6",     label: "Países en LATAM" },
            { val: "Sem.",  label: "Actualización curricular" },
            { val: "∞",     label: "Horas de supervisión disponibles" },
          ].map((s) => (
            <div key={s.label} className="text-center space-y-1">
              <p className="text-2xl sm:text-3xl font-black text-white">{s.val}</p>
              <p className="text-sm text-white/65 leading-snug">{s.label}</p>
            </div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, ease, delay: 0.55 }}
          className="mt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        >
          <p className="text-sm text-white/50 max-w-md">
            Ser parte de la red no es automático. Se accede completando el proceso de formación y certificación ELEVA.
          </p>
          <Link href="/academia">
            <button className="flex items-center gap-2 px-5 py-3 bg-violet-600 hover:bg-violet-500 text-white font-bold rounded-xl text-sm transition-colors group shrink-0">
              Ver certificaciones
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </Link>
        </motion.div>

      </div>
    </section>
  )
}
