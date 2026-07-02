"use client"

import { useState, useTransition } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import {
  ArrowLeft, ArrowRight, Check, Calendar, Users, TrendingUp,
  GraduationCap, LayoutDashboard, ShieldCheck, Building2,
  MessageCircle, BarChart3, Globe, Sparkles, Loader2,
} from "lucide-react"
import { cn } from "@/lib/utils"

// ─── Types ────────────────────────────────────────────────────────────────────

type Answers = {
  centro: string
  ciudad: string
  anos: string
  generaciones: string
  participantes: string
  entrenadores: string
  sistema: string
  retos: string[]
  sedes: string
  inversion: string
  nombre: string
  email: string
}

const EMPTY: Answers = {
  centro: "", ciudad: "", anos: "", generaciones: "", participantes: "",
  entrenadores: "", sistema: "", retos: [], sedes: "", inversion: "",
  nombre: "", email: "",
}

// ─── Step data ────────────────────────────────────────────────────────────────

const ANOS = [
  { id: "<1",  label: "Menos de 1 año",  sub: "Estamos arrancando" },
  { id: "1-3", label: "1 a 3 años",      sub: "Primeras generaciones consolidadas" },
  { id: "3-7", label: "3 a 7 años",      sub: "Centro establecido" },
  { id: "7+",  label: "7 años o más",    sub: "Operación madura con historia" },
]

const GENERACIONES = [
  { id: "1-2", label: "1 a 2 por año" },
  { id: "3-4", label: "3 a 4 por año" },
  { id: "5-6", label: "5 a 6 por año" },
  { id: "7+",  label: "7 o más por año" },
]

const PARTICIPANTES = [
  { id: "<30",   label: "Menos de 30" },
  { id: "30-80", label: "30 a 80" },
  { id: "80-150",label: "80 a 150" },
  { id: "150+",  label: "150 o más" },
]

const ENTRENADORES = [
  { id: "propios",   label: "Tenemos entrenadores propios formados",   sub: "Formados dentro del centro" },
  { id: "externos",  label: "Dependemos de entrenadores externos",      sub: "Freelancers o consultores" },
  { id: "mixto",     label: "Mezcla de propios y externos",             sub: "Combinación de ambos" },
  { id: "ninguno",   label: "Sin equipo de entrenadores definido",      sub: "El dueño es el entrenador principal" },
]

const SISTEMAS = [
  { id: "whatsapp", label: "WhatsApp + Excel",        sub: "El combo más común en la industria" },
  { id: "crm",      label: "CRM genérico",            sub: "HubSpot, Salesforce u otro no especializado" },
  { id: "nada",     label: "Sin sistema claro",        sub: "Todo en la memoria del equipo" },
  { id: "mix",      label: "Mix de herramientas",     sub: "Varias apps poco integradas" },
]

const RETOS = [
  { id: "entrenadores",  icon: GraduationCap, label: "Formar entrenadores internos",    color: "violet" },
  { id: "staff",         icon: Users,         label: "Estructurar staff y roles",        color: "blue" },
  { id: "seguimiento",   icon: MessageCircle, label: "Seguimiento post-entrenamiento",   color: "emerald" },
  { id: "pl",            icon: ShieldCheck,   label: "Continuidad post-PL",              color: "amber" },
  { id: "datos",         icon: BarChart3,     label: "Datos y dashboards",               color: "blue" },
  { id: "sedes",         icon: Building2,     label: "Expansión a nuevas sedes",         color: "emerald" },
  { id: "revenue",       icon: TrendingUp,    label: "Revenue y nuevas fuentes de ingreso", color: "violet" },
  { id: "comunidad",     icon: Globe,         label: "Comunidad y retención activa",     color: "amber" },
]

const RETO_COLOR: Record<string, string> = {
  violet:  "border-violet-500/40 bg-violet-500/10 text-violet-300",
  blue:    "border-blue-500/40 bg-blue-500/10 text-blue-300",
  emerald: "border-emerald-500/40 bg-emerald-500/10 text-emerald-300",
  amber:   "border-amber-500/40 bg-amber-500/10 text-amber-300",
}

