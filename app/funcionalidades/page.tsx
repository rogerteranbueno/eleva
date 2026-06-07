"use client"

import { useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import {
  ArrowRight, CheckCircle, Star, Clock, Sparkles, ChevronRight,
  Users, Activity, Shield, DollarSign, Video, Target, TrendingUp,
  MessageSquare, Brain, BarChart3, Zap, Globe, Heart,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useLang } from "@/lib/i18n"

// ─── Shared helpers ──────────────────────────────────────────────────────────

function SectionBadge({ label }: { label: string }) {
  return (
    <span className="inline-block text-[10px] font-black uppercase tracking-[0.2em] text-violet-400 bg-violet-500/10 border border-violet-500/20 px-3 py-1.5 rounded-full mb-5">
      {label}
    </span>
  )
}

function PageNav() {
  const links = [
    { href: "#para-quien", label: "Para quién" },
    { href: "#sistema", label: "El sistema" },
    { href: "#membresias", label: "Membresías" },
    { href: "#ecosistema", label: "Ecosistema" },
    { href: "#profesionales", label: "Red de coaches" },
    { href: "#roles", label: "Roles" },
  ]
  return (
    <div className="sticky top-14 z-30 bg-background/90 backdrop-blur-lg border-b border-border">
      <div className="max-w-5xl mx-auto px-6 flex items-center gap-1 overflow-x-auto scrollbar-none py-2.5">
        {links.map((l) => (
          <a key={l.href} href={l.href}
            className="flex-shrink-0 text-xs font-medium text-muted-foreground hover:text-foreground px-3 py-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors whitespace-nowrap">
            {l.label}
          </a>
        ))}
      </div>
    </div>
  )
}

// ─── Top nav ─────────────────────────────────────────────────────────────────

function TopNav() {
  const { lang, setLang } = useLang()
  const t = lang === "en"
    ? { features: "Features", pricing: "Pricing", simulate: "Simulate impact", demo: "See demo" }
    : { features: "Funcionalidades", pricing: "Precios", simulate: "Simular impacto", demo: "Ver demo" }
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/85 backdrop-blur-xl border-b border-border">
      <div className="flex items-center justify-between px-6 py-3.5 max-w-7xl mx-auto">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center">
            <span className="text-white font-black text-sm">E</span>
          </div>
          <span className="font-black text-foreground text-lg tracking-tight">ELEVA</span>
        </Link>
        <div className="flex items-center gap-1">
          <Link href="/funcionalidades" className="text-[13px] font-semibold text-violet-400 px-3 py-1.5 rounded-lg bg-violet-500/8 hidden sm:block">
            {t.features}
          </Link>
          <Link href="/precios" className="text-[13px] text-muted-foreground hover:text-foreground transition-colors hidden sm:block px-3 py-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/5">
            {t.pricing}
          </Link>
          <Link href="/simulador" className="text-[13px] text-muted-foreground hover:text-foreground transition-colors hidden sm:block px-3 py-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/5">
            {t.simulate}
          </Link>
          <button
            onClick={() => setLang(lang === "es" ? "en" : "es")}
            className="hidden sm:flex items-center px-2.5 py-1.5 rounded-lg text-[12px] font-bold text-muted-foreground hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5 transition-colors tracking-wider"
          >
            {lang === "es" ? "EN" : "ES"}
          </button>
          <Link href="/demo">
            <button className="flex items-center gap-1.5 px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg text-[13px] font-semibold transition-colors ml-1">
              {t.demo} <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </Link>
        </div>
      </div>
    </nav>
  )
}

// ─── For who ─────────────────────────────────────────────────────────────────

