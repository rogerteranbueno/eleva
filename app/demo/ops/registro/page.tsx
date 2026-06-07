"use client"

import { useState } from "react"
import {
  Search,
  CheckCircle,
  Clock,
  UserPlus,
  AlertCircle,
  Users,
  MapPin,
  Calendar,
  ChevronDown,
  X,
  Zap,
  Info,
} from "lucide-react"
import { AvatarBadge } from "@/components/demo/AvatarBadge"
import { ActionToast, useActionToast } from "@/components/demo/ActionToast"
import { TODAY_EVENT, EVENT_CHECKIN_LIST } from "@/data/creania"
import { cn } from "@/lib/utils"

// ─── Ops Guide ────────────────────────────────────────────────────────────────

const STEPS = [
  { num: "1", icon: "🔍", title: "Busca", desc: "Por nombre o teléfono — filtra en tiempo real" },
  { num: "2", icon: "✅", title: "Confirma entrada", desc: 'Toca el botón verde "Entrada"' },
  { num: "3", icon: "✗", title: "Marca ausentes", desc: "Después de 30 min sin llegar" },
  { num: "4", icon: "➕", title: "Walk-in", desc: "Para quienes no están en la lista" },
]

const EFFECTS = [
  { emoji: "📈", action: "Entrada registrada", effect: "Suma al Momentum Score del participante en tiempo real" },
  { emoji: "🔔", action: "Ausencia marcada", effect: "Genera alerta automática al coach de su cohorte" },
  { emoji: "🗂️", action: "Walk-in registrado", effect: 'Se crea en CRM con estado "por completar" para seguimiento' },
  { emoji: "📊", action: "Asistencia general", effect: "El dueño lo ve en el panel del centro en vivo" },
]

