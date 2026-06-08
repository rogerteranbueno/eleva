"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, Users, Zap, Heart, TrendingUp } from "lucide-react"
import { useLang } from "@/lib/i18n"

export function BuildTeaserSection() {
  const { lang } = useLang()

  const c = lang === "en" ? {
    eyebrow: "Free diagnosis",
    h2: "Which system does your center need?",
    sub: "4 questions. 2 minutes. We show you exactly which modules to activate first based on your size, your biggest challenge, and your 12-month goal.",
    questions: [
      { icon: Users,     q: "How many active participants do you have today?" },
      { icon: Zap,       q: "What is your biggest operational challenge?" },
      { icon: Heart,     q: "How do you manage your center today?" },
      { icon: TrendingUp,q: "What is your goal for the next 12 months?" },
    ],
    result: "→ Personalized module map + recommended implementation plan",
    cta: "Start free diagnosis",
    note: "No registration · No commitment · 2 minutes",
  } : {
    eyebrow: "Diagnóstico gratuito",
    h2: "¿Qué sistema necesita tu centro?",
    sub: "4 preguntas. 2 minutos. Te mostramos exactamente qué módulos activar primero según tu tamaño, tu mayor desafío y tu meta a 12 meses.",
    questions: [
      { icon: Users,      q: "¿Cuántos participantes activos tienes hoy?" },
      { icon: Zap,        q: "¿Cuál es tu mayor desafío operativo?" },
      { icon: Heart,      q: "¿Cómo gestionas tu centro hoy?" },
      { icon: TrendingUp, q: "¿Cuál es tu meta a los próximos 12 meses?" },
    ],
    result: "→ Mapa de módulos personalizado + plan de implementación recomendado",
    cta: "Iniciar diagnóstico gratuito",
    note: "Sin registro · Sin compromiso · 2 minutos",
  }

  return (
    <section className="section-b relative py-20 overflow-hidden">
      <div className="section-rule absolute top-0 left-0 right-0" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,rgba(124,58,237,0.07),transparent)] pointer-events-none" />

      <div className="relative max-w-5xl mx-auto px-6">
        <div className="glass-violet rounded-3xl p-8 sm:p-12 border border-violet-500/20">
          <div className="grid md:grid-cols-2 gap-10 items-center">

            {/* Left — copy */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-5"
            >
              <span className="inline-block text-[10px] font-black uppercase tracking-[0.2em] text-violet-400 bg-violet-500/10 border border-violet-500/20 px-3 py-1.5 rounded-full">
                {c.eyebrow}
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-foreground leading-tight">
                {c.h2}
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                {c.sub}
              </p>
              <p className="text-sm text-violet-300 font-medium">
                {c.result}
              </p>
              <Link href="/build">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="inline-flex items-center gap-2 px-7 py-3.5 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-sm font-bold transition-colors shadow-lg shadow-violet-600/25"
                >
                  {c.cta}
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              </Link>
              <p className="text-xs text-muted-foreground">{c.note}</p>
            </motion.div>

            {/* Right — question cards */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-3"
            >
              {c.questions.map(({ icon: Icon, q }, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="flex items-center gap-3 glass rounded-xl px-4 py-3 border border-white/8"
                >
                  <div className="w-7 h-7 rounded-lg bg-violet-500/15 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-3.5 h-3.5 text-violet-400" />
                  </div>
                  <span className="text-xs text-foreground/70 leading-snug">{q}</span>
                  <span className="ml-auto text-[10px] font-bold text-violet-400 flex-shrink-0">
                    {i + 1}
                  </span>
                </motion.div>
              ))}
            </motion.div>

          </div>
        </div>
      </div>
      <div className="section-rule absolute bottom-0 left-0 right-0" />
    </section>
  )
}
