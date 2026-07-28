"use client"

import { BadgeCheck } from "lucide-react"

type CertLevel = "ECS" | "ECC" | "ECT" | "ECC+"

interface ElevaCertBadgeProps {
  level: CertLevel
  name?: string
  size?: "sm" | "md" | "lg"
  verified?: boolean
}

const certConfig: Record<CertLevel, { color: string; bg: string; border: string; glow: string; label: string }> = {
  "ECS":  { color: "text-emerald-300", bg: "bg-emerald-500/8",  border: "border-emerald-500/25", glow: "shadow-emerald-500/10", label: "ELEVA Certified Staff" },
  "ECC":  { color: "text-blue-300",    bg: "bg-blue-500/8",    border: "border-blue-500/25",    glow: "shadow-blue-500/10",    label: "ELEVA Certified Coach" },
  "ECT":  { color: "text-violet-300",  bg: "bg-violet-500/8",  border: "border-violet-500/25",  glow: "shadow-violet-500/10",  label: "ELEVA Certified Trainer" },
  "ECC+": { color: "text-amber-300",   bg: "bg-amber-500/8",   border: "border-amber-500/25",   glow: "shadow-amber-500/10",   label: "ELEVA Certified Center" },
}

export function ElevaCertBadge({ level, name, size = "md", verified = true }: ElevaCertBadgeProps) {
  const c = certConfig[level]

  if (size === "sm") {
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[10px] font-black uppercase tracking-wider ${c.color} ${c.bg} ${c.border}`}>
        {verified && <BadgeCheck className="w-3 h-3" />}
        {level}
      </span>
    )
  }

  if (size === "lg") {
    return (
      <div className={`relative flex flex-col items-center text-center p-6 rounded-2xl border shadow-xl ${c.bg} ${c.border} ${c.glow}`}>
        {/* Hexagonal badge icon */}
        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${c.bg} border ${c.border} mb-4 rotate-3`}>
          <span className={`font-black text-lg tracking-tighter ${c.color}`}>{level}</span>
        </div>
        <p className={`font-black text-sm ${c.color}`}>{c.label}</p>
        {name && <p className="text-xs text-white/50 mt-1">{name}</p>}
        {verified && (
          <div className="flex items-center gap-1 mt-3 px-2 py-1 rounded-full bg-white/5 border border-white/10">
            <BadgeCheck className="w-3 h-3 text-violet-400" />
            <span className="text-[9px] text-white/50 font-medium">Verificada · Acreditta</span>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className={`inline-flex items-center gap-3 px-4 py-2.5 rounded-xl border ${c.bg} ${c.border}`}>
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${c.bg} border ${c.border} rotate-2`}>
        <span className={`font-black text-xs ${c.color}`}>{level}</span>
      </div>
      <div>
        <p className={`text-xs font-black ${c.color} leading-none`}>{c.label}</p>
        {name && <p className="text-[10px] text-white/40 mt-0.5">{name}</p>}
      </div>
      {verified && <BadgeCheck className={`w-4 h-4 ${c.color} opacity-70 ml-auto`} />}
    </div>
  )
}
