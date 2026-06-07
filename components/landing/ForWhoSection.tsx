"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Building2, Activity, Users, Globe, ArrowRight } from "lucide-react"
import { useLang } from "@/lib/i18n"

export function ForWhoSection() {
  const { lang } = useLang()

  const c = lang === "en" ? {
    badge: "01 · Who it's for",
    h2a: "Already powerful in the room. ",
    h2b: "ELEVA makes them powerful outside it.",
    profiles: [
      { title: "Founders and directors", desc: "With 50 to 2,000 active participants who want to operate with clarity and scale" },
      { title: "Phase-based model centers", desc: "Basic → Advanced → Path. The model ELEVA understands by design" },
      { title: "Coach academies", desc: "That certify other trainers and need scalable structure" },
      { title: "Multi-city centers", desc: "With presence in multiple cities that today operate as separate islands" },
    ],
    stat: "40+",
    statDesc: "transformation centers already operate with ELEVA in Latin America, from 80 participants up to 2,000 active.",
    cta: "See the system in action",
  } : {
    badge: "01 · Para quién es",
    h2a: "Ya son poderosos en sala. ",
    h2b: "ELEVA los hace serlo afuera.",
    profiles: [
      { title: "Fundadores y directores", desc: "Con 50 a 2,000 participantes activos que quieren operar con claridad y escala" },
      { title: "Centros con modelo de fases", desc: "Básico → Avanzado → Vía. El modelo que ELEVA entiende por diseño" },
      { title: "Academias de coaches", desc: "Que certifican a otros entrenadores y necesitan estructura escalable" },
      { title: "Centros multi-ciudad", desc: "Con presencia en varias ciudades que hoy operan como islas separadas" },
    ],
    stat: "40+",
    statDesc: "centros de transformación ya operan con ELEVA en Latinoamérica, de 80 participantes hasta 2,000 activos.",
    cta: "Ver el sistema en acción",
  }

  const icons = [
    <Building2 className="w-5 h-5" key="building" />,
    <Activity className="w-5 h-5" key="activity" />,
    <Users className="w-5 h-5" key="users" />,
    <Globe className="w-5 h-5" key="globe" />,
  ]

  return (
    <section className="section-b relative py-20">
      <div className="section-rule absolute top-0 left-0 right-0" />
      <div className="max-w-5xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-4">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-violet-400 bg-violet-500/10 border border-violet-500/20 px-2.5 py-1 rounded-full">{c.badge}</span>
          </div>
          <h2 className="text-5xl sm:text-6xl font-black text-foreground leading-[1.05]">
            {c.h2a}
            <span className="gradient-text">{c.h2b}</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {c.profiles.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="glass rounded-xl p-5 flex items-start gap-4"
            >
              <div className="w-10 h-10 rounded-xl bg-violet-600/20 flex items-center justify-center text-violet-400 flex-shrink-0">
                {icons[i]}
              </div>
              <div>
                <h3 className="font-bold text-foreground">{p.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{p.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4 glass rounded-2xl px-6 py-5 border border-violet-500/20"
        >
          <div className="flex items-center gap-4 text-center sm:text-left">
            <p className="text-4xl font-black text-violet-400 flex-shrink-0">{c.stat}</p>
            <p className="text-sm text-foreground/80">{c.statDesc}</p>
          </div>
          <Link href="/demo/pulso" className="flex-shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm font-bold transition-colors whitespace-nowrap">
            {c.cta} <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
