"use client"

import { useEffect, useState } from "react"
import { getMomentumColor, getMomentumLabel } from "@/lib/utils"

interface Props {
  score: number
  size?: "sm" | "md" | "lg"
  showLabel?: boolean
  animated?: boolean
}

export function MomentumGauge({ score, size = "md", showLabel = true, animated = true }: Props) {
  const [displayed, setDisplayed] = useState(animated ? 0 : score)

  useEffect(() => {
    if (!animated) { setDisplayed(score); return }
    let current = 0
    const step = score / 40
    const timer = setInterval(() => {
      current += step
      if (current >= score) { setDisplayed(score); clearInterval(timer) }
      else setDisplayed(Math.floor(current))
    }, 25)
    return () => clearInterval(timer)
  }, [score, animated])

  const color = getMomentumColor(score)
  const label = getMomentumLabel(score)

  const sizes = {
    sm: { box: 64, r: 26, stroke: 5, fontSize: "text-lg", labelSize: "text-[10px]" },
    md: { box: 100, r: 42, stroke: 7, fontSize: "text-3xl", labelSize: "text-xs" },
    lg: { box: 160, r: 68, stroke: 10, fontSize: "text-5xl", labelSize: "text-sm" },
  }

  const { box, r, stroke, fontSize, labelSize } = sizes[size]
  const circumference = 2 * Math.PI * r
  const dashoffset = circumference - (displayed / 100) * circumference

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative" style={{ width: box, height: box }}>
        <svg width={box} height={box} className="-rotate-90">
          {/* Track */}
          <circle
            cx={box / 2}
            cy={box / 2}
            r={r}
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth={stroke}
          />
          {/* Progress */}
          <circle
            cx={box / 2}
            cy={box / 2}
            r={r}
            fill="none"
            stroke={color}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashoffset}
            style={{ transition: "stroke-dashoffset 0.05s linear" }}
          />
        </svg>
        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`font-bold ${fontSize}`} style={{ color }}>
            {displayed}%
          </span>
        </div>
      </div>
      {showLabel && (
        <span
          className={`font-semibold ${labelSize} uppercase tracking-wider`}
          style={{ color }}
        >
          {label}
        </span>
      )}
    </div>
  )
}
