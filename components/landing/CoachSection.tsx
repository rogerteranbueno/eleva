"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Star, Clock, ArrowRight, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import { useLang } from "@/lib/i18n"

const coaches = [
  {
    name: "Laura Medina",
    specialty: "Finanzas personales",
    specialtyEn: "Personal finance",
    badge: "Especialista",
    badgeEn: "Specialist",
    rating: 4.9,
    sessions: 312,
    price: 65,
    avatar: "LM",
    color: "from-violet-600 to-violet-800",
    tags: ["Presupuesto", "Inversiones", "Deuda"],
    tagsEn: ["Budget", "Investments", "Debt"],
  },
  {
    name: "Carlos Reyes",
    specialty: "Nutrición & rendimiento",
    specialtyEn: "Nutrition & performance",
    badge: "Certificado",
    badgeEn: "Certified",
    rating: 4.8,
    sessions: 204,
    price: 50,
    avatar: "CR",
    color: "from-emerald-600 to-emerald-800",
    tags: ["Plan alimenticio", "Hábitos", "Energía"],
    tagsEn: ["Meal plan", "Habits", "Energy"],
  },
  {
    name: "Sofía Herrera",
    specialty: "Psicología positiva",
    specialtyEn: "Positive psychology",
    badge: "Especialista",
    badgeEn: "Specialist",
    rating: 5.0,
    sessions: 189,
    price: 75,
    avatar: "SH",
    color: "from-pink-600 to-pink-800",
    tags: ["Ansiedad", "Relaciones", "Autoestima"],
    tagsEn: ["Anxiety", "Relationships", "Self-esteem"],
  },
  {
    name: "Miguel Ángel Torres",
    specialty: "Negocios & emprendimiento",
    specialtyEn: "Business & entrepreneurship",
    badge: "Mentor",
    badgeEn: "Mentor",
    rating: 4.7,
    sessions: 276,
    price: 90,
    avatar: "MT",
    color: "from-amber-600 to-amber-800",
    tags: ["Ventas", "Escalabilidad", "Liderazgo"],
    tagsEn: ["Sales", "Scalability", "Leadership"],
  },
]

export function CoachSection() {
  const { lang } = useLang()

  const c = lang === "en" ? {
    eyebrow: "Professional network",
    h2: "You already have the professionals.\nJust missing the platform.",
    sub1: "Most centers don't know what their participants are achieving, or who in their community could become a coach, lead a masterclass, or contribute from their specialty. Without visibility, there's no recurring revenue, no professional appeal, no internal growth.",
    sub2: "ELEVA gives them a verified platform where",
    sub2Em: "nutritionists, coaches, psychologists and specialists from your community",
    sub2End: " contribute through webinars, masterclasses and consulting — and you, as a center, gain recurring revenue, credibility, and a self-sustaining professional ecosystem.",
    bookBtn: "Book a session",
    coachCTA: "Are you a coach or specialist?",
    coachCTASub: "Join the ELEVA network and get clients from verified centers without investing in marketing. You charge directly — we just connect.",
    coachCTABtn: "Apply now",
    sessionsLabel: "sessions",
    currency: "USD/hr",
  } : {
    eyebrow: "Red de profesionales",
    h2: "Ya tienes los profesionales.\nSolo faltaba la plataforma.",
    sub1: "La mayoría de los centros no sabe lo que sus participantes están logrando, ni quién en su comunidad podría convertirse en coach, dar una masterclass o aportar desde su especialidad. Sin visibilidad, no hay recurrencia, no hay convocatoria profesional, no hay crecimiento interno.",
    sub2: "ELEVA les da una plataforma verificada donde",
    sub2Em: "nutriólogos, coaches, psicólogos y especialistas de tu comunidad",
    sub2End: " aportan valor a través de webinars, masterclasses y asesorías, y tú, como centro, ganas recurrencia, credibilidad y un ecosistema profesional que se retroalimenta solo.",
    bookBtn: "Reservar sesión",
    coachCTA: "¿Eres coach o especialista?",
    coachCTASub: "Únete a la red de ELEVA y consigue clientes de centros verificados sin invertir en marketing. Tú cobras directo, nosotros solo conectamos.",
    coachCTABtn: "Aplicar ahora",
    sessionsLabel: "sesiones",
    currency: "USD/hr",
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
          {c.h2.split("\n").map((line, i) => (
            <span key={i}>{line}{i === 0 && <br className="hidden sm:block" />}</span>
          ))}
        </h2>
        <p className="text-foreground/70 mt-4 max-w-2xl mx-auto text-lg leading-relaxed">
          {c.sub1}
        </p>
        <p className="text-foreground/80 mt-4 max-w-2xl mx-auto text-base leading-relaxed">
          {c.sub2}{" "}
          <span className="text-foreground font-semibold">{c.sub2Em}</span>
          {c.sub2End}
        </p>
      </motion.div>

      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        {coaches.map((coach, i) => (
          <motion.div
            key={coach.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className="glass rounded-2xl p-5 hover:border-violet-500/30 transition-all group"
          >
            <div className="flex items-start gap-4">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${coach.color} flex items-center justify-center flex-shrink-0`}>
                <span className="text-white font-black text-sm">{coach.avatar}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-bold text-foreground">{coach.name}</p>
                  <span className="text-[10px] bg-violet-600/20 text-violet-300 border border-violet-600/30 rounded-full px-2 py-0.5 font-semibold">
                    {lang === "en" ? coach.badgeEn : coach.badge}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mt-0.5">
                  {lang === "en" ? coach.specialtyEn : coach.specialty}
                </p>
                <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Star className="w-3 h-3 text-amber-400 fill-amber-400" />{coach.rating}</span>
                  <span>{coach.sessions} {c.sessionsLabel}</span>
                  <span className="ml-auto text-foreground font-bold">${coach.price.toLocaleString()} {c.currency}</span>
                </div>
                <div className="flex gap-1.5 mt-3 flex-wrap">
                  {(lang === "en" ? coach.tagsEn : coach.tags).map((t) => (
                    <span key={t} className="text-[10px] bg-white/5 text-muted-foreground rounded-full px-2 py-0.5">{t}</span>
                  ))}
                </div>
              </div>
            </div>
            <button className="mt-4 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/5 hover:bg-violet-600/20 border border-white/10 hover:border-violet-500/40 text-sm text-foreground font-semibold transition-all">
              <Clock className="w-3.5 h-3.5" />
              {c.bookBtn}
            </button>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="glass rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left"
      >
        <div className="w-12 h-12 rounded-xl bg-violet-600/20 border border-violet-600/30 flex items-center justify-center flex-shrink-0">
          <Sparkles className="w-5 h-5 text-violet-400" />
        </div>
        <div className="flex-1">
          <p className="font-bold text-foreground text-lg">{c.coachCTA}</p>
          <p className="text-sm text-muted-foreground mt-0.5">{c.coachCTASub}</p>
        </div>
        <Link
          href="/demo/pulso"
          className="flex-shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold transition-colors"
        >
          {c.coachCTABtn} <ArrowRight className="w-4 h-4" />
        </Link>
      </motion.div>
    </section>
  )
}
