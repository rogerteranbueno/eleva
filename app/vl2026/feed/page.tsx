"use client"

import { useState } from "react"
import { Heart, MessageCircle, Calendar, Star, CheckCircle, ChevronRight, Share2, UserPlus } from "lucide-react"
import { ShareEventModal } from "@/components/demo/ShareEventModal"
import { InvitarDrawer } from "@/components/demo/InvitarDrawer"
import { AnimatePresence } from "framer-motion"
import Link from "next/link"
import { AvatarBadge } from "@/components/demo/AvatarBadge"
import { MomentumGauge } from "@/components/demo/MomentumGauge"
import { ActionToast, useActionToast } from "@/components/demo/ActionToast"
import { OnboardingModal } from "@/components/demo/OnboardingModal"
import { useDemoStore } from "@/lib/demo-store"
import { FEED_POSTS, SPECIALISTS, COACHES } from "@/data/level"
import { cn } from "@/lib/utils"

const ONBOARDING = {
  screenId: "feed",
  badge: "Vista del participante · Pantalla 1 de 4",
  badgeColor: "cyan" as const,
  title: "Mi Feed — como Valeria",
  description: "Cambiaste al lado del participante. Esto es lo que Valeria ve cada mañana cuando abre ELEVA — todo lo que necesita en un solo lugar.",
  tips: [
    { emoji: "💜", text: "Ana Reyes (su coach) ya le dejó un mensaje de apoyo personalizado." },
    { emoji: "✅", text: "Su misión de la semana vence en 2 días — puede completarla desde aquí." },
    { emoji: "📅", text: "La sesión en vivo del jueves aparece con un botón de confirmación directo." },
  ],
  cta: "Ver el feed de Valeria →",
}

