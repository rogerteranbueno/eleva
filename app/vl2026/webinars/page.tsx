"use client"

import { useState } from "react"
import {
  Video, Calendar, Clock, Users, Star, Play, Plus,
  Globe, Lock, CheckCircle2, ExternalLink, Mic2, X,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { ActionToast, useActionToast } from "@/components/demo/ActionToast"
import { OnboardingModal } from "@/components/demo/OnboardingModal"

const ONBOARDING = {
  screenId: "webinars",
  badge: "Vista del dueño · Webinars",
  badgeColor: "violet" as const,
  title: "Noches de invitados que retienen y atraen",
  description: "Miércoles y jueves de 8 a 9:30pm. Expertos de todo el mundo en temas que impactan la vida de tu comunidad, gratis para atraer leads, exclusivos para retener miembros.",
  tips: [
    { emoji: "🌍", text: "Los webinars públicos son tu mejor herramienta de adquisición sin publicidad pagada." },
    { emoji: "🔒", text: "Los exclusivos para miembros justifican la membresía mensual y crean hábito de asistencia." },
    { emoji: "📼", text: "Todas las sesiones quedan grabadas en la biblioteca de cada participante." },
  ],
  cta: "Ver agenda →",
}

type WebinarType = "publico" | "miembros"
type WebinarStatus = "proximo" | "en-vivo" | "grabado"

type Webinar = {
  id: string
  title: string
  guest: string
  guestRole: string
  guestCountry: string
  date: string
  time: string
  duration: string
  type: WebinarType
  status: WebinarStatus
  rsvp?: number
  attended?: number
  recording?: boolean
  tags: string[]
  description: string
}

const WEBINARS: Webinar[] = [
  {
    id: "w1",
    title: "Cómo romper el ciclo de la deuda sin sacrificar tu calidad de vida",
    guest: "Dr. Alejandro Ferrara",
    guestRole: "Coach financiero certificado",
    guestCountry: "🇦🇷 Argentina",
    date: "Jue 12 jun",
    time: "8:00 PM",
    duration: "90 min",
    type: "publico",
    status: "proximo",
    rsvp: 127,
    tags: ["Finanzas", "Deuda", "Libertad"],
    description: "El Dr. Ferrara ha ayudado a más de 3,000 familias latinoamericanas a salir de deudas en menos de 18 meses sin cambiar radicalmente su estilo de vida.",
  },
  {
    id: "w2",
    title: "Nutrición para alto rendimiento: come para rendir, no para castigarte",
    guest: "Dra. Carmen López",
    guestRole: "Nutrióloga deportiva",
    guestCountry: "🇲🇽 México",
    date: "Mié 18 jun",
    time: "8:00 PM",
    duration: "90 min",
    type: "publico",
    status: "proximo",
    rsvp: 94,
    tags: ["Nutrición", "Rendimiento", "Hábitos"],
    description: "Experta en nutrición funcional y rendimiento. Colaboradora de equipos olímpicos mexicanos.",
  },
  {
    id: "w3",
    title: "Mentoría grupal, Cierra tus compromisos del mes",
    guest: "Ana Reyes",
    guestRole: "Coach Gen. Omega · LEVEL",
    guestCountry: "🇲🇽 México",
    date: "Jue 19 jun",
    time: "8:00 PM",
    duration: "90 min",
    type: "miembros",
    status: "proximo",
    rsvp: 34,
    tags: ["Mentoría", "Compromisos", "Revisión"],
    description: "Sesión exclusiva de revisión de compromisos con coaching grupal en vivo. Solo para miembros activos.",
  },
  {
    id: "w4",
    title: "Relaciones auténticas: el arte de pedir sin miedo",
    guest: "Dra. Sofía Delgado",
    guestRole: "Psicóloga clínica",
    guestCountry: "🇨🇴 Colombia",
    date: "Mié 25 jun",
    time: "8:00 PM",
    duration: "90 min",
    type: "miembros",
    status: "proximo",
    rsvp: 41,
    tags: ["Relaciones", "Comunicación", "Psicología"],
    description: "Especialista en vínculos afectivos y comunicación no violenta. Fundadora del Instituto de Relacionamiento Consciente.",
  },
  {
    id: "w5",
    title: "De empleado a emprendedor: cómo dar el salto sin morir en el intento",
    guest: "Miguel Torres",
    guestRole: "Emprendedor serial",
    guestCountry: "🇪🇸 España",
    date: "Jue 5 jun",
    time: "8:00 PM",
    duration: "90 min",
    type: "publico",
    status: "grabado",
    attended: 203,
    recording: true,
    tags: ["Emprendimiento", "Negocios", "Transición"],
    description: "Ha fundado 5 empresas, 3 de ellas exitosas. Comparte el método que usó para dejar su trabajo corporativo a los 32 años.",
  },
  {
    id: "w6",
    title: "Mindfulness para personas que odian meditar",
    guest: "Tomás Valverde",
    guestRole: "Instructor de mindfulness",
    guestCountry: "🇦🇷 Argentina",
    date: "Mié 28 may",
    time: "8:00 PM",
    duration: "90 min",
    type: "publico",
    status: "grabado",
    attended: 178,
    recording: true,
    tags: ["Mindfulness", "Bienestar", "Hábitos"],
    description: "Más de 50,000 personas han tomado sus cursos online. Especialista en hacer el mindfulness accesible y práctico.",
  },
]

function StatusBadge({ status, type }: { status: WebinarStatus; type: WebinarType }) {
  if (status === "en-vivo") return (
    <span className="flex items-center gap-1 text-[10px] font-bold bg-red-500/15 text-red-400 border border-red-500/30 rounded-full px-2 py-0.5 animate-pulse">
      <span className="w-1.5 h-1.5 rounded-full bg-red-400" /> EN VIVO
    </span>
  )
  if (status === "grabado") return (
    <span className="flex items-center gap-1 text-[10px] font-semibold bg-white/5 text-muted-foreground border border-white/10 rounded-full px-2 py-0.5">
      <Play className="w-2.5 h-2.5" /> Grabado
    </span>
  )
  return (
    <span className={cn("flex items-center gap-1 text-[10px] font-semibold rounded-full px-2 py-0.5 border",
      type === "publico"
        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
        : "bg-violet-500/10 text-violet-400 border-violet-500/20"
    )}>
      {type === "publico" ? <Globe className="w-2.5 h-2.5" /> : <Lock className="w-2.5 h-2.5" />}
      {type === "publico" ? "Público" : "Solo miembros"}
    </span>
  )
}

function NewWebinarDrawer({ onClose }: { onClose: () => void }) {
  const [selectedType, setSelectedType] = useState<WebinarType>("publico")
  const [saving, setSaving] = useState(false)
  const [done, setDone] = useState(false)

  function handleSave() {
    setSaving(true)
    setTimeout(() => { setSaving(false); setDone(true) }, 1800)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full sm:max-w-lg bg-[#0f1117] border border-white/10 rounded-t-2xl sm:rounded-2xl overflow-hidden max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/8">
          <p className="font-bold text-white">Nuevo webinar</p>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/8 text-muted-foreground"><X className="w-4 h-4" /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {done ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 rounded-full bg-green-500/15 border border-green-500/30 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8 text-green-400" />
              </div>
              <div>
                <p className="font-bold text-white text-xl">Webinar creado ✓</p>
                <p className="text-muted-foreground text-sm mt-1">Las invitaciones se enviarán 48h antes del evento.</p>
              </div>
              <button onClick={onClose} className="w-full py-3 rounded-xl glass border border-white/10 text-white font-semibold text-sm">Cerrar</button>
            </div>
          ) : (
            <>
              <div>
                <label className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Título del webinar</label>
                <input type="text" placeholder="Ej: Cómo construir hábitos que duran..." className="w-full mt-2 px-4 py-3 rounded-xl glass border border-white/10 text-white text-sm placeholder-muted-foreground focus:outline-none focus:border-violet-500/50 bg-transparent" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Fecha</label>
                  <input type="date" className="w-full mt-2 px-4 py-3 rounded-xl glass border border-white/10 text-white text-sm focus:outline-none focus:border-violet-500/50 bg-transparent" />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Hora</label>
                  <input type="time" defaultValue="20:00" className="w-full mt-2 px-4 py-3 rounded-xl glass border border-white/10 text-white text-sm focus:outline-none focus:border-violet-500/50 bg-transparent" />
                </div>
              </div>
              <div>
                <label className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Invitado / ponente</label>
                <input type="text" placeholder="Nombre del experto..." className="w-full mt-2 px-4 py-3 rounded-xl glass border border-white/10 text-white text-sm placeholder-muted-foreground focus:outline-none focus:border-violet-500/50 bg-transparent" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground uppercase tracking-wider font-medium mb-2 block">Acceso</label>
                <div className="flex gap-2">
                  {(["publico", "miembros"] as WebinarType[]).map((t) => (
                    <button key={t} onClick={() => setSelectedType(t)}
                      className={cn("flex-1 flex items-center gap-2 p-3 rounded-xl border text-sm transition-all",
                        selectedType === t ? "border-violet-500/50 bg-violet-600/10 text-white" : "glass text-muted-foreground")}>
                      {t === "publico" ? <Globe className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                      {t === "publico" ? "Público" : "Solo miembros"}
                    </button>
                  ))}
                </div>
              </div>
              <button onClick={handleSave} disabled={saving}
                className="w-full py-3 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-60 text-white font-semibold text-sm transition-all flex items-center justify-center gap-2">
                {saving ? "Creando evento..." : <><Calendar className="w-4 h-4" /> Crear webinar</>}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default function WebinarsPage() {
  const { toast, show, hide } = useActionToast()
  const [filter, setFilter] = useState<"todos" | WebinarStatus>("todos")
  const [showNew, setShowNew] = useState(false)
  const [rsvped, setRsvped] = useState<Set<string>>(new Set())

  const proximos = WEBINARS.filter(w => w.status === "proximo")
  const grabados = WEBINARS.filter(w => w.status === "grabado")
  const totalAttended = grabados.reduce((a, w) => a + (w.attended ?? 0), 0)

  function handleRSVP(id: string, title: string) {
    setRsvped(prev => new Set([...prev, id]))
    show(`RSVP confirmado · ${title.slice(0, 30)}...`)
  }

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto space-y-6">
      <OnboardingModal config={ONBOARDING} />
      {showNew && <NewWebinarDrawer onClose={() => setShowNew(false)} />}

      {/* Header */}
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white">Noches de invitados</h1>
          <p className="text-muted-foreground text-sm mt-0.5">Mié y Jue · 8:00 – 9:30 PM · Expertos de todo el mundo</p>
        </div>
        <button
          onClick={() => setShowNew(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold transition-all"
        >
          <Plus className="w-4 h-4" /> Nuevo evento
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Próximos este mes", value: String(proximos.length), icon: Calendar, color: "text-violet-400" },
          { label: "Total asistentes (histórico)", value: totalAttended.toLocaleString(), icon: Users, color: "text-cyan-400" },
          { label: "Grabaciones disponibles", value: String(grabados.length), icon: Play, color: "text-emerald-400" },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="glass rounded-xl p-4 text-center space-y-1">
            <Icon className={cn("w-4 h-4 mx-auto", color)} />
            <p className={cn("text-xl font-black", color)}>{value}</p>
            <p className="text-[10px] text-muted-foreground leading-snug">{label}</p>
          </div>
        ))}
      </div>

      {/* Upcoming */}
      <div>
        <p className="text-xs uppercase tracking-widest text-muted-foreground font-medium mb-3">Próximos eventos</p>
        <div className="space-y-3">
          {proximos.map((w) => (
            <div key={w.id} className={cn("glass rounded-2xl p-5 border transition-all",
              w.type === "publico" ? "border-emerald-500/15 hover:border-emerald-500/30" : "border-violet-500/15 hover:border-violet-500/30"
            )}>
              <div className="flex items-start justify-between gap-3 mb-3">
                <StatusBadge status={w.status} type={w.type} />
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground flex-shrink-0">
                  <Calendar className="w-3.5 h-3.5" />
                  {w.date} · {w.time}
                  <Clock className="w-3 h-3 ml-1" />
                  {w.duration}
                </div>
              </div>

              <h3 className="font-bold text-white leading-snug mb-2">{w.title}</h3>

              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-600 to-violet-800 flex items-center justify-center">
                  <Mic2 className="w-3.5 h-3.5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{w.guest}</p>
                  <p className="text-xs text-muted-foreground">{w.guestRole} · {w.guestCountry}</p>
                </div>
              </div>

              <p className="text-xs text-muted-foreground leading-relaxed mb-4">{w.description}</p>

              <div className="flex gap-2 flex-wrap">
                {w.tags.map(t => (
                  <span key={t} className="text-[10px] bg-white/5 text-muted-foreground rounded-full px-2 py-0.5">{t}</span>
                ))}
              </div>

              <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/5">
                <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Users className="w-3.5 h-3.5" />
                  {rsvped.has(w.id) ? (w.rsvp ?? 0) + 1 : w.rsvp} registrados
                </span>
                <button
                  onClick={() => handleRSVP(w.id, w.title)}
                  disabled={rsvped.has(w.id)}
                  className={cn(
                    "flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-lg transition-all",
                    rsvped.has(w.id)
                      ? "bg-green-500/10 text-green-400 border border-green-500/20"
                      : w.type === "publico"
                        ? "bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-600/30"
                        : "bg-violet-600/20 hover:bg-violet-600/30 text-violet-300 border border-violet-600/30"
                  )}
                >
                  {rsvped.has(w.id) ? <><CheckCircle2 className="w-3 h-3" /> Registrado</> : "Registrarme"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recordings */}
      <div>
        <p className="text-xs uppercase tracking-widest text-muted-foreground font-medium mb-3">Grabaciones anteriores</p>
        <div className="space-y-3">
          {grabados.map((w) => (
            <div key={w.id} className="glass rounded-xl p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
                <Play className="w-5 h-5 text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-white text-sm leading-snug truncate">{w.title}</p>
                <p className="text-xs text-muted-foreground">{w.guest} · {w.date} · {w.attended?.toLocaleString()} asistentes</p>
                <div className="flex gap-1.5 mt-1.5">
                  {w.tags.slice(0, 2).map(t => <span key={t} className="text-[10px] bg-white/5 text-muted-foreground rounded-full px-2 py-0.5">{t}</span>)}
                  <StatusBadge status={w.status} type={w.type} />
                </div>
              </div>
              <button
                onClick={() => show("Reproduciendo grabación...")}
                className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg glass border border-white/10 hover:border-white/20 text-muted-foreground hover:text-white transition-all flex-shrink-0"
              >
                <Play className="w-3 h-3" /> Ver
              </button>
            </div>
          ))}
        </div>
      </div>

      <ActionToast message={toast.message} visible={toast.visible} onHide={hide} />
    </div>
  )
}
