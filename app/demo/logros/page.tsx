"use client"

import { useState } from "react"
import { Trophy, Zap, Star, Flame, Target, Calendar, BookOpen, Film, Users, Heart, Lock, TrendingUp } from "lucide-react"
import { MomentumGauge } from "@/components/demo/MomentumGauge"
import { AvatarBadge } from "@/components/demo/AvatarBadge"
import { useDemoStore } from "@/lib/demo-store"
import { cn } from "@/lib/utils"

// ─── Data ─────────────────────────────────────────────────────────────────────

const LEVELS = [
  { name: "Explorador",  min: 0,    color: "text-cyan-400",   bg: "bg-cyan-500/15",   border: "border-cyan-500/25" },
  { name: "Visionario",  min: 2500, color: "text-violet-400", bg: "bg-violet-500/15", border: "border-violet-500/25" },
  { name: "Líder",       min: 5000, color: "text-yellow-400", bg: "bg-yellow-500/15", border: "border-yellow-500/25" },
  { name: "Maestro",     min: 9000, color: "text-orange-400", bg: "bg-orange-500/15", border: "border-orange-500/25" },
]

const BASE_POINTS = 1850

const RECENT_ACTIVITY = [
  { label: "Misión semana 11 completada",         pts: +50,  icon: Target,   color: "text-violet-400", daysAgo: 12 },
  { label: "Asistió a sesión en vivo Gen. Omega", pts: +100, icon: Calendar, color: "text-cyan-400",   daysAgo: 13 },
  { label: "Racha de 7 días alcanzada",           pts: +75,  icon: Flame,    color: "text-orange-400", daysAgo: 19 },
  { label: "Libro \"El poder del hábito\" leído", pts: +40,  icon: BookOpen, color: "text-green-400",  daysAgo: 21 },
  { label: "Sesión con coach Ana Reyes",          pts: +30,  icon: Heart,    color: "text-pink-400",   daysAgo: 25 },
]

const LEADERBOARD = [
  { name: "Carmen Valdés", avatar: "CV", pts: 6420, level: "Líder" },
  { name: "Héctor Ramírez", avatar: "HR", pts: 5180, level: "Visionario" },
  { name: "Diego Salinas",  avatar: "DS", pts: 4950, level: "Visionario" },
  { name: "Paola Serrano",  avatar: "PS", pts: 3800, level: "Visionario" },
  { name: "Valeria Romo",   avatar: "VR", pts: 1850, level: "Explorador", isMe: true },
]

interface Badge {
  id: string
  emoji: string
  title: string
  desc: string
  earned: boolean
  pts: number
  category: "programa" | "habito" | "comunidad" | "logro"
}

const BADGES: Badge[] = [
  { id: "b1",  emoji: "🌅", title: "Primer Despertar",       desc: "Completaste el Entrenamiento 1",                earned: true,  pts: 150, category: "programa" },
  { id: "b2",  emoji: "🔥", title: "Expansión completa",     desc: "Completaste el Entrenamiento 2",                earned: true,  pts: 200, category: "programa" },
  { id: "b3",  emoji: "💜", title: "Vía Creania activa",   desc: "Ingresaste al Programa de Liderazgo",           earned: true,  pts: 250, category: "programa" },
  { id: "b4",  emoji: "✅", title: "Primera misión",         desc: "Completaste tu primera misión semanal",         earned: true,  pts: 50,  category: "habito" },
  { id: "b5",  emoji: "📅", title: "Asistencia perfecta",    desc: "3 eventos seguidos sin faltar",                 earned: true,  pts: 120, category: "habito" },
  { id: "b6",  emoji: "📖", title: "Lector activo",          desc: "Primer libro del programa completado",          earned: true,  pts: 80,  category: "habito" },
  { id: "b7",  emoji: "🎬", title: "Cinéfilo consciente",    desc: "Primera película del programa vista",           earned: true,  pts: 60,  category: "habito" },
  { id: "b8",  emoji: "🏆", title: "Racha de 22 días",       desc: "Alcanzaste tu mejor racha personal",           earned: true,  pts: 200, category: "logro" },
  { id: "b9",  emoji: "🔱", title: "Racha de 30 días",       desc: "30 días de actividad continua",                earned: false, pts: 350, category: "logro" },
  { id: "b10", emoji: "⚡", title: "10 misiones",            desc: "10 misiones semanales completadas",            earned: false, pts: 250, category: "habito" },
  { id: "b11", emoji: "🌟", title: "Enrolador",              desc: "Invitaste a alguien al programa",              earned: false, pts: 300, category: "comunidad" },
  { id: "b12", emoji: "👑", title: "Líder de generación",    desc: "Momentum #1 en tu generación por 1 semana",    earned: false, pts: 500, category: "comunidad" },
  { id: "b13", emoji: "🤝", title: "Coach de pares",         desc: "Apoyaste a otro participante en su misión",    earned: false, pts: 200, category: "comunidad" },
  { id: "b14", emoji: "🎯", title: "Objetivo cumplido",      desc: "Completaste tu objetivo principal del mes",    earned: false, pts: 400, category: "logro" },
]

