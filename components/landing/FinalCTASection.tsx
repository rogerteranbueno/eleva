"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { useLang } from "@/lib/i18n"

export function FinalCTASection() {
  const { lang } = useLang()

  const c = lang === "en" ? {
    h2a: "Ready to stop guessing ",
    h2b: "and start growing?",
    sub: "Schedule a free strategy session. In 30 minutes we'll show you exactly how much your center can grow, which plan fits your model, and what implementation looks like for you.",
    cta1: "Schedule free session",
    cta2: "See the demo first",
    note: "No commitment · Response in less than 24 hours · All clients under NDA · 40+ centers in Latin America",
  } : {
    h2a: "¿Listo para dejar de adivinar ",
    h2b: "y empezar a crecer?",
    sub: "Agenda una sesión estratégica gratuita. En 30 minutos te mostramos exactamente cuánto puede crecer tu centro, qué plan se adapta a tu modelo y cómo se ve la implementación para ti.",
    cta1: "Agendar sesión gratuita",
    cta2: "Ver el demo primero",
    note: "Sin compromiso · Respuesta en menos de 24 horas · Todos bajo NDA · 40+ centros en Latinoamérica",
  }

  return (
    <section id="contacto" className="px-6 py-20 max-w-3xl mx-auto text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="space-y-6"
      >
        <h2 className="text-4xl sm:text-5xl font-black text-foreground">
          {c.h2a}
          <span className="gradient-text">{c.h2b}</span>
        </h2>
        <p className="text-muted-foreground text-lg leading-relaxed">
          {c.sub}
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="mailto:hola@elevaapp.io"
            className="flex items-center gap-2 px-8 py-4 bg-violet-600 hover:bg-violet-700 text-foreground rounded-xl text-base font-bold transition-colors"
          >
            {c.cta1}
            <ArrowRight className="w-5 h-5" />
          </a>
          <Link href="/vl2026">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2 px-8 py-4 glass text-foreground rounded-xl text-base font-medium hover:text-foreground hover:opacity-80 transition-colors"
            >
              {c.cta2}
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </Link>
        </div>
        <p className="text-xs text-muted-foreground">
          {c.note}
        </p>
      </motion.div>
    </section>
  )
}
