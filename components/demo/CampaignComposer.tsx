"use client"

import { useState } from "react"
import {
  X, Send, MessageSquare, Mail, Smartphone, Megaphone,
  Users, Clock, CheckCircle2, Sparkles, BarChart2
} from "lucide-react"
import { cn } from "@/lib/utils"

type Channel = "whatsapp" | "email" | "sms" | "campaign"

export interface ComposerInsight {
  title: string
  recipients: { count: number; label: string }
  defaultChannel: Channel
  messages: {
    whatsapp: string
    emailSubject: string
    emailBody: string
    sms: string
    campaignSubject: string
    campaignBody: string
    segment: string
  }
}

interface CampaignComposerProps {
  insight: ComposerInsight
  onClose: () => void
  onSent: (msg: string) => void
}

const CHANNELS: { id: Channel; label: string; icon: React.ComponentType<{ className?: string }>; activeClass: string; sendClass: string }[] = [
  {
    id: "whatsapp",
    label: "WhatsApp",
    icon: MessageSquare,
    activeClass: "bg-green-500/15 text-green-400 border border-green-500/30",
    sendClass: "bg-green-500 hover:bg-green-600 text-white",
  },
  {
    id: "email",
    label: "Email",
    icon: Mail,
    activeClass: "bg-blue-500/15 text-blue-400 border border-blue-500/30",
    sendClass: "bg-blue-500 hover:bg-blue-600 text-white",
  },
  {
    id: "sms",
    label: "SMS",
    icon: Smartphone,
    activeClass: "bg-yellow-500/15 text-yellow-400 border border-yellow-500/30",
    sendClass: "bg-yellow-400 hover:bg-yellow-300 text-black",
  },
  {
    id: "campaign",
    label: "Campaña",
    icon: Megaphone,
    activeClass: "bg-violet-500/15 text-violet-400 border border-violet-500/30",
    sendClass: "bg-violet-600 hover:bg-violet-700 text-white",
  },
]

