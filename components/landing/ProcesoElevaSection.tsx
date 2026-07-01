"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { CheckCircle, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { useLang } from "@/lib/i18n"

const PHASES_ES = [
  {
    number: "01",
    duration: "Semanas 1–2 · ~40 hrs",
    title: "Diagnóstico y diseño",
    color: "violet" as const,
    accent: "border-violet-500/40 bg-violet-600/5",
    tag: "text-violet-400",
    pillActive: "bg-violet-600 text-white",
    pillInactive: "text-violet-400 border border-violet-500/30",
    summary: "Antes de escribir una sola línea de configuración, entendemos tu centro a fondo: tu metodología, tus generaciones, cómo cobras, cómo sigues, qué sabes y qué no sabes de tu operación.",
    groups: [
      {
        title: "Sesiones de diagnóstico",
        icon: "🔍",
        items: [
          "Entrevista de diagnóstico con el fundador/director · 3 hrs",
          "Mapeo completo de metodología: fases, entrenamientos, cohortes · 4 hrs",
          "Auditoría de herramientas actuales: Excel, WhatsApp, Google Sheets · 3 hrs",
          "Identificación de cuellos de botella y pérdidas operativas · 2 hrs",
          "Definición de KPIs prioritarios del centro · 2 hrs",
        ],
      },
      {
        title: "Diseño del sistema",
        icon: "🧩",
        items: [
          "Diseño del modelo de datos: cohortes, fases, expedientes · 5 hrs",
          "Configuración de ELEVA: naming, branding, estructura de fases · 8 hrs",
          "Migración de base de datos existente: participantes, historial, pagos · 10 hrs",
          "Diseño de automatizaciones: bienvenida, recordatorios, alertas de riesgo · 3 hrs",
        ],
      },
      {
        title: "Integraciones técnicas",
        icon: "⚙️",
        items: [
          "Setup WhatsApp Business API + plantillas aprobadas · 3 hrs",
          "Configuración de email transaccional + campañas · 2 hrs",
          "Conexión con pasarela de pagos o sistema de cobro actual · 3 hrs",
          "Pruebas de flujo completo antes de activar con el equipo · 2 hrs",
        ],
      },
    ],
  },
  {
    number: "02",
    duration: "Semanas 3–6 · ~50 hrs",
    title: "Implementación activa",
    color: "cyan" as const,
    accent: "border-cyan-500/40 bg-cyan-600/5",
    tag: "text-cyan-400",
    pillActive: "bg-cyan-600 text-white",
    pillInactive: "text-cyan-400 border border-cyan-500/30",
    summary: "El sistema ya está configurado. Ahora tu equipo lo usa en tiempo real mientras nosotros estamos al lado. No se capacita en vacío: se capacita operando.",
    groups: [
      {
        title: "Capacitación del equipo",
        icon: "🎓",
        items: [
          "Taller staff operativo: registro, CRM, pagos, tickets · 4 hrs",
          "Taller coaches: expediente, brief pre-entrenamiento, misiones · 3 hrs",
          "Taller dueño/director: dashboard, finanzas, IA, anomalías · 2 hrs",
          "Manual de operación entregado por escrito · 3 hrs redacción",
          "Sesión de preguntas y ajustes con todo el equipo · 2 hrs",
        ],
      },
      {
        title: "Sistema activo con datos reales",
        icon: "🚀",
        items: [
          "Onboarding de las primeras generaciones al sistema · 6 hrs",
          "Configuración de campañas iniciales activas: bienvenida, cobranza, reactivación · 8 hrs",
          "Automatizaciones encendidas: WhatsApp de bienvenida, alertas de riesgo · 4 hrs",
          "Dashboard del dueño configurado con datos reales del primer mes · 3 hrs",
        ],
      },
      {
        title: "Acompañamiento semanal",
        icon: "📡",
        items: [
          "Sesión semanal de revisión con el equipo · 4 × 1 hr",
          "Monitoreo de primeras semanas: errores, fricciones, ajustes · 8 hrs",
          "Soporte directo por WhatsApp durante las 4 semanas · continuo",
          "Ajustes de configuración basados en uso real · 3 hrs",
        ],
      },
    ],
  },
  {
    number: "03",
    duration: "Semanas 7–8 · ~20 hrs",
    title: "Lanzamiento",
    color: "emerald" as const,
    accent: "border-emerald-500/40 bg-emerald-600/5",
    tag: "text-emerald-400",
    pillActive: "bg-emerald-600 text-white",
    pillInactive: "text-emerald-400 border border-emerald-500/30",
    summary: "El sistema ya corre solo. El equipo ya lo usa con confianza. Es momento de abrir las puertas: coaches y participantes entran al sistema de forma oficial.",
    groups: [
      {
        title: "Lanzamiento interno",
        icon: "🎯",
        items: [
          "Sesión de lanzamiento con coaches: presentación del panel y brief · 2 hrs",
          "Comunicación oficial al equipo: roles, accesos, flujos · 2 hrs",
          "Verificación de datos, accesos y permisos por rol · 2 hrs",
          "Simulacro de operación completa antes de abrir a participantes · 3 hrs",
        ],
      },
      {
        title: "Lanzamiento a participantes",
        icon: "🌟",
        items: [
          "Onboarding de participantes activos a la app/portal · 4 hrs",
          "Campaña de bienvenida al sistema: email + WhatsApp · 2 hrs",
          "Acompañamiento en las primeras 48 horas post-lanzamiento · 2 hrs",
          "Sesión de celebración y cierre del proceso de implementación · 1 hr",
        ],
      },
      {
        title: "Entrega y cierre",
        icon: "✅",
        items: [
          "Revisión de KPIs primera semana real en producción · 2 hrs",
          "Reporte de implementación: qué se hizo, qué sigue, qué medir · 2 hrs",
          "Activación del plan de mantenimiento mensual · 1 hr",
          "Sesión estratégica de 90 días: metas de crecimiento con el sistema · 1 hr",
        ],
      },
    ],
  },
]

