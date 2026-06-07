"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { useLang } from "@/lib/i18n"

export function FinalCTASection() {
  const { lang } = useLang()

  const c = lang === "en" ? {
    h2a: "Your center deserves a system ",
    h2b: "at its level.",
    sub: "Schedule a free strategy session. In 30 minutes we'll show you how ELEVA adapts to your model, your methodology and your growth goals.",
    cta1: "See the demo first",
    cta2: "Schedule a session",
    note: "No commitment · Response in less than 24 hours · Already 40+ centers running with ELEVA",
  } : {
    h2a: "Tu centro merece un sistema ",
    h2b: "a su altura.",
    sub: "Agenda una sesión estratégica gratuita. En 30 minutos te mostramos cómo ELEVA se adapta a tu modelo, tu metodología y tus objetivos de crecimiento.",
    cta1: "Ver el demo primero",
    cta2: "Agendar sesión",
    note: "Sin compromiso · Respuesta en menos de 24 horas · Ya operan más de 40 centros con ELEVA",
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
          <Link href="/demo">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2 px-8 py-4 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-base font-bold transition-colors"
            >
              {c.cta1}
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </Link>
          <a
            href="mailto:hola@elevaapp.io"
            className="flex items-center gap-2 px-8 py-4 glass text-foreground rounded-xl text-base font-medium hover:text-foreground hover:opacity-80 transition-colors"
          >
            {c.cta2}
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
        <p className="text-xs text-muted-foreground">
          {c.note}
        </p>
      </motion.div>
    </section>
  )
}
