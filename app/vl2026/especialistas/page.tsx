"use client"

import { useState } from "react"
import {
  Star, Filter, Search, DollarSign, Calendar, CheckCircle,
  Clock, Users, Sparkles, ChevronRight, X, Lock, MessageCircle,
} from "lucide-react"
import { AvatarBadge } from "@/components/demo/AvatarBadge"
import { ActionToast, useActionToast } from "@/components/demo/ActionToast"
import { OnboardingModal } from "@/components/demo/OnboardingModal"
import { cn } from "@/lib/utils"

const ONBOARDING = {
  screenId: "especialistas",
  badge: "Vista del participante · Expertos",
  badgeColor: "cyan" as const,
  title: "Tu red de expertos",
  description: "Tu coach conoce tu objetivo. Estos especialistas están aquí para ayudarte a hacerlo realidad, más allá de las sesiones grupales.",
  tips: [
    { emoji: "🎯", text: "Los especialistas 'Recomendados' los eligió tu coach según tu objetivo declarado." },
    { emoji: "📅", text: "Reservar una sesión es gratis, pagas solo si confirmas la cita." },
    { emoji: "💬", text: "Puedes ver el historial de tus sesiones anteriores en tu expediente." },
  ],
  cta: "Ver especialistas →",
}

type Category = "todos" | "finanzas" | "salud" | "carrera" | "bienestar" | "pareja"

const CATEGORIES: { id: Category; label: string; emoji: string }[] = [
  { id: "todos",    label: "Todos",    emoji: "✨" },
  { id: "finanzas", label: "Finanzas", emoji: "💰" },
  { id: "salud",    label: "Salud",    emoji: "🌱" },
  { id: "carrera",  label: "Carrera",  emoji: "🚀" },
  { id: "bienestar",label: "Bienestar",emoji: "🧠" },
  { id: "pareja",   label: "Pareja",   emoji: "❤️" },
]

const SPECIALISTS = [
  {
    id: "s1",
    name: "Laura Medina",
    avatar: "LM",
    specialty: "Coach Financiero",
    category: "finanzas" as Category,
    rating: 4.9,
    sessions: 342,
    pricePerSession: 950,
    duration: 60,
    tags: ["Finanzas personales", "Emprendimiento", "Inversión"],
    bio: "Especialista en libertad financiera para personas en proceso de transformación. Ha acompañado a más de 300 participantes del programa a ordenar sus finanzas y generar ingresos adicionales.",
    available: true,
    nextSlot: "Hoy · 5:00 pm",
    recomendado: true,
    coachNote: "Ana Reyes recomienda: ideal para tu objetivo de independencia financiera.",
  },
  {
    id: "s2",
    name: "Dr. Arturo Vega",
    avatar: "AV",
    specialty: "Psicólogo",
    category: "bienestar" as Category,
    rating: 4.8,
    sessions: 218,
    pricePerSession: 1100,
    duration: 60,
    tags: ["Ansiedad", "Autoestima", "Bloqueos emocionales"],
    bio: "Psicólogo clínico con enfoque en desarrollo personal. Trabaja específicamente con participantes de programas de transformación que quieren ir más profundo.",
    available: true,
    nextSlot: "Mañana · 10:00 am",
    recomendado: true,
    coachNote: "Ana Reyes recomienda: complementa muy bien el trabajo de PL.",
  },
  {
    id: "s3",
    name: "Lic. Carla Soto",
    avatar: "CS",
    specialty: "Nutrióloga",
    category: "salud" as Category,
    rating: 4.7,
    sessions: 189,
    pricePerSession: 750,
    duration: 45,
    tags: ["Hábitos alimenticios", "Energía", "Rendimiento"],
    bio: "Nutrióloga integrativa. Se enfoca en cómo la alimentación afecta la energía, el foco y la capacidad de cumplir compromisos en programas de alto desempeño.",
    available: false,
    nextSlot: "Lunes · 11:00 am",
    recomendado: false,
    coachNote: null,
  },
  {
    id: "s4",
    name: "Fernanda Ruiz",
    avatar: "FR",
    specialty: "Terapeuta de Pareja",
    category: "pareja" as Category,
    rating: 4.9,
    sessions: 401,
    pricePerSession: 1300,
    duration: 75,
    tags: ["Comunicación", "Conflicto", "Vida en pareja"],
    bio: "Terapeuta sistémica de pareja. Muchos participantes descubren en Vía que sus objetivos de vida involucran directamente su relación. Fernanda los acompaña en esa conversación.",
    available: true,
    nextSlot: "Jueves · 7:00 pm",
    recomendado: false,
    coachNote: null,
  },
  {
    id: "s5",
    name: "Ing. Samuel Torres",
    avatar: "ST",
    specialty: "Coach de Negocios",
    category: "carrera" as Category,
    rating: 4.6,
    sessions: 156,
    pricePerSession: 1200,
    duration: 60,
    tags: ["Emprendimiento", "Estrategia", "Crecimiento"],
    bio: "Mentor de emprendedores con 15 años de experiencia. Trabaja con participantes que quieren lanzar o escalar un negocio mientras están en su proceso de transformación.",
    available: true,
    nextSlot: "Viernes · 4:00 pm",
    recomendado: false,
    coachNote: null,
  },
  {
    id: "s6",
    name: "Dra. Mónica Lima",
    avatar: "ML",
    specialty: "Coach de Carrera",
    category: "carrera" as Category,
    rating: 4.5,
    sessions: 127,
    pricePerSession: 900,
    duration: 60,
    tags: ["Liderazgo", "Transición de carrera", "Propósito"],
    bio: "Especialista en liderazgo y propósito profesional. Ayuda a personas en transición a encontrar una carrera alineada con sus valores recién descubiertos.",
    available: true,
    nextSlot: "Martes · 3:00 pm",
    recomendado: false,
    coachNote: null,
  },
]

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={cn("w-3 h-3", i < Math.floor(rating) ? "text-yellow-400 fill-yellow-400" : "text-white/20")}
        />
      ))}
      <span className="text-xs text-white font-semibold ml-1">{rating}</span>
    </div>
  )
}

