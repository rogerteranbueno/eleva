"use client"

import { useState } from "react"
import { Heart, MessageCircle, Trophy, Calendar, Users, Star, CheckCircle, Flame } from "lucide-react"
import { AvatarBadge } from "@/components/demo/AvatarBadge"
import { ActionToast, useActionToast } from "@/components/demo/ActionToast"
import { OnboardingModal } from "@/components/demo/OnboardingModal"
import { useDemoStore } from "@/lib/demo-store"

const ONBOARDING = {
  screenId: "tribu",
  badge: "Vista del participante · Pantalla 4 de 4",
  badgeColor: "cyan" as const,
  title: "Mi Tribu — Generación Omega",
  description: "La comunidad viva donde los participantes se apoyan entre entrenamientos. No es un grupo de WhatsApp — es un espacio diseñado para que la transformación continúe.",
  tips: [
    { emoji: "📌", text: "El post fijado del coach establece el tono de la semana para toda la generación." },
    { emoji: "🏆", text: "El reto de la semana es grupal — toca 'Unirme al reto' y ve cómo sube el contador." },
    { emoji: "🔥", text: "El leaderboard de racha muestra quién tiene más días activos consecutivos — Valeria está al final." },
  ],
  cta: "Explorar la Tribu →",
}
import { FEED_POSTS, LEADERBOARD, COHORTES } from "@/data/creania"
import { cn } from "@/lib/utils"

