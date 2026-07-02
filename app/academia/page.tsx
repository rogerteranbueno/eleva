"use client"

import { useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight, ArrowLeft, BookOpen, Users, Star, ChevronDown, CheckCircle2, Zap, Target, Trophy, Brain, Layers } from "lucide-react"
import { useInView } from "@/lib/use-in-view"

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number]

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.65, ease, delay },
})

// ─── Programs ───────────────────────────────────────────────────────────────

const programs = [
  {
    id: "cft",
    badge: "Certificación",
    accent: "violet",
    title: "Coach de Transformación Funcional",
    subtitle: "CTF™",
    duration: "6 meses",
    format: "Online + 1 presencial",
    level: "Formación inicial",
    description:
      "La certificación base de ELEVA Academy. Entrena la capacidad de diseñar y facilitar experiencias de transformación que tienen impacto medible — no solo motivación del momento.",
    outcomes: [
      "Diseño de arcos de transformación de 12+ semanas",
      "Facilitación de dinámicas de alta carga emocional",
      "Lectura de dinámicas grupales e individuales",
      "Uso del dashboard ELEVA para seguimiento de cohortes",
      "Protocolo de entrevista diagnóstica VIA",
    ],
    for: "Entrenadores con 1+ año de práctica que quieren pasar de motivadores a transformadores",
  },
  {
    id: "dct",
    badge: "Certificación avanzada",
    accent: "blue",
    title: "Diseñador de Currículum Transformacional",
    subtitle: "DCT™",
    duration: "4 meses",
    format: "Online intensivo",
    level: "Especialización",
    description:
      "Para coaches que quieren construir, escalar o estandarizar el currículo de su centro. Aprenden a diseñar programas que funcionan cuando ellos no están presentes.",
    outcomes: [
      "Arquitectura curricular de programas de 12–48 semanas",
      "Mapeo de competencias y resultados medibles",
      "Diseño de materiales replicables por otros coaches",
      "Protocolos de evaluación y certificación interna",
      "Transferencia metodológica entre coaches",
    ],
    for: "Directores de contenido, coaches senior o dueños que lideran equipos de facilitación",
  },
  {
    id: "lct",
    badge: "Liderazgo",
    accent: "emerald",
    title: "Liderazgo de Centros de Transformación",
    subtitle: "LCT™",
    duration: "3 meses",
    format: "Cohort online",
    level: "Dirección",
    description:
      "Formación para dueños y directores. No sobre cómo dar entrenamientos — sobre cómo construir la organización que los hace posibles a escala.",
    outcomes: [
      "Modelo operativo de centros de transformación",
      "Gestión de equipos de coaches y staff",
      "Indicadores de salud institucional (NPS, retención, expansión)",
      "Proceso de selección y onboarding de entrenadores",
      "Cultura institucional y marca de centro",
    ],
    for: "Dueños, directores y socios de centros con 2+ años de operación",
  },
  {
    id: "ifs",
    badge: "Intensivo",
    accent: "amber",
    title: "Intensive Facilitation Skills",
    subtitle: "IFS™",
    duration: "5 días",
    format: "Presencial (3 ciudades/año)",
    level: "Habilidades prácticas",
    description:
      "El programa más rápido y concreto. Cinco días en vivo trabajando habilidades de facilitación que la mayoría de los coaches nunca desarrolla formalmente.",
    outcomes: [
      "Manejo de la sala en momentos de alta tensión",
      "Diseño de dinámicas de cierre y anclaje",
      "Cómo sostener el silencio y el espacio emocional",
      "Lectura corporal y calibración de energía grupal",
      "Protocolo de recuperación ante quiebres de grupo",
    ],
    for: "Coaches activos de cualquier nivel que quieren elevar su ejecución en sala",
  },
]

// ─── Differentiators ────────────────────────────────────────────────────────

