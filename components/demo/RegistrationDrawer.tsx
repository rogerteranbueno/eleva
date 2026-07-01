"use client"

import { useState } from "react"
import {
  X, ChevronRight, Check, Users, TrendingUp,
  MessageCircle, CheckCircle2, UserPlus, Sparkles,
} from "lucide-react"
import { AvatarBadge } from "@/components/demo/AvatarBadge"
import { REGISTRATION_COHORTES } from "@/data/level"
import { cn } from "@/lib/utils"

const LEAD_SOURCES = [
  "Referido por participante",
  "Webinar gratuito",
  "Redes sociales",
  "Evento presencial",
  "Búsqueda orgánica",
  "Otro",
]

interface RegistrationDrawerProps {
  onClose: () => void
  onSuccess: (name: string) => void
}

export function RegistrationDrawer({ onClose, onSuccess }: RegistrationDrawerProps) {
  const [step, setStep] = useState<1 | 2 | 3 | "success">(1)
  const [form, setForm] = useState({ name: "", phone: "", email: "", leadSource: "" })
  const [selectedCohorte, setSelectedCohorte] = useState<string | null>(null)
  const [objective, setObjective] = useState("")
  const [submitting, setSubmitting] = useState(false)

  const initials = form.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()

  const cohorte = REGISTRATION_COHORTES.find((c) => c.id === selectedCohorte)

  function handleStep1() {
    if (!form.name || !form.phone || !form.email) return
    setStep(2)
  }

  function handleStep2() {
    if (!selectedCohorte) return
    setStep(3)
  }

  function handleSubmit() {
    setSubmitting(true)
    setTimeout(() => {
      setSubmitting(false)
      setStep("success")
    }, 1200)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-full sm:max-w-md bg-[#0d0d18] border border-white/10 rounded-t-2xl sm:rounded-2xl overflow-hidden shadow-2xl max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/6 flex-shrink-0">
          <div className="flex items-center gap-3">
            <UserPlus className="w-4 h-4 text-violet-400" />
            <p className="font-semibold text-white text-sm">Nuevo participante</p>
          </div>
          <div className="flex items-center gap-3">
            {step !== "success" && (
              <div className="flex items-center gap-1">
                {[1, 2, 3].map((s) => (
                  <div
                    key={s}
                    className={cn(
                      "h-1 rounded-full transition-all",
                      s <= (step as number) ? "bg-violet-500 w-6" : "bg-white/15 w-3"
                    )}
                  />
                ))}
              </div>
            )}
            <button onClick={onClose} className="p-1 rounded-lg text-muted-foreground hover:text-white transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {step === 1 && (
            <div className="p-5 space-y-4">
              <div>
                <p className="font-semibold text-white">Datos esenciales</p>
                <p className="text-xs text-muted-foreground mt-0.5">Solo lo necesario para crear el perfil. El resto lo complementamos después.</p>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Nombre completo *</label>
                  <input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Ej. Ana García López"
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder:text-muted-foreground focus:outline-none focus:border-violet-500/50 transition-colors"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">WhatsApp / Teléfono *</label>
                  <input
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="+52 55 1234 5678"
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder:text-muted-foreground focus:outline-none focus:border-violet-500/50 transition-colors"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Email *</label>
                  <input
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="ana@ejemplo.com"
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder:text-muted-foreground focus:outline-none focus:border-violet-500/50 transition-colors"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">¿Cómo llegó?</label>
                  <select
                    value={form.leadSource}
                    onChange={(e) => setForm({ ...form, leadSource: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-violet-500/50 transition-colors"
                  >
                    <option value="">Seleccionar origen</option>
                    {LEAD_SOURCES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                onClick={handleStep1}
                disabled={!form.name || !form.phone || !form.email}
                className={cn(
                  "flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-semibold transition-all",
                  form.name && form.phone && form.email
                    ? "bg-violet-600 hover:bg-violet-700 text-white"
                    : "bg-white/5 text-muted-foreground cursor-not-allowed"
                )}
              >
                Continuar <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="p-5 space-y-4">
              <div>
                <p className="font-semibold text-white">Asignar generación</p>
                <p className="text-xs text-muted-foreground mt-0.5">Elige a qué generación pertenecerá {form.name.split(" ")[0]}.</p>
              </div>

              <div className="space-y-2.5">
                {REGISTRATION_COHORTES.map((c) => {
                  const isSelected = selectedCohorte === c.id
                  const pctFull = Math.round((c.participants / c.capacity) * 100)
                  const urgency = c.available <= 10

                  return (
                    <button
                      key={c.id}
                      onClick={() => setSelectedCohorte(c.id)}
                      className={cn(
                        "w-full text-left p-4 rounded-xl border transition-all",
                        isSelected
                          ? "border-violet-500/60 bg-violet-500/10"
                          : "glass border-white/8 hover:border-white/20"
                      )}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="font-semibold text-white text-sm">{c.name}</p>
                            {urgency && (
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-500/20 text-red-400 font-semibold">
                                {c.available} cupos
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <AvatarBadge initials={c.coachAvatar} size="sm" />
                            <span className="text-xs text-muted-foreground">{c.coach} · {c.phaseDetail}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 flex-shrink-0">
                          <div className="text-right">
                            <p className={cn("text-sm font-bold", c.momentum >= 70 ? "text-green-400" : c.momentum >= 55 ? "text-yellow-400" : "text-red-400")}>
                              {c.momentum}%
                            </p>
                            <p className="text-[10px] text-muted-foreground">momentum</p>
                          </div>
                          {isSelected && <Check className="w-4 h-4 text-violet-400" />}
                        </div>
                      </div>
                      {/* Fill bar */}
                      <div className="mt-3 space-y-1">
                        <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                          <span className="flex items-center gap-1"><Users className="w-2.5 h-2.5" />{c.participants}/{c.capacity} participantes</span>
                          <span>{pctFull}% llena</span>
                        </div>
                        <div className="h-1 rounded-full bg-white/8 overflow-hidden">
                          <div
                            className={cn("h-full rounded-full", pctFull >= 90 ? "bg-red-500" : pctFull >= 75 ? "bg-yellow-500" : "bg-violet-500")}
                            style={{ width: `${pctFull}%` }}
                          />
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 py-2.5 rounded-xl glass text-sm text-muted-foreground hover:text-white transition-colors border border-white/8"
                >
                  Atrás
                </button>
                <button
                  onClick={handleStep2}
                  disabled={!selectedCohorte}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all",
                    selectedCohorte
                      ? "bg-violet-600 hover:bg-violet-700 text-white"
                      : "bg-white/5 text-muted-foreground cursor-not-allowed"
                  )}
                >
                  Asignar <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {step === 3 && cohorte && (
            <div className="p-5 space-y-4">
              <div>
                <p className="font-semibold text-white">Bienvenida automática</p>
                <p className="text-xs text-muted-foreground mt-0.5">ELEVA enviará este mensaje de bienvenida al crear el perfil.</p>
              </div>

              {/* WhatsApp preview */}
              <div className="bg-[#0a1f0f] border border-[#25D366]/20 rounded-xl overflow-hidden">
                <div className="flex items-center gap-2 px-3 py-2 bg-[#075E54]/40 border-b border-[#25D366]/15">
                  <div className="w-6 h-6 rounded-full bg-[#25D366] flex items-center justify-center">
                    <MessageCircle className="w-3 h-3 text-white" />
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold text-green-300">ELEVA · LEVEL</p>
                    <p className="text-[9px] text-green-400/60">Mensaje automático</p>
                  </div>
                </div>
                <div className="p-3">
                  <div className="bg-[#1a3a1a] rounded-xl rounded-tl-sm px-3 py-2.5 max-w-[90%] space-y-1">
                    <p className="text-xs text-green-100 leading-relaxed">
                      ¡Hola {form.name.split(" ")[0] || "Ana"}! 🎉 Bienvenida a <span className="font-semibold">LEVEL Transformación</span>.
                    </p>
                    <p className="text-xs text-green-100 leading-relaxed">
                      Tu perfil ya está listo en <span className="text-[#25D366]">{cohorte.name}</span> con {cohorte.coach} como tu coach.
                    </p>
                    <p className="text-xs text-green-100 leading-relaxed">
                      Tu primer paso: accede a ELEVA y completa tu perfil para que podamos personalizar tu experiencia. 👇
                    </p>
                    <p className="text-[#25D366] text-xs font-medium">creania.eleva.app/bienvenida</p>
                    <p className="text-[9px] text-green-400/50 text-right">Ahora mismo ✓✓</p>
                  </div>
                </div>
              </div>

              {/* Objective */}
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                  Objetivo inicial <span className="text-muted-foreground/60">(opcional — se puede completar después)</span>
                </label>
                <input
                  value={objective}
                  onChange={(e) => setObjective(e.target.value)}
                  placeholder="Ej. Independencia financiera, mejorar mis relaciones..."
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder:text-muted-foreground focus:outline-none focus:border-violet-500/50 transition-colors"
                />
              </div>

              <div className="space-y-2">
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold transition-all"
                >
                  {submitting ? (
                    <span className="flex items-center gap-2">
                      <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Creando perfil...
                    </span>
                  ) : (
                    <><Sparkles className="w-4 h-4" /> Crear perfil y enviar bienvenida</>
                  )}
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="w-full py-2.5 rounded-xl glass text-sm text-muted-foreground hover:text-white transition-colors border border-white/8"
                >
                  Completar datos después (vía WhatsApp)
                </button>
              </div>

              <button onClick={() => setStep(2)} className="w-full text-center text-xs text-muted-foreground hover:text-foreground transition-colors">
                ← Cambiar generación
              </button>
            </div>
          )}

          {step === "success" && (
            <div className="p-5 space-y-5 text-center">
              <div className="w-16 h-16 rounded-2xl bg-green-500/20 border border-green-500/30 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8 text-green-400" />
              </div>
              <div>
                <p className="font-bold text-white text-lg">Perfil creado</p>
                <p className="text-muted-foreground text-sm mt-1">
                  {form.name} ya está en {cohorte?.name || "la generación"}
                </p>
              </div>

              <div className="glass rounded-xl p-4 flex items-center gap-3 text-left border border-green-500/15">
                <div className="w-10 h-10 rounded-full bg-violet-600 flex items-center justify-center text-white font-bold flex-shrink-0">
                  {initials || "?"}
                </div>
                <div>
                  <p className="font-semibold text-white text-sm">{form.name}</p>
                  <p className="text-xs text-muted-foreground">{cohorte?.name} · Momentum: 0%</p>
                </div>
                <div className="ml-auto flex items-center gap-1 text-green-400 text-xs font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  WhatsApp enviado
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={onClose}
                  className="flex-1 py-2.5 rounded-xl glass text-sm text-muted-foreground hover:text-white transition-colors border border-white/8"
                >
                  Cerrar
                </button>
                <a
                  href="/vl2026/expediente"
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-sm font-semibold text-white transition-colors"
                >
                  Ver expediente <TrendingUp className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
