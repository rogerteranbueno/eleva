"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowLeft, ArrowRight, ExternalLink } from "lucide-react"
import { useInView } from "@/lib/use-in-view"
import { HistoricalDisclaimer } from "@/components/HistoricalDisclaimer"

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number]

const timeline = [
  {
    year: "1960s",
    title: "El movimiento de potencial humano",
    body: "En California nace el Human Potential Movement: Esalen Institute, Abraham Maslow, Carl Rogers y otros abren la conversación sobre el desarrollo del ser humano más allá de la psicología clínica. La idea central: las personas tienen más capacidad de la que creen, y pueden acceder a ella con las condiciones correctas.",
    type: "context",
  },
  {
    year: "1971",
    title: "Werner Erhard funda est",
    body: 'Werner Erhard, nacido John Paul Rosenberg, lanza Erhard Seminars Training (est) en San Francisco. El formato: entrenamientos intensivos de fin de semana, grupos de 250+ personas, reglas estrictas, lenguaje propio y un enfoque en "responsabilidad total". Est entrena a cientos de miles de personas y se convierte en uno de los programas más influyentes del movimiento. En 1985, est es reemplazado por The Forum, que más tarde derivó en lo que hoy se conoce como Landmark Worldwide.',
    ref: "Fuente: Wikipedia, Werner Erhard",
    refUrl: "https://en.wikipedia.org/wiki/Werner_Erhard",
    type: "figure",
    accent: "blue",
  },
  {
    year: "1974",
    title: "John Hanley funda Lifespring",
    body: "John Hanley lanza Lifespring en California, con un formato similar a est: entrenamientos Basic, Advanced y Leadership Program. La organización llega a operar en múltiples países y afirma haber entrenado a cientos de miles de personas. También enfrenta controversias públicas documentadas: investigaciones periodísticas, demandas civiles y reportes de participantes sobre presión psicológica, dinámicas de grupo intensas y consecuencias no deseadas en algunos participantes. Lifespring dejó de operar en los años 90.",
    ref: "Fuente: Wikipedia, Lifespring",
    refUrl: "https://en.wikipedia.org/wiki/Lifespring",
    type: "figure",
    accent: "amber",
  },
  {
    year: "1985–1991",
    title: "The Forum y el nacimiento de Landmark",
    body: "Est evoluciona hacia The Forum, un formato más suavizado. En 1991, Werner Erhard vende los derechos de sus materiales a sus empleados. La organización se convierte en Landmark Education, hoy conocida como Landmark Worldwide. Los reportes sobre sus métodos continúan siendo tema de debate público: algunos participantes reportan experiencias transformadoras; periodistas, investigadores y exparticipantes han documentado preguntas sobre presión grupal, técnicas de enrolamiento y la naturaleza de sus dinámicas.",
    type: "context",
  },
  {
    year: "1990s–2000s",
    title: "La expansión hacia América Latina",
    body: "Los modelos inspirados en est, Lifespring y sus derivados llegan a México, Argentina, Colombia, Chile y otros países. Surgen decenas de empresas y organizaciones que adaptan, con mayor o menor fidelidad y mayor o menor ética, los formatos intensivos de grupo grande. Algunos centros construyen comunidades genuinamente valiosas. Otros replican sólo la forma: la presión, el lenguaje, los diplomas. En todos los casos, la formación de los entrenadores rara vez está estandarizada.",
    type: "context",
  },
  {
    year: "2010s",
    title: "Nuevas preguntas públicas",
    body: "Con internet y redes sociales, los testimonios de exparticipantes se vuelven accesibles. Investigadores, periodistas y organizaciones de salud mental empiezan a documentar con más detalle las dinámicas de los Large Group Awareness Trainings (LGATs). El Washington Post, el New York Times y otros medios publican investigaciones sobre prácticas de presión, técnicas de influencia social y consecuencias psicológicas en poblaciones vulnerables. La conversación sobre ética, seguridad y regulación se vuelve urgente.",
    type: "context",
  },
  {
    year: "2020s",
    title: "Una industria en transición",
    body: "Los participantes son más informados. La salud mental es un tema público. Las regulaciones sobre bienestar psicológico se fortalecen. La pandemia acelera la conversación sobre transformación, propósito y bienestar. Y una nueva generación de centros, coaches y directores empieza a pedir algo distinto: menos carisma, más competencia. Menos presión, más presencia. Menos diplomas, más carrera.",
    type: "context",
  },
  {
    year: "Hoy",
    title: "La siguiente etapa: ELEVA",
    body: "ELEVA nace para responder esa demanda con rigor. No como reacción, sino como propuesta: una infraestructura profesional para centros de transformación que quieren operar con formación real, estándares claros, datos, ética y capacidad institucional. No venimos a reemplazar la conversación. Venimos a elevar la práctica.",
    type: "eleva",
    accent: "violet",
  },
]

