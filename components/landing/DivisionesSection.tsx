"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { useInView } from "@/lib/use-in-view"
import { GraduationCap, TrendingUp, LayoutDashboard, ShieldCheck, ArrowRight } from "lucide-react"

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number]

const DIVISIONES = [
  {
    icon: GraduationCap,
    label: "ELEVA Academy",
    accent: "violet",
    href: "/academia",
    headline: "Formación y certificación institucional.",
    body: "Entrenadores, coaches, coordinadores y directores certificados con criterio profesional, práctica supervisada y credencial verificada en Acreditta.",
    bullets: [
      "Entrenadores y coaches certificados",
      "Staff de sala, admisiones y liderazgo",
      "Academia interna de tu centro",
      "Certificación por desempeño, no asistencia",
    ],
    size: "featured", // 2 cols on lg
  },
  {
    icon: TrendingUp,
    label: "ELEVA Growth",
    accent: "emerald",
    href: "/para-centros",
    headline: "Estrategia para crecer sin improvisar.",
    body: "Revenue, expansión, continuidad y nuevas fuentes de ingreso diseñadas para centros que ya tienen metodología.",
    bullets: [
      "Continuidad Básico → Avanzado → PL",
      "Expansión a nuevas sedes",
      "Enrolamiento ético",
    ],
    size: "normal",
  },
  {
    icon: LayoutDashboard,
    label: "ELEVA OS",
    accent: "blue",
    href: "/metodo",
    headline: "El sistema operativo del centro.",
    body: "Dashboard, seguimiento, cohortes, comunidad y datos — todo en un lugar para que el centro funcione cuando el dueño no está mirando.",
    bullets: [
      "Dashboard en tiempo real",
      "Momentum Score y alertas",
      "CRM y expedientes",
    ],
    size: "normal",
  },
  {
    icon: ShieldCheck,
    label: "ELEVA Standards",
    accent: "amber",
    href: "/estandar-eleva",
    headline: "Protocolos, ética y calidad.",
    body: "Estándares de seguridad psicológica, auditorías, medición de impacto y protección al participante.",
    bullets: [
      "Manual de contingencias",
      "Impacto a 30/90/180 días",
      "Ética y protección",
    ],
    size: "normal",
  },
]

const ACCENT: Record<string, { border: string; iconBg: string; iconColor: string; badge: string; glow: string }> = {
  violet:  { border: "border-violet-500/20  hover:border-violet-500/45",  iconBg: "bg-violet-500/12",  iconColor: "text-violet-400", badge: "text-violet-300 bg-violet-500/10 border-violet-500/20",  glow: "hover:shadow-violet-500/5" },
  emerald: { border: "border-emerald-500/20 hover:border-emerald-500/45", iconBg: "bg-emerald-500/12", iconColor: "text-emerald-400", badge: "text-emerald-300 bg-emerald-500/10 border-emerald-500/20", glow: "hover:shadow-emerald-500/5" },
  blue:    { border: "border-blue-500/20    hover:border-blue-500/45",    iconBg: "bg-blue-500/12",    iconColor: "text-blue-400",    badge: "text-blue-300 bg-blue-500/10 border-blue-500/20",         glow: "hover:shadow-blue-500/5" },
  amber:   { border: "border-amber-500/20   hover:border-amber-500/45",   iconBg: "bg-amber-500/12",   iconColor: "text-amber-400",  badge: "text-amber-300 bg-amber-500/10 border-amber-500/20",      glow: "hover:shadow-amber-500/5" },
}

const dotMap: Record<string, string> = {
  violet: "bg-violet-400", emerald: "bg-emerald-400", blue: "bg-blue-400", amber: "bg-amber-400",
}