function OpsGuide({ checkedIn, total }: { checkedIn: number; total: number }) {
  const [open, setOpen] = useState(true)

  return (
    <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/5 overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setOpen((p) => !p)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-cyan-500/5 transition-colors"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-lg bg-cyan-500/20 flex items-center justify-center flex-shrink-0">
            <Info className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="text-left">
            <p className="text-xs font-bold text-cyan-400">Guía de operación · Mesa de Registro</p>
            {!open && (
              <p className="text-[10px] text-muted-foreground">
                {checkedIn} entradas confirmadas · toca para ver el flujo
              </p>
            )}
          </div>
        </div>
        <ChevronDown className={cn("w-4 h-4 text-cyan-400 transition-transform", open && "rotate-180")} />
      </button>

      {open && (
        <div className="px-4 pb-4 space-y-4 border-t border-cyan-500/15">
          {/* Flow steps */}
          <div>
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold mt-3 mb-2.5">
              Flujo de registro
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {STEPS.map((s) => (
                <div key={s.num} className="bg-white/3 border border-white/6 rounded-xl p-3 space-y-1.5">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-black text-cyan-400 w-4">{s.num}</span>
                    <span className="text-base leading-none">{s.icon}</span>
                  </div>
                  <p className="text-xs font-bold text-white">{s.title}</p>
                  <p className="text-[10px] text-muted-foreground leading-snug">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Quick tips */}
          <div>
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold mb-2">
              Tips para ir rápido
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              {[
                "El buscador filtra al escribir — no necesitas Enter",
                "Busca por teléfono si el nombre tiene variaciones",
                "Los participantes con pago vencido tienen badge rojo — solo informa, no bloquea la entrada",
                "Si alguien tiene problemas con su pago, anota en CRM — no lo detengas en la puerta",
              ].map((tip, i) => (
                <div key={i} className="flex items-start gap-2">
                  <Zap className="w-3 h-3 text-cyan-400 flex-shrink-0 mt-0.5" />
                  <p className="text-[11px] text-muted-foreground leading-snug">{tip}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Data effects */}
          <div>
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold mb-2">
              Qué pasa con los datos que capturas
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              {EFFECTS.map((e) => (
                <div key={e.action} className="flex items-start gap-2 bg-white/2 rounded-lg px-2.5 py-2">
                  <span className="text-sm flex-shrink-0">{e.emoji}</span>
                  <div>
                    <p className="text-[10px] font-semibold text-white">{e.action}</p>
                    <p className="text-[10px] text-muted-foreground leading-snug">{e.effect}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

type AttendeeStatus = "pending" | "checked-in" | "absent"

interface Attendee {
  id: string
  name: string
  avatar: string
  phone: string
  confirmed: boolean
  checkedIn: boolean
  paymentStatus: "paid" | "pending" | "overdue"
  status: AttendeeStatus
}

function WalkInDrawer({ onClose, onAdd }: { onClose: () => void; onAdd: (name: string) => void }) {
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [step, setStep] = useState<"form" | "done">("form")

  function handleSubmit() {
    if (!name.trim()) return
    setStep("done")
    setTimeout(() => {
      onAdd(name.trim())
      onClose()
    }, 1500)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-md bg-[#14141f] border border-white/10 rounded-t-2xl md:rounded-2xl p-6 space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-white text-lg">Registro walk-in</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/5 text-muted-foreground">
            <X className="w-4 h-4" />
          </button>
        </div>

        {step === "form" ? (
          <>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-muted-foreground font-medium block mb-1.5">Nombre completo *</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ej. María González"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-muted-foreground focus:outline-none focus:border-violet-500/50"
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground font-medium block mb-1.5">WhatsApp</label>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+52 55 0000 0000"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-muted-foreground focus:outline-none focus:border-violet-500/50"
                />
              </div>
            </div>
            <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-lg p-3 text-xs text-cyan-300">
              Se le asignará acceso temporal al evento de hoy. El perfil completo se crea desde CRM.
            </div>
            <button
              onClick={handleSubmit}
              disabled={!name.trim()}
              className="w-full py-3 rounded-xl bg-cyan-600 hover:bg-cyan-700 disabled:opacity-40 text-white font-semibold text-sm transition-colors"
            >
              Registrar entrada
            </button>
          </>
        ) : (
          <div className="flex flex-col items-center gap-3 py-6">
            <CheckCircle className="w-12 h-12 text-green-400" />
            <p className="font-bold text-white text-lg">{name}</p>
            <p className="text-sm text-green-400 font-medium">Entrada registrada ✓</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default function RegistroPage() {
  const { toast, show, hide } = useActionToast()
  const [search, setSearch] = useState("")
  const [walkInOpen, setWalkInOpen] = useState(false)
  const [attendees, setAttendees] = useState<Attendee[]>(
    EVENT_CHECKIN_LIST.map((p) => ({ ...p, status: "pending" as AttendeeStatus }))
  )

  const checkedInCount = attendees.filter((a) => a.status === "checked-in").length
  const pendingCount   = attendees.filter((a) => a.status === "pending").length
  const walkInCount    = attendees.filter((a) => a.id.startsWith("walkin")).length

  const filtered = attendees.filter((a) =>
    a.name.toLowerCase().includes(search.toLowerCase()) ||
    a.phone.includes(search)
  )

  function checkIn(id: string) {
    setAttendees((prev) =>
      prev.map((a) => a.id === id ? { ...a, status: "checked-in", checkedIn: true } : a)
    )
    const name = attendees.find((a) => a.id === id)?.name ?? ""
    show(`${name} — entrada confirmada ✓`)
  }

  function markAbsent(id: string) {
    setAttendees((prev) =>
      prev.map((a) => a.id === id ? { ...a, status: "absent" } : a)
    )
  }

  function addWalkIn(name: string) {
    const newId = `walkin-${Date.now()}`
    setAttendees((prev) => [
      ...prev,
      {
        id: newId,
        name,
        avatar: name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase(),
        phone: "—",
        confirmed: false,
        checkedIn: true,
        paymentStatus: "pending",
        status: "checked-in",
      },
    ])
    show(`${name} — walk-in registrado ✓`)
  }

  return (
    <div className="p-5 max-w-2xl mx-auto space-y-5">
      {/* Staff header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Mesa de Registro</h1>
          <p className="text-muted-foreground text-xs mt-0.5">Karla Ríos · Staff Creania CDMX</p>
        </div>
        <button
          onClick={() => setWalkInOpen(true)}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-semibold transition-colors"
        >
          <UserPlus className="w-3.5 h-3.5" />
          Walk-in
        </button>
      </div>

      {/* Ops guide */}
      <OpsGuide checkedIn={checkedInCount} total={attendees.length} />

      {/* Event card */}
      <div className="glass rounded-xl p-4 space-y-3">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-violet-500/20 flex items-center justify-center flex-shrink-0">
            <Calendar className="w-5 h-5 text-violet-400" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-white text-sm">{TODAY_EVENT.name}</p>
            <div className="flex items-center gap-3 mt-1 flex-wrap">
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="w-3 h-3" />
                {TODAY_EVENT.time}
              </span>
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin className="w-3 h-3" />
                {TODAY_EVENT.location}
              </span>
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-4 gap-2 pt-1 border-t border-white/5">
          <div className="text-center">
            <p className="text-lg font-black text-white">{TODAY_EVENT.expectedAttendees}</p>
            <p className="text-[10px] text-muted-foreground">Esperados</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-black text-cyan-400">{TODAY_EVENT.registeredCount}</p>
            <p className="text-[10px] text-muted-foreground">Confirmados</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-black text-green-400">{checkedInCount}</p>
            <p className="text-[10px] text-muted-foreground">En sala</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-black text-yellow-400">{walkInCount}</p>
            <p className="text-[10px] text-muted-foreground">Walk-ins</p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="space-y-1">
          <div className="flex justify-between text-[10px] text-muted-foreground">
            <span>Progreso de entrada</span>
            <span>{checkedInCount} / {attendees.length}</span>
          </div>
          <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
            <div
              className="h-full rounded-full bg-green-500 transition-all duration-500"
              style={{ width: `${(checkedInCount / Math.max(attendees.length, 1)) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por nombre o teléfono..."
          className="w-full pl-9 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder:text-muted-foreground focus:outline-none focus:border-violet-500/40 transition-colors"
        />
      </div>

      {/* Attendee list */}
      <div className="space-y-2">
        {/* Checked-in first, then pending, then absent */}
        {(["checked-in", "pending", "absent"] as AttendeeStatus[]).map((statusGroup) => {
          const group = filtered.filter((a) => a.status === statusGroup)
          if (group.length === 0) return null
          return (
            <div key={statusGroup}>
              <p className={cn(
                "text-[10px] uppercase tracking-widest font-medium px-1 mb-2",
                statusGroup === "checked-in" ? "text-green-400" :
                statusGroup === "pending"    ? "text-muted-foreground" :
                "text-red-400/60"
              )}>
                {statusGroup === "checked-in" ? `En sala (${group.length})` :
                 statusGroup === "pending"    ? `Pendientes (${group.length})` :
                 `Ausentes (${group.length})`}
              </p>
              <div className="space-y-2">
                {group.map((attendee) => (
                  <AttendeeRow
                    key={attendee.id}
                    attendee={attendee}
                    onCheckIn={() => checkIn(attendee.id)}
                    onAbsent={() => markAbsent(attendee.id)}
                  />
                ))}
              </div>
            </div>
          )
        })}
        {filtered.length === 0 && (
          <div className="text-center py-10 text-muted-foreground text-sm">
            No se encontraron participantes
          </div>
        )}
      </div>

      {walkInOpen && (
        <WalkInDrawer onClose={() => setWalkInOpen(false)} onAdd={addWalkIn} />
      )}
      <ActionToast message={toast.message} visible={toast.visible} onHide={hide} />
    </div>
  )
}

function AttendeeRow({
  attendee,
  onCheckIn,
  onAbsent,
}: {
  attendee: Attendee
  onCheckIn: () => void
  onAbsent: () => void
}) {
  return (
    <div className={cn(
      "glass rounded-xl p-3 flex items-center gap-3 transition-all",
      attendee.status === "checked-in" && "border border-green-500/20 bg-green-500/5",
      attendee.status === "absent"     && "opacity-50"
    )}>
      <AvatarBadge
        initials={attendee.avatar}
        size="sm"
        color={attendee.status === "checked-in" ? "auto" : "auto"}
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-sm font-semibold text-white truncate">{attendee.name}</p>
          {attendee.paymentStatus === "overdue" && (
            <span className="flex-shrink-0 flex items-center gap-0.5 text-[10px] text-red-400 font-medium">
              <AlertCircle className="w-2.5 h-2.5" />
              Pago vencido
            </span>
          )}
          {attendee.paymentStatus === "pending" && attendee.id.startsWith("walkin") && (
            <span className="flex-shrink-0 text-[10px] text-yellow-400 font-medium">Walk-in</span>
          )}
        </div>
        <p className="text-xs text-muted-foreground">{attendee.phone}</p>
      </div>

      {attendee.status === "checked-in" ? (
        <div className="flex items-center gap-1.5 text-green-400 text-xs font-semibold flex-shrink-0">
          <CheckCircle className="w-4 h-4" />
          En sala
        </div>
      ) : attendee.status === "absent" ? (
        <span className="text-xs text-red-400/60 flex-shrink-0">Ausente</span>
      ) : (
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={onAbsent}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-red-400 hover:bg-red-500/10 transition-colors"
            title="Marcar ausente"
          >
            <X className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onCheckIn}
            className="px-3 py-1.5 rounded-lg bg-green-600 hover:bg-green-700 text-white text-xs font-semibold transition-colors"
          >
            Entrada
          </button>
        </div>
      )}
    </div>
  )
}
