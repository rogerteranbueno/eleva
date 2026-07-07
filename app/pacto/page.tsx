"use client"

import { useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import {
  ArrowLeft, ArrowRight, Check, ChevronDown, Zap,
  GraduationCap, Users, LayoutDashboard, TrendingUp,
  ShieldCheck, AlertTriangle, Calendar,
} from "lucide-react"
import { cn } from "@/lib/utils"

// ─── Data ─────────────────────────────────────────────────────────────────────

const PROBLEMAS = [
  "Entrenadores externos que no conocen la cultura del centro.",
  "Staff que improvisa porque no tiene procesos claros.",
  "Seguimiento post-entrenamiento que depende de la memoria del coach.",
  "No sabes quién está en riesgo de abandonar hasta que ya se fue.",
  "El PL termina y no hay sistema para sostener las promesas hechas en sala.",
  "Decisiones operativas tomadas sin datos, solo por intuición.",
]

const MODULOS = [
  { num: "01", title: "Fundamentos de transformación responsable",     area: "Academy" },
  { num: "02", title: "Observador, lenguaje e interpretación",         area: "Academy" },
  { num: "03", title: "Presencia y escucha del entrenador",            area: "Academy" },
  { num: "04", title: "Diseño de experiencias transformacionales",      area: "Academy" },
  { num: "05", title: "Intervención, corrección y seguridad psicológica", area: "Standards" },
  { num: "06", title: "Staff, roles y operación de sala",              area: "Growth" },
  { num: "07", title: "Admisiones, enrolamiento y ventas éticas",      area: "Growth" },
  { num: "08", title: "PL continuity y programas posteriores",         area: "Growth" },
  { num: "09", title: "Data, dashboards y seguimiento con ELEVA OS",   area: "OS" },
  { num: "10", title: "Academia interna del centro",                   area: "Academy" },
  { num: "11", title: "Expansión y nuevas sedes",                      area: "Growth" },
  { num: "12", title: "Proyecto final de implementación",              area: "OS" },
]

const AREA_COLOR: Record<string, string> = {
  Academy:   "text-violet-400 bg-violet-500/8 border-violet-500/15",
  Growth:    "text-emerald-400 bg-emerald-500/8 border-emerald-500/15",
  OS:        "text-blue-400 bg-blue-500/8 border-blue-500/15",
  Standards: "text-amber-400 bg-amber-500/8 border-amber-500/15",
}

const ENTREGABLES = [
  "Ruta de formación de entrenadores diseñada y documentada.",
  "Staff entrenado y certificado bajo estándares del centro.",
  "Procesos críticos de operación documentados en playbooks.",
  "ELEVA OS instalado, configurado y en uso real.",
  "Métricas operativas activas con dashboard funcionando.",
  "Modelo de continuidad post-PL implementado.",
  "Plan de crecimiento a 90 días con KPIs definidos.",
  "Roadmap de nuevas fuentes de ingreso y expansión.",
]

const FASES = [
  {
    num: "01", weeks: "Semanas 1–2",
    title: "Diagnóstico y diseño",
    accent: "violet",
    items: ["Auditoría del centro", "Mapeo de equipo y roles", "Diseño del plan de implementación", "Alineación con dirección"],
  },
  {
    num: "02", weeks: "Semanas 3–6",
    title: "Formación de entrenadores",
    accent: "blue",
    items: ["Módulos 01–05", "Práctica supervisada", "Evaluación de presencia", "Proyecto parcial 1"],
  },
  {
    num: "03", weeks: "Semanas 7–9",
    title: "Staff y operación",
    accent: "emerald",
    items: ["Módulos 06–08", "Procesos y playbooks", "Admisiones y seguimiento", "Capacitación de oficina"],
  },
  {
    num: "04", weeks: "Semanas 10–13",
    title: "Sistema e ELEVA OS",
    accent: "amber",
    items: ["Módulo 09", "Instalación del OS", "Dashboards y métricas", "Continuidad post-PL"],
  },
  {
    num: "05", weeks: "Semanas 14–16",
    title: "Crecimiento y cierre",
    accent: "violet",
    items: ["Módulos 10–12", "Plan de expansión", "Proyecto final", "Entrega y handoff completo"],
  },
]

const FASE_ACCENT: Record<string, { badge: string; line: string }> = {
  violet:  { badge: "bg-violet-500/10 text-violet-300 border-violet-500/20",  line: "bg-violet-500" },
  blue:    { badge: "bg-blue-500/10 text-blue-300 border-blue-500/20",        line: "bg-blue-500" },
  emerald: { badge: "bg-emerald-500/10 text-emerald-300 border-emerald-500/20", line: "bg-emerald-500" },
  amber:   { badge: "bg-amber-500/10 text-amber-300 border-amber-500/20",     line: "bg-amber-500" },
}

const FAQ = [
  {
    q: "¿Qué pasa con la metodología propia de mi centro?",
    a: "PACTO no reemplaza tu metodología. La tomamos como base y construimos alrededor de ella, formación de entrenadores, operación, seguimiento y crecimiento bajo tu propia cultura y lenguaje. Tu propiedad intelectual es intocable.",
  },
  {
    q: "¿Cuánto tiempo toma completar PACTO?",
    a: "El programa tiene una duración de 14–16 semanas de implementación activa. El ritmo se ajusta según el tamaño del equipo y los compromisos operativos del centro. No es un curso de fin de semana, es una implementación real.",
  },
  {
    q: "¿Necesito contratar ELEVA OS para hacer PACTO?",
    a: "ELEVA OS se instala como parte del módulo 09 de PACTO. No necesitas contratarlo por separado de antemano, está incluido en la implementación.",
  },
  {
    q: "¿Es presencial o virtual?",
    a: "Diseñamos cada implementación según el contexto del centro. La mayoría incluye sesiones presenciales clave (kick-off, formación de entrenadores, cierre) y trabajo virtual entre sesiones. Para centros fuera de México, coordinamos viajes estratégicos.",
  },
  {
    q: "¿Qué pasa si mi equipo no adopta el sistema?",
    a: "La resistencia al cambio está contemplada en el diseño del programa. Incluye sesiones específicas de alineación de equipo y estrategias de adopción. Además, el soporte continúa durante 30 días post-entrega para consolidar el uso.",
  },
  {
    q: "¿El precio de USD $15,000 incluye todo?",
    a: "El precio base de PACTO cubre la implementación completa según el alcance acordado. Si contrataste previamente el Diagnóstico ELEVA 360, el monto se descuenta del proyecto. Existe financiamiento en pagos para facilitar el acceso.",
  },
]

// ─── FAQ Item ─────────────────────────────────────────────────────────────────

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className={cn("border rounded-xl overflow-hidden transition-colors", open ? "border-foreground/12" : "border-foreground/6")}>
      <button
        onClick={() => setOpen((p) => !p)}
        className="w-full flex items-start justify-between gap-4 px-5 py-4 text-left"
      >
        <span className="text-sm font-bold text-foreground leading-snug">{q}</span>
        <ChevronDown className={cn("w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5 transition-transform", open && "rotate-180")} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <p className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function PACTOPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">

      {/* ── Mini Nav ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/85 backdrop-blur-xl border-b border-border">
        <div className="flex items-center justify-between px-6 py-3.5 max-w-6xl mx-auto">
          <div className="flex items-center gap-5">
            <Link href="/" className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors text-sm">
              <ArrowLeft className="w-4 h-4" /> Inicio
            </Link>
            <div className="w-px h-4 bg-foreground/10" />
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-violet-600 flex items-center justify-center">
                <span className="text-foreground font-black text-[10px]">E</span>
              </div>
              <span className="font-black text-foreground text-sm tracking-tight">ELEVA</span>
              <span className="text-foreground/20 text-sm">/</span>
              <span className="font-black text-violet-400 text-sm">PACTO</span>
            </div>
          </div>
          <Link href="/build">
            <button className="flex items-center gap-1.5 px-4 py-2 bg-violet-600 hover:bg-violet-500 text-foreground rounded-lg text-[13px] font-bold transition-colors">
              Aplicar <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </Link>
        </div>
      </nav>

      <main className="pt-16">

        {/* ── Hero ── */}
        <section className="relative min-h-[70vh] flex items-center justify-center px-6 text-center overflow-hidden pt-20 pb-16">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-violet-600/8 blur-3xl" />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
            className="relative max-w-4xl mx-auto"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.15 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-600/12 border border-violet-500/25 text-violet-300 text-xs font-bold mb-8 uppercase tracking-widest"
            >
              <Zap className="w-3 h-3" /> Producto estrella · ELEVA
            </motion.div>

            <h1 className="text-7xl sm:text-8xl md:text-9xl font-black text-foreground tracking-tight leading-none mb-4">
              PACTO
            </h1>
            <p className="text-xl sm:text-2xl text-muted-foreground font-light mb-3 max-w-xl mx-auto">
              Programa de Aceleración para Coaches<br />y Centros de Transformación
            </p>
            <p className="text-base text-muted-foreground/70 max-w-lg mx-auto mb-12">
              Una implementación intensiva para formar entrenadores, profesionalizar staff e instalar sistemas de crecimiento dentro de tu centro.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/build">
                <button className="flex items-center gap-2 px-8 py-4 bg-violet-600 hover:bg-violet-500 text-foreground rounded-xl text-base font-black transition-colors shadow-lg shadow-violet-600/20 group">
                  <Calendar className="w-4.5 h-4.5" />
                  Aplicar a PACTO
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </Link>
              <a href="#modulos">
                <button className="flex items-center gap-2 px-6 py-3.5 glass border border-foreground/10 hover:border-foreground/20 text-foreground font-bold rounded-xl transition-all text-sm">
                  Ver los módulos
                </button>
              </a>
            </div>

            {/* Stat strip */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap items-center justify-center gap-8 mt-14"
            >
              {[
                { value: "16 semanas", label: "de implementación" },
                { value: "12 módulos", label: "por división ELEVA" },
                { value: "8 entregables", label: "al cierre del programa" },
              ].map((s) => (
                <div key={s.label} className="text-center">
                  <p className="text-2xl font-black text-foreground">{s.value}</p>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </section>

        {/* ── Divider ── */}
        <div className="max-w-6xl mx-auto px-6">
          <div className="h-px bg-gradient-to-r from-transparent via-white/6 to-transparent" />
        </div>

        {/* ── Qué es / Para quién ── */}
        <section className="py-24 px-6 max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-6">
              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4">Qué es PACTO</p>
                <h2 className="text-4xl font-black text-foreground leading-tight mb-5">
                  No es un curso.<br />
                  <span className="text-muted-foreground font-light">Es una implementación.</span>
                </h2>
                <p className="text-foreground/80 leading-relaxed">
                  PACTO es una implementación estratégica e intensiva para profesionalizar la formación, la operación, el seguimiento y el crecimiento de un centro de transformación.
                </p>
              </div>
              <p className="text-foreground/80 leading-relaxed">
                No viene a decirte cómo entrenar, viene a instalar la estructura que permite que tu entrenamiento escale: entrenadores propios, staff preparado, procesos documentados, datos en tiempo real y un plan de crecimiento real.
              </p>
              <div className="glass rounded-2xl p-5 border border-violet-500/15 space-y-1">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Copy central</p>
                <p className="text-lg font-black text-violet-300 italic leading-snug">
                  "Lo que tu centro promete en la sala<br />debe sostenerse en la operación."
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4">Para quién es</p>
                <h3 className="text-xl font-black text-foreground mb-4">Centros activos con ambición de escalar</h3>
                <p className="text-foreground/80 leading-relaxed mb-5">
                  Centros que ya tienen comunidad, entrenamientos en curso y una visión de crecimiento, pero que siguen operando con improvisación, entrenadores externos, seguimiento manual y decisiones tomadas sin datos.
                </p>
              </div>

              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4">Qué resuelve</p>
                <ul className="space-y-2.5">
                  {PROBLEMAS.map((p) => (
                    <li key={p} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <AlertTriangle className="w-2.5 h-2.5 text-red-400" />
                      </div>
                      <span className="text-sm text-foreground/75 leading-snug">{p}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ── Divider ── */}
        <div className="max-w-6xl mx-auto px-6">
          <div className="h-px bg-gradient-to-r from-transparent via-white/6 to-transparent" />
        </div>

        {/* ── Módulos ── */}
        <section id="modulos" className="py-24 px-6 max-w-6xl mx-auto">
          <div className="space-y-10">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Contenido del programa</p>
              <h2 className="text-4xl sm:text-5xl font-black text-foreground leading-tight">
                12 módulos.<br />
                <span className="text-muted-foreground font-light">Un centro transformado.</span>
              </h2>
              <p className="text-muted-foreground text-sm">
                Cada módulo pertenece a una división ELEVA, los colores marcan qué área del centro estamos construyendo.
              </p>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap gap-2.5 justify-center">
              {Object.entries(AREA_COLOR).map(([area, cls]) => (
                <span key={area} className={cn("text-[10px] px-2.5 py-1 rounded-full border font-bold uppercase tracking-wider", cls)}>
                  ELEVA {area}
                </span>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {MODULOS.map((m) => (
                <div
                  key={m.num}
                  className="glass rounded-xl p-4 border border-foreground/6 flex items-start gap-3 group hover:border-foreground/10 transition-colors"
                >
                  <span className="text-[11px] font-black text-violet-400/60 flex-shrink-0 mt-0.5 w-6">{m.num}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground font-semibold leading-snug">{m.title}</p>
                  </div>
                  <span className={cn("text-[9px] px-2 py-0.5 rounded-full border font-bold uppercase tracking-wider flex-shrink-0 self-start mt-0.5", AREA_COLOR[m.area])}>
                    {m.area}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Divider ── */}
        <div className="max-w-6xl mx-auto px-6">
          <div className="h-px bg-gradient-to-r from-transparent via-white/6 to-transparent" />
        </div>

        {/* ── Entregables ── */}
        <section className="py-24 px-6 max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div className="space-y-4">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Al terminar PACTO</p>
              <h2 className="text-4xl font-black text-foreground leading-tight">
                Lo que el centro<br />
                <span className="text-muted-foreground font-light">tiene en sus manos.</span>
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                No documentos que nadie lee. Sistemas instalados, equipo entrenado y procesos que funcionan cuando el dueño no está mirando.
              </p>
              <div className="pt-4">
                <Link href="/build">
                  <button className="flex items-center gap-2 px-6 py-3 bg-violet-600 hover:bg-violet-500 text-foreground rounded-xl font-bold text-sm transition-colors group">
                    Agendar diagnóstico <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </Link>
              </div>
            </div>
            <ul className="space-y-3">
              {ENTREGABLES.map((e, i) => (
                <motion.li
                  key={e}
                  initial={{ opacity: 0, x: 12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.4 }}
                  viewport={{ once: true }}
                  className="flex items-start gap-3 glass rounded-xl p-4 border border-foreground/6"
                >
                  <div className="w-6 h-6 rounded-full bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-3 h-3 text-emerald-400" />
                  </div>
                  <p className="text-sm text-foreground/85 leading-snug">{e}</p>
                </motion.li>
              ))}
            </ul>
          </div>
        </section>

        {/* ── Divider ── */}
        <div className="max-w-6xl mx-auto px-6">
          <div className="h-px bg-gradient-to-r from-transparent via-white/6 to-transparent" />
        </div>

        {/* ── Ruta / Timeline ── */}
        <section className="py-24 px-6 max-w-6xl mx-auto">
          <div className="space-y-10">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Ruta del programa</p>
              <h2 className="text-4xl sm:text-5xl font-black text-foreground leading-tight">
                16 semanas.<br />
                <span className="text-muted-foreground font-light">5 fases de implementación.</span>
              </h2>
            </div>

            <div className="relative">
              {/* Vertical line desktop */}
              <div className="hidden lg:block absolute left-[88px] top-0 bottom-0 w-px bg-foreground/6" />

              <div className="space-y-5">
                {FASES.map((f) => {
                  const a = FASE_ACCENT[f.accent]
                  return (
                    <motion.div
                      key={f.num}
                      initial={{ opacity: 0, y: 16 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4 }}
                      viewport={{ once: true }}
                      className="flex gap-6"
                    >
                      {/* Step indicator */}
                      <div className="hidden lg:flex flex-col items-center flex-shrink-0 w-14">
                        <div className={cn("w-6 h-6 rounded-full border-2 flex items-center justify-center text-[10px] font-black text-foreground relative z-10", a.badge)}>
                          {f.num}
                        </div>
                      </div>

                      <div className="glass rounded-2xl border border-foreground/6 p-5 flex-1 hover:border-foreground/10 transition-colors">
                        <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <span className={cn("lg:hidden w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black border", a.badge)}>
                                {f.num}
                              </span>
                              <span className={cn("text-[10px] px-2.5 py-0.5 rounded-full border font-bold uppercase tracking-widest", a.badge)}>
                                {f.weeks}
                              </span>
                            </div>
                            <h3 className="font-black text-foreground text-base">{f.title}</h3>
                          </div>
                          <ul className="sm:w-80 space-y-1.5 flex-shrink-0">
                            {f.items.map((item) => (
                              <li key={item} className="flex items-center gap-2 text-xs text-muted-foreground">
                                <div className={cn("w-1 h-1 rounded-full flex-shrink-0", a.line)} />
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </div>
          </div>
        </section>

        {/* ── Divider ── */}
        <div className="max-w-6xl mx-auto px-6">
          <div className="h-px bg-gradient-to-r from-transparent via-white/6 to-transparent" />
        </div>

        {/* ── Pricing ── */}
        <section className="py-24 px-6 max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-5">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Inversión</p>
              <h2 className="text-4xl font-black text-foreground leading-tight">
                Una implementación seria<br />
                <span className="text-muted-foreground font-light">con un precio transparente.</span>
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                PACTO no es un gasto operativo. Es una inversión en infraestructura. Un centro que termina PACTO tiene la capacidad de crecer sin depender de una sola persona.
              </p>
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-2.5 text-sm text-foreground/75">
                  <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  Si contrataste el Diagnóstico 360 antes, el monto se descuenta de PACTO.
                </div>
                <div className="flex items-center gap-2.5 text-sm text-foreground/75">
                  <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  Opciones de financiamiento disponibles.
                </div>
                <div className="flex items-center gap-2.5 text-sm text-foreground/75">
                  <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  30 días de soporte post-entrega incluidos.
                </div>
              </div>
            </div>

            <div className="glass rounded-3xl border border-violet-500/20 p-8 space-y-6">
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Precio base</p>
                <p className="text-5xl font-black text-foreground">Desde USD $15,000</p>
                <p className="text-xs text-muted-foreground">El alcance final se define tras el diagnóstico inicial sin costo.</p>
              </div>

              <div className="border-t border-foreground/6 pt-5 space-y-2">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Incluye</p>
                <ul className="space-y-1.5">
                  {["12 módulos + 5 fases de implementación", "ELEVA OS instalado y configurado", "Formación de entrenadores y staff", "Playbooks y procesos documentados", "Plan de crecimiento a 90 días", "Soporte 30 días post-entrega"].map((i) => (
                    <li key={i} className="flex items-center gap-2 text-xs text-foreground/75">
                      <div className="w-1 h-1 rounded-full bg-violet-400 flex-shrink-0" />
                      {i}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-3">
                <Link href="/build">
                  <button className="w-full flex items-center justify-center gap-2 py-4 bg-violet-600 hover:bg-violet-500 text-foreground font-black rounded-xl transition-colors group text-base">
                    Aplicar a PACTO <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </Link>
                <p className="text-center text-[10px] text-muted-foreground">
                  El equipo de ELEVA revisa cada solicitud, sólo trabajamos con centros con los que hay fit real.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── Divider ── */}
        <div className="max-w-6xl mx-auto px-6">
          <div className="h-px bg-gradient-to-r from-transparent via-white/6 to-transparent" />
        </div>

        {/* ── Divisiones involucradas ── */}
        <section className="py-20 px-6 max-w-6xl mx-auto">
          <div className="space-y-8">
            <div className="text-center">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3">Por qué PACTO cubre todo</p>
              <h2 className="text-3xl font-black text-foreground">Las 4 divisiones ELEVA trabajan en conjunto.</h2>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { icon: GraduationCap, label: "ELEVA Academy", sub: "Formación y certificación", color: "violet" },
                { icon: TrendingUp,    label: "ELEVA Growth",   sub: "Estrategia y expansión",   color: "emerald" },
                { icon: LayoutDashboard, label: "ELEVA OS",    sub: "Sistema operativo",          color: "blue" },
                { icon: ShieldCheck,   label: "ELEVA Standards", sub: "Protocolos y ética",      color: "amber" },
              ].map(({ icon: Icon, label, sub, color }) => (
                <div key={label} className="glass rounded-2xl p-5 border border-foreground/6 flex flex-col items-center text-center gap-3">
                  <div className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center",
                    color === "violet" ? "bg-violet-500/10 text-violet-400" :
                    color === "emerald" ? "bg-emerald-500/10 text-emerald-400" :
                    color === "blue" ? "bg-blue-500/10 text-blue-400" :
                    "bg-amber-500/10 text-amber-400"
                  )}>
                    <Icon className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <p className="text-xs font-black text-foreground">{label}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Divider ── */}
        <div className="max-w-6xl mx-auto px-6">
          <div className="h-px bg-gradient-to-r from-transparent via-white/6 to-transparent" />
        </div>

        {/* ── FAQ ── */}
        <section className="py-24 px-6 max-w-4xl mx-auto">
          <div className="space-y-8">
            <div className="text-center space-y-3">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Preguntas frecuentes</p>
              <h2 className="text-4xl font-black text-foreground leading-tight">
                Las respuestas que<br />
                <span className="text-muted-foreground font-light">suelen importar.</span>
              </h2>
            </div>
            <div className="space-y-3">
              {FAQ.map((item) => (
                <FAQItem key={item.q} {...item} />
              ))}
            </div>
          </div>
        </section>

        {/* ── Divider ── */}
        <div className="max-w-6xl mx-auto px-6">
          <div className="h-px bg-gradient-to-r from-transparent via-white/6 to-transparent" />
        </div>

        {/* ── Final CTA ── */}
        <section className="py-32 px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto space-y-7"
          >
            <div className="flex items-center justify-center gap-4 mb-10">
              <div className="h-px flex-1 max-w-24 bg-gradient-to-r from-transparent to-white/8" />
              <div className="w-1 h-1 rounded-full bg-violet-400" />
              <div className="h-px flex-1 max-w-24 bg-gradient-to-l from-transparent to-white/8" />
            </div>

            <h2 className="text-5xl sm:text-6xl font-black text-foreground leading-tight">
              Tu centro ya tiene<br />
              <span className="text-muted-foreground font-light italic">la metodología.</span>
            </h2>
            <p className="text-xl text-muted-foreground font-light">
              PACTO le instala el sistema.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link href="/build">
                <button className="flex items-center gap-2.5 px-8 py-4 bg-violet-600 hover:bg-violet-500 text-foreground font-black rounded-xl transition-colors text-base group">
                  <Calendar className="w-4.5 h-4.5" />
                  Aplicar a PACTO
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </Link>
              <Link href="/">
                <button className="flex items-center gap-2 px-6 py-4 glass border border-foreground/10 hover:border-foreground/20 text-foreground font-bold rounded-xl transition-all text-sm">
                  Conocer todo ELEVA
                </button>
              </Link>
            </div>

            <p className="text-xs text-muted-foreground pt-2">
              No hay registro previo requerido · El Diagnóstico 360 se descuenta si contratas PACTO · Sólo trabajamos con centros con fit real.
            </p>
          </motion.div>
        </section>

        {/* ── Footer minimal ── */}
        <div className="border-t border-border px-6 py-8">
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-violet-600 flex items-center justify-center">
                <span className="text-foreground font-black text-[10px]">E</span>
              </div>
              <span className="font-black text-foreground text-sm">ELEVA</span>
            </div>
            <p className="text-xs text-muted-foreground">© 2026 ELEVA · Estudio Oasis · Para centros de transformación en LATAM</p>
            <Link href="/" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              ← Volver al inicio
            </Link>
          </div>
        </div>

      </main>
    </div>
  )
}
