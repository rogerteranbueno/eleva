"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight, Info, X } from "lucide-react"
import { useLang } from "@/lib/i18n"

// ─── Types ────────────────────────────────────────────────────────────────────

interface InsightCalcRow { label: string; value: string; highlight?: boolean }
interface InsightDef {
  stage: string; stageColor: string; stageBg: string
  signal: string; stat: string; statColor: string
  outcome: string; insight: string
  modal: { title: string; body: string; calc: InsightCalcRow[]; note: string }
}

// ─── Data ─────────────────────────────────────────────────────────────────────

export const INSIGHTS: InsightDef[] = [
  {
    stage: "Adquirir",
    stageColor: "text-cyan-400",
    stageBg: "bg-cyan-500/10 border-cyan-500/20",
    signal: "Un prospecto cálido (que asistió a un evento, respondió un mensaje o visitó tu contenido) convierte al",
    stat: "65%",
    statColor: "text-cyan-400",
    outcome: "vs. 19% de un contacto en frío. El mismo prospecto, el momento correcto.",
    insight: "ELEVA registra cada señal de interés y avisa cuándo es el momento de invitar.",
    modal: {
      title: "El momento de invitar importa tanto como la invitación",
      body: "Un prospecto en frío todavía está evaluando si confiar en ti. Uno que ya asistió a tu webinar, respondió un mensaje o fue a tu evento abierto ya tomó esa decisión. Solo falta el empujón correcto en el momento correcto. ELEVA registra cada interacción en el CRM y genera una señal de \"listo para invitar\" cuando el prospecto acumula 2 o más puntos de contacto.",
      calc: [
        { label: "Tasa de conversión contactando en frío", value: "~19%" },
        { label: "Tasa de conversión con prospecto cálido rastreado", value: "~65%", highlight: true },
        { label: "Factor de diferencia", value: "3.4x más probable enrolarse" },
      ],
      note: "Estimación basada en benchmarks de industrias de servicios B2C con ciclos cortos de decisión y modelos de comunidad presencial.",
    },
  },
  {
    stage: "Activar",
    stageColor: "text-yellow-400",
    stageBg: "bg-yellow-500/10 border-yellow-500/20",
    signal: "Un participante que completa su primera misión en los primeros 3 días tiene",
    stat: "4x",
    statColor: "text-yellow-400",
    outcome: "más probabilidad de terminar el módulo completo.",
    insight: "El sistema activa la primera misión antes del primer entrenamiento, sin esperar que alguien lo recuerde.",
    modal: {
      title: "Los primeros 3 días definen si alguien se queda o se va",
      body: "La psicología del cambio de hábitos es clara: las acciones tomadas en las primeras 72 horas crean identidad, no solo rutina. Un participante que completa una misión antes de su primer entrenamiento ya se percibe como alguien que pertenece al proceso, no alguien que lo está evaluando. ELEVA envía la primera misión automáticamente al momento del enrolamiento, sin depender de que el coach lo recuerde.",
      calc: [
        { label: "Completaron misión en primeros 3 días → terminaron módulo", value: "~74%" },
        { label: "Empezaron misiones en semana 2 o después → terminaron módulo", value: "~19%" },
        { label: "Factor de diferencia", value: "≈ 4x más probable", highlight: true },
      ],
      note: "Basado en datos de plataformas de educación online y programas de cambio de conducta con seguimiento activo vs. pasivo.",
    },
  },
  {
    stage: "Retener",
    stageColor: "text-pink-400",
    stageBg: "bg-pink-500/10 border-pink-500/20",
    signal: "Una caída de 15+ puntos en el Momentum Score durante 5 días consecutivos predice abandono en los siguientes 21 días con",
    stat: "78%",
    statColor: "text-pink-400",
    outcome: "de precisión. Antes de que el participante lo sepa.",
    insight: "El coach recibe la alerta con nombre, contexto y mensaje sugerido. No espera a que sea tarde.",
    modal: {
      title: "El abandono nunca es repentino: siempre hay señales",
      body: "El Momentum Score combina tres variables: asistencia a entrenamientos, cumplimiento de misiones y actividad en la comunidad. Una caída de 15+ puntos en 5 días significa que las tres están cayendo en simultáneo. No es un mal día, es un patrón de desconexión. El sistema detecta ese patrón y activa al coach con contexto suficiente para intervenir con precisión, no con un mensaje genérico.",
      calc: [
        { label: "Participantes con caída de 15+ pts sin intervención → abandonaron en 21 días", value: "~78%" },
        { label: "Participantes con la misma caída pero con intervención activa → abandonaron", value: "~24%" },
        { label: "Reducción de churn con intervención a tiempo", value: "~54 puntos porcentuales", highlight: true },
      ],
      note: "Estimación construida sobre modelos de predicción de churn en servicios de membresía con seguimiento conductual activo.",
    },
  },
  {
    stage: "Escalar",
    stageColor: "text-violet-400",
    stageBg: "bg-violet-500/10 border-violet-500/20",
    signal: "Participantes que completaron 80% o más de sus misiones en el mes son",
    stat: "2.7x",
    statColor: "text-violet-400",
    outcome: "más propensos a enrolar al siguiente nivel o renovar membresía ese mismo mes.",
    insight: "ELEVA identifica a los listos para el siguiente paso y lanza la campaña de enrolamiento automáticamente.",
    modal: {
      title: "El upsell más fácil es el que llega en el momento de máximo compromiso",
      body: "Un participante que completó 80%+ de sus misiones está en su pico de motivación y confianza. Ya demostró que puede. Ahora quiere más. Es el momento exacto para presentarle el siguiente nivel, la membresía avanzada o el programa premium. ELEVA identifica automáticamente a estos participantes y activa una campaña personalizada sin que el equipo tenga que revisar nada manualmente.",
      calc: [
        { label: "Conversión: participantes con 80%+ misiones completadas", value: "~54%" },
        { label: "Conversión: población general del centro", value: "~20%" },
        { label: "Factor de diferencia", value: "≈ 2.7x más probable", highlight: true },
      ],
      note: "Estimación basada en patrones de conversión en programas de membresía por fases con seguimiento de engagement conductual.",
    },
  },
  {
    stage: "Comunidad",
    stageColor: "text-green-400",
    stageBg: "bg-green-500/10 border-green-500/20",
    signal: "Un participante que asiste a 2 o más eventos del centro al mes (webinars, masterclasses, sesiones grupales) tiene",
    stat: "3x",
    statColor: "text-green-400",
    outcome: "más retención anual que uno que solo entrena.",
    insight: "Los eventos no son extras. Son el mecanismo de retención más poderoso que tiene tu centro.",
    modal: {
      title: "Quien solo entrena paga por un servicio. Quien vive la comunidad, pertenece a algo",
      body: "El participante que solo asiste a entrenamientos puede comparar tu centro con otro y cambiar. El que asistió al webinar de tu nutriólogo, conoce a otros miembros, participó en la masterclass y tiene amigos en su cohorte, ese tiene un costo de salida completamente diferente. No está dejando un gimnasio; está dejando una comunidad. ELEVA crea la infraestructura para que esa comunidad tenga vida propia todos los días, no solo los días de entrenamiento.",
      calc: [
        { label: "Retención anual: participantes que asisten a 2+ eventos/mes", value: "~76%" },
        { label: "Retención anual: participantes que solo entrenan", value: "~25%" },
        { label: "Factor de diferencia", value: "≈ 3x más retención", highlight: true },
      ],
      note: "Basado en datos de retención de centros de transformación con programas de comunidad activa vs. centros enfocados solo en el servicio presencial.",
    },
  },
]

