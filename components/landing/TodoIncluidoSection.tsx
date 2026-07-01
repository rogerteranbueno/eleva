"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  HelpCircle,
  ClipboardList,
  Users,
  DollarSign,
  MessageSquare,
  Activity,
  Brain,
  LayoutDashboard,
  Calendar,
  UserPlus,
  BookOpen,
  ChevronRight,
  ArrowRight,
  CheckCircle2,
  Zap,
  X,
} from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

// ─── Types ────────────────────────────────────────────────────────────────────

interface Feature {
  id: string
  icon: React.ComponentType<{ className?: string }>
  emoji: string
  name: string
  desc: string
  audience: "ops" | "owner" | "coach" | "all"
  tooltipTitle: string
  tooltipText: string
}

// ─── Features data ────────────────────────────────────────────────────────────

const FEATURES: Feature[] = [
  {
    id: "registro",
    icon: ClipboardList,
    emoji: "📋",
    name: "Mesa de Registro",
    desc: "Flujo de check-in con búsqueda en tiempo real, walk-ins, y datos al dueño al instante.",
    audience: "ops",
    tooltipTitle: "¿Cómo busco a alguien?",
    tooltipText: "Escribe el nombre o el número de teléfono — el sistema filtra mientras escribes, no necesitas presionar Enter. Si alguien no aparece en la lista aunque sí debería estar, usa el botón Walk-in para registrar su entrada de todos modos. El sistema crea un perfil temporal y notifica al dueño.",
  },
  {
    id: "expediente",
    icon: UserPlus,
    emoji: "👤",
    name: "Creación de expedientes",
    desc: "El sistema guía paso a paso: datos básicos, asignación de generación, bienvenida automática por WhatsApp.",
    audience: "ops",
    tooltipTitle: "¿Qué datos necesito para crear un perfil?",
    tooltipText: "Solo necesitas nombre completo y teléfono para crear el perfil. El resto — email, objetivo, fuente de captación — se puede completar después. Al asignar la generación, el sistema envía automáticamente un WhatsApp de bienvenida con el nombre del participante y el nombre de su coach.",
  },
  {
    id: "pagos",
    icon: DollarSign,
    emoji: "💳",
    name: "Gestión de cobros",
    desc: "Dashboard de pagos pendientes, badges de alerta visibles en cada pantalla, recordatorios automáticos.",
    audience: "ops",
    tooltipTitle: "Veo un badge rojo en el nombre de alguien — ¿qué hago?",
    tooltipText: "El badge rojo indica pago vencido. No bloquees la entrada — el sistema ya generó una alerta automática al dueño y al coach. Tu trabajo es informarle con amabilidad si te preguntan: \"Tu coach ya sabe, él te va a contactar hoy.\" Anota si el participante mencionó algo sobre su situación en las notas del CRM.",
  },
  {
    id: "pretraining",
    icon: Calendar,
    emoji: "🗓️",
    name: "Seguimiento pre-entrenamiento",
    desc: "Lista de inscritos al próximo Despertar, contador de intentos de contacto, acción masiva por WhatsApp.",
    audience: "ops",
    tooltipTitle: "¿Cuándo debo marcar a alguien como confirmado?",
    tooltipText: "Marca \"confirmado\" cuando el participante te responda por WhatsApp que sí va a asistir. Si no contesta en 24 horas después de tu mensaje, súbele el contador de intentos y el sistema genera recordatorio automático. Si a 48 horas del evento no hay confirmación, notifica al coach para que él haga el último contacto personal.",
  },
  {
    id: "comunidad",
    icon: Users,
    emoji: "🤝",
    name: "Hub de comunidad",
    desc: "Vista por generación, contacto directo con coaches, plantillas de mensajes aprobadas por el dueño.",
    audience: "ops",
    tooltipTitle: "¿Puedo inventar el mensaje o uso la plantilla?",
    tooltipText: "Siempre usa las plantillas — son los textos aprobados por el director del centro. Si necesitas decir algo que no está cubierto por ninguna plantilla, primero consulta con el dueño antes de enviar. Las plantillas existen para que la comunicación del centro sea consistente y profesional, independientemente de quién esté en turno.",
  },
  {
    id: "crm",
    icon: BookOpen,
    emoji: "📊",
    name: "CRM de participantes",
    desc: "Directorio completo con momentum, historial, pagos, notas de coach y etiquetas de riesgo.",
    audience: "ops",
    tooltipTitle: "¿Qué anoto en las notas del CRM?",
    tooltipText: "Anota todo lo que un coach o el dueño necesitaría saber: \"Llegó tarde y mencionó problemas con el transporte\", \"Preguntó por opciones de pago\", \"Vino con su pareja, que también está interesada\". No filtes — lo que parece menor puede ser la clave que el coach necesita para retener a alguien.",
  },
  {
    id: "pulso",
    icon: Activity,
    emoji: "📈",
    name: "Panel del dueño · Pulso",
    desc: "Vista en tiempo real del momentum por generación, alertas de abandono, resumen financiero y KPIs del centro.",
    audience: "owner",
    tooltipTitle: "¿Qué significa el Momentum Score?",
    tooltipText: "El Momentum Score (0–100%) mide la actividad y compromiso de cada participante: asistencia a eventos, misiones completadas, interacción en el feed y racha de días activos. Debajo de 40% el sistema genera alerta automática. Debajo de 25% es riesgo crítico — el participante probablemente abandonará en los próximos 7–10 días sin intervención directa.",
  },
  {
    id: "atencion",
    icon: Zap,
    emoji: "🚨",
    name: "Necesitan atención · IA",
    desc: "El sistema detecta automáticamente quién está en riesgo y recomienda la acción exacta: recordatorio, misión o sesión uno a uno.",
    audience: "owner",
    tooltipTitle: "¿Por qué confiar en las recomendaciones del sistema?",
    tooltipText: "Las recomendaciones se generan con base en el historial completo del participante: última vez que se conectó, misiones atrasadas, patrón de asistencia y tendencia de su momentum en los últimos 30 días. El 87% de los participantes que recibieron la acción recomendada en las primeras 48 horas del alerta retuvieron su membresía.",
  },
  {
    id: "equipo",
    icon: LayoutDashboard,
    emoji: "👩‍💼",
    name: "Visibilidad de equipo",
    desc: "Métricas de cada coach: participantes atendidos, sesiones del mes, momentum de su generación y alertas de inactividad.",
    audience: "owner",
    tooltipTitle: "¿Qué hago si un coach tiene muchos días sin contacto grupal?",
    tooltipText: "Un semáforo rojo en \"último contacto grupal\" significa que pasaron más de 5 días sin que el coach publicara en el feed o enviara mensaje a su generación. Empieza con una conversación de apoyo — no de control. Pregunta cómo está y si necesita algo. Los coaches con alta carga suelen desconectarse sin darse cuenta, no por desidia.",
  },
  {
    id: "coach",
    icon: Brain,
    emoji: "🎓",
    name: "Panel del coach",
    desc: "Vista de su generación, expedientes de participantes, sugerencias de IA para cada sesión y notas compartidas.",
    audience: "coach",
    tooltipTitle: "¿Las notas que escribo las ve el dueño?",
    tooltipText: "Sí. Todas las notas de expediente son visibles para el dueño del centro y para operaciones. Escribe como si el participante no pudiera leerlas — con verdad profesional, no con juicios personales. Las notas son el historial clínico del proceso de transformación de cada persona.",
  },
  {
    id: "mensajes",
    icon: MessageSquare,
    emoji: "📱",
    name: "Mensajes y comunicación",
    desc: "Plantillas listas para eventos, cobros, bienvenidas y seguimiento. Enviadas por WhatsApp con un toque.",
    audience: "all",
    tooltipTitle: "¿Puedo personalizar los mensajes?",
    tooltipText: "Los campos entre corchetes [nombre] y [generación] se reemplazan automáticamente al enviar. El texto base está aprobado por el director — es tu marco de referencia. Si quieres agregar algo personal al final, puedes, pero mantén el texto base intacto para que el mensaje llegue con el tono y la información correcta.",
  },
  {
    id: "finanzas",
    icon: DollarSign,
    emoji: "💰",
    name: "Finanzas del centro",
    desc: "MRR, cobrado vs pendiente, desglose por generación, P&L simplificado y proyección del próximo mes.",
    audience: "owner",
    tooltipTitle: "¿El margen neto incluye los coaches?",
    tooltipText: "Sí. El margen neto descuenta coaches, staff general y plataforma. No incluye renta del espacio, materiales físicos ni gastos variables del evento — esos los puedes agregar en la configuración del centro para tener un P&L más preciso. El número que ves es el punto de partida, no el definitivo.",
  },
]

