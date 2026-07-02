"use client"

import { Info } from "lucide-react"

export function HistoricalDisclaimer() {
  return (
    <div className="flex items-start gap-3 p-4 rounded-xl border border-white/8 bg-white/3 max-w-3xl mx-auto">
      <Info className="w-4 h-4 text-white/30 shrink-0 mt-0.5" />
      <p className="text-xs text-white/30 leading-relaxed">
        Esta página resume información histórica y reportes públicos sobre la industria de transformación personal.
        ELEVA reconoce que muchos participantes han encontrado valor en distintos programas a lo largo del tiempo.
        Nuestro propósito no es desacreditar experiencias individuales, sino abrir una conversación profesional sobre
        estándares, ética, formación, seguridad e impacto medible.
      </p>
    </div>
  )
}
