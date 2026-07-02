"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowLeft, ArrowRight, CheckCircle2, ShieldCheck } from "lucide-react"
import { useInView } from "@/lib/use-in-view"
import { AcredittaBadge, AcredittaTrustBar } from "@/components/AcredittaBadge"
import { ElevaCertBadge } from "@/components/ElevaCertBadge"

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number]

const competencies = [
  { cat: "Fundamentos", items: ["Filosofía y ontología del lenguaje", "Psicología básica aplicada a la transformación", "Teorías del aprendizaje y cambio de conducta", "Historia crítica de la industria"] },
  { cat: "Facilitación", items: ["Escucha activa e intervención responsable", "Manejo de dinámicas grupales", "Presencia, calibración y energía de sala", "Diseño de experiencias de aprendizaje"] },
  { cat: "Seguridad", items: ["Protocolos de seguridad psicológica", "Detección de crisis y derivación", "Manejo de quiebres emocionales", "Límites profesionales y confidencialidad"] },
  { cat: "Ética", items: ["Ética profesional en transformación", "Consentimiento informado y autonomía", "Anti-manipulación y coerción", "Responsabilidad ante el participante"] },
  { cat: "Operación", items: ["Diseño curricular replicable", "Uso del sistema ELEVA OS", "Medición de impacto y seguimiento", "Coordinación con staff y directores"] },
  { cat: "Carrera", items: ["Construcción de práctica profesional", "Supervisión y desarrollo continuo", "Comunicación y speaking profesional", "Estándares de evaluación por desempeño"] },
]

const certifications = [
  {
    code: "ECS",
    name: "ELEVA Certified Staff",
    color: "emerald",
    description: "Para equipos de soporte, logística, oficina y admisiones. Estándar mínimo de operación y cultura de centro.",
    requirements: ["Protocolo de atención y comunicación", "Proceso de admisiones y seguimiento", "Herramientas ELEVA OS para staff", "Ética de confidencialidad y cuidado"],
  },
  {
    code: "ECC",
    name: "ELEVA Certified Coach",
    color: "blue",
    description: "Para acompañamiento individual, seguimiento de participantes y conversaciones de desarrollo.",
    requirements: ["Escucha y presencia coacheo", "Diseño de conversaciones de compromiso", "Seguimiento con criterio y datos", "Límites del rol coach vs. terapeuta"],
  },
  {
    code: "ECT",
    name: "ELEVA Certified Trainer",
    color: "violet",
    description: "Para facilitadores capaces de sostener grupos, intervenir con criterio y cuidar el contexto en sala.",
    requirements: ["Facilitación de grupos de transformación", "Intervención en crisis y quiebres", "Diseño de experiencias curriculares", "Evaluación y supervisión práctica"],
  },
  {
    code: "ECC+",
    name: "ELEVA Certified Center",
    color: "amber",
    description: "Para centros que cumplen estándares mínimos verificables de operación, formación, seguridad y seguimiento.",
    requirements: ["Staff con certificación mínima ECS", "Protocolos operativos documentados", "Sistema de seguimiento activo (ELEVA OS)", "Estándares de seguridad psicológica implementados"],
  },
]

const colorMap: Record<string, { badge: string; border: string; bg: string }> = {
  emerald: { badge: "text-emerald-400 border-emerald-500/20 bg-emerald-500/8", border: "border-emerald-500/20", bg: "bg-emerald-500/4" },
  blue: { badge: "text-blue-400 border-blue-500/20 bg-blue-500/8", border: "border-blue-500/20", bg: "bg-blue-500/4" },
  violet: { badge: "text-violet-400 border-violet-500/20 bg-violet-500/8", border: "border-violet-500/20", bg: "bg-violet-500/4" },
  amber: { badge: "text-amber-400 border-amber-500/20 bg-amber-500/8", border: "border-amber-500/20", bg: "bg-amber-500/4" },
}

const comparison = [
  ["Formación por asistencia", "Evaluación por desempeño observable"],
  ["Método cerrado y dogmático", "Marcos abiertos, actualizables y explicables"],
  ["Dependencia del carisma", "Competencias entrenables y evaluables"],
  ["Sin supervisión formal", "Práctica supervisada y feedback estructurado"],
  ["Certificados por tiempo", "Certificación por criterios objetivos"],
  ["Sin métricas de impacto", "Medición de retención, avance y NPS"],
  ["Presión sin contención", "Seguridad psicológica y protocolos de crisis"],
  ["Staff sin formación", "Equipo certificado con estándares definidos"],
]

