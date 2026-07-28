"use client";

import { useEffect, useState } from "react";

/** Anillo de momentum portado del demo vl2026, adaptado a los tokens de ELEVA. */

function color(score: number) {
  if (score >= 70) return "var(--ok)";
  if (score >= 40) return "var(--gold)";
  return "var(--danger)";
}

function label(score: number) {
  if (score >= 70) return "En racha";
  if (score >= 40) return "Irregular";
  return "Necesita acompañamiento";
}

const SIZES = {
  sm: { box: 64, r: 26, stroke: 5, fontSize: "text-lg", labelSize: "text-[10px]" },
  md: { box: 100, r: 42, stroke: 7, fontSize: "text-3xl", labelSize: "text-xs" },
  lg: { box: 160, r: 68, stroke: 10, fontSize: "text-5xl", labelSize: "text-sm" },
} as const;

export function MomentumGauge({
  score,
  size = "md",
  showLabel = true,
  animated = true,
}: {
  score: number;
  size?: keyof typeof SIZES;
  showLabel?: boolean;
  animated?: boolean;
}) {
  const [displayed, setDisplayed] = useState(animated ? 0 : score);

  useEffect(() => {
    if (!animated) {
      setDisplayed(score);
      return;
    }
    let current = 0;
    const step = Math.max(1, score / 40);
    const timer = setInterval(() => {
      current += step;
      if (current >= score) {
        setDisplayed(score);
        clearInterval(timer);
      } else {
        setDisplayed(Math.floor(current));
      }
    }, 25);
    return () => clearInterval(timer);
  }, [score, animated]);

  const { box, r, stroke, fontSize, labelSize } = SIZES[size];
  const circumference = 2 * Math.PI * r;
  const dashoffset = circumference - (displayed / 100) * circumference;
  const c = color(score);

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative" style={{ width: box, height: box }}>
        <svg width={box} height={box} className="-rotate-90" aria-hidden>
          <circle
            cx={box / 2}
            cy={box / 2}
            r={r}
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth={stroke}
          />
          <circle
            cx={box / 2}
            cy={box / 2}
            r={r}
            fill="none"
            stroke={c}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashoffset}
            style={{ transition: "stroke-dashoffset 0.05s linear" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`font-bold ${fontSize}`} style={{ color: c }}>
            {displayed}%
          </span>
        </div>
      </div>
      {showLabel && (
        <span
          className={`font-semibold ${labelSize} uppercase tracking-wider text-center`}
          style={{ color: c }}
        >
          {label(score)}
        </span>
      )}
    </div>
  );
}
