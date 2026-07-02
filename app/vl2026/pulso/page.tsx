"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { AnimatePresence } from "framer-motion"
import { AlertTriangle, Users, Calendar, Activity, ArrowRight, Zap, Lightbulb, DollarSign, TrendingUp } from "lucide-react"
import { MomentumGauge } from "@/components/demo/MomentumGauge"
import { OnboardingModal } from "@/components/demo/OnboardingModal"
import { InsightCard } from "@/components/demo/InsightCard"
import { CampaignComposer, type ComposerInsight } from "@/components/demo/CampaignComposer"
import { ActionToast, useActionToast } from "@/components/demo/ActionToast"
import { PlanGenerator } from "@/components/demo/PlanGenerator"
import { PlanTipsDrawer, PlanTrigger, PLAN_CONFIGS } from "@/components/demo/PlanTipsDrawer"
import { COHORTES, RECENT_ACTIVITY, CENTERS } from "@/data/level"
import { getMomentumColor } from "@/lib/utils"
import { cn } from "@/lib/utils"
import { InfoTooltip } from "@/components/demo/InfoTooltip"
import { useDemoStore } from "@/lib/demo-store"

const ONBOARDING = {
  screenId: "pulso",
  badge: "Vista del dueño · Pantalla 1 de 3",
  badgeColor: "violet" as const,
  title: "Pulso del Centro",
  description: "Aquí empieza cada mañana el dueño del centro. En 30 segundos sabes el estado completo de tu operación, sin abrir Excel ni revisar grupos de WhatsApp.",
  tips: [
    { emoji: "🔴", text: "La alerta roja muestra participantes en riesgo automáticamente. Tócala para intervenir." },
    { emoji: "📊", text: "El Momentum Score es el promedio de todos tus participantes activos en tiempo real." },
    { emoji: "⚡", text: "La actividad reciente reemplaza el caos de WhatsApp con señales claras de lo que está pasando." },
  ],
  cta: "Explorar el Pulso →",
}

type InsightDef = {
  id: string
  icon: string
  severity: "high" | "medium" | "info"
  title: string
  description: string
  actionLabel: string
  composer: ComposerInsight
}

