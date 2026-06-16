"use client"

import { useState, useMemo } from "react"
import {
  Search, CheckCircle, X, UserPlus, AlertCircle, Clock, Ticket,
  MessageCircle, Phone, Bell, ChevronRight, ArrowRight, CheckCircle2,
  AlertTriangle, XCircle, Star, Users, DollarSign, FileText,
  ClipboardList, Activity, Shield, RotateCcw, Send, Zap, Info,
  Building2, CircleDot, CalendarCheck, User, History,
} from "lucide-react"
import { AvatarBadge } from "@/components/demo/AvatarBadge"
import { ActionToast, useActionToast } from "@/components/demo/ActionToast"
import {
  OPS_PARTICIPANTS, TODAY_EVENT,
  type OpsParticipant, type OpsAttendanceStatus, type OpsPaymentStatus,
} from "@/data/level"
import { cn } from "@/lib/utils"

// ─── Config maps ──────────────────────────────────────────────────────────────

const ATTENDANCE_CFG: Record<OpsAttendanceStatus, { label: string; color: string; dot: string }> = {
  "checkedin":   { label: "En sala",    color: "text-green-400",         dot: "bg-green-400" },
  "confirmado":  { label: "Confirmado", color: "text-cyan-400",          dot: "bg-cyan-400" },
  "pendiente":   { label: "Esperado",   color: "text-yellow-400",        dot: "bg-yellow-400" },
  "no-show":     { label: "No llegó",   color: "text-red-400",           dot: "bg-red-400" },
  "walk-in":     { label: "Walk-in",    color: "text-violet-400",        dot: "bg-violet-400" },
  "no-aplica":   { label: "—",          color: "text-muted-foreground",  dot: "bg-muted-foreground/30" },
}

const PAYMENT_CFG: Record<OpsPaymentStatus, { label: string; color: string; bg: string }> = {
  "pagado":    { label: "Pagado",    color: "text-green-400",  bg: "bg-green-500/10 border-green-500/25" },
  "parcial":   { label: "Parcial",   color: "text-yellow-400", bg: "bg-yellow-500/10 border-yellow-500/25" },
  "pendiente": { label: "Pendiente", color: "text-orange-400", bg: "bg-orange-500/10 border-orange-500/25" },
  "vencido":   { label: "Vencido",   color: "text-red-400",    bg: "bg-red-500/10 border-red-500/25" },
}

const NEXT_TRAIN_CFG = {
  "inscrito":      { label: "Inscrito",      color: "text-green-400" },
  "confirmado":    { label: "Confirmado",    color: "text-cyan-400" },
  "sin-confirmar": { label: "Sin confirmar", color: "text-yellow-400" },
  "duda":          { label: "En duda",       color: "text-orange-400" },
  "cancelado":     { label: "Cancelado",     color: "text-red-400" },
  "reagendado":    { label: "Reagendado",    color: "text-violet-400" },
}

const OVERALL_CFG = {
  "activo":             { label: "Activo",        color: "text-green-400",  bg: "bg-green-500/10 border-green-500/25" },
  "vip":                { label: "Destacado",      color: "text-amber-400",  bg: "bg-amber-500/10 border-amber-500/25" },
  "inscrito-siguiente": { label: "Próx. nivel",   color: "text-cyan-400",   bg: "bg-cyan-500/10 border-cyan-500/25" },
  "seguimiento":        { label: "Seguimiento",    color: "text-violet-400", bg: "bg-violet-500/10 border-violet-500/25" },
  "incidencia":         { label: "Incidencia",     color: "text-red-400",    bg: "bg-red-500/10 border-red-500/25" },
  "cancelado":          { label: "Cancelado",      color: "text-muted-foreground", bg: "bg-foreground/[0.05] border-border" },
}

type FilterKey = "todos" | "checkin-hoy" | "pago-vencido" | "sin-confirmar" | "incidencias" | "beca" | "leads" | "proximo-nivel"

const FILTERS: Array<{ key: FilterKey; label: string; icon: React.ElementType }> = [
  { key: "todos",          label: "Todos",            icon: Users },
  { key: "checkin-hoy",    label: "Hoy en sala",      icon: CheckCircle2 },
  { key: "pago-vencido",   label: "Pago vencido",     icon: AlertCircle },
  { key: "sin-confirmar",  label: "Sin confirmar",    icon: Clock },
  { key: "incidencias",    label: "Incidencias",      icon: AlertTriangle },
  { key: "beca",           label: "Beca / descuento", icon: Ticket },
  { key: "leads",          label: "Leads / invitados",icon: UserPlus },
  { key: "proximo-nivel",  label: "Próximo nivel",    icon: ArrowRight },
]