const AUDIENCES: { id: Feature["audience"]; label: string; color: string }[] = [
  { id: "all",   label: "Todos",     color: "bg-white/8 text-white border-white/15" },
  { id: "ops",   label: "Operativo", color: "bg-cyan-500/15 text-cyan-400 border-cyan-500/25" },
  { id: "owner", label: "Dueño",     color: "bg-violet-500/15 text-violet-400 border-violet-500/25" },
  { id: "coach", label: "Coach",     color: "bg-emerald-500/15 text-emerald-400 border-emerald-500/25" },
]

function audienceBadge(audience: Feature["audience"]) {
  const map: Record<Feature["audience"], string> = {
    ops:   "bg-cyan-500/15 text-cyan-400 border border-cyan-500/20",
    owner: "bg-violet-500/15 text-violet-400 border border-violet-500/20",
    coach: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20",
    all:   "bg-white/5 text-muted-foreground border border-white/10",
  }
  const labels: Record<Feature["audience"], string> = {
    ops: "Ops", owner: "Dueño", coach: "Coach", all: "Todos",
  }
  return { cls: map[audience], label: labels[audience] }
}

// ─── Tooltip bubble ───────────────────────────────────────────────────────────

function TooltipBubble({ title, text, onClose }: { title: string; text: string; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 4, scale: 0.97 }}
      transition={{ duration: 0.15 }}
      className="mt-3 rounded-xl border border-violet-500/30 bg-violet-600/10 p-3.5 space-y-1.5"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <HelpCircle className="w-3.5 h-3.5 text-violet-400 flex-shrink-0" />
          <p className="text-xs font-bold text-violet-500">{title}</p>
        </div>
        <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors flex-shrink-0">
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
      <p className="text-[11px] text-foreground/75 leading-relaxed">{text}</p>
    </motion.div>
  )
}

