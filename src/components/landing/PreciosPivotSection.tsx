"use client"

import { motion } from "framer-motion"
import { useInView } from "@/lib/use-in-view"
import Link from "next/link"
import { ArrowRight, Check } from "lucide-react"

const PLANES = [
  {
    name: "Diagnóstico ELEVA 360",
    price: "Desde USD $1,500",
    freq: "",
    accent: "white",
    tag: "Punto de entrada",
    description: "Revisamos ventas, operación, equipo, continuidad y riesgos. Sales con un plan de 90 días.",
    bullets: [
      "Auditoría de ventas y admisiones",
      "Auditoría de experiencia del participante",
      "Revisión de staff y roles",
      "Riesgos operativos y oportunidades",
      "Plan de 90 días + sesión ejecutiva",
    ],
    note: "Empieza con una llamada de calificación gratuita. El monto se descuenta al contratar PACTO.",
    cta: "Solicitar diagnóstico",
    href: "/build",
    featured: true,
  },
  {
    name: "PACTO",
    price: "Desde USD $15,000",
    freq: "",
    accent: "violet",
    tag: "Implementación",
    description: "Implementación para formar a tu equipo, instalar sistema y ordenar el crecimiento.",
    bullets: [
      "Academia interna diseñada",
      "Formación de entrenadores y staff",
      "Procesos documentados y listos para usarse",
      "ELEVA OS instalado y en uso",
      "Plan de crecimiento a 90 días",
    ],
    note: "No es un curso. Es una implementación.",
    cta: "Ver alcance de PACTO",
    href: "/pacto",
    featured: false,
  },
  {
    name: "ELEVA Partner",
    price: "Desde USD $1,000",
    freq: "/mes",
    accent: "emerald",
    tag: "Acompañamiento continuo",
    description: "Acompañamiento mensual para sostener la operación y seguir creciendo.",
    bullets: [
      "Sesiones mensuales de dirección",
      "Soporte estratégico continuo",
      "Comunidad de directores LATAM",
      "Actualizaciones de playbooks",
      "Benchmark de métricas del sector",
    ],
    note: "Disponible tras completar PACTO.",
    cta: "Conocer Partner",
    href: "/build",
    featured: false,
  },
]

const ACCENT_STYLES: Record<string, { card: string; badge: string; btn: string }> = {
  white:   { card: "border-violet-500/35",           badge: "bg-violet-500/10 text-violet-300 border-violet-500/20",   btn: "bg-violet-600 hover:bg-violet-500 text-foreground" },
  violet:  { card: "border-foreground/10",       badge: "bg-foreground/8 text-foreground/60 border-foreground/10",  btn: "bg-foreground/8 hover:bg-foreground/12 border border-foreground/10 text-foreground" },
  emerald: { card: "border-emerald-500/25",      badge: "bg-emerald-500/10 text-emerald-300 border-emerald-500/20", btn: "bg-foreground/8 hover:bg-foreground/12 border border-foreground/10 text-foreground" },
}

const CHECK_COLORS: Record<string, string> = {
  white: "text-violet-400", violet: "text-foreground/50", emerald: "text-emerald-400",
}

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.09, duration: 0.55, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  }),
}

export function PreciosPivotSection() {
  const { ref, inView } = useInView(0.08)

  return (
    <section ref={ref} className="py-24 px-6 max-w-6xl mx-auto">
      <motion.div initial="hidden" animate={inView ? "visible" : "hidden"} className="space-y-12">
        <motion.div custom={0} variants={fadeUp} className="text-center max-w-2xl mx-auto space-y-3">
          <p className="text-xs font-bold text-violet-400 uppercase tracking-widest">
            Formas de trabajar con ELEVA
          </p>
          <h2 className="text-4xl sm:text-5xl font-black text-foreground leading-tight">
            Empieza con claridad,<br />
            <span className="text-muted-foreground font-light">no con promesas.</span>
          </h2>
          <p className="text-base text-muted-foreground">
            Primero entendemos tu centro. Luego proponemos el plan.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {PLANES.map((p, i) => {
            const a = ACCENT_STYLES[p.accent]
            return (
              <motion.div
                key={p.name}
                custom={i + 1}
                variants={fadeUp}
                className={`glass rounded-2xl p-6 border flex flex-col gap-5 relative ${a.card} ${p.featured ? "ring-1 ring-violet-500/30" : ""}`}
              >
                {p.featured && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-violet-600 text-foreground text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider">
                      Empieza aquí
                    </span>
                  </div>
                )}

                <div className="space-y-2">
                  <span className={`text-[10px] px-2.5 py-1 rounded-full border font-bold uppercase tracking-wider ${a.badge}`}>
                    {p.tag}
                  </span>
                  <p className="font-black text-foreground text-base leading-snug">{p.name}</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-black text-foreground">{p.price}</span>
                    {p.freq && <span className="text-muted-foreground text-xs">{p.freq}</span>}
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{p.description}</p>
                </div>

                <ul className="space-y-2 flex-1">
                  {p.bullets.map((b) => (
                    <li key={b} className="flex items-start gap-2 text-xs text-foreground/75">
                      <Check className={`w-3.5 h-3.5 flex-shrink-0 mt-0.5 ${CHECK_COLORS[p.accent]}`} />
                      {b}
                    </li>
                  ))}
                </ul>

                <div className="space-y-2">
                  <p className="text-[10px] text-muted-foreground italic">{p.note}</p>
                  <Link href={p.href}>
                    <button className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all ${a.btn}`}>
                      {p.cta} <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </Link>
                </div>
              </motion.div>
            )
          })}
        </div>

        <motion.p custom={5} variants={fadeUp} className="text-center text-xs text-muted-foreground">
          Te respondemos en menos de 24 horas hábiles · Si no vemos fit, te lo decimos de frente.
        </motion.p>
      </motion.div>
    </section>
  )
}