export default function FeedPage() {
  const { state, dispatch } = useDemoStore()
  const { toast, show, hide } = useActionToast()
  const [liked, setLiked] = useState<Set<string>>(new Set())
  const [eventConfirmed, setEventConfirmed] = useState(false)
  const [shareEventOpen, setShareEventOpen] = useState(false)
  const [invitarOpen, setInvitarOpen] = useState(false)
  const [enrolledCount, setEnrolledCount] = useState(0)

  const coach = COACHES[0]
  const specialist = SPECIALISTS[0]

  function toggleLike(id: string) {
    setLiked((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function handleBookSession() {
    dispatch({ type: "BOOK_SESSION" })
    show(`Sesión agendada con ${specialist.name} ✓`)
  }

  function handleConfirmEvent() {
    setEventConfirmed(true)
    show("Asistencia confirmada al evento ✓")
  }

  function handleInviteSuccess(name: string) {
    setEnrolledCount((n) => n + 1)
    dispatch({ type: "ASSIGN_MISSION" }) // momentum boost
    show(`Mensaje de bienvenida enviado a ${name} ✓`)
  }

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-5">
      <OnboardingModal config={ONBOARDING} />
      {/* Greeting */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Buenos días, Valeria</h1>
          <p className="text-muted-foreground text-sm mt-0.5">Lunes, 2 de junio · Semana 12</p>
        </div>
        <MomentumGauge score={state.valeriaMomentum} size="sm" showLabel={false} />
      </div>

      {/* Coach message */}
      <div className="glass-violet rounded-xl p-4">
        <div className="flex items-start gap-3">
          <AvatarBadge initials={coach.avatar} size="sm" color="violet" />
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold text-white">{coach.name}</p>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-violet-600/30 text-violet-300 font-medium">Tu coach</span>
            </div>
            <p className="text-sm text-foreground mt-1 leading-relaxed">
              Valeria, sé que las últimas semanas han sido intensas. Estoy aquí cuando estés lista.
              Tu compromiso de finanzas sigue en pie — y tú también. 💜
            </p>
            <p className="text-xs text-muted-foreground mt-2">hace 2 horas</p>
          </div>
        </div>
      </div>

      {/* Mission card */}
      <Link href="/vl2026/mision">
        <div className="glass rounded-xl p-4 cursor-pointer hover:border-violet-500/30 transition-colors group">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
            <p className="text-xs font-semibold text-yellow-400 uppercase tracking-wider">Misión pendiente</p>
          </div>
          <p className="font-semibold text-white text-sm leading-relaxed">
            Semana 12: 15 min de reflexión + una acción hacia tu objetivo de finanzas
          </p>
          <div className="flex items-center justify-between mt-3">
            <span className="text-xs text-muted-foreground">Vence en 2 días</span>
            <div className="flex items-center gap-1 text-violet-400 text-xs font-medium group-hover:gap-2 transition-all">
              Completar <ChevronRight className="w-3 h-3" />
            </div>
          </div>
        </div>
      </Link>

      {/* Event card */}
      <div className="glass rounded-xl p-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center flex-shrink-0">
            <Calendar className="w-5 h-5 text-cyan-400" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-white text-sm">Sesión en vivo con Ana Reyes</p>
            <p className="text-xs text-muted-foreground mt-0.5">Jueves 5 de junio · <span className="whitespace-nowrap">7:00 pm</span> · Generación Omega</p>
          </div>
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <button
              onClick={() => setShareEventOpen(true)}
              className="p-1.5 rounded-lg text-muted-foreground hover:text-cyan-400 hover:bg-cyan-500/10 transition-colors"
              title="Compartir evento"
            >
              <Share2 className="w-3.5 h-3.5" />
            </button>
            {!eventConfirmed ? (
              <button
                onClick={handleConfirmEvent}
                className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-semibold transition-colors"
              >
                Confirmar
              </button>
            ) : (
              <div className="flex items-center gap-1.5 text-green-400 text-xs font-semibold">
                <CheckCircle className="w-3.5 h-3.5" />
                Confirmado
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Enrollment card */}
      <div className="rounded-xl border border-violet-500/25 bg-violet-500/8 p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-violet-500/20 flex items-center justify-center">
              <UserPlus className="w-3.5 h-3.5 text-violet-400" />
            </div>
            <div>
              <p className="text-xs font-bold text-violet-300">Tu compromiso de impacto</p>
              <p className="text-[10px] text-muted-foreground">PL · Fin de semana 2 de 3</p>
            </div>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-violet-500/20 border border-violet-500/30 text-violet-300 font-semibold">
            {enrolledCount}/2 enrolados
          </span>
        </div>

        {/* Progress */}
        <div className="flex gap-2">
          {[0, 1].map((i) => (
            <div
              key={i}
              className={`flex-1 h-2 rounded-full transition-all duration-500 ${
                i < enrolledCount ? "bg-violet-500" : "bg-white/8"
              }`}
            />
          ))}
        </div>

        <p className="text-xs text-muted-foreground leading-relaxed">
          {enrolledCount === 0
            ? "Este fin de semana es tu oportunidad de crear impacto. Enrola a dos personas que quieran transformar su vida — comienzan en el próximo Entrenamiento 1."
            : enrolledCount === 1
            ? "¡Ya enrolaste a una persona! Un enrolado más y cumples tu compromiso de este fin de semana."
            : "🎉 ¡Completaste tu compromiso de enrolamiento! Tu generación sigue creciendo."}
        </p>

        <button
          onClick={() => setInvitarOpen(true)}
          disabled={enrolledCount >= 2}
          className="w-full py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold text-sm transition-colors flex items-center justify-center gap-2"
        >
          <UserPlus className="w-4 h-4" />
          {enrolledCount >= 2 ? "Compromiso cumplido ✓" : "Invitar a alguien"}
        </button>
      </div>

      {/* Feed posts */}
      <div>
        <p className="text-xs text-muted-foreground uppercase tracking-widest font-medium mb-3">Generación Omega</p>
        <div className="space-y-3">
          {FEED_POSTS.map((post) => (
            <FeedCard
              key={post.id}
              post={post}
              liked={liked.has(post.id)}
              onLike={() => toggleLike(post.id)}
            />
          ))}
        </div>
      </div>

      {/* Specialist card */}
      <div className="glass-cyan rounded-xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <Star className="w-4 h-4 text-cyan-400" />
          <p className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">Para tu objetivo</p>
        </div>
        <div className="flex items-center gap-3">
          <AvatarBadge initials={specialist.avatar} size="md" color="cyan" />
          <div className="flex-1">
            <p className="font-semibold text-white text-sm">{specialist.name}</p>
            <p className="text-xs text-cyan-400">{specialist.specialty}</p>
            <p className="text-xs text-muted-foreground mt-0.5">Sesión disponible esta semana</p>
          </div>
          {!state.sessionBooked ? (
            <button
              onClick={handleBookSession}
              className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-semibold transition-colors flex-shrink-0"
            >
              Agendar
            </button>
          ) : (
            <div className="flex items-center gap-1.5 text-green-400 text-xs font-semibold flex-shrink-0">
              <CheckCircle className="w-3.5 h-3.5" />
              Agendado
            </div>
          )}
        </div>
      </div>

      {shareEventOpen && (
        <ShareEventModal onClose={() => setShareEventOpen(false)} />
      )}
      <AnimatePresence>
        {invitarOpen && (
          <InvitarDrawer
            onClose={() => setInvitarOpen(false)}
            onSuccess={(name) => { setInvitarOpen(false); handleInviteSuccess(name) }}
          />
        )}
      </AnimatePresence>
      <ActionToast message={toast.message} visible={toast.visible} onHide={hide} />
    </div>
  )
}

function FeedCard({ post, liked, onLike }: {
  post: typeof FEED_POSTS[0]
  liked: boolean
  onLike: () => void
}) {
  const [reactions, setReactions] = useState(post.reactions)

  function handleLike() {
    onLike()
    setReactions((prev) => liked ? prev - 1 : prev + 1)
  }

  return (
    <div className={cn(
      "glass rounded-xl p-4 space-y-3",
      post.isPinned ? "border border-violet-500/30" : ""
    )}>
      {post.isPinned && (
        <div className="flex items-center gap-1.5 text-xs text-violet-400 font-medium">
          <Star className="w-3 h-3" />
          Fijado por el coach
        </div>
      )}
      <div className="flex items-start gap-3">
        <AvatarBadge initials={post.avatar} size="sm" color={post.isCoach ? "violet" : "auto"} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold text-white">{post.author}</p>
            {post.isCoach && (
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-violet-600/30 text-violet-300 font-medium">Coach</span>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            {post.minutesAgo < 60
              ? `hace ${post.minutesAgo} min`
              : `hace ${Math.floor(post.minutesAgo / 60)} hrs`}
          </p>
        </div>
      </div>
      <p className="text-sm text-foreground leading-relaxed">{post.content}</p>
      <div className="flex items-center gap-4 pt-1">
        <button
          onClick={handleLike}
          className={cn(
            "flex items-center gap-1.5 text-xs transition-colors",
            liked ? "text-pink-400" : "text-muted-foreground hover:text-foreground"
          )}
        >
          <Heart className={cn("w-3.5 h-3.5", liked ? "fill-pink-400" : "")} />
          {reactions}
        </button>
        <button className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
          <MessageCircle className="w-3.5 h-3.5" />
          {post.comments}
        </button>
      </div>
    </div>
  )
}
