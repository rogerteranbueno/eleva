"use client"

import { motion } from "framer-motion"
import { useLang } from "@/lib/i18n"

export function ProblemSection() {
  const { lang } = useLang()

  const c = lang === "en" ? {
    eyebrow: "The problem",
    h2: "Your center operates the same way it did 20 years ago.",
    statLabel: "of centers don't know who is losing momentum until they've already left. Does this sound familiar?",
    items: [
      "Enrollments come in through WhatsApp",
      "The participant file is an Excel spreadsheet",
      "Post-training follow-up depends on the coach's judgment",
      "Communication is group chats with 200 people nobody can manage",
      "You don't know who is advancing and who is falling behind until it's too late",
      "Growth depends almost entirely on the last generation enrolling well",
    ],
    closing: "The methodology evolved. ",
    closingEm: "The technology didn't.",
  } : {
    eyebrow: "El problema",
    h2: "Tu centro opera igual que hace 20 años.",
    statLabel: "de los centros no sabe quién está perdiendo momentum hasta que ya abandonó. ¿Te suena esto familiar?",
    items: [
      "Las inscripciones llegan por WhatsApp",
      "El expediente del participante es una hoja de Excel",
      "El seguimiento post-entrenamiento depende del criterio del coach",
      "La comunicación son grupos con 200 personas que nadie puede gestionar",
      "No sabes quién está avanzando y quién se está perdiendo hasta que ya es tarde",
      "El crecimiento depende casi por completo de que la última generación enrole bien",
    ],
    closing: "La metodología evolucionó. ",
    closingEm: "La tecnología no.",
  }

  return (
    <section className="px-6 py-16 max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <p className="text-xs uppercase tracking-widest text-violet-400 font-semibold mb-4">{c.eyebrow}</p>
        <h2 className="text-4xl sm:text-5xl font-black text-foreground mb-6">
          {c.h2}
        </h2>
        <div className="inline-flex items-center gap-3 px-5 py-3 rounded-2xl bg-red-500/8 border border-red-500/20 mb-4">
          <span className="text-3xl font-black text-red-400">63%</span>
          <p className="text-sm text-foreground/80 text-left leading-snug">
            {c.statLabel}
          </p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-12">
        {c.items.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className="flex items-start gap-3 glass rounded-xl p-4"
          >
            <div className="w-2 h-2 rounded-full bg-red-400 flex-shrink-0 mt-1.5" />
            <p className="text-sm text-foreground leading-relaxed">{item}</p>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative text-center py-8 px-6 rounded-2xl border border-foreground/8 bg-foreground/2"
      >
        <p className="text-2xl sm:text-3xl font-black text-foreground leading-snug">
          {c.closing}
          <span className="gradient-text">{c.closingEm}</span>
        </p>
      </motion.div>
    </section>
  )
}
