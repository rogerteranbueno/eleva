"use client"

import { useState } from "react"
import {
  Sparkles, Check, Circle, Mail, Users, ChevronDown, Send,
  AlertTriangle, TrendingDown, Calendar, CreditCard, CheckCircle2
} from "lucide-react"
import { cn } from "@/lib/utils"

const TEAM = [
  { id: "carlos", name: "Carlos Mendoza", role: "Fundador", avatar: "CM" },
  { id: "ana", name: "Ana Reyes", role: "Coach Omega", avatar: "AR" },
  { id: "marco", name: "Marco Fuentes", role: "Coach Norte", avatar: "MF" },
  { id: "daniela", name: "Daniela Torres", role: "Coach Vía 12", avatar: "DT" },
  { id: "rodrigo", name: "Rodrigo Peña", role: "Coach General", avatar: "RP" },
]

type Priority = "high" | "medium" | "info"

interface Task {
  id: string
  priority: Priority
  label: string
  icon: React.ComponentType<{ className?: string }>
  title: string
  detail: string
  metric: string
  defaultAssignee: string
}

const TASKS: Task[] = [
  {
    id: "t1",
    priority: "high",
    label: "ALTA",
    icon: AlertTriangle,
    title: "Reactivar 14 participantes con momentum crítico",
    detail: "Enviar mensaje personalizado antes del viernes. Riesgo de cancelación en mes 4.",
    metric: "14 participantes · momentum <40%",
    defaultAssignee: "ana",
  },
  {
    id: "t2",
    priority: "high",
    label: "ALTA",
    icon: TrendingDown,
    title: "Intervenir Generación Norte — tendencia a la baja",
    detail: "Programar sesión grupal esta semana con Marco. Momentum bajó 7 pts en 14 días.",
    metric: "67 participantes · -7 pts esta semana",
    defaultAssignee: "marco",
  },
  {
    id: "t3",
    priority: "medium",
    label: "MEDIA",
    icon: Calendar,
    title: "Confirmar asistencia evento Gen. Omega",
    detail: "Enviar recordatorio SMS/WhatsApp hoy. Sesión en vivo jueves 7pm — 59 sin confirmar.",
    metric: "Sesión en vivo · jueves 7pm",
    defaultAssignee: "carlos",
  },
  {
    id: "t4",
    priority: "info",
    label: "BAJA",
    icon: CreditCard,
    title: "Seguimiento pago pendiente — Valeria Romo",
    detail: "Contactar amablemente. Mes 4 de Vía Creania vencido hace 3 días. Único atraso en historial.",
    metric: "$4,200 MXN · vencido hace 3 días",
    defaultAssignee: "carlos",
  },
]

const PRIORITY_STYLES: Record<Priority, { badge: string; border: string; iconColor: string }> = {
  high: {
    badge: "bg-red-500/15 text-red-400 border-red-500/20",
    border: "border-red-500/20",
    iconColor: "text-red-400",
  },
  medium: {
    badge: "bg-yellow-500/15 text-yellow-400 border-yellow-500/20",
    border: "border-yellow-500/20",
    iconColor: "text-yellow-400",
  },
  info: {
    badge: "bg-blue-500/15 text-blue-400 border-blue-500/20",
    border: "border-blue-500/20",
    iconColor: "text-blue-400",
  },
}

