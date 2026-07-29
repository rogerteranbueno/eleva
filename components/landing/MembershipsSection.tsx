"use client"

import { motion } from "framer-motion"
import { CheckCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { useLang } from "@/lib/i18n"

export function MembershipsSection() {
  const { lang } = useLang()

  const c = lang === "en" ? {
    eyebrow: "Memberships",
    h2: "Training is the door.\nMembership is the journey.",
    sub: "ELEVA helps you implement memberships at your center. You define the tiers, benefits and prices. The system manages access, billing and renewals automatically.",
    tiers: [
      {
        name: "Essential",
        note: "Included with enrollment",
        badge: null,
        highlight: false,
        color: "border-foreground/10",
        features: [
          { text: "Access to in-person training sessions", included: true },
          { text: "Missions and momentum app", included: true },
          { text: "Your generation's community", included: true },
          { text: "Base resource library", included: true },
          { text: "Free monthly webinars", included: true },
          { text: "Sessions with advanced coaches", included: false },
          { text: "Exclusive specialist webinars", included: false },
          { text: "Monthly 1:1 mentoring", included: false },
        ],
      },
      {
        name: "Expansion",
        note: "Recurring monthly membership",
        badge: "Most popular",
        highlight: true,
        color: "border-violet-500/50",
        features: [
          { text: "Everything in Essential", included: true },
          { text: "2 sessions/month with advanced coach", included: true },
          { text: "Exclusive specialist webinars", included: true },
          { text: "Personalized nutrition plan", included: true },
          { text: "Monthly financial advisory (30 min)", included: true },
          { text: "Access to premium library", included: true },
          { text: "Monthly 1:1 mentoring", included: false },
          { text: "Early access to new generations", included: false },
        ],
      },
      {
        name: "Mastery",
        note: "Premium recurring membership",
        badge: "Elite",
        highlight: false,
        color: "border-amber-500/40",
        features: [
          { text: "Everything in Expansion", included: true },
          { text: "Monthly 1:1 mentoring with specialist", included: true },
          { text: "Unlimited sessions with coaches", included: true },
          { text: "Comprehensive nutrition + finance plan", included: true },
          { text: "Early access to new generations", included: true },
          { text: "Mastery badge on public profile", included: true },
          { text: "Exclusive in-person event (annual)", included: true },
          { text: "Lifetime library access", included: true },
        ],
      },
    ],
    footer: "These are example tiers. Your center defines the names, benefits, and prices.",
  } : {
    eyebrow: "Membresías",
    h2: "El entrenamiento es la puerta.\nLa membresía es el viaje.",
    sub: "ELEVA te ayuda a implementar membresías en tu centro. Tú defines los tiers, los beneficios y los precios. El sistema gestiona el acceso, los cobros y las renovaciones automáticamente.",
    tiers: [
      {
        name: "Esencial",
        note: "Incluido con el enrolamiento",
        badge: null,
        highlight: false,
        color: "border-foreground/10",
        features: [
          { text: "Acceso a entrenamientos presenciales", included: true },
          { text: "App de misiones y momentum", included: true },
          { text: "Comunidad de tu generación", included: true },
          { text: "Biblioteca de recursos base", included: true },
          { text: "Webinars gratuitos mensuales", included: true },
          { text: "Sesiones con coaches avanzados", included: false },
          { text: "Webinars exclusivos de especialistas", included: false },
          { text: "Mentoría 1:1 mensual", included: false },
        ],
      },
      {
        name: "Expansión",
        note: "Membresía mensual recurrente",
        badge: "Más popular",
        highlight: true,
        color: "border-violet-500/50",
        features: [
          { text: "Todo lo de Esencial", included: true },
          { text: "2 sesiones/mes con coach avanzado", included: true },
          { text: "Webinars exclusivos de especialistas", included: true },
          { text: "Plan de nutrición personalizado", included: true },
          { text: "Asesoría financiera mensual (30 min)", included: true },
          { text: "Acceso a biblioteca premium", included: true },
          { text: "Mentoría 1:1 mensual", included: false },
          { text: "Acceso anticipado a nuevas generaciones", included: false },
        ],
      },
      {
        name: "Maestría",
        note: "Membresía premium recurrente",
        badge: "Elite",
        highlight: false,
        color: "border-amber-500/40",
        features: [
          { text: "Todo lo de Expansión", included: true },
          { text: "Mentoría 1:1 mensual con especialista", included: true },
          { text: "Sesiones ilimitadas con coaches", included: true },
          { text: "Plan integral nutrición + finanzas", included: true },
          { text: "Acceso anticipado a nuevas generaciones", included: true },
          { text: "Badge de Maestría en perfil público", included: true },
          { text: "Evento presencial exclusivo (anual)", included: true },
          { text: "Acceso vitalicio a biblioteca", included: true },
        ],
      },
    ],
    footer: "Estos son ejemplos de tiers. Tu centro define los nombres, beneficios y precios.",
  }

  return (
    <section className="px-6 py-20 max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-14"
      >
        <p className="text-xs uppercase tracking-widest text-cyan-400 font-semibold mb-4">{c.eyebrow}</p>
        <h2 className="text-4xl sm:text-5xl font-black text-foreground">
          {c.h2.split("\n").map((line, i) => (
            <span key={i}>{line}{i === 0 && <br className="hidden sm:block" />}</span>
          ))}
        </h2>
        <p className="text-muted-foreground mt-4 max-w-2xl mx-auto text-lg leading-relaxed">
          {c.sub}
        </p>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-5">
        {c.tiers.map((tier, i) => (
          <motion.div
            key={tier.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className={cn(
              "glass rounded-2xl p-6 border flex flex-col relative",
              tier.highlight ? "border-violet-500/50 bg-violet-600/5" : tier.color
            )}
          >
            {tier.badge && (
              <div className={cn(
                "absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-bold",
                tier.highlight ? "bg-violet-600 text-foreground" : "bg-amber-500 text-black"
              )}>
                {tier.badge}
              </div>
            )}
            <div className="mb-6">
              <p className="font-bold text-foreground text-lg">{tier.name}</p>
              <p className="text-xs text-muted-foreground mt-1">{tier.note}</p>
            </div>
            <ul className="space-y-2.5 flex-1">
              {tier.features.map((f) => (
                <li key={f.text} className="flex items-start gap-2 text-sm">
                  <CheckCircle className={cn("w-4 h-4 mt-0.5 flex-shrink-0", f.included ? "text-violet-400" : "text-foreground/15")} />
                  <span className={f.included ? "text-foreground" : "text-muted-foreground/40 line-through"}>{f.text}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="text-center text-sm text-muted-foreground mt-8"
      >
        {c.footer}
      </motion.p>
    </section>
  )
}
