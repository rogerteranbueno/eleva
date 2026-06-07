"use client"

import { useState, useRef } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { useLang } from "@/lib/i18n"

// ─── Stage data ───────────────────────────────────────────────────────────────

const STAGE_DATA_ES = [
  {
    id: "adquirir",
    num: "01",
    label: "Adquirir",
    color: "cyan" as const,
    headline: "El enrolamiento empieza mucho antes de vender",
    story: "Tu centro organiza webinars y eventos abiertos. Tus participantes actuales invitan a su gente, es un ganar-ganar: ellos llevan a alguien a probar la experiencia, tu comunidad crece y el prospecto conoce el centro sin presión.\n\nELEVA registra cada asistente en el CRM, identifica señales de interés (abrió el email, asistió al webinar, preguntó en el chat) y automáticamente les envía contenido de valor. Cuando llega el momento de enrolar, el prospecto ya te conoce.",
    stat: { value: "80%", label: "más fácil enrolar un lead nutrido" },
    features: [
      { icon: "🎙️", text: "Webinars y eventos gratuitos de demostración" },
      { icon: "🔗", text: "Link de referido para participantes, con tracking de quién trajo a quién" },
      { icon: "📋", text: "CRM integrado: registro automático de cada asistente o lead" },
      { icon: "📡", text: "Detección de señales: clics, aperturas, preguntas, asistencias" },
      { icon: "✉️", text: "Secuencias de contenido de valor por WhatsApp, Email y SMS" },
      { icon: "🌐", text: "Sitio web propio del centro, optimizado en AEO + SEO" },
    ],
    visual: [
      { step: "Evento gratuito", note: "Tu participante trae a un amigo" },
      { step: "CRM registra la señal", note: "Asistió, preguntó, interactuó" },
      { step: "Contenido de valor", note: "WhatsApp · Email · SMS automático" },
      { step: "Momento de enrolamiento", note: "Ya confía en ti. El sí es natural." },
    ],
    moduleLabel: "Qué incluye este módulo",
  },
  {
    id: "activar",
    num: "02",
    label: "Activar",
    color: "yellow" as const,
    headline: "De inscrito a comprometido en los primeros 7 días",
    story: "La emoción del enrolamiento dura poco si no hay un sistema que la sostenga. ELEVA activa al participante desde el momento en que firma, con un onboarding claro, su expediente completo y su primera misión lista.\n\nNadie llega en frío al primer día. Nadie se pierde en el grupo de WhatsApp preguntando qué sigue.",
    stat: { value: "7 días", label: "para consolidar el hábito de participación" },
    features: [
      { icon: "🚀", text: "Portal de bienvenida automático al inscribirse" },
      { icon: "📝", text: "Expediente digital desde el día uno: objetivos, historial, coach asignado" },
      { icon: "🎯", text: "Primera misión activa antes del primer entrenamiento" },
      { icon: "🔔", text: "Notificaciones personalizadas por WhatsApp, Email o SMS" },
      { icon: "📊", text: "Dashboard del participante: progreso, racha, misiones" },
      { icon: "👥", text: "Asignación automática a cohorte y coach desde el CRM" },
    ],
    visual: [
      { step: "Inscripción confirmada", note: "WhatsApp de bienvenida automático" },
      { step: "Expediente creado", note: "Objetivos, coach asignado, cohorte" },
      { step: "Primera misión activa", note: "Antes del primer entrenamiento" },
      { step: "Hábito consolidado", note: "Check-in diario en los primeros 7 días" },
    ],
    moduleLabel: "Qué incluye este módulo",
  },
  {
    id: "retener",
    num: "03",
    label: "Retener",
    color: "pink" as const,
    headline: "Que nadie abandone en silencio",
    story: "Retener no es solo evitar que se vayan: es darles razones para quedarse cada día. ELEVA combina comunicación multicanal, contenido de expertos, gamificación y una comunidad que se auto-refuerza.\n\nY cuando alguien empieza a desconectarse, el sistema lo detecta primero que el coach, con tiempo para intervenir antes de que sea tarde.",
    stat: { value: "3x", label: "más retención con gamificación activa" },
    features: [
      { icon: "📱", text: "Seguimiento multicanal: WhatsApp, Email, SMS, notificaciones push" },
      { icon: "🎙️", text: "Webinars y contenido exclusivo de expertos internos y externos" },
      { icon: "🏆", text: "Gamificación: Momentum Score, racha de días, leaderboard de cohorte" },
      { icon: "🔍", text: "Directorio de profesionales: coaches, especialistas y expertos con reseñas reales" },
      { icon: "⚠️", text: "Alerta temprana de riesgo: intervención antes de abandono" },
      { icon: "🩺", text: "Especialistas integrados: nutriólogos, psicólogos, coaches financieros agendables" },
    ],
    visual: [
      { step: "Detección temprana", note: "Sistema detecta caída de momentum" },
      { step: "Alerta al coach", note: "Notificación automática con contexto" },
      { step: "Intervención personalizada", note: "Mensaje, llamada o misión especial" },
      { step: "Recuperación activa", note: "Participante vuelve al flujo normal" },
    ],
    moduleLabel: "Qué incluye este módulo",
  },
  {
    id: "escalar",
    num: "04",
    label: "Escalar",
    color: "violet" as const,
    headline: "Crecer sin reinventar el modelo",
    story: "El escalamiento real no es traer más gente: es convertir tu centro en una operación que funciona con o sin un buen fin de semana. ELEVA te da visibilidad total: cuántos pasan de fase, qué cohorte está en riesgo, qué ciudad está creciendo más.\n\nUn panel para varias sedes, varios coaches, varios formatos, sin caos.",
    stat: { value: "1 panel", label: "para todas las sedes, coaches y cohortes" },
    features: [
      { icon: "📈", text: "Conversión fase a fase: cuántos pasan de Básico a Avanzado a Vía" },
      { icon: "⚡", text: "Campañas de enrolamiento automatizadas al siguiente nivel" },
      { icon: "🏅", text: "Alumni activos: egresados que refieren y mentorean a nuevos" },
      { icon: "🌎", text: "Multi-sede: un sistema para varias ciudades o formatos" },
      { icon: "🔐", text: "Roles diferenciados: dueño, director, coach, participante" },
      { icon: "📊", text: "KPIs de negocio reales: ingresos, retención, NPS, momentum promedio" },
    ],
    visual: [
      { step: "Análisis de conversión", note: "Fase a fase, por cohorte y por coach" },
      { step: "Campaña automática", note: "Enrolamiento al siguiente nivel" },
      { step: "Alumni activos", note: "Egresados que refieren y mentorean" },
      { step: "Multi-sede unificada", note: "Un panel, todas las ciudades" },
    ],
    moduleLabel: "Qué incluye este módulo",
  },
]

