"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useInView } from "@/lib/use-in-view"
import {
  Megaphone, ClipboardList, Sparkles, Activity, TrendingUp,
  Trophy, Users, Heart, RefreshCw, Share2, Building2, ArrowRight
} from "lucide-react"
import Link from "next/link"

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number]

const CICLO = [
  { label: "Atracción",    icon: Megaphone,     color: "#7C3AED", group: "entrada",   desc: "Leads e interesados que conocen el centro" },
  { label: "Inscripción",  icon: ClipboardList,  color: "#6D28D9", group: "entrada",   desc: "Registro y admisión al Nivel 1 (Básico)" },
  { label: "Experiencia",  icon: Sparkles,       color: "#5B21B6", group: "basico",    desc: "El entrenamiento en sala, el corazón del modelo" },
  { label: "Seguimiento",  icon: Activity,       color: "#4C1D95", group: "basico",    desc: "Tracking post-entrenamiento, coaching y actividad" },
  { label: "Avanzado",     icon: TrendingUp,     color: "#1D4ED8", group: "avanzado",  desc: "Nivel 2, profundización y liderazgo personal" },
  { label: "PL",           icon: Trophy,         color: "#1E40AF", group: "avanzado",  desc: "Nivel 3, transformación profunda y enrolamiento" },
  { label: "Comunidad",    icon: Users,          color: "#065F46", group: "comunidad", desc: "Red de participantes activos y graduados" },
  { label: "Post-PL",      icon: Heart,          color: "#047857", group: "comunidad", desc: "Acompañamiento y continuidad después de graduarse" },
  { label: "Recompra",     icon: RefreshCw,      color: "#10B981", group: "growth",    desc: "Nuevos programas, intensivos y formaciones" },
  { label: "Referidos",    icon: Share2,         color: "#34D399", group: "growth",    desc: "Participantes que llevan a nuevas personas al centro" },
  { label: "Nuevas sedes", icon: Building2,      color: "#6EE7B7", group: "growth",    desc: "Expansión geográfica con el sistema replicado" },
]

const GRUPOS: Record<string, { label: string; color: string }> = {
  entrada:   { label: "Adquisición",  color: "text-violet-400" },
  basico:    { label: "Activación",   color: "text-blue-400" },
  avanzado:  { label: "Avanzado",     color: "text-indigo-400" },
  comunidad: { label: "Comunidad",    color: "text-emerald-400" },
  growth:    { label: "Revolución",   color: "text-teal-400" },
}

const RESULTADOS = [
  { value: "Más personas entrando",         sub: "atracción y admisiones",    accent: "violet" },
  { value: "Más participantes avanzando",   sub: "básico → avanzado → PL",    accent: "blue" },
  { value: "Más graduados activos",         sub: "comunidad y post-PL",        accent: "emerald" },
  { value: "Más staff preparado",           sub: "academia interna",           accent: "violet" },
  { value: "Menos improvisación",           sub: "sistema y datos",            accent: "teal" },
]

const accentText: Record<string, string> = {
  violet:  "text-violet-400",
  blue:    "text-blue-400",
  emerald: "text-emerald-400",
  teal:    "text-teal-400",
}

export function CicloSection() {
  const { ref, inView } = useInView(0.08)
  const [active, setActive] = useState<number | null>(null)

  return (
    <section ref={ref} className="py-24 px-6">
      <div className="max-w-6xl mx-auto space-y-14">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease }}
          className="text-center max-w-2xl mx-auto space-y-4"
        >
          <p className="text-xs font-bold text-violet-400 uppercase tracking-widest">
            El ciclo completo
          </p>
          <h2 className="text-4xl sm:text-5xl font-black text-foreground leading-tight">
            No optimizamos una parte.<br />
            <span className="text-foreground/55 font-light italic">Instalamos el ciclo completo.</span>
          </h2>
          <p className="text-base text-muted-foreground max-w-lg mx-auto">
            Toca cualquier etapa para ver qué hace ELEVA ahí.
          </p>
        </motion.div>

        {/* Pipeline visual, horizontal scroll, centered */}
        <div className="overflow-x-auto pb-4 -mx-6 px-6">
          <div className="flex items-start gap-1 w-fit mx-auto py-2">
            {CICLO.map((c, i) => {
              const Icon = c.icon
              const isActive = active === i
              return (
                <div key={c.label} className="flex items-center">
                  <motion.button
                    initial={{ opacity: 0, y: 16 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: i * 0.05, duration: 0.4, ease }}
                    onClick={() => setActive(isActive ? null : i)}
                    className="flex flex-col items-center gap-2.5 group"
                  >
                    <motion.div
                      animate={isActive ? { scale: 1.1, y: -3 } : { scale: 1, y: 0 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      className="w-16 h-16 rounded-2xl flex flex-col items-center justify-center gap-1.5 border transition-all duration-200"
                      style={{
                        backgroundColor: isActive ? c.color + "30" : c.color + "18",
                        borderColor: isActive ? c.color + "80" : c.color + "40",
                        boxShadow: isActive ? `0 0 18px ${c.color}30` : "none",
                      }}
                    >
                      <Icon
                        className="w-4.5 h-4.5 transition-colors"
                        style={{ color: isActive ? c.color : c.color + "BB" }}
                      />
                    </motion.div>
                    <span
                      className={`text-xs font-bold text-center leading-tight transition-colors max-w-[64px] ${isActive ? "" : "text-foreground/40"}`}
                      style={isActive ? { color: c.color } : undefined}
                    >
                      {c.label}
                    </span>
                  </motion.button>

                  {i < CICLO.length - 1 && (
                    <div className="w-5 h-px mx-0.5 flex-shrink-0 bg-gradient-to-r from-foreground/15 to-foreground/5" />
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Detail panel */}
        <AnimatePresence>
          {active !== null && (
            <motion.div
              key={active}
              initial={{ opacity: 0, y: -8, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: -8, height: 0 }}
              transition={{ duration: 0.28, ease }}
              className="overflow-hidden"
            >
              <div
                className="rounded-2xl border p-5 flex items-start gap-4"
                style={{
                  backgroundColor: CICLO[active].color + "10",
                  borderColor: CICLO[active].color + "40",
                }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{ backgroundColor: CICLO[active].color + "25", border: `1px solid ${CICLO[active].color}50` }}
                >
                  {(() => { const Icon = CICLO[active].icon; return <Icon className="w-5 h-5" style={{ color: CICLO[active].color }} /> })()}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="font-black text-foreground text-base">{CICLO[active].label}</p>
                    <span className={`text-[10px] font-bold uppercase tracking-widest ${GRUPOS[CICLO[active].group].color}`}>
                      {GRUPOS[CICLO[active].group].label}
                    </span>
                  </div>
                  <p className="text-sm text-foreground/70 leading-relaxed">{CICLO[active].desc}</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Resultados */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease, delay: 0.45 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3"
        >
          {RESULTADOS.map((r, i) => (
            <div
              key={r.value}
              className="glass rounded-xl p-4 border border-foreground/6 text-center space-y-1"
            >
              <p className={`text-sm font-bold ${accentText[r.accent] ?? "text-foreground"} leading-snug`}>{r.value}</p>
              <p className="text-xs text-muted-foreground">{r.sub}</p>
            </div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, ease, delay: 0.55 }}
          className="text-center"
        >
          <Link href="/metodo">
            <button className="inline-flex items-center gap-2 px-6 py-3 bg-violet-600 hover:bg-violet-500 text-foreground font-bold rounded-xl transition-colors text-sm group">
              Ver cómo funciona el sistema
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
