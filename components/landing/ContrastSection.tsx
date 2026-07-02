"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { CheckCircle, ChevronDown, ArrowRight } from "lucide-react"
import { useLang } from "@/lib/i18n"

export function ContrastSection() {
  const { lang } = useLang()
  const [showAll, setShowAll] = useState(false)

  const c = lang === "en" ? {
    badge: "03 · The contrast",
    h2a: "This is what",
    h2b: "changes with ELEVA.",
    todayLabel: "Today",
    withElevaLabel: "With ELEVA",
    rows: [
      { before: "WhatsApp for everything", after: "Centralized and segmented communication" },
      { before: "Excel with scattered data", after: "Living file per participant" },
      { before: "Follow-up by intuition", after: "Real-time Momentum Score" },
      { before: "Fragmented community", after: "Live cohorts with feed, chat and challenges" },
      { before: "No support between phases", after: "Specialists, content and missions every day" },
      { before: "Growth by pressure", after: "Growth by perceived value" },
      { before: "You don't know what's happening", after: "Owner's control panel in real time" },
    ],
    seeMore: "See",
    seeMoreSuffix: " more",
    statVal: "4 hrs",
    statDesc: "per week the owner recovers, without changing their methodology or hiring more staff.",
    cta: "See the contrast live",
  } : {
    badge: "03 · El contraste",
    h2a: "Esto es lo que",
    h2b: "cambia con ELEVA.",
    todayLabel: "Hoy",
    withElevaLabel: "Con ELEVA",
    rows: [
      { before: "WhatsApp para todo", after: "Comunicación centralizada y segmentada" },
      { before: "Excel con datos dispersos", after: "Expediente vivo por participante" },
      { before: "Seguimiento a ojo", after: "Momentum Score en tiempo real" },
      { before: "Comunidad fragmentada", after: "Cohortes vivas con feed, chat y retos" },
      { before: "Sin soporte entre fases", after: "Especialistas, contenido y misiones todos los días" },
      { before: "Crecimiento por presión", after: "Crecimiento por valor percibido" },
      { before: "No sabes qué está pasando", after: "Panel de control del dueño en tiempo real" },
    ],
    seeMore: "Ver",
    seeMoreSuffix: " más",
    statVal: "4 hrs",
    statDesc: "por semana que el dueño recupera, sin cambiar su metodología ni contratar más staff.",
    cta: "Ver el contraste en vivo",
  }

  const visibleRows = showAll ? c.rows : c.rows.slice(0, 4)

  return (
    <section className="section-a relative py-20">
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
          <h2 className="text-5xl sm:text-6xl font-black text-foreground leading-[1.05]">
            {c.h2a}<br />{c.h2b}
          </h2>
        </motion.div>

        {/* Desktop */}
        <div className="hidden sm:block glass rounded-2xl overflow-hidden">
          <div className="grid grid-cols-2 border-b border-border">
            <div className="p-4 text-center">
              <span className="text-xs font-bold text-red-400 uppercase tracking-wider">{c.todayLabel}</span>
            </div>
            <div className="p-4 text-center border-l border-border">
              <span className="text-xs font-bold text-violet-400 uppercase tracking-wider">{c.withElevaLabel}</span>
            </div>
          </div>
          {c.rows.map((row, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="grid grid-cols-2 border-b border-border last:border-0 hover:bg-foreground/2 transition-colors"
            >
              <div className="p-4 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0" />
                <span className="text-sm text-muted-foreground">{row.before}</span>
              </div>
              <div className="p-4 flex items-center gap-2 border-l border-border">
                <CheckCircle className="w-3.5 h-3.5 text-violet-400 flex-shrink-0" />
                <span className="text-sm text-foreground font-medium">{row.after}</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Mobile, collapsed by default */}
        <div className="sm:hidden space-y-2">
          {visibleRows.map((row, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="glass rounded-xl overflow-hidden"
            >
              <div className="flex items-start gap-2 px-4 py-3 border-b border-border">
                <div className="w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0 mt-1.5" />
                <span className="text-sm text-muted-foreground leading-snug">{row.before}</span>
              </div>
              <div className="flex items-start gap-2 px-4 py-3 bg-violet-600/5">
                <CheckCircle className="w-3.5 h-3.5 text-violet-400 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-foreground font-medium leading-snug">{row.after}</span>
              </div>
            </motion.div>
          ))}
          {!showAll && (
            <button
              onClick={() => setShowAll(true)}
              className="w-full py-3 text-sm text-violet-400 font-semibold hover:text-violet-300 transition-colors flex items-center justify-center gap-1"
            >
              {c.seeMore} {c.rows.length - 4}{c.seeMoreSuffix}
              <ChevronDown className="w-4 h-4" />
            </button>
          )}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 glass rounded-2xl px-6 py-5 border border-cyan-500/20"
        >
          <div className="flex items-center gap-4 text-center sm:text-left">
            <p className="text-4xl font-black text-cyan-400 flex-shrink-0">{c.statVal}</p>
            <p className="text-sm text-foreground/80">{c.statDesc}</p>
          </div>
          <Link href="/vl2026/pulso" className="flex-shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-xl border border-cyan-500/40 hover:bg-cyan-500/10 text-cyan-300 text-sm font-bold transition-colors whitespace-nowrap">
            {c.cta} <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