const INSIGHTS: InsightDef[] = [
  {
    id: "inactive",
    icon: "🔴",
    severity: "high",
    title: "14 participantes sin actividad +7 días",
    description: "Momentum del grupo cayó 8 pts. Sin acción, 3 cancelarán antes del mes 4.",
    actionLabel: "Contactar",
    composer: {
      title: "Reactivar participantes inactivos (14)",
      recipients: { count: 14, label: "Participantes sin actividad +7 días" },
      defaultChannel: "whatsapp",
      messages: {
        whatsapp: "Hola {nombre} 🌟 Soy Carlos de LEVEL. Te he visto un poco desconectado estos días y quería saber cómo estás. Tu proceso nos importa, ¿hay algo en lo que pueda apoyarte? Aquí estoy para ti.",
        emailSubject: "Carlos de LEVEL quería saber cómo estás 💙",
        emailBody: "Hola {nombre},\n\nNos has faltado en LEVEL.\n\nSé que la vida tiene altibajos y eso está completamente bien. Lo que importa es que no estás solo en este proceso, el equipo y yo estamos aquí.\n\n¿Qué está pasando? ¿Cómo puedo apoyarte esta semana?\n\nCon cariño,\nCarlos Mendoza\nLEVEL Transformación",
        sms: "Hola {nombre}, Carlos de LEVEL aquí. ¿Todo bien? Te echamos de menos. Escríbeme cuando puedas, aquí estoy. 🌟",
        campaignSubject: "Tu proceso nos importa, {nombre}",
        campaignBody: "Hola {nombre},\n\nNotamos que has estado desconectado y queremos saber cómo estás. En LEVEL nadie se queda atrás. Responde este mensaje y hablamos.",
        segment: "14 participantes, sin actividad 7+ días, momentum <40%",
      },
    },
  },
  {
    id: "norte",
    icon: "📉",
    severity: "medium",
    title: "Gen. Norte: momentum cayó de 65% a 58%",
    description: "Bajó 7 pts en 2 semanas. Marco reprogramó una sesión grupal, 3 participantes en riesgo alto.",
    actionLabel: "Activar cohorte",
    composer: {
      title: "Activar Generación Norte (67 participantes)",
      recipients: { count: 67, label: "Generación Norte, Expansión completada" },
      defaultChannel: "campaign",
      messages: {
        whatsapp: "Generación Norte 💪 Esta semana nos volvemos a conectar. Marco tiene algo especial preparado para ustedes. Más info en el grupo.",
        emailSubject: "Generación Norte, algo importante esta semana",
        emailBody: "Hola {nombre},\n\nGeneración Norte está lista para el siguiente nivel.\n\nMarco tiene preparada una sesión especial para reactivar el grupo. No te la pierdas.\n\n¿Estás adentro?\n\nLEVEL Transformación",
        sms: "Gen. Norte: sesión especial con Marco esta semana. Confirma asistencia respondiendo SÍ. LEVEL 🔥",
        campaignSubject: "Gen. Norte, no dejes que el momentum caiga",
        campaignBody: "Hola {nombre},\n\nLa Generación Norte tiene una energía increíble y queremos que se mantenga. Esta semana hay una activación grupal. Más detalles muy pronto.",
        segment: "67 participantes, Generación Norte, momentum <65%",
      },
    },
  },
  {
    id: "pago",
    icon: "💳",
    severity: "info",
    title: "Pago pendiente: Valeria Romo, $4,200",
    description: "PL Mes 4, vencido hace 3 días. Único atraso en todo su historial.",
    actionLabel: "Enviar recordatorio",
    composer: {
      title: "Recordatorio de pago, Valeria Romo",
      recipients: { count: 1, label: "Valeria Romo · PL Mes 4" },
      defaultChannel: "email",
      messages: {
        whatsapp: "Hola Valeria 😊 Pasando a recordarte que el pago de Mes 4 de PL está pendiente. ¿Puedo ayudarte a coordinarlo? Cualquier cosa, aquí estoy.",
        emailSubject: "Recordatorio: Pago Mes 4, PL",
        emailBody: "Hola Valeria,\n\nTe escribimos para recordarte que el pago correspondiente al Mes 4 de PL ($4,200 MXN) está pendiente.\n\nSabemos que a veces se pasan estas cosas, no hay problema. Puedes realizarlo por transferencia a la cuenta de siempre o escribirnos si necesitas coordinar.\n\nGracias por confiar en LEVEL,\nEl equipo",
        sms: "Hola Valeria, recordatorio del pago Mes 4 de PL ($4,200). Escríbenos si necesitas ayuda. LEVEL.",
        campaignSubject: "Recordatorio: Pago Mes 4 pendiente",
        campaignBody: "Hola Valeria, tienes un pago pendiente del Mes 4. Coordínalo cuando puedas.",
        segment: "1 participante, Valeria Romo, pago pendiente",
      },
    },
  },
  {
    id: "evento",
    icon: "📅",
    severity: "medium",
    title: "Evento en 4 días, solo 34% confirmó asistencia",
    description: "Sesión en vivo jueves 7pm. 59 de 89 sin confirmar, un recordatorio sube asistencia 40%.",
    actionLabel: "Recordar evento",
    composer: {
      title: "Confirmación de asistencia, Sesión Gen. Omega",
      recipients: { count: 59, label: "Generación Omega sin confirmar asistencia" },
      defaultChannel: "sms",
      messages: {
        whatsapp: "Hola {nombre} 👋 Recordatorio: sesión en vivo de Generación Omega este JUEVES a las 7pm. ¡No te la pierdas! Responde '✅' para confirmar tu lugar.",
        emailSubject: "Te esperamos el jueves, Sesión Gen. Omega 7pm",
        emailBody: "Hola {nombre},\n\n¡Este JUEVES es la sesión en vivo de Generación Omega!\n\n📅 Jueves, 5 de junio\n⏰ 7:00 PM (hora CDMX)\n📍 Zoom, link en el grupo\n\nEsta sesión es especial, Ana tiene algo importante que compartir con el grupo.\n\n¿Confirmamos tu lugar?\n\nEquipo LEVEL",
        sms: "Hola {nombre}! Sesión Gen. Omega JUEVES 7pm. Confirma respondiendo SÍ. ¡Te esperamos! LEVEL",
        campaignSubject: "Tu lugar en la sesión del jueves, confirma ahora",
        campaignBody: "Hola {nombre}, este jueves a las 7pm es tu sesión en vivo. Confirma asistencia para reservar tu lugar. Ana tiene algo importante para ti.",
        segment: "59 participantes Gen. Omega, sin confirmar asistencia",
      },
    },
  },
]

