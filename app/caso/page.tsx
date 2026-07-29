"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { useInView } from "@/lib/use-in-view"
import {
  ArrowLeft, ArrowRight, TrendingUp, Users, DollarSign,
  Clock, AlertTriangle, CheckCircle2, BarChart3, Calendar,
  Quote, Building2,
} from "lucide-react"

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number]

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease, delay },
})

// ─── Data ─────────────────────────────────────────────────────────────────────

const BEFORE = [
  { icon: Users,         label: "Participantes activos",    value: "89",      color: "text-red-400" },
  { icon: TrendingUp,    label: "Churn primer mes",         value: "28%",     color: "text-red-400" },
  { icon: DollarSign,    label: "Ingresos mensuales",       value: "~$38k",   color: "text-red-400" },
  { icon: Clock,         label: "Horas admin del dueño/día", value: "3–4h",   color: "text-red-400" },
]

const AFTER = [
  { icon: Users,         label: "Participantes activos",    value: "247",     color: "text-emerald-400" },
  { icon: TrendingUp,    label: "Churn primer mes",         value: "8%",      color: "text-emerald-400" },
  { icon: DollarSign,    label: "Ingresos mensuales",       value: "~$112k",  color: "text-emerald-400" },
  { icon: Clock,         label: "Horas admin del dueño/día", value: "~45 min", color: "text-emerald-400" },
]

const FASES = [
  {
    num: "01",
    name: "Diagnóstico 360",
    duration: "3 semanas",
    color: "violet",
    items: [
      "Auditoría de ventas: embudo, conversión y fugas",
      "Mapa de la experiencia del participante",
      "Revisión del equipo: roles, responsabilidades y brechas",
      "Análisis de riesgos operativos",
      "Plan de 90 días con prioridades claras",
    ],
    insight: "El diagnóstico reveló que el 34% del churn ocurría en las primeras dos semanas por falta de seguimiento post-inscripción — no por problemas con el programa.",
  },
  {
    num: "02",
    name: "PACTO",
    duration: "4 meses",
    color: "blue",
    items: [
      "Formación de 3 coaches internos desde cero",
      "Diseño del currículo de la academia interna",
      "Instalación y configuración de ELEVA OS",
      "Onboarding digital automatizado para nuevos participantes",
      "Protocolo de seguimiento con Momentum Score",
    ],
    insight: "Al segundo mes, el dueño dejó de ser el único coach. Para el cuarto mes, el centro operaba igual de bien en su ausencia.",
  },
  {
    num: "03",
    name: "Partner continuo",
    duration: "Desde el mes 5",
    color: "emerald",
    items: [
      "Sesiones mensuales de revisión estratégica",
      "Benchmark contra otros centros en la red",
      "Expansión a segunda sede: plan y ejecución",
      "Actualización de playbooks con casos reales",
      "Contratación y onboarding del cuarto coach",
    ],
    insight: "A los 12 meses, el centro abrió una segunda sede en otra ciudad con el mismo equipo — sin contratar consultores externos.",
  },
]