const PHASES_EN = [
  {
    number: "01",
    duration: "Weeks 1–2 · ~40 hrs",
    title: "Diagnosis & design",
    color: "violet" as const,
    accent: "border-violet-500/40 bg-violet-600/5",
    tag: "text-violet-400",
    pillActive: "bg-violet-600 text-white",
    pillInactive: "text-violet-400 border border-violet-500/30",
    summary: "Before writing a single line of configuration, we understand your center in depth: your methodology, your generations, how you charge, how you follow up, what you know and don't know about your operation.",
    groups: [
      {
        title: "Diagnosis sessions",
        icon: "🔍",
        items: [
          "Diagnostic interview with the founder/director · 3 hrs",
          "Full methodology mapping: phases, training sessions, cohorts · 4 hrs",
          "Current tools audit: Excel, WhatsApp, Google Sheets · 3 hrs",
          "Bottleneck and operational loss identification · 2 hrs",
          "Priority KPI definition for the center · 2 hrs",
        ],
      },
      {
        title: "System design",
        icon: "🧩",
        items: [
          "Data model design: cohorts, phases, participant files · 5 hrs",
          "ELEVA configuration: naming, branding, phase structure · 8 hrs",
          "Existing database migration: participants, history, payments · 10 hrs",
          "Automation design: welcome, reminders, risk alerts · 3 hrs",
        ],
      },
      {
        title: "Technical integrations",
        icon: "⚙️",
        items: [
          "WhatsApp Business API setup + approved templates · 3 hrs",
          "Transactional email configuration + campaigns · 2 hrs",
          "Payment gateway or existing billing system connection · 3 hrs",
          "Full flow testing before activating with the team · 2 hrs",
        ],
      },
    ],
  },
  {
    number: "02",
    duration: "Weeks 3–6 · ~50 hrs",
    title: "Active implementation",
    color: "cyan" as const,
    accent: "border-cyan-500/40 bg-cyan-600/5",
    tag: "text-cyan-400",
    pillActive: "bg-cyan-600 text-white",
    pillInactive: "text-cyan-400 border border-cyan-500/30",
    summary: "The system is configured. Now your team uses it in real time while we're right beside them. Training doesn't happen in a vacuum — it happens while operating.",
    groups: [
      {
        title: "Team training",
        icon: "🎓",
        items: [
          "Operational staff workshop: enrollment, CRM, payments, tickets · 4 hrs",
          "Coach workshop: participant file, pre-training brief, missions · 3 hrs",
          "Owner/director workshop: dashboard, finances, AI, anomalies · 2 hrs",
          "Operations manual delivered in writing · 3 hrs writing",
          "Q&A and adjustment session with the full team · 2 hrs",
        ],
      },
      {
        title: "Live system with real data",
        icon: "🚀",
        items: [
          "First generations onboarded to the system · 6 hrs",
          "Initial active campaign configuration: welcome, billing, reactivation · 8 hrs",
          "Automations live: WhatsApp welcome, risk alerts · 4 hrs",
          "Owner dashboard configured with real first-month data · 3 hrs",
        ],
      },
      {
        title: "Weekly accompaniment",
        icon: "📡",
        items: [
          "Weekly review session with the team · 4 × 1 hr",
          "First-week monitoring: errors, friction, adjustments · 8 hrs",
          "Direct WhatsApp support during all 4 weeks · ongoing",
          "Configuration adjustments based on real usage · 3 hrs",
        ],
      },
    ],
  },
  {
    number: "03",
    duration: "Weeks 7–8 · ~20 hrs",
    title: "Launch",
    color: "emerald" as const,
    accent: "border-emerald-500/40 bg-emerald-600/5",
    tag: "text-emerald-400",
    pillActive: "bg-emerald-600 text-white",
    pillInactive: "text-emerald-400 border border-emerald-500/30",
    summary: "The system runs on its own. The team uses it with confidence. It's time to open the doors: coaches and participants enter the system officially.",
    groups: [
      {
        title: "Internal launch",
        icon: "🎯",
        items: [
          "Launch session with coaches: panel and brief presentation · 2 hrs",
          "Official team communication: roles, access, workflows · 2 hrs",
          "Data, access and role-based permission verification · 2 hrs",
          "Full operation simulation before opening to participants · 3 hrs",
        ],
      },
      {
        title: "Participant launch",
        icon: "🌟",
        items: [
          "Active participant onboarding to the app/portal · 4 hrs",
          "System welcome campaign: email + WhatsApp · 2 hrs",
          "Support during the first 48 hours post-launch · 2 hrs",
          "Celebration and implementation closing session · 1 hr",
        ],
      },
      {
        title: "Handoff & close",
        icon: "✅",
        items: [
          "KPI review during first real production week · 2 hrs",
          "Implementation report: what was done, what's next, what to measure · 2 hrs",
          "Monthly maintenance plan activation · 1 hr",
          "90-day strategy session: growth goals with the system · 1 hr",
        ],
      },
    ],
  },
]

