"use client"

import { useState } from "react"
import { X, Copy, MessageCircle, CheckCircle2, Calendar, Users, ExternalLink } from "lucide-react"
import { cn } from "@/lib/utils"

interface ShareEventModalProps {
  onClose: () => void
}

export function ShareEventModal({ onClose }: ShareEventModalProps) {
  const [copied, setCopied] = useState(false)
  const [whatsappSent, setWhatsappSent] = useState(false)

  function handleCopy() {
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  function handleWhatsapp() {
    setWhatsappSent(true)
    setTimeout(() => setWhatsappSent(false), 2500)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-sm bg-[#0d0d18] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/6">
          <p className="font-semibold text-white text-sm">Compartir evento</p>
          <button onClick={onClose} className="p-1 rounded-lg text-muted-foreground hover:text-white transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Event preview card */}
        <div className="p-5 space-y-4">
          <p className="text-xs text-muted-foreground">Así verá la invitación quien la reciba:</p>

          {/* Preview card */}
          <div className="rounded-xl overflow-hidden border border-violet-500/30 bg-gradient-to-br from-violet-900/40 to-[#0d0d18]">
            <div className="px-4 py-3 flex items-center gap-2 border-b border-violet-500/20">
              <div className="w-5 h-5 rounded bg-violet-600 flex items-center justify-center">
                <span className="text-white font-black text-[10px]">E</span>
              </div>
              <span className="text-xs font-bold text-violet-300">ELEVA · Creania Transformación</span>
            </div>
            <div className="p-4 space-y-3">
              <p className="text-base font-bold text-white leading-snug">
                Sesión en vivo:<br />
                <span className="text-violet-300">Herramientas para tu siguiente nivel</span>
              </p>
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Calendar className="w-3 h-3 text-cyan-400" />
                  Jueves 5 de junio · 7:00 pm
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Users className="w-3 h-3 text-violet-400" />
                  Con Ana Reyes · Generación Omega
                </div>
              </div>
              <div className="pt-1">
                <p className="text-[11px] text-muted-foreground italic">
                  "Valeria Romo te invita a este evento de transformación."
                </p>
              </div>
              <div className="flex items-center gap-1.5 text-violet-400 text-xs font-semibold">
                <ExternalLink className="w-3 h-3" />
                Ver detalles y registrarme
              </div>
            </div>
          </div>

          {/* WhatsApp message preview */}
          <div className="space-y-2">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Mensaje sugerido</p>
            <div className="bg-[#075E54]/20 border border-[#25D366]/20 rounded-xl p-3">
              <p className="text-xs text-green-300 leading-relaxed">
                Oye, te invito a un evento de Creania que me está cambiando la vida. Es gratis, el jueves a las 7pm. Aquí el link 👇<br />
                <span className="text-green-400 font-medium">creania.eleva.app/evento/jun05</span>
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-2">
            <button
              onClick={handleWhatsapp}
              className={cn(
                "flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-semibold transition-all",
                whatsappSent
                  ? "bg-green-500/15 text-green-400 border border-green-500/20"
                  : "bg-[#25D366] text-white hover:bg-[#1da851]"
              )}
            >
              {whatsappSent ? (
                <><CheckCircle2 className="w-4 h-4" /> Enviado por WhatsApp ✓</>
              ) : (
                <><MessageCircle className="w-4 h-4" /> Enviar por WhatsApp</>
              )}
            </button>
            <button
              onClick={handleCopy}
              className={cn(
                "flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-medium border transition-all",
                copied
                  ? "bg-green-500/10 text-green-400 border-green-500/20"
                  : "glass text-muted-foreground border-white/10 hover:text-white hover:border-white/20"
              )}
            >
              {copied ? (
                <><CheckCircle2 className="w-3.5 h-3.5" /> Link copiado</>
              ) : (
                <><Copy className="w-3.5 h-3.5" /> Copiar link</>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
