"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight, Users, TrendingUp, Trophy, ChevronDown, CheckCircle, AlertTriangle, Zap } from "lucide-react"
import Link from "next/link"
import { useLang } from "@/lib/i18n"
import { cn } from "@/lib/utils"

// ─── Score bar ────────────────────────────────────────────────────────────────

function ScoreBar({ label, pct, color, note, weight }: {
  label: string; pct: number; color: string; note: string; weight: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      className="space-y-1.5"
    >
      <div className="flex items-center justify-between gap-2">
        <div>
          <span className="text-xs font-semibold text-foreground/90">{label}</span>
          <span className="ml-2 text-[10px] text-foreground/40">{note}</span>
        </div>
        <span className={`text-xs font-black tabular-nums ${color}`}>{weight}</span>
      </div>
      <div className="h-2 bg-foreground/8 rounded-full overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${color.replace("text-", "bg-")}`}
          initial={{ width: 0 }}
          whileInView={{ width: `${pct}%` }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
        />
      </div>
    </motion.div>
  )
}

// ─── Funnel step ──────────────────────────────────────────────────────────────

function FunnelStep({ icon: Icon, color, label, sub, n }: {
  icon: React.ComponentType<{ className?: string }>
  color: string; label: string; sub: string; n: string
}) {
  return (
    <div className="flex flex-col items-center text-center gap-2 flex-1 min-w-0">
      <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center flex-shrink-0
        ${color === "cyan" ? "bg-cyan-500/12 border-cyan-500/25" :
          color === "violet" ? "bg-violet-500/12 border-violet-500/25" :
          color === "amber" ? "bg-amber-500/12 border-amber-500/25" :
          "bg-emerald-500/12 border-emerald-500/25"}`}>
        <Icon className={`w-5 h-5 ${
          color === "cyan" ? "text-cyan-400" :
          color === "violet" ? "text-violet-400" :
          color === "amber" ? "text-amber-400" :
          "text-emerald-400"}`} />
      </div>
      <p className={`text-2xl font-black leading-none ${
        color === "cyan" ? "text-cyan-400" :
        color === "violet" ? "text-violet-400" :
        color === "amber" ? "text-amber-400" :
        "text-emerald-400"}`}>{n}</p>
      <div>
        <p className="text-xs font-bold text-foreground leading-snug">{label}</p>
        <p className="text-[10px] text-foreground/50 mt-0.5 leading-snug">{sub}</p>
      </div>
    </div>
  )
}

// ─── Expandable detail ────────────────────────────────────────────────────────

function Detail({ label, children }: { label: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-t border-foreground/8 first:border-0">
      <button onClick={() => setOpen(p => !p)}
        className="w-full flex items-center justify-between gap-3 py-3 text-left group">
        <span className="text-xs text-foreground/60 group-hover:text-foreground/90 transition-colors">{label}</span>
        <ChevronDown className={cn("w-3.5 h-3.5 text-foreground/30 flex-shrink-0 transition-transform", open && "rotate-180")} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <p className="text-[11px] text-foreground/50 leading-relaxed pb-3 pr-4">{children}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── Section ──────────────────────────────────────────────────────────────────

export function GrowthEngineSection({ compact = false }: { compact?: boolean }) {
  const { lang } = useLang()

  const c = lang === "en" ? {
    badge: "The growth engine nobody explains",
    title: "The numbers nobody tells you about",
    sub: "Your growth doesn't come from advertising. It comes from your own Level 3 participants. Here's the exact engine, and why it breaks when you don't have operational visibility.",

    funnelTitle: "The invisible pipeline",
    funnelSub: "Every Level 3 cohort generates the next Level 1 class. Automatically, if the system holds.",
    f1label: "Level 3 active", f1sub: "3–4 months · 3 enrollment weekends",
    f2label: "Enrolled for Basic", f2sub: "From the 3 active weekends",
    f3label: "Show up 15 days later", f3sub: "With ops follow-up",
    f4label: "Future Level 3", f4sub: "Pipeline 3–4 months out",

    gapTitle: "The gap nobody measures",
    gapSub: "Between 'they enrolled' and 'they actually showed up,' thousands of dollars walk out the door every cycle.",
    without: "Without system",
    with: "With ELEVA follow-up",
    gapLabel: "per enrollment weekend",
    gapNote: "200 enrolled × 11 extra people × avg Level 1 price (~$1,000 USD)",

    scoreTitle: "What actually drives graduation",
    scoreSub: "A participant who sees their real-time score works differently. ELEVA makes it visible.",
    s1: "Enrollments", s1n: "People they invited who showed up",
    s2: "Attendance", s2n: "Weekend and activity presence",
    s3: "Goals completed", s3n: "Individual progress milestones",
    s4: "Coaching calls", s4n: "1-on-1 calls completed",
    scoreInsight: "Enrollment carries 40%+ of the final score. This is the most powerful motivation lever, and the least visible without a system.",

    elvTitle: "ELEVA at every stage",
    el1: "Real-time graduation score", el1d: "Each Level 3 participant sees their score update live, enrollments, attendance, goals. The motivation to graduate becomes concrete and measurable, not just a promise.",
    el2: "Confirmation follow-up", el2d: "Who enrolled for Level 1 but hasn't confirmed? ELEVA automatically flags them and triggers the ops team 7, 3, and 1 days before training.",
    el3: "No-show prevention", el3d: "Automated reminder sequences start 15 days before the training date. WhatsApp, email, SMS, configured for the center's rhythm. The goal: 95%+ show-up.",

    cta: "Model your enrollment funnel",

    d1label: "Why does Level 3 have 3 enrollment weekends?",
    d1: "Multiple Level 3 cohorts run simultaneously, one in weekend 1, another in weekend 2, another in weekend 3. This means any given enrollment weekend has all active cohorts working in parallel. The 4th weekend is graduation, contingent on reaching the score threshold.",
    d2label: "Why does enrollment carry 40%+ of the score?",
    d2: "The program philosophy is explicit: 'What's the point of transforming your life if the people around you don't speak the same language?' Enrollment isn't a sales exercise, it's proof that the participant believes deeply enough in what they've experienced to share it with someone they care about.",
    d3label: "What is the Level 1 weekend schedule?",
    d3: "Level 1 (Basic) runs Friday through Sunday, roughly 10am to 10am, an intensive immersive experience. The enrolled participant pays before showing up. The critical window is the 15 days between enrollment and training: this is when people second-guess, get busy, or simply forget they committed.",
  } : {
    badge: "El motor de crecimiento que nadie explica",
    title: "Los números de los que nadie te habla",
    sub: "Tu crecimiento no viene de publicidad. Viene de tus propios participantes de Nivel 3. Aquí está el motor exacto, y por qué se rompe cuando no tienes visibilidad operativa.",

    funnelTitle: "El pipeline invisible",
    funnelSub: "Cada cohorte de Nivel 3 produce la próxima generación de Nivel 1. Automáticamente, si el sistema aguanta.",
    f1label: "Nivel 3 activo", f1sub: "3–4 meses · 3 fines de enrolamiento",
    f2label: "Inscritos al Básico", f2sub: "De los 3 fines activos",
    f3label: "Se presentan 15 días después", f3sub: "Con seguimiento de operaciones",
    f4label: "Futuros Nivel 3", f4sub: "Pipeline a 3–4 meses vista",

    gapTitle: "El gap que nadie mide",
    gapSub: "Entre 'se inscribieron' y 'llegaron al entrenamiento', miles de dólares se pierden cada ciclo.",
    without: "Sin sistema",
    with: "Con seguimiento ELEVA",
    gapLabel: "por fin de semana de enrolamiento",
    gapNote: "200 inscritos × 11 personas extra × precio promedio Nivel 1 (~$1,000 USD)",

    scoreTitle: "Lo que mueve el puntaje de graduación",
    scoreSub: "Un participante que ve su puntaje en tiempo real trabaja diferente. ELEVA lo hace visible.",
    s1: "Enrolados", s1n: "Personas que invitó y llegaron",
    s2: "Asistencia", s2n: "Presencia en fines y actividades",
    s3: "Metas completadas", s3n: "Objetivos individuales cumplidos",
    s4: "Coaching calls", s4n: "Llamadas 1-a-1 completadas",
    scoreInsight: "El enrolamiento pesa +40% del puntaje final. Es la palanca de motivación más poderosa, y la menos visible sin un sistema.",

    elvTitle: "ELEVA en cada etapa",
    el1: "Puntaje de graduación en tiempo real", el1d: "Cada participante de Nivel 3 ve su puntaje actualizarse en vivo, enrolados, asistencia, metas. La motivación para graduarse se vuelve concreta y medible, no solo una promesa.",
    el2: "Seguimiento de confirmaciones", el2d: "¿Quién se inscribió al Nivel 1 pero no confirmó? ELEVA los marca automáticamente y activa al equipo de operaciones 7, 3 y 1 días antes del entrenamiento.",
    el3: "Prevención de no-shows", el3d: "Secuencias de recordatorio automáticas empiezan 15 días antes de la fecha del entrenamiento. WhatsApp, email, SMS, configurados para el ritmo del centro. El objetivo: 95%+ de presencia.",

    cta: "Modelar mi funnel de enrolamiento",

    d1label: "¿Por qué Nivel 3 tiene 3 fines de enrolamiento?",
    d1: "Varias cohortes de Nivel 3 corren simultáneamente, una en el fin 1, otra en el fin 2, otra en el fin 3. Esto significa que en cualquier fin de enrolamiento activo hay todos los cohortes trabajando en paralelo. El 4to fin es la graduación, condicionada a alcanzar el puntaje.",
    d2label: "¿Por qué el enrolamiento vale +40% del puntaje?",
    d2: "La filosofía del programa es explícita: '¿De qué sirve transformar tu vida si la gente a tu alrededor no habla ese mismo idioma?' El enrolamiento no es un ejercicio de ventas, es la prueba de que el participante cree profundamente en lo que vivió y quiere compartirlo con alguien que le importa.",
    d3label: "¿Cómo es el fin de semana de Nivel 1?",
    d3: "El Nivel 1 (Básico) es de viernes a domingo, aproximadamente de 10am a 10am del domingo, una experiencia de inmersión intensiva. El invitado paga antes de llegar. La ventana crítica son los 15 días entre la inscripción y el entrenamiento: es cuando la gente duda, se ocupa o simplemente olvida que se comprometió.",
  }

  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0A0A14] via-[#0C0A18] to-[#0A0E14]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_40%_at_30%_60%,rgba(6,182,212,0.06),transparent)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_80%_20%,rgba(124,58,237,0.08),transparent)]" />
      <div className="section-rule absolute top-0 left-0 right-0" />

      <div className="relative max-w-5xl mx-auto px-6 space-y-20">

        {/* ── Header ── */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <span className="inline-block text-[10px] font-black uppercase tracking-[0.2em] text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-3 py-1.5 rounded-full mb-6">
            {c.badge}
          </span>
          <h2 className="text-5xl sm:text-6xl font-black text-foreground leading-[1.05] mb-5">
            {c.title}
          </h2>
          <p className="text-foreground/65 text-lg leading-relaxed max-w-2xl">{c.sub}</p>
        </motion.div>

        {/* ── Funnel flow ── */}
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="rounded-2xl border border-foreground/10 bg-foreground/3 p-6 sm:p-8">
          <p className="text-xs font-black uppercase tracking-widest text-foreground/40 mb-1">{c.funnelTitle}</p>
          <p className="text-sm text-foreground/60 mb-8 max-w-lg">{c.funnelSub}</p>

          {/* Steps */}
          <div className="flex items-start gap-2 sm:gap-4">
            <FunnelStep icon={Users}      color="violet" n="3"   label={c.f1label} sub={c.f1sub} />
            <div className="flex items-center self-center pb-8 text-foreground/20 text-lg flex-shrink-0">→</div>
            <FunnelStep icon={TrendingUp} color="cyan"   n="200" label={c.f2label} sub={c.f2sub} />
            <div className="flex items-center self-center pb-8 text-foreground/20 text-lg flex-shrink-0">→</div>
            <FunnelStep icon={CheckCircle}color="amber"  n="190" label={c.f3label} sub={c.f3sub} />
            <div className="flex items-center self-center pb-8 text-foreground/20 text-lg flex-shrink-0">→</div>
            <FunnelStep icon={Trophy}     color="emerald" n="↑"  label={c.f4label} sub={c.f4sub} />
          </div>

          {/* Detail expandables */}
          <div className="mt-8 pt-4 border-t border-foreground/8">
            <Detail label={c.d1label}>{c.d1}</Detail>
            <Detail label={c.d3label}>{c.d3}</Detail>
          </div>
        </motion.div>

        {/* ── Gap visualization ── */}
        <div className={compact ? "block" : "grid grid-cols-1 md:grid-cols-2 gap-6"}>

          <motion.div initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
            className="rounded-2xl border border-foreground/10 bg-foreground/3 p-6 space-y-6">
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-foreground/40 mb-1">{c.gapTitle}</p>
              <p className="text-sm text-foreground/60 leading-relaxed">{c.gapSub}</p>
            </div>

            {/* Bar comparison */}
            <div className="space-y-4">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-foreground/50">{c.without}</span>
                  <span className="font-black text-red-400">84% · 168/200</span>
                </div>
                <div className="h-3 bg-foreground/8 rounded-full overflow-hidden">
                  <motion.div className="h-full bg-red-500/60 rounded-full"
                    initial={{ width: 0 }}
                    whileInView={{ width: "84%" }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, ease: "easeOut" }} />
                </div>
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-foreground/50">{c.with}</span>
                  <span className="font-black text-violet-400">95% · 190/200</span>
                </div>
                <div className="h-3 bg-foreground/8 rounded-full overflow-hidden">
                  <motion.div className="h-full bg-violet-500 rounded-full"
                    initial={{ width: 0 }}
                    whileInView={{ width: "95%" }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, ease: "easeOut", delay: 0.15 }} />
                </div>
              </div>
            </div>

            {/* Revenue gap */}
            <div className="rounded-xl bg-violet-500/8 border border-violet-500/20 p-4">
              <p className="text-[10px] text-violet-400/70 font-semibold uppercase tracking-widest mb-1">{c.gapLabel}</p>
              <p className="text-3xl font-black text-violet-400 tabular-nums">+$11k–$22k</p>
              <p className="text-[10px] text-foreground/35 mt-1.5 leading-snug">{c.gapNote}</p>
            </div>
          </motion.div>

          {/* Score breakdown, hidden in compact mode */}
          {!compact && (
            <motion.div initial={{ opacity: 0, x: 16 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
              className="rounded-2xl border border-foreground/10 bg-foreground/3 p-6 space-y-5">
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-foreground/40 mb-1">{c.scoreTitle}</p>
                <p className="text-sm text-foreground/60 leading-relaxed">{c.scoreSub}</p>
              </div>
              <div className="space-y-4">
                <ScoreBar label={c.s1} pct={45} color="text-amber-400" note={c.s1n} weight="40–50%" />
                <ScoreBar label={c.s2} pct={25} color="text-cyan-400"   note={c.s2n} weight="25%" />
                <ScoreBar label={c.s3} pct={20} color="text-violet-400" note={c.s3n} weight="20%" />
                <ScoreBar label={c.s4} pct={15} color="text-emerald-400"note={c.s4n} weight="15%" />
              </div>
              <div className="rounded-xl bg-amber-500/8 border border-amber-500/20 p-3">
                <p className="text-[11px] text-amber-400/80 leading-relaxed font-medium">{c.scoreInsight}</p>
                <Detail label={c.d2label}><span className="text-foreground/50">{c.d2}</span></Detail>
              </div>
            </motion.div>
          )}
        </div>

        {/* ── ELEVA's role, hidden in compact mode ── */}
        {!compact && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { icon: Trophy,        color: "amber",   title: c.el1, body: c.el1d },
              { icon: AlertTriangle, color: "violet",  title: c.el2, body: c.el2d },
              { icon: Zap,           color: "emerald", title: c.el3, body: c.el3d },
            ].map(({ icon: Icon, color, title, body }, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className={`rounded-2xl border p-5 space-y-3
                  ${color === "amber"   ? "bg-amber-500/6 border-amber-500/20" :
                    color === "violet"  ? "bg-violet-500/6 border-violet-500/20" :
                    "bg-emerald-500/6 border-emerald-500/20"}`}
              >
                <div className={`w-9 h-9 rounded-xl border flex items-center justify-center
                  ${color === "amber"   ? "bg-amber-500/12 border-amber-500/25" :
                    color === "violet"  ? "bg-violet-500/12 border-violet-500/25" :
                    "bg-emerald-500/12 border-emerald-500/25"}`}>
                  <Icon className={`w-4 h-4
                    ${color === "amber" ? "text-amber-400" :
                      color === "violet" ? "text-violet-400" :
                      "text-emerald-400"}`} />
                </div>
                <p className="text-sm font-bold text-foreground leading-snug">{title}</p>
                <p className="text-xs text-foreground/55 leading-relaxed">{body}</p>
              </motion.div>
            ))}
          </div>
        )}

        {/* ── CTA ── */}
        <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="text-center">
          <Link href="/simulador#enrolamiento">
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-2 px-8 py-4 bg-violet-600 hover:bg-violet-700 text-foreground rounded-xl text-sm font-bold transition-colors shadow-lg shadow-violet-600/25">
              {c.cta}
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </Link>
        </motion.div>

      </div>

      <div className="section-rule absolute bottom-0 left-0 right-0" />
    </section>
  )
}