export function ProcesoElevaSection() {
  const { lang } = useLang()
  const [activePhase, setActivePhase] = useState<0 | 1 | 2>(0)

  const phases = lang === "en" ? PHASES_EN : PHASES_ES
  const phase = phases[activePhase]
  const accentTag = phase.color === "violet" ? "text-violet-400" : phase.color === "cyan" ? "text-cyan-400" : "text-emerald-400"

  const c = lang === "en" ? {
    eyebrow: "The ELEVA process",
    h2a: "From 0 to operational",
    h2b: "in 60 days or less.",
    sub: "We don't just give you the software. We analyze your center, design the system, train your team and accompany the launch. Every hour of the process is accounted for, because your time is the most expensive resource.",
    timeline: [
      { label: "Wk 1–2", desc: "Diagnosis + system design", color: "bg-violet-700" },
      { label: "Wk 3–4", desc: "Training + live system", color: "bg-violet-500" },
      { label: "Wk 5–6", desc: "Real use + data adjustments", color: "bg-cyan-600" },
      { label: "Wk 7–8", desc: "Launch to coaches and participants", color: "bg-emerald-600" },
    ],
    demoCta: "See the system in action",
    demoSub: "Interactive demo available now · No registration required",
  } : {
    eyebrow: "El proceso ELEVA",
    h2a: "De 0 a operativo",
    h2b: "en máximo 60 días.",
    sub: "No solo te damos el software. Analizamos tu centro, diseñamos el sistema, capacitamos a tu equipo y acompañamos el lanzamiento. Cada hora del proceso está contada, porque tu tiempo es el recurso más caro.",
    timeline: [
      { label: "Sem 1–2", desc: "Diagnóstico + diseño del sistema", color: "bg-violet-700" },
      { label: "Sem 3–4", desc: "Capacitación + sistema activo", color: "bg-violet-500" },
      { label: "Sem 5–6", desc: "Uso real + ajustes con datos", color: "bg-cyan-600" },
      { label: "Sem 7–8", desc: "Lanzamiento a coaches y participantes", color: "bg-emerald-600" },
    ],
    demoCta: "Ver el sistema en acción",
    demoSub: "Demo interactivo disponible ahora · Sin registro",
  }

  return (
    <section className="px-6 py-20 max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-14"
      >
        <p className="text-xs uppercase tracking-widest text-violet-400 font-semibold mb-4">{c.eyebrow}</p>
        <h2 className="text-4xl sm:text-5xl font-black text-foreground">
          {c.h2a}<br className="hidden sm:block" /> {c.h2b}
        </h2>
        <p className="text-muted-foreground mt-4 max-w-2xl mx-auto text-lg leading-relaxed">
          {c.sub}
        </p>
      </motion.div>

      {/* Phase selector */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center mb-10">
        {phases.map((p, i) => (
          <button
            key={p.number}
            onClick={() => setActivePhase(i as 0 | 1 | 2)}
            className={cn(
              "flex items-center gap-3 px-5 py-3 rounded-xl text-sm font-semibold transition-all border",
              activePhase === i ? p.pillActive : `bg-transparent ${p.pillInactive}`
            )}
          >
            <span className={cn("font-black text-lg leading-none", activePhase === i ? "opacity-60" : "")}>{p.number}</span>
            <div className="text-left">
              <p className="leading-none">{p.title}</p>
              <p className={cn("text-[10px] mt-0.5 font-normal", activePhase === i ? "opacity-70" : "opacity-60")}>{p.duration}</p>
            </div>
          </button>
        ))}
      </div>

      {/* Phase content */}
      <motion.div
        key={activePhase}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className={cn("glass rounded-2xl border p-6 sm:p-8 space-y-6", phase.accent)}
      >
        <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">{phase.summary}</p>
        <div className="grid sm:grid-cols-3 gap-6">
          {phase.groups.map((g) => (
            <div key={g.title}>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl">{g.icon}</span>
                <p className="font-bold text-foreground text-sm">{g.title}</p>
              </div>
              <ul className="space-y-2">
                {g.items.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm">
                    <CheckCircle className={cn("w-3.5 h-3.5 flex-shrink-0 mt-0.5", accentTag)} />
                    <span className="text-foreground/80 leading-snug">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Timeline strip */}
      <div className="mt-8 flex items-center gap-0 overflow-hidden rounded-xl">
        {c.timeline.map((t, i) => (
          <div key={t.label} className={cn("flex-1 p-3 text-center", t.color, i < 3 && "border-r border-white/20")}>
            <p className="text-[10px] font-bold text-white">{t.label}</p>
            <p className="text-[9px] text-white/70 mt-0.5 leading-tight hidden sm:block">{t.desc}</p>
          </div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="mt-8 text-center"
      >
        <Link
          href="/vl2026/pulso"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-lg transition-all"
        >
          {c.demoCta} <ArrowRight className="w-5 h-5" />
        </Link>
        <p className="text-muted-foreground text-sm mt-3">{c.demoSub}</p>
      </motion.div>
    </section>
  )
}
