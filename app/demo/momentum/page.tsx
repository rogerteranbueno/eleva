"use client"

import { CheckCircle, Calendar, MessageSquare, Target, Zap, TrendingDown } from "lucide-react"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  ResponsiveContainer,
  ReferenceLine,
  Tooltip,
} from "recharts"
import { MomentumGauge } from "@/components/demo/MomentumGauge"
import { AvatarBadge } from "@/components/demo/AvatarBadge"
import { ActionToast, useActionToast } from "@/components/demo/ActionToast"
import { useDemoStore } from "@/lib/demo-store"
import { MOMENTUM_HISTORY, SPECIALISTS } from "@/data/creania"
import { getMomentumColor, cn } from "@/lib/utils"

const FACTORS = [
  { label: "Check-ins diarios", weight: 30, current: 0, icon: <CheckCircle className="w-4 h-4" /> },
  { label: "Misiones completadas", weight: 35, current: 25, icon: <Target className="w-4 h-4" /> },
  { label: "Participación en cohorte", weight: 20, current: 10, icon: <MessageSquare className="w-4 h-4" /> },
  { label: "Asistencia a eventos", weight: 15, current: 10, icon: <Calendar className="w-4 h-4" /> },
]

const SUGGESTED_ACTIONS = [
  { label: "Haz un check-in hoy", points: "+8 pts", done: false },
  { label: "Completa tu misión de semana 12", points: "+15 pts", done: false },
  { label: "Publica algo en tu cohorte", points: "+5 pts", done: false },
  { label: "Confirma tu asistencia al evento del jueves", points: "+3 pts", done: false },
]

export default function MomentumPage() {
  const { state, dispatch } = useDemoStore()
  const { toast, show, hide } = useActionToast()
  const specialist = SPECIALISTS[0]

  const score = state.valeriaMomentum
  const color = getMomentumColor(score)

  // Adjust chart data to reflect any momentum changes
  const chartData = MOMENTUM_HISTORY.map((d, i) => ({
    ...d,
    value: i === MOMENTUM_HISTORY.length - 1 ? score : d.value,
  }))

  function handleBookSession() {
    dispatch({ type: "BOOK_SESSION" })
    show(`Sesión agendada con ${specialist.name} ✓`)
  }

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Mi Momentum</h1>
        <p className="text-muted-foreground text-sm mt-0.5">Vía Creania · Semana 12</p>
      </div>

      {/* Score hero */}
      <div className="glass rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-6">
        <MomentumGauge score={score} size="lg" />
        <div className="flex-1 space-y-3">
          <div>
            <p className="text-sm text-muted-foreground font-medium">Tu score actual</p>
            <p className="text-4xl font-black" style={{ color }}>{score}%</p>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <TrendingDown className="w-4 h-4 text-red-400" />
            <span className="text-red-400 font-medium">Cayó 47 puntos</span>
            <span className="text-muted-foreground">en los últimos 14 días</span>
          </div>
          <div className="h-px bg-border" />
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-muted-foreground text-xs">Tu mejor score</p>
              <p className="font-bold text-white">74%</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Promedio cohorte</p>
              <p className="font-bold" style={{ color: getMomentumColor(74) }}>74%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="glass rounded-xl p-5 space-y-3">
        <h3 className="font-semibold text-white text-sm">Últimos 30 días</h3>
        <ResponsiveContainer width="100%" height={160}>
          <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="momentumGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#7C3AED" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="day"
              tick={{ fill: "#6B6B8A", fontSize: 10 }}
              tickLine={false}
              axisLine={false}
              interval={4}
            />
            <YAxis domain={[0, 100]} tick={{ fill: "#6B6B8A", fontSize: 10 }} tickLine={false} axisLine={false} />
            <Tooltip
              contentStyle={{ background: "#1A1A26", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8 }}
              labelStyle={{ color: "#A0A0B8", fontSize: 11 }}
              itemStyle={{ color: "#7C3AED", fontSize: 12 }}
              formatter={(v: number) => [`${v}%`, "Momentum"]}
            />
            <ReferenceLine y={40} stroke="rgba(234,179,8,0.3)" strokeDasharray="4 4" />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#7C3AED"
              strokeWidth={2}
              fill="url(#momentumGrad)"
            />
          </AreaChart>
        </ResponsiveContainer>
        <p className="text-xs text-muted-foreground text-center">
          La línea amarilla marca el umbral de riesgo (40%). Cruzaste ese límite hace 14 días.
        </p>
      </div>

      {/* Factors */}
      <div className="glass rounded-xl p-5 space-y-4">
        <h3 className="font-semibold text-white text-sm">¿Qué construye tu Momentum?</h3>
        <div className="space-y-3">
          {FACTORS.map((f) => (
            <div key={f.label} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <span style={{ color: getMomentumColor(f.current) }}>{f.icon}</span>
                  {f.label}
                </div>
                <div className="flex items-center gap-3">
                  <span style={{ color: getMomentumColor(f.current) }} className="font-bold">
                    {f.current}/{f.weight} pts
                  </span>
                </div>
              </div>
              <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${(f.current / f.weight) * 100}%`,
                    backgroundColor: getMomentumColor(f.current),
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Suggested actions */}
      <div className="glass rounded-xl p-5 space-y-3">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-yellow-400" />
          <h3 className="font-semibold text-white text-sm">Acciones para subir tu score</h3>
        </div>
        <div className="space-y-2">
          {SUGGESTED_ACTIONS.map((a) => (
            <div key={a.label} className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-white/3 transition-colors">
              <div className="w-5 h-5 rounded border border-border flex items-center justify-center flex-shrink-0">
                {a.done && <CheckCircle className="w-3 h-3 text-green-400" />}
              </div>
              <span className="text-sm text-foreground flex-1">{a.label}</span>
              <span className="text-xs font-bold text-green-400">{a.points}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Specialist */}
      <div className="glass-cyan rounded-xl p-5 space-y-3">
        <p className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">
          Especialista sugerido para tu objetivo
        </p>
        <div className="flex items-center gap-3">
          <AvatarBadge initials={specialist.avatar} size="md" color="cyan" />
          <div className="flex-1">
            <p className="font-semibold text-white">{specialist.name}</p>
            <p className="text-sm text-cyan-400">{specialist.specialty}</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Una sesión puede desbloquearte en tu objetivo de finanzas
            </p>
          </div>
          {!state.sessionBooked ? (
            <button
              onClick={handleBookSession}
              className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg text-sm font-semibold transition-colors flex-shrink-0"
            >
              Agendar
            </button>
          ) : (
            <div className="flex items-center gap-1.5 text-green-400 text-xs font-semibold flex-shrink-0">
              <CheckCircle className="w-4 h-4" />
              Agendado
            </div>
          )}
        </div>
      </div>

      <ActionToast message={toast.message} visible={toast.visible} onHide={hide} />
    </div>
  )
}