// ─── InsightModal ─────────────────────────────────────────────────────────────

export function InsightModal({ ins, onClose }: { ins: InsightDef; onClose: () => void }) {
  const { lang } = useLang()

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose() }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [onClose])

  const calcLabel = lang === "en" ? "Estimated calculation" : "Cálculo estimado"

  return (
    <motion.div
      key="insight-backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18 }}
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      <motion.div
        key="insight-panel"
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 16, scale: 0.97 }}
        transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
        className="relative max-w-lg w-full rounded-2xl bg-[#0E0C1A] border border-white/12 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className={`h-0.5 w-full ${ins.statColor.replace("text-", "bg-").replace("400", "500")}`} />

        <div className="p-6 sm:p-7">
          <div className="flex items-start justify-between gap-4 mb-5">
            <div>
              <span className={`inline-block text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border ${ins.stageBg} ${ins.stageColor} mb-3`}>
                {ins.stage}
              </span>
              <p className={`text-7xl font-black leading-none ${ins.statColor}`}>{ins.stat}</p>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-white/8 hover:bg-white/15 transition-colors text-white/60 hover:text-white flex-shrink-0 mt-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <h3 className="text-base font-bold text-white leading-snug mb-3">
            {ins.modal.title}
          </h3>

          <p className="text-sm text-white/70 leading-relaxed mb-5">
            {ins.modal.body}
          </p>

          <div className="rounded-xl border border-white/10 bg-white/4 overflow-hidden mb-4">
            <p className="text-[10px] uppercase tracking-widest text-white/40 font-semibold px-4 py-2.5 border-b border-white/8">
              {calcLabel}
            </p>
            {ins.modal.calc.map((row, i) => (
              <div
                key={i}
                className={`flex items-center justify-between gap-4 px-4 py-3 ${i < ins.modal.calc.length - 1 ? "border-b border-white/6" : ""} ${row.highlight ? "bg-white/4" : ""}`}
              >
                <span className={`text-xs leading-snug ${row.highlight ? "text-white font-medium" : "text-white/60"}`}>
                  {row.label}
                </span>
                <span className={`text-sm font-bold whitespace-nowrap flex-shrink-0 ${row.highlight ? ins.statColor : "text-white/80"}`}>
                  {row.value}
                </span>
              </div>
            ))}
          </div>

          <p className="text-[11px] text-white/35 leading-relaxed">
            {ins.modal.note}
          </p>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ─── InsightsSection ──────────────────────────────────────────────────────────

