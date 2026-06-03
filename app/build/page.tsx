"use client"

import { useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import {
  ArrowLeft, ArrowRight, Check, Zap, Users, TrendingUp, Globe,
  Search, Megaphone, Heart, BarChart3, Sparkles, Star, Building2, ChevronRight
} from "lucide-react"
import { cn } from "@/lib/utils"

// ── Types ──────────────────────────────────────────────────────────────────────

interface Option {
  id: string
  icon: React.ComponentType<{ className?: string }>
  label: string
  description: string
}

interface Step {
  id: string
  question: string
  subtitle: string
  options: Option[]
}

// ── Questions ──────────────────────────────────────────────────────────────────

const STEPS: Step[] = [
  {
    id: "size",
    question: "¿Cuántos participantes activos tiene tu centro hoy?",
    subtitle: "Esto nos ayuda a calibrar el sistema exacto que necesitas.",
    options: [
      { id: "micro", icon: Users, label: "Menos de 50", description: "Estás arrancando o validando el modelo" },
      { id: "small", icon: Users, label: "50 a 150", description: "Operación consolidada, lista para crecer" },
      { id: "mid", icon: Building2, label: "151 a 400", description: "Centro establecido con múltiples cohortes" },
      { id: "large", icon: Building2, label: "400 o más", description: "Operación compleja que necesita escala" },
    ],
  },
  {
    id: "challenge",
    question: "¿Cuál es tu mayor desafío hoy?",
    subtitle: "Sé honesto — de aquí sale la prioridad de tu sistema.",
    options: [
      { id: "acquire", icon: Megaphone, label: "Conseguir más participantes", description: "El pipeline de nuevos inscritos es inestable o lento" },
      { id: "activate", icon: Zap, label: "Activar a los que ya tengo", description: "Se inscriben pero no completan el proceso" },
      { id: "retain", icon: Heart, label: "Que no abandonen a la mitad", description: "La retención y el seguimiento se pierden" },
      { id: "scale", icon: TrendingUp, label: "Crecer sin perder calidad", description: "La operación ya no escala con las personas actuales" },
    ],
  },
  {
    id: "current",
    question: "¿Cómo gestionas tu centro hoy?",
    subtitle: "Sin juicios — queremos entender tu punto de partida.",
    options: [
      { id: "whatsapp", icon: () => <span className="text-xl">📱</span>, label: "WhatsApp + Excel", description: "El combo clásico que funciona hasta cierto punto" },
      { id: "crm", icon: BarChart3, label: "Algún CRM genérico", description: "Salesforce, HubSpot u otro que no fue hecho para centros" },
      { id: "nothing", icon: () => <span className="text-xl">🧩</span>, label: "Sin sistema claro", description: "Todo en la cabeza del equipo" },
      { id: "mix", icon: () => <span className="text-xl">🔀</span>, label: "Mix de varias herramientas", description: "Muchas apps, poca integración" },
    ],
  },
  {
    id: "goal",
    question: "¿Qué meta tienes a 12 meses?",
    subtitle: "Tu meta define qué módulos activamos primero.",
    options: [
      { id: "double", icon: TrendingUp, label: "Doblar mis participantes", description: "Crecer de forma agresiva y controlada" },
      { id: "retention", icon: Heart, label: "Retención al 85% o más", description: "Que todos los que empiezan, terminen" },
      { id: "newlocation", icon: Building2, label: "Abrir una nueva sede o cohorte", description: "Replicar el modelo sin reinventarlo" },
      { id: "online", icon: Globe, label: "Lanzar modalidad online / híbrida", description: "Llegar más lejos sin límite de espacio" },
    ],
  },
]

// ── Module definitions ─────────────────────────────────────────────────────────

interface Module {
  id: string
  icon: string
  color: string
  borderColor: string
  textColor: string
  bgColor: string
  title: string
  tagline: string
  features: string[]
  highlight: string[]   // challenge IDs that make this module "primary"
  goalHighlight: string[] // goal IDs that reinforce this module
}

const MODULES: Module[] = [
  {
    id: "acquire",
    icon: "🎯",
    color: "violet",
    borderColor: "border-violet-500/40",
    textColor: "text-violet-400",
    bgColor: "bg-violet-500/10",
    title: "Adquirir",
    tagline: "Tu centro visible, tu pipeline lleno",
    features: [
      "Sitio web personalizado optimizado en AEO + SEO",
      "Landing pages por cohorte o evento",
      "Formulario de inscripción inteligente",
      "Seguimiento automático de leads",
      "Integración con WhatsApp y redes",
    ],
    highlight: ["acquire"],
    goalHighlight: ["double", "online"],
  },
  {
    id: "activate",
    icon: "⚡",
    color: "cyan",
    borderColor: "border-cyan-500/40",
    textColor: "text-cyan-400",
    bgColor: "bg-cyan-500/10",
    title: "Activar",
    tagline: "De inscrito a participante comprometido",
    features: [
      "Onboarding automatizado paso a paso",
      "Misiones semanales con seguimiento",
      "Notificaciones por WhatsApp / SMS / Email",
      "Panel del participante con su progreso",
      "Racha de consistencia y momentum",
    ],
    highlight: ["activate"],
    goalHighlight: ["retention", "double"],
  },
  {
    id: "retain",
    icon: "💎",
    color: "green",
    borderColor: "border-green-500/40",
    textColor: "text-green-400",
    bgColor: "bg-green-500/10",
    title: "Retener",
    tagline: "Cero abandonos invisibles",
    features: [
      "Alertas tempranas de participantes en riesgo",
      "Expediente individual con historial completo",
      "Escalado a coach con un toque",
      "Seguimiento de pagos y renovaciones",
      "Dashboard de momentum del centro",
    ],
    highlight: ["retain"],
    goalHighlight: ["retention", "newlocation"],
  },
  {
    id: "scale",
    icon: "🚀",
    color: "yellow",
    borderColor: "border-yellow-500/40",
    textColor: "text-yellow-400",
    bgColor: "bg-yellow-500/10",
    title: "Escalar",
    tagline: "Crecer sin caos operativo",
    features: [
      "Multi-cohorte y multi-sede desde un solo panel",
      "Roles diferenciados: dueño, coach, participante",
      "Ecosistema de especialistas integrado",
      "Reportes automáticos por cohorte",
      "API para integraciones avanzadas",
    ],
    highlight: ["scale"],
    goalHighlight: ["double", "newlocation", "online"],
  },
]

// ── Helpers ────────────────────────────────────────────────────────────────────

function getPrimary(challenge: string, goal: string): string[] {
  const primary = new Set<string>()
  MODULES.forEach((m) => {
    if (m.highlight.includes(challenge)) primary.add(m.id)
    if (m.goalHighlight.includes(goal)) primary.add(m.id)
  })
  return [...primary]
}

function getSizeLabel(size: string): string {
  return { micro: "menos de 50 participantes", small: "50–150 participantes", mid: "151–400 participantes", large: "400+ participantes" }[size] ?? ""
}

function getChallengeLabel(c: string): string {
  return { acquire: "adquirir más participantes", activate: "activar inscritos", retain: "mejorar retención", scale: "escalar operación" }[c] ?? ""
}

function getGoalLabel(g: string): string {
  return { double: "doblar participantes", retention: "retención al 85%+", newlocation: "nueva sede o cohorte", online: "modalidad online/híbrida" }[g] ?? ""
}

// ── Sub-components ─────────────────────────────────────────────────────────────

function OptionCard({ option, selected, onSelect }: { option: Option; selected: boolean; onSelect: () => void }) {
  const Icon = option.icon
  return (
    <button
      onClick={onSelect}
      className={cn(
        "relative text-left rounded-2xl p-5 border transition-all group",
        selected
          ? "border-violet-500/60 bg-violet-500/10 shadow-lg shadow-violet-500/10"
          : "border-white/8 bg-white/3 hover:border-white/20 hover:bg-white/5"
      )}
    >
      {selected && (
        <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-violet-600 flex items-center justify-center">
          <Check className="w-3 h-3 text-white" />
        </div>
      )}
      <div className="mb-3">
        <Icon className={cn("w-6 h-6", selected ? "text-violet-400" : "text-muted-foreground group-hover:text-foreground")} />
      </div>
      <p className={cn("font-semibold text-sm mb-1", selected ? "text-white" : "text-foreground")}>{option.label}</p>
      <p className="text-xs text-muted-foreground leading-relaxed">{option.description}</p>
    </button>
  )
}

function ModuleCard({ module, isPrimary }: { module: Module; isPrimary: boolean }) {
  return (
    <div className={cn(
      "rounded-2xl p-5 border transition-all",
      isPrimary
        ? `${module.bgColor} ${module.borderColor} shadow-lg`
        : "bg-white/3 border-white/8"
    )}>
      {isPrimary && (
        <div className="flex items-center gap-1.5 mb-3">
          <Star className={cn("w-3 h-3", module.textColor)} />
          <span className={cn("text-[10px] font-bold uppercase tracking-widest", module.textColor)}>Prioritario para ti</span>
        </div>
      )}
      <div className="flex items-center gap-3 mb-3">
        <span className="text-2xl">{module.icon}</span>
        <div>
          <p className={cn("font-bold text-lg", isPrimary ? "text-white" : "text-foreground")}>
            Módulo {module.title}
          </p>
          <p className="text-xs text-muted-foreground">{module.tagline}</p>
        </div>
      </div>
      <ul className="space-y-1.5">
        {module.features.map((f) => (
          <li key={f} className="flex items-start gap-2">
            <Check className={cn("w-3.5 h-3.5 flex-shrink-0 mt-0.5", isPrimary ? module.textColor : "text-muted-foreground")} />
            <span className={cn("text-xs leading-relaxed", isPrimary ? "text-white/80" : "text-muted-foreground")}>{f}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

// ── Main component ─────────────────────────────────────────────────────────────

export default function BuildPage() {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [direction, setDirection] = useState(1)

  const isResult = step === STEPS.length
  const currentStep = STEPS[step]
  const selected = currentStep ? answers[currentStep.id] : null
  const primaryModules = isResult ? getPrimary(answers.challenge ?? "", answers.goal ?? "") : []

  function choose(stepId: string, optionId: string) {
    setAnswers((prev) => ({ ...prev, [stepId]: optionId }))
  }

  function next() {
    if (!selected && !isResult) return
    setDirection(1)
    setStep((s) => s + 1)
  }

  function back() {
    if (step === 0) return
    setDirection(-1)
    setStep((s) => s - 1)
  }

  return (
    <div className="min-h-screen bg-[#05050a] text-foreground flex flex-col">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-white/5">
        <Link href="/" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Volver
        </Link>
        <div className="flex items-center gap-1.5">
          <span className="text-white font-bold text-sm tracking-tight">ELEVA</span>
          <span className="text-muted-foreground text-xs">· Sistema personalizado</span>
        </div>
        <Link href="/demo" className="text-sm text-muted-foreground hover:text-white transition-colors hidden sm:block">
          Ver demo →
        </Link>
      </nav>

      <div className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-2xl">
          {/* Progress */}
          {!isResult && (
            <div className="flex items-center gap-2 mb-10">
              {STEPS.map((s, i) => (
                <div
                  key={s.id}
                  className={cn(
                    "h-1 rounded-full flex-1 transition-all duration-500",
                    i < step ? "bg-violet-600" : i === step ? "bg-violet-400" : "bg-white/10"
                  )}
                />
              ))}
            </div>
          )}

          <AnimatePresence mode="wait" custom={direction}>
            {!isResult ? (
              <motion.div
                key={step}
                custom={direction}
                initial={{ opacity: 0, x: direction * 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: direction * -40 }}
                transition={{ duration: 0.28, ease: "easeInOut" }}
              >
                {/* Question */}
                <div className="mb-2">
                  <span className="text-xs text-violet-400 font-semibold uppercase tracking-widest">
                    Pregunta {step + 1} de {STEPS.length}
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2 leading-tight">
                  {currentStep.question}
                </h1>
                <p className="text-muted-foreground text-sm mb-8">{currentStep.subtitle}</p>

                {/* Options grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                  {currentStep.options.map((opt) => (
                    <OptionCard
                      key={opt.id}
                      option={opt}
                      selected={answers[currentStep.id] === opt.id}
                      onSelect={() => choose(currentStep.id, opt.id)}
                    />
                  ))}
                </div>

                {/* Nav buttons */}
                <div className="flex items-center justify-between">
                  <button
                    onClick={back}
                    disabled={step === 0}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm text-muted-foreground hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Anterior
                  </button>
                  <button
                    onClick={next}
                    disabled={!selected}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold bg-violet-600 text-white hover:bg-violet-700 transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-lg shadow-violet-600/25"
                  >
                    {step === STEPS.length - 1 ? "Ver mi sistema" : "Siguiente"}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                {/* Result header */}
                <div className="text-center mb-10">
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-600/15 border border-violet-500/30 text-violet-400 text-xs font-semibold mb-4">
                    <Sparkles className="w-3.5 h-3.5" />
                    Tu sistema está listo
                  </div>
                  <h1 className="text-3xl sm:text-4xl font-black text-white mb-3 leading-tight">
                    Tu sistema ELEVA
                  </h1>
                  <p className="text-muted-foreground text-sm max-w-lg mx-auto leading-relaxed">
                    Para un centro con <span className="text-white font-medium">{getSizeLabel(answers.size)}</span>, enfocado en{" "}
                    <span className="text-white font-medium">{getChallengeLabel(answers.challenge)}</span> y con meta de{" "}
                    <span className="text-white font-medium">{getGoalLabel(answers.goal)}</span>.
                  </p>
                </div>

                {/* Modules grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  {MODULES.map((m) => (
                    <ModuleCard key={m.id} module={m} isPrimary={primaryModules.includes(m.id)} />
                  ))}
                </div>

                {/* AEO/SEO callout */}
                <div className="rounded-2xl border border-violet-500/20 bg-violet-500/5 p-5 mb-8 flex items-start gap-4">
                  <div className="w-9 h-9 rounded-xl bg-violet-600/20 flex items-center justify-center flex-shrink-0">
                    <Search className="w-4.5 h-4.5 text-violet-400" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white mb-1 flex items-center gap-2">
                      Diseño personalizado · AEO + SEO incluido
                    </p>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Tu sistema ELEVA incluye un sitio web diseñado específicamente para tu centro, optimizado para aparecer primero en búsquedas locales y en respuestas de IA (Answer Engine Optimization). No un template — una presencia digital construida para convertir.
                    </p>
                  </div>
                </div>

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <Link
                    href="/demo"
                    className="flex items-center justify-center gap-2 w-full sm:flex-1 px-6 py-3.5 rounded-xl font-semibold text-sm bg-violet-600 text-white hover:bg-violet-700 transition-all shadow-lg shadow-violet-600/25"
                  >
                    <Zap className="w-4 h-4" />
                    Ver el demo en vivo
                  </Link>
                  <a
                    href="mailto:hola@elevaapp.io?subject=Quiero%20activar%20mi%20sistema%20ELEVA"
                    className="flex items-center justify-center gap-2 w-full sm:flex-1 px-6 py-3.5 rounded-xl font-semibold text-sm border border-white/10 text-foreground hover:border-white/25 hover:text-white transition-all"
                  >
                    Activar mi sistema
                    <ChevronRight className="w-4 h-4" />
                  </a>
                </div>

                <button
                  onClick={() => { setStep(0); setAnswers({}) }}
                  className="mt-4 w-full text-center text-xs text-muted-foreground hover:text-white transition-colors py-2"
                >
                  Empezar de nuevo
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
