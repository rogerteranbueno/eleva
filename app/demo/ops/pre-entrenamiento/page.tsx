"use client"

import { useState } from "react"
import {
  Calendar,
  CheckCircle,
  Clock,
  MessageSquare,
  Phone,
  RefreshCw,
  Users,
  AlertCircle,
  ChevronRight,
  Zap,
} from "lucide-react"
import { AvatarBadge } from "@/components/demo/AvatarBadge"
import { ActionToast, useActionToast } from "@/components/demo/ActionToast"
import { PRE_TRAINING_PENDING, type PreTrainingPending } from "@/data/creania"
import { cn } from "@/lib/utils"

// ─── Helpers ──────────────────────────────────────────────────────────────────

function ContactDots({ attempts }: { attempts: number }) {
  return (
    <div className="flex items-center gap-0.5" title={`${attempts} intento(s) de contacto`}>
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className={cn(
            "w-1.5 h-1.5 rounded-full",
            i < attempts ? "bg-yellow-400" : "bg-white/10"
          )}
        />
      ))}
    </div>
  )
}

// ─── Row ─────────────────────────────────────────────────────────────────────

function PreTrainingRow({
  person,
  onConfirm,
  onContact,
}: {
  person: PreTrainingPending
  onConfirm: (id: string) => void
  onContact: (id: string) => void
}) {
  return (
    <div className={cn(
      "glass rounded-xl p-3.5 space-y-3 transition-all",
      person.confirmed && "border border-green-500/20 bg-green-500/5"
    )}>
      {/* Top row */}
      <div className="flex items-start gap-3">
        <AvatarBadge initials={person.avatar} size="sm" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-sm font-semibold text-white">{person.name}</p>
            {person.confirmed ? (
              <span className="flex items-center gap-1 text-[10px] text-green-400 font-semibold">
                <CheckCircle className="w-3 h-3" /> Confirmado
              </span>
            ) : (
              <span className="flex items-center gap-1 text-[10px] text-yellow-400 font-semibold">
                <AlertCircle className="w-3 h-3" /> Pendiente
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
              <span className="text-[10px]">Inscrito por</span>
              <AvatarBadge initials={person.enrolledByAvatar} size="xs" />
              <span className="font-medium text-white/70">{person.enrolledBy}</span>
            </span>
            <span className="text-[10px] text-muted-foreground">·</span>
            <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
              <Calendar className="w-2.5 h-2.5" />
              Inscrito {person.enrollDate}
            </span>
          </div>
        </div>
      </div>

      {/* Middle info */}
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-muted-foreground">
            <Clock className="w-3 h-3" />
            Entrenamiento {person.trainingDate}
          </span>
          <span className={cn(
            "font-semibold",
            person.daysUntilTraining <= 3 ? "text-red-400" :
            person.daysUntilTraining <= 5 ? "text-yellow-400" :
            "text-cyan-400"
          )}>
            {person.daysUntilTraining}d
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-muted-foreground">Intentos:</span>
          <ContactDots attempts={person.contactAttempts} />
        </div>
      </div>

      {/* Phone */}
      <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
        <Phone className="w-3 h-3" />
        {person.phone}
      </div>

      {/* Actions */}
      {!person.confirmed && (
        <div className="flex gap-2 pt-0.5">
          <button
            onClick={() => onContact(person.id)}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-cyan-600/15 hover:bg-cyan-600/25 border border-cyan-500/20 text-cyan-400 text-xs font-semibold transition-colors"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            Enviar WA
          </button>
          <button
            onClick={() => onConfirm(person.id)}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white text-xs font-semibold transition-colors"
          >
            <CheckCircle className="w-3.5 h-3.5" />
            Marcar confirmado
          </button>
        </div>
      )}
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function PreEntrenamientoPage() {
  const { toast, show, hide } = useActionToast()
  const [people, setPeople] = useState<PreTrainingPending[]>(
    // Sort: unconfirmed first, then by days until training ascending
    [...PRE_TRAINING_PENDING].sort((a, b) => {
      if (a.confirmed !== b.confirmed) return a.confirmed ? 1 : -1
      return a.daysUntilTraining - b.daysUntilTraining
    })
  )

  const confirmed = people.filter((p) => p.confirmed).length
  const pending   = people.filter((p) => !p.confirmed).length
  const total     = people.length
  const revenue   = total * PRE_TRAINING_PENDING[0].price

  function handleConfirm(id: string) {
    const name = people.find((p) => p.id === id)?.name ?? ""
    setPeople((prev) => prev.map((p) => p.id === id ? { ...p, confirmed: true } : p))
    show(`${name} — confirmado para el Despertar ✓`)
  }

  function handleContact(id: string) {
    const person = people.find((p) => p.id === id)
    if (!person) return
    setPeople((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, contactAttempts: Math.min(3, p.contactAttempts + 1) } : p
      )
    )
    show(`WhatsApp enviado a ${person.name} ✓`)
  }

  function handleBulkContact() {
    const pendingPeople = people.filter((p) => !p.confirmed)
    setPeople((prev) =>
      prev.map((p) =>
        !p.confirmed ? { ...p, contactAttempts: Math.min(3, p.contactAttempts + 1) } : p
      )
    )
    show(`WhatsApp de confirmación enviado a ${pendingPeople.length} personas ✓`)
  }

  const pct = Math.round((confirmed / Math.max(total, 1)) * 100)

  return (
    <div className="p-5 max-w-2xl mx-auto space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-white">Pre-entrenamiento</h1>
        <p className="text-muted-foreground text-xs mt-0.5">
          Próximo Despertar · 13 jun · seguimiento de inscritos
        </p>
      </div>

      {/* Stats */}
      <div className="glass rounded-xl p-4 space-y-3">
        <div className="grid grid-cols-4 gap-2 text-center">
          <div>
            <p className="text-2xl font-black text-white">{total}</p>
            <p className="text-[9px] text-muted-foreground">Inscritos</p>
          </div>
          <div>
            <p className="text-2xl font-black text-green-400">{confirmed}</p>
            <p className="text-[9px] text-muted-foreground">Confirmados</p>
          </div>
          <div>
            <p className="text-2xl font-black text-yellow-400">{pending}</p>
            <p className="text-[9px] text-muted-foreground">Pendientes</p>
          </div>
          <div>
            <p className="text-2xl font-black text-violet-400">
              ${(revenue / 1000).toFixed(0)}k
            </p>
            <p className="text-[9px] text-muted-foreground">Potencial</p>
          </div>
        </div>

        {/* Progress */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-[10px] text-muted-foreground">
            <span>Confirmaciones</span>
            <span>{confirmed} / {total} · {pct}%</span>
          </div>
          <div className="h-2 rounded-full bg-white/5 overflow-hidden">
            <div
              className="h-full rounded-full bg-green-500 transition-all duration-700"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
      </div>

      {/* Bulk action */}
      {pending > 0 && (
        <div className="flex items-center gap-3 p-3 rounded-xl border border-yellow-500/20 bg-yellow-500/5">
          <Zap className="w-4 h-4 text-yellow-400 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-white">
              {pending} personas aún no han confirmado
            </p>
            <p className="text-[10px] text-muted-foreground">Envía un recordatorio masivo por WhatsApp</p>
          </div>
          <button
            onClick={handleBulkContact}
            className="flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-lg bg-yellow-600/20 hover:bg-yellow-600/30 border border-yellow-500/30 text-yellow-300 text-xs font-semibold transition-colors"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            Enviar a todos
          </button>
        </div>
      )}

      {/* Pending first */}
      {pending > 0 && (
        <div className="space-y-2">
          <p className="text-[10px] uppercase tracking-widest text-yellow-400 font-semibold px-1">
            Sin confirmar ({pending})
          </p>
          {people
            .filter((p) => !p.confirmed)
            .map((person) => (
              <PreTrainingRow
                key={person.id}
                person={person}
                onConfirm={handleConfirm}
                onContact={handleContact}
              />
            ))}
        </div>
      )}

      {/* Confirmed */}
      {confirmed > 0 && (
        <div className="space-y-2">
          <p className="text-[10px] uppercase tracking-widest text-green-400 font-semibold px-1">
            Confirmados ({confirmed})
          </p>
          {people
            .filter((p) => p.confirmed)
            .map((person) => (
              <PreTrainingRow
                key={person.id}
                person={person}
                onConfirm={handleConfirm}
                onContact={handleContact}
              />
            ))}
        </div>
      )}

      <ActionToast message={toast.message} visible={toast.visible} onHide={hide} />
    </div>
  )
}
