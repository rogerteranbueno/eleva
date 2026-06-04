"use client"

import { useState } from "react"
import { X, Copy, MessageCircle, CheckCircle2, Download, Flame, Trophy } from "lucide-react"
import { cn } from "@/lib/utils"

interface ShareProgressCardProps {
  name: string
  momentum: number
  streak: number
  phase: string
  onClose: () => void
}

export function ShareProgressCard({ name, momentum, streak, phase, onClose }: ShareProgressCardProps) {
  const [copied, setCopied] = useState(false)
  const [whatsappSent, setWhatsappSent] = useState(false)
  const [downloaded, setDownloaded] = useState(false)

  function getMomentumLabel(m: number) {
    if (m >= 80) return { label: "En zona de alto rendimiento", color: "text-green-400" }
    if (m >= 60) return { label: "Avanzando con consistencia", color: "text-cyan-400" }
    if (m >= 40) return { label: "En proceso de activación", color: "text-yellow-400" }
    return { label: "Iniciando el camino", color: "text-orange-400" }
  }

  function getMomentumGradient(m: number) {
    if (m >= 80) return "from-green-600/30 to-emerald-900/20"
    if (m >= 60) return "from-cyan-600/30 to-blue-900/20"
    if (m >= 40) return "from-yellow-600/30 to-amber-900/20"
    return "from-orange-600/30 to-red-900/20"
  }

  function getMomentumBarColor(m: number) {
    if (m >= 80) return "bg-green-500"
    if (m >= 60) return "bg-cyan-500"
    if (m >= 40) return "bg-yellow-500"
    return "bg-orange-500"
  }

  const momentumInfo = getMomentumLabel(momentum)
  const firstName = name.split(" ")[0]

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-sm bg-[#0d0d18] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/6">
          <p className="font-semibold text-white text-sm">Mi progreso</p>
          <button onClick={onClose} className="p-1 rounded-lg text-muted-foreground hover:text-white transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <p className="text-xs text-muted-foreground">Así se ve tu tarjeta de progreso:</p>

          {/* Progress card preview */}
          <div className={cn(
            "rounded-2xl overflow-hidden border border-white/10 bg-gradient-to-br",
            getMomentumGradient(momentum),
            "bg-[#0d0d18]"
          )}>
            <div className="px-4 py-2.5 flex items-center justify-between border-b border-white/8">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-violet-600 flex items-center justify-center">
                  <span className="text-white font-black text-[9px]">E</span>
                </div>
                <span className="text-[10px] font-bold text-muted-foreground">ELEVA · Creania</span>
              </div>
              <span className="text-[10px] text-muted-foreground">{phase}</span>
            </div>

            <div className="p-4 space-y-3">
              <div>
                <p className="text-lg font-black text-white">{firstName}</p>
                <p className={cn("text-xs font-medium", momentumInfo.color)}>{momentumInfo.label}</p>
              </div>

              {/* Momentum */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Momentum Score</span>
                  <span className={cn("font-black text-lg", momentumInfo.color)}>{momentum}%</span>
                </div>
                <div className="h-2.5 rounded-full bg-white/8 overflow-hidden">
                  <div
                    className={cn("h-full rounded-full transition-all", getMomentumBarColor(momentum))}
                    style={{ width: `${momentum}%` }}
                  />
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-white/5 rounded-lg px-3 py-2 text-center">
                  <div className="flex items-center justify-center gap-1 mb-0.5">
                    <Flame className="w-3 h-3 text-orange-400" />
                    <span className="text-sm font-black text-white">{streak}</span>
                  </div>
                  <p className="text-[10px] text-muted-foreground">días de racha</p>
                </div>
                <div className="bg-white/5 rounded-lg px-3 py-2 text-center">
                  <div className="flex items-center justify-center gap-1 mb-0.5">
                    <Trophy className="w-3 h-3 text-yellow-400" />
                    <span className="text-sm font-black text-white">22</span>
                  </div>
                  <p className="text-[10px] text-muted-foreground">mejor racha</p>
                </div>
              </div>

              <p className="text-[10px] text-muted-foreground text-center pt-0.5">
                Estoy transformando mi vida en Creania · creania.eleva.app
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-2">
            <button
              onClick={() => { setWhatsappSent(true); setTimeout(() => setWhatsappSent(false), 2500) }}
              className={cn(
                "flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-semibold transition-all",
                whatsappSent
                  ? "bg-green-500/15 text-green-400 border border-green-500/20"
                  : "bg-[#25D366] text-white hover:bg-[#1da851]"
              )}
            >
              {whatsappSent ? (
                <><CheckCircle2 className="w-4 h-4" /> Compartido ✓</>
              ) : (
                <><MessageCircle className="w-4 h-4" /> Compartir por WhatsApp</>
              )}
            </button>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => { setDownloaded(true); setTimeout(() => setDownloaded(false), 2500) }}
                className={cn(
                  "flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-medium border transition-all",
                  downloaded
                    ? "bg-green-500/10 text-green-400 border-green-500/20"
                    : "glass text-muted-foreground border-white/10 hover:text-white"
                )}
              >
                {downloaded ? <CheckCircle2 className="w-3 h-3" /> : <Download className="w-3 h-3" />}
                {downloaded ? "¡Guardado!" : "Descargar imagen"}
              </button>
              <button
                onClick={() => { setCopied(true); setTimeout(() => setCopied(false), 2500) }}
                className={cn(
                  "flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-medium border transition-all",
                  copied
                    ? "bg-green-500/10 text-green-400 border-green-500/20"
                    : "glass text-muted-foreground border-white/10 hover:text-white"
                )}
              >
                {copied ? <CheckCircle2 className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                {copied ? "Copiado" : "Copiar link"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
