"use client"

import { X, Zap } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

type Priority = "hoy" | "esta-semana" | "este-mes"

interface Tip {
  emoji: string
  title: string
  desc: string
  priority: Priority
}

export interface PlanConfig {
  metric: string
  value: string
  status: "critical" | "warning" | "good"
  statusLabel: string
  tips: Tip[]
}

const PRIORITY_STYLE: Record<Priority, string> = {
  "hoy":         "bg-red-500/15 text-red-400 border border-red-500/25",
  "esta-semana": "bg-yellow-500/15 text-yellow-400 border border-yellow-500/25",
  "este-mes":    "bg-cyan-500/15 text-cyan-400 border border-cyan-500/25",
}

const PRIORITY_LABEL: Record<Priority, string> = {
  "hoy":         "Hoy",
  "esta-semana": "Esta semana",
  "este-mes":    "Este mes",
}

const STATUS_STYLE: Record<PlanConfig["status"], string> = {
  critical: "bg-red-500/10 border-red-500/20 text-red-400",
  warning:  "bg-yellow-500/10 border-yellow-500/20 text-yellow-400",
  good:     "bg-green-500/10 border-green-500/20 text-green-400",
}

// ─── Pre-configured plans per metric ─────────────────────────────────────────

export const PLAN_CONFIGS: Record<string, PlanConfig> = {
  momentum: {
    metric: "Momentum del Centro",
    value: "67%",
    status: "warning",
    statusLabel: "Por debajo del umbral saludable (>70%)",
    tips: [
      { emoji: "🚨", title: "Intervenir los 14 en riesgo hoy mismo", desc: "Distribuye la lista entre coaches: máx. 5 personas cada uno. Mensaje personalizado antes de las 6pm — no blast masivo.", priority: "hoy" },
      { emoji: "🔍", title: "Identifica la cohorte que arrastra el promedio", desc: "Generación Norte está en 58%. Agenda una llamada de 15 min con Marco para entender qué pasó en las últimas 2 semanas.", priority: "hoy" },
      { emoji: "⚡", title: "Lanza una misión de reconexión", desc: "Una misión especial de win rápido (24h de plazo) sube el momentum sin depender de eventos. Actívala para todas las cohortes simultáneamente.", priority: "esta-semana" },
      { emoji: "📅", title: "Maximiza la asistencia al evento del jueves", desc: "Con 34% confirmado, un recordatorio personalizado hoy puede subir eso a 70%+. El evento en 4 días es tu mejor palanca de momentum.", priority: "esta-semana" },
      { emoji: "📈", title: "Monitorea diariamente hasta regresar a >70%", desc: "Si no subes 3 puntos en 5 días, escala la intervención: sesión grupal de emergencia con todas las cohortes.", priority: "este-mes" },
    ],
  },
  participantes: {
    metric: "Participantes Activos",
    value: "247",
    status: "good",
    statusLabel: "+12% vs mes anterior — tendencia positiva",
    tips: [
      { emoji: "📸", title: "Documenta qué cambió este mes", desc: "El +12% no es accidente. ¿Fue un evento? ¿Una campaña? ¿Un coach específico? Identifícalo para replicarlo en el siguiente ciclo.", priority: "esta-semana" },
      { emoji: "🌟", title: "Convierte tus top 10 en referidores activos", desc: "Los más activos del mes son tus mejores embajadores. Mándales un mensaje personal de agradecimiento y pídeles que inviten a alguien a la siguiente sesión.", priority: "esta-semana" },
      { emoji: "🎯", title: "Captura el momentum para el próximo enrolamiento", desc: "Con 247 activos y creciendo, este es el momento de abrir pre-inscripciones para la siguiente generación. La energía del centro vende sola.", priority: "este-mes" },
      { emoji: "📊", title: "Crea un caso de éxito con los de mayor momentum", desc: "Elige 2-3 participantes destacados para una entrevista o testimonio. Úsalo en tus materiales de captación.", priority: "este-mes" },
    ],
  },
  riesgo: {
    metric: "Participantes en Riesgo",
    value: "14",
    status: "critical",
    statusLabel: "Requiere intervención inmediata",
    tips: [
      { emoji: "🚨", title: "Prioriza por días de inactividad ahora", desc: "Los de >10 días (como Valeria) van primero. Cada día adicional sin contacto reduce la probabilidad de recuperación un 8%.", priority: "hoy" },
      { emoji: "💬", title: "Mensaje individual, no de grupo", desc: "Un mensaje que diga su nombre y haga referencia a su objetivo personal tiene 4x más tasa de respuesta que un blast. Dedícale 2 minutos a cada uno.", priority: "hoy" },
      { emoji: "🔎", title: "Busca el patrón: ¿son de la misma cohorte?", desc: "Si más de 5 de los 14 son de Generación Norte, el problema es sistémico (coach, contenido, dinámica grupal), no individual.", priority: "esta-semana" },
      { emoji: "📞", title: "Llamada directa si no hay respuesta en 48h", desc: "WhatsApp sin respuesta en 2 días = llamada telefónica. El 60% de participantes en riesgo que reciben una llamada personal se reactivan.", priority: "esta-semana" },
      { emoji: "🛡️", title: "Ajusta el umbral de alerta a 5 días de inactividad", desc: "Actualmente detectas a los 7 días. Bajar a 5 te da 2 días más de ventana para intervenir antes de que el patrón se consolide.", priority: "este-mes" },
    ],
  },
  cohortes: {
    metric: "Cohortes Activas",
    value: "3",
    status: "warning",
    statusLabel: "1 cohorte en atención (Norte 58%)",
    tips: [
      { emoji: "⚠️", title: "Norte es prioridad esta semana", desc: "58% de momentum con tendencia a la baja. Marco necesita una activación grupal antes del jueves — no esperes al próximo evento programado.", priority: "hoy" },
      { emoji: "🏆", title: "Celebra públicamente a Vía 12 (81%)", desc: "Reconocer públicamente la cohorte con mejor momentum crea competencia sana. Un shoutout en todos los grupos levanta el espíritu de las otras.", priority: "esta-semana" },
      { emoji: "🚀", title: "Omega en 74%: inicia pre-enrolamiento", desc: "Con una cohorte saludable y en fase avanzada, es el momento de presentar el siguiente nivel. Los actuales participantes de Omega son tus mejores vendedores.", priority: "esta-semana" },
      { emoji: "📋", title: "Establece un ritual de revisión semanal por cohorte", desc: "15 minutos por coach cada lunes para revisar momentum, asistencias y riesgo. La consistencia previene que una cohorte caiga como lo hizo Norte.", priority: "este-mes" },
    ],
  },
  evento: {
    metric: "Próximo Evento",
    value: "4 días",
    status: "warning",
    statusLabel: "Solo 34% confirmado — objetivo mínimo 65%",
    tips: [
      { emoji: "📲", title: "Recordatorio personalizado HOY a los 59 sin confirmar", desc: "No uses el grupo. Mensaje directo de cada coach a sus participantes. Mención de por qué este evento específico es importante para su proceso.", priority: "hoy" },
      { emoji: "📞", title: "Llamada a los 10 más inactivos del grupo", desc: "Los que tienen momentum bajo y no han confirmado son los que más necesitan venir. Una llamada de 3 minutos tiene 70% de tasa de conversión.", priority: "hoy" },
      { emoji: "🎭", title: "Genera expectativa con contenido de pre-evento", desc: "Publica en los grupos algo como 'Ana tiene algo importante que compartir el jueves'. El misterio motivado funciona mejor que el recordatorio genérico.", priority: "esta-semana" },
      { emoji: "🗂️", title: "Confirma logística de mesa de registro", desc: "Karla y el staff necesitan saber la lista confirmada 24h antes. Comparte el reporte de registro con el equipo de operaciones.", priority: "esta-semana" },
    ],
  },
  omega: {
    metric: "Generación Omega",
    value: "74% momentum",
    status: "good",
    statusLabel: "Saludable — PL Mes 3 de 5",
    tips: [
      { emoji: "🎯", title: "Aprovecha el momentum para el siguiente ciclo", desc: "Con 74% en mes 3, es el mejor momento para presentar qué sigue después de PL. Planta la semilla ahora, cosecha en 2 meses.", priority: "esta-semana" },
      { emoji: "🌟", title: "Identifica los 5 de mayor momentum como mentores", desc: "Los participantes destacados de Omega pueden apoyar a los de Norte. El peer-mentoring sube momentum en ambos grupos.", priority: "esta-semana" },
      { emoji: "📸", title: "Documenta los logros del Mes 3", desc: "Pide a Ana que recolecte 3-5 historias de transformación del mes. Son tu mejor material de captación para la siguiente generación.", priority: "este-mes" },
    ],
  },
  norte: {
    metric: "Generación Norte",
    value: "58% momentum",
    status: "critical",
    statusLabel: "En atención — Expansión completada, momentum cayó 7pts",
    tips: [
      { emoji: "🚨", title: "Activa a Marco hoy con un plan concreto", desc: "Sin contacto grupal hace 12 días. Marco necesita una sesión de 'reset' con el grupo esta semana. Propón fecha y hora tú — no esperes que él la proponga.", priority: "hoy" },
      { emoji: "⚡", title: "Misión de cohorte con deadline de 48 horas", desc: "Una misión corta y urgente (48h) reinicia el hábito de participación. Que sea tan sencilla que nadie tenga excusa de no hacerla.", priority: "hoy" },
      { emoji: "🔍", title: "Segmenta: <45% de momentum reciben atención individual", desc: "Dentro de Norte hay probablemente 5-8 personas que están jalando el promedio hacia abajo. Identifícalas y dales intervención personal, no grupal.", priority: "esta-semana" },
      { emoji: "📅", title: "Evento de reconexión en los próximos 7 días", desc: "Un encuentro presencial o virtual corto (60 min) específico para Norte, fuera de los eventos generales. La cercanía del grupo sube el momentum 8-12 puntos.", priority: "esta-semana" },
    ],
  },
  via12: {
    metric: "Generación Vía 12",
    value: "81% momentum",
    status: "good",
    statusLabel: "Muy activa — Despertar completado",
    tips: [
      { emoji: "🏆", title: "Celebra públicamente el 81%", desc: "En el próximo evento general, reconoce a Vía 12 frente a todos. Crea competencia positiva y eleva el estatus del grupo en la comunidad.", priority: "esta-semana" },
      { emoji: "🌱", title: "Prepara la transición al siguiente módulo", desc: "Con Despertar completado y momentum alto, este es el mejor momento para introducir qué sigue. La apertura al aprendizaje es máxima.", priority: "esta-semana" },
      { emoji: "🤝", title: "Conecta a Vía 12 con Norte como mentores", desc: "El intercambio entre cohortes sube el sentido de comunidad y responsabilidad. Organiza un breakout de 20 minutos en el próximo evento.", priority: "este-mes" },
    ],
  },
}