const FOR_WHO = [
  {
    role: "El dueño o directora",
    icon: BarChart3,
    color: "text-violet-400",
    bg: "bg-violet-500/8 border-violet-500/20",
    pain: "Sigo dependiendo de Excel, WhatsApp y memoria para operar. No sé qué está pasando con cada participante.",
    gain: "Panel en tiempo real con Momentum Score, alertas de riesgo, finanzas y reportes de equipo. Todo en un lugar.",
  },
  {
    role: "El coach o trainer",
    icon: Users,
    color: "text-cyan-400",
    bg: "bg-cyan-500/8 border-cyan-500/20",
    pain: "Tengo demasiados participantes para recordar cómo va cada uno. Llego a la sesión sin contexto.",
    gain: "Expediente vivo por participante: historial de misiones, momentum, notas y alertas de quién necesita atención hoy.",
  },
  {
    role: "El participante",
    icon: Target,
    color: "text-green-400",
    bg: "bg-green-500/8 border-green-500/20",
    pain: "Siento que hago cosas pero no veo progreso claro. No sé si estoy avanzando o girando en círculos.",
    gain: "App con misiones diarias, Momentum Score, tribu de su generación, logros y acceso a especialistas.",
  },
  {
    role: "El equipo de operaciones",
    icon: Shield,
    color: "text-amber-400",
    bg: "bg-amber-500/8 border-amber-500/20",
    pain: "El registro de asistencia, cobros y seguimiento de leads es manual y propenso a errores.",
    gain: "Mesa de registro digital, CRM integrado, cobros automáticos y alertas de morosidad, sin papel.",
  },
]

