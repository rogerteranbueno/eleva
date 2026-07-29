"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, Lock } from "lucide-react"
import { useLang } from "@/lib/i18n"

export function PricingTeaser() {
  const { lang } = useLang()

  const c = lang === "en" ? {
    eyebrow: "Investment",
    h2a: "A system that pays for itself",
    h2b: "in the first month.",
    sub: "No enrollment commissions. No per-participant pricing. No surprises.",
    ndaNote: "All clients operate under NDA",
    items: [
      { label: "Base Implementation", value: "from $15,000 USD", note: "2 months active · Expected 2x–3x growth", highlight: false },
      { label: "Robust Implementation", value: "from $30,000 USD", note: "6 months · Dedicated team that implements everything · Potential 5x–10x", highlight: true },
      { label: "Monthly maintenance", value: "$699 USD / mo", note: "Fixed price regardless of how many participants you have", highlight: false },
    ],
    cta: "See what each plan includes",
  } : {
    eyebrow: "Inversión",
    h2a: "Un sistema que se paga",
    h2b: "solo en el primer mes.",
    sub: "Sin comisiones por enrolamiento. Sin precio por participante. Sin sorpresas.",
    ndaNote: "Todos los clientes operan bajo NDA",
    items: [
      { label: "Implementación Base", value: "desde $15,000 USD", note: "2 meses activos · Crecimiento esperado 2x–3x", highlight: false },
      { label: "Implementación Robusta", value: "desde $30,000 USD", note: "6 meses · Equipo dedicado que implementa todo · Potencial 5x–10x", highlight: true },
      { label: "Mantenimiento mensual", value: "$699 USD / mes", note: "Precio fijo sin importar cuántos participantes tengas", highlight: false },
    ],
    cta: "Ver qué incluye cada plan",
  }

  return (
    <section className="section-b py-20">
      <div className="max-w-4xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-violet-400 mb-3">{c.eyebrow}</p>
          <h2 className="text-4xl sm:text-5xl font-black text-foreground leading-tight mb-3">
            {c.h2a}<br className="hidden sm:block" /> {c.h2b}
          </h2>
          <p className="text-muted-foreground text-base max-w-xl mx-auto">
            {c.sub}
          </p>
          <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 text-xs text-green-400 font-medium">
            <Lock className="w-3 h-3" />
            {c.ndaNote}
          </div>
        </motion.div>

        <div className="space-y-3 mb-8">
          {c.items.map((item, i) => (
            <motion.div key={item.label} initial={{ opacity: 0, x: -12 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
              className={`glass rounded-2xl px-6 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${item.highlight ? "border-violet-500/30 bg-violet-500/4" : ""}`}>
              <div>
                <p className="text-sm font-bold text-foreground">{item.label}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{item.note}</p>
              </div>
              <p className={`text-xl font-black tabular-nums flex-shrink-0 ${item.highlight ? "text-violet-400" : "text-foreground"}`}>
                {item.value}
              </p>
            </motion.div>
          ))}
        </div>

        <div className="text-center">
          <Link href="/precios">
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl border border-border text-sm text-muted-foreground hover:text-foreground hover:border-border/60 transition-all">
              {c.cta} <ArrowRight className="w-4 h-4" />
            </motion.button>
          </Link>
        </div>
      </div>
    </section>
  )
}
