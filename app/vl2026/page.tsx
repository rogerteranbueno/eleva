import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { Megaphone, Zap, Heart, TrendingUp, ChevronRight, Building2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { DemoAccessForm } from "@/components/demo/DemoAccessForm"

const STAGES = [
  {
    id: "adquirir",
    icon: Megaphone,
    label: "Adquirir",
    color: "cyan",
    headline: "Atrae a las personas correctas",
    description: "Webinars gratuitos, eventos presenciales y CRM de leads que identifican señales de interés. El enrolamiento llega solo cuando un lead está nutrido.",
    metric: "80%",
    metricLabel: "más fácil enrolar",
    bullets: ["Webinars y eventos gratuitos", "CRM de leads automático", "Nurturing por contenido", "Conversión sin fricción"],
  },
  {
    id: "activar",
    icon: Zap,
    label: "Activar",
    color: "yellow",
    headline: "Convierte el primer sí en compromiso real",
    description: "El primer curso deja una huella. Diagnóstico, asignación de coach y seguimiento desde el día 1 para que nadie se pierda en el inicio.",
    metric: "94%",
    metricLabel: "activación Gen. VIA 12",
    bullets: ["Expediente desde el Básico", "Notas del coach en cada etapa", "Asignación de generación", "Score de activación"],
  },
  {
    id: "retener",
    icon: Heart,
    label: "Retener",
    color: "pink",
    headline: "Mantén el momentum mes tras mes",
    description: "Misiones semanales, momentum score, comunidad por generación y alertas automáticas cuando alguien está perdiendo el ritmo — antes de que abandone.",
    metric: "3x",
    metricLabel: "más retención",
    bullets: ["Momentum Score en tiempo real", "Alertas antes del abandono", "Tribu y leaderboard", "Eventos y webinars"],
  },
  {
    id: "escalar",
    icon: TrendingUp,
    label: "Revolución",
    color: "violet",
    headline: "Crece sin perder el control",
    description: "Visibilidad total del equipo, finanzas en tiempo real y CRM completo. El dueño sabe qué pasa en su centro antes de que alguien se lo tenga que decir.",
    metric: "+140%",
    metricLabel: "crecimiento promedio",
    bullets: ["Dashboard financiero", "Visibilidad de coaches", "CRM completo", "Plan de acción con IA"],
  },
]

const STAGE_COLORS: Record<string, { icon: string; badge: string; border: string; metric: string; bullet: string }> = {
  cyan:   { icon: "text-cyan-400",   badge: "bg-cyan-500/15 text-cyan-400 border-cyan-500/20",       border: "hover:border-cyan-500/40",    metric: "text-cyan-400",   bullet: "bg-cyan-500" },
  yellow: { icon: "text-yellow-400", badge: "bg-yellow-500/15 text-yellow-400 border-yellow-500/20", border: "hover:border-yellow-500/40",  metric: "text-yellow-400", bullet: "bg-yellow-500" },
  pink:   { icon: "text-pink-400",   badge: "bg-pink-500/15 text-pink-400 border-pink-500/20",       border: "hover:border-pink-500/40",    metric: "text-pink-400",   bullet: "bg-pink-500" },
  violet: { icon: "text-violet-400", badge: "bg-violet-500/15 text-violet-400 border-violet-500/20", border: "hover:border-violet-500/40",  metric: "text-violet-400", bullet: "bg-violet-500" },
}

export default async function DemoGatePage() {
  const jar = await cookies()
  if (jar.has("eleva_demo_access")) redirect("/vl2026/pulso")
  return (
    <div className="min-h-screen flex flex-col">
      {/* Top bar */}
      <div className="flex items-center justify-between px-5 sm:px-8 py-4 border-b border-white/6">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center">
            <span className="text-white font-black text-sm">E</span>
          </div>
          <span className="font-black text-white text-lg tracking-tight">ELEVA</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Building2 className="w-3.5 h-3.5" />
          Demo — LEVEL Transformación
        </div>
      </div>

      <div className="flex-1 px-5 sm:px-8 py-10 max-w-4xl mx-auto w-full space-y-10">
        {/* Hero */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-xs text-violet-300 font-medium">
            <div className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
            Sistema operativo de LEVEL Transformación
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white leading-tight">
            Primero la metodología.<br />
            <span className="text-violet-400">Luego el software.</span>
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto leading-relaxed text-sm sm:text-base">
            ELEVA no es una herramienta más — es la infraestructura que hace operable tu metodología de transformación en las 4 etapas del ciclo de vida de un participante.
          </p>
        </div>

        {/* AARR pill trail */}
        <div className="flex items-center justify-center gap-1 sm:gap-2 overflow-x-auto pb-2">
          {STAGES.map((s, i) => {
            const c = STAGE_COLORS[s.color]
            return (
              <div key={s.id} className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                <div className={cn("px-2.5 sm:px-3 py-1.5 rounded-full border text-[11px] sm:text-xs font-bold", c.badge)}>
                  {s.label}
                </div>
                {i < STAGES.length - 1 && <ChevronRight className="w-3 h-3 text-muted-foreground flex-shrink-0" />}
              </div>
            )
          })}
        </div>

        {/* Stage cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {STAGES.map((stage) => {
            const c = STAGE_COLORS[stage.color]
            const Icon = stage.icon
            return (
              <div
                key={stage.id}
                className={cn("glass rounded-2xl p-5 border border-white/8 transition-colors space-y-4", c.border)}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className={cn("w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center", c.icon)}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className={cn("text-[11px] px-2 py-0.5 rounded-full border font-bold", c.badge)}>
                      {stage.label}
                    </span>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className={cn("text-xl font-black", c.metric)}>{stage.metric}</p>
                    <p className="text-[10px] text-muted-foreground">{stage.metricLabel}</p>
                  </div>
                </div>

                <div>
                  <p className="font-bold text-white text-sm">{stage.headline}</p>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{stage.description}</p>
                </div>

                <ul className="space-y-1.5">
                  {stage.bullets.map((b) => (
                    <li key={b} className="flex items-center gap-2 text-xs text-foreground">
                      <div className={cn("w-1 h-1 rounded-full flex-shrink-0", c.bullet)} />
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>

        {/* Access gate */}
        <div className="max-w-2xl mx-auto w-full space-y-4">
          <div className="text-center space-y-1">
            <p className="font-bold text-white text-lg">Elige tu perfil de acceso</p>
            <p className="text-xs text-muted-foreground">
              Entra con un clic — los datos son reales, sin pitch, sin llamada.
            </p>
          </div>

          <DemoAccessForm />

          <p className="text-center text-[10px] text-muted-foreground">
            Acceso protegido · Sin spam · Cookie de 7 días
          </p>
        </div>
      </div>
    </div>
  )
}
