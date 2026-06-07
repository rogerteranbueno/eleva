"use client"

import { motion } from "framer-motion"
import { CheckCircle, Clock, CalendarDays, Zap } from "lucide-react"
import { cn } from "@/lib/utils"
import { useLang } from "@/lib/i18n"

export function PricingSection() {
  const { lang } = useLang()

  const c = lang === "en" ? {
    eyebrow: "Investment",
    h2a: "A system that pays for itself",
    h2b: "in the first month.",
    sub: "Reducing delinquency by 20%, retaining 10 more participants and enrolling a better-prepared generation covers the investment. What remains is pure profit.",
    packages: [
      {
        name: "Base Implementation",
        price: "from $15,000",
        currency: "USD",
        badge: null,
        highlight: false,
        color: "border-white/12",
        accentColor: "text-foreground",
        months: 2,
        weeklyHours: null as null | string,
        description: "We are with you for 2 active months: diagnosis, system setup, team training, and launch. After that, async support continues via email and WhatsApp.",
        involvementNote: "2 months of active accompaniment",
        followUp: "3 months of post-launch remote support included (email + WhatsApp). After that, coverage continues through the monthly maintenance plan.",
        features: [
          { text: "Full center diagnosis (~40 hrs)", included: true },
          { text: "System design and implementation (~50 hrs)", included: true },
          { text: "Existing data migration (participants, cohorts, history)", included: true },
          { text: "Team training: staff, coaches and director", included: true },
          { text: "WhatsApp and email automations live from day 1", included: true },
          { text: "Accompanied launch to coaches and participants (~20 hrs)", included: true },
          { text: "3 months of remote post-launch support (email + WhatsApp)", included: true },
          { text: "Advanced AI module: predictive analytics and anomaly detection", included: false },
          { text: "Native mobile app with center branding (iOS + Android)", included: false },
          { text: "Brand communication and positioning strategy", included: false },
        ],
        cta: "Schedule free diagnosis",
        ctaStyle: "bg-muted hover:bg-muted/80 border border-border text-foreground",
        recommendedNote: null as null | string,
      },
      {
        name: "Elite Implementation",
        price: "up to $30,000",
        currency: "USD",
        badge: "Recommended",
        highlight: true,
        color: "border-violet-500/50",
        accentColor: "text-violet-300",
        months: 6,
        weeklyHours: "160–200 hrs/wk",
        description: "We are with you for 6 months total: 2 of intensive implementation + 4 of strategic accompaniment. We dedicate 160–200 hrs/week to making everything work.",
        involvementNote: "6 months · 160–200 hrs/week",
        followUp: "6 months of strategic accompaniment with monthly sessions. We solve operational problems with your team, adapt marketing so your community embraces the change, and stay until the system is running on its own.",
        features: [
          { text: "Everything in Base Implementation", included: true },
          { text: "Advanced AI module: auto plans, dropout prediction, financial anomaly detection", included: true },
          { text: "Native mobile app with center branding (iOS + Android)", included: true },
          { text: "Social media strategy: identity, tone, content calendar", included: true },
          { text: "Traditional media strategy: PR, alliances, events and public positioning", included: true },
          { text: "Positioning: from 'transformation center' to 'professional human potential center'", included: true },
          { text: "Operational troubleshooting with your team in real time", included: true },
          { text: "Marketing for adoption: we ensure your community embraces the change", included: true },
          { text: "6 months of strategic sessions until the system runs itself", included: true },
        ],
        cta: "Schedule strategy session",
        ctaStyle: "bg-violet-600 hover:bg-violet-500 text-white",
        recommendedNote: "We recommend this plan because, without counting travel expenses, it gives you our team 100% involved in implementing, redesigning and making everything work. You're not alone — we're in it with you.",
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
      "Mobile app updates (Elite package)",
    ],
  } : {
    eyebrow: "Inversión",
    h2a: "Un sistema que se paga",
    h2b: "solo en el primer mes.",
    sub: "Reducir morosidad un 20%, retener 10 participantes más y enrolar una generación mejor preparada cubre la inversión. Lo que queda es pura utilidad.",
    packages: [
      {
        name: "Implementación Base",
        price: "desde $15,000",
        currency: "USD",
        badge: null,
        highlight: false,
        color: "border-white/12",
        accentColor: "text-foreground",
        months: 2,
        weeklyHours: null as null | string,
        description: "Estamos contigo 2 meses activos: diagnóstico, configuración del sistema, capacitación del equipo y lanzamiento. Después continúa el soporte remoto por email y WhatsApp.",
        involvementNote: "2 meses de acompañamiento activo",
        followUp: "3 meses de soporte remoto post-lanzamiento incluido (email + WhatsApp). A partir de ahí, la cobertura continúa a través del plan de mantenimiento mensual.",
        features: [
          { text: "Diagnóstico completo del centro (~40 hrs)", included: true },
          { text: "Diseño e implementación del sistema (~50 hrs)", included: true },
          { text: "Migración de datos existentes (participantes, cohortes, historial)", included: true },
          { text: "Capacitación del equipo: staff, coaches y director", included: true },
          { text: "Automatizaciones de WhatsApp y email activas desde día 1", included: true },
          { text: "Lanzamiento acompañado a coaches y participantes (~20 hrs)", included: true },
          { text: "3 meses de soporte remoto post-lanzamiento (email + WhatsApp)", included: true },
          { text: "Módulo de IA avanzado: análisis predictivo y detección de anomalías", included: false },
          { text: "App móvil nativa con branding del centro (iOS + Android)", included: false },
          { text: "Estrategia de comunicación y posicionamiento de marca", included: false },
        ],
        cta: "Agendar diagnóstico gratuito",
        ctaStyle: "bg-muted hover:bg-muted/80 border border-border text-foreground",
        recommendedNote: null as null | string,
      },
      {
        name: "Implementación Elite",
        price: "hasta $30,000",
        currency: "USD",
        badge: "Recomendado",
        highlight: true,
        color: "border-violet-500/50",
        accentColor: "text-violet-300",
        months: 6,
        weeklyHours: "160–200 hrs/sem",
        description: "Estamos contigo 6 meses en total: 2 de implementación intensiva + 4 de acompañamiento estratégico. Dedicamos 160–200 hrs/semana a que todo funcione.",
        involvementNote: "6 meses · 160–200 hrs/semana",
        followUp: "6 meses de acompañamiento estratégico con sesiones mensuales. Resolvemos problemas operativos con tu equipo, adaptamos el marketing para que tu comunidad abrace el cambio y nos quedamos hasta que el sistema corra solo.",
        features: [
          { text: "Todo lo de Implementación Base", included: true },
          { text: "Módulo de IA avanzado: planes automáticos, predicción de abandono, anomalías financieras", included: true },
          { text: "App móvil nativa con branding del centro (iOS + Android)", included: true },
          { text: "Estrategia de comunicación para redes sociales: identidad, tono, calendario de contenidos", included: true },
          { text: "Estrategia para medios tradicionales: PR, alianzas, eventos y posicionamiento público", included: true },
          { text: "Posicionamiento: de 'centro de transformación' a 'referente profesional del potencial humano'", included: true },
          { text: "Resolución de problemas operativos con tu equipo en tiempo real", included: true },
          { text: "Marketing de adopción: nos aseguramos de que tu comunidad abrace el cambio", included: true },
          { text: "6 meses de sesiones estratégicas hasta que el sistema corra solo", included: true },
        ],
        cta: "Agendar sesión estratégica",
        ctaStyle: "bg-violet-600 hover:bg-violet-500 text-white",
        recommendedNote: "Recomendamos este plan porque, sin contar gastos de viáticos, nos tiene al 100% involucrados en implementar, rediseñar y hacer funcionar. No estás solo — estamos dentro contigo.",
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
      "Actualizaciones de la app móvil (en paquete Elite)",
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
              <p className="text-xs text-muted-foreground mt-1">{lang === "en" ? "Price subject to final characteristics and follow-up agreements" : "Precio sujeto a características finales y acuerdos de seguimiento"}</p>
            </div>

            {/* Involvement indicators */}
            <div className={cn("flex items-center gap-3 mb-4 p-3 rounded-xl", pkg.highlight ? "bg-violet-500/10 border border-violet-500/20" : "bg-white/4 border border-white/8")}>
              <div className="flex items-center gap-1.5 text-xs font-semibold">
                <CalendarDays className={cn("w-3.5 h-3.5", pkg.highlight ? "text-violet-400" : "text-muted-foreground")} />
                <span className={pkg.highlight ? "text-violet-300" : "text-foreground/70"}>
                  {pkg.months} {lang === "en" ? "months" : "meses"}
                </span>
              </div>
              {pkg.weeklyHours && (
                <>
                  <span className="text-white/20">·</span>
                  <div className="flex items-center gap-1.5 text-xs font-semibold">
                    <Clock className="w-3.5 h-3.5 text-violet-400" />
                    <span className="text-violet-300">{pkg.weeklyHours}</span>
                  </div>
                </>
              )}
              {!pkg.weeklyHours && (
                <>
                  <span className="text-white/20">·</span>
                  <span className="text-xs text-muted-foreground">{lang === "en" ? "Remote support after launch" : "Soporte remoto post-lanzamiento"}</span>
                </>
              )}
            </div>

            <p className="text-sm text-foreground/80 leading-relaxed mb-5">{pkg.description}</p>

            <ul className="space-y-2.5 flex-1 mb-5">
              {pkg.features.map((f) => (
                <li key={f.text} className="flex items-start gap-2.5 text-sm">
                  <CheckCircle className={cn("w-4 h-4 mt-0.5 flex-shrink-0", f.included ? (pkg.highlight ? "text-violet-400" : "text-green-400") : "text-white/15")} />
                  <span className={cn("leading-snug", f.included ? "text-foreground" : "text-muted-foreground/40 line-through")}>{f.text}</span>
                </li>
              ))}
            </ul>

            <p className="text-[11px] text-muted-foreground italic mb-5">{pkg.followUp}</p>

            {/* Recommended callout — Elite only */}
            {pkg.recommendedNote && (
              <div className="flex items-start gap-2.5 mb-5 p-3.5 rounded-xl bg-violet-600/15 border border-violet-500/30">
                <Zap className="w-4 h-4 text-violet-400 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-violet-200 leading-relaxed">{pkg.recommendedNote}</p>
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

        <p className="text-xs text-muted-foreground mt-5 pt-4 border-t border-white/8">
          {c.priceNote}
        </p>
      </motion.div>
    </section>
  )
}