const STAGE_DATA_EN = [
  {
    id: "acquire",
    num: "01",
    label: "Acquire",
    color: "cyan" as const,
    headline: "Enrollment starts long before the sale",
    story: "Your center runs webinars and open events. Current participants invite their people — a win-win: they bring someone to experience the center, your community grows, and the prospect learns about it without pressure.\n\nELEVA logs every attendee in the CRM, detects interest signals (opened the email, attended the webinar, asked in the chat) and automatically sends value content. By the time enrollment comes, they already know you.",
    stat: { value: "80%", label: "easier to enroll a nurtured lead" },
    features: [
      { icon: "🎙️", text: "Free demo webinars and open events" },
      { icon: "🔗", text: "Referral links for participants, tracking who brought whom" },
      { icon: "📋", text: "Integrated CRM: automatic registration of every attendee or lead" },
      { icon: "📡", text: "Signal detection: clicks, opens, questions, attendance" },
      { icon: "✉️", text: "Value content sequences via WhatsApp, Email and SMS" },
      { icon: "🌐", text: "Your center's own website, optimized for AEO + SEO" },
    ],
    visual: [
      { step: "Free event", note: "Your participant brings a friend" },
      { step: "CRM logs the signal", note: "Attended, asked, interacted" },
      { step: "Value content", note: "WhatsApp · Email · automated SMS" },
      { step: "Enrollment moment", note: "They already trust you. The yes is natural." },
    ],
    moduleLabel: "What this module includes",
  },
  {
    id: "activate",
    num: "02",
    label: "Activate",
    color: "yellow" as const,
    headline: "From enrolled to committed in the first 7 days",
    story: "The excitement of enrollment fades fast without a system to sustain it. ELEVA activates participants the moment they sign — with clear onboarding, their complete file, and their first mission ready.\n\nNo one shows up cold on day one. No one gets lost in a WhatsApp group asking what comes next.",
    stat: { value: "7 days", label: "to consolidate the participation habit" },
    features: [
      { icon: "🚀", text: "Automatic welcome portal upon enrollment" },
      { icon: "📝", text: "Digital file from day one: goals, history, assigned coach" },
      { icon: "🎯", text: "First mission active before the first training session" },
      { icon: "🔔", text: "Personalized notifications via WhatsApp, Email or SMS" },
      { icon: "📊", text: "Participant dashboard: progress, streak, missions" },
      { icon: "👥", text: "Automatic assignment to cohort and coach from CRM" },
    ],
    visual: [
      { step: "Enrollment confirmed", note: "Automatic WhatsApp welcome" },
      { step: "File created", note: "Goals, assigned coach, cohort" },
      { step: "First mission active", note: "Before the first training session" },
      { step: "Habit consolidated", note: "Daily check-in during the first 7 days" },
    ],
    moduleLabel: "What this module includes",
  },
  {
    id: "retain",
    num: "03",
    label: "Retain",
    color: "pink" as const,
    headline: "No one leaves in silence",
    story: "Retention isn't just stopping people from leaving — it's giving them reasons to stay every single day. ELEVA combines multi-channel communication, expert content, gamification, and a self-reinforcing community.\n\nWhen someone starts to disengage, the system detects it before the coach does, with time to intervene before it's too late.",
    stat: { value: "3x", label: "more retention with active gamification" },
    features: [
      { icon: "📱", text: "Multi-channel tracking: WhatsApp, Email, SMS, push notifications" },
      { icon: "🎙️", text: "Exclusive webinars and content from internal and external experts" },
      { icon: "🏆", text: "Gamification: Momentum Score, daily streak, cohort leaderboard" },
      { icon: "🔍", text: "Professional directory: coaches, specialists, and experts with real reviews" },
      { icon: "⚠️", text: "Early risk alert: intervention before dropout" },
      { icon: "🩺", text: "Integrated specialists: nutritionists, psychologists, financial coaches — bookable" },
    ],
    visual: [
      { step: "Early detection", note: "System detects momentum drop" },
      { step: "Coach alert", note: "Automatic notification with context" },
      { step: "Personalized intervention", note: "Message, call or special mission" },
      { step: "Active recovery", note: "Participant returns to normal flow" },
    ],
    moduleLabel: "What this module includes",
  },
  {
    id: "scale",
    num: "04",
    label: "Scale",
    color: "violet" as const,
    headline: "Grow without reinventing the model",
    story: "Real scaling isn't bringing in more people — it's turning your center into an operation that works with or without a great weekend. ELEVA gives you full visibility: how many advance between phases, which cohort is at risk, which city is growing fastest.\n\nOne panel for multiple locations, coaches, and formats — no chaos.",
    stat: { value: "1 panel", label: "for all locations, coaches and cohorts" },
    features: [
      { icon: "📈", text: "Phase-to-phase conversion: how many advance from Basic to Advanced to Path" },
      { icon: "⚡", text: "Automated enrollment campaigns for the next level" },
      { icon: "🏅", text: "Active alumni: graduates who refer and mentor newcomers" },
      { icon: "🌎", text: "Multi-location: one system for multiple cities or formats" },
      { icon: "🔐", text: "Role-based access: owner, director, coach, participant" },
      { icon: "📊", text: "Real business KPIs: revenue, retention, NPS, average momentum" },
    ],
    visual: [
      { step: "Conversion analysis", note: "Phase by phase, by cohort and coach" },
      { step: "Automated campaign", note: "Enrollment to next level" },
      { step: "Active alumni", note: "Graduates who refer and mentor" },
      { step: "Unified multi-location", note: "One panel, all cities" },
    ],
    moduleLabel: "What this module includes",
  },
]

