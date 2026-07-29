"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ChevronRight } from "lucide-react"
import { useLang } from "@/lib/i18n"

export function BuildSection() {
  const { lang } = useLang()

  const c = lang === "en" ? {
    timeLabel: "3 minutes",
    h2: "Build your own system",
    sub: "Answer 4 simple questions and ELEVA shows you exactly what you need to acquire, activate, retain and scale. With your design, your brand and optimized for AEO + SEO.",
    modules: ["Acquire", "Activate", "Retain", "Scale"],
    cta: "Start now, free",
    questions: [
      { n: "01", q: "How many participants do you have?" },
      { n: "02", q: "What is your biggest challenge?" },
      { n: "03", q: "How do you manage things today?" },
      { n: "04", q: "What is your 12-month goal?" },
    ],
    resultLabel: "Your personalized system",
  } : {
    timeLabel: "3 minutos",
    h2: "Construye tu propio sistema",
    sub: "Responde 4 preguntas sencillas y ELEVA te muestra exactamente qué necesitas para adquirir, activar, retener y escalar. Con tu diseño, tu marca y optimizado en AEO + SEO.",
    modules: ["Adquirir", "Activar", "Retener", "Escalar"],
    cta: "Empezar ahora, gratis",
    questions: [
      { n: "01", q: "¿Cuántos participantes tienes?" },
      { n: "02", q: "¿Cuál es tu mayor desafío?" },
      { n: "03", q: "¿Cómo gestionas hoy?" },
      { n: "04", q: "¿Cuál es tu meta a 12 meses?" },
    ],
    resultLabel: "Tu sistema personalizado",
  }

  return (
    <section className="px-6 py-16 max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative overflow-hidden rounded-3xl border border-foreground/8 bg-gradient-to-br from-white/3 to-violet-600/5 p-10"
      >
        <div className="absolute -right-20 -top-20 w-72 h-72 rounded-full bg-violet-600/10 blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 md:gap-12">
          <div className="flex-1 text-center md:text-left">
            <p className="text-xs uppercase tracking-widest text-violet-400 font-semibold mb-3">{c.timeLabel}</p>
            <h2 className="text-3xl sm:text-4xl font-black text-foreground leading-tight mb-4">
              {c.h2}
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6 max-w-md mx-auto md:mx-0">
              {c.sub}
            </p>
            <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-8">
              {c.modules.map((m) => (
                <span key={m} className="px-3 py-1 rounded-full text-xs font-semibold border border-foreground/10 text-muted-foreground">
                  {m}
                </span>
              ))}
            </div>
            <Link href="/build">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-violet-600 hover:bg-violet-700 text-foreground rounded-xl text-sm font-bold transition-colors shadow-lg shadow-violet-600/25"
              >
                {c.cta}
                <ChevronRight className="w-4 h-4" />
              </motion.button>
            </Link>
          </div>
          <div className="flex-shrink-0 w-full max-w-xs space-y-2.5">
            {c.questions.map(({ n, q }) => (
              <div key={n} className="flex items-center gap-3 p-3 rounded-xl bg-foreground/3 border border-foreground/6">
                <span className="text-[10px] font-black text-violet-400 w-6 flex-shrink-0">{n}</span>
                <span className="text-xs text-muted-foreground">{q}</span>
                <div className="ml-auto w-4 h-4 rounded-full border border-foreground/10 flex-shrink-0" />
              </div>
            ))}
            <div className="flex items-center gap-3 p-3 rounded-xl bg-violet-600/15 border border-violet-500/30">
              <span className="text-[10px] font-black text-violet-400 w-6 flex-shrink-0">✦</span>
              <span className="text-xs text-violet-300 font-medium">{c.resultLabel}</span>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
