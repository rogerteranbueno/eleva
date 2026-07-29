"use client"

import { useState } from "react"
import { X, ChevronRight, CreditCard, Lock, CheckCircle, Users, Zap, Heart } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

type Step = "contact" | "registro" | "pago" | "exito"

interface ContactData {
  name: string
  whatsapp: string
  email: string
  relation: string
}

interface RegistroData {
  birthdate: string
  city: string
  occupation: string
  emergencyName: string
  emergencyPhone: string
  emergencyRelation: string
}

interface PagoData {
  cardNumber: string
  cardName: string
  expiry: string
  cvv: string
}

const RELATIONS = ["Amigo/a", "Familiar", "Compañero/a de trabajo", "Conocido/a", "Otro"]

const PRICE = 7700

function fmt(n: number) {
  return `$${n.toLocaleString("es-MX")} MXN`
}

function formatCard(raw: string) {
  return raw.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim()
}

function formatExpiry(raw: string) {
  const digits = raw.replace(/\D/g, "").slice(0, 4)
  if (digits.length >= 3) return `${digits.slice(0, 2)}/${digits.slice(2)}`
  return digits
}

// ─── Step indicators ─────────────────────────────────────────────────────────

const STEPS: { id: Step; label: string }[] = [
  { id: "contact",  label: "Enrolado" },
  { id: "registro", label: "Registro" },
  { id: "pago",     label: "Pago" },
  { id: "exito",    label: "Listo" },
]

function StepBar({ current }: { current: Step }) {
  const idx = STEPS.findIndex((s) => s.id === current)
  return (
    <div className="flex items-center gap-0 w-full">
      {STEPS.map((s, i) => {
        const done = i < idx
        const active = i === idx
        return (
          <div key={s.id} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-1">
              <div className={cn(
                "w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black transition-all",
                done   ? "bg-violet-500 text-white" :
                active ? "bg-violet-600 text-white ring-2 ring-violet-400/40" :
                         "bg-white/8 text-muted-foreground"
              )}>
                {done ? "✓" : i + 1}
              </div>
              <span className={cn(
                "text-[9px] font-medium transition-colors whitespace-nowrap",
                active ? "text-violet-400" : done ? "text-violet-400/60" : "text-muted-foreground"
              )}>{s.label}</span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={cn(
                "flex-1 h-px mx-1.5 mb-3.5 transition-colors",
                done ? "bg-violet-500/60" : "bg-white/8"
              )} />
            )}
          </div>
        )
      })}
    </div>
  )
}

// ─── Field wrapper ────────────────────────────────────────────────────────────

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs text-muted-foreground font-medium block">
        {label} {required && <span className="text-violet-400">*</span>}
      </label>
      {children}
    </div>
  )
}

const inputCls = "w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-muted-foreground/50 focus:outline-none focus:border-violet-500/50 transition-colors"

// ─── Steps ────────────────────────────────────────────────────────────────────

function ContactStep({ data, onChange, onNext }: {
  data: ContactData
  onChange: (d: ContactData) => void
  onNext: () => void
}) {
  const valid = data.name.trim() && data.whatsapp.trim() && data.email.trim()
  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <p className="text-sm font-bold text-white">¿A quién quieres enrolar?</p>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Esta persona se registrará en el próximo <strong className="text-white">Entrenamiento 1 Básico</strong> y comenzará su proceso de transformación.
        </p>
      </div>

      <Field label="Nombre completo" required>
        <input
          value={data.name}
          onChange={(e) => onChange({ ...data, name: e.target.value })}
          placeholder="Ej. María González"
          className={inputCls}
        />
      </Field>

      <Field label="WhatsApp" required>
        <input
          value={data.whatsapp}
          onChange={(e) => onChange({ ...data, whatsapp: e.target.value })}
          placeholder="+52 55 0000 0000"
          type="tel"
          className={inputCls}
        />
      </Field>

      <Field label="Email" required>
        <input
          value={data.email}
          onChange={(e) => onChange({ ...data, email: e.target.value })}
          placeholder="maria@ejemplo.com"
          type="email"
          className={inputCls}
        />
      </Field>

      <Field label="¿Cómo la/lo conoces?">
        <div className="flex flex-wrap gap-1.5">
          {RELATIONS.map((r) => (
            <button
              key={r}
              onClick={() => onChange({ ...data, relation: r })}
              className={cn(
                "px-2.5 py-1 rounded-full text-[11px] font-medium border transition-colors",
                data.relation === r
                  ? "bg-violet-600/30 border-violet-500/50 text-violet-300"
                  : "bg-white/4 border-white/8 text-muted-foreground hover:border-white/20"
              )}
            >
              {r}
            </button>
          ))}
        </div>
      </Field>

      <button
        onClick={onNext}
        disabled={!valid}
        className="w-full py-3 rounded-xl bg-violet-600 hover:bg-violet-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold text-sm transition-colors flex items-center justify-center gap-2"
      >
        Continuar al registro
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  )
}