const STAGE_COLORS = {
  cyan: {
    tab: "border-cyan-500 text-cyan-400 bg-cyan-500/10",
    tabInactive: "border-transparent text-muted-foreground hover:text-foreground hover:border-border",
    num: "text-cyan-400",
    stat: "text-cyan-400",
    dot: "bg-cyan-400",
    icon: "bg-cyan-500/10 text-cyan-400",
    step: "bg-cyan-500/20 border-cyan-500/40 text-cyan-300",
    line: "bg-cyan-500/20",
  },
  yellow: {
    tab: "border-yellow-500 text-yellow-400 bg-yellow-500/10",
    tabInactive: "border-transparent text-muted-foreground hover:text-foreground hover:border-border",
    num: "text-yellow-400",
    stat: "text-yellow-400",
    dot: "bg-yellow-400",
    icon: "bg-yellow-500/10 text-yellow-400",
    step: "bg-yellow-500/20 border-yellow-500/40 text-yellow-300",
    line: "bg-yellow-500/20",
  },
  pink: {
    tab: "border-pink-500 text-pink-400 bg-pink-500/10",
    tabInactive: "border-transparent text-muted-foreground hover:text-foreground hover:border-border",
    num: "text-pink-400",
    stat: "text-pink-400",
    dot: "bg-pink-400",
    icon: "bg-pink-500/10 text-pink-400",
    step: "bg-pink-500/20 border-pink-500/40 text-pink-300",
    line: "bg-pink-500/20",
  },
  violet: {
    tab: "border-violet-500 text-violet-400 bg-violet-500/10",
    tabInactive: "border-transparent text-muted-foreground hover:text-foreground hover:border-border",
    num: "text-violet-400",
    stat: "text-violet-400",
    dot: "bg-violet-400",
    icon: "bg-violet-500/10 text-violet-400",
    step: "bg-violet-500/20 border-violet-500/40 text-violet-300",
    line: "bg-violet-500/20",
  },
}

