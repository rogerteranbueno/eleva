"use client"

import { motion } from "framer-motion"
import { useInView } from "@/lib/use-in-view"

const CICLO = [
  { label: "Atracción",     color: "#7C3AED" },
  { label: "Inscripción",   color: "#6D28D9" },
  { label: "Experiencia",   color: "#5B21B6" },
  { label: "Seguimiento",   color: "#4C1D95" },
  { label: "Avanzado",      color: "#1D4ED8" },
  { label: "PL",            color: "#1E40AF" },
  { label: "Comunidad",     color: "#065F46" },
  { label: "Post-PL",       color: "#047857" },
  { label: "Recompra",      color: "#10B981" },
  { label: "Referidos",     color: "#6EE7B7" },
  { label: "Nuevas sedes",  color: "#34D399" },
]

const RESULTADOS = [
  { value: "Más personas entrando", sub: "atracción y admisiones" },
  { value: "Más participantes avanzando", sub: "básico → avanzado → PL" },
  { value: "Más graduados activos", sub: "comunidad y post-PL" },
  { value: "Más staff preparado", sub: "academia interna" },
  { value: "Menos improvisación", sub: "sistema y datos" },
]

export function CicloSection() {
  const { ref, inView } = useInView(0.1)

  return (
    <section ref={ref} className="py-24 px-6 max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
        className="space-y-12"
      >
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <p className="text-xs font-bold text-violet-400 uppercase tracking-widest">
            El ciclo completo
          </p>
          <h2 className="text-4xl sm:text-5xl font-black text-white leading-tight">
            No optimizamos una parte.<br />
            <span className="text-muted-foreground font-light">Instalamos el ciclo completo.</span>
          </h2>
        </div>

        {/* Ciclo visual — horizontal scroll en móvil */}
        <div className="overflow-x-auto pb-4 -mx-6 px-6">
          <div className="flex items-center gap-0 min-w-max mx-auto">
            {CICLO.map((c, i) => (
              <div key={c.label} className="flex items-center">
                <motion.div
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={inView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ delay: i * 0.055, duration: 0.4, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
                  className="flex flex-col items-center gap-2"
                >
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center text-[10px] font-black text-white/90 text-center leading-tight p-1"
                    style={{ backgroundColor: c.color + "28", border: `1px solid ${c.color}50` }}
                  >
                    {c.label}
                  </div>
                  <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: c.color }} />
                </motion.div>
                {i < CICLO.length - 1 && (
                  <div className="w-6 h-px bg-white/10 mx-1 flex-shrink-0" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Resultados */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {RESULTADOS.map((r, i) => (
            <motion.div
              key={r.value}
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.5 + i * 0.08, duration: 0.4 }}
              className="glass rounded-xl p-4 border border-white/6 text-center"
            >
              <p className="text-sm font-bold text-white mb-1">{r.value}</p>
              <p className="text-[11px] text-muted-foreground">{r.sub}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}