const METRICS = [
  { label: "Participantes activos", before: "89", after: "247", delta: "+177%", color: "violet" },
  { label: "Ingresos mensuales", before: "~$38k", after: "~$112k", delta: "+195%", color: "emerald" },
  { label: "Churn mes 1", before: "28%", after: "8%", delta: "−20 pts", color: "cyan" },
  { label: "Coaches propios", before: "0", after: "3", delta: "+3", color: "blue" },
  { label: "Sedes activas", before: "1", after: "2", delta: "+1", color: "amber" },
  { label: "Horas admin dueño/día", before: "3–4h", after: "~45 min", delta: "−80%", color: "pink" },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

const PHASE_COLORS: Record<string, { border: string; bg: string; text: string; badge: string }> = {
  violet:  { border: "border-violet-500/25",  bg: "bg-violet-500/5",  text: "text-violet-400",  badge: "bg-violet-500/15 border-violet-500/25 text-violet-300" },
  blue:    { border: "border-blue-500/25",    bg: "bg-blue-500/5",    text: "text-blue-400",    badge: "bg-blue-500/15 border-blue-500/25 text-blue-300" },
  emerald: { border: "border-emerald-500/25", bg: "bg-emerald-500/5", text: "text-emerald-400", badge: "bg-emerald-500/15 border-emerald-500/25 text-emerald-300" },
}

const DELTA_COLORS: Record<string, string> = {
  violet:  "text-violet-400",
  emerald: "text-emerald-400",
  cyan:    "text-cyan-400",
  blue:    "text-blue-400",
  amber:   "text-amber-400",
  pink:    "text-pink-400",
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CasoPage() {
  const heroRef    = useInView(0.1)
  const beforeRef  = useInView(0.1)
  const fasesRef   = useInView(0.08)
  const metricsRef = useInView(0.1)
  const quoteRef   = useInView(0.15)
  const ctaRef     = useInView(0.15)

  return (
    <div className="min-h-screen bg-background text-foreground">

      {/* Nav */}
      <nav className="fixed top-0 inset-x-0 z-50 border-b border-foreground/5 bg-background/80 backdrop-blur-xl">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground transition-colors">
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <span className="text-foreground/20">/</span>
            <Link href="/" className="hover:text-foreground transition-colors">ELEVA</Link>
            <span className="text-foreground/20">/</span>
            <span className="text-foreground/60">Caso</span>
          </div>
          <Link href="/build">
            <button className="px-4 py-2 bg-violet-600 hover:bg-violet-500 text-foreground text-sm font-bold rounded-lg transition-colors">
              Solicitar diagnóstico
            </button>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-36 pb-20 px-6" ref={heroRef.ref}>
        <div className="max-w-5xl mx-auto">
          <motion.div {...fade(0)} className="space-y-8">

            {/* Badges */}
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-violet-500/10 border border-violet-500/20 text-violet-400 uppercase tracking-widest">
                <BarChart3 className="w-3 h-3" />
                Caso de estudio
              </span>
              <span className="text-xs text-muted-foreground px-3 py-1 rounded-full border border-foreground/8">
                Datos reales · Identidad protegida por NDA
              </span>
            </div>

            {/* Center profile */}
            <div className="flex items-start gap-4 p-5 rounded-2xl border border-foreground/8 bg-foreground/2 max-w-xl">
              <div className="w-11 h-11 rounded-xl bg-violet-500/15 flex items-center justify-center flex-shrink-0">
                <Building2 className="w-5 h-5 text-violet-400" />
              </div>
              <div className="space-y-1">
                <p className="font-bold text-foreground">Centro de transformación personal</p>
                <p className="text-sm text-muted-foreground">Medellín, Colombia · 7 años de operación</p>
                <p className="text-xs text-muted-foreground">Metodología VIA · Programas de 12–16 semanas</p>
              </div>
            </div>

            <div className="space-y-4">
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-foreground leading-[1.0] tracking-tight">
                De 89 a 247<br />
                <span className="gradient-text">participantes activos</span><br />
                <span className="text-foreground/45 font-light italic">en 12 meses.</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
                Un centro con 7 años de historia, metodología sólida y un dueño que era el único coach,
                el único vendedor y el único administrador. ELEVA ayudó a separar esas tres cosas.
              </p>
            </div>

            {/* Quick wins */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl">
              {[
                { val: "+177%", label: "participantes" },
                { val: "−20 pts", label: "churn mes 1" },
                { val: "+3", label: "coaches propios" },
                { val: "×2.9", label: "ingresos" },
              ].map((s) => (
                <div key={s.label} className="text-center p-4 rounded-xl border border-foreground/8 bg-foreground/2">
                  <p className="text-2xl font-black text-violet-400">{s.val}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Antes */}
      <section className="py-20 px-6 border-t border-foreground/5" ref={beforeRef.ref}>
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={beforeRef.inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease }}
            className="grid lg:grid-cols-2 gap-16"
          >
            <div className="space-y-6">
              <p className="text-xs font-bold text-red-400 uppercase tracking-widest">El punto de partida</p>
              <h2 className="text-4xl font-black text-foreground leading-tight">
                Lo que tenían antes de ELEVA.
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  El centro llevaba 7 años. La metodología funcionaba — los participantes que completaban el proceso tenían resultados reales. Pero la operación dependía de una sola persona.
                </p>
                <p>
                  El dueño facilitaba, vendía y coordinaba. No había manera de crecer sin que él estuviera presente en todo. Y eso hacía al centro frágil, aunque rentable.
                </p>
                <p>
                  El seguimiento post-entrenamiento era informal: WhatsApp cuando había tiempo, Excel para los pagos, ningún sistema para detectar quién estaba en riesgo de abandonar.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {[
                "Dueño como único coach, vendedor y admin simultáneamente",
                "Sin seguimiento estructurado post-entrenamiento",
                "28% de nuevos inscritos abandonaban en el primer mes",
                "Crecimiento limitado por disponibilidad del dueño",
                "Sin datos para saber qué participantes estaban en riesgo",
                "Metodología no documentada: si el dueño faltaba, el centro paraba",
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -12 }}
                  animate={beforeRef.inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.45, ease, delay: i * 0.07 }}
                  className="flex items-start gap-3 p-4 rounded-xl border border-red-500/12 bg-red-500/4"
                >
                  <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-foreground/80 leading-snug">{item}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Antes vs Después rápido */}
      <section className="py-16 px-6 border-t border-foreground/5">
        <div className="max-w-5xl mx-auto">
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="space-y-3">
              <p className="text-xs font-bold text-red-400 uppercase tracking-widest mb-4">Antes · Mes 0</p>
              {BEFORE.map((m) => (
                <div key={m.label} className="flex items-center justify-between p-4 rounded-xl border border-foreground/6 bg-foreground/2">
                  <div className="flex items-center gap-2.5">
                    <m.icon className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{m.label}</span>
                  </div>
                  <span className={`font-black text-base ${m.color}`}>{m.value}</span>
                </div>
              ))}
            </div>
            <div className="space-y-3">
              <p className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-4">Después · Mes 12</p>
              {AFTER.map((m) => (
                <div key={m.label} className="flex items-center justify-between p-4 rounded-xl border border-emerald-500/15 bg-emerald-500/4">
                  <div className="flex items-center gap-2.5">
                    <m.icon className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{m.label}</span>
                  </div>
                  <span className={`font-black text-base ${m.color}`}>{m.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* El proceso */}
      <section className="py-20 px-6 border-t border-foreground/5" ref={fasesRef.ref}>
        <div className="max-w-5xl mx-auto space-y-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={fasesRef.inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease }}
          >
            <p className="text-xs font-bold text-violet-400 uppercase tracking-widest mb-4">La implementación</p>
            <h2 className="text-4xl sm:text-5xl font-black text-foreground leading-tight max-w-2xl">
              Cómo se hizo, paso a paso.
            </h2>
          </motion.div>

          <div className="space-y-6">
            {FASES.map((fase, i) => {
              const c = PHASE_COLORS[fase.color]
              return (
                <motion.div
                  key={fase.num}
                  initial={{ opacity: 0, y: 20 }}
                  animate={fasesRef.inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.55, ease, delay: i * 0.1 }}
                  className={`rounded-2xl border ${c.border} ${c.bg} p-6 sm:p-8 space-y-5`}
                >
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div className="flex items-center gap-4">
                      <span className={`text-3xl font-black ${c.text} leading-none`}>{fase.num}</span>
                      <div>
                        <p className="font-black text-foreground text-lg">{fase.name}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{fase.duration}</p>
                      </div>
                    </div>
                  </div>

                  <ul className="space-y-2">
                    {fase.items.map((item) => (
                      <li key={item} className="flex items-start gap-2.5">
                        <CheckCircle2 className={`w-4 h-4 ${c.text} flex-shrink-0 mt-0.5`} />
                        <span className="text-sm text-foreground/80 leading-snug">{item}</span>
                      </li>
                    ))}
                  </ul>

                  <div className={`flex items-start gap-3 p-4 rounded-xl border ${c.badge} border-opacity-40`}>
                    <Quote className={`w-4 h-4 ${c.text} flex-shrink-0 mt-0.5`} />
                    <p className="text-sm text-foreground/75 leading-relaxed italic">{fase.insight}</p>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Resultados */}
      <section className="py-20 px-6 border-t border-foreground/5" ref={metricsRef.ref}>
        <div className="max-w-5xl mx-auto space-y-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={metricsRef.inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease }}
          >
            <p className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-4">A 12 meses</p>
            <h2 className="text-4xl sm:text-5xl font-black text-foreground leading-tight">
              Los números que importan.
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {METRICS.map((m, i) => (
              <motion.div
                key={m.label}
                initial={{ opacity: 0, y: 16 }}
                animate={metricsRef.inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, ease, delay: i * 0.07 }}
                className="glass rounded-2xl border border-foreground/6 p-6 space-y-3"
              >
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{m.label}</p>
                <div className="flex items-end gap-3">
                  <div className="text-center">
                    <p className="text-xl font-black text-foreground/40">{m.before}</p>
                    <p className="text-[9px] text-muted-foreground uppercase tracking-wider mt-0.5">antes</p>
                  </div>
                  <div className={`text-2xl font-black ${DELTA_COLORS[m.color]} flex-shrink-0`}>→</div>
                  <div className="text-center">
                    <p className="text-2xl font-black text-foreground">{m.after}</p>
                    <p className="text-[9px] text-muted-foreground uppercase tracking-wider mt-0.5">después</p>
                  </div>
                </div>
                <p className={`text-xs font-bold ${DELTA_COLORS[m.color]}`}>{m.delta}</p>
              </motion.div>
            ))}
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={metricsRef.inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, ease, delay: 0.5 }}
            className="text-xs text-muted-foreground/60 max-w-xl"
          >
            Datos extraídos del sistema ELEVA OS del centro. Ingresos en USD estimados.
            Los resultados varían según el punto de partida, el equipo y el nivel de implementación de cada centro.
          </motion.p>
        </div>
      </section>

      {/* Quote */}
      <section className="py-20 px-6 border-t border-foreground/5" ref={quoteRef.ref}>
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={quoteRef.inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.65, ease }}
            className="space-y-8"
          >
            <div className="glass rounded-2xl border border-violet-500/15 p-8 sm:p-10 space-y-6">
              <Quote className="w-8 h-8 text-violet-400/50" />
              <p className="text-xl sm:text-2xl text-foreground leading-relaxed">
                "Lo que cambió no fue la metodología. Esa siempre funcionó. Lo que cambió fue
                que el centro dejó de depender de mí para funcionar. Hoy puedo tomarme una semana
                libre y los números siguen igual."
              </p>
              <div className="flex items-center gap-3 pt-2 border-t border-foreground/8">
                <div className="w-10 h-10 rounded-full bg-violet-600/20 flex items-center justify-center text-xs font-black text-violet-400">
                  MDE
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground">Dueño del centro</p>
                  <p className="text-xs text-muted-foreground">Medellín, Colombia · 12 meses con ELEVA</p>
                </div>
              </div>
            </div>

            <div className="grid sm:grid-cols-3 gap-4">
              {[
                { icon: Calendar, text: "Inicio: Diagnóstico 360 en 3 semanas" },
                { icon: BarChart3, text: "Implementación: 4 meses de PACTO" },
                { icon: TrendingUp, text: "Hoy: Partner mensual + segunda sede" },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-2.5 p-4 rounded-xl border border-foreground/6">
                  <item.icon className="w-4 h-4 text-violet-400 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-muted-foreground leading-snug">{item.text}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-28 px-6 border-t border-foreground/5" ref={ctaRef.ref}>
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={ctaRef.inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65, ease }}
          className="max-w-3xl mx-auto text-center space-y-8"
        >
          <div className="space-y-4">
            <p className="text-xs font-bold text-violet-400 uppercase tracking-widest">¿Tu centro tiene potencial similar?</p>
            <h2 className="text-4xl sm:text-5xl font-black text-foreground leading-tight">
              El Diagnóstico 360 empieza<br />
              <span className="text-foreground/50 font-light italic">con entender dónde estás.</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
              En tres semanas sabes con exactitud cuáles son tus palancas de crecimiento
              y cuáles son los riesgos que estás ignorando.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/build">
              <button className="flex items-center gap-2.5 px-8 py-4 bg-violet-600 hover:bg-violet-500 text-foreground font-black rounded-xl transition-colors text-base group">
                Solicitar Diagnóstico 360
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </Link>
            <Link href="/pacto">
              <button className="flex items-center gap-2.5 px-8 py-4 glass border border-foreground/10 hover:border-foreground/20 text-foreground font-bold rounded-xl transition-colors text-base">
                Ver programa PACTO
              </button>
            </Link>
          </div>

          <p className="text-xs text-muted-foreground">
            Empieza con una llamada de calificación gratuita · El monto del diagnóstico se descuenta al contratar PACTO
          </p>
        </motion.div>
      </section>

    </div>
  )
}