export default function EstandarElevaPage() {
  const heroRef = useInView(0.1)
  const compRef = useInView(0.08)
  const certRef = useInView(0.08)
  const tableRef = useInView(0.08)
  const ctaRef = useInView(0.1)

  return (
    <div className="min-h-screen bg-background text-foreground">

      {/* Nav */}
      <nav className="fixed top-0 inset-x-0 z-50 border-b border-foreground/5 bg-background/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground transition-colors">
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <span className="text-foreground/20">/</span>
            <Link href="/" className="hover:text-foreground transition-colors">ELEVA</Link>
            <span className="text-foreground/20">/</span>
            <span className="text-violet-400 font-semibold">Estándar</span>
          </div>
          <Link href="/build">
            <button className="px-4 py-2 bg-violet-600 hover:bg-violet-500 text-foreground text-sm font-bold rounded-lg transition-colors">
              Agendar diagnóstico
            </button>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-40 pb-24 px-6" ref={heroRef.ref}>
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={heroRef.inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease }}
            className="space-y-7"
          >
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-violet-400" />
              <span className="text-xs font-bold text-violet-400 uppercase tracking-widest">El estándar ELEVA</span>
            </div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-foreground leading-[1.05] tracking-tighter">
              El nuevo estándar
              <br />
              para formar entrenadores
              <br />
              <span className="text-foreground/55 font-light italic">y profesionalizar centros.</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl leading-relaxed">
              No certificamos por calentar una silla. Certificamos por desempeño observable. Esto es lo que eso significa en la práctica.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/pacto">
                <button className="flex items-center gap-2.5 px-7 py-4 bg-violet-600 hover:bg-violet-500 text-foreground font-black rounded-xl text-base transition-colors group">
                  Aplicar a PACTO
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </Link>
              <Link href="/academia">
                <button className="flex items-center gap-2.5 px-7 py-4 glass border border-foreground/10 hover:border-foreground/20 text-foreground font-bold rounded-xl text-base transition-colors">
                  Ver certificaciones
                </button>
              </Link>
            </div>
            <AcredittaBadge size="md" />
          </motion.div>
        </div>
      </section>

      {/* Competencias */}
      <section className="py-24 px-6 border-t border-foreground/5" ref={compRef.ref}>
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={compRef.inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease }}
            className="mb-12"
          >
            <p className="text-xs font-bold text-violet-400 uppercase tracking-widest mb-4">Qué exige el estándar</p>
            <h2 className="text-3xl sm:text-4xl font-black text-foreground tracking-tight mb-4">
              6 áreas. 24 competencias mínimas.
            </h2>
            <p className="text-muted-foreground max-w-xl leading-relaxed">
              Un entrenador que no puede explicar por qué hace lo que hace, no debería estar frente a un grupo en proceso de transformación.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {competencies.map((cat, i) => (
              <motion.div
                key={cat.cat}
                initial={{ opacity: 0, y: 20 }}
                animate={compRef.inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, ease, delay: i * 0.08 }}
                className="glass rounded-2xl border border-foreground/5 p-5 space-y-3"
              >
                <p className="text-xs font-bold text-violet-400 uppercase tracking-widest">{cat.cat}</p>
                {cat.items.map((item) => (
                  <div key={item} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-violet-400/60 mt-0.5 shrink-0" />
                    <p className="text-sm text-foreground/60 leading-snug">{item}</p>
                  </div>
                ))}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Certificaciones */}
      <section className="py-24 px-6 border-t border-foreground/5" ref={certRef.ref}>
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={certRef.inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease }}
            className="mb-12"
          >
            <p className="text-xs font-bold text-violet-400 uppercase tracking-widest mb-4">Niveles de certificación</p>
            <h2 className="text-3xl sm:text-4xl font-black text-foreground tracking-tight mb-4">
              Cómo certificamos.
            </h2>
            <p className="text-muted-foreground max-w-xl leading-relaxed">
              No certificamos por tiempo. Certificamos cuando las competencias son observables y verificables.
            </p>
            <AcredittaTrustBar className="mt-4" />
          </motion.div>

          <div className="grid sm:grid-cols-2 gap-5">
            {certifications.map((cert, i) => {
              const c = colorMap[cert.color]
              return (
                <motion.div
                  key={cert.code}
                  initial={{ opacity: 0, y: 20 }}
                  animate={certRef.inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.55, ease, delay: i * 0.1 }}
                  className={`rounded-2xl border ${c.border} ${c.bg} p-6 space-y-4`}
                >
                  <div className="flex items-center gap-3 justify-between flex-wrap">
                    <ElevaCertBadge level={cert.code as "ECS" | "ECC" | "ECT" | "ECC+"} size="sm" />
                    <AcredittaBadge size="sm" />
                  </div>
                  <div>
                    <p className="font-black text-foreground text-lg leading-tight">{cert.name}</p>
                    <p className="text-sm text-muted-foreground mt-1 leading-snug">{cert.description}</p>
                  </div>
                  <div className="space-y-2 pt-2 border-t border-foreground/5">
                    {cert.requirements.map((r) => (
                      <div key={r} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-foreground/50 mt-0.5 shrink-0" />
                        <p className="text-xs text-foreground/70 leading-snug">{r}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Tabla comparativa */}
      <section className="py-24 px-6 border-t border-foreground/5" ref={tableRef.ref}>
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={tableRef.inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease }}
            className="mb-10"
          >
            <p className="text-xs font-bold text-foreground/50 uppercase tracking-widest mb-4">Comparación directa</p>
            <h2 className="text-3xl sm:text-4xl font-black text-foreground tracking-tight">
              Otros programas vs. ELEVA.
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={tableRef.inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease, delay: 0.15 }}
            className="rounded-2xl border border-foreground/8 overflow-hidden"
          >
            <div className="grid grid-cols-2 border-b border-foreground/8">
              <div className="px-5 py-3 bg-red-500/5 border-r border-foreground/8">
                <p className="text-xs font-bold text-red-400 uppercase tracking-wide">Modelo heredado</p>
              </div>
              <div className="px-5 py-3 bg-violet-500/5">
                <p className="text-xs font-bold text-violet-400 uppercase tracking-wide">Estándar ELEVA</p>
              </div>
            </div>
            {comparison.map(([left, right], i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={tableRef.inView ? { opacity: 1 } : {}}
                transition={{ duration: 0.4, ease, delay: 0.2 + i * 0.05 }}
                className={`grid grid-cols-2 border-b border-foreground/5 last:border-0 ${i % 2 === 0 ? "" : "bg-white/[0.01]"}`}
              >
                <div className="px-5 py-3.5 border-r border-foreground/5 flex items-start gap-2">
                  <span className="text-red-500 text-sm shrink-0 mt-0.5">✗</span>
                  <p className="text-sm text-foreground/60 leading-snug">{left}</p>
                </div>
                <div className="px-5 py-3.5 flex items-start gap-2">
                  <span className="text-violet-400 text-sm shrink-0 mt-0.5">✓</span>
                  <p className="text-sm text-foreground/80 leading-snug">{right}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 px-6 border-t border-foreground/5" ref={ctaRef.ref}>
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={ctaRef.inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease }}
          className="max-w-3xl mx-auto text-center space-y-8"
        >
          <h2 className="text-5xl sm:text-6xl font-black text-foreground leading-[1.05] tracking-tight">
            Forma entrenadores que
            <br />
            <span className="text-violet-400">sepan lo que hacen</span>
            <br />
            <span className="text-foreground/55 font-light italic">y por qué lo hacen.</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
            PACTO instala la academia interna, los protocolos y el sistema operativo para que tu centro pueda formar entrenadores propios con criterio y estándar profesional.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/pacto">
              <button className="flex items-center gap-2.5 px-8 py-4 bg-violet-600 hover:bg-violet-500 text-foreground font-black rounded-xl text-base transition-colors group">
                Aplicar a PACTO
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </Link>
            <Link href="/historia-transformacion">
              <button className="flex items-center gap-2.5 px-8 py-4 glass border border-foreground/10 hover:border-foreground/20 text-foreground font-bold rounded-xl text-base transition-colors">
                Ver la historia de la industria
              </button>
            </Link>
          </div>
        </motion.div>
      </section>

    </div>
  )
}