const SEDES = [
  { id: "si",         label: "Sí, es una prioridad" },
  { id: "evaluando",  label: "Lo estamos evaluando" },
  { id: "no",         label: "Por ahora no" },
]

const INVERSION = [
  { id: "<5k",    label: "Menos de USD $5,000" },
  { id: "5-15k",  label: "USD $5,000 – $15,000" },
  { id: "15-30k", label: "USD $15,000 – $30,000" },
  { id: "30k+",   label: "USD $30,000 o más" },
]

const TOTAL_STEPS = 5

// ─── Helpers ──────────────────────────────────────────────────────────────────

function isStepValid(step: number, a: Answers): boolean {
  if (step === 0) return a.centro.trim().length > 1 && a.ciudad.trim().length > 1 && !!a.anos
  if (step === 1) return !!a.generaciones && !!a.participantes
  if (step === 2) return !!a.entrenadores && !!a.sistema
  if (step === 3) return a.retos.length > 0
  if (step === 4) return !!a.sedes && !!a.inversion && a.nombre.trim().length > 1 && a.email.includes("@")
  return false
}

// ─── Small UI pieces ──────────────────────────────────────────────────────────

function PillCard({ id, label, sub, selected, onSelect }: {
  id: string; label: string; sub?: string; selected: boolean; onSelect: () => void
}) {
  return (
    <button
      onClick={onSelect}
      className={cn(
        "relative text-left rounded-xl p-4 border transition-all",
        selected
          ? "border-violet-500/55 bg-violet-500/10"
          : "border-white/8 bg-white/3 hover:border-white/18 hover:bg-white/5"
      )}
    >
      {selected && (
        <div className="absolute top-3 right-3 w-4.5 h-4.5 rounded-full bg-violet-600 flex items-center justify-center">
          <Check className="w-2.5 h-2.5 text-white" />
        </div>
      )}
      <p className={cn("font-bold text-sm", selected ? "text-white" : "text-foreground")}>{label}</p>
      {sub && <p className="text-xs text-muted-foreground mt-0.5 leading-snug">{sub}</p>}
    </button>
  )
}

function TextInput({ label, placeholder, value, onChange, type = "text" }: {
  label: string; placeholder: string; value: string;
  onChange: (v: string) => void; type?: string
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-white/4 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-muted-foreground/50 focus:outline-none focus:border-violet-500/50 focus:bg-white/6 transition-all"
      />
    </div>
  )
}

// ─── Success screen ───────────────────────────────────────────────────────────

