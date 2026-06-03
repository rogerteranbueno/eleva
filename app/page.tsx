"use client"

import { useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import {
  ArrowRight,
  ChevronDown,
  ChevronRight,
  Activity,
  Users,
  TrendingUp,
  Star,
  Building2,
  Globe,
  Zap,
  Heart,
  BarChart3,
  Target,
  Shield,
  CheckCircle,
} from "lucide-react"
import { cn } from "@/lib/utils"

// ─── Expandable Section ───────────────────────────────────────────────────────

function ExpandableSection({
  title,
  subtitle,
  badge,
  children,
}: {
  title: string
  subtitle: string
  badge?: string
  children: React.ReactNode
}) {
  const [open, setOpen] = useState(false)

  return (
    <div className="glass rounded-2xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-start gap-4 p-6 text-left hover:bg-white/2 transition-colors"
      >
        {badge && (
          <span className="flex-shrink-0 px-2.5 py-1 rounded-full bg-violet-600/20 text-violet-400 text-xs font-semibold border border-violet-600/30">
            {badge}
          </span>
        )}
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-bold text-white">{title}</h3>
          {subtitle && <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>}
        </div>
        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="flex-shrink-0 mt-1"
        >
          <ChevronDown className="w-5 h-5 text-muted-foreground" />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className="px-6 pb-6 border-t border-border pt-5">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── Nav ──────────────────────────────────────────────────────────────────────

function Nav() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-background/80 backdrop-blur-xl border-b border-border">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center">
          <span className="text-white font-black text-sm">E</span>
        </div>
        <span className="font-black text-white text-lg tracking-tight">ELEVA</span>
      </div>
      <div className="flex items-center gap-3">
        <Link href="/build" className="text-sm text-muted-foreground hover:text-white transition-colors hidden sm:block">
          Construye tu sistema
        </Link>
        <a href="#contacto" className="text-sm text-muted-foreground hover:text-white transition-colors hidden sm:block">
          Contacto
        </a>
        <Link href="/demo">
          <button className="flex items-center gap-1.5 px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg text-sm font-semibold transition-colors">
            Ver demo
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </Link>
      </div>
    </nav>
  )
}

// ─── Hero ────────────────────────────────────────────────────────────────────

function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-6 text-center overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-violet-600/8 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-cyan-600/6 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="relative max-w-4xl mx-auto space-y-8"
      >
        <div className="flex items-center justify-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-violet-600 flex items-center justify-center">
            <span className="text-white font-black text-lg">E</span>
          </div>
          <span className="font-black text-white text-2xl tracking-tight">ELEVA</span>
        </div>

        <h1 className="text-5xl sm:text-6xl md:text-7xl font-black text-white leading-[1.05] tracking-tight">
          Si un mal fin de semana{" "}
          <span className="gradient-text">pone en riesgo tu centro</span>,
          necesitas un mejor sistema.
        </h1>

        <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          ELEVA es la plataforma construida para centros de transformación, coaching y desarrollo humano.
          Centraliza tu operación, profesionaliza la experiencia de tus participantes
          y crece con tecnología — no solo con enrolamiento.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/demo">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2 px-8 py-4 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-base font-bold transition-colors glow-violet"
            >
              Ver el demo en vivo
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </Link>
          <a href="#contacto">
            <button className="flex items-center gap-2 px-8 py-4 glass text-foreground rounded-xl text-base font-medium hover:text-white transition-colors">
              Agendar una sesión
              <ChevronRight className="w-4 h-4" />
            </button>
          </a>
        </div>

        <div className="flex items-center justify-center gap-6 pt-4 text-sm text-muted-foreground flex-wrap">
          <div className="flex items-center gap-2">
            <div className="flex -space-x-1">
              {["AR", "MF", "DT", "RP"].map((i) => (
                <div key={i} className="w-7 h-7 rounded-full bg-violet-600 border-2 border-background flex items-center justify-center text-[9px] font-bold text-white">
                  {i}
                </div>
              ))}
            </div>
            <span>Centros piloto activos</span>
          </div>
          <div className="hidden sm:flex items-center gap-2">
            <div className="flex gap-0.5">
              {[1,2,3,4,5].map((s) => (
                <Star key={s} className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <span>Demo aprobado por fundadores</span>
          </div>
        </div>
      </motion.div>

      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute bottom-8 flex flex-col items-center gap-2 text-muted-foreground"
      >
        <span className="text-xs">Conoce el sistema</span>
        <ChevronDown className="w-4 h-4" />
      </motion.div>
    </section>
  )
}

// ─── Problem Section ──────────────────────────────────────────────────────────

function ProblemSection() {
  const items = [
    "Las inscripciones llegan por WhatsApp",
    "El expediente del participante es una hoja de Excel",
    "El seguimiento post-entrenamiento depende del criterio del coach",
    "La comunicación son grupos con 200 personas que nadie puede gestionar",
    "No sabes quién está avanzando y quién se está perdiendo hasta que ya es tarde",
    "El crecimiento depende casi por completo de que la última generación enrole bien",
  ]

  return (
    <section className="px-6 py-16 max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <p className="text-xs uppercase tracking-widest text-violet-400 font-semibold mb-4">El problema</p>
        <h2 className="text-4xl sm:text-5xl font-black text-white">
          Tu centro opera igual que hace 20 años.
        </h2>
        <p className="text-muted-foreground mt-4 text-lg">¿Te suena esto familiar?</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-10">
        {items.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className="flex items-start gap-3 glass rounded-xl p-4"
          >
            <div className="w-2 h-2 rounded-full bg-red-400 flex-shrink-0 mt-1.5" />
            <p className="text-sm text-foreground leading-relaxed">{item}</p>
          </motion.div>
        ))}
      </div>

      <div className="text-center">
        <p className="text-2xl font-black text-muted-foreground italic">
          La metodología evolucionó.{" "}
          <span className="text-white">La tecnología no.</span>
        </p>
      </div>
    </section>
  )
}

