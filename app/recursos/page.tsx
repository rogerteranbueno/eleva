"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowLeft, ArrowRight, BookOpen, Layers, BarChart3, Shield, Zap, Users } from "lucide-react"
import { useInView } from "@/lib/use-in-view"

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number]

const principles = [
  {
    n: "01",
    title: "La transformación sin estructura no escala.",
    body: "Una sala poderosa puede cambiar vidas. Un sistema que replica esa sala puede cambiar industrias. El carisma del fundador es el punto de partida, no el modelo de negocio.",
  },
  {
    n: "02",
    title: "Los coaches necesitan formación, no sólo experiencia.",
    body: "Haber vivido el proceso no te convierte en el mejor en facilitarlo. Facilitar transformación es una habilidad técnica que se aprende, practica y mide, igual que cualquier otra.",
  },
  {
    n: "03",
    title: "Los datos no reemplazan la intuición. La hacen más precisa.",
    body: "El mejor coach del mundo mejora cuando sabe cómo llegó el participante antes de entrar a la sala. Los datos no matan el arte, le dan contexto.",
  },
  {
    n: "04",
    title: "La propiedad intelectual del centro le pertenece al centro.",
    body: "ELEVA no extrae ni replica tu metodología. Instala la infraestructura para que tú puedas replicarla internamente, con estándares y sin depender de personas clave.",
  },
  {
    n: "05",
    title: "El crecimiento sin continuidad es enrolamiento disfrazado de transformación.",
    body: "Un centro que sólo vive de llenar básicos no está en el negocio de la transformación. Está en el negocio del evento. ELEVA diseña sistemas para el después.",
  },
  {
    n: "06",
    title: "La ética no es un módulo. Es el piso mínimo.",
    body: "Trabajamos con personas en estados de apertura y vulnerabilidad. La seguridad, los límites, la confidencialidad y el consentimiento no son opcionales, son el requisito de entrada.",
  },
  {
    n: "07",
    title: "Seleccionamos centros, no acumulamos clientes.",
    body: "ELEVA trabaja con centros que quieren profesionalizar su operación y medir su impacto. No es para todos. Y eso nos hace mejores para quienes sí deciden entrar.",
  },
]

const frameworks = [
  {
    code: "CMM™",
    name: "Center Maturity Model",
    color: "violet",
    icon: BarChart3,
    description:
      "Diagnóstica el nivel de madurez operativa e institucional de un centro de transformación en cinco dimensiones: formación, operación, datos, comunidad y expansión.",
    levels: ["Artesanal", "Organizado", "Sistematizado", "Escalable", "Institucional"],
  },
  {
    code: "TRS™",
    name: "Trainer Readiness Standard",
    color: "blue",
    icon: Users,
    description:
      "Define las competencias mínimas para que un coach pueda operar dentro del estándar ELEVA: facilitación, conocimiento, ética, comunicación y adaptabilidad.",
    levels: ["Observador", "Asistente", "Facilitador", "Senior", "Formador"],
  },
  {
    code: "PCS™",
    name: "Participant Continuity System",
    color: "emerald",
    icon: Zap,
    description:
      "Diseña la ruta posterior al PL para cada participante: seguimiento, comunidad, recompra, referidos y conversión a programas de mayor compromiso.",
    levels: ["Graduado", "Activo", "Conectado", "Champion", "Co-creador"],
  },
  {
    code: "TOS™",
    name: "Transformation OS",
    color: "blue",
    icon: Layers,
    description:
      "Integra en un solo sistema la operación del centro: admisiones, seguimiento de participantes, cohortes, comunidad, datos y crecimiento. El sistema operativo del centro.",
    levels: ["Adopción", "Integración", "Automatización", "Inteligencia", "Predicción"],
  },
  {
    code: "RCP™",
    name: "Risk & Contingency Protocol",
    color: "amber",
    icon: Shield,
    description:
      "Estandariza la respuesta ante situaciones de riesgo: crisis de participantes, conflictos en sala, abandonos, incidentes de seguridad y situaciones de alta carga emocional.",
    levels: ["Identificación", "Protocolo", "Activación", "Resolución", "Aprendizaje"],
  },
]