const CATEGORY_LABELS: Record<Badge["category"], string> = {
  programa: "Programa", habito: "Hábitos", comunidad: "Comunidad", logro: "Logros"
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function LogrosPage() {
  const { state } = useDemoStore()
  const [activeCategory, setActiveCategory] = useState<Badge["category"] | "todos">("todos")

  const totalPts = BASE_POINTS + (state.missionCompleted ? 50 : 0) + (state.sessionBooked ? 30 : 0)
  const currentLevel = [...LEVELS].reverse().find((l) => totalPts >= l.min) ?? LEVELS[0]
  const nextLevel = LEVELS[LEVELS.findIndex((l) => l.name === currentLevel.name) + 1]
  const progress = nextLevel
    ? Math.round(((totalPts - currentLevel.min) / (nextLevel.min - currentLevel.min)) * 100)
    : 100

  const filteredBadges = activeCategory === "todos"
    ? BADGES
    : BADGES.filter((b) => b.category === activeCategory)

  return (
    <div className="p-5 max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Mis Logros</h1>
          <p className="text-muted-foreground text-sm mt-0.5">Valeria Romo · Generación Omega</p>
        </div>
        <MomentumGauge score={state.valeriaMomentum} size="sm" showLabel={false} />
      </div>

      {/* Level card */}
      <div className={cn("rounded-2xl border p-5 space-y-4", currentLevel.border, currentLevel.bg.replace("15", "8"))}>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center text-3xl", currentLevel.bg, "border", currentLevel.border)}>
              <Trophy className={cn("w-7 h-7", currentLevel.color)} />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">Nivel actual</p>
              <p className={cn("text-2xl font-black", currentLevel.color)}>{currentLevel.name}</p>
              <p className="text-xs text-muted-foreground">{totalPts.toLocaleString()} puntos acumulados</p>
            </div>
          </div>
          {nextLevel && (
            <div className="text-right">
              <p className="text-[10px] text-muted-foreground">Siguiente nivel</p>
              <p className="text-sm font-bold text-white">{nextLevel.name}</p>
              <p className="text-xs text-muted-foreground">{(nextLevel.min - totalPts).toLocaleString()} pts más</p>
            </div>
          )}
        </div>

        {nextLevel && (
          <div className="space-y-1.5">
            <div className="flex justify-between text-[11px] text-muted-foreground">
              <span>{currentLevel.name} → {nextLevel.name}</span>
              <span>{progress}%</span>
            </div>
            <div className="h-2.5 rounded-full bg-white/8 overflow-hidden">
              <div
                className={cn("h-full rounded-full transition-all duration-1000", currentLevel.color.replace("text-", "bg-"))}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Racha actual",  value: "0 días",  sub: "Mejor: 22 días", icon: Flame,    color: "text-orange-400", alert: true },
          { label: "Misiones",      value: "3 / 12",  sub: "Este mes",       icon: Target,   color: "text-violet-400", alert: false },
          { label: "Badges",        value: `${BADGES.filter(b => b.earned).length}/${BADGES.length}`, sub: "desbloqueados", icon: Star, color: "text-yellow-400", alert: false },
        ].map((s) => (
          <div key={s.label} className={cn("glass rounded-xl p-3 space-y-1 text-center", s.alert && "border-red-500/20")}>
            <s.icon className={cn("w-4 h-4 mx-auto", s.color)} />
            <p className={cn("text-xl font-black", s.alert ? "text-red-400" : "text-white")}>{s.value}</p>
            <p className="text-[10px] text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Cómo ganar puntos */}
      <div className="glass rounded-xl p-4 space-y-3">
        <div className="flex items-center gap-2">
          <Zap className="w-3.5 h-3.5 text-yellow-400" />
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">Cómo ganar puntos</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {[
            { action: "Completar misión semanal",  pts: "+50",  icon: "✅" },
            { action: "Asistir a evento en vivo",  pts: "+100", icon: "📅" },
            { action: "Racha de 7 días",           pts: "+75",  icon: "🔥" },
            { action: "Leer libro del programa",   pts: "+40",  icon: "📖" },
            { action: "Ver película asignada",     pts: "+25",  icon: "🎬" },
            { action: "Enrolar a alguien",         pts: "+200", icon: "🌟" },
            { action: "Sesión con coach",          pts: "+30",  icon: "💜" },
            { action: "Completar tu objetivo",     pts: "+400", icon: "🎯" },
            { action: "Ejercicio de la semana",    pts: "+20",  icon: "💪" },
          ].map((item) => (
            <div key={item.action} className="flex items-center gap-2 bg-white/3 rounded-lg px-2.5 py-2">
              <span className="text-sm flex-shrink-0">{item.icon}</span>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] text-muted-foreground leading-tight">{item.action}</p>
              </div>
              <span className="text-[10px] font-black text-yellow-400 flex-shrink-0">{item.pts}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent activity */}
      <div className="glass rounded-xl p-4 space-y-3">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">Actividad reciente</p>
        </div>
        <div className="space-y-2">
          {RECENT_ACTIVITY.map((item, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0">
                <item.icon className={cn("w-3.5 h-3.5", item.color)} />
              </div>
              <p className="text-xs text-foreground flex-1">{item.label}</p>
              <span className="text-xs text-muted-foreground whitespace-nowrap">hace {item.daysAgo}d</span>
              <span className="text-xs font-bold text-yellow-400 whitespace-nowrap w-12 text-right">+{item.pts} pts</span>
            </div>
          ))}
        </div>
      </div>

      {/* Badges */}
      <div className="space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Star className="w-3.5 h-3.5 text-yellow-400" />
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">Badges</p>
          </div>
          <div className="flex gap-1.5 flex-wrap">
            {(["todos", "programa", "habito", "comunidad", "logro"] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  "px-2.5 py-1 rounded-full text-[10px] font-semibold border transition-colors",
                  activeCategory === cat
                    ? "bg-violet-600/30 border-violet-500/50 text-violet-300"
                    : "bg-white/4 border-white/8 text-muted-foreground hover:border-white/20"
                )}
              >
                {cat === "todos" ? "Todos" : CATEGORY_LABELS[cat]}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {filteredBadges.map((badge) => (
            <div
              key={badge.id}
              className={cn(
                "glass rounded-xl p-3 space-y-1.5 transition-all",
                badge.earned
                  ? "border-white/10 hover:border-violet-500/30"
                  : "opacity-45 grayscale"
              )}
            >
              <div className="flex items-start justify-between gap-1">
                <span className="text-2xl leading-none">{badge.emoji}</span>
                <div className="flex items-center gap-1">
                  {badge.earned ? (
                    <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-green-500/15 text-green-400 border border-green-500/20 font-bold">
                      ✓
                    </span>
                  ) : (
                    <Lock className="w-3 h-3 text-muted-foreground" />
                  )}
                </div>
              </div>
              <p className="text-xs font-bold text-white leading-tight">{badge.title}</p>
              <p className="text-[10px] text-muted-foreground leading-snug">{badge.desc}</p>
              <p className="text-[10px] font-bold text-yellow-400">+{badge.pts} pts</p>
            </div>
          ))}
        </div>
      </div>

      {/* Leaderboard */}
      <div className="glass rounded-xl overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-3 border-b border-white/6">
          <Users className="w-3.5 h-3.5 text-violet-400" />
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">Ranking · Generación Omega</p>
        </div>
        <div className="divide-y divide-white/4">
          {LEADERBOARD.map((p, i) => (
            <div
              key={p.name}
              className={cn(
                "flex items-center gap-3 px-4 py-3",
                p.isMe && "bg-violet-500/5 border-l-2 border-violet-500/50"
              )}
            >
              <span className={cn(
                "text-sm font-black w-5 text-center",
                i === 0 ? "text-yellow-400" : i === 1 ? "text-gray-300" : i === 2 ? "text-orange-400" : "text-muted-foreground"
              )}>
                {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `${i + 1}`}
              </span>
              <AvatarBadge initials={p.avatar} size="sm" color={p.isMe ? "violet" : "auto"} />
              <div className="flex-1 min-w-0">
                <p className={cn("text-sm font-semibold truncate", p.isMe ? "text-violet-300" : "text-white")}>
                  {p.name} {p.isMe && <span className="text-[10px] text-violet-400">(tú)</span>}
                </p>
                <p className="text-[10px] text-muted-foreground">{p.level}</p>
              </div>
              <span className="text-sm font-black text-white whitespace-nowrap">{p.pts.toLocaleString()} pts</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