export function InsightsSection() {
  const { lang } = useLang()
  const [openIdx, setOpenIdx] = useState<number | null>(null)
  const openIns = openIdx !== null ? INSIGHTS[openIdx] : null

  const c = lang === "en" ? {
    badge: "What we learned from 40+ centers",
    h2a: "The patterns",
    h2b: "the industry doesn't see.",
    sub: "Every center that operates with ELEVA generates data. With 40+ active centers, we now know exactly which behaviors predict growth and which predict dropout.",
    whyLabel: "Why?",
    footer: "These patterns are built into the system. They're not metrics to review — they're",
    footerEm: "automatic actions already configured from day one.",
  } : {
    badge: "Lo que aprendimos de 40+ centros",
    h2a: "Los patrones que",
    h2b: "el sector no ve.",
    sub: "Cada centro que opera con ELEVA genera datos. Con 40+ centros activos, hoy sabemos exactamente qué comportamientos predicen el crecimiento y cuáles predicen el abandono.",
    whyLabel: "¿Por qué?",
    footer: "Estos patrones están integrados en el sistema. No son métricas para revisar, son",
    footerEm: "acciones automáticas que ya están configuradas desde el día uno.",
  }

  return (
    <section className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#0A0A14] via-[#0E0B1C] to-[#0A0F14]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(124,58,237,0.12),transparent)]" />
      <div className="section-rule absolute top-0 left-0 right-0" />

      <div className="relative max-w-5xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-14"
        >
          <div className="flex items-center gap-3 mb-5">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-violet-400 bg-violet-500/10 border border-violet-500/20 px-2.5 py-1 rounded-full">
              {c.badge}
            </span>
          </div>
          <h2 className="text-5xl sm:text-6xl font-black text-white leading-[1.05]">
            {c.h2a}<br />
            <span className="gradient-text">{c.h2b}</span>
          </h2>
          <p className="text-white/80 mt-4 max-w-xl text-base leading-relaxed">
            {c.sub}
          </p>
        </motion.div>

        <div className="space-y-4">
          {INSIGHTS.map((ins, i) => (
            <motion.div
              key={ins.stage}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-4 md:gap-8 items-center rounded-2xl p-5 md:p-6 border border-white/10 bg-white/4 hover:bg-white/6 hover:border-white/18 transition-colors group"
            >
              <div className="space-y-3">
                <span className={`inline-block text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border ${ins.stageBg} ${ins.stageColor}`}>
                  {ins.stage}
                </span>
                <p className="text-sm text-white/90 leading-relaxed">
                  {ins.signal}
                </p>
              </div>

              <button
                onClick={() => setOpenIdx(i)}
                className="flex flex-row md:flex-col items-center gap-3 md:gap-2 justify-center group/stat cursor-pointer focus:outline-none"
                aria-label={`Ver cálculo: ${ins.stat}`}
              >
                <span className={`text-5xl md:text-6xl font-black leading-none ${ins.statColor} group-hover/stat:scale-105 transition-transform`}>
                  {ins.stat}
                </span>
                <span className="flex items-center gap-1 text-[10px] text-white/40 group-hover/stat:text-white/70 transition-colors font-medium uppercase tracking-wider">
                  <Info className="w-3 h-3 flex-shrink-0" />
                  {c.whyLabel}
                </span>
                <ArrowRight className="hidden md:block w-4 h-4 text-white/20 rotate-90 flex-shrink-0 mt-1" />
              </button>

              <div className="space-y-3">
                <p className="text-base font-bold text-white leading-snug">
                  {ins.outcome}
                </p>
                <p className="text-xs text-white/60 leading-relaxed border-l-2 border-white/20 pl-3">
                  {ins.insight}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-10 text-center"
        >
          <p className="text-white/60 text-sm">
            {c.footer}{" "}
            <span className="text-white font-semibold">{c.footerEm}</span>
          </p>
        </motion.div>
      </div>

      <div className="section-rule absolute bottom-0 left-0 right-0" />

      <AnimatePresence>
        {openIns && (
          <InsightModal ins={openIns} onClose={() => setOpenIdx(null)} />
        )}
      </AnimatePresence>
    </section>
  )
}
