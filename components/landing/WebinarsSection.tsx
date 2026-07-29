"use client"

import { motion } from "framer-motion"
import { Globe, Crown, Video, Users, Play, Lock } from "lucide-react"
import { cn } from "@/lib/utils"
import { useLang } from "@/lib/i18n"

const upcomingES = [
  {
    title: "Cómo salir de deudas sin sacrificar tu calidad de vida",
    host: "Laura Medina · Coach financiero",
    date: "Jue 12 jun · 7:00 PM",
    type: "publico" as const,
    spots: 48,
    attended: 203,
  },
  {
    title: "Nutrición para personas que odian las dietas",
    host: "Carlos Reyes · Nutriólogo",
    date: "Mar 17 jun · 6:30 PM",
    type: "publico" as const,
    spots: 62,
    attended: 0,
  },
  {
    title: "Conversaciones difíciles: cómo decir lo que necesitas",
    host: "Sofía Herrera · Psicóloga",
    date: "Mié 25 jun · 8:00 PM",
    type: "miembros" as const,
    spots: 30,
    attended: 0,
  },
  {
    title: "Mentoría grupal: cierra tus compromisos del mes",
    host: "Ana Reyes · Coach Gen. Omega",
    date: "Sáb 28 jun · 10:00 AM",
    type: "miembros" as const,
    spots: 20,
    attended: 0,
  },
]

const upcomingEN = [
  {
    title: "How to get out of debt without sacrificing your quality of life",
    host: "Laura Medina · Financial coach",
    date: "Thu Jun 12 · 7:00 PM",
    type: "public" as const,
    spots: 48,
    attended: 203,
  },
  {
    title: "Nutrition for people who hate diets",
    host: "Carlos Reyes · Nutritionist",
    date: "Tue Jun 17 · 6:30 PM",
    type: "public" as const,
    spots: 62,
    attended: 0,
  },
  {
    title: "Hard conversations: how to say what you need",
    host: "Sofía Herrera · Psychologist",
    date: "Wed Jun 25 · 8:00 PM",
    type: "members" as const,
    spots: 30,
    attended: 0,
  },
  {
    title: "Group mentoring: close your commitments for the month",
    host: "Ana Reyes · Coach Gen. Omega",
    date: "Sat Jun 28 · 10:00 AM",
    type: "members" as const,
    spots: 20,
    attended: 0,
  },
]

export function WebinarsSection() {
  const { lang } = useLang()

  const c = lang === "en" ? {
    eyebrow: "Webinars",
    h2a: "Free to attract.",
    h2b: "Exclusive to retain.",
    sub: "Public webinars fill the lead funnel at zero ad spend. Members-only webinars create reasons to stay, and to pay the monthly membership.",
    publicLabel: "Public",
    membersLabel: "Members only",
    spotsLabel: "spots available",
    attendedSuffix: "attended",
    watchBtn: "Watch recording",
    registerBtn: "Register",
    features: [
      { title: "Public webinars", desc: "Turn strangers into qualified leads with high-value content, no paid advertising.", color: "border-emerald-500/20" },
      { title: "Members webinars", desc: "Exclusive content that justifies the monthly membership and deepens participant commitment.", color: "border-violet-500/20" },
      { title: "Recordings always available", desc: "Everything stays in the participant's library so they can revisit topics when they need them.", color: "border-cyan-500/20" },
    ],
  } : {
    eyebrow: "Webinars",
    h2a: "Gratuitos para atraer.",
    h2b: "Exclusivos para retener.",
    sub: "Los webinars públicos llenan el embudo de leads sin costo publicitario. Los webinars para miembros crean razones para quedarse, y para pagar la membresía mes a mes.",
    publicLabel: "Público",
    membersLabel: "Solo miembros",
    spotsLabel: "cupos disponibles",
    attendedSuffix: "asistieron",
    watchBtn: "Ver grabación",
    registerBtn: "Registrarse",
    features: [
      { title: "Webinars públicos", desc: "Convierte desconocidos en leads calificados con contenido de alto valor, sin publicidad pagada.", color: "border-emerald-500/20" },
      { title: "Webinars de miembros", desc: "Contenido exclusivo que justifica la membresía mensual y profundiza el compromiso del participante.", color: "border-violet-500/20" },
      { title: "Grabaciones siempre disponibles", desc: "Todo queda en la biblioteca del participante para que retome temas cuando los necesite.", color: "border-cyan-500/20" },
    ],
  }

  const upcoming = lang === "en" ? upcomingEN : upcomingES

  // Normalize type label for color picking
  const isPublic = (type: string) => type === "publico" || type === "public"

  return (
    <section className="px-6 py-20 max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-14"
      >
        <p className="text-xs uppercase tracking-widest text-emerald-400 font-semibold mb-4">{c.eyebrow}</p>
        <h2 className="text-4xl sm:text-5xl font-black text-foreground">
          {c.h2a}<br className="hidden sm:block" /> {c.h2b}
        </h2>
        <p className="text-muted-foreground mt-4 max-w-2xl mx-auto text-lg leading-relaxed">
          {c.sub}
        </p>
      </motion.div>

      <div className="grid sm:grid-cols-2 gap-4 mb-10">
        {upcoming.map((w, i) => (
          <motion.div
            key={w.title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className={cn(
              "glass rounded-2xl p-5 border transition-all hover:border-opacity-60",
              isPublic(w.type) ? "border-emerald-500/20 hover:border-emerald-500/40" : "border-violet-500/20 hover:border-violet-500/40"
            )}
          >
            <div className="flex items-start justify-between gap-3 mb-3">
              <span className={cn(
                "text-[10px] font-bold px-2.5 py-1 rounded-full border flex items-center gap-1",
                isPublic(w.type)
                  ? "bg-emerald-600/15 text-emerald-400 border-emerald-600/30"
                  : "bg-violet-600/15 text-violet-400 border-violet-600/30"
              )}>
                {isPublic(w.type)
                  ? <><Globe className="w-2.5 h-2.5" /> {c.publicLabel}</>
                  : <><Lock className="w-2.5 h-2.5" /> {c.membersLabel}</>
                }
              </span>
              <span className="text-[10px] text-muted-foreground">{w.date}</span>
            </div>
            <h3 className="font-bold text-foreground text-sm leading-snug mb-1">{w.title}</h3>
            <p className="text-xs text-muted-foreground mb-4">{w.host}</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Users className="w-3.5 h-3.5" />
                {w.attended > 0 ? `${w.attended} ${c.attendedSuffix}` : `${w.spots} ${c.spotsLabel}`}
              </div>
              <button className={cn(
                "flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all",
                isPublic(w.type)
                  ? "bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-600/30"
                  : "bg-violet-600/20 hover:bg-violet-600/30 text-violet-300 border border-violet-600/30"
              )}>
                {w.attended > 0 ? <><Play className="w-3 h-3" /> {c.watchBtn}</> : <><Video className="w-3 h-3" /> {c.registerBtn}</>}
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="grid sm:grid-cols-3 gap-4"
      >
        {c.features.map((item, idx) => {
          const icons = [
            <Globe key="globe" className="w-5 h-5 text-emerald-400" />,
            <Crown key="crown" className="w-5 h-5 text-violet-400" />,
            <Video key="video" className="w-5 h-5 text-cyan-400" />,
          ]
          return (
            <div key={item.title} className={cn("glass rounded-xl p-5 border", item.color)}>
              <div className="mb-3">{icons[idx]}</div>
              <p className="font-bold text-foreground text-sm mb-1">{item.title}</p>
              <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
            </div>
          )
        })}
      </motion.div>
    </section>
  )
}