export default function TribuPage() {
  const { state, dispatch } = useDemoStore()
  const { toast, show, hide } = useActionToast()
  const [liked, setLiked] = useState<Set<string>>(new Set())

  const cohorte = COHORTES[0]
  const challengeCompleted = state.challengeJoined ? 53 : 52

  function toggleLike(id: string) {
    setLiked((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function handleJoinChallenge() {
    dispatch({ type: "JOIN_CHALLENGE" })
    show("¡Te uniste al reto de la semana! +3 momentum ✓")
  }

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      <OnboardingModal config={ONBOARDING} />
      {/* Header */}
      <div className="glass rounded-xl p-4 sm:p-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-violet-600/20 flex items-center justify-center flex-shrink-0">
            <Users className="w-5 h-5 sm:w-6 sm:h-6 text-violet-400" />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-base sm:text-xl font-bold text-white leading-tight truncate">{cohorte.name}</h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 truncate">
              {cohorte.participants} miembros · {cohorte.phase} · {cohorte.phaseDetail}
            </p>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="text-xl sm:text-2xl font-black text-violet-400">{cohorte.momentum}%</p>
            <p className="text-xs text-muted-foreground">momentum</p>
          </div>
        </div>
      </div>

      {/* Pinned coach post */}
      <div className="glass-violet rounded-xl p-4 space-y-3">
        <div className="flex items-center gap-1.5 text-xs text-violet-400 font-medium">
          <Star className="w-3 h-3" />
          Fijado por el coach
        </div>
        <div className="flex items-start gap-3">
          <AvatarBadge initials="AR" size="sm" color="violet" />
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold text-white">Ana Reyes</p>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-violet-600/30 text-violet-300 font-medium">Coach</span>
            </div>
            <p className="text-sm text-foreground mt-2 leading-relaxed">
              {FEED_POSTS[0].content}
            </p>
          </div>
        </div>
      </div>

      {/* Weekly challenge */}
      <div className="glass rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-yellow-400" />
            <h3 className="font-semibold text-white text-sm">Reto de la semana</h3>
          </div>
          <span className="text-xs text-muted-foreground">Vence el domingo</span>
        </div>
        <p className="text-sm text-foreground">
          Comparte en el feed una acción que tomaste hacia tu objetivo esta semana.
          Sin filtros, sin perfección — solo lo real.
        </p>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">{challengeCompleted} / {cohorte.participants} completado</span>
            <span className="font-bold text-yellow-400">
              {Math.round((challengeCompleted / cohorte.participants) * 100)}%
            </span>
          </div>
          <div className="h-2 rounded-full bg-white/5 overflow-hidden">
            <div
              className="h-full rounded-full bg-yellow-400 transition-all duration-700"
              style={{ width: `${(challengeCompleted / cohorte.participants) * 100}%` }}
            />
          </div>
        </div>
        {!state.challengeJoined ? (
          <button
            onClick={handleJoinChallenge}
            className="w-full py-2.5 bg-yellow-500 hover:bg-yellow-600 text-black rounded-lg text-sm font-bold transition-colors"
          >
            Unirme al reto
          </button>
        ) : (
          <div className="flex items-center gap-2 text-green-400 text-sm font-semibold">
            <CheckCircle className="w-4 h-4" />
            Ya estás en el reto · ¡Sigue así!
          </div>
        )}
      </div>

      {/* Leaderboard */}
      <div className="glass rounded-xl p-5 space-y-3">
        <div className="flex items-center gap-2">
          <Flame className="w-4 h-4 text-orange-400" />
          <h3 className="font-semibold text-white text-sm">Racha de la semana</h3>
        </div>
        <div className="space-y-2">
          {LEADERBOARD.map((entry) => (
            <div
              key={entry.rank}
              className={cn(
                "flex items-center gap-3 p-3 rounded-lg transition-colors",
                entry.isCurrentUser
                  ? "bg-violet-600/15 border border-violet-600/30"
                  : "hover:bg-white/3"
              )}
            >
              <div className={cn(
                "w-7 h-7 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0",
                entry.rank === 1 ? "bg-yellow-500 text-black"
                : entry.rank === 2 ? "bg-gray-400 text-black"
                : entry.rank === 3 ? "bg-amber-700 text-white"
                : "bg-white/10 text-muted-foreground"
              )}>
                {entry.rank === 1 ? "🥇" : entry.rank === 2 ? "🥈" : entry.rank === 3 ? "🥉" : entry.rank}
              </div>
              <AvatarBadge initials={entry.avatar} size="sm" />
              <span className={cn(
                "flex-1 text-sm font-medium",
                entry.isCurrentUser ? "text-violet-300" : "text-foreground"
              )}>
                {entry.name}
                {entry.isCurrentUser && (
                  <span className="text-xs text-muted-foreground ml-2">(tú)</span>
                )}
              </span>
              <div className="flex items-center gap-1.5">
                <Flame className={cn("w-3.5 h-3.5", entry.streak > 0 ? "text-orange-400" : "text-muted-foreground")} />
                <span className={cn(
                  "text-sm font-bold",
                  entry.streak > 0 ? "text-orange-400" : "text-muted-foreground"
                )}>
                  {entry.streak}d
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Next event */}
      <div className="glass rounded-xl p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center flex-shrink-0">
            <Calendar className="w-5 h-5 text-cyan-400" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-white text-sm">Próximo evento de tu cohorte</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Sesión en vivo con Ana Reyes · Jueves 5 de junio · 7:00 pm
            </p>
          </div>
          <span className="text-xs font-bold text-cyan-400 flex-shrink-0">4 días</span>
        </div>
      </div>

      {/* Feed */}
      <div>
        <p className="text-xs text-muted-foreground uppercase tracking-widest font-medium mb-3">Posts del grupo</p>
        <div className="space-y-3">
          {FEED_POSTS.slice(1).map((post) => (
            <div key={post.id} className="glass rounded-xl p-4 space-y-3">
              <div className="flex items-start gap-3">
                <AvatarBadge initials={post.avatar} size="sm" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white">{post.author}</p>
                  <p className="text-xs text-muted-foreground">
                    hace {post.minutesAgo < 60 ? `${post.minutesAgo} min` : `${Math.floor(post.minutesAgo / 60)} hrs`}
                  </p>
                </div>
              </div>
              <p className="text-sm text-foreground leading-relaxed">{post.content}</p>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => toggleLike(post.id)}
                  className={cn(
                    "flex items-center gap-1.5 text-xs transition-colors",
                    liked.has(post.id) ? "text-pink-400" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Heart className={cn("w-3.5 h-3.5", liked.has(post.id) ? "fill-pink-400" : "")} />
                  {post.reactions + (liked.has(post.id) ? 1 : 0)}
                </button>
                <button className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
                  <MessageCircle className="w-3.5 h-3.5" />
                  {post.comments}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <ActionToast message={toast.message} visible={toast.visible} onHide={hide} />
    </div>
  )
}