// ─── Contrast Section ─────────────────────────────────────────────────────────

function ContrastSection() {
  const rows = [
    { before: "WhatsApp para todo", after: "Comunicación centralizada y segmentada" },
    { before: "Excel con datos dispersos", after: "Expediente vivo por participante" },
    { before: "Seguimiento a ojo", after: "Momentum Score en tiempo real" },
    { before: "Comunidad fragmentada", after: "Cohortes vivas con feed, chat y retos" },
    { before: "Sin soporte entre fases", after: "Especialistas, contenido y misiones todos los días" },
    { before: "Crecimiento por presión", after: "Crecimiento por valor percibido" },
    { before: "No sabes qué está pasando", after: "Panel de control del dueño en tiempo real" },
  ]

  return (
    <section className="px-6 py-16 max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <p className="text-xs uppercase tracking-widest text-cyan-400 font-semibold mb-4">El contraste</p>
        <h2 className="text-4xl sm:text-5xl font-black text-white">
          Esto es lo que cambia con ELEVA.
        </h2>
      </motion.div>

      {/* Desktop: 2-col table — Mobile: stacked cards */}
      <div className="hidden sm:block glass rounded-2xl overflow-hidden">
        <div className="grid grid-cols-2 border-b border-border">
          <div className="p-4 text-center">
            <span className="text-xs font-bold text-red-400 uppercase tracking-wider">Hoy</span>
          </div>
          <div className="p-4 text-center border-l border-border">
            <span className="text-xs font-bold text-violet-400 uppercase tracking-wider">Con ELEVA</span>
          </div>
        </div>
        {rows.map((row, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.06 }}
            className="grid grid-cols-2 border-b border-border last:border-0 hover:bg-white/2 transition-colors"
          >
            <div className="p-4 flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0" />
              <span className="text-sm text-muted-foreground">{row.before}</span>
            </div>
            <div className="p-4 flex items-center gap-2 border-l border-border">
              <CheckCircle className="w-3.5 h-3.5 text-violet-400 flex-shrink-0" />
              <span className="text-sm text-white font-medium">{row.after}</span>
            </div>
          </motion.div>
        ))}
      </div>
      <div className="sm:hidden space-y-3">
        {rows.map((row, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.06 }}
            className="glass rounded-xl overflow-hidden"
          >
            <div className="flex items-start gap-2 px-4 py-3 border-b border-border">
              <div className="w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0 mt-1.5" />
              <span className="text-sm text-muted-foreground leading-snug">{row.before}</span>
            </div>
            <div className="flex items-start gap-2 px-4 py-3 bg-violet-600/5">
              <CheckCircle className="w-3.5 h-3.5 text-violet-400 flex-shrink-0 mt-0.5" />
              <span className="text-sm text-white font-medium leading-snug">{row.after}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

// ─── How It Works ─────────────────────────────────────────────────────────────

const STAGE_DATA = [
  {
    id: "adquirir",
    num: "01",
    label: "Adquirir",
    color: "cyan" as const,
    headline: "El enrolamiento empieza mucho antes de vender",
    story: "Tu centro organiza webinars y eventos abiertos. Tus participantes actuales invitan a su gente — es un ganar-ganar: ellos llevan a alguien a probar la experiencia, tu comunidad crece y el prospecto conoce el centro sin presión.\n\nELEVA registra cada asistente en el CRM, identifica señales de interés (abrió el email, asistió al webinar, preguntó en el chat) y automáticamente les envía contenido de valor. Cuando llega el momento de enrolar, el prospecto ya te conoce — el proceso puede ser hasta un 80% más sencillo que vender en frío.",
    stat: { value: "80%", label: "más fácil enrolar un lead nutrido" },
    features: [
      { icon: "🎙️", text: "Webinars y eventos gratuitos de demostración" },
      { icon: "🔗", text: "Link de referido para participantes — tracking de quién trajo a quién" },
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
  },
  {
    id: "activar",
    num: "02",
    label: "Activar",
    color: "yellow" as const,
    headline: "De inscrito a comprometido en los primeros 7 días",
    story: "La emoción del enrolamiento dura poco si no hay un sistema que la sostenga. ELEVA activa al participante desde el momento en que firma — con un onboarding claro, su expediente completo y su primera misión lista.\n\nNadie llega en frío al primer día. Nadie se pierde en el grupo de WhatsApp preguntando qué sigue.",
    stat: { value: "7 días", label: "para consolidar el hábito de participación" },
    features: [
      { icon: "🚀", text: "Portal de bienvenida automático al inscribirse" },
      { icon: "📝", text: "Expediente digital desde el día uno: objetivos, historial, coach asignado" },
      { icon: "🎯", text: "Primera misión activa antes del primer entrenamiento" },
      { icon: "🔔", text: "Notificaciones personalizadas por WhatsApp, Email o SMS" },
      { icon: "📊", text: "Dashboard del participante: progreso, racha, misiones" },
      { icon: "👥", text: "Asignación automática a cohorte y coach desde el CRM" },
    ],
    visual: [],
  },
  {
    id: "retener",
    num: "03",
    label: "Retener",
    color: "pink" as const,
    headline: "Que nadie abandone en silencio",
    story: "Retener no es solo evitar que se vayan — es darles razones para quedarse cada día. ELEVA combina comunicación multicanal, contenido de expertos, gamificación y una comunidad que se auto-refuerza.\n\nY cuando alguien empieza a desconectarse, el sistema lo detecta primero que el coach — con tiempo para intervenir antes de que sea tarde.",
    stat: { value: "3x", label: "más retención con gamificación activa" },
    features: [
      { icon: "📱", text: "Seguimiento multicanal: WhatsApp, Email, SMS, notificaciones push" },
      { icon: "🎙️", text: "Webinars y contenido exclusivo de expertos internos y externos" },
      { icon: "🏆", text: "Gamificación: Momentum Score, racha de días, leaderboard de cohorte" },
      { icon: "🔍", text: "Directorio de profesionales — busca coaches, especialistas y expertos en tu comunidad, con reseñas reales" },
      { icon: "⚠️", text: "Alerta temprana de riesgo: intervención antes de abandono" },
      { icon: "🩺", text: "Especialistas integrados — nutriólogos, psicólogos, coaches financieros agendables desde el sistema" },
    ],
    visual: [],
  },
  {
    id: "escalar",
    num: "04",
    label: "Escalar",
    color: "violet" as const,
    headline: "Crecer sin reinventar el modelo",
    story: "El escalamiento real no es traer más gente — es convertir tu centro en una operación que funciona con o sin un buen fin de semana. ELEVA te da visibilidad total: cuántos pasan de fase, qué cohort está en riesgo, qué ciudad está creciendo más.\n\nUn panel para varias sedes, varios coaches, varios formatos — sin caos.",
    stat: { value: "1 panel", label: "para todas las sedes, coaches y cohortes" },
    features: [
      { icon: "📈", text: "Conversión fase a fase: cuántos pasan de Básico a Avanzado a Vía" },
      { icon: "⚡", text: "Campañas de enrolamiento automatizadas al siguiente nivel" },
      { icon: "🏅", text: "Alumni activos: egresados que refieren y mentorean a nuevos" },
      { icon: "🌎", text: "Multi-sede: un sistema para varias ciudades o formatos" },
      { icon: "🔐", text: "Roles diferenciados: dueño, director, coach, participante" },
      { icon: "📊", text: "KPIs de negocio reales: ingresos, retención, NPS, momentum promedio" },
    ],
    visual: [],
  },
]

const STAGE_COLORS = {
  cyan: {
    tab: "border-cyan-500 text-cyan-400 bg-cyan-500/10",
    tabInactive: "border-transparent text-muted-foreground hover:text-white hover:border-white/20",
    num: "text-cyan-400",
    stat: "text-cyan-400",
    dot: "bg-cyan-400",
    icon: "bg-cyan-500/10 text-cyan-400",
  },
  yellow: {
    tab: "border-yellow-500 text-yellow-400 bg-yellow-500/10",
    tabInactive: "border-transparent text-muted-foreground hover:text-white hover:border-white/20",
    num: "text-yellow-400",
    stat: "text-yellow-400",
    dot: "bg-yellow-400",
    icon: "bg-yellow-500/10 text-yellow-400",
  },
  pink: {
    tab: "border-pink-500 text-pink-400 bg-pink-500/10",
    tabInactive: "border-transparent text-muted-foreground hover:text-white hover:border-white/20",
    num: "text-pink-400",
    stat: "text-pink-400",
    dot: "bg-pink-400",
    icon: "bg-pink-500/10 text-pink-400",
  },
  violet: {
    tab: "border-violet-500 text-violet-400 bg-violet-500/10",
    tabInactive: "border-transparent text-muted-foreground hover:text-white hover:border-white/20",
    num: "text-violet-400",
    stat: "text-violet-400",
    dot: "bg-violet-400",
    icon: "bg-violet-500/10 text-violet-400",
  },
}

function HowItWorksSection() {
  const [active, setActive] = useState(0)
  const stage = STAGE_DATA[active]
  const colors = STAGE_COLORS[stage.color]

  return (
    <section className="px-6 py-16 max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-10"
      >
        <p className="text-xs uppercase tracking-widest text-violet-400 font-semibold mb-4">Cómo funciona</p>
        <h2 className="text-4xl sm:text-5xl font-black text-white">Las 4 etapas del sistema.</h2>
        <p className="text-muted-foreground mt-3 text-sm">Toca cada etapa para ver exactamente qué incluye.</p>
      </motion.div>

      {/* Stage tabs */}
      <div className="flex gap-1 sm:gap-2 mb-8 overflow-x-auto pb-1">
        {STAGE_DATA.map((s, i) => {
          const c = STAGE_COLORS[s.color]
          const isActive = i === active
          return (
            <button
              key={s.id}
              onClick={() => setActive(i)}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-semibold transition-all whitespace-nowrap flex-shrink-0",
                isActive ? c.tab : c.tabInactive
              )}
            >
              <span className={cn("text-xs font-black", isActive ? c.num : "text-muted-foreground")}>{s.num}</span>
              {s.label}
            </button>
          )
        })}
      </div>

      {/* Active stage content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={stage.id}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.25 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        >
          {/* Left — narrative */}
          <div className="space-y-6">
            <div>
              <p className={cn("text-xs font-bold uppercase tracking-widest mb-2", colors.num)}>
                {stage.num} — {stage.label}
              </p>
              <h3 className="text-2xl sm:text-3xl font-black text-white leading-tight mb-4">
                {stage.headline}
              </h3>
              {stage.story.split("\n\n").map((para, i) => (
                <p key={i} className="text-sm text-foreground/75 leading-relaxed mb-3">{para}</p>
              ))}
            </div>

            {/* Stat */}
            <div className={cn("inline-flex items-center gap-3 px-4 py-3 rounded-xl border bg-white/3", `border-${stage.color}-500/20`)}>
              <p className={cn("text-3xl font-black", colors.stat)}>{stage.stat.value}</p>
              <p className="text-sm text-muted-foreground leading-snug max-w-[180px]">{stage.stat.label}</p>
            </div>

            {/* Visual flow (Adquirir only) */}
            {stage.visual.length > 0 && (
              <div className="space-y-2">
                {stage.visual.map((step, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="flex flex-col items-center">
                      <div className={cn("w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black text-white", `bg-${stage.color}-500/30 border border-${stage.color}-500/40`)}>
                        {i + 1}
                      </div>
                      {i < stage.visual.length - 1 && (
                        <div className="w-px h-5 bg-white/10 mt-1" />
                      )}
                    </div>
                    <div className="pb-2">
                      <p className="text-sm font-semibold text-white">{step.step}</p>
                      <p className="text-xs text-muted-foreground">{step.note}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right — features */}
          <div className="glass rounded-2xl p-6 space-y-3">
            <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold mb-4">
              Qué incluye este módulo
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
    </section>
  )
}

// ─── Ecosystem Section ────────────────────────────────────────────────────────

function EcosystemSection() {
  const specialists = [
    { icon: "🥗", title: "Nutriólogos", desc: "Para compromisos de salud y bienestar" },
    { icon: "🧠", title: "Psicólogos", desc: "Para relaciones y salud mental" },
    { icon: "💰", title: "Coaches financieros", desc: "Para independencia y dinero" },
    { icon: "💑", title: "Terapeutas de pareja", desc: "Para compromisos de vida amorosa" },
    { icon: "🚀", title: "Coaches de negocios", desc: "Para compromisos profesionales" },
    { icon: "📚", title: "Cursos online", desc: "Biblioteca de contenido por fase" },
    { icon: "🎥", title: "Webinars en vivo", desc: "Abiertos para atraer, privados para retener" },
    { icon: "🤝", title: "Red de alumni", desc: "Egresados activos, embajadores, mentores" },
  ]

  return (
    <section className="px-6 py-16 max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <p className="text-xs uppercase tracking-widest text-cyan-400 font-semibold mb-4">El diferenciador</p>
        <h2 className="text-4xl sm:text-5xl font-black text-white">Más allá de los entrenamientos.</h2>
        <p className="text-muted-foreground mt-4 max-w-2xl mx-auto text-lg leading-relaxed">
          Cuando el participante recibe valor real todos los días, el enrolamiento deja de sentirse
          como presión y empieza a sentirse como consecuencia.
        </p>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {specialists.map((s, i) => (
          <motion.div
            key={s.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.06 }}
            className="glass rounded-xl p-4 text-center space-y-2 hover:border-violet-500/30 transition-colors"
          >
            <div className="text-3xl">{s.icon}</div>
            <p className="font-semibold text-white text-sm">{s.title}</p>
            <p className="text-xs text-muted-foreground leading-snug">{s.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

// ─── Roles Section ────────────────────────────────────────────────────────────

function RolesSection() {
  const roles = [
    {
      title: "El dueño ve",
      icon: <BarChart3 className="w-6 h-6 text-violet-400" />,
      color: "violet" as const,
      items: [
        "Salud del centro en tiempo real",
        "Participantes en riesgo con alertas automáticas",
        "Conversión fase a fase",
        "Performance por coach",
        "KPIs de negocio: ingresos, retención, NPS",
        "Campañas activas y pagos pendientes",
      ],
    },
    {
      title: "El coach ve",
      icon: <Users className="w-6 h-6 text-cyan-400" />,
      color: "cyan" as const,
      items: [
        "Sus cohortes y el estado de cada una",
        "Sus participantes con Momentum Score",
        "Quién necesita intervención urgente hoy",
        "Historial de notas y actividad por persona",
        "Calendario de eventos de sus grupos",
        "Herramientas para activar participantes en un clic",
      ],
    },
    {
      title: "El participante vive",
      icon: <Heart className="w-6 h-6 text-pink-400" />,
      color: "pink" as const,
      items: [
        "Feed vivo de su comunidad y coach",
        "Sus misiones y compromisos semanales",
        "Su Momentum Score y racha personal",
        "Su tribu — la cohorte como comunidad real",
        "Especialistas conectados a sus objetivos de vida",
        "Progreso visible en su proceso",
      ],
    },
  ]

  return (
    <section className="px-6 py-16 max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <p className="text-xs uppercase tracking-widest text-violet-400 font-semibold mb-4">Para cada rol</p>
        <h2 className="text-4xl sm:text-5xl font-black text-white">Un sistema para todos.</h2>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {roles.map((role, i) => (
          <motion.div
            key={role.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="glass rounded-2xl p-5 space-y-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                {role.icon}
              </div>
              <h3 className="font-bold text-white">{role.title}</h3>
            </div>
            <ul className="space-y-2">
              {role.items.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm">
                  <ChevronRight className={cn(
                    "w-3.5 h-3.5 flex-shrink-0 mt-0.5",
                    role.color === "violet" ? "text-violet-400"
                    : role.color === "cyan" ? "text-cyan-400"
                    : "text-pink-400"
                  )} />
                  <span className="text-foreground/80">{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

// ─── Demo CTA Section ─────────────────────────────────────────────────────────

function DemoSection() {
  return (
    <section className="px-6 py-16 max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="glass-violet rounded-3xl p-10 text-center space-y-6"
      >
        <p className="text-xs uppercase tracking-widest text-violet-400 font-semibold">Demo interactivo</p>
        <h2 className="text-4xl sm:text-5xl font-black text-white">
          Míralo funcionando en{" "}
          <span className="gradient-text">Creania.</span>
        </h2>
        <p className="text-muted-foreground max-w-xl mx-auto text-lg leading-relaxed">
          Un demo completamente interactivo con datos reales de un centro ficticio. Navega como el dueño,
          actúa sobre participantes en riesgo, y luego entra como participante a ver qué vive Valeria.
        </p>
        <Link href="/demo">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center gap-2 px-8 py-4 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-base font-bold transition-colors"
          >
            Entrar al demo
            <ArrowRight className="w-5 h-5" />
          </motion.button>
        </Link>
        <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground flex-wrap">
          <div className="flex items-center gap-1.5">
            <Shield className="w-4 h-4 text-green-400" />
            Sin registro requerido
          </div>
          <div className="flex items-center gap-1.5">
            <Activity className="w-4 h-4 text-cyan-400" />
            Datos ficticios — se siente real
          </div>
          <div className="flex items-center gap-1.5">
            <Target className="w-4 h-4 text-violet-400" />
            2 minutos para entender todo
          </div>
        </div>
      </motion.div>
    </section>
  )
}

// ─── Build Section ────────────────────────────────────────────────────────────

function BuildSection() {
  return (
    <section className="px-6 py-16 max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative overflow-hidden rounded-3xl border border-white/8 bg-gradient-to-br from-white/3 to-violet-600/5 p-10"
      >
        {/* Glow */}
        <div className="absolute -right-20 -top-20 w-72 h-72 rounded-full bg-violet-600/10 blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 md:gap-12">
          {/* Left */}
          <div className="flex-1 text-center md:text-left">
            <p className="text-xs uppercase tracking-widest text-violet-400 font-semibold mb-3">3 minutos</p>
            <h2 className="text-3xl sm:text-4xl font-black text-white leading-tight mb-4">
              Construye tu propio sistema
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6 max-w-md mx-auto md:mx-0">
              Responde 4 preguntas sencillas y ELEVA te muestra exactamente qué necesitas para adquirir, activar, retener y escalar — con tu diseño, tu marca y optimizado en AEO + SEO.
            </p>
            <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-8">
              {["Adquirir", "Activar", "Retener", "Escalar"].map((m) => (
                <span key={m} className="px-3 py-1 rounded-full text-xs font-semibold border border-white/10 text-muted-foreground">
                  {m}
                </span>
              ))}
            </div>
            <Link href="/build">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-sm font-bold transition-colors shadow-lg shadow-violet-600/25"
              >
                Empezar ahora — gratis
                <ChevronRight className="w-4 h-4" />
              </motion.button>
            </Link>
          </div>
          {/* Right — step preview */}
          <div className="flex-shrink-0 w-full max-w-xs space-y-2.5">
            {[
              { n: "01", q: "¿Cuántos participantes tienes?" },
              { n: "02", q: "¿Cuál es tu mayor desafío?" },
              { n: "03", q: "¿Cómo gestionas hoy?" },
              { n: "04", q: "¿Cuál es tu meta a 12 meses?" },
            ].map(({ n, q }) => (
              <div key={n} className="flex items-center gap-3 p-3 rounded-xl bg-white/3 border border-white/6">
                <span className="text-[10px] font-black text-violet-400 w-6 flex-shrink-0">{n}</span>
                <span className="text-xs text-muted-foreground">{q}</span>
                <div className="ml-auto w-4 h-4 rounded-full border border-white/10 flex-shrink-0" />
              </div>
            ))}
            <div className="flex items-center gap-3 p-3 rounded-xl bg-violet-600/15 border border-violet-500/30">
              <span className="text-[10px] font-black text-violet-400 w-6 flex-shrink-0">✦</span>
              <span className="text-xs text-violet-300 font-medium">Tu sistema personalizado</span>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  )
}

// ─── For Who Section ──────────────────────────────────────────────────────────

function ForWhoSection() {
  const profiles = [
    { icon: <Building2 className="w-5 h-5" />, title: "Fundadores y directores", desc: "Con 50 a 2,000 participantes activos que quieren operar con claridad y escala" },
    { icon: <Activity className="w-5 h-5" />, title: "Centros con modelo de fases", desc: "Básico → Avanzado → Vía. El modelo que ELEVA entiende por diseño" },
    { icon: <Users className="w-5 h-5" />, title: "Academias de coaches", desc: "Que certifican a otros entrenadores y necesitan estructura escalable" },
    { icon: <Globe className="w-5 h-5" />, title: "Centros multi-ciudad", desc: "Con presencia en varias ciudades que hoy operan como islas separadas" },
  ]

  return (
    <section className="px-6 py-16 max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <p className="text-xs uppercase tracking-widest text-violet-400 font-semibold mb-4">Para quién es</p>
        <h2 className="text-4xl sm:text-5xl font-black text-white">
          Ya son poderosos en sala.{" "}
          <span className="gradient-text">ELEVA los hace serlo afuera.</span>
        </h2>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {profiles.map((p, i) => (
          <motion.div
            key={p.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className="glass rounded-xl p-5 flex items-start gap-4"
          >
            <div className="w-10 h-10 rounded-xl bg-violet-600/20 flex items-center justify-center text-violet-400 flex-shrink-0">
              {p.icon}
            </div>
            <div>
              <h3 className="font-bold text-white">{p.title}</h3>
              <p className="text-sm text-muted-foreground mt-1">{p.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

// ─── FAQ Section ──────────────────────────────────────────────────────────────

function FAQSection() {
  const faqs = [
    {
      q: "¿ELEVA reemplaza el enrolamiento boca a boca?",
      a: "No. El boca a boca es uno de los motores más poderosos que tiene esta industria y ELEVA no lo elimina — lo amplifica. Agrega canales digitales para que el centro no dependa únicamente de eso, y da herramientas a los participantes para que invitar sea más fácil y más natural.",
    },
    {
      q: "¿Es un CRM genérico?",
      a: "Tiene un módulo de CRM, pero es mucho más. Un CRM genérico no entiende cohortes, fases de transformación, Momentum Score ni el modelo de enrolamiento. ELEVA fue construido desde cero para este modelo específico.",
    },
    {
      q: "¿Funciona para centros pequeños?",
      a: "Sí. Está diseñado para escalar desde centros con 50 participantes hasta operaciones con miles. Un centro pequeño que retiene mejor y opera más limpio crece más rápido — y el ROI es inmediato.",
    },
    {
      q: "¿Cuánto tiempo toma implementarlo?",
      a: "El onboarding básico es de 2 semanas. Primera semana: configuración, migración de participantes existentes, capacitación del staff. Segunda semana: primera cohorte activa en la app.",
    },
    {
      q: "¿Los participantes tienen que descargar una app?",
      a: "La experiencia del participante funciona como Progressive Web App (PWA) — se accede desde el navegador del teléfono y se puede instalar sin pasar por la App Store. También disponible como app nativa según el plan.",
    },
    {
      q: "¿Funciona para centros en varias ciudades?",
      a: "ELEVA es multi-sede desde el diseño. Una sola cuenta con múltiples ubicaciones, cohortes por ciudad, coaches asignados por sede y reportes consolidados o segmentados.",
    },
  ]

  return (
    <section className="px-6 py-16 max-w-3xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <p className="text-xs uppercase tracking-widest text-violet-400 font-semibold mb-4">Preguntas frecuentes</p>
        <h2 className="text-4xl font-black text-white">Lo que siempre preguntan.</h2>
      </motion.div>

      <div className="space-y-3">
        {faqs.map((faq) => (
          <ExpandableSection key={faq.q} title={faq.q} subtitle="">
            <p className="text-sm text-foreground/80 leading-relaxed">{faq.a}</p>
          </ExpandableSection>
        ))}
      </div>
    </section>
  )
}

// ─── Final CTA ────────────────────────────────────────────────────────────────

function FinalCTA() {
  return (
    <section id="contacto" className="px-6 py-20 max-w-3xl mx-auto text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="space-y-6"
      >
        <h2 className="text-4xl sm:text-5xl font-black text-white">
          Tu centro merece un sistema{" "}
          <span className="gradient-text">a su altura.</span>
        </h2>
        <p className="text-muted-foreground text-lg leading-relaxed">
          Agenda una sesión estratégica gratuita. En 30 minutos te mostramos cómo ELEVA
          se adapta a tu modelo, tu metodología y tus objetivos de crecimiento.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/demo">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2 px-8 py-4 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-base font-bold transition-colors"
            >
              Ver el demo primero
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </Link>
          <a
            href="mailto:hola@elevaapp.io"
            className="flex items-center gap-2 px-8 py-4 glass text-foreground rounded-xl text-base font-medium hover:text-white transition-colors"
          >
            Agendar sesión
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
        <p className="text-xs text-muted-foreground">
          Sin compromiso · Respuesta en menos de 24 horas
        </p>
      </motion.div>
    </section>
  )
}

// ─── Footer ───────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer className="border-t border-border px-6 py-8 text-center">
      <div className="flex items-center justify-center gap-2 mb-3">
        <div className="w-6 h-6 rounded bg-violet-600 flex items-center justify-center">
          <span className="text-white font-black text-xs">E</span>
        </div>
        <span className="font-black text-white tracking-tight">ELEVA</span>
      </div>
      <p className="text-xs text-muted-foreground">
        El sistema operativo para centros de transformación · Estudio Oasis · 2025
      </p>
    </footer>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function HomePage() {
  return (
    <>
      <Nav />
      <main className="pt-16">
        <Hero />
        <ProblemSection />
        <ContrastSection />
        <HowItWorksSection />
        <EcosystemSection />
        <RolesSection />
        <DemoSection />
        <BuildSection />
        <ForWhoSection />
        <FAQSection />
        <FinalCTA />
      </main>
      <Footer />
    </>
  )
}
