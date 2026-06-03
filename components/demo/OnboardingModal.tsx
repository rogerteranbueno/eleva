"use client"

import { useEffect, useState } from "react"
import { X } from "lucide-react"
import { useDemoStore } from "@/lib/demo-store"

export interface OnboardingTip {
  emoji: string
  text: string
}

export interface OnboardingConfig {
  screenId: string
  badge: string
  badgeColor: "violet" | "cyan"
  title: string
  description: string
  tips: OnboardingTip[]
  cta?: string
}

export function OnboardingModal({ config }: { config: OnboardingConfig }) {
  const { state, dispatch } = useDemoStore()
  const [visible, setVisible] = useState(false)

  const alreadySeen = state.seenOnboarding.includes(config.screenId)

  useEffect(() => {
    if (!alreadySeen) {
      // Small delay so the page renders first
      const t = setTimeout(() => setVisible(true), 350)
      return () => clearTimeout(t)
    }
  }, [alreadySeen])

  function dismiss() {
    setVisible(false)
    dispatch({ type: "MARK_ONBOARDING_SEEN", screenId: config.screenId })
  }

  if (!visible) return null

  const badgeClass =
    config.badgeColor === "cyan"
      ? "bg-cyan-500/15 text-cyan-400 border-cyan-500/30"
      : "bg-violet-500/15 text-violet-400 border-violet-500/30"

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={dismiss}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Card */}
      <div
        className="relative w-full max-w-md glass-violet rounded-2xl p-6 shadow-2xl border border-violet-500/20 animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={dismiss}
          className="absolute top-4 right-4 w-7 h-7 rounded-full flex items-center justify-center text-muted-foreground hover:text-white hover:bg-white/10 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Badge */}
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-widest border ${badgeClass} mb-4`}>
          {config.badge}
        </span>

        {/* Title */}
        <h2 className="text-xl font-black text-white mb-2">{config.title}</h2>

        {/* Description */}
        <p className="text-sm text-muted-foreground leading-relaxed mb-5">
          {config.description}
        </p>

        {/* Tips */}
        <div className="space-y-3 mb-6">
          {config.tips.map((tip, i) => (
            <div key={i} className="flex items-start gap-3">
              <span className="text-base flex-shrink-0 leading-tight">{tip.emoji}</span>
              <p className="text-sm text-foreground leading-snug">{tip.text}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <button
          onClick={dismiss}
          className="w-full py-2.5 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-sm font-bold transition-colors"
        >
          {config.cta ?? "¡Entendido, explorar!"}
        </button>
      </div>
    </div>
  )
}