export function HowItWorksSection() {
  const { lang } = useLang()
  const [active, setActive] = useState(0)
  const tabsRef = useRef<HTMLDivElement>(null)

  const STAGE_DATA = lang === "en" ? STAGE_DATA_EN : STAGE_DATA_ES
  const stage = STAGE_DATA[active]
  const colors = STAGE_COLORS[stage.color]

  const c = lang === "en" ? {
    badge: "04 · How it works",
    h2: "The 4 stages of the system.",
    sub: "Tap each stage to see exactly what it includes.",
    footer: "From zero to operational in 60 days or less.",
    footerSub: "All 4 stages running simultaneously, without hiring more staff or reinventing your methodology.",
    footerCta: "See all 4 stages in the demo",
  } : {
    badge: "04 · Cómo funciona",
    h2: "Las 4 etapas del sistema.",
    sub: "Toca cada etapa para ver exactamente qué incluye.",
    footer: "De cero a operativo en máximo 60 días.",
    footerSub: "Las 4 etapas corriendo en simultáneo, sin contratar más equipo ni reinventar tu metodología.",
    footerCta: "Ver las 4 etapas en el demo",
  }

  return (
    <section className="section-accent relative py-20">
      <div className="section-rule absolute top-0 left-0 right-0" />
      <div className="max-w-5xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10"
        >
          <div className="flex items-center gap-3 mb-4">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-violet-400 bg-violet-500/10 border border-violet-500/20 px-2.5 py-1 rounded-full">{c.badge}</span>
          </div>
          <h2 className="text-5xl sm:text-6xl font-black text-foreground leading-[1.05]">{c.h2}</h2>
          <p className="text-muted-foreground mt-3 text-sm">{c.sub}</p>
        </motion.div>

        <div className="relative mb-8">
          <div
            ref={tabsRef}
            className="flex gap-1 sm:gap-2 overflow-x-auto pb-1 scrollbar-hide"
            style={{ scrollbarWidth: "none" }}
          >
            {STAGE_DATA.map((s, i) => {
              const col = STAGE_COLORS[s.color]
              const isActive = i === active
              return (
                <button
                  key={s.id}
                  onClick={() => setActive(i)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-semibold transition-all whitespace-nowrap flex-shrink-0",
                    isActive ? col.tab : col.tabInactive
                  )}
                >
                  <span className={cn("text-xs font-black", isActive ? col.num : "text-muted-foreground")}>{s.num}</span>
                  {s.label}
                </button>
              )
            })}
          </div>
          <div className="absolute right-0 top-0 bottom-1 w-8 bg-gradient-to-l from-background to-transparent pointer-events-none sm:hidden" />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={stage.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.25 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8"
          >
            <div className="space-y-6">
              <div>
                <p className={cn("text-xs font-bold uppercase tracking-widest mb-2", colors.num)}>
                  {stage.num} · {stage.label}
                </p>
                <h3 className="text-2xl sm:text-3xl font-black text-foreground leading-tight mb-4">
                  {stage.headline}
                </h3>
                {stage.story.split("\n\n").map((para, i) => (
                  <p key={i} className="text-sm text-foreground/75 leading-relaxed mb-3">{para}</p>
                ))}
              </div>

              <div className="inline-flex items-center gap-3 px-4 py-3 rounded-xl border border-white/10 bg-white/3">
                <p className={cn("text-3xl font-black", colors.stat)}>{stage.stat.value}</p>
                <p className="text-sm text-muted-foreground leading-snug max-w-[180px]">{stage.stat.label}</p>
              </div>

              <div className="space-y-2">
                {stage.visual.map((step, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="flex flex-col items-center">
                      <div className={cn("w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black border", colors.step)}>
                        {i + 1}
                      </div>
                      {i < stage.visual.length - 1 && (
                        <div className={cn("w-px h-5 mt-1", colors.line)} />
                      )}
                    </div>
                    <div className="pb-2">
                      <p className="text-sm font-semibold text-foreground">{step.step}</p>
                      <p className="text-xs text-muted-foreground">{step.note}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass rounded-2xl p-6 space-y-3">
              <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold mb-4">
                {stage.moduleLabel}
              </p>
              {stage.features.map(({ icon, text }) => (
                <div key={text} className="flex items-start gap-3 p-3 rounded-xl bg-white/3 border border-white/5 hover:border-white/10 transition-colors">
                  <span className="text-lg flex-shrink-0 leading-none">{icon}</span>
                  <p className="text-sm text-foreground/80 leading-relaxed">{text}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 glass rounded-2xl px-6 py-5 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4"
        >
          <div className="text-center sm:text-left space-y-1">
            <p className="text-foreground font-bold text-base">{c.footer}</p>
            <p className="text-sm text-muted-foreground">{c.footerSub}</p>
          </div>
          <Link href="/demo" className="flex-shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm font-bold transition-colors whitespace-nowrap">
            {c.footerCta} <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
