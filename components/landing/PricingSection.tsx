"use client"

import { motion } from "framer-motion"
import { CheckCircle, Clock, CalendarDays, Zap, Lock, TrendingUp } from "lucide-react"
import { cn } from "@/lib/utils"
import { useLang } from "@/lib/i18n"

export function PricingSection() {
  const { lang } = useLang()

  const c = lang === "en" ? {
    eyebrow: "Investment",
    h2a: "A system that pays for itself",
    h2b: "in the first month.",
    sub: "On average, centers that operate the system with discipline cover the implementation cost in less than 90 days — through better retention, lower delinquency, and more prepared cohorts. All figures are approximate and based on results from existing clients.",
    ndaBanner: "All clients operate under NDA. Your strategy, your numbers and your growth are confidential.",
    growthLabel: "Expected growth",
    packages: [
      {
        name: "Base Implementation",
        price: "from $15,000",
        currency: "USD",
        badge: null,
        highlight: false,
        color: "border-border",
        accentColor: "text-foreground",
        months: 2,
        weeklyHours: null as null | string,
        growthMultiple: "2x – 3x",
        growthNote: "Approximate range based on results from existing centers operating with discipline",
        description: "We implement the system, train your team, and accompany you for the first 2 active months. Includes the core tools your team needs to operate professionally from day one.",
        involvementNote: "2 months of active accompaniment",
        followUp: "3 months of post-launch remote support included (email + WhatsApp). After that, coverage continues through the monthly maintenance plan. Email, SMS and hosting costs billed separately based on usage.",
        features: [
          { text: "Participant registration and full record (expediente) creation", included: true },
          { text: "Operational dashboard with available center metrics", included: true },
          { text: "Reports and data export module", included: true },
          { text: "User and role-based access control", included: true },
          { text: "Center activity history log", included: true },
          { text: "Participant portal: each person tracks their own process", included: true },
          { text: "Automated notifications (WhatsApp and email)", included: true },
          { text: "Integrated CRM for leads and participants", included: true },
          { text: "Newsletter module (Twilio, email and hosting costs billed separately)", included: true },
          { text: "Training for webinars and in-person courses", included: true },
          { text: "Coach module: contextual brief before each training session", included: false },
          { text: "AI that analyzes your numbers and generates action plans", included: false },
          { text: "Monthly insights from 20+ centers across 5 continents", included: false },
        ],
        cta: "Schedule free diagnosis",
        ctaStyle: "bg-muted hover:bg-muted/80 border border-border text-foreground",
        recommendedNote: null as null | string,
      },
      {
        name: "Robust Implementation",
        price: "from $30,000",
        currency: "USD",
        badge: "Full team included",
        highlight: true,
        color: "border-violet-500/50",
        accentColor: "text-violet-400",
        months: 6,
        weeklyHours: "160–200 hrs/wk",
        growthMultiple: "5x – 10x",
        growthNote: "Approximate range based on robust implementations in similar centers",
        description: "Everything in Base, plus a dedicated team that implements it all, ensures it works, and stays with you for 6 months. This isn't just software — it's a full operational transformation with people behind every process.",
        involvementNote: "6 months of deep involvement",
        followUp: "6 months of strategic accompaniment with monthly sessions. We solve operational problems with your team, manage speakers and events, and stay until the system runs itself.",
        features: [
          { text: "Everything in Base Implementation", included: true },
          { text: "Coach module: each coach gets a full brief and participant context before every session", included: true },
          { text: "Advanced CRM: AI-driven conjectures, dropout risk detection, behavioral patterns and automatic action plans", included: true },
          { text: "Monthly insights from 20+ centers in Sydney, Johannesburg, London, Madrid, Barcelona, Paris, New York, Mexico City, São Paulo and more", included: true },
          { text: "Full event management: speaker selection, calendar building, coordination — we handle it all", included: true },
          { text: "Dedicated team that implements, configures and ensures everything works", included: true },
          { text: "Social media strategy: identity, tone, content calendar", included: true },
          { text: "Positioning and traditional media: PR, alliances, events", included: true },
          { text: "6 months of strategic sessions until the system runs itself", included: true },
        ],
        cta: "Schedule strategy session",
        ctaStyle: "bg-violet-600 hover:bg-violet-500 text-white",
        recommendedNote: "This plan includes a team that implements everything and makes sure it works. You are not alone — we are inside your operation with you for 6 months.",
      },
    ],
    maintenanceLabel: "Monthly maintenance",
    maintenancePriceNote: "Activates upon implementation completion · No forced annual contracts",
    allIncluded: "✦ All included",
    priceNote: "The maintenance price does not increase with the number of participants or active cohorts. A center with 500 participants pays the same as one with 50.",
    maintenanceItems: [
      "Cloud hosting, infrastructure and security",
      "System updates and new roadmap features",
      "Automatic daily backups",
      "Technical support via WhatsApp and email (Mon–Fri, 9 am – 6 pm)",
      "1 monthly KPI review session with your account manager (30 min)",
      "Proactive system alerts: anomalies, risks and opportunities",
      "Access to new integrations and AI improvements included",
    ],
  } : {
    eyebrow: "Inversión",
    h2a: "Un sistema que se paga",
    h2b: "solo en el primer mes.",
    sub: "En promedio, los centros que operan el sistema con disciplina recuperan la inversión en menos de 90 días — a través de mejor retención, menor morosidad y cohortes más preparadas. Todos los números son aproximados y con base en resultados de clientes existentes.",
    ndaBanner: "Todos los clientes operan bajo NDA. Tu estrategia, tus números y tu crecimiento son confidenciales.",
    growthLabel: "Crecimiento esperado",
    packages: [
      {
        name: "Implementación Base",
        price: "desde $15,000",
        currency: "USD",
        badge: null,
        highlight: false,
        color: "border-border",
        accentColor: "text-foreground",
        months: 2,
        weeklyHours: null as null | string,
        growthMultiple: "2x – 3x",
        growthNote: "Rango aproximado con base en centros existentes que operan con disciplina",
        description: "Implementamos el sistema, capacitamos a tu equipo y te acompañamos los primeros 2 meses activos. Incluye las herramientas fundamentales para que tu equipo opere de forma profesional desde el primer día.",
        involvementNote: "2 meses de acompañamiento activo",
        followUp: "3 meses de soporte remoto post-lanzamiento incluido (email + WhatsApp). A partir de ahí, la cobertura continúa a través del plan de mantenimiento mensual. Los costos de email, SMS y hosting se cobran por separado según uso.",
        features: [
          { text: "Registro de participantes y creación de expediente completo", included: true },
          { text: "Dashboard operativo con las métricas disponibles del centro", included: true },
          { text: "Módulo de reportes y exportación de datos", included: true },
          { text: "Control de usuarios y accesos por rol", included: true },
          { text: "Historial de actividades del centro", included: true },
          { text: "Portal del participante: cada persona lleva seguimiento de su proceso", included: true },
          { text: "Notificaciones automatizadas (WhatsApp y email)", included: true },
          { text: "CRM integrado para leads y participantes", included: true },
          { text: "Módulo de newsletter (costos de Twilio, email y hosting se cobran aparte)", included: true },
          { text: "Capacitación para webinars y cursos presenciales", included: true },
          { text: "Módulo de coaches: brief contextual antes de cada sesión de entrenamiento", included: false },
          { text: "IA que analiza tus números y genera planes de acción", included: false },
          { text: "Insights mensuales de más de 20 centros en 5 continentes", included: false },
        ],
        cta: "Agendar diagnóstico gratuito",
        ctaStyle: "bg-muted hover:bg-muted/80 border border-border text-foreground",
        recommendedNote: null as null | string,
      },
      {
        name: "Implementación Robusta",
        price: "desde $30,000",
        currency: "USD",
        badge: "Equipo dedicado incluido",
        highlight: true,
        color: "border-violet-500/50",
        accentColor: "text-violet-400",
        months: 6,
        weeklyHours: "160–200 hrs/sem",
        growthMultiple: "5x – 10x",
        growthNote: "Rango aproximado con base en implementaciones robustas en centros similares",
        description: "Todo lo de Base, más un equipo dedicado que lo implementa todo, se asegura de que funcione y se queda contigo 6 meses. No es solo software — es una transformación operativa completa con personas detrás de cada proceso.",
        involvementNote: "6 meses de involucramiento profundo",
        followUp: "6 meses de acompañamiento estratégico con sesiones mensuales. Resolvemos problemas operativos con tu equipo, gestionamos speakers y eventos, y nos quedamos hasta que el sistema corra solo.",
        features: [
          { text: "Todo lo de Implementación Base", included: true },
          { text: "Módulo de coaches: cada coach recibe un brief completo y contexto del participante antes de cada sesión", included: true },
          { text: "CRM avanzado: conjeturas automáticas, detección de riesgo de abandono, patrones de comportamiento y planes de acción basados en tus datos", included: true },
          { text: "Insights mensuales de más de 20 centros en Sydney, Johannesburgo, Londres, Madrid, Barcelona, París, Nueva York, Ciudad de México, São Paulo y más", included: true },
          { text: "Gestión completa de eventos: selección de speakers, armado de calendario, coordinación — nosotros nos encargamos de todo", included: true },
          { text: "Equipo dedicado que implementa, configura y garantiza que todo funcione", included: true },
          { text: "Estrategia de redes sociales: identidad, tono, calendario de contenidos", included: true },
          { text: "Posicionamiento y medios tradicionales: PR, alianzas, eventos", included: true },
          { text: "6 meses de sesiones estratégicas hasta que el sistema corra solo", included: true },
        ],
        cta: "Agendar sesión estratégica",
        ctaStyle: "bg-violet-600 hover:bg-violet-500 text-white",
        recommendedNote: "Este plan incluye un equipo que implementa todo y se asegura de que funcione. No estás solo — estamos dentro de tu operación contigo durante 6 meses.",
      },
    ],
    maintenanceLabel: "Mantenimiento mensual",
    maintenancePriceNote: "Se activa al finalizar la implementación · Sin contratos anuales forzados",
    allIncluded: "✦ Todo incluido",
    priceNote: "El precio de mantenimiento no aumenta con el número de participantes ni cohortes activas. Un centro con 500 participantes paga lo mismo que uno con 50.",
    maintenanceItems: [
      "Hosting, infraestructura y seguridad en la nube",
      "Actualizaciones del sistema y nuevas funciones del roadmap",
      "Backups automáticos diarios",
      "Soporte técnico por WhatsApp y email (lunes a viernes, 9 am – 6 pm)",
      "1 sesión mensual de revisión de KPIs con tu account manager (30 min)",
      "Alertas proactivas del sistema: anomalías, riesgos y oportunidades",
      "Acceso a nuevas integraciones y mejoras de IA incluidas",
    ],
  }

  return (
    <section className="px-6 py-20 max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-14"
      >
        <p className="text-xs uppercase tracking-widest text-violet-400 font-semibold mb-4">{c.eyebrow}</p>
        <h2 className="text-4xl sm:text-5xl font-black text-foreground">
          {c.h2a}<br className="hidden sm:block" /> {c.h2b}
        </h2>
        <p className="text-muted-foreground mt-4 max-w-2xl mx-auto text-lg leading-relaxed">
          {c.sub}
        </p>
        {/* NDA banner */}
        <div className="mt-6 inline-flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-foreground/[0.04] border border-border text-sm text-muted-foreground">
          <Lock className="w-3.5 h-3.5 text-green-400 flex-shrink-0" />
          <span>{c.ndaBanner}</span>
        </div>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-6 mb-10">
        {c.packages.map((pkg, i) => (
          <motion.div
            key={pkg.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className={cn(
              "glass rounded-2xl p-7 border flex flex-col relative",
              pkg.highlight ? "border-violet-500/50 bg-violet-600/5" : pkg.color
            )}
          >
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
              <p className="text-xs text-muted-foreground mt-1">{lang === "en" ? "Final price defined in the free diagnosis call" : "Precio final definido en la llamada de diagnóstico gratuito"}</p>
            </div>

            {/* Involvement indicators */}
            <div className={cn("flex items-center gap-3 mb-3 p-3 rounded-xl", pkg.highlight ? "bg-violet-500/10 border border-violet-500/20" : "bg-foreground/[0.04] border border-border")}>
              <div className="flex items-center gap-1.5 text-xs font-semibold">
                <CalendarDays className={cn("w-3.5 h-3.5", pkg.highlight ? "text-violet-400" : "text-muted-foreground")} />
                <span className={pkg.highlight ? "text-violet-300" : "text-foreground/70"}>
                  {pkg.months} {lang === "en" ? "months" : "meses"}
                </span>
              </div>
              {pkg.weeklyHours && (
                <>
                  <span className="text-muted-foreground/30">·</span>
                  <div className="flex items-center gap-1.5 text-xs font-semibold">
                    <Clock className="w-3.5 h-3.5 text-violet-400" />
                    <span className="text-violet-300">{pkg.weeklyHours}</span>
                  </div>
                </>
              )}
              {!pkg.weeklyHours && (
                <>
                  <span className="text-muted-foreground/30">·</span>
                  <span className="text-xs text-muted-foreground">{lang === "en" ? "Remote support after launch" : "Soporte remoto post-lanzamiento"}</span>
                </>
              )}
            </div>

            {/* Growth multiplier badge */}
            <div className={cn("flex items-center gap-2.5 mb-4 p-3 rounded-xl", pkg.highlight ? "bg-emerald-500/10 border border-emerald-500/25" : "bg-foreground/[0.03] border border-border")}>
              <TrendingUp className={cn("w-4 h-4 flex-shrink-0", pkg.highlight ? "text-emerald-400" : "text-green-400")} />
              <div>
                <div className="flex items-baseline gap-2">
                  <span className={cn("text-lg font-black leading-none", pkg.highlight ? "text-emerald-400" : "text-green-400")}>{pkg.growthMultiple}</span>
                  <span className="text-[10px] text-muted-foreground">{lang === "en" ? "growth" : "crecimiento"}</span>
                </div>
                <p className="text-[10px] text-muted-foreground mt-0.5 leading-snug">{pkg.growthNote}</p>
              </div>
            </div>

            <p className="text-sm text-foreground/80 leading-relaxed mb-5">{pkg.description}</p>

            <ul className="space-y-2.5 flex-1 mb-5">
              {pkg.features.map((f) => (
                <li key={f.text} className="flex items-start gap-2.5 text-sm">
                  <CheckCircle className={cn("w-4 h-4 mt-0.5 flex-shrink-0", f.included ? (pkg.highlight ? "text-violet-400" : "text-green-400") : "text-muted-foreground/30")} />
                  <span className={cn("leading-snug", f.included ? "text-foreground" : "text-muted-foreground/40 line-through")}>{f.text}</span>
                </li>
              ))}
            </ul>

            <p className="text-[11px] text-muted-foreground italic mb-5">{pkg.followUp}</p>

            {/* Recommended callout — Elite only */}
            {pkg.recommendedNote && (
              <div className="flex items-start gap-2.5 mb-5 p-3.5 rounded-xl bg-violet-600/15 border border-violet-500/30">
                <Zap className="w-4 h-4 text-violet-400 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-violet-300 leading-relaxed">{pkg.recommendedNote}</p>
              </div>
            )}

            <button className={cn("w-full py-3 rounded-xl text-sm font-bold transition-all", pkg.ctaStyle)}>
              {pkg.cta}
            </button>
          </motion.div>
        ))}
      </div>

      {/* Monthly maintenance */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="glass rounded-2xl border border-cyan-500/20 bg-cyan-500/3 p-7"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <p className="text-xs text-cyan-400 font-semibold uppercase tracking-wide mb-1">{c.maintenanceLabel}</p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-foreground">$699</span>
              <span className="text-sm text-muted-foreground">USD / {lang === "en" ? "mo per center" : "mes por centro"}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">{c.maintenancePriceNote}</p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-xs text-cyan-300 font-semibold whitespace-nowrap self-start">
            {c.allIncluded}
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-2.5">
          {c.maintenanceItems.map((item) => (
            <div key={item} className="flex items-start gap-2.5 text-sm">
              <CheckCircle className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0 mt-0.5" />
              <span className="text-foreground/80 leading-snug">{item}</span>
            </div>
          ))}
        </div>

        <p className="text-xs text-muted-foreground mt-5 pt-4 border-t border-border">
          {c.priceNote}
        </p>
      </motion.div>
    </section>
  )
}