type DetailTab = "resumen" | "pagos" | "enrolamiento" | "incidencias" | "notas"

// ─── Quick action buttons ──────────────────────────────────────────────────────

function QuickActions({ p, onAction }: { p: OpsParticipant; onAction: (msg: string) => void }) {
  const actions = [
    ...(p.todayStatus === "pendiente" || p.todayStatus === "confirmado" ? [
      { label: "Registrar llegada", icon: CheckCircle2, color: "bg-green-600 hover:bg-green-700 text-white", action: () => onAction(`${p.name} — entrada confirmada ✓`) },
    ] : []),
    ...(p.todayStatus !== "no-aplica" && p.todayStatus !== "checkedin" ? [
      { label: "Marcar no-show",   icon: XCircle,      color: "bg-red-500/15 hover:bg-red-500/25 text-red-400 border border-red-500/30", action: () => onAction(`${p.name} marcado como ausente`) },
    ] : []),
    { label: "Enviar WhatsApp", icon: MessageCircle, color: "bg-green-500/10 hover:bg-green-500/20 text-green-400 border border-green-500/25", action: () => onAction(`WhatsApp enviado a ${p.name} ✓`) },
    ...(p.paymentStatus !== "pagado" ? [
      { label: "Registrar pago",   icon: DollarSign,   color: "bg-violet-500/15 hover:bg-violet-500/25 text-violet-400 border border-violet-500/30", action: () => onAction(`Pago registrado para ${p.name} ✓`) },
    ] : []),
    ...(p.nextTrainingStatus === "sin-confirmar" || p.nextTrainingStatus === "duda" ? [
      { label: "Confirmar siguiente", icon: CalendarCheck, color: "bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-400 border border-cyan-500/30", action: () => onAction(`${p.name} confirmado para ${p.nextTraining} ✓`) },
    ] : []),
    { label: "Crear incidencia", icon: AlertTriangle,  color: "bg-foreground/[0.05] hover:bg-foreground/[0.08] text-muted-foreground border border-border", action: () => onAction("Incidencia registrada ✓") },
    { label: "Gafete",           icon: FileText,       color: "bg-foreground/[0.05] hover:bg-foreground/[0.08] text-muted-foreground border border-border", action: () => onAction(`Gafete generado para ${p.name} ✓`) },
  ]

  return (
    <div className="flex flex-wrap gap-1.5">
      {actions.slice(0, 6).map((a) => (
        <button
          key={a.label}
          onClick={a.action}
          className={cn("flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold transition-all", a.color)}
        >
          <a.icon className="w-3 h-3" />
          {a.label}
        </button>
      ))}
    </div>
  )
}

// ─── Detail panel ─────────────────────────────────────────────────────────────