function RegistroStep({ contact, data, onChange, onNext, onBack }: {
  contact: ContactData
  data: RegistroData
  onChange: (d: RegistroData) => void
  onNext: () => void
  onBack: () => void
}) {
  const valid = data.birthdate && data.city.trim() && data.emergencyName.trim() && data.emergencyPhone.trim()
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2.5 p-3 rounded-xl bg-violet-500/10 border border-violet-500/20">
        <div className="w-8 h-8 rounded-full bg-violet-500/20 flex items-center justify-center text-sm font-black text-violet-300">
          {contact.name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase()}
        </div>
        <div>
          <p className="text-xs font-semibold text-white">{contact.name}</p>
          <p className="text-[10px] text-violet-400">Entrenamiento 1 Básico · {fmt(PRICE)}</p>
        </div>
      </div>

      <Field label="Fecha de nacimiento" required>
        <input
          value={data.birthdate}
          onChange={(e) => onChange({ ...data, birthdate: e.target.value })}
          type="date"
          className={cn(inputCls, "text-white [color-scheme:dark]")}
        />
      </Field>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Ciudad" required>
          <input
            value={data.city}
            onChange={(e) => onChange({ ...data, city: e.target.value })}
            placeholder="Ciudad de México"
            className={inputCls}
          />
        </Field>
        <Field label="Ocupación">
          <input
            value={data.occupation}
            onChange={(e) => onChange({ ...data, occupation: e.target.value })}
            placeholder="Ej. Empresaria"
            className={inputCls}
          />
        </Field>
      </div>

      <div className="space-y-1.5">
        <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">Contacto de emergencia</p>
        <div className="space-y-2 p-3 rounded-xl bg-white/3 border border-white/6">
          <Field label="Nombre completo" required>
            <input
              value={data.emergencyName}
              onChange={(e) => onChange({ ...data, emergencyName: e.target.value })}
              placeholder="Nombre del contacto"
              className={inputCls}
            />
          </Field>
          <div className="grid grid-cols-2 gap-2">
            <Field label="Teléfono" required>
              <input
                value={data.emergencyPhone}
                onChange={(e) => onChange({ ...data, emergencyPhone: e.target.value })}
                placeholder="+52 55 0000 0000"
                type="tel"
                className={inputCls}
              />
            </Field>
            <Field label="Relación">
              <input
                value={data.emergencyRelation}
                onChange={(e) => onChange({ ...data, emergencyRelation: e.target.value })}
                placeholder="Mamá, esposo/a..."
                className={inputCls}
              />
            </Field>
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={onBack}
          className="px-4 py-3 rounded-xl border border-white/10 text-muted-foreground hover:text-white hover:border-white/20 text-sm font-medium transition-colors"
        >
          Atrás
        </button>
        <button
          onClick={onNext}
          disabled={!valid}
          className="flex-1 py-3 rounded-xl bg-violet-600 hover:bg-violet-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold text-sm transition-colors flex items-center justify-center gap-2"
        >
          Continuar al pago
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

function PagoStep({ contact, data, onChange, onPay, onBack, paying }: {
  contact: ContactData
  data: PagoData
  onChange: (d: PagoData) => void
  onPay: () => void
  onBack: () => void
  paying: boolean
}) {
  const valid = data.cardNumber.replace(/\s/g, "").length === 16 && data.cardName.trim() && data.expiry.length === 5 && data.cvv.length >= 3

  return (
    <div className="space-y-4">
      {/* Order summary */}
      <div className="rounded-xl bg-white/3 border border-white/8 p-4 space-y-3">
        <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">Resumen de pago</p>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-white">Entrenamiento 1 · Básico</p>
            <p className="text-xs text-muted-foreground mt-0.5">Para {contact.name}</p>
          </div>
          <p className="text-xl font-black text-white">{fmt(PRICE)}</p>
        </div>
        <div className="h-px bg-white/6" />
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Total a cobrar</span>
          <span className="text-white font-semibold">{fmt(PRICE)}</span>
        </div>
      </div>

      {/* Card form */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <CreditCard className="w-4 h-4 text-muted-foreground" />
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Datos de tarjeta</p>
          <Lock className="w-3 h-3 text-muted-foreground ml-auto" />
          <span className="text-[10px] text-muted-foreground">Pago seguro</span>
        </div>

        <Field label="Número de tarjeta" required>
          <div className="relative">
            <input
              value={data.cardNumber}
              onChange={(e) => onChange({ ...data, cardNumber: formatCard(e.target.value) })}
              placeholder="1234 5678 9012 3456"
              maxLength={19}
              className={cn(inputCls, "pr-12 font-mono tracking-widest")}
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/40 text-xs">
              {data.cardNumber.replace(/\s/g, "").length > 0
                ? data.cardNumber.replace(/\s/g, "").startsWith("4") ? "VISA" : "MC"
                : ""}
            </span>
          </div>
        </Field>

        <Field label="Nombre en la tarjeta" required>
          <input
            value={data.cardName}
            onChange={(e) => onChange({ ...data, cardName: e.target.value.toUpperCase() })}
            placeholder="MARIA GONZALEZ"
            className={cn(inputCls, "uppercase tracking-wider")}
          />
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Vencimiento" required>
            <input
              value={data.expiry}
              onChange={(e) => onChange({ ...data, expiry: formatExpiry(e.target.value) })}
              placeholder="MM/AA"
              maxLength={5}
              className={cn(inputCls, "font-mono")}
            />
          </Field>
          <Field label="CVV" required>
            <input
              value={data.cvv}
              onChange={(e) => onChange({ ...data, cvv: e.target.value.replace(/\D/g, "").slice(0, 4) })}
              placeholder="123"
              maxLength={4}
              type="password"
              className={cn(inputCls, "font-mono")}
            />
          </Field>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={onBack}
          disabled={paying}
          className="px-4 py-3 rounded-xl border border-white/10 text-muted-foreground hover:text-white hover:border-white/20 text-sm font-medium transition-colors disabled:opacity-40"
        >
          Atrás
        </button>
        <button
          onClick={onPay}
          disabled={!valid || paying}
          className="flex-1 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-violet-500 hover:from-violet-700 hover:to-violet-600 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-violet-500/20"
        >
          {paying ? (
            <>
              <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
              Procesando...
            </>
          ) : (
            <>
              <Lock className="w-4 h-4" />
              Pagar {fmt(PRICE)}
            </>
          )}
        </button>
      </div>

      <p className="text-center text-[10px] text-muted-foreground/60">
        🔒 Pago procesado de forma segura. No almacenamos datos de tu tarjeta.
      </p>
    </div>
  )
}

function ExitoStep({ contact, onClose, onSendWelcome }: {
  contact: ContactData
  onClose: () => void
  onSendWelcome: () => void
}) {
  const [welcomed, setWelcomed] = useState(false)
  const firstName = contact.name.split(" ")[0]

  return (
    <div className="flex flex-col items-center text-center gap-5 py-4">
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 18 }}
        className="w-20 h-20 rounded-full bg-green-500/15 border border-green-500/30 flex items-center justify-center"
      >
        <CheckCircle className="w-10 h-10 text-green-400" />
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="space-y-1.5">
        <p className="text-xl font-black text-white">{firstName} está registrada ✓</p>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Pago de {fmt(PRICE)} procesado. Recibirá su confirmación y acceso al grupo de WhatsApp del Entrenamiento 1.
        </p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="w-full space-y-2">
        <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-violet-500/10 border border-violet-500/20 text-sm">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-violet-400" />
            <span className="text-muted-foreground">Tu enrolado en este programa</span>
          </div>
          <span className="font-black text-violet-300 text-lg">#1</span>
        </div>
        <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-sm">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-cyan-400" />
            <span className="text-muted-foreground">Tu momentum sube por este impacto</span>
          </div>
          <span className="font-black text-cyan-300 text-lg">+8 pts</span>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="w-full space-y-2">
        {!welcomed ? (
          <button
            onClick={() => { setWelcomed(true); onSendWelcome() }}
            className="w-full py-3 rounded-xl bg-green-600 hover:bg-green-700 text-white font-semibold text-sm transition-colors flex items-center justify-center gap-2"
          >
            <Heart className="w-4 h-4" />
            Enviar mensaje de bienvenida a {firstName}
          </button>
        ) : (
          <div className="w-full py-3 rounded-xl border border-green-500/30 text-green-400 text-sm font-semibold flex items-center justify-center gap-2">
            <CheckCircle className="w-4 h-4" />
            Mensaje de bienvenida enviado ✓
          </div>
        )}
        <button
          onClick={onClose}
          className="w-full py-3 rounded-xl border border-white/10 text-muted-foreground hover:text-white hover:border-white/20 text-sm font-medium transition-colors"
        >
          Cerrar
        </button>
      </motion.div>
    </div>
  )
}