function BookingModal({
  specialist,
  onClose,
  onConfirm,
}: {
  specialist: typeof SPECIALISTS[0]
  onClose: () => void
  onConfirm: () => void
}) {
  const [step, setStep] = useState<"slot" | "confirm" | "done">("slot")
  const SLOTS = ["Hoy · 5:00 pm", "Mañana · 10:00 am", "Mañana · 4:00 pm", "Jueves · 9:00 am", "Jueves · 7:00 pm", "Viernes · 11:00 am"]

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-sm glass rounded-2xl p-5 space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs text-muted-foreground">{step === "done" ? "¡Listo!" : "Reservar sesión"}</p>
            <h3 className="font-bold text-white text-base mt-0.5">{specialist.name}</h3>
            <p className="text-xs text-cyan-400">{specialist.specialty}</p>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground p-1">
            <X className="w-4 h-4" />
          </button>
        </div>

        {step === "slot" && (
          <>
            <div className="space-y-1.5">
              <p className="text-xs text-muted-foreground font-medium">Elige un horario</p>
              <div className="grid grid-cols-2 gap-2">
                {SLOTS.map((slot) => (
                  <button
                    key={slot}
                    onClick={() => setStep("confirm")}
                    className="px-3 py-2 rounded-xl border border-white/10 hover:border-cyan-500/40 hover:bg-cyan-500/5 text-xs text-foreground transition-colors text-left"
                  >
                    <Clock className="w-3 h-3 text-cyan-400 mb-1" />
                    {slot}
                  </button>
                ))}
              </div>
            </div>
            <p className="text-[10px] text-muted-foreground text-center">
              ${specialist.pricePerSession.toLocaleString()} MXN · {specialist.duration} min · Sin cargo hasta confirmar
            </p>
          </>
        )}

        {step === "confirm" && (
          <>
            <div className="glass rounded-xl p-3 space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Especialista</span>
                <span className="text-white font-medium">{specialist.name}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Horario</span>
                <span className="text-white font-medium">Hoy · 5:00 pm</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Duración</span>
                <span className="text-white font-medium">{specialist.duration} minutos</span>
              </div>
              <div className="flex justify-between text-xs border-t border-white/8 pt-1.5 mt-1.5">
                <span className="text-muted-foreground">Costo</span>
                <span className="text-white font-bold">${specialist.pricePerSession.toLocaleString()} MXN</span>
              </div>
            </div>
            <button
              onClick={() => { setStep("done"); onConfirm() }}
              className="w-full py-3 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-sm transition-colors flex items-center justify-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              Confirmar sesión
            </button>
          </>
        )}

        {step === "done" && (
          <div className="text-center space-y-3 py-4">
            <div className="w-14 h-14 rounded-full bg-green-500/15 border border-green-500/30 flex items-center justify-center mx-auto">
              <CheckCircle className="w-7 h-7 text-green-400" />
            </div>
            <div>
              <p className="font-bold text-white">¡Sesión agendada!</p>
              <p className="text-xs text-muted-foreground mt-1">
                Recibirás un recordatorio 1 hora antes. El link de sesión llegará a tu email.
              </p>
            </div>
            <button onClick={onClose} className="text-sm text-violet-400 hover:text-violet-300 font-medium">
              Ver mi agenda
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default function EspecialistasPage() {
  const [category, setCategory] = useState<Category>("todos")
  const [booked, setBooked] = useState<Set<string>>(new Set())
  const [booking, setBooking] = useState<typeof SPECIALISTS[0] | null>(null)
  const { toast, show, hide } = useActionToast()

  const filtered = category === "todos"
    ? SPECIALISTS
    : SPECIALISTS.filter((s) => s.category === category)

  const recommended = filtered.filter((s) => s.recomendado)
  const others = filtered.filter((s) => !s.recomendado)

  function handleBooked(id: string) {
    setBooked((prev) => new Set([...prev, id]))
    show(`Sesión agendada con ${booking?.name} ✓`)
  }

  function handleRequestReferral(name: string) {
    show(`Solicitud enviada a Ana Reyes · ${name} ✓`)
  }

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <OnboardingModal config={ONBOARDING} />

      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-white">Red de Expertos</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Especialistas seleccionados para acompañarte en tus objetivos de PL.
        </p>
      </div>

      {/* Coach recommendation banner */}
      <div className="flex items-start gap-3 px-4 py-3 rounded-xl bg-violet-500/8 border border-violet-500/20">
        <Sparkles className="w-4 h-4 text-violet-400 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-xs font-bold text-violet-300">Tu coach recomienda</p>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            Ana Reyes eligió 2 especialistas para tu objetivo de independencia financiera. Están marcados como recomendados.
          </p>
        </div>
      </div>

      {/* Category filter */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setCategory(cat.id)}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors flex-shrink-0",
              category === cat.id
                ? "bg-violet-600 text-white"
                : "glass border border-white/10 text-muted-foreground hover:text-foreground"
            )}
          >
            <span>{cat.emoji}</span>
            {cat.label}
          </button>
        ))}
      </div>

      {/* Recommended */}
      {recommended.length > 0 && (
        <div className="space-y-3">
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">Recomendados para ti</p>
          {recommended.map((s) => (
            <SpecialistCard
              key={s.id}
              specialist={s}
              isBooked={booked.has(s.id)}
              highlight
              onBook={() => setBooking(s)}
              onRequestReferral={() => handleRequestReferral(s.name)}
            />
          ))}
        </div>
      )}

      {/* Others */}
      {others.length > 0 && (
        <div className="space-y-3">
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">
            {recommended.length > 0 ? "Más especialistas" : "Especialistas"}
          </p>
          {others.map((s) => (
            <SpecialistCard
              key={s.id}
              specialist={s}
              isBooked={booked.has(s.id)}
              highlight={false}
              onBook={() => setBooking(s)}
              onRequestReferral={() => handleRequestReferral(s.name)}
            />
          ))}
        </div>
      )}

      {booking && (
        <BookingModal
          specialist={booking}
          onClose={() => setBooking(null)}
          onConfirm={() => handleBooked(booking.id)}
        />
      )}

      <ActionToast message={toast.message} visible={toast.visible} onHide={hide} />
    </div>
  )
}