const differentiators = [
  {
    icon: Target,
    title: "Orientada a resultados medibles",
    body: "Cada módulo conecta con una competencia que se puede observar, medir y mejorar. Sin teoría sin aterrizaje.",
  },
  {
    icon: Brain,
    title: "Formación de coaches, no de contenido",
    body: "El problema no es que los coaches no saben el material. Es que no saben cómo llevarlo a otro ser humano en transformación.",
  },
  {
    icon: Layers,
    title: "Integrada con ELEVA OS",
    body: "Los coaches certificados en ELEVA Academy saben usar el sistema desde el primer día. No hay curva de adopción.",
  },
  {
    icon: Users,
    title: "Cohortes de práctica real",
    body: "No se aprende a facilitar leyendo. Se aprende facilitando. Cada módulo incluye práctica supervisada con feedback estructurado.",
  },
  {
    icon: Trophy,
    title: "Credencial institucional",
    body: "Las certificaciones ELEVA Academy son reconocidas por los centros partner. Son un estándar de industria en proceso de consolidación.",
  },
  {
    icon: Zap,
    title: "Actualización continua",
    body: "El currículo se actualiza cada 6 meses con casos reales de los centros en la red ELEVA. Los certificados reciben las actualizaciones sin costo.",
  },
]

// ─── FAQ ────────────────────────────────────────────────────────────────────

const faqs = [
  {
    q: "¿Necesito tener un centro para inscribirme?",
    a: "No. Los programas CTF™ e IFS™ están abiertos a coaches independientes. Los programas DCT™ y LCT™ están pensados para personas dentro de una organización — centro, empresa o escuela — aunque no es requisito excluyente.",
  },
  {
    q: "¿Cómo se diferencia de otras certificaciones de coaching?",
    a: "Las certificaciones de coaching tradicionales forman en herramientas y conversación individual. ELEVA Academy forma en facilitación grupal, diseño curricular y operación institucional. Son complementarias, no competidoras.",
  },
  {
    q: "¿Los programas son en línea o presenciales?",
    a: "Depende del programa. CTF™ y DCT™ son principalmente online con un encuentro presencial por cohorte. LCT™ es cohort online. IFS™ es completamente presencial, 5 días intensivos, tres veces al año en LATAM.",
  },
  {
    q: "¿Qué pasa si mi centro ya está en PACTO?",
    a: "PACTO incluye componentes de ELEVA Academy para tu equipo de coaches — específicamente módulos del CTF™ adaptados al contexto institucional. Si tu equipo completa PACTO y quiere la certificación completa, hay un proceso de reconocimiento de aprendizaje previo.",
  },
  {
    q: "¿Hay becas o financiamiento?",
    a: "Sí. Para centros que ingresan a PACTO existe un beneficio en certificaciones para su equipo. Para coaches independientes hay planes de pago en mensualidades sin intereses. Consulta opciones al agendar tu diagnóstico.",
  },
]

// ─── Component ───────────────────────────────────────────────────────────────