function AssigneeSelect({
  value,
  onChange,
}: {
  value: string
  onChange: (id: string) => void
}) {
  const [open, setOpen] = useState(false)
  const selected = TEAM.find((t) => t.id === value)!

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-white/5 border border-white/8 hover:border-white/15 transition-colors text-xs"
      >
        <div className="w-4 h-4 rounded-full bg-violet-600 flex items-center justify-center text-[8px] font-bold text-white flex-shrink-0">
          {selected.avatar.slice(0, 1)}
        </div>
        <span className="text-foreground">{selected.name.split(" ")[0]}</span>
        <ChevronDown className="w-3 h-3 text-muted-foreground" />
      </button>
      {open && (
        <div className="absolute bottom-full mb-1 left-0 z-20 bg-[#0d0d15] border border-white/10 rounded-xl shadow-xl min-w-[180px] py-1 overflow-hidden">
          {TEAM.map((member) => (
            <button
              key={member.id}
              onClick={() => { onChange(member.id); setOpen(false) }}
              className={cn(
                "flex items-center gap-2.5 w-full px-3 py-2 text-left hover:bg-white/5 transition-colors",
                value === member.id && "bg-violet-500/10"
              )}
            >
              <div className="w-6 h-6 rounded-full bg-violet-600 flex items-center justify-center text-[9px] font-bold text-white flex-shrink-0">
                {member.avatar}
              </div>
              <div>
                <p className="text-xs font-medium text-white">{member.name}</p>
                <p className="text-[10px] text-muted-foreground">{member.role}</p>
              </div>
              {value === member.id && <Check className="w-3 h-3 text-violet-400 ml-auto" />}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export function PlanGenerator() {
  const [assignees, setAssignees] = useState<Record<string, string>>(
    Object.fromEntries(TASKS.map((t) => [t.id, t.defaultAssignee]))
  )
  const [done, setDone] = useState<Record<string, boolean>>({})
  const [emailSent, setEmailSent] = useState(false)
  const [tasksSent, setTasksSent] = useState(false)

  function toggleDone(id: string) {
    setDone((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  function handleEmail() {
    setEmailSent(true)
    setTimeout(() => setEmailSent(false), 3000)
  }

  function handleCreateTasks() {
    setTasksSent(true)
    setTimeout(() => setTasksSent(false), 3000)
  }

  const completedCount = Object.values(done).filter(Boolean).length

  return (
    <div className="rounded-2xl border border-violet-500/20 bg-violet-500/3 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-violet-600/20 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-violet-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="text-sm font-bold text-white">Convertir en Plan</p>
              <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-violet-500/15 text-violet-400 border border-violet-500/20 font-semibold">IA</span>
            </div>
            <p className="text-[11px] text-muted-foreground">Analicé 6 señales de Creania — {TASKS.length} acciones prioritarias esta semana</p>
          </div>
        </div>
        {completedCount > 0 && (
          <span className="text-xs text-green-400 font-medium">
            {completedCount}/{TASKS.length} completadas
          </span>
        )}
      </div>

      {/* Tasks */}
      <div className="divide-y divide-white/4">
        {TASKS.map((task) => {
          const s = PRIORITY_STYLES[task.priority]
          const Icon = task.icon
          const isDone = !!done[task.id]

          return (
            <div
              key={task.id}
              className={cn(
                "px-5 py-4 transition-colors",
                isDone ? "opacity-50" : ""
              )}
            >
              <div className="flex items-start gap-3">
                {/* Done toggle */}
                <button
                  onClick={() => toggleDone(task.id)}
                  className="flex-shrink-0 mt-0.5 transition-colors"
                >
                  {isDone
                    ? <CheckCircle2 className="w-4.5 h-4.5 text-green-400" />
                    : <Circle className="w-4.5 h-4.5 text-muted-foreground hover:text-white" />
                  }
                </button>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={cn(
                        "text-[10px] px-2 py-0.5 rounded-full font-bold border",
                        s.badge
                      )}>
                        {task.label}
                      </span>
                      <p className={cn(
                        "text-sm font-semibold text-white",
                        isDone && "line-through text-muted-foreground"
                      )}>
                        {task.title}
                      </p>
                    </div>
                    <AssigneeSelect
                      value={assignees[task.id]}
                      onChange={(id) => setAssignees((prev) => ({ ...prev, [task.id]: id }))}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{task.detail}</p>
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <Icon className={cn("w-3 h-3 flex-shrink-0", s.iconColor)} />
                    <span className="text-[11px] text-muted-foreground">{task.metric}</span>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between gap-3 px-5 py-3.5 border-t border-white/6 flex-wrap">
        <p className="text-[11px] text-muted-foreground">
          Asigna las tareas a tu equipo antes de ejecutar
        </p>
        <div className="flex items-center gap-2">
          <button
            onClick={handleEmail}
            className={cn(
              "flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all border",
              emailSent
                ? "bg-green-500/10 text-green-400 border-green-500/20"
                : "glass text-muted-foreground hover:text-white border-white/8 hover:border-white/20"
            )}
          >
            {emailSent ? <><CheckCircle2 className="w-3.5 h-3.5" /> Enviado</> : <><Mail className="w-3.5 h-3.5" /> Enviar por correo</>}
          </button>
          <button
            onClick={handleCreateTasks}
            className={cn(
              "flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all",
              tasksSent
                ? "bg-green-500/10 text-green-400 border border-green-500/20"
                : "bg-violet-600 text-white hover:bg-violet-700"
            )}
          >
            {tasksSent ? <><CheckCircle2 className="w-3.5 h-3.5" /> Tareas creadas</> : <><Send className="w-3.5 h-3.5" /> Crear tareas</>}
          </button>
        </div>
      </div>
    </div>
  )
}
