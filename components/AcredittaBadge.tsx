"use client"

import { ExternalLink, BadgeCheck } from "lucide-react"

interface AcredittaBadgeProps {
  size?: "sm" | "md" | "lg"
  className?: string
}

export function AcredittaBadge({ size = "md", className = "" }: AcredittaBadgeProps) {
  const sizes = {
    sm: { wrap: "px-3 py-1.5 gap-2 rounded-lg", icon: "w-3.5 h-3.5", text: "text-[10px]", sub: "hidden" },
    md: { wrap: "px-4 py-2.5 gap-2.5 rounded-xl", icon: "w-4 h-4", text: "text-xs", sub: "text-[10px]" },
    lg: { wrap: "px-5 py-3.5 gap-3 rounded-2xl", icon: "w-5 h-5", text: "text-sm", sub: "text-xs" },
  }
  const s = sizes[size]

  return (
    <a
      href="https://info.acreditta.com/"
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center ${s.wrap} bg-white/4 border border-white/10 hover:border-violet-500/40 hover:bg-violet-500/5 transition-all duration-200 group ${className}`}
    >
      {/* Verified check */}
      <div className="relative shrink-0">
        <BadgeCheck className={`${s.icon} text-violet-400`} />
      </div>

      {/* Text */}
      <div>
        <p className={`${s.text} font-bold text-white leading-none`}>
          Credencial verificada
        </p>
        {size !== "sm" && (
          <p className={`${s.sub} text-violet-300/70 leading-none mt-0.5 font-medium`}>
            acreditta.com
          </p>
        )}
      </div>

      <ExternalLink className={`${s.icon} text-white/20 group-hover:text-violet-400/50 transition-colors ml-auto`} />
    </a>
  )
}

export function AcredittaTrustBar({ className = "" }: { className?: string }) {
  return (
    <div className={`flex flex-wrap items-center gap-3 ${className}`}>
      <AcredittaBadge size="sm" />
      <p className="text-xs text-white/40">
        Las credenciales ELEVA Academy son emitidas y verificadas a través de Acreditta —
        plataforma de credenciales digitales con validez internacional.
      </p>
    </div>
  )
}