// ─── Main drawer ──────────────────────────────────────────────────────────────

interface InvitarDrawerProps {
  onClose: () => void
  onSuccess: (name: string) => void
}

export function InvitarDrawer({ onClose, onSuccess }: InvitarDrawerProps) {
  const [step, setStep] = useState<Step>("contact")
  const [paying, setPaying] = useState(false)

  const [contact, setContact] = useState<ContactData>({ name: "", whatsapp: "", email: "", relation: "" })
  const [registro, setRegistro] = useState<RegistroData>({
    birthdate: "", city: "", occupation: "",
    emergencyName: "", emergencyPhone: "", emergencyRelation: "",
  })
  const [pago, setPago] = useState<PagoData>({ cardNumber: "", cardName: "", expiry: "", cvv: "" })

  function handlePay() {
    setPaying(true)
    setTimeout(() => {
      setPaying(false)
      setStep("exito")
    }, 2200)
  }

  const titles: Record<Step, string> = {
    contact: "Invitar a alguien",
    registro: "Datos de registro",
    pago: "Pago seguro",
    exito: "¡Enrolado exitoso!",
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 60, opacity: 0 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="w-full max-w-md bg-[#12121e] border border-white/10 rounded-t-2xl md:rounded-2xl shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-3">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-violet-400 font-semibold">Programa de Liderazgo</p>
            <h2 className="text-base font-bold text-white">{titles[step]}</h2>
          </div>
          {step !== "exito" && (
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/5 text-muted-foreground">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Step bar */}
        {step !== "exito" && (
          <div className="px-5 pb-4">
            <StepBar current={step} />
          </div>
        )}

        {/* Content */}
        <div className="px-5 pb-6 max-h-[75vh] overflow-y-auto">
          <AnimatePresence mode="wait">
            {step === "contact" && (
              <motion.div key="contact" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.18 }}>
                <ContactStep data={contact} onChange={setContact} onNext={() => setStep("registro")} />
              </motion.div>
            )}
            {step === "registro" && (
              <motion.div key="registro" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.18 }}>
                <RegistroStep contact={contact} data={registro} onChange={setRegistro} onNext={() => setStep("pago")} onBack={() => setStep("contact")} />
              </motion.div>
            )}
            {step === "pago" && (
              <motion.div key="pago" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.18 }}>
                <PagoStep contact={contact} data={pago} onChange={setPago} onPay={handlePay} onBack={() => setStep("registro")} paying={paying} />
              </motion.div>
            )}
            {step === "exito" && (
              <motion.div key="exito" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.18 }}>
                <ExitoStep contact={contact} onClose={onClose} onSendWelcome={() => onSuccess(contact.name)} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  )
}
