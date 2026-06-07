"use client"

import { useState } from "react"
import {
  Mail, MessageCircle, Send, Users, BarChart3, Plus,
  CheckCircle2, Clock, AlertCircle, ChevronRight, X,
  Zap, RefreshCcw, Star,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { ActionToast, useActionToast } from "@/components/demo/ActionToast"
import { OnboardingModal } from "@/components/demo/OnboardingModal"
import { AvatarBadge } from "@/components/demo/AvatarBadge"

const ONBOARDING = {
  screenId: "campanas",
  badge: "Vista del dueño · Campañas",
  badgeColor: "violet" as const,
  title: "Llega a toda tu comunidad con un clic",
  description: "Envía campañas de email y WhatsApp a generaciones activas, egresados o toda la comunidad. Automatiza recordatorios, reactivaciones y bienvenidas.",
  tips: [
    { emoji: "📬", text: "Filtra por generación, fase o nivel de momentum para segmentar con precisión." },
    { emoji: "🤖", text: "Las automatizaciones se ejecutan solas — bienvenidas, recordatorios de pago, cumpleaños." },
    { emoji: "📊", text: "Ve tasas de apertura y clicks en tiempo real para saber qué resuena con tu comunidad." },
  ],
  cta: "Ver campañas →",
}

type CampaignType = "email" | "whatsapp"
type CampaignStatus = "activa" | "borrador" | "enviada" | "programada"

type Campaign = {
  id: string
  name: string
  type: CampaignType
  status: CampaignStatus
  audience: string
  audienceCount: number
  sentAt?: string
  scheduledFor?: string
  stats?: { enviadas: number; abiertas: number; clicks: number }
  preview: string
}

const CAMPAIGNS: Campaign[] = [
  {
    id: "c1",
    name: "Reactivación — Generación Norte (inactivos 30+ días)",
    type: "whatsapp",
    status: "enviada",
    audience: "Gen. Norte · Inactivos",
    audienceCount: 23,
    sentAt: "Hace 2 días",
    stats: { enviadas: 23, abiertas: 21, clicks: 9 },
    preview: "¡Hola {nombre}! Han pasado 30 días desde tu último check-in en la app. Tu momentum está esperándote...",
  },
  {
    id: "c2",
    name: "Invitación Noche de Invitados — Jue 12 junio",
    type: "email",
    status: "enviada",
    audience: "Toda la comunidad",
    audienceCount: 214,
    sentAt: "Hace 5 días",
    stats: { enviadas: 214, abiertas: 167, clicks: 89 },
    preview: "Este jueves a las 8pm te esperamos en nuestra Noche de Invitados con la Dra. Carmen López...",
  },
  {
    id: "c3",
    name: "Recordatorio de pago — Junio 2025",
    type: "whatsapp",
    status: "programada",
    audience: "Participantes con pago pendiente",
    audienceCount: 4,
    scheduledFor: "Mañana · 10:00 AM",
    preview: "Hola {nombre}, te recordamos que tu mensualidad de junio por $4,200 MXN está pendiente...",
  },
  {
    id: "c4",
    name: "Bienvenida nuevos participantes — Gen. Omega",
    type: "whatsapp",
    status: "activa",
    audience: "Gen. Omega · Nuevos",
    audienceCount: 12,
    preview: "¡Bienvenido a Creania, {nombre}! 🎉 Tu coach Ana Reyes y toda tu generación Omega están listos para acompañarte...",
  },
  {
    id: "c5",
    name: "Newsletter mensual — Mayo 2025",
    type: "email",
    status: "enviada",
    audience: "Toda la comunidad",
    audienceCount: 214,
    sentAt: "Hace 32 días",
    stats: { enviadas: 214, abiertas: 141, clicks: 62 },
    preview: "Este mes en Creania: 3 nuevas misiones completadas, récord de momentum y la historia de Diego...",
  },
  {
    id: "c6",
    name: "Oferta — Entrenamiento 1 · Julio",
    type: "email",
    status: "borrador",
    audience: "Egresados sin generación activa",
    audienceCount: 67,
    preview: "Ya viviste el cambio una vez. Imagina lo que pasa cuando traes a alguien contigo al Despertar...",
  },
]

const AUTOMATIONS = [
  { id: "a1", name: "Bienvenida al registrarse", type: "whatsapp" as CampaignType, trigger: "Al crear perfil", active: true, sent: 89 },
  { id: "a2", name: "Recordatorio de pago (3 días vencido)", type: "whatsapp" as CampaignType, trigger: "Pago vencido +3 días", active: true, sent: 34 },
  { id: "a3", name: "Felicitación de cumpleaños", type: "whatsapp" as CampaignType, trigger: "Día de cumpleaños · 9:00 AM", active: true, sent: 23 },
  { id: "a4", name: "Reactivación por inactividad", type: "email" as CampaignType, trigger: "Sin check-in 21 días", active: true, sent: 41 },
  { id: "a5", name: "Resumen semanal del coach", type: "email" as CampaignType, trigger: "Lunes · 8:00 AM", active: false, sent: 0 },
]

const STATUS_META: Record<CampaignStatus, { label: string; color: string; icon: React.ElementType }> = {
  enviada:    { label: "Enviada",     color: "text-green-400 bg-green-500/10 border-green-500/20",    icon: CheckCircle2 },
  activa:     { label: "Activa",      color: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",       icon: Zap },
  programada: { label: "Programada",  color: "text-amber-400 bg-amber-500/10 border-amber-500/20",    icon: Clock },
  borrador:   { label: "Borrador",    color: "text-muted-foreground bg-white/5 border-white/10",      icon: AlertCircle },
}

function TypeBadge({ type }: { type: CampaignType }) {
  return type === "email"
    ? <span className="flex items-center gap-1 text-[10px] font-semibold text-violet-300 bg-violet-500/10 border border-violet-500/20 rounded-full px-2 py-0.5"><Mail className="w-2.5 h-2.5" /> Email</span>
    : <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-2 py-0.5"><MessageCircle className="w-2.5 h-2.5" /> WhatsApp</span>
}

type NewCampaignStep = "type" | "audience" | "content" | "success"

function NewCampaignDrawer({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState<NewCampaignStep>("type")
  const [selectedType, setSelectedType] = useState<CampaignType | null>(null)
  const [selectedAudience, setSelectedAudience] = useState<string | null>(null)
  const [sending, setSending] = useState(false)

  const audiences = [
    { id: "omega", label: "Gen. Omega", count: 89, sub: "Vía Creania · mes 3" },
    { id: "norte", label: "Gen. Norte", count: 67, sub: "Expansión · semana 2" },
    { id: "via12", label: "Gen. Vía 12", count: 58, sub: "Completada · egresados" },
    { id: "todos", label: "Toda la comunidad", count: 214, sub: "Activos + egresados" },
    { id: "inactivos", label: "Inactivos 30+ días", count: 41, sub: "Sin check-in reciente" },
    { id: "pendientes", label: "Pago pendiente", count: 4, sub: "Vencidos este mes" },
  ]

  function handleSend() {
    setSending(true)
    setTimeout(() => { setSending(false); setStep("success") }, 2000)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full sm:max-w-lg bg-[#0f1117] border border-white/10 rounded-t-2xl sm:rounded-2xl overflow-hidden max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/8">
          <p className="font-bold text-white">Nueva campaña</p>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/8 text-muted-foreground"><X className="w-4 h-4" /></button>
        </div>

        {/* Step bar */}
        <div className="flex items-center gap-0 px-5 py-3 border-b border-white/5">
          {(["type", "audience", "content"] as const).map((s, i) => {
            const steps = ["type", "audience", "content", "success"]
            const currentIdx = steps.indexOf(step)
            const thisIdx = steps.indexOf(s)
            const done = currentIdx > thisIdx
            const active = step === s
            return (
              <div key={s} className="flex items-center">
                <div className={cn("w-6 h-6 rounded-full text-[10px] font-bold flex items-center justify-center transition-all",
                  done ? "bg-violet-600 text-white" : active ? "bg-violet-600/30 border border-violet-500 text-violet-300" : "bg-white/5 text-muted-foreground")}>
                  {done ? <CheckCircle2 className="w-3.5 h-3.5" /> : i + 1}
                </div>
                {i < 2 && <div className={cn("w-10 h-px mx-1", done ? "bg-violet-600" : "bg-white/10")} />}
              </div>
            )
          })}
          <span className="ml-3 text-xs text-muted-foreground">{step === "type" ? "Canal" : step === "audience" ? "Audiencia" : step === "content" ? "Mensaje" : ""}</span>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {step === "type" && (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">¿Por qué canal quieres enviar esta campaña?</p>
              {(["whatsapp", "email"] as CampaignType[]).map((t) => (
                <button key={t} onClick={() => setSelectedType(t)}
                  className={cn("w-full flex items-center gap-4 p-4 rounded-xl border text-left transition-all",
                    selectedType === t ? "border-violet-500/50 bg-violet-600/10" : "glass hover:border-white/20")}>
                  <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center",
                    t === "whatsapp" ? "bg-emerald-600/20" : "bg-violet-600/20")}>
                    {t === "whatsapp" ? <MessageCircle className="w-5 h-5 text-emerald-400" /> : <Mail className="w-5 h-5 text-violet-400" />}
                  </div>
                  <div>
                    <p className="font-semibold text-white">{t === "whatsapp" ? "WhatsApp" : "Email"}</p>
                    <p className="text-xs text-muted-foreground">{t === "whatsapp" ? "Alta tasa de lectura · 94% abiertos" : "Ideal para contenido extenso y diseño visual"}</p>
                  </div>
                  {selectedType === t && <CheckCircle2 className="w-4 h-4 text-violet-400 ml-auto" />}
                </button>
              ))}
              <button onClick={() => selectedType && setStep("audience")}
                disabled={!selectedType}
                className="w-full py-3 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-40 text-white font-semibold text-sm transition-all">
                Continuar →
              </button>
            </div>
          )}

          {step === "audience" && (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">¿A quién va dirigida esta campaña?</p>
              {audiences.map((a) => (
                <button key={a.id} onClick={() => setSelectedAudience(a.id)}
                  className={cn("w-full flex items-center gap-3 p-3.5 rounded-xl border text-left transition-all",
                    selectedAudience === a.id ? "border-violet-500/50 bg-violet-600/10" : "glass hover:border-white/20")}>
                  <Users className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  <div className="flex-1">
                    <p className="font-semibold text-white text-sm">{a.label}</p>
                    <p className="text-xs text-muted-foreground">{a.sub}</p>
                  </div>
                  <span className="text-xs font-bold text-white">{a.count}</span>
                  {selectedAudience === a.id && <CheckCircle2 className="w-4 h-4 text-violet-400" />}
                </button>
              ))}
              <button onClick={() => selectedAudience && setStep("content")}
                disabled={!selectedAudience}
                className="w-full py-3 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-40 text-white font-semibold text-sm transition-all">
                Continuar →
              </button>
            </div>
          )}

          {step === "content" && (
            <div className="space-y-4">
              <div>
                <label className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Asunto / título</label>
                <input
                  type="text"
                  placeholder={selectedType === "email" ? "Asunto del email..." : "Título interno de la campaña..."}
                  className="w-full mt-2 px-4 py-3 rounded-xl glass border border-white/10 text-white text-sm placeholder-muted-foreground focus:outline-none focus:border-violet-500/50 bg-transparent"
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Mensaje</label>
                <textarea
                  rows={5}
                  placeholder="Escribe tu mensaje... Usa {nombre} para personalizar."
                  className="w-full mt-2 px-4 py-3 rounded-xl glass border border-white/10 text-white text-sm placeholder-muted-foreground focus:outline-none focus:border-violet-500/50 bg-transparent resize-none"
                />
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground glass rounded-lg p-3">
                <Zap className="w-3.5 h-3.5 text-violet-400" />
                {`{nombre}`}, {`{generacion}`}, {`{coach}`} — variables disponibles para personalizar
              </div>
              <button
                onClick={handleSend}
                disabled={sending}
                className="w-full py-3 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-60 text-white font-semibold text-sm transition-all flex items-center justify-center gap-2"
              >
                {sending ? <><RefreshCcw className="w-4 h-4 animate-spin" /> Enviando...</> : <><Send className="w-4 h-4" /> Enviar campaña</>}
              </button>
            </div>
          )}

          {step === "success" && (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 rounded-full bg-green-500/15 border border-green-500/30 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8 text-green-400" />
              </div>
              <div>
                <p className="font-bold text-white text-xl">Campaña enviada ✓</p>
                <p className="text-muted-foreground text-sm mt-1">Los mensajes están en camino a tu audiencia.</p>
              </div>
              <div className="glass rounded-xl p-4 text-left space-y-2">
                <p className="text-xs text-muted-foreground">Resultados aparecerán aquí en los próximos minutos</p>
                <div className="flex gap-4">
                  <div><p className="text-lg font-black text-white">{audiences.find(a => a.id === selectedAudience)?.count ?? "—"}</p><p className="text-[10px] text-muted-foreground">Enviadas</p></div>
                  <div><p className="text-lg font-black text-violet-400">—</p><p className="text-[10px] text-muted-foreground">Abiertas</p></div>
                  <div><p className="text-lg font-black text-cyan-400">—</p><p className="text-[10px] text-muted-foreground">Clicks</p></div>
                </div>
              </div>
              <button onClick={onClose} className="w-full py-3 rounded-xl glass border border-white/10 text-white font-semibold text-sm hover:bg-white/5 transition-all">
                Cerrar
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function CampanasPage() {
  const { toast, show, hide } = useActionToast()
  const [filter, setFilter] = useState<"todas" | CampaignType>("todas")
  const [showNew, setShowNew] = useState(false)
  const [automations, setAutomations] = useState(AUTOMATIONS)

  const filtered = CAMPAIGNS.filter(c => filter === "todas" || c.type === filter)
  const totalEnviadas = CAMPAIGNS.reduce((a, c) => a + (c.stats?.enviadas ?? 0), 0)
  const totalAbiertas = CAMPAIGNS.reduce((a, c) => a + (c.stats?.abiertas ?? 0), 0)
  const avgOpen = totalEnviadas > 0 ? Math.round((totalAbiertas / totalEnviadas) * 100) : 0

  function toggleAutomation(id: string) {
    setAutomations(prev => prev.map(a => a.id === id ? { ...a, active: !a.active } : a))
    const auto = automations.find(a => a.id === id)
    if (auto) show(auto.active ? `Automatización pausada` : `Automatización activada ✓`)
  }

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto space-y-6">
      <OnboardingModal config={ONBOARDING} />
      {showNew && <NewCampaignDrawer onClose={() => setShowNew(false)} />}

      {/* Header */}
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white">Campañas</h1>
          <p className="text-muted-foreground text-sm mt-0.5">Email y WhatsApp · {CAMPAIGNS.length} campañas</p>
        </div>
        <button
          onClick={() => setShowNew(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold transition-all"
        >
          <Plus className="w-4 h-4" /> Nueva campaña
        </button>
      </div>

      {/* Stats overview */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Mensajes enviados", value: totalEnviadas.toLocaleString(), icon: Send, color: "text-violet-400" },
          { label: "Tasa de apertura", value: `${avgOpen}%`, icon: BarChart3, color: "text-cyan-400" },
          { label: "Automatizaciones activas", value: String(automations.filter(a => a.active).length), icon: Zap, color: "text-amber-400" },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="glass rounded-xl p-4 space-y-1 text-center">
            <Icon className={cn("w-4 h-4 mx-auto", color)} />
            <p className={cn("text-xl font-black", color)}>{value}</p>
            <p className="text-[10px] text-muted-foreground leading-snug">{label}</p>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div className="flex gap-2">
        {(["todas", "email", "whatsapp"] as const).map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            className={cn("px-3 py-1.5 rounded-lg text-xs font-semibold transition-all capitalize",
              filter === f ? "bg-violet-600 text-white" : "glass text-muted-foreground hover:text-white")}>
            {f === "todas" ? "Todas" : f === "email" ? "Email" : "WhatsApp"}
          </button>
        ))}
      </div>

      {/* Campaign list */}
      <div className="space-y-3">
        {filtered.map((c) => {
          const sm = STATUS_META[c.status]
          const Icon = sm.icon
          return (
            <div key={c.id} className="glass rounded-xl p-4 space-y-3">
              <div className="flex items-start gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <TypeBadge type={c.type} />
                    <span className={cn("flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border", sm.color)}>
                      <Icon className="w-2.5 h-2.5" />
                      {sm.label}
                    </span>
                  </div>
                  <p className="font-semibold text-white text-sm leading-snug">{c.name}</p>
                  <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Users className="w-3 h-3" />{c.audience} · {c.audienceCount}</span>
                    {c.sentAt && <span>{c.sentAt}</span>}
                    {c.scheduledFor && <span className="text-amber-400">{c.scheduledFor}</span>}
                  </div>
                </div>
              </div>

              {c.stats && (
                <div className="flex gap-4 pt-2 border-t border-white/5">
                  <div><p className="text-sm font-bold text-white">{c.stats.enviadas}</p><p className="text-[10px] text-muted-foreground">Enviadas</p></div>
                  <div><p className="text-sm font-bold text-violet-400">{Math.round((c.stats.abiertas / c.stats.enviadas) * 100)}%</p><p className="text-[10px] text-muted-foreground">Apertura</p></div>
                  <div><p className="text-sm font-bold text-cyan-400">{Math.round((c.stats.clicks / c.stats.enviadas) * 100)}%</p><p className="text-[10px] text-muted-foreground">Clicks</p></div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Automations */}
      <div className="glass rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-white/6 flex items-center gap-2">
          <Zap className="w-4 h-4 text-amber-400" />
          <p className="font-semibold text-white text-sm">Automatizaciones</p>
        </div>
        <div className="divide-y divide-white/4">
          {automations.map((a) => (
            <div key={a.id} className="flex items-center gap-4 px-5 py-3.5">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <TypeBadge type={a.type} />
                </div>
                <p className="font-semibold text-white text-sm">{a.name}</p>
                <p className="text-xs text-muted-foreground">{a.trigger} · {a.sent} enviados</p>
              </div>
              <button
                onClick={() => toggleAutomation(a.id)}
                className={cn(
                  "w-10 h-6 rounded-full transition-all relative flex-shrink-0",
                  a.active ? "bg-violet-600" : "bg-white/10"
                )}
              >
                <div className={cn(
                  "w-4 h-4 rounded-full bg-white absolute top-1 transition-all",
                  a.active ? "left-5" : "left-1"
                )} />
              </button>
            </div>
          ))}
        </div>
      </div>

      <ActionToast message={toast.message} visible={toast.visible} onHide={hide} />
    </div>
  )
}
