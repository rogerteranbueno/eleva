"use client"

import { useState, useRef, useEffect } from "react"
import { Info, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface InfoTooltipProps {
  title: string
  source?: string
  formula?: string
  why: string
  benchmark?: string
  action?: string
  className?: string
  side?: "top" | "bottom" | "left" | "right"
}

export function InfoTooltip({
  title,
  source,
  formula,
  why,
  benchmark,
  action,
  className,
  side = "top",
}: InfoTooltipProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [open])

  const positionClass =
    side === "top"    ? "bottom-full mb-2 left-1/2 -translate-x-1/2" :
    side === "bottom" ? "top-full mt-2 left-1/2 -translate-x-1/2" :
    side === "left"   ? "right-full mr-2 top-1/2 -translate-y-1/2" :
                        "left-full ml-2 top-1/2 -translate-y-1/2"

  return (
    <div ref={ref} className={cn("relative inline-flex items-center", className)}>
      <button
        onClick={() => setOpen((p) => !p)}
        className="w-4 h-4 rounded-full bg-white/10 hover:bg-violet-500/30 flex items-center justify-center transition-colors flex-shrink-0"
        aria-label="Más información"
      >
        <Info className="w-2.5 h-2.5 text-muted-foreground hover:text-violet-300" />
      </button>

      {open && (
        <div className={cn(
          "absolute z-50 w-72 bg-[#12121e] border border-white/15 rounded-xl shadow-2xl p-4 space-y-3 text-left",
          positionClass
        )}>
          <div className="flex items-start justify-between gap-2">
            <p className="text-sm font-bold text-white leading-tight">{title}</p>
            <button onClick={() => setOpen(false)} className="text-muted-foreground hover:text-white flex-shrink-0">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {source && (
            <div>
              <p className="text-[10px] uppercase tracking-widest text-violet-400 font-semibold mb-1">¿De dónde sale?</p>
              <p className="text-xs text-muted-foreground leading-relaxed">{source}</p>
            </div>
          )}

          {formula && (
            <div className="bg-white/5 rounded-lg px-3 py-2 font-mono text-[11px] text-cyan-300 leading-relaxed">
              {formula}
            </div>
          )}

          <div>
            <p className="text-[10px] uppercase tracking-widest text-yellow-400 font-semibold mb-1">¿Por qué importa?</p>
            <p className="text-xs text-foreground leading-relaxed">{why}</p>
          </div>

          {benchmark && (
            <div className="flex items-center gap-2 bg-white/5 rounded-lg px-3 py-2">
              <span className="text-[10px] text-muted-foreground">Benchmark</span>
              <span className="text-xs font-bold text-white">{benchmark}</span>
            </div>
          )}

          {action && (
            <div>
              <p className="text-[10px] uppercase tracking-widest text-red-400 font-semibold mb-1">Cuándo actuar</p>
              <p className="text-xs text-red-300/80 leading-relaxed">{action}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