export function DivisionesSection() {
  const { ref, inView } = useInView(0.08)

  return (
    <section ref={ref} className="py-24 px-6">
      <div className="max-w-6xl mx-auto space-y-12">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-6"
        >
          <div>
            <p className="text-xs font-bold text-violet-400 uppercase tracking-widest mb-4">
              Una infraestructura completa
            </p>
            <h2 className="text-4xl sm:text-5xl font-black text-white leading-tight">
              Cuatro divisiones.<br />
              <span className="text-white/45 font-light italic">Un solo ecosistema.</span>
            </h2>
          </div>
          <p className="text-white/60 text-base max-w-xs leading-relaxed">
            No optimizamos una parte del centro. Instalamos un sistema para todo el ciclo.
          </p>
        </motion.div>

        {/* Bento grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-fr">

          {/* Featured: Academy — spans 2 cols */}
          {(() => {
            const d = DIVISIONES[0]
            const a = ACCENT[d.accent]
            const Icon = d.icon
            return (
              <motion.div
                key={d.label}
                initial={{ opacity: 0, y: 28 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, ease, delay: 0.05 }}
                className={`lg:col-span-2 glass rounded-2xl border transition-all duration-300 shadow-xl ${a.border} ${a.glow} p-7 flex flex-col justify-between gap-8`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${a.iconBg}`}>
                    <Icon className={`w-5 h-5 ${a.iconColor}`} />
                  </div>
                  <span className={`text-[10px] px-2.5 py-1 rounded-full border font-bold uppercase tracking-wider ${a.badge}`}>
                    {d.label}
                  </span>
                </div>

                <div className="space-y-3">
                  <h3 className="font-black text-white text-xl leading-tight">{d.headline}</h3>
                  <p className="text-white/65 text-sm leading-relaxed max-w-md">{d.body}</p>
                  <ul className="grid grid-cols-2 gap-y-2 gap-x-4 mt-4">
                    {d.bullets.map((b) => (
                      <li key={b} className="flex items-center gap-2 text-xs text-white/70">
                        <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotMap[d.accent]}`} />
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                  <div className="flex items-center gap-1.5 text-[10px] text-white/35">
                    <span className="w-1.5 h-1.5 rounded-full bg-violet-400 inline-block" />
                    Credenciales verificadas en Acreditta
                  </div>
                  <Link href={d.href}>
                    <button className={`flex items-center gap-1.5 text-xs font-bold ${a.iconColor} hover:opacity-80 transition-opacity group`}>
                      Ver certificaciones
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  </Link>
                </div>
              </motion.div>
            )
          })()}

          {/* Standards — tall right card */}
          {(() => {
            const d = DIVISIONES[3]
            const a = ACCENT[d.accent]
            const Icon = d.icon
            return (
              <motion.div
                key={d.label}
                initial={{ opacity: 0, y: 28 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, ease, delay: 0.1 }}
                className={`glass rounded-2xl border transition-all duration-300 ${a.border} ${a.glow} p-6 flex flex-col justify-between gap-6`}
              >
                <div className="flex items-center justify-between">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${a.iconBg}`}>
                    <Icon className={`w-4.5 h-4.5 ${a.iconColor}`} />
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full border font-bold uppercase tracking-wider ${a.badge}`}>
                    {d.label}
                  </span>
                </div>
                <div className="space-y-2">
                  <h3 className="font-black text-white text-base leading-tight">{d.headline}</h3>
                  <p className="text-white/60 text-xs leading-relaxed">{d.body}</p>
                  <ul className="space-y-1.5 mt-3">
                    {d.bullets.map((b) => (
                      <li key={b} className="flex items-center gap-2 text-xs text-white/65">
                        <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotMap[d.accent]}`} />
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
                <Link href={d.href}>
                  <button className={`text-xs font-bold ${a.iconColor} hover:opacity-80 transition-opacity flex items-center gap-1 group`}>
                    Ver estándar <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </Link>
              </motion.div>
            )
          })()}

          {/* Growth + OS — bottom row, 2 equal cards */}
          {DIVISIONES.slice(1, 3).map((d, i) => {
            const a = ACCENT[d.accent]
            const Icon = d.icon
            return (
              <motion.div
                key={d.label}
                initial={{ opacity: 0, y: 28 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, ease, delay: 0.17 + i * 0.08 }}
                className={`glass rounded-2xl border transition-all duration-300 ${a.border} ${a.glow} p-6 space-y-4`}
              >
                <div className="flex items-center justify-between">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${a.iconBg}`}>
                    <Icon className={`w-4.5 h-4.5 ${a.iconColor}`} />
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full border font-bold uppercase tracking-wider ${a.badge}`}>
                    {d.label}
                  </span>
                </div>
                <div className="space-y-2">
                  <h3 className="font-black text-white text-base leading-tight">{d.headline}</h3>
                  <p className="text-white/60 text-xs leading-relaxed">{d.body}</p>
                  <ul className="space-y-1.5 mt-3">
                    {d.bullets.map((b) => (
                      <li key={b} className="flex items-center gap-2 text-xs text-white/65">
                        <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotMap[d.accent]}`} />
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
                <Link href={d.href}>
                  <button className={`text-xs font-bold ${a.iconColor} hover:opacity-80 transition-opacity flex items-center gap-1 group`}>
                    Explorar <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </Link>
              </motion.div>
            )
          })}

        </div>
      </div>
    </section>
  )
}
