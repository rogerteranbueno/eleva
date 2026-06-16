"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, Shield, Activity, Target } from "lucide-react"
import { useLang } from "@/lib/i18n"

export function DemoSection() {
  const { lang } = useLang()

  const c = lang === "en" ? {
    eyebrow: "Interactive demo",
    h2a: "Watch it running in ",
    h2b: "LEVEL.",
    sub: "See how it detects 14 at-risk participants and lets you act in one click. Then switch to the participant view and live the journey from the inside. Fictional data, real experience.",
    cta: "Enter the demo",
    badge1: "No registration required",
    badge2: "Fictional data · feels real",
    badge3: "Switch between owner / coach / participant",
  } : {
    eyebrow: "Demo interactivo",
    h2a: "Míralo funcionando en ",
    h2b: "LEVEL.",
    sub: "Observa cómo detecta los 14 participantes en riesgo y actúa sobre ellos en un clic. Luego cambia a la vista del participante y vive el journey desde adentro. Datos ficticios, experiencia real.",
    cta: "Entrar al demo",
    badge1: "Sin registro requerido",
    badge2: "Datos ficticios · se siente real",
    badge3: "Cambia entre dueño / coach / participante",
  }

  return (
    <section className="px-6 py-16 max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="glass-violet rounded-3xl p-10 text-center space-y-6"
      >
        <p className="text-xs uppercase tracking-widest text-violet-400 font-semibold">{c.eyebrow}</p>
        <h2 className="text-4xl sm:text-5xl font-black text-foreground">
          {c.h2a}
          <span className="gradient-text">{c.h2b}</span>
        </h2>
        <p className="text-muted-foreground max-w-xl mx-auto text-lg leading-relaxed">
          {c.sub}
        </p>
        <Link href="/demo">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center gap-2 px-8 py-4 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-base font-bold transition-colors"
          >
            {c.cta}
            <ArrowRight className="w-5 h-5" />
          </motion.button>
        </Link>
        <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground flex-wrap">
          <div className="flex items-center gap-1.5">
            <Shield className="w-4 h-4 text-green-400" />
            {c.badge1}
          </div>
          <div className="flex items-center gap-1.5">
            <Activity className="w-4 h-4 text-cyan-400" />
            {c.badge2}
          </div>
          <div className="flex items-center gap-1.5">
            <Target className="w-4 h-4 text-violet-400" />
            {c.badge3}
          </div>
        </div>
      </motion.div>
    </section>
  )
}