function SuccessScreen({ nombre, centro }: { nombre: string; centro: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="text-center space-y-7 py-8"
    >
      <div className="w-16 h-16 rounded-2xl bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center mx-auto">
        <Check className="w-8 h-8 text-emerald-400" />
      </div>
      <div className="space-y-3">
        <p className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Solicitud recibida</p>
        <h2 className="text-3xl sm:text-4xl font-black text-white leading-tight">
          Gracias, {nombre.split(" ")[0]}.
        </h2>
        <p className="text-muted-foreground text-base leading-relaxed max-w-md mx-auto">
          El equipo de ELEVA revisará la información de <span className="text-white font-semibold">{centro}</span> y se pondrá en contacto en las próximas 48 horas.
        </p>
      </div>

      <div className="glass rounded-2xl border border-white/8 p-6 text-left space-y-4 max-w-md mx-auto">
        <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Qué pasa ahora</p>
        {[
          "Revisamos tu perfil y los retos que señalaste.",
          "Si hay fit, agendamos una sesión de diagnóstico inicial sin costo.",
          "Te presentamos el roadmap y el alcance de la implementación.",
        ].map((s, i) => (
          <div key={s} className="flex items-start gap-3">
            <div className="w-5 h-5 rounded-full bg-violet-500/15 border border-violet-500/25 flex items-center justify-center flex-shrink-0 mt-0.5 text-[10px] font-black text-violet-400">
              {i + 1}
            </div>
            <p className="text-sm text-foreground/80 leading-snug">{s}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link href="/pacto">
          <button className="flex items-center gap-2 px-6 py-3 bg-violet-600 hover:bg-violet-500 text-white font-bold rounded-xl transition-colors text-sm">
            Conocer PACTO <ArrowRight className="w-4 h-4" />
          </button>
        </Link>
        <Link href="/">
          <button className="flex items-center gap-2 px-6 py-3 glass border border-white/10 hover:border-white/20 text-white font-bold rounded-xl transition-all text-sm">
            Volver al inicio
          </button>
        </Link>
      </div>
    </motion.div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function BuildPage() {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<Answers>(EMPTY)
  const [direction, setDirection] = useState(1)
  const [submitted, setSubmitted] = useState(false)
  const [isPending, startTransition] = useTransition()

  const valid = isStepValid(step, answers)

  function set<K extends keyof Answers>(key: K, val: Answers[K]) {
    setAnswers((prev) => ({ ...prev, [key]: val }))
  }

  function toggleReto(id: string) {
    setAnswers((prev) => ({
      ...prev,
      retos: prev.retos.includes(id) ? prev.retos.filter((r) => r !== id) : [...prev.retos, id],
    }))
  }

  function next() {
    if (!valid) return
    setDirection(1)
    setStep((s) => s + 1)
  }

  function back() {
    if (step === 0) return
    setDirection(-1)
    setStep((s) => s - 1)
  }

  function submit() {
    if (!valid) return
    startTransition(async () => {
      try {
        const webhook = process.env.NEXT_PUBLIC_DEMO_LEAD_WEBHOOK
        if (webhook) {
          await fetch(webhook, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...answers, source: "diagnostico_360", ts: new Date().toISOString() }),
          })
        }
      } catch (_) {}
      setSubmitted(true)
    })
  }

  const STEPS_CONFIG = [
    { label: "Tu centro" },
    { label: "Operación" },
    { label: "Equipo" },
    { label: "Retos" },
    { label: "Inversión" },
  ]

  return (
    <div className="min-h-screen bg-[#05050a] text-foreground flex flex-col">

      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-white/5">
        <Link href="/" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" /> Inicio
        </Link>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-violet-600 flex items-center justify-center">
            <span className="text-white font-black text-[10px]">E</span>
          </div>
          <span className="text-white font-black text-sm tracking-tight">ELEVA</span>
          <span className="text-white/20 text-xs">·</span>
          <span className="text-muted-foreground text-xs">Diagnóstico 360</span>
        </div>
        <Link href="/pacto" className="text-sm text-muted-foreground hover:text-white transition-colors hidden sm:block">
          Conocer PACTO →
        </Link>
      </nav>

      <div className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-xl">

          {submitted ? (
            <SuccessScreen nombre={answers.nombre} centro={answers.centro} />
          ) : (
            <>
              {/* Progress bar */}
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs text-violet-400 font-bold uppercase tracking-widest">
                  Paso {step + 1} de {TOTAL_STEPS}
                </span>
                <span className="text-xs text-muted-foreground">{STEPS_CONFIG[step].label}</span>
              </div>
              <div className="flex gap-1.5 mb-10">
                {STEPS_CONFIG.map((_, i) => (
                  <div key={i} className={cn(
                    "h-1 rounded-full flex-1 transition-all duration-500",
                    i < step ? "bg-violet-600" : i === step ? "bg-violet-400" : "bg-white/8"
                  )} />
                ))}
              </div>

              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={step}
                  custom={direction}
                  initial={{ opacity: 0, x: direction * 36 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: direction * -36 }}
                  transition={{ duration: 0.25, ease: "easeInOut" }}
                >

                  {/* ── Paso 1: Tu centro ── */}
                  {step === 0 && (
                    <div className="space-y-6">
                      <div>
                        <h1 className="text-2xl sm:text-3xl font-black text-white mb-1.5 leading-tight">
                          Cuéntanos sobre tu centro.
                        </h1>
                        <p className="text-muted-foreground text-sm">Comenzamos por lo básico para personalizar el diagnóstico.</p>
                      </div>
                      <TextInput label="Nombre del centro" placeholder="Ej. Centro VIA Monterrey" value={answers.centro} onChange={(v) => set("centro", v)} />
                      <TextInput label="País / Ciudad" placeholder="Ej. México, Guadalajara" value={answers.ciudad} onChange={(v) => set("ciudad", v)} />
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">¿Cuántos años llevan operando?</label>
                        <div className="grid grid-cols-2 gap-2.5">
                          {ANOS.map((a) => (
                            <PillCard key={a.id} id={a.id} label={a.label} sub={a.sub}
                              selected={answers.anos === a.id} onSelect={() => set("anos", a.id)} />
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ── Paso 2: Operación ── */}
                  {step === 1 && (
                    <div className="space-y-6">
                      <div>
                        <h1 className="text-2xl sm:text-3xl font-black text-white mb-1.5 leading-tight">
                          Tu operación actual.
                        </h1>
                        <p className="text-muted-foreground text-sm">Esto define la escala de implementación que tu centro necesita.</p>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Generaciones de entrenamiento por año</label>
                        <div className="grid grid-cols-2 gap-2.5">
                          {GENERACIONES.map((g) => (
                            <PillCard key={g.id} id={g.id} label={g.label}
                              selected={answers.generaciones === g.id} onSelect={() => set("generaciones", g.id)} />
                          ))}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Participantes por generación (promedio)</label>
                        <div className="grid grid-cols-2 gap-2.5">
                          {PARTICIPANTES.map((p) => (
                            <PillCard key={p.id} id={p.id} label={p.label}
                              selected={answers.participantes === p.id} onSelect={() => set("participantes", p.id)} />
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ── Paso 3: Equipo ── */}
                  {step === 2 && (
                    <div className="space-y-6">
                      <div>
                        <h1 className="text-2xl sm:text-3xl font-black text-white mb-1.5 leading-tight">
                          Tu equipo y sistema.
                        </h1>
                        <p className="text-muted-foreground text-sm">Sin juicios, queremos entender tu punto de partida real.</p>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Situación de entrenadores</label>
                        <div className="grid grid-cols-1 gap-2.5">
                          {ENTRENADORES.map((e) => (
                            <PillCard key={e.id} id={e.id} label={e.label} sub={e.sub}
                              selected={answers.entrenadores === e.id} onSelect={() => set("entrenadores", e.id)} />
                          ))}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">¿Cómo gestionan el centro hoy?</label>
                        <div className="grid grid-cols-2 gap-2.5">
                          {SISTEMAS.map((s) => (
                            <PillCard key={s.id} id={s.id} label={s.label} sub={s.sub}
                              selected={answers.sistema === s.id} onSelect={() => set("sistema", s.id)} />
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ── Paso 4: Retos ── */}
                  {step === 3 && (
                    <div className="space-y-6">
                      <div>
                        <h1 className="text-2xl sm:text-3xl font-black text-white mb-1.5 leading-tight">
                          ¿Cuáles son tus principales retos?
                        </h1>
                        <p className="text-muted-foreground text-sm">Elige todos los que apliquen, de aquí salen las prioridades del diagnóstico.</p>
                      </div>
                      <div className="grid grid-cols-2 gap-2.5">
                        {RETOS.map((r) => {
                          const Icon = r.icon
                          const selected = answers.retos.includes(r.id)
                          const colorCls = RETO_COLOR[r.color]
                          return (
                            <button
                              key={r.id}
                              onClick={() => toggleReto(r.id)}
                              className={cn(
                                "relative text-left rounded-xl p-4 border transition-all flex flex-col gap-2.5",
                                selected ? colorCls : "border-white/8 bg-white/3 hover:border-white/18 hover:bg-white/5"
                              )}
                            >
                              {selected && (
                                <div className="absolute top-2.5 right-2.5 w-4 h-4 rounded-full bg-white/15 flex items-center justify-center">
                                  <Check className="w-2.5 h-2.5 text-white" />
                                </div>
                              )}
                              <Icon className={cn("w-4 h-4", selected ? "opacity-90" : "text-muted-foreground")} />
                              <p className={cn("text-xs font-bold leading-snug", selected ? "" : "text-foreground")}>{r.label}</p>
                            </button>
                          )
                        })}
                      </div>
                      {answers.retos.length > 0 && (
                        <p className="text-xs text-muted-foreground text-center">
                          {answers.retos.length} reto{answers.retos.length > 1 ? "s" : ""} seleccionado{answers.retos.length > 1 ? "s" : ""}
                        </p>
                      )}
                    </div>
                  )}

                  {/* ── Paso 5: Inversión y contacto ── */}
                  {step === 4 && (
                    <div className="space-y-6">
                      <div>
                        <h1 className="text-2xl sm:text-3xl font-black text-white mb-1.5 leading-tight">
                          Últimos detalles.
                        </h1>
                        <p className="text-muted-foreground text-sm">Para que el equipo de ELEVA pueda preparar tu diagnóstico correctamente.</p>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">¿Planean abrir nuevas sedes en los próximos 12 meses?</label>
                        <div className="grid grid-cols-3 gap-2.5">
                          {SEDES.map((s) => (
                            <PillCard key={s.id} id={s.id} label={s.label}
                              selected={answers.sedes === s.id} onSelect={() => set("sedes", s.id)} />
                          ))}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Rango de inversión disponible</label>
                        <div className="grid grid-cols-2 gap-2.5">
                          {INVERSION.map((inv) => (
                            <PillCard key={inv.id} id={inv.id} label={inv.label}
                              selected={answers.inversion === inv.id} onSelect={() => set("inversion", inv.id)} />
                          ))}
                        </div>
                      </div>
                      <div className="border-t border-white/6 pt-5 space-y-4">
                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Tu contacto</p>
                        <TextInput label="Nombre completo" placeholder="Tu nombre" value={answers.nombre} onChange={(v) => set("nombre", v)} />
                        <TextInput label="Correo electrónico" placeholder="tuemail@centro.com" value={answers.email} onChange={(v) => set("email", v)} type="email" />
                      </div>
                    </div>
                  )}

                </motion.div>
              </AnimatePresence>

              {/* Nav buttons */}
              <div className="flex items-center justify-between mt-8">
                <button
                  onClick={back}
                  disabled={step === 0}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm text-muted-foreground hover:text-white transition-colors disabled:opacity-25 disabled:cursor-not-allowed"
                >
                  <ArrowLeft className="w-4 h-4" /> Anterior
                </button>

                {step < TOTAL_STEPS - 1 ? (
                  <button
                    onClick={next}
                    disabled={!valid}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold bg-violet-600 text-white hover:bg-violet-500 transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-lg shadow-violet-600/20"
                  >
                    Siguiente <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={submit}
                    disabled={!valid || isPending}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold bg-violet-600 text-white hover:bg-violet-500 transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-lg shadow-violet-600/20"
                  >
                    {isPending ? (
                      <><Loader2 className="w-4 h-4 animate-spin" /> Enviando...</>
                    ) : (
                      <><Calendar className="w-4 h-4" /> Solicitar diagnóstico</>
                    )}
                  </button>
                )}
              </div>

              {/* Trust footnote */}
              <p className="text-center text-[11px] text-muted-foreground/60 mt-5">
                Información confidencial · ELEVA no comparte datos con terceros · Revisamos cada solicitud individualmente
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
