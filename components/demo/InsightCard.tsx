"use client"

import { ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"

type Severity = "high" | "medium" | "info"

interface InsightCardProps {
  icon: string
  severity: Severity
  title: string
  description: string
  actionLabel: string
  onClick: () => void
}

const styles: Record<Severity, { border: string; dot: string; action: string; actionHover: string }> = {
  high: {
    border: "border-red-500/20 hover:border-red-500/40 hover:bg-red-500/5",
    dot: "bg-red-500",
    action: "text-red-400",
    actionHover: "group-hover:text-red-300",
  },
  medium: {
    border: "border-yellow-500/20 hover:border-yellow-500/40 hover:bg-yellow-500/5",
    dot: "bg-yellow-500",
    action: "text-yellow-400",
    actionHover: "group-hover:text-yellow-300",
  },
  info: {
    border: "border-blue-500/20 hover:border-blue-500/40 hover:bg-blue-500/5",
    dot: "bg-blue-400",
    action: "text-blue-400",
    actionHover: "group-hover:text-blue-300",
  },
}

export function InsightCard({ icon, severity, title, description, actionLabel, onClick }: InsightCardProps) {
  const s = styles[severity]
  return (
    <button
      onClick={onClick}
      className={cn(
        "glass w-full text-left rounded-xl p-4 transition-all cursor-pointer group flex flex-col gap-2.5",
        s.border
      )}
    >
      {/* Top row: icon + title */}
      <div className="flex items-start gap-2.5">
        <span className="text-lg flex-shrink-0 leading-none mt-0.5">{icon}</span>
        <div className="flex items-center gap-1.5 min-w-0">
          <div className={cn("w-1.5 h-1.5 rounded-full flex-shrink-0", s.dot)} />
          <p className="text-xs font-semibold text-white leading-snug">{title}</p>
        </div>
      </div>
      {/* Description */}
      <p className="text-xs text-muted-foreground leading-relaxed pl-8">{description}</p>
      {/* Action */}
      <div className={cn(
        "flex items-center gap-1 text-xs font-semibold pl-8 transition-all group-hover:gap-1.5",
        s.action, s.actionHover
      )}>
        <span>{actionLabel}</span>
        <ArrowRight className="w-3 h-3" />
      </div>
    </button>
  )
}