const colorMap: Record<string, { badge: string; dot: string; border: string; bg: string }> = {
  violet: {
    badge: "text-violet-400 bg-violet-500/10 border-violet-500/20",
    dot: "bg-violet-400",
    border: "border-violet-500/20",
    bg: "bg-violet-500/5",
  },
  blue: {
    badge: "text-blue-400 bg-blue-500/10 border-blue-500/20",
    dot: "bg-blue-400",
    border: "border-blue-500/20",
    bg: "bg-blue-500/5",
  },
  emerald: {
    badge: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    dot: "bg-emerald-400",
    border: "border-emerald-500/20",
    bg: "bg-emerald-500/5",
  },
  amber: {
    badge: "text-amber-400 bg-amber-500/10 border-amber-500/20",
    dot: "bg-amber-400",
    border: "border-amber-500/20",
    bg: "bg-amber-500/5",
  },
}

export default function RecursosPage() {
  const [activeFramework, setActiveFramework] = useState(0)

  const heroRef = useInView(0.1)
  const manifestoRef = useInView(0.08)
  const principlesRef = useInView(0.08)
  const frameworksRef = useInView(0.08)
  const ctaRef = useInView(0.1)

  const fw = frameworks[activeFramework]
  const colors = colorMap[fw.color]

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
            <span className="text-white font-semibold">Manifiesto</span>
          </div>
          <Link href="/build">
            <button className="px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white text-sm font-bold rounded-lg transition-colors">
              Agendar diagnóstico
            </button>
          </Link>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="pt-40 pb-24 px-6" ref={heroRef.ref}>
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={heroRef.inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease }}
            className="space-y-8"
          >
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/5 border border-white/10 text-white/60 uppercase tracking-widest">
                <BookOpen className="w-3 h-3" />
                Manifiesto institucional
              </span>
            </div>

            <div className="space-y-5">
              <h1 className="text-6xl sm:text-7xl lg:text-8xl font-black text-white leading-[1.0] tracking-tighter">
                Por qué<br />
                <span className="gradient-text">existimos.</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl leading-relaxed">
                Los centros de transformación tienen algo que pocas industrias tienen: la capacidad de cambiar a las personas desde adentro. El problema es que la mayoría opera sin la infraestructura para hacerlo a escala.
              </p>
              <p className="text-xl text-muted-foreground max-w-2xl leading-relaxed">
                ELEVA existe para cambiar eso.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Manifiesto ── */}
      <section className="py-24 px-6 border-t border-white/5" ref={manifestoRef.ref}>
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={manifestoRef.inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.65, ease }}
            className="space-y-10"
          >
            <p className="text-xs font-bold text-white/40 uppercase tracking-widest">El manifiesto</p>

            <div className="space-y-8 text-2xl sm:text-3xl font-black text-white leading-[1.25] tracking-tight">
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={manifestoRef.inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.05, duration: 0.6, ease }}
              >
                La siguiente generación de centros de transformación no se construirá sólo en la sala.
              </motion.p>
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={manifestoRef.inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.12, duration: 0.6, ease }}
                className="text-white/50 font-light text-xl sm:text-2xl leading-relaxed"
              >
                Se construirá con entrenadores formados, no sólo inspirados.
                Con procesos que funcionan cuando el fundador no está.
                Con datos que permiten tomar decisiones antes de que los problemas escalen.
                Con estándares de ética, seguridad y calidad que protejan a quienes se abren a transformar.
                Con comunidades que sostienen el cambio entre una sala y la siguiente.
              </motion.p>
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={manifestoRef.inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.2, duration: 0.6, ease }}
              >
                Los centros que entiendan esto primero serán los que definan la industria.
              </motion.p>
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={manifestoRef.inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.28, duration: 0.6, ease }}
                className="text-violet-400"
              >
                ELEVA existe para construir esa siguiente generación.
              </motion.p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Principios ── */}
      <section className="py-24 px-6 border-t border-white/5" ref={principlesRef.ref}>
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={principlesRef.inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease }}
            className="mb-14"
          >
            <p className="text-xs font-bold text-white/40 uppercase tracking-widest mb-4">Principios</p>
            <h2 className="text-4xl sm:text-5xl font-black text-white leading-[1.1] tracking-tight">
              En lo que creemos.
            </h2>
          </motion.div>

          <div className="space-y-0 divide-y divide-white/5">
            {principles.map((p, i) => (
              <motion.div
                key={p.n}
                initial={{ opacity: 0, x: -16 }}
                animate={principlesRef.inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.55, ease, delay: i * 0.06 }}
                className="py-8 grid sm:grid-cols-[80px_1fr] gap-6 group"
              >
                <span className="text-5xl font-black text-white/10 group-hover:text-violet-500/30 transition-colors tabular-nums">
                  {p.n}
                </span>
                <div className="space-y-2">
                  <p className="font-black text-white text-lg leading-snug">{p.title}</p>
                  <p className="text-muted-foreground leading-relaxed">{p.body}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Frameworks ── */}
      <section className="py-24 px-6 border-t border-white/5" ref={frameworksRef.ref}>
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={frameworksRef.inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease }}
            className="mb-12"
          >
            <p className="text-xs font-bold text-white/40 uppercase tracking-widest mb-4">Marcos propietarios</p>
            <h2 className="text-4xl sm:text-5xl font-black text-white leading-[1.1] tracking-tight max-w-2xl">
              Los marcos de trabajo que usamos.
            </h2>
            <p className="mt-4 text-muted-foreground max-w-xl">
              Cada marco es un modelo diagnóstico y operativo. No son etiquetas de marketing, son herramientas activas que usamos en cada implementación.
            </p>
          </motion.div>

          {/* Framework tabs */}
          <div className="flex flex-wrap gap-2 mb-10">
            {frameworks.map((f, i) => {
              const c = colorMap[f.color]
              return (
                <button
                  key={f.code}
                  onClick={() => setActiveFramework(i)}
                  className={`px-4 py-2 rounded-xl border text-sm font-bold transition-all duration-200 ${
                    activeFramework === i
                      ? `${c.badge} border-current`
                      : "glass border-white/10 text-muted-foreground hover:text-white hover:border-white/20"
                  }`}
                >
                  {f.code}
                </button>
              )
            })}
          </div>

          {/* Active framework */}
          <motion.div
            key={activeFramework}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease }}
            className={`rounded-2xl border ${colors.border} ${colors.bg} p-8 grid lg:grid-cols-2 gap-10`}
          >
            <div className="space-y-5">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl ${colors.bg} border ${colors.border} flex items-center justify-center`}>
                  <fw.icon className={`w-5 h-5 ${colorMap[fw.color].badge.split(" ")[0]}`} />
                </div>
                <div>
                  <span className={`text-xs font-bold ${colorMap[fw.color].badge.split(" ")[0]} uppercase tracking-widest`}>
                    {fw.code}
                  </span>
                  <p className="text-white font-black text-lg leading-tight">{fw.name}</p>
                </div>
              </div>
              <p className="text-muted-foreground leading-relaxed">{fw.description}</p>
            </div>

            <div className="space-y-3">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4">5 niveles</p>
              {fw.levels.map((level, i) => (
                <div key={level} className="flex items-center gap-3">
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs text-muted-foreground tabular-nums w-4">{i + 1}</span>
                    <div className={`w-2 h-2 rounded-full ${colors.dot}`} style={{ opacity: 0.3 + i * 0.17 }} />
                  </div>
                  <p className={`text-sm font-semibold ${i === 4 ? "text-white" : "text-white/60"}`}>{level}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-32 px-6 border-t border-white/5" ref={ctaRef.ref}>
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={ctaRef.inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease }}
          className="max-w-3xl mx-auto text-center space-y-8"
        >
          <div className="space-y-5">
            <h2 className="text-5xl sm:text-6xl font-black text-white leading-[1.05] tracking-tight">
              Si esto resuena,<br />
              <span className="text-muted-foreground font-light italic">hablemos.</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
              El diagnóstico ELEVA 360 es el primer paso para saber si podemos ayudarte a construir la siguiente versión de tu centro.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/build">
              <button className="flex items-center gap-2.5 px-8 py-4 bg-violet-600 hover:bg-violet-500 text-white font-black rounded-xl transition-colors text-base group">
                Agendar diagnóstico ELEVA 360
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
            {["Selección de centros", "Sin pitch de ventas", "Respuesta en 48h"].map((t) => (
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