function SpecialistCard({
  specialist: s,
  isBooked,
  highlight,
  onBook,
  onRequestReferral,
}: {
  specialist: typeof SPECIALISTS[0]
  isBooked: boolean
  highlight: boolean
  onBook: () => void
  onRequestReferral: () => void
}) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className={cn(
      "glass rounded-2xl p-4 space-y-3 border transition-colors",
      highlight ? "border-cyan-500/25 bg-cyan-500/3" : "border-white/8"
    )}>
      {/* Top row */}
      <div className="flex items-start gap-3">
        <div className="relative flex-shrink-0">
          <AvatarBadge initials={s.avatar} size="md" color={highlight ? "cyan" : "violet"} />
          {s.recomendado && (
            <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-cyan-500 flex items-center justify-center">
              <Sparkles className="w-2.5 h-2.5 text-white" />
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="font-bold text-white text-sm leading-tight">{s.name}</p>
              <p className="text-xs text-cyan-400 mt-0.5">{s.specialty}</p>
            </div>
            <div className={cn(
              "text-[10px] font-bold px-2 py-0.5 rounded-full border flex-shrink-0",
              s.available
                ? "bg-green-500/10 text-green-400 border-green-500/20"
                : "bg-white/5 text-muted-foreground border-white/10"
            )}>
              {s.available ? "Disponible" : "Agenda llena"}
            </div>
          </div>
          <StarRating rating={s.rating} />
        </div>
      </div>

      {/* Coach note */}
      {s.coachNote && (
        <div className="flex items-start gap-2 px-3 py-2 rounded-lg bg-violet-500/8 border border-violet-500/15">
          <Sparkles className="w-3 h-3 text-violet-400 flex-shrink-0 mt-0.5" />
          <p className="text-[11px] text-violet-300 leading-snug">{s.coachNote}</p>
        </div>
      )}

      {/* Stats */}
      <div className="flex gap-4 text-xs">
        <div className="flex items-center gap-1 text-muted-foreground">
          <Users className="w-3 h-3" />
          <span>{s.sessions} sesiones</span>
        </div>
        <div className="flex items-center gap-1 text-muted-foreground">
          <Clock className="w-3 h-3" />
          <span>{s.duration} min</span>
        </div>
        <div className="flex items-center gap-1 text-muted-foreground">
          <DollarSign className="w-3 h-3" />
          <span>${s.pricePerSession.toLocaleString()} MXN</span>
        </div>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5">
        {s.tags.map((tag) => (
          <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 border border-white/8 text-muted-foreground">
            {tag}
          </span>
        ))}
      </div>

      {/* Expandable bio */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground transition-colors"
      >
        <ChevronRight className={cn("w-3.5 h-3.5 transition-transform", expanded && "rotate-90")} />
        {expanded ? "Ocultar perfil" : "Ver perfil completo"}
      </button>
      {expanded && (
        <p className="text-[11px] text-muted-foreground leading-relaxed border-t border-white/8 pt-3">{s.bio}</p>
      )}

      {/* CTA */}
      {s.recomendado ? (
        !isBooked ? (
          <button
            onClick={onBook}
            disabled={!s.available}
            className={cn(
              "w-full py-2.5 rounded-xl font-semibold text-sm transition-colors flex items-center justify-center gap-2",
              s.available
                ? highlight
                  ? "bg-cyan-600 hover:bg-cyan-700 text-white"
                  : "glass border border-white/15 hover:border-white/25 text-white"
                : "bg-white/5 text-muted-foreground cursor-not-allowed"
            )}
          >
            <Calendar className="w-4 h-4" />
            {s.available ? `Reservar sesión · ${s.nextSlot}` : `Próximo espacio: ${s.nextSlot}`}
          </button>
        ) : (
          <div className="w-full py-2.5 rounded-xl border border-green-500/30 text-green-400 text-sm font-semibold flex items-center justify-center gap-2">
            <CheckCircle className="w-4 h-4" />
            Sesión agendada, te llegará confirmación
          </div>
        )
      ) : (
        <div className="space-y-2">
          <div className="flex items-start gap-2 px-3 py-2 rounded-lg bg-white/3 border border-white/8">
            <Lock className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0 mt-0.5" />
            <p className="text-[11px] text-muted-foreground leading-snug">
              Tu coach puede derivarte a este especialista cuando lo considere apropiado para tu objetivo.
            </p>
          </div>
          <button
            onClick={onRequestReferral}
            className="w-full py-2.5 rounded-xl glass border border-white/12 hover:border-violet-500/30 text-muted-foreground hover:text-violet-300 text-sm font-semibold transition-colors flex items-center justify-center gap-2"
          >
            <MessageCircle className="w-4 h-4" />
            Solicitar derivación al coach
          </button>
        </div>
      )}
    </div>
  )
}