export function CampaignComposer({ insight, onClose, onSent }: CampaignComposerProps) {
  const [channel, setChannel] = useState<Channel>(insight.defaultChannel)
  const [sent, setSent] = useState(false)
  const active = CHANNELS.find((c) => c.id === channel)!
  const smsLen = insight.messages.sms.length

  function handleSend() {
    setSent(true)
    const labels: Record<Channel, string> = {
      whatsapp: `WhatsApp enviado a ${insight.recipients.count} participantes ✓`,
      email: `Email enviado a ${insight.recipients.count} destinatarios ✓`,
      sms: `SMS enviado a ${insight.recipients.count} participantes ✓`,
      campaign: `Campaña lanzada, ${insight.recipients.count} personas en segmento ✓`,
    }
    setTimeout(() => {
      onSent(labels[channel])
      onClose()
    }, 1400)
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-[#0d0d15] border border-white/10 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/8 flex-shrink-0">
          <div>
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold">Acción rápida · ELEVA</p>
            <h3 className="text-sm font-semibold text-white mt-0.5 leading-snug">{insight.title}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white/5 text-muted-foreground hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Channel tabs */}
        <div className="flex gap-1 px-5 pt-3 pb-2 flex-shrink-0 overflow-x-auto">
          {CHANNELS.map(({ id, label, icon: Icon, activeClass }) => (
            <button
              key={id}
              onClick={() => { setChannel(id); setSent(false) }}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap flex-shrink-0",
                channel === id ? activeClass : "text-muted-foreground hover:text-white hover:bg-white/5"
              )}
            >
              <Icon className="w-3 h-3" />
              {label}
            </button>
          ))}
        </div>

        {/* Body */}
        <div className="px-5 pb-4 space-y-3 overflow-y-auto flex-1">
          {/* Recipients */}
          <div className="flex items-center gap-3 p-3 rounded-xl bg-white/3 border border-white/6">
            <Users className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Para</p>
              <p className="text-sm text-white font-medium truncate">{insight.recipients.label}</p>
            </div>
            <span className="text-xs text-muted-foreground bg-white/5 px-2 py-1 rounded-md flex-shrink-0">
              {insight.recipients.count}
            </span>
          </div>

          {/* WhatsApp */}
          {channel === "whatsapp" && (
            <div className="space-y-3">
              <div className="bg-[#0b2616] border border-green-500/20 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-[10px] text-green-400 font-semibold uppercase tracking-widest">Vista previa, WhatsApp Business</span>
                </div>
                <div className="bg-[#1d4d2a] rounded-2xl rounded-tl-sm px-3 py-2.5 max-w-[85%]">
                  <p className="text-sm text-white whitespace-pre-wrap leading-relaxed">{insight.messages.whatsapp}</p>
                  <p className="text-right text-[10px] text-green-400/50 mt-1">9:41 ✓✓</p>
                </div>
              </div>
              <textarea
                className="w-full bg-white/3 border border-white/8 rounded-xl p-3 text-sm text-white placeholder:text-muted-foreground resize-none focus:outline-none focus:border-white/20 transition-colors leading-relaxed"
                rows={4}
                defaultValue={insight.messages.whatsapp}
              />
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5 text-green-400/70">
                  <Sparkles className="w-3 h-3" />
                  IA redactó el mensaje, puedes editarlo
                </span>
                <span>{insight.messages.whatsapp.length} caracteres</span>
              </div>
            </div>
          )}

          {/* Email */}
          {channel === "email" && (
            <div className="space-y-3">
              <input
                className="w-full bg-white/3 border border-white/8 rounded-xl px-3 py-2.5 text-sm text-white placeholder:text-muted-foreground focus:outline-none focus:border-white/20 transition-colors"
                defaultValue={insight.messages.emailSubject}
                placeholder="Asunto..."
              />
              <textarea
                className="w-full bg-white/3 border border-white/8 rounded-xl p-3 text-sm text-white placeholder:text-muted-foreground resize-none focus:outline-none focus:border-white/20 transition-colors leading-relaxed"
                rows={7}
                defaultValue={insight.messages.emailBody}
              />
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1.5 text-xs text-blue-400/80">
                  <Sparkles className="w-3 h-3" />
                  Personalización activa, {"{nombre}"} se reemplaza automáticamente
                </span>
              </div>
            </div>
          )}

          {/* SMS */}
          {channel === "sms" && (
            <div className="space-y-3">
              <textarea
                className="w-full bg-white/3 border border-white/8 rounded-xl p-3 text-sm text-white placeholder:text-muted-foreground resize-none focus:outline-none focus:border-white/20 transition-colors leading-relaxed"
                rows={4}
                defaultValue={insight.messages.sms}
              />
              <div className="flex items-center justify-between text-xs">
                <span className={cn("font-medium", smsLen > 160 ? "text-red-400" : "text-muted-foreground")}>
                  {smsLen}/160 caracteres{smsLen > 160 ? ", 2 SMS" : ""}
                </span>
                <span className="text-muted-foreground">
                  {insight.recipients.count} SMS · estimado ${(insight.recipients.count * 0.008).toFixed(2)} USD
                </span>
              </div>
            </div>
          )}

          {/* Campaign */}
          {channel === "campaign" && (
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-violet-500/5 border border-violet-500/20">
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Segmento</span>
                <span className="text-sm text-violet-300 font-medium flex-1">{insight.messages.segment}</span>
              </div>
              <input
                className="w-full bg-white/3 border border-white/8 rounded-xl px-3 py-2.5 text-sm text-white placeholder:text-muted-foreground focus:outline-none focus:border-white/20 transition-colors"
                defaultValue={insight.messages.campaignSubject}
                placeholder="Asunto de campaña..."
              />
              <textarea
                className="w-full bg-white/3 border border-white/8 rounded-xl p-3 text-sm text-white placeholder:text-muted-foreground resize-none focus:outline-none focus:border-white/20 transition-colors leading-relaxed"
                rows={5}
                defaultValue={insight.messages.campaignBody}
              />
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: "Apertura est.", value: "83%", icon: BarChart2 },
                  { label: "Click est.", value: "31%", icon: BarChart2 },
                  { label: "Mejor hora", value: "9:00 AM", icon: Clock },
                ].map(({ label, value }) => (
                  <div key={label} className="p-2.5 rounded-xl bg-white/3 border border-white/6 text-center">
                    <p className="text-[10px] text-muted-foreground">{label}</p>
                    <p className="text-sm font-bold text-white mt-0.5">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-3.5 border-t border-white/8 flex-shrink-0 gap-3">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Clock className="w-3.5 h-3.5" />
            <span>Envío inmediato o programado</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3 py-2 rounded-lg text-xs text-muted-foreground hover:text-white transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleSend}
              disabled={sent}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all",
                sent
                  ? "bg-green-500/15 text-green-400 border border-green-500/30 cursor-default"
                  : active.sendClass
              )}
            >
              {sent ? (
                <><CheckCircle2 className="w-3.5 h-3.5" /> Enviado</>
              ) : (
                <><Send className="w-3.5 h-3.5" /> Enviar ahora</>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
