"use client"

import { useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import {
  ArrowLeft, ArrowRight, Check, Users, LayoutDashboard,
  GraduationCap, ClipboardList, Building2, TrendingUp,
  ShieldCheck, Calendar,
} from "lucide-react"
import { cn } from "@/lib/utils"

// ─── Buyer profiles ───────────────────────────────────────────────────────────

const PERFILES = [
  {
    id: "director",
    icon: Building2,
    label: "Director / Dueño",
    badge: "Fundador o dirección general",
    accent: "violet",
    headline: "Convierte tu centro en una institución que crece sin depender únicamente de ti.",
    sub: "Tienes la visión. ELEVA te da la estructura para que el equipo la ejecute, los datos para decidir y los sistemas para expandir.",
    promesa: "De operador a director estratégico.",
    gana: [
      "Capacidad instalada: entrenadores formados y staff preparado.",
      "Dashboards de pulso para decidir con datos, no intuición.",
      "Plan de crecimiento a 90 días con métricas claras.",
      "Expansión a nuevas sedes con playbooks replicables.",
      "Nuevas fuentes de ingreso: membresías, post-PL, especialistas.",
    ],
    fears: [
      "Tu metodología es intocable, ELEVA construye alrededor de ella.",
      "No volvemos tu centro frío ni corporativo.",
      "Seleccionamos con quién trabajamos, el fit es mutuo.",
    ],
    cta: "Agendar diagnóstico",
    ctaHref: "/build",
    secondaryCta: "Ver PACTO",
    secondaryHref: "/pacto",
    color: { badge: "bg-violet-500/10 text-violet-300 border-violet-500/20", glow: "bg-violet-600/8", border: "border-violet-500/20", dot: "bg-violet-400", icon: "text-violet-400 bg-violet-500/10" },
  },
  {
    id: "ops",
    icon: LayoutDashboard,
    label: "Operador / Manager",
    badge: "Coordinación y operación",
    accent: "blue",
    headline: "Procesos, tableros y protocolos para dejar de operar en modo emergencia.",
    sub: "Tienes el control del día a día. ELEVA te da los playbooks, el sistema y las alertas para que la operación funcione sin depender de tu memoria.",
    promesa: "De apagafuegos a operador con sistema.",
    gana: [
      "Playbooks documentados para cada proceso crítico.",
      "ELEVA OS: seguimiento, alertas tempranas y CRM en un solo lugar.",
      "Roles claros para coaches, coordinadores y staff de sala.",
      "Seguimiento por participante sin depender de WhatsApp.",
      "Reportes automáticos por generación, cohorte y sede.",
    ],
    fears: [
      "La curva de adopción está cubierta, entrenamos a tu equipo completo.",
      "No rompemos lo que ya funciona, instalamos sobre lo existente.",
      "Soporte de 30 días post-entrega para consolidar el uso.",
    ],
    cta: "Solicitar diagnóstico",
    ctaHref: "/build",
    secondaryCta: "Ver ELEVA OS",
    secondaryHref: "/metodo",
    color: { badge: "bg-blue-500/10 text-blue-300 border-blue-500/20", glow: "bg-blue-600/6", border: "border-blue-500/20", dot: "bg-blue-400", icon: "text-blue-400 bg-blue-500/10" },
  },
  {
    id: "entrenador",
    icon: GraduationCap,
    label: "Entrenador / Coach",
    badge: "Sala y facilitación",
    accent: "emerald",
    headline: "Formación seria para desarrollar presencia, escucha, intervención y dominio de sala.",
    sub: "Ya tienes energía y compromiso. ELEVA te da el marco, las herramientas y el estándar para que tu impacto sea constante, medible y reproducible.",
    promesa: "De facilitador talentoso a entrenador institucional.",
    gana: [
      "Formación en los fundamentos de transformación responsable.",
      "Estándar de presencia, escucha e intervención ética.",
      "Diseño de experiencias transformacionales con estructura.",
      "Seguridad psicológica y protocolos de contingencia.",
      "Certificación bajo los estándares del Trainer Readiness Standard™.",
    ],
    fears: [
      "No te imponemos una metodología, profundizamos la tuya.",
      "Formación presencial con práctica real, no videos genéricos.",
      "Tu certificación es reconocida dentro del ecosistema ELEVA.",
    ],
    cta: "Hablar con el equipo",
    ctaHref: "/build",
    secondaryCta: "Ver ELEVA Academy",
    secondaryHref: "/academia",
    color: { badge: "bg-emerald-500/10 text-emerald-300 border-emerald-500/20", glow: "bg-emerald-600/6", border: "border-emerald-500/20", dot: "bg-emerald-400", icon: "text-emerald-400 bg-emerald-500/10" },
  },
  {
    id: "staff",
    icon: ClipboardList,
    label: "Staff / Oficina",
    badge: "Admisiones, seguimiento y logística",
    accent: "amber",
    headline: "Claridad operativa para sostener la experiencia antes, durante y después del entrenamiento.",
    sub: "Eres quien hace que el centro funcione. ELEVA te da procesos claros, herramientas sin fricción y protocolos para que puedas ejecutar sin adivinar.",
    promesa: "De soporte informal a equipo profesional.",
    gana: [
      "Proceso de admisiones estandarizado sin depender de WhatsApp.",
      "CRM y seguimiento de participantes sin Excel manual.",
      "Checklist y protocolos para cada momento del ciclo.",
      "Comunicaciones automáticas por WhatsApp, email y notificaciones.",
      "Roles y responsabilidades claramente definidos por escrito.",
    ],
    fears: [
      "La herramienta es fácil de usar, te entrenamos en el proceso.",
      "No necesitas saber de tecnología para usarla.",
      "Soporte continuo del equipo ELEVA durante la implementación.",
    ],
    cta: "Conocer el sistema",
    ctaHref: "/build",
    secondaryCta: "Ver ELEVA OS",
    secondaryHref: "/metodo",
    color: { badge: "bg-amber-500/10 text-amber-300 border-amber-500/20", glow: "bg-amber-600/6", border: "border-amber-500/20", dot: "bg-amber-400", icon: "text-amber-400 bg-amber-500/10" },
  },
]

type PerfilId = "director" | "ops" | "entrenador" | "staff"

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  director: Building2, ops: LayoutDashboard, entrenador: GraduationCap, staff: ClipboardList,
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ParaCentrosPage() {
  const [active, setActive] = useState<PerfilId>("director")
  const perfil = PERFILES.find((p) => p.id === active)!
  const Icon = ICON_MAP[active]

  return (
    <div className="min-h-screen bg-background text-foreground">

      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/85 backdrop-blur-xl border-b border-border">
        <div className="flex items-center justify-between px-6 py-3.5 max-w-6xl mx-auto">
          <div className="flex items-center gap-5">
            <Link href="/" className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors text-sm">
              <ArrowLeft className="w-4 h-4" /> Inicio
            </Link>
            <div className="hidden sm:flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-violet-600 flex items-center justify-center">
                <span className="text-foreground font-black text-[10px]">E</span>
              </div>
              <span className="font-black text-foreground text-sm">ELEVA</span>
              <span className="text-foreground/20">/</span>
              <span className="text-muted-foreground text-sm">Para centros</span>
            </div>
          </div>
          <Link href="/build">
            <button className="flex items-center gap-1.5 px-4 py-2 bg-violet-600 hover:bg-violet-500 text-foreground rounded-lg text-[13px] font-bold transition-colors">
              <Calendar className="w-3.5 h-3.5" /> Diagnóstico
            </button>
          </Link>
        </div>
      </nav>

      <main className="pt-20">

        {/* ── Header ── */}
        <section className="py-16 px-6 text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
            className="space-y-4"
          >
            <p className="text-xs font-bold text-violet-400 uppercase tracking-widest">Para centros de transformación</p>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-foreground leading-tight">
              ELEVA habla<br />
              <span className="text-muted-foreground font-light">tu idioma.</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
              Dependiendo de tu rol en el centro, lo que ELEVA resuelve cambia. Elige tu perfil para ver qué significa esto para ti.
            </p>
          </motion.div>
        </section>

        {/* ── Selector tabs ── */}
        <section className="px-6 max-w-4xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-12">
            {PERFILES.map((p) => {
              const PIcon = ICON_MAP[p.id]
              const isActive = active === p.id
              return (
                <button
                  key={p.id}
                  onClick={() => setActive(p.id as PerfilId)}
                  className={cn(
                    "flex flex-col items-center gap-2 py-4 px-3 rounded-2xl border transition-all text-center",
                    isActive
                      ? `${p.color.badge} ${p.color.border}`
                      : "border-foreground/8 bg-foreground/3 hover:border-foreground/15 hover:bg-foreground/5"
                  )}
                >
                  <PIcon className={cn("w-5 h-5", isActive ? "" : "text-muted-foreground")} />
                  <span className={cn("text-xs font-black leading-tight", isActive ? "" : "text-foreground/70")}>
                    {p.label}
                  </span>
                </button>
              )
            })}
          </div>

          {/* ── Perfil content ── */}
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="space-y-6 pb-24"
            >
              {/* Card superior */}
              <div className={cn("rounded-3xl border p-8 relative overflow-hidden", perfil.color.border)}>
                <div className={cn("absolute inset-0 rounded-3xl", perfil.color.glow)} />
                <div className="relative space-y-5">
                  <div className="flex items-start gap-4 flex-wrap">
                    <div className={cn("w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0", perfil.color.icon)}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <span className={cn("text-[10px] px-2.5 py-1 rounded-full border font-bold uppercase tracking-widest", perfil.color.badge)}>
                        {perfil.badge}
                      </span>
                      <p className="text-xs text-muted-foreground mt-1.5 font-bold">
                        {perfil.promesa}
                      </p>
                    </div>
                  </div>
                  <h2 className="text-3xl sm:text-4xl font-black text-foreground leading-tight max-w-2xl">
                    {perfil.headline}
                  </h2>
                  <p className="text-muted-foreground leading-relaxed max-w-xl">{perfil.sub}</p>
                  <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <Link href={perfil.ctaHref}>
                      <button className="flex items-center gap-2 px-6 py-3 bg-violet-600 hover:bg-violet-500 text-foreground font-bold rounded-xl transition-colors text-sm group">
                        <Calendar className="w-4 h-4" />
                        {perfil.cta}
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                      </button>
                    </Link>
                    <Link href={perfil.secondaryHref}>
                      <button className="flex items-center gap-2 px-6 py-3 glass border border-foreground/10 hover:border-foreground/20 text-foreground font-bold rounded-xl transition-all text-sm">
                        {perfil.secondaryCta}
                      </button>
                    </Link>
                  </div>
                </div>
              </div>

              {/* Lower 2-col */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Lo que ganas */}
                <div className="glass rounded-2xl border border-foreground/6 p-6 space-y-4">
                  <div className="flex items-center gap-2.5">
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                    <p className="text-xs font-bold text-foreground uppercase tracking-widest">Lo que ganas con ELEVA</p>
                  </div>
                  <ul className="space-y-3">
                    {perfil.gana.map((g) => (
                      <li key={g} className="flex items-start gap-2.5">
                        <div className={cn("w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1.5", perfil.color.dot)} />
                        <span className="text-sm text-foreground/80 leading-snug">{g}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Lo que te preocupa */}
                <div className="glass rounded-2xl border border-foreground/6 p-6 space-y-4">
                  <div className="flex items-center gap-2.5">
                    <ShieldCheck className="w-4 h-4 text-violet-400" />
                    <p className="text-xs font-bold text-foreground uppercase tracking-widest">Lo que te preocupaba</p>
                  </div>
                  <ul className="space-y-3">
                    {perfil.fears.map((f) => (
                      <li key={f} className="flex items-start gap-2.5">
                        <div className="w-5 h-5 rounded-full bg-emerald-500/12 border border-emerald-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Check className="w-2.5 h-2.5 text-emerald-400" />
                        </div>
                        <span className="text-sm text-foreground/80 leading-snug">{f}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Switch profile hint */}
                  <div className="border-t border-foreground/6 pt-4">
                    <p className="text-xs text-muted-foreground">
                      ¿Eres otro perfil en el centro?{" "}
                      {PERFILES.filter((p) => p.id !== active).map((p, i, arr) => (
                        <span key={p.id}>
                          <button
                            onClick={() => setActive(p.id as PerfilId)}
                            className="text-violet-400 hover:text-violet-300 transition-colors font-medium underline-offset-2 hover:underline"
                          >
                            {p.label.split(" /")[0]}
                          </button>
                          {i < arr.length - 1 && <span className="text-foreground/20"> · </span>}
                        </span>
                      ))}
                    </p>
                  </div>
                </div>
              </div>

              {/* El ciclo completo, mini strip */}
              <div className="glass rounded-2xl border border-foreground/6 p-6">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4">
                  ELEVA trabaja para todo el centro, no solo para un rol
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {PERFILES.map((p) => {
                    const PIcon = ICON_MAP[p.id]
                    return (
                      <button
                        key={p.id}
                        onClick={() => setActive(p.id as PerfilId)}
                        className={cn(
                          "flex flex-col items-center gap-2 p-3 rounded-xl border text-center transition-all",
                          active === p.id ? p.color.badge + " " + p.color.border : "border-foreground/6 hover:border-foreground/12"
                        )}
                      >
                        <PIcon className="w-4 h-4" />
                        <span className="text-[10px] font-bold">{p.label.split(" /")[0]}</span>
                      </button>
                    )
                  })}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </section>
      </main>

      {/* Footer minimal */}
      <div className="border-t border-border px-6 py-8">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-violet-600 flex items-center justify-center">
              <span className="text-foreground font-black text-[10px]">E</span>
            </div>
            <span className="font-black text-foreground text-sm">ELEVA</span>
          </div>
          <p className="text-xs text-muted-foreground">© 2026 ELEVA · Para centros de transformación en LATAM</p>
          <Link href="/" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
            ← Inicio
          </Link>
        </div>
      </div>
    </div>
  )
}
