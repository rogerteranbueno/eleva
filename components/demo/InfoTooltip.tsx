"use client"

import { useState, useRef, useEffect } from "react"
import { createPortal } from "react-dom"
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
  const [pos, setPos] = useState({ top: 0, left: 0 })
  const btnRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    if (!open) return
    function handleClick(e: MouseEvent) {
      if (
        panelRef.current && !panelRef.current.contains(e.target as Node) &&
        btnRef.current && !btnRef.current.contains(e.target as Node)
      ) setOpen(false)
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [open])

  function handleOpen() {
    if (!btnRef.current) return
    const rect = btnRef.current.getBoundingClientRect()
    const PANEL_W = 288 // w-72
    const PANEL_H = 300 // approximate max height

    let top: number
    let left: number

    if (side === "bottom") {
      top = rect.bottom + 8
      left = rect.left + rect.width / 2 - PANEL_W / 2
    } else if (side === "left") {
      top = rect.top + rect.height / 2 - PANEL_H / 2
      left = rect.left - PANEL_W - 8
    } else if (side === "right") {
      top = rect.top + rect.height / 2 - PANEL_H / 2
      left = rect.right + 8
    } else {
      // top (default)
      top = rect.top - PANEL_H - 8
      left = rect.left + rect.width / 2 - PANEL_W / 2
    }

    // Clamp to viewport so it never goes offscreen
    const vw = window.innerWidth
    const vh = window.innerHeight
    left = Math.max(8, Math.min(left, vw - PANEL_W - 8))
    top  = Math.max(8, Math.min(top,  vh - PANEL_H - 8))

    setPos({ top, left })
    setOpen(true)
  }

  const panel = open && mounted ? createPortal(
    <div
      ref={panelRef}
      style={{ position: "fixed", top: pos.top, left: pos.left, zIndex: 9999, width: 288 }}
      className="bg-[#12121e] border border-white/15 rounded-xl shadow-2xl p-4 space-y-3 text-left"
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-bold text-white leading-tight">{title}</p>
        <button onClick={() => setOpen(false)} className="text-muted-foreground hover:text-white flex-shrink-0 mt-0.5">
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
    </div>,
    document.body
  ) : null

  return (
    <div className={cn("relative inline-flex items-center", className)}>
      <button
        ref={btnRef}
        onClick={() => open ? setOpen(false) : handleOpen()}
        className="w-4 h-4 rounded-full bg-white/10 hover:bg-violet-500/30 flex items-center justify-center transition-colors flex-shrink-0"
        aria-label="Más información"
      >
        <Info className="w-2.5 h-2.5 text-muted-foreground hover:text-violet-300" />
      </button>

      {panel}
    </div>
  )
}
