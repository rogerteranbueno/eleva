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

function HowItWorksSection() {
  const stages = [
    {
      badge: "01",
      title: "Adquirir",
      subtitle: "Llenar tu centro de forma predecible, no solo por impulso emocional",
      content: (
        <div className="space-y-3">
          <p className="text-sm text-foreground/80 leading-relaxed">
            Hoy casi toda la adquisición depende de que alguien invite a alguien. Eso funciona, pero tiene techo.
            ELEVA amplifica ese motor con canales digitales sin reemplazar lo que ya funciona.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {[
              "Webinars de introducción abiertos al público",
              "Pláticas presenciales abiertas para inscritos y no inscritos",
              "Funnels de inscripción con landing pages propias del centro",
              "CRM de prospectos con seguimiento y etapas",
              "Referidos con tracking — se sabe de dónde vino cada participante",
              "Campañas de email y WhatsApp automatizadas para nutrir prospectos",
            ].map((item) => (
              <div key={item} className="flex items-start gap-2 text-sm">
                <ChevronRight className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0 mt-0.5" />
                <span className="text-foreground/80">{item}</span>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      badge: "02",
      title: "Activar",
      subtitle: "Que el participante llegue listo y quiera quedarse desde el primer día",
      content: (
        <div className="space-y-3">
          <p className="text-sm text-foreground/80 leading-relaxed">
            La activación empieza antes del primer entrenamiento y continúa durante los primeros 30 días.
            Ningún participante llega en frío ni se pierde después de la emoción inicial.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {[
              "Portal de bienvenida automático al inscribirse",
              "Preparación pre-entrenamiento: lecturas, videos, formularios",
              "Registro de asistencia digital (QR o código)",
              "Expediente completo desde el primer día",
              "Asignación automática de coach y cohorte",
              "App activa desde el primer evento — no semanas después",
            ].map((item) => (
              <div key={item} className="flex items-start gap-2 text-sm">
                <ChevronRight className="w-3.5 h-3.5 text-yellow-400 flex-shrink-0 mt-0.5" />
                <span className="text-foreground/80">{item}</span>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      badge: "03",
      title: "Retener",
      subtitle: "Mantener viva la transformación entre entrenamientos",
      content: (
        <div className="space-y-3">
          <p className="text-sm text-foreground/80 leading-relaxed">
            Aquí está el diferenciador más grande de ELEVA. La retención no es enviar recordatorios
            — es construir una razón para volver mañana.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {[
              "Feed vivo: mensaje del coach, misión del día, retos, comunidad",
              "Momentum Score: score dinámico basado en comportamiento real",
              "Racha / streak: días consecutivos de compromiso",
              "Cohorte como tribu: feed, chat, retos, leaderboard, calendario",
              "Especialistas integrados: nutriólogos, psicólogos, coaches financieros",
              "Intervención del coach cuando alguien cae — con un solo clic",
            ].map((item) => (
              <div key={item} className="flex items-start gap-2 text-sm">
                <ChevronRight className="w-3.5 h-3.5 text-pink-400 flex-shrink-0 mt-0.5" />
                <span className="text-foreground/80">{item}</span>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      badge: "04",
      title: "Escalar",
      subtitle: "Crecer de forma estructurada, no solo por intensidad emocional",
      content: (
        <div className="space-y-3">
          <p className="text-sm text-foreground/80 leading-relaxed">
            El escalamiento no es solo traer más gente. Es convertir el centro en una operación
            que crece con o sin un buen fin de semana.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {[
              "Conversión fase a fase con visibilidad real — cuántos pasan de fase",
              "Campañas de enrolamiento automatizadas al siguiente nivel",
              "Alumni activos: egresados que refieren y mentorean",
              "Embajadores con herramientas: contenido, links y tracking propio",
              "Multi-sede: un solo sistema para varias ciudades",
              "KPIs de negocio reales: ingresos, retención, NPS, momentum promedio",
            ].map((item) => (
              <div key={item} className="flex items-start gap-2 text-sm">
                <ChevronRight className="w-3.5 h-3.5 text-violet-400 flex-shrink-0 mt-0.5" />
                <span className="text-foreground/80">{item}</span>
              </div>
            ))}
          </div>
        </div>
      ),
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
        <p className="text-xs uppercase tracking-widest text-violet-400 font-semibold mb-4">Cómo funciona</p>
        <h2 className="text-4xl sm:text-5xl font-black text-white">Las 4 etapas del sistema.</h2>
        <p className="text-muted-foreground mt-4">Toca cada etapa para ver qué incluye.</p>
      </motion.div>

      <div className="space-y-3">
        {stages.map((stage) => (
          <ExpandableSection key={stage.badge} badge={stage.badge} title={stage.title} subtitle={stage.subtitle}>
            {stage.content}
          </ExpandableSection>
        ))}
      </div>
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
        <ForWhoSection />
        <FAQSection />
        <FinalCTA />
      </main>
      <Footer />
    </>
  )
}
