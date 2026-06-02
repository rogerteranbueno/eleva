import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatRelativeTime(daysAgo: number): string {
  if (daysAgo === 0) return "hoy"
  if (daysAgo === 1) return "ayer"
  if (daysAgo < 7) return `hace ${daysAgo} días`
  if (daysAgo < 30) return `hace ${Math.floor(daysAgo / 7)} semanas`
  return `hace ${Math.floor(daysAgo / 30)} meses`
}

export function getMomentumColor(score: number): string {
  if (score >= 70) return "#22c55e"
  if (score >= 40) return "#eab308"
  return "#ef4444"
}

export function getMomentumLabel(score: number): string {
  if (score >= 70) return "En racha"
  if (score >= 40) return "Irregular"
  return "En riesgo"
}