function DetailPanel({ p, onClose, onAction }: { p: OpsParticipant; onClose: () => void; onAction: (msg: string) => void }) {
  const [tab, setTab] = useState<DetailTab>("resumen")

  const tabs: Array<{ key: DetailTab; label: string; badge?: number }> = [
    { key: "resumen",      label: "Resumen" },
    { key: "pagos",        label: "Pagos" },
    { key: "enrolamiento", label: "Enrolamiento", badge: p.enrolledCount > 0 ? p.enrolledCount : undefined },
    { key: "incidencias",  label: "Incidencias", badge: p.incidents.filter(i => i.status === "abierta").length || undefined },
    { key: "notas",        label: "Notas" },
  ]

  const overallCfg = OVERALL_CFG[p.overallStatus]
  const paymentCfg = PAYMENT_CFG[p.paymentStatus]

  return (
    <div className="flex flex-col h-full">
      {/* Panel header */}
      <div className="flex items-start gap-3 p-4 border-b border-border">
        <AvatarBadge initials={p.avatar} size="md" color="auto" />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="font-bold text-foreground text-sm leading-tight">{p.name}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">{p.levelLabel} · {p.cohorte}</p>
            </div>
            <button onClick={onClose} className="p-1 rounded hover:bg-foreground/[0.06] text-muted-foreground flex-shrink-0">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
            <span className={cn("text-[9px] font-bold px-1.5 py-0.5 rounded-full border", overallCfg.bg, overallCfg.color)}>
              {overallCfg.label}
            </span>
            <span className={cn("text-[9px] font-bold px-1.5 py-0.5 rounded-full border", paymentCfg.bg, paymentCfg.color)}>
              {paymentCfg.label}
            </span>
            {p.hasBeca && (
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-400">
                Beca ${p.becaAmount?.toLocaleString()}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="px-4 py-3 border-b border-border bg-foreground/[0.02]">
        <p className="text-[9px] uppercase tracking-widest text-muted-foreground font-semibold mb-2">Acciones rápidas</p>
        <QuickActions p={p} onAction={onAction} />
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border overflow-x-auto flex-shrink-0">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={cn(
              "flex items-center gap-1 px-3 py-2 text-[11px] font-semibold whitespace-nowrap border-b-2 transition-colors",
              tab === t.key
                ? "border-violet-400 text-violet-400"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            {t.label}
            {t.badge != null && t.badge > 0 && (
              <span className="text-[9px] font-black bg-red-500 text-white px-1 rounded-full">{t.badge}</span>
            )}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {tab === "resumen" && (
          <>
            {/* Contact info */}
            <div className="space-y-1.5">
              <p className="text-[9px] uppercase tracking-widest text-muted-foreground font-semibold">Contacto</p>
              <div className="text-xs text-foreground">{p.phone}</div>
              <div className="text-xs text-muted-foreground">{p.email}</div>
            </div>

            {/* Today's status */}
            <div className="space-y-1.5">
              <p className="text-[9px] uppercase tracking-widest text-muted-foreground font-semibold">Asistencia hoy</p>
              <div className="flex items-center gap-2">
                <div className={cn("w-2 h-2 rounded-full flex-shrink-0", ATTENDANCE_CFG[p.todayStatus].dot)} />
                <span className={cn("text-xs font-semibold", ATTENDANCE_CFG[p.todayStatus].color)}>
                  {ATTENDANCE_CFG[p.todayStatus].label}
                </span>
                {p.arrivalTime && <span className="text-xs text-muted-foreground">· {p.arrivalTime}</span>}
              </div>
            </div>

            {/* Next training */}
            {p.nextTraining && (
              <div className="space-y-1.5">
                <p className="text-[9px] uppercase tracking-widest text-muted-foreground font-semibold">Siguiente entrenamiento</p>
                <div className="rounded-lg border border-border bg-foreground/[0.02] p-2.5 space-y-1">
                  <p className="text-xs font-semibold text-foreground">{p.nextTraining}</p>
                  <p className="text-[10px] text-muted-foreground">{p.nextTrainingDate}</p>
                  {p.nextTrainingStatus && (
                    <p className={cn("text-[10px] font-bold", NEXT_TRAIN_CFG[p.nextTrainingStatus]?.color ?? "text-muted-foreground")}>
                      {NEXT_TRAIN_CFG[p.nextTrainingStatus]?.label ?? p.nextTrainingStatus}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Responsable */}
            <div className="space-y-1.5">
              <p className="text-[9px] uppercase tracking-widest text-muted-foreground font-semibold">Coach / Responsable</p>
              <div className="text-xs text-foreground">{p.coach} · Staff: {p.responsable}</div>
            </div>

            {/* Missing info */}
            {p.missingInfo.length > 0 && (
              <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-2.5 space-y-1">
                <p className="text-[9px] uppercase tracking-widest text-amber-400 font-semibold">Información faltante</p>
                <p className="text-xs text-amber-300">{p.missingInfo.join(", ")}</p>
              </div>
            )}

            {/* Coach note */}
            {p.coachNote && (
              <div className="rounded-lg border border-violet-500/20 bg-violet-500/5 p-2.5">
                <p className="text-[9px] uppercase tracking-widest text-violet-400 font-semibold mb-1">Nota del coach</p>
                <p className="text-xs text-foreground/80 leading-relaxed">{p.coachNote}</p>
              </div>
            )}

            {/* Course history */}
            {p.courseHistory.length > 0 && (
              <div className="space-y-1.5">
                <p className="text-[9px] uppercase tracking-widest text-muted-foreground font-semibold">Historial de cursos</p>
                <div className="space-y-1">
                  {p.courseHistory.map((c, i) => (
                    <div key={i} className="flex items-center justify-between gap-2 text-xs">
                      <span className="text-foreground truncate">{c.course}</span>
                      <span className={cn("flex-shrink-0 text-[10px] font-semibold",
                        c.status === "completado" ? "text-green-400" :
                        c.status === "en-proceso" ? "text-cyan-400" : "text-muted-foreground"
                      )}>
                        {c.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {tab === "pagos" && (
          <>
            <div className="rounded-xl border border-border bg-foreground/[0.02] p-3 space-y-2">
              <p className="text-[9px] uppercase tracking-widest text-muted-foreground font-semibold">Estado de pago</p>
              <div className="flex items-baseline justify-between">
                <div>
                  <p className="text-lg font-black text-foreground">${p.amountPaid.toLocaleString()} MXN</p>
                  <p className="text-[10px] text-muted-foreground">de ${p.amountTotal.toLocaleString()} · {p.concept}</p>
                </div>
                <span className={cn("text-xs font-bold px-2 py-1 rounded-full border", PAYMENT_CFG[p.paymentStatus].bg, PAYMENT_CFG[p.paymentStatus].color)}>
                  {PAYMENT_CFG[p.paymentStatus].label}
                </span>
              </div>
              {p.amountTotal > p.amountPaid && (
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px]">
                    <span className="text-muted-foreground">Saldo pendiente</span>
                    <span className="font-bold text-red-400">${(p.amountTotal - p.amountPaid).toLocaleString()}</span>
                  </div>
                  <div className="h-1.5 bg-foreground/[0.05] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-500 rounded-full"
                      style={{ width: `${(p.amountPaid / p.amountTotal) * 100}%` }}
                    />
                  </div>
                </div>
              )}
              {p.daysOverdue != null && p.daysOverdue > 0 && (
                <p className="text-[10px] text-red-400 font-semibold">⚠ Vencido hace {p.daysOverdue} día{p.daysOverdue > 1 ? "s" : ""}</p>
              )}
              {!p.hasComprobante && (
                <p className="text-[10px] text-amber-400">Sin comprobante registrado</p>
              )}
            </div>

            {p.hasBeca && (
              <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-3 space-y-1">
                <p className="text-[9px] uppercase tracking-widest text-amber-400 font-semibold">Beca / descuento aplicado</p>
                <p className="text-lg font-black text-amber-400">${p.becaAmount?.toLocaleString()} MXN</p>
                <p className="text-[10px] text-muted-foreground">Revisar autorización del dueño antes de confirmar.</p>
              </div>
            )}

            <div className="space-y-2">
              {[
                { label: "Registrar pago",    icon: DollarSign,   action: () => onAction(`Pago registrado para ${p.name} ✓`) },
                { label: "Subir comprobante", icon: FileText,      action: () => onAction("Comprobante subido ✓") },
                { label: "Aplicar descuento", icon: Ticket,        action: () => onAction("Descuento aplicado ✓") },
                { label: "Crear convenio",    icon: ClipboardList, action: () => onAction("Convenio de pago creado ✓") },
              ].map((a) => (
                <button key={a.label} onClick={a.action} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg border border-border hover:bg-foreground/[0.04] text-xs font-semibold text-foreground text-left transition-all">
                  <a.icon className="w-3.5 h-3.5 text-violet-400 flex-shrink-0" />
                  {a.label}
                  <ChevronRight className="w-3 h-3 text-muted-foreground ml-auto" />
                </button>
              ))}
            </div>
          </>
        )}

        {tab === "enrolamiento" && (
          <>
            {p.referredBy && (
              <div className="rounded-lg border border-violet-500/15 bg-violet-500/5 p-3">
                <p className="text-[9px] uppercase tracking-widest text-violet-400 font-semibold mb-1">Fue invitado por</p>
                <p className="text-sm font-bold text-foreground">{p.referredBy}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">Referido registrado en el sistema</p>
              </div>
            )}
            <div className="space-y-1.5">
              <p className="text-[9px] uppercase tracking-widest text-muted-foreground font-semibold">Ha enrolado</p>
              <p className="text-2xl font-black text-foreground">{p.enrolledCount}</p>
              <p className="text-xs text-muted-foreground">persona{p.enrolledCount !== 1 ? "s" : ""} a La Posibilidad</p>
            </div>
            {p.becasAvailable > 0 && (
              <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-3">
                <p className="text-[9px] uppercase tracking-widest text-amber-400 font-semibold mb-1">Becas disponibles</p>
                <p className="text-xl font-black text-amber-400">{p.becasAvailable}</p>
                <p className="text-[10px] text-muted-foreground">Ganadas en revisión de promesas. Vence al siguiente fin de semana.</p>
              </div>
            )}
            {p.enrolledCount === 0 && p.becasAvailable === 0 && !p.referredBy && (
              <p className="text-xs text-muted-foreground text-center py-4">Sin actividad de enrolamiento registrada.</p>
            )}
            <button
              onClick={() => onAction(`Inscripción al siguiente nivel iniciada para ${p.name} ✓`)}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-cyan-500/10 border border-cyan-500/25 hover:bg-cyan-500/15 text-xs font-semibold text-cyan-400 transition-all"
            >
              <ArrowRight className="w-3.5 h-3.5" />
              Inscribir al siguiente nivel
              <ChevronRight className="w-3 h-3 ml-auto" />
            </button>
            <button
              onClick={() => onAction(`${p.name} movido de generación ✓`)}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg border border-border hover:bg-foreground/[0.04] text-xs font-semibold text-muted-foreground transition-all"
            >
              <Users className="w-3.5 h-3.5" />
              Mover de generación
              <ChevronRight className="w-3 h-3 ml-auto" />
            </button>
          </>
        )}

        {tab === "incidencias" && (
          <>
            {p.incidents.length === 0 ? (
              <div className="text-center py-6">
                <CheckCircle2 className="w-8 h-8 text-green-400/40 mx-auto mb-2" />
                <p className="text-xs text-muted-foreground">Sin incidencias registradas</p>
              </div>
            ) : (
              <div className="space-y-2">
                {p.incidents.map((inc) => (
                  <div
                    key={inc.id}
                    className={cn(
                      "rounded-xl border p-3 space-y-1.5",
                      inc.severity === "alta"  ? "border-red-500/25 bg-red-500/5" :
                      inc.severity === "media" ? "border-yellow-500/25 bg-yellow-500/5" :
                      "border-border bg-foreground/[0.02]"
                    )}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-xs font-bold text-foreground">{inc.type}</p>
                      <span className={cn(
                        "text-[9px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0",
                        inc.status === "abierta" ? "bg-red-500/15 text-red-400 border border-red-500/25" : "bg-green-500/15 text-green-400 border border-green-500/25"
                      )}>
                        {inc.status === "abierta" ? "Abierta" : "Resuelta"}
                      </span>
                    </div>
                    <p className="text-[10px] text-muted-foreground leading-relaxed">{inc.description}</p>
                    <p className="text-[10px] text-muted-foreground">
                      {inc.date} · Asignada a {inc.assignedTo}
                    </p>
                  </div>
                ))}
              </div>
            )}
            <button
              onClick={() => onAction("Nueva incidencia creada ✓")}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-foreground/[0.05] border border-border hover:bg-foreground/[0.08] text-xs font-semibold text-muted-foreground transition-all"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              Crear nueva incidencia
            </button>
          </>
        )}

        {tab === "notas" && (
          <>
            {p.notes && (
              <div className="rounded-lg border border-border bg-foreground/[0.02] p-3">
                <p className="text-[9px] uppercase tracking-widest text-muted-foreground font-semibold mb-1.5">Nota de staff</p>
                <p className="text-xs text-foreground leading-relaxed">{p.notes}</p>
              </div>
            )}
            {p.coachNote && (
              <div className="rounded-lg border border-violet-500/20 bg-violet-500/5 p-3">
                <p className="text-[9px] uppercase tracking-widest text-violet-400 font-semibold mb-1.5">Nota del coach · {p.coach}</p>
                <p className="text-xs text-foreground/80 leading-relaxed">{p.coachNote}</p>
              </div>
            )}
            <div className="space-y-2 pt-2">
              <button
                onClick={() => onAction(`Nota guardada para ${p.name} ✓`)}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg border border-border hover:bg-foreground/[0.04] text-xs font-semibold text-foreground transition-all"
              >
                <FileText className="w-3.5 h-3.5 text-violet-400" />
                Agregar nota de staff
              </button>
              <button
                onClick={() => onAction(`Seguimiento asignado para ${p.name} ✓`)}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg border border-border hover:bg-foreground/[0.04] text-xs font-semibold text-foreground transition-all"
              >
                <CalendarCheck className="w-3.5 h-3.5 text-cyan-400" />
                Asignar seguimiento
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

// ─── Table row ────────────────────────────────────────────────────────────────

function ParticipantRow({
  p,
  selected,
  onSelect,
}: {
  p: OpsParticipant
  selected: boolean
  onSelect: () => void
}) {
  const attendCfg  = ATTENDANCE_CFG[p.todayStatus]
  const paymentCfg = PAYMENT_CFG[p.paymentStatus]
  const nextCfg    = p.nextTrainingStatus ? NEXT_TRAIN_CFG[p.nextTrainingStatus] : null
  const hasIncident = p.incidents.some((i) => i.status === "abierta")

  return (
    <button
      onClick={onSelect}
      className={cn(
        "w-full grid items-center gap-2 px-3 py-2.5 text-left hover:bg-foreground/[0.04] border-b border-border/50 transition-colors",
        "grid-cols-[auto_1fr_auto_auto_auto_auto]",
        selected && "bg-violet-500/8 border-l-2 border-l-violet-500",
        hasIncident && !selected && "bg-red-500/3"
      )}
    >
      {/* Avatar + name */}
      <AvatarBadge initials={p.avatar} size="xs" color="auto" />
      <div className="min-w-0">
        <div className="flex items-center gap-1.5 min-w-0">
          <p className="text-xs font-semibold text-foreground truncate">{p.name}</p>
          {p.overallStatus === "vip" && <Star className="w-3 h-3 text-amber-400 flex-shrink-0" />}
          {hasIncident && <AlertCircle className="w-3 h-3 text-red-400 flex-shrink-0" />}
          {p.hasBeca && <Ticket className="w-3 h-3 text-amber-400 flex-shrink-0" />}
        </div>
        <p className="text-[10px] text-muted-foreground truncate">{p.levelLabel}</p>
      </div>

      {/* Attendance */}
      <div className="hidden sm:flex items-center gap-1 flex-shrink-0">
        <div className={cn("w-1.5 h-1.5 rounded-full", attendCfg.dot)} />
        <span className={cn("text-[10px] font-semibold", attendCfg.color)}>{attendCfg.label}</span>
      </div>

      {/* Payment */}
      <span className={cn("hidden md:inline-block text-[10px] font-bold px-1.5 py-0.5 rounded-full border", paymentCfg.bg, paymentCfg.color)}>
        {paymentCfg.label}
      </span>

      {/* Next training status */}
      <span className={cn("hidden lg:inline-block text-[10px] font-semibold w-20 text-right truncate", nextCfg?.color ?? "text-muted-foreground")}>
        {nextCfg?.label ?? "—"}
      </span>

      {/* Arrow */}
      <ChevronRight className={cn("w-3.5 h-3.5 flex-shrink-0 transition-colors", selected ? "text-violet-400" : "text-muted-foreground/40")} />
    </button>
  )
}

// ─── Walk-in drawer ───────────────────────────────────────────────────────────

function WalkInDrawer({ onClose, onAdd }: { onClose: () => void; onAdd: (name: string) => void }) {
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [referredBy, setReferredBy] = useState("")
  const [done, setDone] = useState(false)

  function submit() {
    if (!name.trim()) return
    setDone(true)
    setTimeout(() => { onAdd(name.trim()); onClose() }, 1400)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-md bg-[#14141f] border border-white/10 rounded-t-2xl md:rounded-2xl p-6 space-y-4" onClick={(e) => e.stopPropagation()}>
        {done ? (
          <div className="flex flex-col items-center gap-3 py-6">
            <CheckCircle className="w-12 h-12 text-green-400" />
            <p className="font-bold text-white text-lg">{name}</p>
            <p className="text-sm text-green-400">Walk-in registrado ✓</p>
            {referredBy && <p className="text-xs text-muted-foreground">Referido por {referredBy}</p>}
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-bold text-white text-lg">Registro walk-in</h2>
                <p className="text-xs text-muted-foreground">Solo lo esencial — expediente completo después</p>
              </div>
              <button onClick={onClose} className="p-1.5 rounded hover:bg-white/5 text-muted-foreground"><X className="w-4 h-4" /></button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-muted-foreground font-medium block mb-1">Nombre completo *</label>
                <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ej. María González"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-muted-foreground focus:outline-none focus:border-violet-500/50" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground font-medium block mb-1">WhatsApp</label>
                <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+52 55 0000 0000"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-muted-foreground focus:outline-none focus:border-violet-500/50" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground font-medium block mb-1">
                  ¿Quién lo invitó? <span className="text-muted-foreground/60">(opcional)</span>
                </label>
                <input value={referredBy} onChange={(e) => setReferredBy(e.target.value)} placeholder="Nombre del participante"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-muted-foreground focus:outline-none focus:border-violet-500/50" />
              </div>
            </div>
            <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-lg p-3 text-xs text-cyan-300">
              El sistema enviará un recordatorio por WhatsApp para completar el expediente después del evento.
            </div>
            <button onClick={submit} disabled={!name.trim()}
              className="w-full py-3 rounded-xl bg-cyan-600 hover:bg-cyan-700 disabled:opacity-40 text-white font-semibold text-sm transition-colors">
              Registrar entrada
            </button>
          </>
        )}
      </div>
    </div>
  )
}

// ─── Stats bar ────────────────────────────────────────────────────────────────

function StatsBar({ participants }: { participants: OpsParticipant[] }) {
  const stats = [
    { label: "En sala",      value: participants.filter(p => p.todayStatus === "checkedin").length,   color: "text-green-400" },
    { label: "Esperados",    value: participants.filter(p => p.todayStatus === "confirmado" || p.todayStatus === "pendiente").length, color: "text-yellow-400" },
    { label: "Pago vencido", value: participants.filter(p => p.paymentStatus === "vencido").length,    color: "text-red-400" },
    { label: "Incidencias",  value: participants.filter(p => p.incidents.some(i => i.status === "abierta")).length, color: "text-orange-400" },
    { label: "Leads",        value: participants.filter(p => p.levelCode === "lead").length,            color: "text-violet-400" },
  ]
  return (
    <div className="flex items-center gap-3 overflow-x-auto flex-shrink-0">
      {stats.map((s) => (
        <div key={s.label} className="flex items-center gap-1.5 flex-shrink-0">
          <span className={cn("text-lg font-black leading-none", s.color)}>{s.value}</span>
          <span className="text-[10px] text-muted-foreground">{s.label}</span>
        </div>
      ))}
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function RegistroPage() {
  const { toast, show, hide } = useActionToast()
  const [search, setSearch]               = useState("")
  const [activeFilter, setActiveFilter]   = useState<FilterKey>("todos")
  const [selected, setSelected]           = useState<OpsParticipant | null>(null)
  const [walkInOpen, setWalkInOpen]       = useState(false)
  const [extraParticipants, setExtra]     = useState<OpsParticipant[]>([])

  const allParticipants = [...OPS_PARTICIPANTS, ...extraParticipants]

  // Apply filter + search
  const filtered = useMemo(() => {
    let list = allParticipants

    // Keyword filter
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter((p) =>
        p.name.toLowerCase().includes(q) ||
        p.phone.includes(q) ||
        p.email.toLowerCase().includes(q) ||
        p.cohorte.toLowerCase().includes(q) ||
        (p.referredBy ?? "").toLowerCase().includes(q)
      )
    }

    // Quick filter
    switch (activeFilter) {
      case "checkin-hoy":
        return list.filter((p) => p.todayStatus === "checkedin" || p.todayStatus === "confirmado" || p.todayStatus === "pendiente" || p.todayStatus === "no-show")
      case "pago-vencido":
        return list.filter((p) => p.paymentStatus === "vencido" || p.paymentStatus === "parcial")
      case "sin-confirmar":
        return list.filter((p) => p.nextTrainingStatus === "sin-confirmar" || p.nextTrainingStatus === "duda")
      case "incidencias":
        return list.filter((p) => p.incidents.some((i) => i.status === "abierta"))
      case "beca":
        return list.filter((p) => p.hasBeca || p.becasAvailable > 0)
      case "leads":
        return list.filter((p) => p.levelCode === "lead")
      case "proximo-nivel":
        return list.filter((p) => p.overallStatus === "inscrito-siguiente" || p.nextTrainingStatus === "confirmado" || p.nextTrainingStatus === "inscrito")
      default:
        return list
    }
  }, [search, activeFilter, allParticipants])

  function addWalkIn(name: string) {
    const newP: OpsParticipant = {
      id: `w-${Date.now()}`, name, avatar: name.split(" ").map((w) => w[0]).slice(0,2).join("").toUpperCase(),
      phone: "—", email: "—",
      levelCode: "lead", levelLabel: "Walk-in · Sin expediente", cohorte: "Sin asignar", coach: "—",
      todayStatus: "walk-in", arrivalTime: new Date().toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" }),
      nextTraining: null, nextTrainingDate: null, nextTrainingStatus: null,
      paymentStatus: "pendiente", amountTotal: 0, amountPaid: 0, concept: "—", daysOverdue: null,
      hasComprobante: false, hasBeca: false, becaAmount: null,
      referredBy: null, enrolledCount: 0, becasAvailable: 0,
      overallStatus: "seguimiento", responsable: "Karla Ríos",
      incidents: [], missingInfo: ["nombre completo", "WhatsApp", "email", "expediente completo"],
      notes: "Walk-in — expediente pendiente de completar", coachNote: null, courseHistory: [],
    }
    setExtra((prev) => [newP, ...prev])
    setSelected(newP)
    show(`${name} — walk-in registrado ✓`)
  }

  return (
    <div className="flex flex-col" style={{ minHeight: "calc(100vh - 80px)" }}>
      {/* ── Top bar ─────────────────────────────────────────────────── */}
      <div className="px-4 py-3 border-b border-border flex items-center justify-between gap-3 flex-wrap bg-background">
        <div className="flex items-start gap-3 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-violet-500/20 flex items-center justify-center flex-shrink-0">
            <Activity className="w-4 h-4 text-violet-400" />
          </div>
          <div className="min-w-0">
            <h1 className="text-sm font-bold text-foreground leading-tight">Mesa de Registro</h1>
            <p className="text-[10px] text-muted-foreground truncate">{TODAY_EVENT.name} · {TODAY_EVENT.date} · {TODAY_EVENT.time}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <StatsBar participants={allParticipants} />
          <button
            onClick={() => setWalkInOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-semibold transition-colors flex-shrink-0"
          >
            <UserPlus className="w-3.5 h-3.5" />
            Walk-in
          </button>
        </div>
      </div>

      {/* ── Search + filters ─────────────────────────────────────────── */}
      <div className="px-4 py-2.5 border-b border-border bg-background space-y-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nombre, teléfono, email, generación, referido..."
            className="w-full pl-9 pr-4 py-2 bg-foreground/[0.04] border border-border rounded-lg text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-violet-500/40"
          />
        </div>
        <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5">
          {FILTERS.map((f) => {
            const count = f.key === "todos" ? allParticipants.length :
              f.key === "checkin-hoy"   ? allParticipants.filter(p => ["checkedin","confirmado","pendiente","no-show"].includes(p.todayStatus)).length :
              f.key === "pago-vencido"  ? allParticipants.filter(p => p.paymentStatus === "vencido" || p.paymentStatus === "parcial").length :
              f.key === "sin-confirmar" ? allParticipants.filter(p => p.nextTrainingStatus === "sin-confirmar" || p.nextTrainingStatus === "duda").length :
              f.key === "incidencias"   ? allParticipants.filter(p => p.incidents.some(i => i.status === "abierta")).length :
              f.key === "beca"          ? allParticipants.filter(p => p.hasBeca || p.becasAvailable > 0).length :
              f.key === "leads"         ? allParticipants.filter(p => p.levelCode === "lead").length :
              allParticipants.filter(p => p.overallStatus === "inscrito-siguiente" || p.nextTrainingStatus === "confirmado" || p.nextTrainingStatus === "inscrito").length

            return (
              <button
                key={f.key}
                onClick={() => setActiveFilter(f.key)}
                className={cn(
                  "flex items-center gap-1 px-2.5 py-1.5 rounded-full text-[10px] font-semibold whitespace-nowrap border transition-all flex-shrink-0",
                  activeFilter === f.key
                    ? "bg-violet-500/20 border-violet-500/40 text-violet-400"
                    : "bg-foreground/[0.04] border-border text-muted-foreground hover:text-foreground"
                )}
              >
                <f.icon className="w-3 h-3" />
                {f.label}
                {count > 0 && (
                  <span className={cn(
                    "text-[9px] font-black px-1 rounded-full ml-0.5",
                    activeFilter === f.key ? "bg-violet-500 text-white" : "bg-foreground/[0.1] text-foreground"
                  )}>
                    {count}
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* ── Main split ───────────────────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden">

        {/* Table */}
        <div className={cn("flex flex-col overflow-hidden transition-all", selected ? "w-[55%] hidden lg:flex" : "flex-1")}>
          {/* Table header */}
          <div className="grid grid-cols-[auto_1fr_auto_auto_auto_auto] gap-2 px-3 py-2 border-b border-border bg-foreground/[0.02] sticky top-0">
            {["", "Nombre / Nivel", "Asistencia", "Pago", "Siguiente", ""].map((h, i) => (
              <span key={i} className="text-[9px] uppercase tracking-widest text-muted-foreground font-semibold truncate">
                {h}
              </span>
            ))}
          </div>

          {/* Table rows */}
          <div className="overflow-y-auto flex-1">
            {filtered.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground text-sm">
                No hay participantes con este filtro
              </div>
            ) : (
              filtered.map((p) => (
                <ParticipantRow
                  key={p.id}
                  p={p}
                  selected={selected?.id === p.id}
                  onSelect={() => setSelected(selected?.id === p.id ? null : p)}
                />
              ))
            )}
          </div>

          {/* Row count */}
          <div className="px-3 py-2 border-t border-border text-[10px] text-muted-foreground bg-background">
            {filtered.length} de {allParticipants.length} participantes
          </div>
        </div>

        {/* Detail panel */}
        {selected && (
          <div className={cn(
            "flex flex-col border-l border-border bg-background overflow-hidden",
            "w-full lg:w-[45%] flex-shrink-0"
          )}>
            <DetailPanel
              p={selected}
              onClose={() => setSelected(null)}
              onAction={(msg) => show(msg)}
            />
          </div>
        )}

        {/* Empty state when no selection on desktop */}
        {!selected && (
          <div className="hidden lg:flex items-center justify-center w-[45%] flex-shrink-0 border-l border-border bg-foreground/[0.01]">
            <div className="text-center space-y-2">
              <User className="w-10 h-10 text-muted-foreground/30 mx-auto" />
              <p className="text-sm text-muted-foreground">Selecciona un participante</p>
              <p className="text-[11px] text-muted-foreground/60">para ver su expediente y acciones</p>
            </div>
          </div>
        )}
      </div>

      {walkInOpen && <WalkInDrawer onClose={() => setWalkInOpen(false)} onAdd={addWalkIn} />}
      <ActionToast message={toast.message} visible={toast.visible} onHide={hide} />
    </div>
  )
}