export default function AcademiaPage() {
  const [activeProgram, setActiveProgram] = useState(0)
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const heroRef = useInView(0.1)
  const problemRef = useInView(0.12)
  const programsRef = useInView(0.08)
  const diffRef = useInView(0.1)
  const faqRef = useInView(0.1)
  const ctaRef = useInView(0.1)

  const prog = programs[activeProgram]
  const accentMap: Record<string, string> = {
    violet: "text-violet-400 bg-violet-500/10 border-violet-500/20",
    blue: "text-blue-400 bg-blue-500/10 border-blue-500/20",
    emerald: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    amber: "text-amber-400 bg-amber-500/10 border-amber-500/20",
  }
  const borderMap: Record<string, string> = {
    violet: "border-violet-500/30 hover:border-violet-500/60",
    blue: "border-blue-500/30 hover:border-blue-500/60",
    emerald: "border-emerald-500/30 hover:border-emerald-500/60",
    amber: "border-amber-500/30 hover:border-amber-500/60",
  }
  const activeBorderMap: Record<string, string> = {
    violet: "border-violet-500/70 bg-violet-500/5",
    blue: "border-blue-500/70 bg-blue-500/5",
    emerald: "border-emerald-500/70 bg-emerald-500/5",
    amber: "border-amber-500/70 bg-amber-500/5",
  }

  return (
    <div className="min-h-screen bg-background text-foreground">

      {/* ── Nav ── */}
      <nav className="fixed top-0 inset-x-0 z-50 border-b border-white/5 bg-background/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-white transition-colors">
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <span className="text-white/20">/</span>
            <Link href="/" className="hover:text-white transition-colors">ELEVA</Link>
            <span className="text-white/20">/</span>
            <span className="text-violet-400 font-semibold">Academia</span>
          </div>
          <Link href="/build">
            <button className="px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white text-sm font-bold rounded-lg transition-colors">
              Agendar diagnóstico
            </button>
          </Link>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="pt-40 pb-28 px-6" ref={heroRef.ref}>
        <div className="max-w-5xl mx-auto">
          <motion.div {...fade(0)} className="space-y-8">

            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-violet-500/10 border border-violet-500/20 text-violet-400 uppercase tracking-widest">
                <BookOpen className="w-3 h-3" />
                ELEVA Academy
              </span>
              <span className="text-xs text-muted-foreground">División de formación</span>
            </div>

            <div className="space-y-5">
              <h1 className="text-6xl sm:text-7xl lg:text-8xl font-black text-white leading-[1.0] tracking-tighter">
                Coaches que
                <br />
                <span className="gradient-text">transforman</span>
                <br />
                <span className="text-white/30 font-light italic">de verdad.</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl leading-relaxed">
                La mayoría de los coaches sabe el material. Pocos saben cómo llevarlo a otro ser humano en transformación.
                ELEVA Academy forma a los segundos.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="#programas">
                <button className="flex items-center gap-2.5 px-7 py-4 bg-violet-600 hover:bg-violet-500 text-white font-black rounded-xl transition-colors text-base group">
                  Ver certificaciones
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </Link>
              <Link href="/build">
                <button className="flex items-center gap-2.5 px-7 py-4 glass border border-white/10 hover:border-white/20 text-white font-bold rounded-xl transition-colors text-base">
                  Hablar con admisiones
                </button>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-6 border-t border-white/5 max-w-lg">
              {[
                { val: "4", label: "certificaciones activas" },
                { val: "40+", label: "coaches certificados" },
                { val: "6", label: "países en LATAM" },
              ].map((s) => (
                <div key={s.label}>
                  <p className="text-3xl font-black text-white">{s.val}</p>
                  <p className="text-xs text-muted-foreground leading-tight mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── El problema ── */}
      <section className="py-24 px-6 border-t border-white/5" ref={problemRef.ref}>
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={problemRef.inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.65, ease }}
            className="grid lg:grid-cols-2 gap-16 items-center"
          >
            <div className="space-y-6">
              <p className="text-xs font-bold text-violet-400 uppercase tracking-widest">El problema real</p>
              <h2 className="text-4xl sm:text-5xl font-black text-white leading-[1.1] tracking-tight">
                Saber de transformación no es lo mismo que saber transformar.
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  El 90% de los coaches de centros de transformación llegó a ese rol porque pasó por el proceso y lo vivió de cerca. Eso es valioso — y no es suficiente.
                </p>
                <p>
                  Facilitar transformación grupal requiere habilidades específicas: leer la sala, sostener el espacio emocional, diseñar arcos de aprendizaje, manejar quiebres, calibrar energía. Nadie nace sabiéndolas. Y casi nadie las enseña con rigor.
                </p>
                <p>
                  El resultado es que la calidad de la transformación depende de la intuición del coach individual — no de un sistema replicable. Eso hace al centro frágil.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {[
                {
                  icon: "✗",
                  title: "Certificaciones que forman en contenido, no en facilitación",
                  color: "text-red-400",
                },
                {
                  icon: "✗",
                  title: "Formación teórica sin práctica supervisada real",
                  color: "text-red-400",
                },
                {
                  icon: "✗",
                  title: "Coaches que enseñan igual que como les enseñaron a ellos",
                  color: "text-red-400",
                },
                {
                  icon: "✗",
                  title: "Ningún estándar de calidad institucional entre coaches",
                  color: "text-red-400",
                },
                {
                  icon: "✗",
                  title: "Sin métricas para saber si un coach mejora con el tiempo",
                  color: "text-red-400",
                },
                {
                  icon: "✗",
                  title: "Metodología que se pierde cuando el coach estrella se va",
                  color: "text-red-400",
                },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -16 }}
                  animate={problemRef.inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, ease, delay: i * 0.07 }}
                  className="flex items-start gap-3 p-4 glass rounded-xl border border-white/5"
                >
                  <span className={`text-lg font-black ${item.color} mt-0.5 shrink-0`}>{item.icon}</span>
                  <p className="text-sm text-muted-foreground leading-snug">{item.title}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={problemRef.inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, ease, delay: 0.5 }}
            className="mt-14 text-center text-xl font-bold text-white/70"
          >
            ELEVA Academy existe para resolver exactamente eso.
          </motion.p>
        </div>
      </section>

      {/* ── Programas ── */}
      <section id="programas" className="py-24 px-6 border-t border-white/5" ref={programsRef.ref}>
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={programsRef.inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease }}
            className="mb-12"
          >
            <p className="text-xs font-bold text-violet-400 uppercase tracking-widest mb-4">Certificaciones</p>
            <h2 className="text-4xl sm:text-5xl font-black text-white leading-[1.1] tracking-tight max-w-2xl">
              Cuatro caminos. Un estándar.
            </h2>
          </motion.div>

          {/* Tab selector */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-10">
            {programs.map((p, i) => (
              <button
                key={p.id}
                onClick={() => setActiveProgram(i)}
                className={`p-4 rounded-xl border text-left transition-all duration-200 ${
                  activeProgram === i
                    ? activeBorderMap[p.accent]
                    : `glass ${borderMap[p.accent]}`
                }`}
              >
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${accentMap[p.accent]} block w-fit mb-2`}>
                  {p.badge}
                </span>
                <p className="text-white font-bold text-sm leading-snug">{p.subtitle}</p>
                <p className="text-xs text-muted-foreground mt-1">{p.duration}</p>
              </button>
            ))}
          </div>

          {/* Active program detail */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeProgram}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35, ease }}
              className="grid lg:grid-cols-3 gap-8"
            >
              {/* Main */}
              <div className="lg:col-span-2 space-y-6">
                <div>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${accentMap[prog.accent]}`}>
                    {prog.badge}
                  </span>
                  <h3 className="text-3xl font-black text-white mt-3 leading-tight">
                    {prog.title}
                    <span className="text-muted-foreground font-light ml-2 text-2xl">{prog.subtitle}</span>
                  </h3>
                  <p className="text-muted-foreground mt-3 leading-relaxed">{prog.description}</p>
                </div>

                <div className="glass rounded-2xl border border-white/5 p-6 space-y-3">
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Lo que desarrollas</p>
                  {prog.outcomes.map((o) => (
                    <div key={o} className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-violet-400 mt-0.5 shrink-0" />
                      <p className="text-sm text-white/80 leading-snug">{o}</p>
                    </div>
                  ))}
                </div>

                <div className="p-4 rounded-xl border border-violet-500/20 bg-violet-500/5">
                  <p className="text-xs font-bold text-violet-400 uppercase tracking-widest mb-1">Para quién</p>
                  <p className="text-sm text-white/70 leading-snug">{prog.for}</p>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-4">
                <div className="glass rounded-2xl border border-white/5 p-6 space-y-5">
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Detalles</p>
                  {[
                    { label: "Duración", value: prog.duration },
                    { label: "Formato", value: prog.format },
                    { label: "Nivel", value: prog.level },
                  ].map((d) => (
                    <div key={d.label} className="flex justify-between items-start border-t border-white/5 pt-4 first:border-0 first:pt-0">
                      <p className="text-xs text-muted-foreground">{d.label}</p>
                      <p className="text-sm text-white font-semibold text-right max-w-[140px]">{d.value}</p>
                    </div>
                  ))}
                </div>

                <Link href="/build" className="block">
                  <button className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-violet-600 hover:bg-violet-500 text-white font-black rounded-xl transition-colors group">
                    Solicitar admisión
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </Link>
                <Link href="/pacto" className="block">
                  <button className="w-full flex items-center justify-center gap-2 px-6 py-3 glass border border-white/10 hover:border-white/20 text-white/70 font-semibold rounded-xl transition-colors text-sm">
                    Ver programa PACTO
                  </button>
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* ── Diferenciadores ── */}
      <section className="py-24 px-6 border-t border-white/5" ref={diffRef.ref}>
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={diffRef.inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease }}
            className="mb-12"
          >
            <p className="text-xs font-bold text-violet-400 uppercase tracking-widest mb-4">Por qué ELEVA Academy</p>
            <h2 className="text-4xl sm:text-5xl font-black text-white leading-[1.1] tracking-tight max-w-2xl">
              Lo que la hace diferente.
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {differentiators.map((d, i) => (
              <motion.div
                key={d.title}
                initial={{ opacity: 0, y: 20 }}
                animate={diffRef.inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.55, ease, delay: i * 0.08 }}
                className="glass rounded-2xl border border-white/5 p-6 space-y-3"
              >
                <div className="w-9 h-9 rounded-xl bg-violet-500/10 flex items-center justify-center">
                  <d.icon className="w-4.5 h-4.5 text-violet-400" />
                </div>
                <p className="font-bold text-white">{d.title}</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{d.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-24 px-6 border-t border-white/5" ref={faqRef.ref}>
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={faqRef.inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease }}
            className="mb-10"
          >
            <p className="text-xs font-bold text-violet-400 uppercase tracking-widest mb-4">Preguntas frecuentes</p>
            <h2 className="text-3xl sm:text-4xl font-black text-white leading-[1.15] tracking-tight">
              Lo que siempre nos preguntan.
            </h2>
          </motion.div>

          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                animate={faqRef.inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, ease, delay: i * 0.07 }}
                className="glass rounded-2xl border border-white/5 overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between gap-4 p-6 text-left"
                >
                  <p className="font-semibold text-white text-sm sm:text-base">{faq.q}</p>
                  <ChevronDown
                    className={`w-4 h-4 text-muted-foreground shrink-0 transition-transform duration-200 ${
                      openFaq === i ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: "auto" }}
                      exit={{ height: 0 }}
                      transition={{ duration: 0.28, ease }}
                      className="overflow-hidden"
                    >
                      <p className="px-6 pb-6 text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Final ── */}
      <section className="py-32 px-6 border-t border-white/5" ref={ctaRef.ref}>
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={ctaRef.inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease }}
          className="max-w-3xl mx-auto text-center space-y-8"
        >
          <div className="space-y-5">
            <p className="text-xs font-bold text-violet-400 uppercase tracking-widest">El siguiente nivel</p>
            <h2 className="text-5xl sm:text-6xl font-black text-white leading-[1.05] tracking-tight">
              Tu equipo de coaches<br />
              es tu mayor<br />
              <span className="text-muted-foreground font-light italic">ventaja competitiva.</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
              Los centros que escalan sin perder calidad lo hacen porque sus coaches son mejores que los del promedio — y siguen mejorando.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/build">
              <button className="flex items-center gap-2.5 px-8 py-4 bg-violet-600 hover:bg-violet-500 text-white font-black rounded-xl transition-colors text-base group">
                <Star className="w-4 h-4" />
                Hablar con admisiones
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </Link>
            <Link href="/pacto">
              <button className="flex items-center gap-2.5 px-8 py-4 glass border border-white/10 hover:border-white/20 text-white font-bold rounded-xl transition-colors text-base">
                Ver programa PACTO
              </button>
            </Link>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2 pt-2">
            {["Admisión por selección", "Cohortes limitadas", "Certificación institucional", "Integrada con ELEVA OS"].map((t) => (
              <p key={t} className="text-xs text-muted-foreground flex items-center gap-1.5">
                <span className="w-1 h-1 rounded-full bg-violet-400 inline-block" />
                {t}
              </p>
            ))}
          </div>
        </motion.div>
      </section>

    </div>
  )
}