const ACTIVITY_ICONS: Record<string, string> = {
  success: "🟢",
  specialist: "🔵",
  new: "✨",
  warning: "🟡",
  event: "📅",
}

const DAY_NAMES = ["domingo","lunes","martes","miércoles","jueves","viernes","sábado"]
const MONTH_NAMES = ["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"]

export default function PulsoPage() {
  const [activeInsight, setActiveInsight] = useState<InsightDef | null>(null)
  const [activePlan, setActivePlan] = useState<string | null>(null)
  const { toast, show, hide } = useActionToast()
  const { state } = useDemoStore()
  const center = CENTERS.find((c) => c.id === state.selectedCenter) ?? CENTERS[0]

  const dateLabel = useMemo(() => {
    const d = new Date()
    return `${DAY_NAMES[d.getDay()]}, ${d.getDate()} de ${MONTH_NAMES[d.getMonth()]}`
  }, [])

  const dateShort = useMemo(() => {
    const d = new Date()
    return `${DAY_NAMES[d.getDay()].slice(0, 3)} ${d.getDate()} ${MONTH_NAMES[d.getMonth()].slice(0, 3)}`
  }, [])

  const collectedPct = Math.round((center.collected / center.monthlyRevenue) * 100)

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <OnboardingModal config={ONBOARDING} />
      {activeInsight && (
        <CampaignComposer
          insight={activeInsight.composer}
          onClose={() => setActiveInsight(null)}
          onSent={(msg) => { setActiveInsight(null); show(msg) }}
        />
      )}
      <AnimatePresence>
        {activePlan && PLAN_CONFIGS[activePlan] && (
          <PlanTipsDrawer
            config={PLAN_CONFIGS[activePlan]}
            onClose={() => setActivePlan(null)}
          />
        )}
      </AnimatePresence>
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white">Pulso del Centro</h1>
          <p className="text-muted-foreground text-sm mt-0.5 hidden sm:block">{center.fullName} · {dateLabel}</p>
          <p className="text-muted-foreground text-xs mt-0.5 sm:hidden">{center.name} · {dateShort}</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 flex-shrink-0 whitespace-nowrap">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-xs font-medium text-green-400">Sistema activo</span>
        </div>
      </div>

      {/* Financial snapshot */}
      <Link href="/vl2026/finanzas">
        <div className="glass rounded-xl p-4 hover:bg-white/3 transition-colors cursor-pointer group">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">Ingreso del mes</span>
            </div>
            <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-semibold">
              <TrendingUp className="w-3 h-3" />
              +{center.monthlyGrowth}% vs mes anterior
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <p className="text-xl font-black text-white">${(center.monthlyRevenue / 1000).toFixed(0)}k</p>
              <p className="text-[10px] text-muted-foreground">Revenue total</p>
            </div>
            <div>
              <p className="text-xl font-black text-emerald-400">${(center.collected / 1000).toFixed(0)}k</p>
              <p className="text-[10px] text-muted-foreground">Cobrado ({collectedPct}%)</p>
            </div>
            <div>
              <p className="text-xl font-black text-yellow-400">${(center.pending / 1000).toFixed(0)}k</p>
              <p className="text-[10px] text-muted-foreground">Pendiente de cobro</p>
            </div>
            <div>
              <p className="text-xl font-black text-violet-400">{center.netMargin}%</p>
              <p className="text-[10px] text-muted-foreground">Margen neto</p>
            </div>
          </div>
          <div className="mt-3 h-1 rounded-full bg-white/6 overflow-hidden">
            <div className="h-full rounded-full bg-emerald-500 transition-all" style={{ width: `${collectedPct}%` }} />
          </div>
        </div>
      </Link>

      {/* Alert banner */}
      <Link href="/vl2026/atencion">
        <div className="glass-violet rounded-xl p-4 flex items-center gap-4 hover:bg-violet-600/15 transition-colors cursor-pointer group">
          <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="w-5 h-5 text-red-400" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-white">
              {center.atRiskCount} participantes necesitan atención hoy
            </p>
            <p className="text-sm text-muted-foreground">
              Valeria Romo lleva 11 días inactiva · Momentum crítico: 23%
            </p>
          </div>
          <ArrowRight className="w-5 h-5 text-violet-400 group-hover:translate-x-1 transition-transform" />
        </div>
      </Link>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Momentum gauge */}
        <div className="glass rounded-2xl p-6 flex flex-col items-center justify-center gap-4">
          <div className="flex items-center gap-1.5 text-xs uppercase tracking-widest text-muted-foreground font-medium">
            Momentum del Centro
            <InfoTooltip
              title="Momentum del Centro"
              source="Promedio ponderado del Momentum Score individual de cada participante activo. Se recalcula cada 24h."
              formula="Σ(momentum_i) / n_activos"
              why="Un centro sano mantiene momentum >65%. Por debajo de 55% indica que el programa necesita intervención sistémica, no solo individual."
              benchmark=">65% saludable · <50% crítico"
              action="Si cae más de 8 puntos en una semana, revisar asistencia a eventos y actividad de coaches."
              side="bottom"
            />
          </div>
          <MomentumGauge score={center.averageMomentum} size="lg" />
          <p className="text-xs text-muted-foreground text-center">
            Promedio de {center.activeParticipants} participantes activos
          </p>
          <PlanTrigger onClick={() => setActivePlan("momentum")} />
        </div>

        {/* Stats grid */}
        <div className="lg:col-span-2 grid grid-cols-2 gap-4">
          <StatCard
            icon={<Users className="w-5 h-5 text-cyan-400" />}
            value={center.activeParticipants}
            label="Participantes activos"
            sub={`+${center.monthlyGrowth}% vs mes anterior`}
            color="cyan"
            onPlan={() => setActivePlan("participantes")}
            tooltip={
              <InfoTooltip
                title="Participantes activos"
                source="Personas con al menos una interacción registrada en los últimos 30 días (misión completada, evento asistido, o mensaje enviado)."
                why="Es la métrica base de salud operativa. Define cuántas personas realmente viven el programa vs. cuántas están inscritas pero ausentes."
                benchmark=">80% de inscritos activos · <60% requiere campaña de reactivación"
                action="Si baja semana a semana por más de 3%, lanzar campaña de reactivación segmentada."
              />
            }
          />
          <Link href="/vl2026/atencion">
            <StatCard
              icon={<AlertTriangle className="w-5 h-5 text-red-400" />}
              value={center.atRiskCount}
              label="Necesitan atención"
              sub="Toca para intervenir →"
              color="red"
              clickable
              onPlan={() => setActivePlan("riesgo")}
              tooltip={
                <InfoTooltip
                  title="Participantes en riesgo"
                  source="Personas con Momentum <40% O sin actividad >7 días O pago vencido >5 días. Se combina en una sola alerta priorizada."
                  why="El riesgo de churn se dispara cuando se cruzan dos señales al mismo tiempo. Intervenir en las primeras 72h reduce cancelaciones hasta 60%."
                  benchmark="<5% del total activo · >10% requiere revisión de programa"
                  action="Si supera 15 personas, revisar si hay patrón por cohorte o por coach."
                  side="bottom"
                />
              }
            />
          </Link>
          <StatCard
            icon={<Activity className="w-5 h-5 text-violet-400" />}
            value={center.activeCohortes}
            label="Cohortes activas"
            sub="Gen. Omega · Norte · Vía 12"
            color="violet"
            onPlan={() => setActivePlan("cohortes")}
          />
          <StatCard
            icon={<Calendar className="w-5 h-5 text-yellow-400" />}
            value={`${center.nextEventDays} días`}
            label="Próximo evento"
            sub="Sesión en vivo, Gen. Omega"
            color="yellow"
            onPlan={() => setActivePlan("evento")}
          />
        </div>
      </div>

      {/* Cohortes */}
      <div>
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-widest mb-3">
          Cohortes activas
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {COHORTES.map((c) => {
            const planKey = c.name.toLowerCase().includes("omega") ? "omega"
              : c.name.toLowerCase().includes("norte") ? "norte"
              : "via12"
            return (
              <div key={c.id} className="glass rounded-xl p-4 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold text-white text-sm">{c.name}</p>
                    <p className="text-xs text-muted-foreground">{c.phase} · {c.phaseDetail}</p>
                  </div>
                  <StatusBadge status={c.status} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold" style={{ color: getMomentumColor(c.momentum) }}>
                      {c.momentum}%
                    </p>
                    <p className="text-[11px] text-muted-foreground">momentum</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-white">{c.participants}</p>
                    <p className="text-[11px] text-muted-foreground">participantes</p>
                  </div>
                </div>
                <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-1000"
                    style={{ width: `${c.momentum}%`, backgroundColor: getMomentumColor(c.momentum) }}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-[11px] text-muted-foreground">Coach: {c.coach}</p>
                  <PlanTrigger onClick={() => setActivePlan(planKey)} />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Insights accionables */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Lightbulb className="w-4 h-4 text-violet-400" />
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-widest">
            Insights del sistema
          </h2>
          <span className="ml-auto text-[10px] px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-400 border border-violet-500/20 font-semibold">
            IA
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {INSIGHTS.map((insight) => (
            <InsightCard
              key={insight.id}
              icon={insight.icon}
              severity={insight.severity}
              title={insight.title}
              description={insight.description}
              actionLabel={insight.actionLabel}
              onClick={() => setActiveInsight(insight)}
            />
          ))}
        </div>
      </div>

      {/* Recent activity */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Zap className="w-4 h-4 text-yellow-400" />
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-widest">
            Actividad reciente
          </h2>
        </div>
        <div className="glass rounded-xl divide-y divide-border">
          {RECENT_ACTIVITY.map((item, i) => (
            <div key={i} className="flex items-center gap-3 px-4 py-3">
              <span className="text-base flex-shrink-0">{ACTIVITY_ICONS[item.type]}</span>
              <p className="text-sm text-foreground flex-1">{item.text}</p>
              <span className="text-xs text-muted-foreground whitespace-nowrap flex-shrink-0">
                {item.time}
              </span>
            </div>
          ))}
        </div>
      </div>
      {/* Convertir en Plan */}
      <PlanGenerator />

      <ActionToast message={toast.message} visible={toast.visible} onHide={hide} />
    </div>
  )
}

function StatCard({
  icon,
  value,
  label,
  sub,
  color,
  clickable,
  tooltip,
  onPlan,
}: {
  icon: React.ReactNode
  value: string | number
  label: string
  sub: string
  color: "cyan" | "red" | "violet" | "yellow"
  clickable?: boolean
  tooltip?: React.ReactNode
  onPlan?: () => void
}) {
  const borders = {
    cyan: "border-cyan-500/20 hover:border-cyan-500/40",
    red: "border-red-500/20 hover:border-red-500/40",
    violet: "border-violet-500/20 hover:border-violet-500/40",
    yellow: "border-yellow-500/20 hover:border-yellow-500/40",
  }

  return (
    <div
      className={cn(
        "glass rounded-xl p-4 space-y-2 transition-colors",
        borders[color],
        clickable && "cursor-pointer"
      )}
    >
      <div className="flex items-center gap-2">
        {icon}
        <span className="text-xs text-muted-foreground font-medium">{label}</span>
        {tooltip}
      </div>
      <p className="text-3xl font-black text-white">{value}</p>
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">{sub}</p>
        {onPlan && <PlanTrigger onClick={(e) => { e?.preventDefault(); e?.stopPropagation(); onPlan() }} />}
      </div>
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  if (status === "thriving")
    return (
      <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-500/15 text-green-400 border border-green-500/20 font-medium whitespace-nowrap">
        Muy activa
      </span>
    )
  if (status === "active")
    return (
      <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-400 border border-cyan-500/20 font-medium whitespace-nowrap">
        Activa
      </span>
    )
  return (
    <span className="text-[10px] px-2 py-0.5 rounded-full bg-yellow-500/15 text-yellow-400 border border-yellow-500/20 font-medium whitespace-nowrap">
      Atención
    </span>
  )
}
