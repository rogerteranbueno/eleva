"use client"

import { motion } from "framer-motion"
import { Star } from "lucide-react"
import { cn } from "@/lib/utils"
import { useLang } from "@/lib/i18n"

const TESTIMONIALS = [
  {
    quote: "Pasamos de 80 a 218 participantes activos en 8 meses. El sistema detectó 3 personas en riesgo que íbamos a perder. Las retuvimos. Solo ese mes ya pagó el año completo.",
    quoteEn: "We went from 80 to 218 active participants in 8 months. The system detected 3 at-risk people we were about to lose. We retained them. That one month alone paid for the full year.",
    name: "Carlos Mendoza",
    role: "Director General · Impacta MX",
    city: "Guadalajara",
    avatar: "CM",
    avatarColor: "bg-violet-700",
    metric: "+173% participantes",
    metricEn: "+173% participants",
    stars: 5,
  },
  {
    quote: "Antes perdíamos el 30% de los inscritos en el primer mes. Con el onboarding automatizado y el Momentum Score eso bajó a 8%. El ROI fue inmediato.",
    quoteEn: "We used to lose 30% of enrollees in the first month. With automated onboarding and the Momentum Score, that dropped to 8%. The ROI was immediate.",
    name: "Fernanda Ríos",
    role: "Co-fundadora · Centro Alfa",
    city: "Monterrey",
    avatar: "FR",
    avatarColor: "bg-cyan-700",
    metric: "Churn −22 puntos",
    metricEn: "Churn −22 points",
    stars: 5,
  },
  {
    quote: "Tenemos 3 sedes en 2 países. Antes necesitábamos 2 personas solo para coordinar. Ahora un panel nos da visibilidad total y operamos con la mitad del staff administrativo.",
    quoteEn: "We have 3 locations in 2 countries. Before, we needed 2 people just to coordinate. Now one panel gives us full visibility and we operate with half the admin staff.",
    name: "Andrés Vidal",
    role: "Fundador · Vía Expansión",
    city: "Buenos Aires",
    avatar: "AV",
    avatarColor: "bg-emerald-700",
    metric: "3 sedes · 1 panel",
    metricEn: "3 locations · 1 panel",
    stars: 5,
  },
]

export function TestimonialsSection() {
  const { lang } = useLang()

  const c = lang === "en" ? {
    badge: "05 · Real cases",
    h2a: "The growth",
    h2b: "speaks for itself.",
  } : {
    badge: "05 · Casos reales",
    h2a: "El crecimiento",
    h2b: "habla por sí solo.",
  }

  return (
    <section className="section-b relative py-20">
      <div className="section-rule absolute top-0 left-0 right-0" />
      <div className="max-w-5xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10"
        >
          <div className="flex items-center gap-3 mb-4">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-violet-400 bg-violet-500/10 border border-violet-500/20 px-2.5 py-1 rounded-full">{c.badge}</span>
          </div>
          <h2 className="text-5xl sm:text-6xl font-black text-foreground leading-[1.05]">
            {c.h2a}<br />{c.h2b}
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass rounded-2xl p-6 flex flex-col gap-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex gap-0.5">
                  {Array.from({ length: t.stars }).map((_, s) => (
                    <Star key={s} className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-violet-500/15 border border-violet-500/25 text-violet-400 font-semibold">
                  {lang === "en" ? t.metricEn : t.metric}
                </span>
              </div>
              <p className="text-sm text-foreground/80 leading-relaxed flex-1">
                &ldquo;{lang === "en" ? t.quoteEn : t.quote}&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div className={cn("w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0", t.avatarColor)}>
                  {t.avatar}
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role} · {t.city}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