// ─── Feature card ─────────────────────────────────────────────────────────────

function FeatureCard({ feature }: { feature: Feature }) {
  const [open, setOpen] = useState(false)
  const { cls, label } = audienceBadge(feature.audience)
  const Icon = feature.icon

  return (
    <div className={cn(
      "glass rounded-2xl p-5 space-y-3 transition-all duration-200 hover:border-foreground/12",
      open && "border-violet-500/25"
    )}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-foreground/[0.05] border border-border flex items-center justify-center flex-shrink-0 mt-0.5">
            <Icon className="w-4.5 h-4.5 text-violet-400" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="text-sm font-bold text-foreground">{feature.name}</p>
              <span className={cn("px-1.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider", cls)}>
                {label}
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground leading-snug mt-1">{feature.desc}</p>
          </div>
        </div>
      </div>

      {/* Help trigger */}
      <button
        onClick={() => setOpen((p) => !p)}
        className={cn(
          "flex items-center gap-1.5 text-[11px] font-medium transition-colors rounded-lg px-2.5 py-1.5 -mx-1 w-full text-left",
          open
            ? "text-violet-300 bg-violet-500/10"
            : "text-muted-foreground hover:text-violet-300 hover:bg-violet-500/8"
        )}
      >
        <HelpCircle className="w-3.5 h-3.5 flex-shrink-0" />
        <span className="flex-1 truncate">{feature.tooltipTitle}</span>
        <ChevronRight className={cn("w-3 h-3 flex-shrink-0 transition-transform", open && "rotate-90")} />
      </button>

      <AnimatePresence>
        {open && (
          <TooltipBubble
            title={feature.tooltipTitle}
            text={feature.tooltipText}
            onClose={() => setOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── Section ──────────────────────────────────────────────────────────────────

export function TodoIncluidoSection() {
  const [filter, setFilter] = useState<Feature["audience"] | "all">("all")

  const visible = filter === "all"
    ? FEATURES
    : FEATURES.filter((f) => f.audience === filter || f.audience === "all")

  return (
    <section className="px-6 py-28 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="max-w-3xl mx-auto text-center mb-16"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-600/15 border border-cyan-500/30 text-cyan-400 text-xs font-semibold mb-5">
          <BookOpen className="w-3.5 h-3.5" />
          Programa completo — software + capacitación + procesos
        </div>

        <h2 className="text-4xl sm:text-5xl font-black text-foreground leading-tight mb-5">
          Todo viene incluido.<br />
          <span className="gradient-text">Nadie llega sin saber qué hacer.</span>
        </h2>

        <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
          La mayoría del staff operativo viene de los propios entrenamientos. Tienen el corazón y el compromiso,
          pero no siempre los procesos. ELEVA está diseñado para que cualquier persona — sin experiencia previa
          en software ni en administración — pueda operar el centro desde su primer turno.
        </p>
      </motion.div>

      {/* Staff training callout */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="max-w-4xl mx-auto mb-14"
      >
        <div className="rounded-2xl border border-cyan-500/25 bg-cyan-500/6 p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row items-start gap-5">
            <div className="w-14 h-14 rounded-2xl bg-cyan-500/15 border border-cyan-500/25 flex items-center justify-center flex-shrink-0">
              <span className="text-3xl">🎓</span>
            </div>
            <div className="flex-1 space-y-4">
              <div>
                <p className="text-lg font-bold text-foreground mb-1">
                  El staff llega capacitado desde el primer turno — no el tercero.
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Cada pantalla del sistema tiene guías integradas, textos de contexto y flujos paso a paso.
                  Si Karla nunca ha creado un expediente de participante, el sistema le explica qué dato va en
                  cada campo y por qué importa. Si es su primera vez en la mesa de registro, un panel de instrucciones
                  colapsable le recuerda el flujo completo.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { stat: "98%", label: "del staff aprende el sistema en su primer turno" },
                  { stat: "0", label: "horas de capacitación externa requeridas" },
                  { stat: "Siempre", label: "disponibles — los (?) están en cada pantalla" },
                ].map((s) => (
                  <div key={s.stat} className="bg-foreground/[0.04] border border-border rounded-xl p-3 text-center">
                    <p className="text-xl font-black text-cyan-400">{s.stat}</p>
                    <p className="text-[10px] text-muted-foreground leading-snug mt-0.5">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Help texts callout */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="max-w-4xl mx-auto mb-14"
      >
        <div className="rounded-2xl border border-violet-500/25 bg-violet-500/6 p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-xl bg-violet-500/20 border border-violet-500/30 flex items-center justify-center flex-shrink-0">
              <HelpCircle className="w-4.5 h-4.5 text-violet-400" />
            </div>
            <div>
              <p className="text-sm font-bold text-foreground">Los (?) están en todas partes — y no son decorativos</p>
              <p className="text-xs text-muted-foreground">Responden exactamente la duda del momento, en el contexto donde surge</p>
            </div>
          </div>

          {/* Simulated tooltip examples */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              {
                screen: "Mesa de Registro",
                q: "¿Qué hago si alguien tiene pago vencido pero quiere entrar?",
                a: "No lo detengas. Regístralo normalmente. El sistema ya notificó al dueño y al coach. Anota en CRM si el participante te mencionó algo.",
              },
              {
                screen: "Creación de expediente",
                q: "¿Qué pasa si no sé a qué generación asignarlo?",
                a: "Deja el campo de generación en blanco por ahora. El sistema marcará el perfil como 'incompleto' y el dueño verá la alerta para completarlo.",
              },
              {
                screen: "Pre-entrenamiento",
                q: "¿Cuántas veces puedo intentar contactar a alguien?",
                a: "El sistema registra hasta 3 intentos. Después del tercero, el sistema genera una alerta para que el coach haga el contacto personal. No insistas más allá de eso.",
              },
              {
                screen: "Comunidad",
                q: "¿Puedo inventar el mensaje si las plantillas no aplican?",
                a: "Consulta con el dueño antes. Las plantillas cubren el 95% de los casos — si no aplica ninguna, es una situación que el director necesita manejar directamente.",
              },
            ].map((ex, i) => (
              <div key={i} className="bg-foreground/[0.03] border border-border rounded-xl p-3.5 space-y-2">
                <p className="text-[9px] uppercase tracking-widest text-violet-500 font-semibold">{ex.screen}</p>
                <div className="flex items-start gap-2">
                  <HelpCircle className="w-3.5 h-3.5 text-violet-400 flex-shrink-0 mt-0.5" />
                  <p className="text-xs font-semibold text-foreground leading-snug">{ex.q}</p>
                </div>
                <p className="text-[11px] text-muted-foreground leading-relaxed pl-5">{ex.a}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Filter tabs */}
      <div className="max-w-4xl mx-auto mb-8">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="text-xs text-muted-foreground font-medium mr-1">Filtrar por rol:</p>
          {AUDIENCES.map((a) => (
            <button
              key={a.id}
              onClick={() => setFilter(a.id)}
              className={cn(
                "px-3 py-1.5 rounded-full text-xs font-semibold border transition-all",
                filter === a.id
                  ? a.color
                  : "bg-foreground/[0.03] text-muted-foreground border-border hover:border-foreground/15 hover:text-foreground"
              )}
            >
              {a.label}
            </button>
          ))}
          <p className="text-[10px] text-muted-foreground ml-1">
            · Toca el <HelpCircle className="w-3 h-3 inline text-violet-400 mx-0.5" /> en cada módulo para ver el texto de ayuda real
          </p>
        </div>
      </div>

      {/* Features grid */}
      <motion.div
        layout
        className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        <AnimatePresence mode="popLayout">
          {visible.map((f) => (
            <motion.div
              key={f.id}
              layout
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.94 }}
              transition={{ duration: 0.2 }}
            >
              <FeatureCard feature={f} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* What's included summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="max-w-4xl mx-auto mt-16"
      >
        <div className="rounded-2xl border border-border bg-foreground/[0.02] p-6 sm:p-8">
          <p className="text-sm font-bold text-foreground mb-5 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-green-400" />
            Lo que viene en cada suscripción
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-2.5">
            {[
              "Software completo para dueño, coach, ops y participante",
              "Guías y textos de ayuda integrados en cada pantalla",
              "Flujos paso a paso para todos los procesos operativos",
              "Plantillas de mensajes aprobadas y editables",
              "Panel de operaciones con dashboard de urgencias diarias",
              "Mesa de Registro con instrucciones colapsables en pantalla",
              "CRM con expediente guiado de cada participante",
              "Pre-entrenamiento con seguimiento de confirmaciones",
              "Hub de comunidad con contacto directo a coaches",
              "Motor de IA para detección de riesgo de abandono",
              "Finanzas: MRR, cobrado, pendiente y margen neto",
              "Sesión de implementación incluida — arrancamos juntos",
            ].map((item) => (
              <div key={item} className="flex items-start gap-2.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-green-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-muted-foreground leading-snug">{item}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-col sm:flex-row items-center gap-3">
            <Link href="/vl2026/ops/dashboard">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-2 px-6 py-3 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-sm font-bold transition-colors"
              >
                Explorar el panel de operaciones
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </Link>
            <Link href="/funcionalidades" className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
              Ver todas las funcionalidades <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