function ForWhoSection() {
  return (
    <section id="para-quien" className="py-20 max-w-5xl mx-auto px-6">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-12 text-center">
        <SectionBadge label="Para quién es ELEVA" />
        <h2 className="text-4xl sm:text-5xl font-black text-foreground leading-tight">
          Cuatro roles. Un solo sistema.
        </h2>
        <p className="text-muted-foreground mt-4 max-w-xl mx-auto text-base leading-relaxed">
          Cada persona en tu centro tiene un problema específico. ELEVA les da exactamente lo que necesitan, sin que interfiera con los demás.
        </p>
      </motion.div>

      <div className="grid sm:grid-cols-2 gap-4">
        {FOR_WHO.map((w, i) => (
          <motion.div key={w.role} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ delay: i * 0.07 }}
            className={`rounded-2xl border p-6 ${w.bg}`}>
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-9 h-9 rounded-xl border flex items-center justify-center ${w.bg}`}>
                <w.icon className={`w-4.5 h-4.5 ${w.color}`} />
              </div>
              <p className={`font-bold text-sm ${w.color}`}>{w.role}</p>
            </div>
            <div className="space-y-3">
              <div className="flex items-start gap-2.5">
                <span className="text-red-400 text-lg leading-none flex-shrink-0 mt-0.5">✕</span>
                <p className="text-xs text-muted-foreground leading-relaxed italic">"{w.pain}"</p>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle className={`w-4 h-4 flex-shrink-0 mt-0.5 ${w.color}`} />
                <p className="text-sm text-foreground leading-relaxed">{w.gain}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

// ─── System overview ─────────────────────────────────────────────────────────

const SYSTEM_FEATURES = [
  { icon: Activity,      label: "Pulso del Centro",     desc: "Dashboard en tiempo real con Momentum Score, alertas y métricas clave." },
  { icon: Users,         label: "CRM integrado",        desc: "Perfil vivo de cada participante: historial, pagos, misiones, notas." },
  { icon: Target,        label: "Misiones y objetivos", desc: "Plan de acción diario por participante. Gamificado, medible, automatizado." },
  { icon: TrendingUp,    label: "Momentum Score",       desc: "Índice que predice abandono con 78% de precisión antes de que pase." },
  { icon: MessageSquare, label: "Automatizaciones",     desc: "WhatsApp, email y SMS automáticos en los momentos que importan." },
  { icon: Brain,         label: "Motor de IA",           desc: "Detección de riesgo, planes personalizados y campañas automáticas." },
  { icon: DollarSign,    label: "Finanzas",             desc: "MRR, cobros, morosidad y proyecciones en un panel unificado." },
  { icon: Video,         label: "Webinars y eventos",   desc: "Plataforma para eventos abiertos (adquirir) y exclusivos (retener)." },
  { icon: BarChart3,     label: "Campañas",             desc: "Segmentación automática para upsell, renovaciones y reactivación." },
  { icon: Globe,         label: "App del participante", desc: "PWA o app nativa con feed, misiones, tribu, logros y especialistas." },
  { icon: Shield,        label: "Multi-sede",           desc: "Una cuenta con múltiples ubicaciones y reportes consolidados." },
  { icon: Zap,           label: "Integraciones",        desc: "Stripe, Zapier, Google Calendar, Zoom y más en el roadmap." },
]

function SystemSection() {
  return (
    <section id="sistema" className="py-20 section-b">
      <div className="max-w-5xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-12 text-center">
          <SectionBadge label="Todo lo que incluye" />
          <h2 className="text-4xl sm:text-5xl font-black text-foreground leading-tight">
            Un sistema completo,<br />no 12 herramientas sueltas.
          </h2>
          <p className="text-muted-foreground mt-4 max-w-xl mx-auto text-base">
            ELEVA reemplaza el stack de WhatsApp + Excel + Zoom + algún CRM genérico + Google Sheets + correo manual, con una sola plataforma diseñada para este modelo.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {SYSTEM_FEATURES.map((f, i) => (
            <motion.div key={f.label} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ delay: i * 0.04 }}
              className="glass rounded-xl p-4 hover:border-violet-500/30 transition-colors group">
              <f.icon className="w-5 h-5 text-violet-400 mb-2.5 group-hover:text-violet-300 transition-colors" />
              <p className="text-sm font-semibold text-foreground mb-1">{f.label}</p>
              <p className="text-xs text-muted-foreground leading-snug">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Memberships ─────────────────────────────────────────────────────────────

const MEMBERSHIP_TIERS = [
  {
    name: "Esencial",
    note: "Incluido con el enrolamiento",
    highlight: false,
    badge: null,
    features: [
      { text: "Acceso a entrenamientos presenciales", on: true },
      { text: "App de misiones y momentum", on: true },
      { text: "Comunidad de tu generación", on: true },
      { text: "Biblioteca de recursos base", on: true },
      { text: "Webinars gratuitos mensuales", on: true },
      { text: "Sesiones con coaches avanzados", on: false },
      { text: "Webinars exclusivos de especialistas", on: false },
      { text: "Mentoría 1:1 mensual", on: false },
    ],
  },
  {
    name: "Expansión",
    note: "Membresía mensual recurrente",
    highlight: true,
    badge: "Más popular",
    features: [
      { text: "Todo lo de Esencial", on: true },
      { text: "2 sesiones/mes con coach avanzado", on: true },
      { text: "Webinars exclusivos de especialistas", on: true },
      { text: "Plan de nutrición personalizado", on: true },
      { text: "Asesoría financiera mensual (30 min)", on: true },
      { text: "Acceso a biblioteca premium", on: true },
      { text: "Mentoría 1:1 mensual", on: false },
      { text: "Acceso anticipado a nuevas generaciones", on: false },
    ],
  },
  {
    name: "Maestría",
    note: "Membresía premium recurrente",
    highlight: false,
    badge: "Elite",
    features: [
      { text: "Todo lo de Expansión", on: true },
      { text: "Mentoría 1:1 mensual con especialista", on: true },
      { text: "Sesiones ilimitadas con coaches", on: true },
      { text: "Plan integral nutrición + finanzas", on: true },
      { text: "Acceso anticipado a nuevas generaciones", on: true },
      { text: "Badge de Maestría en perfil público", on: true },
      { text: "Evento presencial exclusivo (anual)", on: true },
      { text: "Acceso vitalicio a biblioteca", on: true },
    ],
  },
]

function MembershipsSection() {
  return (
    <section id="membresias" className="py-20 max-w-5xl mx-auto px-6">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
        <SectionBadge label="Membresías" />
        <h2 className="text-4xl sm:text-5xl font-black text-foreground">
          El entrenamiento es la puerta.<br className="hidden sm:block" /> La membresía es el viaje.
        </h2>
        <p className="text-muted-foreground mt-4 max-w-2xl mx-auto text-base leading-relaxed">
          ELEVA te ayuda a implementar membresías en tu centro. Tú defines los tiers, los beneficios y los precios. El sistema gestiona acceso, cobros y renovaciones automáticamente.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-5">
        {MEMBERSHIP_TIERS.map((tier, i) => (
          <motion.div key={tier.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className={cn("glass rounded-2xl p-6 border flex flex-col relative",
              tier.highlight ? "border-violet-500/50 bg-violet-600/5" : "border-border")}>
            {tier.badge && (
              <div className={cn("absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-bold",
                tier.highlight ? "bg-violet-600 text-white" : "bg-amber-500 text-black")}>
                {tier.badge}
              </div>
            )}
            <div className="mb-5">
              <p className="font-bold text-foreground text-lg">{tier.name}</p>
              <p className="text-xs text-muted-foreground mt-1">{tier.note}</p>
            </div>
            <ul className="space-y-2.5 flex-1">
              {tier.features.map((f) => (
                <li key={f.text} className="flex items-start gap-2 text-sm">
                  <CheckCircle className={cn("w-4 h-4 mt-0.5 flex-shrink-0", f.on ? "text-violet-400" : "text-foreground/15")} />
                  <span className={f.on ? "text-foreground" : "text-muted-foreground/40 line-through"}>{f.text}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
      <p className="text-center text-sm text-muted-foreground mt-6">
        Estos son ejemplos de tiers. Tu centro define los nombres, beneficios y precios.
      </p>
    </section>
  )
}

// ─── Ecosystem ───────────────────────────────────────────────────────────────

const SPECIALISTS = [
  { icon: "🥗", title: "Nutriólogos",           desc: "Para compromisos de salud y bienestar" },
  { icon: "🧠", title: "Psicólogos",            desc: "Para relaciones y salud mental" },
  { icon: "💰", title: "Coaches financieros",   desc: "Para independencia y dinero" },
  { icon: "💑", title: "Terapeutas de pareja",  desc: "Para compromisos de vida amorosa" },
  { icon: "🚀", title: "Coaches de negocios",   desc: "Para compromisos profesionales" },
  { icon: "📚", title: "Cursos online",          desc: "Biblioteca de contenido por fase" },
  { icon: "🎥", title: "Webinars en vivo",       desc: "Abiertos para atraer, privados para retener" },
  { icon: "🤝", title: "Red de alumni",          desc: "Egresados activos, embajadores, mentores" },
]

function EcosystemSection() {
  return (
    <section id="ecosistema" className="py-20 section-b">
      <div className="max-w-5xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-12">
          <SectionBadge label="Ecosistema de valor" />
          <h2 className="text-4xl sm:text-5xl font-black text-foreground leading-tight mb-4">
            Tu comunidad ya<br />tiene los mejores.
          </h2>
          <p className="text-foreground/80 max-w-2xl text-base leading-relaxed">
            En tu comunidad ya hay nutriólogos, coaches financieros, psicólogos y especialistas de primer nivel. ELEVA los incorpora a un sistema verificado: tú validas la calidad de su servicio, ellos ganan visibilidad y tus participantes acceden a una red de valor real.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {SPECIALISTS.map((s, i) => (
            <motion.div key={s.title} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="glass rounded-xl p-4 text-center space-y-2 hover:border-violet-500/30 transition-colors">
              <div className="text-3xl">{s.icon}</div>
              <p className="font-semibold text-foreground text-sm">{s.title}</p>
              <p className="text-xs text-muted-foreground leading-snug">{s.desc}</p>
            </motion.div>
          ))}
        </div>

        <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="flex flex-col sm:flex-row items-center justify-between gap-4 glass rounded-2xl px-6 py-5 border border-green-500/20">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <p className="text-4xl font-black text-green-400 flex-shrink-0">+60%</p>
            <p className="text-sm text-foreground/80">más retención cuando el participante tiene acceso a especialistas conectados a sus objetivos de vida.</p>
          </div>
          <Link href="/demo/especialistas" className="flex-shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-xl border border-green-500/40 hover:bg-green-500/10 text-green-400 text-sm font-bold transition-colors">
            Ver en el demo <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

// ─── Coach marketplace ────────────────────────────────────────────────────────

const COACHES = [
  { name: "Laura Medina",       specialty: "Finanzas personales",       badge: "Especialista", rating: 4.9, sessions: 312, price: 950,  avatar: "LM", color: "from-violet-600 to-violet-800", tags: ["Presupuesto", "Inversiones", "Deuda"] },
  { name: "Carlos Reyes",       specialty: "Nutrición & rendimiento",   badge: "Certificado",  rating: 4.8, sessions: 204, price: 750,  avatar: "CR", color: "from-emerald-600 to-emerald-800", tags: ["Plan alimenticio", "Hábitos", "Energía"] },
  { name: "Sofía Herrera",      specialty: "Psicología positiva",       badge: "Especialista", rating: 5.0, sessions: 189, price: 1100, avatar: "SH", color: "from-pink-600 to-pink-800", tags: ["Ansiedad", "Relaciones", "Autoestima"] },
  { name: "Miguel Ángel Torres",specialty: "Negocios & emprendimiento", badge: "Mentor",       rating: 4.7, sessions: 276, price: 1300, avatar: "MT", color: "from-amber-600 to-amber-800", tags: ["Ventas", "Escalabilidad", "Liderazgo"] },
]

function CoachesSection() {
  return (
    <section id="profesionales" className="py-20 max-w-5xl mx-auto px-6">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
        <SectionBadge label="Red de profesionales" />
        <h2 className="text-4xl sm:text-5xl font-black text-foreground">
          Ya tienes los profesionales.<br className="hidden sm:block" /> Solo faltaba la plataforma.
        </h2>
        <p className="text-foreground/70 mt-4 max-w-2xl mx-auto text-base leading-relaxed">
          ELEVA les da una plataforma verificada donde nutriólogos, coaches, psicólogos y especialistas de tu comunidad aportan valor a través de webinars, masterclasses y asesorías, y tú ganas recurrencia, credibilidad y un ecosistema que se retroalimenta solo.
        </p>
      </motion.div>

      <div className="grid sm:grid-cols-2 gap-4 mb-6">
        {COACHES.map((coach, i) => (
          <motion.div key={coach.name} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ delay: i * 0.07 }}
            className="glass rounded-2xl p-5 hover:border-violet-500/30 transition-all">
            <div className="flex items-start gap-4">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${coach.color} flex items-center justify-center flex-shrink-0`}>
                <span className="text-white font-black text-sm">{coach.avatar}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-bold text-foreground">{coach.name}</p>
                  <span className="text-[10px] bg-violet-600/20 text-violet-300 border border-violet-600/30 rounded-full px-2 py-0.5 font-semibold">{coach.badge}</span>
                </div>
                <p className="text-sm text-muted-foreground mt-0.5">{coach.specialty}</p>
                <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Star className="w-3 h-3 text-amber-400 fill-amber-400" />{coach.rating}</span>
                  <span>{coach.sessions} sesiones</span>
                  <span className="ml-auto text-foreground font-bold">${coach.price.toLocaleString()} MXN/hr</span>
                </div>
                <div className="flex gap-1.5 mt-2.5 flex-wrap">
                  {coach.tags.map((t) => (
                    <span key={t} className="text-[10px] bg-white/5 text-muted-foreground rounded-full px-2 py-0.5">{t}</span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        className="glass rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-violet-600/20 border border-violet-600/30 flex items-center justify-center flex-shrink-0">
          <Sparkles className="w-5 h-5 text-violet-400" />
        </div>
        <div className="flex-1 text-center sm:text-left">
          <p className="font-bold text-foreground text-lg">¿Eres coach o especialista?</p>
          <p className="text-sm text-muted-foreground mt-0.5">Únete a la red de ELEVA y consigue clientes de centros verificados sin invertir en marketing. Tú cobras directo.</p>
        </div>
        <Link href="/build" className="flex-shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold transition-colors">
          Aplicar <ArrowRight className="w-4 h-4" />
        </Link>
      </motion.div>
    </section>
  )
}

// ─── Roles ───────────────────────────────────────────────────────────────────

const ROLES = [
  {
    id: "owner",
    label: "Dueño / Director",
    color: "text-violet-400",
    bg: "bg-violet-500/8 border-violet-500/20",
    screens: ["Dashboard Pulso del Centro", "Reportes financieros y MRR", "Visibilidad de equipo completo", "Campañas y automatizaciones", "Motor de IA y predicciones", "Gestión multi-sede"],
  },
  {
    id: "coach",
    label: "Coach / Trainer",
    color: "text-cyan-400",
    bg: "bg-cyan-500/8 border-cyan-500/20",
    screens: ["Panel de su generación", "Expediente IA por participante", "Alertas de riesgo de abandono", "Notas y seguimiento 1:1", "Registro de sesiones", "Asignación de misiones"],
  },
  {
    id: "ops",
    label: "Operaciones / Registro",
    color: "text-amber-400",
    bg: "bg-amber-500/8 border-amber-500/20",
    screens: ["Mesa de registro digital", "CRM de leads y participantes", "Gestión de cobros y morosidad", "Check-in con QR o manual", "Reportes de asistencia", "Alta de nuevos participantes"],
  },
  {
    id: "participant",
    label: "Participante",
    color: "text-green-400",
    bg: "bg-green-500/8 border-green-500/20",
    screens: ["Feed personalizado", "Misiones diarias y objetivos", "Momentum Score propio", "Tribu y comunidad de generación", "Logros y badges", "Acceso a especialistas"],
  },
]

function RolesSection() {
  const [active, setActive] = useState("owner")
  const current = ROLES.find(r => r.id === active)!

  return (
    <section id="roles" className="py-20 section-b">
      <div className="max-w-5xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
          <SectionBadge label="Roles y accesos" />
          <h2 className="text-4xl sm:text-5xl font-black text-foreground">
            Cada quien ve lo que necesita.<br className="hidden sm:block" /> Nada más.
          </h2>
          <p className="text-muted-foreground mt-4 max-w-xl mx-auto text-base">
            Cuatro perfiles con accesos diferenciados. Sin información irrelevante, sin confusión.
          </p>
        </motion.div>

        <div className="flex flex-wrap gap-2 justify-center mb-8">
          {ROLES.map((r) => (
            <button key={r.id} onClick={() => setActive(r.id)}
              className={cn("px-4 py-2 rounded-xl text-sm font-semibold border transition-all",
                active === r.id ? `${r.bg} ${r.color}` : "border-border text-muted-foreground hover:text-foreground")}>
              {r.label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={active} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className={`glass rounded-2xl border p-6 ${current.bg}`}>
            <p className={`text-xs font-black uppercase tracking-widest ${current.color} mb-4`}>{current.label}</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {current.screens.map((s) => (
                <div key={s} className="flex items-center gap-2 bg-white/4 rounded-lg px-3 py-2">
                  <CheckCircle className={`w-3.5 h-3.5 flex-shrink-0 ${current.color}`} />
                  <span className="text-xs text-foreground">{s}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  )
}

// ─── Final CTA ───────────────────────────────────────────────────────────────

function PageCTA() {
  return (
    <section className="py-20 max-w-3xl mx-auto px-6 text-center">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="space-y-6">
        <h2 className="text-4xl sm:text-5xl font-black text-foreground">
          ¿Listo para ver todo esto<br />
          <span className="gradient-text">en tu centro?</span>
        </h2>
        <p className="text-muted-foreground text-base leading-relaxed">
          El demo interactivo muestra cada funcionalidad con datos del centro demo Creania. Sin registro, sin compromiso.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/demo">
            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2 px-8 py-4 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-base font-bold transition-colors">
              Ver el demo en vivo <ArrowRight className="w-5 h-5" />
            </motion.button>
          </Link>
          <Link href="/precios">
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2 px-6 py-3.5 glass text-foreground rounded-xl text-sm font-medium hover:opacity-80 transition-all">
              Ver precios <ChevronRight className="w-4 h-4" />
            </motion.button>
          </Link>
        </div>
      </motion.div>
    </section>
  )
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function FuncionalidadesPage() {
  return (
    <>
      <TopNav />
      <PageNav />
      <main className="pt-28">

        {/* Hero */}
        <div className="max-w-5xl mx-auto px-6 pb-16 text-center">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <SectionBadge label="Plataforma completa" />
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-black text-foreground leading-[1.05] mb-5">
              Todo lo que ELEVA<br />
              <span className="gradient-text">hace por tu centro.</span>
            </h1>
            <p className="text-muted-foreground text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed mb-8">
              Una plataforma diseñada desde cero para centros de transformación, no un CRM genérico adaptado,
              no 12 herramientas sin conectar. Un sistema que entiende tu modelo.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link href="/demo">
                <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-2 px-7 py-3.5 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-sm font-bold transition-colors">
                  Ver demo interactivo <ArrowRight className="w-4 h-4" />
                </motion.button>
              </Link>
              <Link href="/precios">
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-2 px-5 py-3.5 glass text-muted-foreground hover:text-foreground rounded-xl text-sm font-medium transition-all">
                  Ver planes y precios <ChevronRight className="w-4 h-4" />
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>

        <ForWhoSection />
        <SystemSection />
        <MembershipsSection />
        <EcosystemSection />
        <CoachesSection />
        <RolesSection />
        <PageCTA />
      </main>

      {/* Footer strip */}
      <footer className="border-t border-border px-6 py-8">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-violet-600 flex items-center justify-center">
              <span className="text-white font-black text-xs">E</span>
            </div>
            <span className="font-black text-foreground text-sm">ELEVA</span>
          </div>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <Link href="/" className="hover:text-foreground transition-colors">Inicio</Link>
            <Link href="/precios" className="hover:text-foreground transition-colors">Precios</Link>
            <Link href="/simulador" className="hover:text-foreground transition-colors">Simulador</Link>
            <Link href="/demo" className="hover:text-foreground transition-colors">Demo</Link>
          </div>
        </div>
      </footer>
    </>
  )
}
