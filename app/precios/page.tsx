"use client"

import { useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight, CheckCircle, ChevronDown, ChevronRight, BarChart3, Zap } from "lucide-react"
import { cn } from "@/lib/utils"
import { useLang } from "@/lib/i18n"

// ─── Nav ─────────────────────────────────────────────────────────────────────

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
          <Link href="/funcionalidades" className="text-[13px] text-muted-foreground hover:text-foreground transition-colors hidden sm:block px-3 py-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/5">
            {t.features}
          </Link>
          <Link href="/precios" className="text-[13px] font-semibold text-violet-400 px-3 py-1.5 rounded-lg bg-violet-500/8 hidden sm:block">
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
          <Link href="/vl2026">
            <button className="flex items-center gap-1.5 px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg text-[13px] font-semibold transition-colors ml-1">
              {t.demo} <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </Link>
        </div>
      </div>
    </nav>
  )
}

// ─── FAQ accordion ────────────────────────────────────────────────────────────

function FAQ({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border border-border rounded-xl overflow-hidden">
      <button onClick={() => setOpen(p => !p)}
        className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left hover:bg-white/3 transition-colors">
        <span className="text-sm font-semibold text-foreground">{q}</span>
        <ChevronDown className={`w-4 h-4 text-muted-foreground flex-shrink-0 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden">
            <p className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const PACKAGES = [
  {
    name: "Implementación Base",
    price: "desde $15,000",
    currency: "USD",
    badge: null,
    highlight: false,
    description: "Implementamos el sistema, capacitamos a tu equipo y te acompañamos los primeros 2 meses activos. Incluye las herramientas fundamentales para que tu equipo opere de forma profesional desde el primer día.",
    followUp: "3 meses de soporte remoto post-lanzamiento incluido (email + WhatsApp). Los costos de email, SMS y hosting se cobran por separado según uso.",
    features: [
      { text: "Registro de participantes y creación de expediente completo", on: true },
      { text: "Dashboard operativo con las métricas disponibles del centro", on: true },
      { text: "Módulo de reportes y exportación de datos", on: true },
      { text: "Control de usuarios y accesos por rol", on: true },
      { text: "Historial de actividades del centro", on: true },
      { text: "Portal del participante: cada persona lleva seguimiento de su proceso", on: true },
      { text: "Notificaciones automatizadas (WhatsApp y email)", on: true },
      { text: "CRM integrado para leads y participantes", on: true },
      { text: "Módulo de newsletter (costos de Twilio, email y hosting se cobran aparte)", on: true },
      { text: "Capacitación para webinars y cursos presenciales", on: true },
      { text: "Módulo de coaches: brief contextual antes de cada sesión de entrenamiento", on: false },
      { text: "IA que analiza tus números y genera planes de acción", on: false },
      { text: "Insights mensuales de más de 20 centros en 5 continentes", on: false },
    ],
    cta: "Agendar diagnóstico",
    ctaStyle: "bg-muted hover:bg-muted/80 border border-border text-foreground",
    accentColor: "text-foreground",
  },
  {
    name: "Implementación Robusta",
    price: "desde $30,000",
    currency: "USD",
    badge: "Equipo dedicado incluido",
    highlight: true,
    description: "Todo lo de Base, más un equipo dedicado que lo implementa todo, se asegura de que funcione y se queda contigo 6 meses. No es solo software, es una transformación operativa completa con personas detrás de cada proceso.",
    followUp: "6 meses de acompañamiento estratégico con sesiones mensuales. Gestionamos speakers, eventos y problemas operativos hasta que el sistema corra solo.",
    features: [
      { text: "Todo lo de Implementación Base", on: true },
      { text: "Módulo de coaches: cada coach recibe un brief completo y contexto del participante antes de cada sesión", on: true },
      { text: "CRM avanzado: conjeturas automáticas, detección de riesgo de abandono, patrones de comportamiento y planes de acción basados en tus datos", on: true },
      { text: "Insights mensuales de más de 20 centros en Sydney, Johannesburgo, Londres, Madrid, Barcelona, Málaga, Florencia, París, Nueva York, Boston, Atlanta, San Francisco, San Diego, Los Ángeles, Tijuana, Ciudad de México, Monterrey, Guadalajara, Cancún, Mérida, Guatemala, El Salvador, Panamá, Colombia, Chile, Perú, Uruguay, Ecuador, Argentina, Brasil, Portugal, Viena y más", on: true },
      { text: "Gestión completa de eventos: selección de speakers, armado del calendario, coordinación, nosotros nos encargamos de todo", on: true },
      { text: "Equipo dedicado que implementa, configura y garantiza que todo funcione", on: true },
      { text: "Estrategia de redes sociales: identidad, tono, calendario de contenidos", on: true },
      { text: "Posicionamiento y medios tradicionales: PR, alianzas, eventos", on: true },
      { text: "6 meses de sesiones estratégicas hasta que el sistema corra solo", on: true },
    ],
    cta: "Agendar sesión estratégica",
    ctaStyle: "bg-violet-600 hover:bg-violet-500 text-white",
    accentColor: "text-violet-400",
  },
]

const MAINTENANCE = [
  "Hosting, infraestructura y seguridad en la nube",
  "Actualizaciones del sistema y nuevas funciones del roadmap",
  "Backups automáticos diarios",
  "Soporte técnico por WhatsApp y email (L-V, 9am–6pm)",
  "1 sesión mensual de revisión de KPIs (30 min)",
  "Alertas proactivas: anomalías, riesgos y oportunidades",
  "Acceso a nuevas integraciones y mejoras de IA",
]

const FAQS = [
  { q: "¿ELEVA reemplaza el enrolamiento boca a boca?", a: "No. El boca a boca es uno de los motores más poderosos que tiene esta industria y ELEVA no lo elimina: lo amplifica. Agrega canales digitales para que el centro no dependa únicamente de eso, y da herramientas a los participantes para que invitar sea más fácil y más natural." },
  { q: "¿Es un CRM genérico?", a: "Tiene un módulo de CRM, pero es mucho más. Un CRM genérico no entiende cohortes, fases de transformación, Momentum Score ni el modelo de enrolamiento. ELEVA fue construido desde cero para este modelo específico." },
  { q: "¿Funciona para centros pequeños?", a: "Sí. Está diseñado para escalar desde centros con 50 participantes hasta operaciones con miles. Un centro pequeño que retiene mejor y opera más limpio crece más rápido. En promedio, con base en resultados de clientes existentes, la inversión se recupera en menos de 90 días." },
  { q: "¿Cuánto tiempo toma implementarlo?", a: "Depende del plan. En la Implementación Base, el sistema está operando en aproximadamente 60 días, los primeros 30 son de configuración, migración y capacitación; los siguientes 30 son de arranque acompañado. En la Robusta, el proceso es de 6 meses completos con el equipo involucrado." },
  { q: "¿Los participantes tienen que descargar una app?", a: "No. La experiencia del participante funciona como Progressive Web App (PWA): se accede desde el navegador del teléfono y se puede instalar en la pantalla de inicio sin pasar por ninguna tienda. No requiere descarga ni actualizaciones manuales." },
  { q: "¿Funciona para centros en varias ciudades?", a: "ELEVA es multi-sede desde el diseño. Una sola cuenta con múltiples ubicaciones, cohortes por ciudad, coaches asignados por sede y reportes consolidados o segmentados." },
  { q: "¿El precio cambia si crecemos mucho?", a: "No. El mantenimiento mensual es fijo por centro sin importar cuántos participantes o cohortes tengas activos. Un centro con 500 participantes paga lo mismo que uno con 50." },
]

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function PreciosPage() {
  return (
    <>
      <TopNav />
      <main className="pt-20">

        {/* Hero */}
        <div className="max-w-3xl mx-auto px-6 pt-14 pb-12 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span className="inline-block text-[10px] font-black uppercase tracking-[0.2em] text-violet-400 bg-violet-500/10 border border-violet-500/20 px-3 py-1.5 rounded-full mb-5">
              Inversión
            </span>
            <h1 className="text-5xl sm:text-6xl font-black text-foreground leading-[1.05] mb-4">
              Una inversión que los centros<br />
              <span className="gradient-text">recuperan en menos de 90 días.</span>
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed mb-6">
              En promedio, los centros que operan el sistema con disciplina lo recuperan a través de mejor retención, menor morosidad y cohortes más preparadas. Todos los resultados son aproximados y con base en clientes existentes.
            </p>
            <Link href="/simulador">
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 rounded-xl text-sm font-semibold transition-all">
                <BarChart3 className="w-4 h-4" />
                Calcular el impacto en tu centro
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </Link>
          </motion.div>
        </div>

        {/* Packages */}
        <div className="max-w-5xl mx-auto px-6 pb-12">
          <div className="grid md:grid-cols-2 gap-6 mb-10">
            {PACKAGES.map((pkg, i) => (
              <motion.div key={pkg.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={cn("glass rounded-2xl p-7 border flex flex-col relative",
                  pkg.highlight ? "border-violet-500/50 bg-violet-600/5" : "border-border")}>
                {pkg.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-violet-600 text-white text-xs font-bold whitespace-nowrap">
                    {pkg.badge}
                  </div>
                )}
                <div className="mb-5">
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">{pkg.name}</p>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className={cn("text-3xl font-black", pkg.accentColor)}>{pkg.price}</span>
                    <span className="text-sm text-muted-foreground">{pkg.currency}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Precio final definido después del diagnóstico de tu centro</p>
                </div>
                <p className="text-sm text-foreground/80 leading-relaxed mb-5">{pkg.description}</p>
                <ul className="space-y-2.5 flex-1 mb-5">
                  {pkg.features.map((f) => (
                    <li key={f.text} className="flex items-start gap-2.5 text-sm">
                      <CheckCircle className={cn("w-4 h-4 mt-0.5 flex-shrink-0", f.on ? (pkg.highlight ? "text-violet-400" : "text-green-400") : "text-foreground/15")} />
                      <span className={cn("leading-snug", f.on ? "text-foreground" : "text-muted-foreground/40 line-through")}>{f.text}</span>
                    </li>
                  ))}
                </ul>
                <p className="text-[11px] text-muted-foreground italic mb-5">{pkg.followUp}</p>
                <Link href="/build">
                  <button className={cn("w-full py-3 rounded-xl text-sm font-bold transition-all", pkg.ctaStyle)}>
                    {pkg.cta}
                  </button>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Monthly maintenance */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="glass rounded-2xl border border-cyan-500/20 bg-cyan-500/3 p-7 mb-16">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <p className="text-xs text-cyan-400 font-semibold uppercase tracking-wide mb-1">Mantenimiento mensual</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-foreground">$699</span>
                  <span className="text-sm text-muted-foreground">USD / mes por centro</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">Se activa al finalizar la implementación · Sin contratos anuales forzados</p>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-xs text-cyan-300 font-semibold whitespace-nowrap self-start">
                ✦ Todo incluido
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-2.5">
              {MAINTENANCE.map((item) => (
                <div key={item} className="flex items-start gap-2.5 text-sm">
                  <CheckCircle className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0 mt-0.5" />
                  <span className="text-foreground/80 leading-snug">{item}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-5 pt-4 border-t border-border">
              El precio de mantenimiento no aumenta con el número de participantes ni cohortes activas. Un centro con 500 participantes paga lo mismo que uno con 50.
            </p>
          </motion.div>

          {/* FAQ */}
          <div className="max-w-3xl mx-auto mb-16">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-violet-400 mb-3">Preguntas frecuentes</p>
              <h2 className="text-3xl sm:text-4xl font-black text-foreground">Lo que siempre preguntan.</h2>
            </motion.div>
            <div className="space-y-2">
              {FAQS.map((faq) => (
                <motion.div key={faq.q} initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                  <FAQ q={faq.q} a={faq.a} />
                </motion.div>
              ))}
            </div>
          </div>

          {/* Build CTA */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="rounded-2xl bg-gradient-to-br from-violet-600/20 via-violet-600/10 to-cyan-500/8 border border-violet-500/30 p-8 text-center">
            <div className="w-12 h-12 rounded-2xl bg-violet-600/20 border border-violet-600/30 flex items-center justify-center mx-auto mb-5">
              <Zap className="w-5 h-5 text-violet-400" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-foreground mb-3">
              ¿No sabes por dónde empezar?
            </h2>
            <p className="text-muted-foreground text-base leading-relaxed max-w-xl mx-auto mb-7">
              En 30 minutos te mostramos cómo ELEVA se adapta a tu modelo, tu metodología y tus objetivos. Sin compromiso, solo claridad.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/vl2026">
                <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-2 px-7 py-3.5 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-sm font-bold transition-colors">
                  Ver el demo primero <ArrowRight className="w-4 h-4" />
                </motion.button>
              </Link>
              <a href="mailto:hola@elevaapp.io">
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-2 px-7 py-3.5 glass text-foreground rounded-xl text-sm font-medium hover:opacity-80 transition-all">
                  Agendar una llamada de 30 min <ChevronRight className="w-4 h-4" />
                </motion.button>
              </a>
            </div>
            <p className="text-xs text-muted-foreground mt-5">
              Sin compromiso · Respuesta en menos de 24 horas · Más de 40 centros ya operan con ELEVA
            </p>
          </motion.div>
        </div>
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
            <Link href="/funcionalidades" className="hover:text-foreground transition-colors">Funcionalidades</Link>
            <Link href="/simulador" className="hover:text-foreground transition-colors">Simulador</Link>
            <Link href="/vl2026" className="hover:text-foreground transition-colors">Demo</Link>
          </div>
        </div>
      </footer>
    </>
  )
}
