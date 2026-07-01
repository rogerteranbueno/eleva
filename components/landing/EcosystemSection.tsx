"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { useLang } from "@/lib/i18n"

export function EcosystemSection() {
  const { lang } = useLang()

  const c = lang === "en" ? {
    badge: "06 · The ecosystem",
    h2a: "Your community already",
    h2b: "has the best.",
    sub: "Your community already has nutritionists, financial coaches, psychologists and top-tier specialists. ELEVA incorporates them into a verified system:",
    subEm: "you validate the quality of their service, they gain visibility",
    subEnd: " and your participants access a real value network connected to their life goals.",
    specialists: [
      { icon: "🥗", title: "Nutritionists", desc: "For health and wellness commitments" },
      { icon: "🧠", title: "Psychologists", desc: "For relationships and mental health" },
      { icon: "💰", title: "Financial coaches", desc: "For independence and money" },
      { icon: "💑", title: "Couples therapists", desc: "For relationship commitments" },
      { icon: "🚀", title: "Business coaches", desc: "For professional commitments" },
      { icon: "📚", title: "Online courses", desc: "Content library by phase" },
      { icon: "🎥", title: "Live webinars", desc: "Public to attract, private to retain" },
      { icon: "🤝", title: "Alumni network", desc: "Active graduates, ambassadors, mentors" },
    ],
    statVal: "+60%",
    statDesc: "more retention when participants have access to external specialists connected to their life goals.",
    cta: "Explore specialists",
  } : {
    badge: "06 · El ecosistema",
    h2a: "Tu comunidad ya",
    h2b: "tiene los mejores.",
    sub: "En tu comunidad ya hay nutriólogos, coaches financieros, psicólogos y especialistas de primer nivel. ELEVA los incorpora a un sistema verificado:",
    subEm: "tú validas la calidad de su servicio, ellos ganan visibilidad",
    subEnd: " y tus participantes acceden a una red de valor real conectada a sus objetivos de vida.",
    specialists: [
      { icon: "🥗", title: "Nutriólogos", desc: "Para compromisos de salud y bienestar" },
      { icon: "🧠", title: "Psicólogos", desc: "Para relaciones y salud mental" },
      { icon: "💰", title: "Coaches financieros", desc: "Para independencia y dinero" },
      { icon: "💑", title: "Terapeutas de pareja", desc: "Para compromisos de vida amorosa" },
      { icon: "🚀", title: "Coaches de negocios", desc: "Para compromisos profesionales" },
      { icon: "📚", title: "Cursos online", desc: "Biblioteca de contenido por fase" },
      { icon: "🎥", title: "Webinars en vivo", desc: "Abiertos para atraer, privados para retener" },
      { icon: "🤝", title: "Red de alumni", desc: "Egresados activos, embajadores, mentores" },
    ],
    statVal: "+60%",
    statDesc: "más retención cuando el participante tiene acceso a especialistas externos conectados a sus objetivos de vida.",
    cta: "Explorar especialistas",
  }

  return (
    <section className="section-a relative py-20">
      <div className="section-rule absolute top-0 left-0 right-0" />
      <div className="max-w-5xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-4">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2.5 py-1 rounded-full">{c.badge}</span>
          </div>
          <h2 className="text-5xl sm:text-6xl font-black text-foreground leading-[1.05]">{c.h2a}<br />{c.h2b}</h2>
          <p className="text-foreground/80 mt-4 max-w-2xl text-base leading-relaxed">
            {c.sub}{" "}
            <span className="text-foreground font-medium">{c.subEm}</span>
            {c.subEnd}
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {c.specialists.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="glass rounded-xl p-4 text-center space-y-2 hover:border-violet-500/30 transition-colors"
            >
              <div className="text-3xl">{s.icon}</div>
              <p className="font-semibold text-foreground text-sm">{s.title}</p>
              <p className="text-xs text-muted-foreground leading-snug">{s.desc}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 glass rounded-2xl px-6 py-5 border border-green-500/20"
        >
          <div className="flex items-center gap-4 text-center sm:text-left">
            <p className="text-4xl font-black text-green-400 flex-shrink-0">{c.statVal}</p>
            <p className="text-sm text-foreground/80">{c.statDesc}</p>
          </div>
          <Link href="/vl2026/especialistas" className="flex-shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-xl border border-green-500/40 hover:bg-green-500/10 text-green-300 text-sm font-bold transition-colors whitespace-nowrap">
            {c.cta} <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