const legacyContributions = [
  "La importancia del lenguaje en la experiencia humana",
  "La distinción entre evento e interpretación",
  "La fuerza de una declaración comprometida",
  "La responsabilidad personal como palanca de acción",
  "La potencia de la comunidad como contexto de transformación",
  "La experiencia vivencial como catalizador de cambio",
  "La posibilidad de observarse de una manera nueva",
  "El potencial humano como premisa, no como excepción",
]

const legacyPending = [
  "Programas basados en presión emocional sin suficiente contención",
  "Certificaciones por asistencia sin evaluación de competencias",
  "Entrenadores formados por imitación, sin supervisión formal",
  "Falta de criterios de seguridad psicológica y manejo de crisis",
  "Poca medición de impacto sostenido después del entrenamiento",
  "Dependencia de upsells y enrolamiento como motor de ingresos",
  "Lenguaje cerrado que no dialoga con psicología, neurociencia o ética",
  "Centros sin datos, protocolos ni estructura institucional",
]

export default function HistoriaTransformacionPage() {
  const heroRef = useInView(0.1)
  const timelineRef = useInView(0.06)
  const legacyRef = useInView(0.08)
  const elevaRef = useInView(0.1)

  return (
    <div className="min-h-screen bg-background text-foreground">

      {/* Nav */}
      <nav className="fixed top-0 inset-x-0 z-50 border-b border-white/5 bg-background/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-white transition-colors">
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <span className="text-white/20">/</span>
            <Link href="/" className="hover:text-white transition-colors">ELEVA</Link>
            <span className="text-white/20">/</span>
            <span className="text-amber-400 font-semibold">Historia</span>
          </div>
          <Link href="/estandar-eleva">
            <button className="px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white text-sm font-bold rounded-lg transition-colors">
              Ver el estándar
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
            <span className="inline-block text-xs font-bold text-amber-400 uppercase tracking-widest px-3 py-1 rounded-full border border-amber-500/20 bg-amber-500/5">
              Historia de la industria
            </span>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-[1.05] tracking-tighter">
              La historia de la transformación
              <span className="text-white/30 font-light italic block mt-2">merece contarse con honestidad.</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl leading-relaxed">
              La industria de la transformación personal no nació de la nada. Tiene raíces, pioneros, aportaciones y controversias. ELEVA estudia esa historia para construir un estándar más profesional, ético y completo.
            </p>
            <div className="flex gap-4">
              <Link href="/estandar-eleva">
                <button className="flex items-center gap-2 px-6 py-3 bg-violet-600 hover:bg-violet-500 text-white font-bold rounded-xl text-sm transition-colors group">
                  Ver el estándar ELEVA
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </Link>
              <Link href="/pacto">
                <button className="flex items-center gap-2 px-6 py-3 glass border border-white/10 hover:border-white/20 text-white/70 font-semibold rounded-xl text-sm transition-colors">
                  Aplicar a PACTO
                </button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 px-6 border-t border-white/5" ref={timelineRef.ref}>
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={timelineRef.inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease }}
            className="mb-14"
          >
            <p className="text-xs font-bold text-white/30 uppercase tracking-widest mb-4">Línea del tiempo</p>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">50 años en perspectiva.</h2>
          </motion.div>

          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-[72px] top-0 bottom-0 w-px bg-white/5 hidden sm:block" />

            <div className="space-y-10">
              {timeline.map((item, i) => {
                const accentColors: Record<string, string> = {
                  blue: "text-blue-400 border-blue-500/30 bg-blue-500/5",
                  amber: "text-amber-400 border-amber-500/30 bg-amber-500/5",
                  violet: "text-violet-400 border-violet-500/30 bg-violet-500/5",
                }
                const isEleva = item.type === "eleva"
                const isFigure = item.type === "figure"

                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -16 }}
                    animate={timelineRef.inView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.55, ease, delay: i * 0.07 }}
                    className="sm:grid sm:grid-cols-[144px_1fr] gap-8"
                  >
                    {/* Year */}
                    <div className="flex items-start gap-4 mb-3 sm:mb-0 sm:justify-end sm:pt-1">
                      <span className={`text-xs font-black uppercase tracking-widest whitespace-nowrap ${isEleva ? "text-violet-400" : isFigure ? (accentColors[item.accent ?? ""] ?? "").split(" ")[0] : "text-white/30"}`}>
                        {item.year}
                      </span>
                    </div>

                    {/* Content */}
                    <div className={`relative pl-0 sm:pl-8 pb-0 ${isEleva ? "rounded-2xl border border-violet-500/20 bg-violet-500/5 p-6" : isFigure ? `rounded-2xl border ${(accentColors[item.accent ?? ""] ?? "").split(" ").slice(1).join(" ")} p-5` : ""}`}>
                      {/* Dot on line */}
                      <div className={`absolute left-[-5px] top-2 w-2.5 h-2.5 rounded-full border-2 hidden sm:block ${isEleva ? "bg-violet-500 border-violet-400" : isFigure ? "bg-background border-white/20" : "bg-background border-white/10"}`} />

                      <h3 className="font-black text-white text-lg mb-2 leading-tight">{item.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{item.body}</p>
                      {item.ref && item.refUrl && (
                        <a
                          href={item.refUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 mt-3 text-xs text-white/25 hover:text-white/50 transition-colors"
                        >
                          {item.ref}
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Lo que aportaron / lo que queda pendiente */}
      <section className="py-24 px-6 border-t border-white/5" ref={legacyRef.ref}>
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={legacyRef.inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease }}
            className="mb-12"
          >
            <p className="text-xs font-bold text-white/30 uppercase tracking-widest mb-4">Balance histórico</p>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight max-w-xl">
              Lo que la industria construyó. Lo que todavía debe superar.
            </h2>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Aportaciones */}
            <div className="space-y-3">
              <p className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-5">Lo que sí aportaron</p>
              {legacyContributions.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -12 }}
                  animate={legacyRef.inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.45, ease, delay: i * 0.05 }}
                  className="flex items-start gap-2.5"
                >
                  <span className="text-emerald-400 mt-0.5 shrink-0">✓</span>
                  <p className="text-sm text-white/60 leading-snug">{item}</p>
                </motion.div>
              ))}
            </div>

            {/* Pendientes */}
            <div className="space-y-3">
              <p className="text-xs font-bold text-amber-400 uppercase tracking-widest mb-5">Lo que ya no puede seguir igual</p>
              {legacyPending.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 12 }}
                  animate={legacyRef.inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.45, ease, delay: i * 0.05 }}
                  className="flex items-start gap-2.5"
                >
                  <span className="text-amber-500 mt-0.5 shrink-0">→</span>
                  <p className="text-sm text-white/60 leading-snug">{item}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Postura ELEVA */}
      <section className="py-24 px-6 border-t border-white/5" ref={elevaRef.ref}>
        <div className="max-w-4xl mx-auto space-y-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={elevaRef.inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease }}
          >
            <p className="text-xs font-bold text-violet-400 uppercase tracking-widest mb-6">La postura ELEVA</p>
            <h2 className="text-4xl sm:text-5xl font-black text-white leading-[1.1] tracking-tight mb-6">
              No cancelamos la historia.
              <span className="text-violet-400"> La elevamos.</span>
            </h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed max-w-2xl">
              <p>
                No venimos a negar lo que la industria construyó. Los modelos intensivos de transformación grupal abrieron conversaciones que la psicología convencional no estaba teniendo. Pusieron el lenguaje, la responsabilidad y la posibilidad de cambio en el centro.
              </p>
              <p>
                Venimos a profesionalizar eso. A darle rigor, método, supervisión, datos, ética y estructura institucional. A convertir lo que fue potencial en una práctica replicable, medible y sostenible.
              </p>
              <p className="text-white/80 font-semibold">
                ELEVA existe porque la transformación merece más que carisma, presión y diplomas.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={elevaRef.inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease, delay: 0.2 }}
            className="grid sm:grid-cols-3 gap-4"
          >
            {[
              { label: "Reconocemos", body: "La historia y las aportaciones de los modelos que formaron la industria." },
              { label: "Aprendemos", body: "De sus límites documentados para no repetir sus errores." },
              { label: "Superamos", body: "Con formación real, estándares, datos, ética y operación profesional." },
            ].map((item) => (
              <div key={item.label} className="glass rounded-2xl border border-white/5 p-5 space-y-2">
                <p className="text-xs font-bold text-violet-400 uppercase tracking-widest">{item.label}</p>
                <p className="text-sm text-muted-foreground leading-snug">{item.body}</p>
              </div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={elevaRef.inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease, delay: 0.35 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Link href="/estandar-eleva">
              <button className="flex items-center gap-2.5 px-7 py-4 bg-violet-600 hover:bg-violet-500 text-white font-black rounded-xl text-base transition-colors group">
                Ver el estándar ELEVA
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </Link>
            <Link href="/pacto">
              <button className="flex items-center gap-2.5 px-7 py-4 glass border border-white/10 hover:border-white/20 text-white font-bold rounded-xl text-base transition-colors">
                Aplicar a PACTO
              </button>
            </Link>
          </motion.div>

          <HistoricalDisclaimer />
        </div>
      </section>

    </div>
  )
}
