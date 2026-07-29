"use client"

import { useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { ChevronDown, ChevronRight, Play, MapPin } from "lucide-react"
import { cn } from "@/lib/utils"

type Step = {
  href: string
  label: string
  pitch: string
}

type RoleGuide = {
  persona: string
  role: string
  color: string
  accent: string
  intro: string
  steps: Step[]
}

const GUIDES: Record<string, RoleGuide> = {
  owner: {
    persona: "Carlos Mendoza",
    role: "Dueño del Centro",
    color: "text-violet-400",
    accent: "bg-violet-500/10 border-violet-500/25",
    intro: "Muéstrale el sistema operativo completo del centro.",
    steps: [
      { href: "/vl2026/pulso",        label: "Pulso del Centro",   pitch: "Aquí empieza su mañana: momentum, ingresos y alertas en 30 seg." },
      { href: "/vl2026/atencion",     label: "Necesitan Atención", pitch: "14 personas en riesgo. El sistema ya sabe quiénes y qué hacer." },
      { href: "/vl2026/campanas",     label: "Campañas y Marketing",pitch: "Un clic envía el mensaje correcto al segmento exacto, por WhatsApp, email o SMS." },
      { href: "/vl2026/finanzas",     label: "Finanzas en Tiempo Real", pitch: "Cobros, margen neto y flujo — sin abrir Excel, sin esperar a su contadora." },
      { href: "/vl2026/crm",         label: "Directorio CRM",     pitch: "Historial completo de cada participante desde el día uno." },
      { href: "/vl2026/equipo",       label: "Visibilidad del Equipo", pitch: "Qué está haciendo cada coach. Sin llamadas, sin WhatsApp." },
      { href: "/vl2026/cohortes",     label: "Generaciones",       pitch: "Funnel completo: quién entró, quién terminó, quién renovó." },
      { href: "/vl2026/inteligencia", label: "Análisis Estratégico","pitch": "Tendencias, proyecciones y comparativa entre cohortes con IA." },
    ],
  },
  coach: {
    persona: "Ana Reyes",
    role: "Coach · Gen. Omega",
    color: "text-emerald-400",
    accent: "bg-emerald-500/10 border-emerald-500/25",
    intro: "Muéstrale cómo el coach ve su tribu y actúa con precisión.",
    steps: [
      { href: "/vl2026/coach",      label: "Panel del Coach",   pitch: "Su tribu, sesiones y agenda — todo en un lugar." },
      { href: "/vl2026/expediente", label: "Expediente con IA", pitch: "Todo el historial de un participante: misiones, sesiones, notas y momentum." },
      { href: "/vl2026/crm",       label: "Directorio",        pitch: "Busca cualquier participante en segundos, filtra por estado o generación." },
    ],
  },
  ops: {
    persona: "Karla Ríos",
    role: "Operaciones",
    color: "text-cyan-400",
    accent: "bg-cyan-500/10 border-cyan-500/25",
    intro: "Muéstrale cómo operaciones corre el centro sin fricciones.",
    steps: [
      { href: "/vl2026/ops/dashboard",         label: "Centro de Operaciones",  pitch: "Estado de toda la operación en tiempo real: registros, asistencia, pendientes." },
      { href: "/vl2026/ops/registro",          label: "Mesa de Registro",       pitch: "Un nuevo participante listo en 3 minutos — sin papel, sin Excel." },
      { href: "/vl2026/ops/enrolamiento",      label: "Pipeline de Enrolamiento", pitch: "Quién está listo para convertir hoy, leads por etapa, acciones automáticas." },
      { href: "/vl2026/ops/pre-entrenamiento", label: "Pre-entrenamiento",      pitch: "La preparación digital antes del primer día: bienvenida, acceso y checklist." },
      { href: "/vl2026/ops/comunidad",         label: "Hub de Comunidad",       pitch: "Eventos, publicaciones y actividad de la comunidad desde un solo panel." },
    ],
  },
  participant: {
    persona: "Valeria Romo",
    role: "Participante · Gen. Omega",
    color: "text-pink-400",
    accent: "bg-pink-500/10 border-pink-500/25",
    intro: "Muéstrale la experiencia que vive cada participante.",
    steps: [
      { href: "/vl2026/mi-panel",      label: "Mi Panel",      pitch: "Su resumen diario: coach, misión activa, sesiones y momentum." },
      { href: "/vl2026/feed",          label: "Mi Feed",       pitch: "Lo que Valeria ve cada mañana: posts de su tribu, reconocimientos y eventos." },
      { href: "/vl2026/mision",        label: "Mi Misión",     pitch: "Su objetivo de la semana con progreso visual y checklist." },
      { href: "/vl2026/momentum",      label: "Mi Momentum",   pitch: "Su racha, score y gráfica de progreso — gamificación que engancha." },
      { href: "/vl2026/tribu",         label: "Mi Tribu",      pitch: "Su generación, los otros participantes y el leaderboard grupal." },
      { href: "/vl2026/logros",        label: "Mis Logros",    pitch: "Insignias, reconocimientos y evidencias de transformación acumuladas." },
    ],
  },
}

function getViewKey(pathname: string): keyof typeof GUIDES {
  if (pathname.startsWith("/vl2026/ops") || pathname === "/vl2026/ops/dashboard") return "ops"
  if (pathname === "/vl2026/coach" || pathname === "/vl2026/expediente") return "coach"
  if (["/vl2026/mi-panel","/vl2026/feed","/vl2026/mision","/vl2026/momentum","/vl2026/tribu","/vl2026/logros","/vl2026/especialistas"].includes(pathname)) return "participant"
  return "owner"
}

export function DemoGuide() {
  const pathname = usePathname()
  const router = useRouter()
  const [open, setOpen] = useState(true)

  const viewKey = getViewKey(pathname)
  const guide = GUIDES[viewKey]
  const currentIdx = guide.steps.findIndex((s) => s.href === pathname)
  const nextStep = guide.steps[currentIdx + 1] ?? null

  return (
    <div className={cn("mx-3 mb-3 rounded-xl border text-[11px]", guide.accent)}>
      {/* Header */}
      <button
        onClick={() => setOpen((p) => !p)}
        className="w-full flex items-center gap-2 px-3 py-2.5 text-left"
      >
        <Play className={cn("w-3 h-3 flex-shrink-0", guide.color)} />
        <div className="flex-1 min-w-0">
          <p className={cn("font-bold leading-tight truncate", guide.color)}>Guía del Demo</p>
          <p className="text-muted-foreground truncate">{guide.persona}</p>
        </div>
        <ChevronDown className={cn("w-3 h-3 text-muted-foreground flex-shrink-0 transition-transform", open && "rotate-180")} />
      </button>

      {open && (
        <div className="border-t border-white/8 px-3 pb-3 pt-2 space-y-3">
          {/* Intro */}
          <p className="text-muted-foreground leading-snug">{guide.intro}</p>

          {/* Steps */}
          <div className="space-y-1">
            {guide.steps.map((step, i) => {
              const isCurrent = pathname === step.href
              const isDone = i < currentIdx
              return (
                <button
                  key={step.href}
                  onClick={() => router.push(step.href)}
                  className={cn(
                    "w-full text-left flex items-start gap-2 px-2 py-1.5 rounded-lg transition-colors",
                    isCurrent
                      ? "bg-white/8 text-white"
                      : isDone
                      ? "text-muted-foreground/60 hover:text-muted-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                  )}
                >
                  <span className={cn(
                    "w-4 h-4 rounded-full flex-shrink-0 flex items-center justify-center text-[9px] font-black mt-0.5",
                    isCurrent ? "bg-white text-black" : isDone ? "bg-white/15 text-white/40" : "bg-white/8 text-muted-foreground"
                  )}>
                    {isDone ? "✓" : i + 1}
                  </span>
                  <div className="min-w-0">
                    <p className="font-semibold leading-tight">{step.label}</p>
                    {isCurrent && <p className="text-muted-foreground mt-0.5 leading-snug">{step.pitch}</p>}
                  </div>
                </button>
              )
            })}
          </div>

          {/* Next button */}
          {nextStep && (
            <button
              onClick={() => router.push(nextStep.href)}
              className={cn(
                "w-full flex items-center gap-1.5 px-3 py-2 rounded-lg font-bold transition-colors",
                guide.color,
                "bg-white/5 hover:bg-white/10 border border-white/10"
              )}
            >
              <MapPin className="w-3 h-3 flex-shrink-0" />
              <span className="flex-1 truncate text-left">Siguiente: {nextStep.label}</span>
              <ChevronRight className="w-3 h-3 flex-shrink-0" />
            </button>
          )}

          {!nextStep && currentIdx >= 0 && (
            <p className={cn("text-center font-bold", guide.color)}>
              ✓ Recorrido completo
            </p>
          )}
        </div>
      )}
    </div>
  )
}
