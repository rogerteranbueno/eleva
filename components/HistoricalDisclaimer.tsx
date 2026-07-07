"use client"

import { Info } from "lucide-react"

export function HistoricalDisclaimer() {
  return (
    <div className="flex items-start gap-3 p-4 rounded-xl border border-white/8 bg-white/3 max-w-3xl mx-auto">
      <Info className="w-4 h-4 text-white/30 shrink-0 mt-0.5" />
      <div className="space-y-2 text-xs text-white/30 leading-relaxed">
        <p>
          ELEVA no está afiliada a Werner Erhard, est, The Forum, Landmark, Lifespring
          ni a otras marcas mencionadas en esta página. Las referencias se usan únicamente
          con fines históricos, comparativos y editoriales. Cuando hacemos afirmaciones sobre
          terceros, las sustentamos en fuentes públicas y académicas; no emitimos juicios
          clínicos sobre personas ni atribuimos intenciones no documentadas.
        </p>
        <p>
          Esta página resume información histórica y reportes públicos sobre la industria de
          transformación personal. ELEVA reconoce que muchos participantes han encontrado valor
          en distintos programas a lo largo del tiempo. Nuestro propósito no es desacreditar
          experiencias individuales, sino abrir una conversación profesional sobre estándares,
          ética, formación, seguridad e impacto medible.
        </p>
      </div>
    </div>
  )
}