// ─── Component ────────────────────────────────────────────────────────────────

interface PlanTipsDrawerProps {
  config: PlanConfig
  onClose: () => void
}

export function PlanTipsDrawer({ config, onClose }: PlanTipsDrawerProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 40, opacity: 0 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="w-full max-w-lg bg-[#12121e] border border-white/10 rounded-t-2xl md:rounded-2xl shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3 px-5 pt-5 pb-4 border-b border-white/8">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-violet-500/20 flex items-center justify-center flex-shrink-0">
              <Zap className="w-4 h-4 text-violet-400" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-violet-400 font-semibold">Plan de trabajo</p>
              <h3 className="text-sm font-bold text-white">{config.metric}</h3>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/5 text-muted-foreground flex-shrink-0 mt-0.5">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Status */}
        <div className={cn("mx-5 mt-4 flex items-center gap-3 px-3 py-2 rounded-xl border", STATUS_STYLE[config.status])}>
          <span className="text-2xl font-black">{config.value}</span>
          <p className="text-xs leading-snug opacity-80">{config.statusLabel}</p>
        </div>

        {/* Tips */}
        <div className="px-5 pt-4 pb-5 space-y-2.5 max-h-[60vh] overflow-y-auto">
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold mb-3">
            Acciones recomendadas
          </p>
          {config.tips.map((tip, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06 }}
              className="flex items-start gap-3 bg-white/3 border border-white/6 rounded-xl p-3 hover:border-white/12 transition-colors"
            >
              <span className="text-xl flex-shrink-0 leading-none mt-0.5">{tip.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <p className="text-xs font-bold text-white leading-snug">{tip.title}</p>
                  <span className={cn("text-[9px] px-1.5 py-0.5 rounded-full font-semibold whitespace-nowrap flex-shrink-0", PRIORITY_STYLE[tip.priority])}>
                    {PRIORITY_LABEL[tip.priority]}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{tip.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}

// ─── Trigger button ───────────────────────────────────────────────────────────

interface PlanTriggerProps {
  onClick: (e?: React.MouseEvent) => void
  className?: string
}

export function PlanTrigger({ onClick, className }: PlanTriggerProps) {
  return (
    <button
      onClick={onClick as React.MouseEventHandler<HTMLButtonElement>}
      className={cn(
        "flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 border border-amber-500/30 text-amber-400 hover:bg-amber-500/25 hover:text-amber-300 hover:border-amber-500/50 transition-all",
        className
      )}
    >
      <Zap className="w-3 h-3" />
      Generar plan
    </button>
  )
}
