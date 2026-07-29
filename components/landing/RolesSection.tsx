"use client"

import { motion } from "framer-motion"
import { BarChart3, Users, Heart, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { useLang } from "@/lib/i18n"

export function RolesSection() {
  const { lang } = useLang()

  const c = lang === "en" ? {
    eyebrow: "For every role",
    h2: "One system for everyone.",
    roles: [
      {
        title: "The owner sees",
        color: "violet" as const,
        items: [
          "Center health in real time",
          "At-risk participants with automatic alerts",
          "Phase-to-phase conversion",
          "Performance by coach",
          "Business KPIs: revenue, retention, NPS",
          "Active campaigns and pending payments",
        ],
      },
      {
        title: "The coach sees",
        color: "cyan" as const,
        items: [
          "Their cohorts and the status of each one",
          "Their participants with Momentum Score",
          "Who needs urgent intervention today",
          "Notes history and activity per person",
          "Event calendar for their groups",
          "Tools to activate participants in one click",
        ],
      },
      {
        title: "The participant lives",
        color: "pink" as const,
        items: [
          "Live feed from their community and coach",
          "Their missions and weekly commitments",
          "Their Momentum Score and personal streak",
          "Their tribe: the cohort as a real community",
          "Specialists connected to their life goals",
          "Visible progress in their process",
        ],
      },
    ],
  } : {
    eyebrow: "Para cada rol",
    h2: "Un sistema para todos.",
    roles: [
      {
        title: "El dueño ve",
        color: "violet" as const,
        items: [
          "Salud del centro en tiempo real",
          "Participantes en riesgo con alertas automáticas",
          "Conversión fase a fase",
          "Performance por coach",
          "KPIs de negocio: ingresos, retención, NPS",
          "Campañas activas y pagos pendientes",
        ],
      },
      {
        title: "El coach ve",
        color: "cyan" as const,
        items: [
          "Sus cohortes y el estado de cada una",
          "Sus participantes con Momentum Score",
          "Quién necesita intervención urgente hoy",
          "Historial de notas y actividad por persona",
          "Calendario de eventos de sus grupos",
          "Herramientas para activar participantes en un clic",
        ],
      },
      {
        title: "El participante vive",
        color: "pink" as const,
        items: [
          "Feed vivo de su comunidad y coach",
          "Sus misiones y compromisos semanales",
          "Su Momentum Score y racha personal",
          "Su tribu: la cohorte como comunidad real",
          "Especialistas conectados a sus objetivos de vida",
          "Progreso visible en su proceso",
        ],
      },
    ],
  }

  const icons = [
    <BarChart3 key="bar" className="w-6 h-6 text-violet-400" />,
    <Users key="users" className="w-6 h-6 text-cyan-400" />,
    <Heart key="heart" className="w-6 h-6 text-pink-400" />,
  ]

  return (
    <section className="px-6 py-16 max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <p className="text-xs uppercase tracking-widest text-violet-400 font-semibold mb-4">{c.eyebrow}</p>
        <h2 className="text-4xl sm:text-5xl font-black text-foreground">{c.h2}</h2>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {c.roles.map((role, i) => (
          <motion.div
            key={role.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="glass rounded-2xl p-5 space-y-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-foreground/5 flex items-center justify-center">
                {icons[i]}
              </div>
              <h3 className="font-bold text-foreground">{role.title}</h3>
            </div>
            <ul className="space-y-2">
              {role.items.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm">
                  <ChevronRight className={cn(
                    "w-3.5 h-3.5 flex-shrink-0 mt-0.5",
                    role.color === "violet" ? "text-violet-400"
                    : role.color === "cyan" ? "text-cyan-400"
                    : "text-pink-400"
                  )} />
                  <span className="text-foreground/80">{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
