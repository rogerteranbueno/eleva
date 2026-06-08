"use client"

import Link from "next/link"
import { useState, useEffect, useRef } from "react"
import {
  ArrowRight, CheckCircle2, AlertTriangle, AlertCircle, X,
  Users, DollarSign, ClipboardList, BarChart3, Globe,
  MessageCircle, TrendingUp, TrendingDown, Zap, Shield,
  Eye, Calendar, ChevronRight, Star, Activity,
  Database, GitMerge, Layers, Lock, Unlock, ArrowDown,
} from "lucide-react"
import { cn } from "@/lib/utils"

// ─── Utility ─────────────────────────────────────────────────────────────────

function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true) }, { threshold })
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])
  return { ref, inView }
}

// ─── Mini Mockups ─────────────────────────────────────────────────────────────

function MockupShell({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#0d0d14] overflow-hidden shadow-2xl shadow-black/60 w-full">
      <div className="flex items-center gap-1.5 px-4 py-3 border-b border-white/5 bg-white/[0.02]">
        <div className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
        <div className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
        <span className="ml-2 text-[10px] text-white/20 font-mono">{label}</span>
      </div>
      <div className="p-4">{children}</div>
    </div>
  )
}

function MockupPulso() {
  return (
    <MockupShell label="eleva.app/demo/pulso">
      <div className="space-y-3">
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: "Participantes activos", value: "89", color: "text-violet-400" },
            { label: "Cobrado este mes", value: "$198k", color: "text-green-400" },
            { label: "Pendiente", value: "$48k", color: "text-red-400" },
          ].map((s) => (
            <div key={s.label} className="rounded-lg bg-white/[0.04] border border-white/5 p-2 text-center">
              <p className={cn("text-lg font-black", s.color)}>{s.value}</p>
              <p className="text-[9px] text-white/30 leading-tight mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
        <div className="space-y-1.5">
          <p className="text-[9px] uppercase tracking-widest text-white/20 font-semibold">Alertas activas</p>
          {[
            { dot: "bg-red-500", text: "Carlos P. — activo sin pago registrado" },
            { dot: "bg-orange-500", text: "Héctor R. — comprobante duplicado" },
            { dot: "bg-yellow-500", text: "3 participantes sin confirmar próximo entrenamiento" },
          ].map((a, i) => (
            <div key={i} className="flex items-center gap-2 rounded-md bg-white/[0.03] px-2.5 py-1.5">
              <div className={cn("w-1.5 h-1.5 rounded-full flex-shrink-0", a.dot)} />
              <span className="text-[10px] text-white/50">{a.text}</span>
            </div>
          ))}
        </div>
        <div className="rounded-lg bg-white/[0.04] border border-white/5 p-2.5">
          <p className="text-[9px] text-white/30 mb-1.5">Momentum por generación</p>
          {[
            { name: "Gen. Omega", pct: 84, color: "bg-violet-500" },
            { name: "Gen. Norte", pct: 71, color: "bg-indigo-500" },
            { name: "Vía 12", pct: 91, color: "bg-emerald-500" },
          ].map((g) => (
            <div key={g.name} className="flex items-center gap-2 mb-1">
              <span className="text-[9px] text-white/40 w-16 flex-shrink-0">{g.name}</span>
              <div className="flex-1 h-1.5 rounded-full bg-white/5">
                <div className={cn("h-full rounded-full", g.color)} style={{ width: `${g.pct}%` }} />
              </div>
              <span className="text-[9px] text-white/40 w-6 text-right">{g.pct}%</span>
            </div>
          ))}
        </div>
      </div>
    </MockupShell>
  )
}

function MockupRegistro() {
  return (
    <MockupShell label="eleva.app/demo/ops/registro">
      <div className="space-y-2">
        <div className="flex gap-1.5 mb-2">
          {["Todos (14)", "Check-in hoy (8)", "Pago vencido (4)", "Incidencias (3)"].map((f, i) => (
            <span key={i} className={cn(
              "text-[9px] px-2 py-0.5 rounded-full font-semibold",
              i === 0 ? "bg-violet-600 text-white" : "bg-white/5 text-white/30"
            )}>{f}</span>
          ))}
        </div>
        <div className="space-y-1">
          {[
            { name: "Valeria Romo", status: "No-show", payment: "Sin comprobante", badge: "bg-red-500/20 text-red-400", dot: "bg-red-500" },
            { name: "Carmen Valdés", status: "✓ Check-in", payment: "Pagado", badge: "bg-green-500/20 text-green-400", dot: "bg-green-500" },
            { name: "Héctor Ramírez", status: "✓ Check-in", payment: "Comprobante dudoso", badge: "bg-yellow-500/20 text-yellow-400", dot: "bg-green-500" },
            { name: "Omar Castillo", status: "Pendiente", payment: "Vencido 5 días", badge: "bg-red-500/20 text-red-400", dot: "bg-orange-500" },
            { name: "Claudia Méndez", status: "✓ Check-in", payment: "Pagado · VIP", badge: "bg-violet-500/20 text-violet-400", dot: "bg-green-500" },
          ].map((p, i) => (
            <div key={i} className="flex items-center gap-2 rounded-md bg-white/[0.03] px-2.5 py-1.5 hover:bg-white/[0.06] cursor-pointer">
              <div className={cn("w-1.5 h-1.5 rounded-full flex-shrink-0", p.dot)} />
              <span className="text-[10px] text-white/70 flex-1 font-medium">{p.name}</span>
              <span className="text-[9px] text-white/30">{p.status}</span>
              <span className={cn("text-[9px] px-1.5 py-0.5 rounded-full", p.badge)}>{p.payment}</span>
            </div>
          ))}
        </div>
      </div>
    </MockupShell>
  )
}

function MockupFinanzas() {
  return (
    <MockupShell label="eleva.app/demo/finanzas">
      <div className="space-y-2.5">
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-lg bg-violet-500/10 border border-violet-500/20 p-2.5">
            <p className="text-[9px] text-violet-300/60">Ingreso total mes</p>
            <p className="text-xl font-black text-violet-300">$247k</p>
            <p className="text-[9px] text-green-400">↑ +12% vs anterior</p>
          </div>
          <div className="rounded-lg bg-white/[0.04] border border-white/5 p-2.5">
            <p className="text-[9px] text-white/30">Margen neto</p>
            <p className="text-xl font-black text-green-400">67%</p>
            <p className="text-[9px] text-white/20">$166k después de costos</p>
          </div>
        </div>
        <div className="rounded-lg bg-red-500/5 border border-red-500/15 p-2.5">
          <p className="text-[9px] text-red-400 font-bold mb-1.5">🔴 Anomalías detectadas — 3 altas</p>
          {[
            "Carlos P. — activo sin pago",
            "Héctor R. — comprobante duplicado",
            "Omar C. — beca sin autorización",
          ].map((a, i) => (
            <div key={i} className="flex items-center gap-1.5 mb-0.5">
              <AlertCircle className="w-2.5 h-2.5 text-red-400 flex-shrink-0" />
              <span className="text-[9px] text-white/40">{a}</span>
            </div>
          ))}
        </div>
        <div className="rounded-lg bg-white/[0.04] border border-white/5 p-2 flex items-center justify-between">
          <span className="text-[9px] text-white/30">Caja cerrada hoy</span>
          <span className="text-[9px] font-bold text-green-400">✓ Cuadrada</span>
        </div>
      </div>
    </MockupShell>
  )
}

function MockupCRM() {
  return (
    <MockupShell label="eleva.app/demo/crm">
      <div className="space-y-2.5">
        <div className="flex items-center gap-2.5 p-2.5 rounded-lg bg-white/[0.04] border border-white/5">
          <div className="w-8 h-8 rounded-full bg-violet-600 flex items-center justify-center text-white text-xs font-black flex-shrink-0">VR</div>
          <div className="flex-1 min-w-0">
            <p className="text-[11px] font-bold text-white">Valeria Romo</p>
            <p className="text-[9px] text-white/30">Vía Creania · Gen. Omega · Coach: Ana Torres</p>
          </div>
          <span className="text-[9px] bg-violet-500/20 text-violet-400 px-1.5 py-0.5 rounded-full font-semibold">84% momentum</span>
        </div>
        <div className="space-y-1">
          <p className="text-[9px] uppercase tracking-widest text-white/20 font-semibold">Historial de cursos</p>
          {[
            { c: "La Posibilidad — Despertar", d: "Feb 2025", s: "Completado" },
            { c: "La Imposibilidad — Expansión", d: "Abr 2025", s: "Completado" },
            { c: "Vía Creania", d: "En proceso", s: "Mes 3 de 5" },
          ].map((h, i) => (
            <div key={i} className="flex items-center justify-between px-2.5 py-1.5 rounded-md bg-white/[0.02]">
              <span className="text-[9px] text-white/50">{h.c}</span>
              <span className="text-[9px] text-white/25">{h.d}</span>
              <span className="text-[9px] text-green-400">{h.s}</span>
            </div>
          ))}
        </div>
        <div className="flex gap-1.5">
          {["WhatsApp", "Asignar tarea", "Ver pagos"].map((a) => (
            <button key={a} className="text-[9px] bg-white/5 border border-white/10 text-white/50 px-2 py-1 rounded-md">{a}</button>
          ))}
        </div>
      </div>
    </MockupShell>
  )
}

function MockupEquipo() {
  return (
    <MockupShell label="eleva.app/demo/equipo">
      <div className="space-y-2">
        {[
          { name: "Ana Torres", role: "Coach · Vía Creania", tareas: 4, contactos: 12, color: "bg-violet-600" },
          { name: "Marcos Ríos", role: "Coach · Despertar", tareas: 2, contactos: 8, color: "bg-indigo-600" },
          { name: "Sofía Vega", role: "Coach · Expansión", tareas: 6, contactos: 9, color: "bg-emerald-600" },
        ].map((m, i) => (
          <div key={i} className="flex items-center gap-2.5 p-2.5 rounded-lg bg-white/[0.04] border border-white/5">
            <div className={cn("w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-black flex-shrink-0", m.color)}>
              {m.name.split(" ").map(n => n[0]).join("")}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-bold text-white">{m.name}</p>
              <p className="text-[9px] text-white/30">{m.role}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-bold text-yellow-400">{m.tareas} tareas</p>
              <p className="text-[9px] text-white/30">{m.contactos} contactos hoy</p>
            </div>
          </div>
        ))}
        <div className="rounded-lg bg-yellow-500/5 border border-yellow-500/15 p-2">
          <p className="text-[9px] text-yellow-400">⚡ Sofía tiene 6 tareas abiertas — 2 vencidas</p>
        </div>
      </div>
    </MockupShell>
  )
}

function MockupGeneraciones() {
  return (
    <MockupShell label="eleva.app/demo/atencion">
      <div className="space-y-2">
        {[
          { name: "Gen. Omega", fase: "Vía Creania · Mes 3", participantes: 22, asistencia: 91, momentum: 84, color: "bg-violet-500" },
          { name: "Gen. Norte", fase: "Expansión · Semana 2", participantes: 18, asistencia: 78, momentum: 71, color: "bg-indigo-500" },
          { name: "Próxima gen.", fase: "Inscripciones abiertas", participantes: 14, asistencia: null, momentum: null, color: "bg-slate-600" },
        ].map((g, i) => (
          <div key={i} className="rounded-lg bg-white/[0.04] border border-white/5 p-2.5">
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-1.5">
                <div className={cn("w-2 h-2 rounded-full", g.color)} />
                <span className="text-[10px] font-bold text-white">{g.name}</span>
              </div>
              <span className="text-[9px] text-white/30">{g.fase}</span>
            </div>
            {g.momentum !== null && (
              <div className="flex gap-3">
                <div>
                  <p className="text-[8px] text-white/20">Participantes</p>
                  <p className="text-[11px] font-bold text-white/70">{g.participantes}</p>
                </div>
                <div>
                  <p className="text-[8px] text-white/20">Asistencia</p>
                  <p className="text-[11px] font-bold text-green-400">{g.asistencia}%</p>
                </div>
                <div>
                  <p className="text-[8px] text-white/20">Momentum</p>
                  <p className="text-[11px] font-bold text-violet-400">{g.momentum}%</p>
                </div>
              </div>
            )}
            {g.momentum === null && (
              <p className="text-[9px] text-white/30">{g.participantes} leads confirmados · 3 cupos disponibles</p>
            )}
          </div>
        ))}
      </div>
    </MockupShell>
  )
}

// ─── Section wrapper ──────────────────────────────────────────────────────────

function Section({ children, className }: { children: React.ReactNode; className?: string }) {
  const { ref, inView } = useInView()
  return (
    <div
      ref={ref}
      className={cn(
        "transition-all duration-700 ease-out",
        inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6",
        className
      )}
    >
      {children}
    </div>
  )
}

// ─── Funnel visualization ─────────────────────────────────────────────────────

function FunnelViz() {
  const steps = [
    { label: "Inscritos", n: 100, pct: 100, color: "bg-violet-600", lost: null },
    { label: "Confirmados", n: 78, pct: 78, color: "bg-indigo-500", lost: "22 no confirmaron" },
    { label: "Pagados", n: 61, pct: 61, color: "bg-blue-500", lost: "17 sin pago verificado" },
    { label: "Asistieron", n: 54, pct: 54, color: "bg-teal-500", lost: "7 no-shows" },
    { label: "Siguiente nivel", n: 31, pct: 31, color: "bg-green-500", lost: "23 sin enrolamiento" },
  ]
  return (
    <div className="space-y-1.5">
      {steps.map((s, i) => (
        <div key={s.label} className="flex items-center gap-3">
          <div className="w-24 text-right">
            <span className="text-xs text-white/50 font-medium">{s.label}</span>
          </div>
          <div className="flex-1 relative h-9 rounded-lg bg-white/[0.04] overflow-hidden border border-white/5">
            <div
              className={cn("h-full rounded-lg flex items-center px-3 transition-all duration-1000", s.color)}
              style={{ width: `${s.pct}%` }}
            >
              <span className="text-xs font-black text-white">{s.n}</span>
            </div>
          </div>
          <div className="w-36">
            {s.lost ? (
              <span className="text-[10px] text-red-400/70">−{s.lost}</span>
            ) : (
              <span className="text-[10px] text-white/20">base</span>
            )}
          </div>
        </div>
      ))}
      <div className="mt-4 p-3 rounded-xl bg-red-500/5 border border-red-500/15 text-center">
        <p className="text-sm font-bold text-red-400">69% de tus inscritos nunca llegan al siguiente nivel</p>
        <p className="text-xs text-white/30 mt-0.5">Sin sistema, esa fuga es invisible. Con ELEVA, tienes nombre, causa y responsable de cada uno.</p>
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function MetodoPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-[#080810] text-white">
      {/* ── Nav ───────────────────────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#080810]/90 backdrop-blur-xl border-b border-white/5">
        <div className="flex items-center justify-between px-6 py-3.5 max-w-6xl mx-auto">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-violet-600 flex items-center justify-center">
              <span className="text-white font-black text-sm">E</span>
            </div>
            <span className="font-black text-white text-base tracking-tight">ELEVA</span>
          </Link>
          <div className="flex items-center gap-2">
            <Link href="/precios" className="text-xs text-white/40 hover:text-white/80 transition-colors hidden sm:block px-3 py-1.5">Precios</Link>
            <Link href="/demo" className="flex items-center gap-1.5 px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white rounded-lg text-sm font-semibold transition-colors">
              Ver demo <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </nav>

      <main className="pt-20">

        {/* ── HERO ──────────────────────────────────────────────────────── */}
        <section className="relative overflow-hidden px-6 pt-20 pb-24 max-w-6xl mx-auto">
          {/* Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-violet-600/10 blur-[120px] rounded-full pointer-events-none" />

          <div className="relative z-10 text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-xs font-semibold mb-8">
              <Zap className="w-3 h-3" />
              Sistema operativo para centros de transformación
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[0.95] mb-6">
              Tu centro no necesita{" "}
              <span className="text-white/25 line-through decoration-red-500/60">más presión.</span>
              <br />
              <span className="bg-gradient-to-r from-violet-400 via-indigo-400 to-violet-300 bg-clip-text text-transparent">
                Necesita visibilidad.
              </span>
            </h1>

            <p className="text-lg text-white/50 leading-relaxed max-w-2xl mx-auto mb-10">
              ELEVA convierte tu operación diaria en un sistema claro: registro, pagos, seguimiento,
              generaciones, enrolamiento, incidencias, finanzas y desempeño del equipo.{" "}
              <strong className="text-white/80">Todo conectado. Todo auditable. Todo visible para el dueño.</strong>
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-16">
              <Link href="/demo" className="flex items-center gap-2 px-6 py-3.5 bg-violet-600 hover:bg-violet-500 text-white rounded-xl font-bold text-base transition-colors shadow-lg shadow-violet-600/25">
                Ver demo operativo <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/simulador" className="flex items-center gap-2 px-6 py-3.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 rounded-xl font-bold text-base transition-colors">
                Simular mi centro
              </Link>
            </div>

            {/* Dashboard mockup */}
            <div className="relative max-w-3xl mx-auto">
              <div className="absolute inset-0 bg-gradient-to-t from-[#080810] via-transparent to-transparent z-10 pointer-events-none" style={{ top: "60%" }} />
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
                <div className="lg:col-span-2"><MockupPulso /></div>
                <div><MockupFinanzas /></div>
              </div>
            </div>
          </div>
        </section>

        {/* ── SECCIÓN 1: ESTO TE PASA ───────────────────────────────────── */}
        <section className="px-6 py-24 max-w-6xl mx-auto">
          <Section>
            <div className="text-center mb-16">
              <p className="text-xs uppercase tracking-widest text-violet-400 font-bold mb-3">La realidad de operar un centro</p>
              <h2 className="text-4xl sm:text-5xl font-black tracking-tight mb-4">
                Probablemente esto <span className="text-white/30">te pasa.</span>
              </h2>
              <p className="text-white/40 max-w-xl mx-auto">
                No porque seas desorganizado. Sino porque ninguna herramienta existente fue diseñada para cómo funciona este negocio.
              </p>
            </div>
          </Section>

          <Section>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                {
                  icon: DollarSign,
                  color: "text-red-400",
                  bg: "border-red-500/15 bg-red-500/[0.04]",
                  title: "Pagos sin confirmar",
                  text: 'No sabes quién ya pagó, quién debe y quién "según ya transfirió". La cobranza depende de la memoria de alguien.',
                },
                {
                  icon: ClipboardList,
                  color: "text-orange-400",
                  bg: "border-orange-500/15 bg-orange-500/[0.04]",
                  title: "Mesa de registro improvisada",
                  text: "Check-in, pagos y confirmaciones viven entre WhatsApp, Excel y capturas de pantalla. Cada evento es el mismo caos.",
                },
                {
                  icon: GitMerge,
                  color: "text-yellow-400",
                  bg: "border-yellow-500/15 bg-yellow-500/[0.04]",
                  title: "Enrolamiento sin trazabilidad",
                  text: "La generación enrola, pero nadie sabe con precisión quién invitó a quién. No hay historial de compromisos ni seguimiento.",
                },
                {
                  icon: MessageCircle,
                  color: "text-blue-400",
                  bg: "border-blue-500/15 bg-blue-500/[0.04]",
                  title: "Conocimiento en conversaciones sueltas",
                  text: "Los coaches saben cosas importantes sobre cada participante, pero quedan en chats privados y notas de voz.",
                },
                {
                  icon: Eye,
                  color: "text-violet-400",
                  bg: "border-violet-500/15 bg-violet-500/[0.04]",
                  title: "El dueño se entera tarde",
                  text: "Pagos pendientes, bajas, errores, conflictos. Te llegó el reporte cuando ya era demasiado tarde para actuar.",
                },
                {
                  icon: Database,
                  color: "text-indigo-400",
                  bg: "border-indigo-500/15 bg-indigo-500/[0.04]",
                  title: "Cada evento empieza de cero",
                  text: "El entrenamiento deja aprendizaje operativo, pero no hay historial. El siguiente evento repite los mismos errores.",
                },
              ].map((item) => (
                <div key={item.title} className={cn("rounded-2xl border p-5 space-y-3", item.bg)}>
                  <item.icon className={cn("w-5 h-5", item.color)} />
                  <div>
                    <p className="font-bold text-white mb-1">{item.title}</p>
                    <p className="text-sm text-white/40 leading-relaxed">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </Section>

          <Section>
            <div className="mt-12 text-center">
              <div className="inline-block px-8 py-5 rounded-2xl bg-white/[0.03] border border-white/10">
                <p className="text-xl font-black text-white/90">
                  El problema no es tu metodología.
                </p>
                <p className="text-xl font-black text-violet-400">
                  Es que tu operación no tiene memoria.
                </p>
              </div>
            </div>
          </Section>
        </section>

        {/* ── SECCIÓN 2: LO QUE TE CUESTA ──────────────────────────────── */}
        <section className="px-6 py-24 bg-white/[0.02] border-y border-white/5">
          <div className="max-w-6xl mx-auto">
            <Section>
              <div className="text-center mb-16">
                <p className="text-xs uppercase tracking-widest text-red-400 font-bold mb-3">El costo invisible</p>
                <h2 className="text-4xl sm:text-5xl font-black tracking-tight mb-4">
                  Lo que te cuesta <span className="text-red-400">no ver.</span>
                </h2>
                <p className="text-white/40 max-w-2xl mx-auto">
                  Cada participante que se cae del proceso, cada pago sin verificar, cada coach sin visibilidad —
                  son recursos que tu centro pierde en silencio.
                </p>
              </div>
            </Section>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              <Section>
                <div className="space-y-3">
                  <p className="text-sm font-bold text-white/50 mb-4">En un centro típico sin sistema:</p>
                  {[
                    { icon: AlertCircle, color: "text-red-400", bg: "bg-red-500/10", stat: "18–25%", label: "de ingresos se pierden por cobranza tardía o sin seguimiento" },
                    { icon: TrendingDown, color: "text-orange-400", bg: "bg-orange-500/10", stat: "3.2 días", label: "promedio de retraso en detectar un pago vencido" },
                    { icon: Users, color: "text-yellow-400", bg: "bg-yellow-500/10", stat: "67%", label: "de centros usan WhatsApp como principal herramienta operativa" },
                    { icon: X, color: "text-red-400", bg: "bg-red-500/10", stat: "1 de 3", label: "participantes activos no confirma el siguiente entrenamiento a tiempo" },
                    { icon: Shield, color: "text-violet-400", bg: "bg-violet-500/10", stat: "40%", label: "de las becas otorgadas no tienen trazabilidad documental completa" },
                    { icon: AlertTriangle, color: "text-orange-400", bg: "bg-orange-500/10", stat: "5–8 hrs", label: "por evento que el staff duplica trabajo por falta de sistema central" },
                  ].map((s) => (
                    <div key={s.label} className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/5">
                      <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0", s.bg)}>
                        <s.icon className={cn("w-4 h-4", s.color)} />
                      </div>
                      <div>
                        <span className="text-base font-black text-white">{s.stat} </span>
                        <span className="text-sm text-white/40">{s.label}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </Section>

              <Section>
                <div className="space-y-4">
                  <p className="text-sm font-bold text-white/50">La fuga del proceso — de 100 inscritos:</p>
                  <FunnelViz />
                </div>
              </Section>
            </div>
          </div>
        </section>

        {/* ── SECCIÓN 3: LA SOLUCIÓN ────────────────────────────────────── */}
        <section className="px-6 py-24 max-w-6xl mx-auto">
          <Section>
            <div className="text-center mb-6">
              <p className="text-xs uppercase tracking-widest text-violet-400 font-bold mb-3">La solución</p>
              <h2 className="text-4xl sm:text-5xl font-black tracking-tight mb-4">
                Un sistema operativo{" "}
                <span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
                  para tu centro.
                </span>
              </h2>
              <p className="text-white/40 max-w-2xl mx-auto text-lg leading-relaxed">
                ELEVA centraliza lo que hoy está disperso: personas, pagos, generaciones, incidencias,
                equipo, campañas, eventos y seguimiento. No es otro CRM genérico. Es la infraestructura
                que esta industria nunca tuvo.
              </p>
            </div>
          </Section>

          <div className="space-y-20 mt-16">

            {/* Mesa de Registro */}
            <Section>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
                <div className="space-y-5">
                  <div className="w-10 h-10 rounded-xl bg-violet-500/20 border border-violet-500/30 flex items-center justify-center">
                    <ClipboardList className="w-5 h-5 text-violet-400" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-widest text-violet-400 font-bold mb-2">Módulo 01</p>
                    <h3 className="text-3xl font-black text-white mb-3">Mesa de Registro</h3>
                    <p className="text-white/40 leading-relaxed">
                      Un centro de control completo para el día del evento. Check-in en tiempo real, pagos, confirmaciones para el próximo entrenamiento e incidencias — todo en una sola pantalla.
                    </p>
                  </div>
                  <ul className="space-y-2">
                    {[
                      "Registro de llegada con un clic — sin papel",
                      "Estado de pago y comprobante por participante",
                      "Panel lateral con historial completo al seleccionar un nombre",
                      "Walk-ins registrados directamente al sistema",
                      "Filtros: check-in hoy, pago vencido, sin confirmar, incidencias",
                      "Quick actions: WhatsApp, beca, mover generación, inscribir al siguiente nivel",
                    ].map((b) => (
                      <li key={b} className="flex items-start gap-2 text-sm text-white/60">
                        <CheckCircle2 className="w-4 h-4 text-violet-400 flex-shrink-0 mt-0.5" />
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
                <MockupRegistro />
              </div>
            </Section>

            {/* Finanzas */}
            <Section>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
                <div className="lg:order-2 space-y-5">
                  <div className="w-10 h-10 rounded-xl bg-green-500/20 border border-green-500/30 flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-green-400" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-widest text-green-400 font-bold mb-2">Módulo 02</p>
                    <h3 className="text-3xl font-black text-white mb-3">Finanzas</h3>
                    <p className="text-white/40 leading-relaxed">
                      Ingresos, egresos, caja, becas, comprobantes y anomalías detectadas automáticamente. No necesitas perseguir a nadie para saber qué pasó. Cada peso tiene origen, responsable, comprobante y estado.
                    </p>
                  </div>
                  <ul className="space-y-2">
                    {[
                      "Dashboard de dueño: MRR, cobrado vs pendiente, margen neto",
                      "P&L simplificado por mes y por generación",
                      "Detección automática de anomalías cada 24h",
                      "Registro de becas con autorización y trazabilidad",
                      "Caja abierta/cerrada con diferencias detectadas",
                      "Historial completo auditable por responsable",
                    ].map((b) => (
                      <li key={b} className="flex items-start gap-2 text-sm text-white/60">
                        <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="lg:order-1"><MockupFinanzas /></div>
              </div>
            </Section>

            {/* CRM */}
            <Section>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
                <div className="space-y-5">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center">
                    <Database className="w-5 h-5 text-indigo-400" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-widest text-indigo-400 font-bold mb-2">Módulo 03</p>
                    <h3 className="text-3xl font-black text-white mb-3">CRM Vivo</h3>
                    <p className="text-white/40 leading-relaxed">
                      Historial completo de cada participante desde su primer contacto hasta hoy. Cursos, pagos, referidos, notas del coach, incidencias y estado de seguimiento — en un solo expediente.
                    </p>
                  </div>
                  <ul className="space-y-2">
                    {[
                      "Journey completo por participante: lead → graduado",
                      "Historial de cursos, pagos y comprobantes",
                      "Notas internas del coach accesibles al equipo",
                      "Tracking de referidos y enrolamiento",
                      "Estados: activo, en seguimiento, en riesgo, inactivo",
                      "Acciones rápidas: WhatsApp, tarea, incidencia, mover nivel",
                    ].map((b) => (
                      <li key={b} className="flex items-start gap-2 text-sm text-white/60">
                        <CheckCircle2 className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" />
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
                <MockupCRM />
              </div>
            </Section>

            {/* Generaciones */}
            <Section>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
                <div className="lg:order-2 space-y-5">
                  <div className="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-500/30 flex items-center justify-center">
                    <Layers className="w-5 h-5 text-teal-400" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-widest text-teal-400 font-bold mb-2">Módulo 04</p>
                    <h3 className="text-3xl font-black text-white mb-3">Generaciones</h3>
                    <p className="text-white/40 leading-relaxed">
                      Cada cohorte como una unidad viva: fase actual, asistencia, momentum, conversión al siguiente nivel y rentabilidad individual. El dueño ve todas las generaciones de un vistazo.
                    </p>
                  </div>
                  <ul className="space-y-2">
                    {[
                      "Vista de todas las generaciones activas y próximas",
                      "Momentum por cohorte con histórico de tendencia",
                      "Asistencia por sesión con alertas de riesgo",
                      "Avance por participante en cada fase del programa",
                      "Conversión a siguiente nivel por generación",
                      "Rentabilidad por generación en finanzas",
                    ].map((b) => (
                      <li key={b} className="flex items-start gap-2 text-sm text-white/60">
                        <CheckCircle2 className="w-4 h-4 text-teal-400 flex-shrink-0 mt-0.5" />
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="lg:order-1"><MockupGeneraciones /></div>
              </div>
            </Section>

            {/* Equipo */}
            <Section>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
                <div className="space-y-5">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center">
                    <Users className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-widest text-amber-400 font-bold mb-2">Módulo 05</p>
                    <h3 className="text-3xl font-black text-white mb-3">Equipo</h3>
                    <p className="text-white/40 leading-relaxed">
                      Actividad de cada coach, tareas asignadas, contactos del día y participantes bajo su cargo. El dueño ve quién está haciendo qué, sin microgestión.
                    </p>
                  </div>
                  <ul className="space-y-2">
                    {[
                      "Perfil operativo de cada coach y staff",
                      "Tareas asignadas con fecha y responsable",
                      "Contactos del día y seguimientos pendientes",
                      "Alertas de tareas vencidas o sin atender",
                      "Log de actividad: notas, pagos registrados, check-ins",
                      "Visibilidad del dueño sin apps externas",
                    ].map((b) => (
                      <li key={b} className="flex items-start gap-2 text-sm text-white/60">
                        <CheckCircle2 className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
                <MockupEquipo />
              </div>
            </Section>

            {/* Módulos restantes — grid compacto */}
            <Section>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  {
                    icon: GitMerge,
                    color: "text-pink-400",
                    bg: "border-pink-500/15",
                    num: "06",
                    title: "Pipeline Enrolamiento",
                    text: "Tracking de quién comprometió a quién, en qué nivel y cuándo. Becas con trazabilidad completa. Conversión visible en tiempo real.",
                  },
                  {
                    icon: MessageCircle,
                    color: "text-blue-400",
                    bg: "border-blue-500/15",
                    num: "07",
                    title: "Campañas",
                    text: "WhatsApp y email para confirmación de asistencia, cobranza, reactivación y recordatorios de próximo entrenamiento.",
                  },
                  {
                    icon: Activity,
                    color: "text-violet-400",
                    bg: "border-violet-500/15",
                    num: "08",
                    title: "Dashboard del Dueño",
                    text: "Pulso del centro en tiempo real. Sin perseguir reportes ni depender de que alguien te cuente. Alertas, métricas y decisiones.",
                  },
                  {
                    icon: Calendar,
                    color: "text-teal-400",
                    bg: "border-teal-500/15",
                    num: "09",
                    title: "Pre-Entrenamiento",
                    text: "Preparación de cada evento: logística, materiales, confirmaciones de participantes, asignación de staff y sala.",
                  },
                  {
                    icon: Globe,
                    color: "text-indigo-400",
                    bg: "border-indigo-500/15",
                    num: "10",
                    title: "Hub de Comunidad",
                    text: "Feed interno del centro: logros, anuncios, momentos del entrenamiento. Comunidad que se queda conectada entre eventos.",
                  },
                  {
                    icon: TrendingUp,
                    color: "text-green-400",
                    bg: "border-green-500/15",
                    num: "11",
                    title: "Simulador de Crecimiento",
                    text: "Proyección de revenue: ¿cuánto facturas si subes cuota, agregas generación o mejoras retención? Números antes de decidir.",
                  },
                ].map((m) => (
                  <div key={m.title} className={cn("rounded-2xl border bg-white/[0.02] p-5 space-y-3 hover:bg-white/[0.04] transition-colors", m.bg)}>
                    <div className="flex items-center gap-2">
                      <m.icon className={cn("w-4 h-4", m.color)} />
                      <span className={cn("text-[10px] font-bold uppercase tracking-wider", m.color)}>Módulo {m.num}</span>
                    </div>
                    <p className="font-bold text-white">{m.title}</p>
                    <p className="text-sm text-white/40 leading-relaxed">{m.text}</p>
                  </div>
                ))}
              </div>
            </Section>
          </div>
        </section>

        {/* ── SECCIÓN 4: CÓMO SE SIENTE ─────────────────────────────────── */}
        <section className="px-6 py-24 bg-gradient-to-b from-transparent via-violet-950/10 to-transparent">
          <div className="max-w-6xl mx-auto">
            <Section>
              <div className="text-center mb-16">
                <p className="text-xs uppercase tracking-widest text-violet-400 font-bold mb-3">La diferencia real</p>
                <h2 className="text-4xl sm:text-5xl font-black tracking-tight mb-6">
                  Cómo se siente operar{" "}
                  <span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">con ELEVA.</span>
                </h2>
                <p className="text-lg text-white/40 max-w-2xl mx-auto leading-relaxed">
                  Imagina llegar al fin de semana y saber exactamente quién viene, quién pagó, quién falta de confirmar, quién trae saldo, quién lo invitó, qué incidencia tiene y qué acción sigue.
                </p>
              </div>
            </Section>

            <Section>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Antes */}
                <div className="rounded-2xl border border-red-500/20 bg-red-500/[0.03] p-8">
                  <div className="flex items-center gap-2 mb-6">
                    <X className="w-5 h-5 text-red-400" />
                    <h3 className="text-xl font-black text-red-400">Antes de ELEVA</h3>
                  </div>
                  <ul className="space-y-3.5">
                    {[
                      "WhatsApp como herramienta de operación principal",
                      "Excel con datos desactualizados o incompletos",
                      "Capturas de transferencias sin registrar",
                      "Memoria del dueño o de un staff como fuente de verdad",
                      "Reportes preparados el día anterior al evento",
                      "Llamadas para saber quién viene, quién pagó y quién falta",
                      "Incidencias sin seguimiento, resueltas 'de palabra'",
                      "Coaches con información desconectada entre sí",
                      "El dueño tomando decisiones sin datos",
                      "Cada evento termina y nadie documenta qué pasó",
                    ].map((b) => (
                      <li key={b} className="flex items-start gap-2.5 text-sm text-white/40">
                        <div className="w-4 h-4 rounded-full border border-red-500/40 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <div className="w-1.5 h-1.5 rounded-full bg-red-500/50" />
                        </div>
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Después */}
                <div className="rounded-2xl border border-violet-500/20 bg-violet-500/[0.03] p-8">
                  <div className="flex items-center gap-2 mb-6">
                    <CheckCircle2 className="w-5 h-5 text-violet-400" />
                    <h3 className="text-xl font-black text-violet-400">Con ELEVA</h3>
                  </div>
                  <ul className="space-y-3.5">
                    {[
                      "Un solo sistema accesible desde cualquier dispositivo",
                      "Datos actualizados en tiempo real por todo el equipo",
                      "Cada pago con comprobante, responsable y estado",
                      "Historial de cada participante siempre disponible",
                      "Dashboard listo antes de que empiece el evento",
                      "Estado de asistencia, pago y confirmación en una vista",
                      "Incidencias con responsable, seguimiento y resolución",
                      "Coaches alineados con las mismas notas y contexto",
                      "El dueño toma decisiones con datos actualizados hoy",
                      "Cada evento deja un registro operativo completo",
                    ].map((b) => (
                      <li key={b} className="flex items-start gap-2.5 text-sm text-white/70">
                        <CheckCircle2 className="w-4 h-4 text-violet-400 flex-shrink-0 mt-0.5" />
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Section>
          </div>
        </section>

        {/* ── SECCIÓN 5: EL DUEÑO RECUPERA CONTROL ─────────────────────── */}
        <section className="px-6 py-24 max-w-6xl mx-auto">
          <Section>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-6">
                <div>
                  <p className="text-xs uppercase tracking-widest text-violet-400 font-bold mb-3">Para el dueño</p>
                  <h2 className="text-4xl sm:text-5xl font-black tracking-tight mb-4">
                    El dueño recupera{" "}
                    <span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">control.</span>
                  </h2>
                  <p className="text-white/40 leading-relaxed text-lg">
                    No se trata de desconfiar de tu equipo. Se trata de que el sistema cuide la operación para que tú puedas enfocarte en lo que importa.
                  </p>
                </div>

                <div className="space-y-2">
                  {[
                    { icon: DollarSign, color: "text-green-400", bg: "bg-green-500/10", text: "Cada pago tiene responsable y comprobante." },
                    { icon: Star, color: "text-violet-400", bg: "bg-violet-500/10", text: "Cada beca tiene autorización registrada." },
                    { icon: TrendingDown, color: "text-blue-400", bg: "bg-blue-500/10", text: "Cada gasto tiene categoría y evidencia." },
                    { icon: AlertCircle, color: "text-orange-400", bg: "bg-orange-500/10", text: "Cada incidencia tiene seguimiento y resolución." },
                    { icon: Database, color: "text-indigo-400", bg: "bg-indigo-500/10", text: "Cada participante tiene historial completo." },
                    { icon: BarChart3, color: "text-teal-400", bg: "bg-teal-500/10", text: "Cada generación tiene rentabilidad medible." },
                    { icon: Shield, color: "text-violet-400", bg: "bg-violet-500/10", text: "Cada anomalía es detectada antes de que escale." },
                    { icon: Eye, color: "text-white", bg: "bg-white/10", text: "El dueño ve todo. Sin perseguir a nadie." },
                  ].map((item) => (
                    <div key={item.text} className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/5">
                      <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0", item.bg)}>
                        <item.icon className={cn("w-3.5 h-3.5", item.color)} />
                      </div>
                      <span className="text-sm text-white/70">{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div className="rounded-2xl border border-violet-500/20 bg-violet-500/5 p-7">
                  <div className="text-4xl mb-4">📱</div>
                  <p className="text-xl font-black text-white mb-3">El mensaje que el dueño merece recibir</p>
                  <div className="space-y-2 text-sm text-white/50 leading-relaxed border-l-2 border-violet-500/40 pl-4">
                    <p>"No necesitas perseguir a nadie para saber qué pasó.</p>
                    <p>Cada peso tiene origen, responsable, comprobante y estado.</p>
                    <p>Cada persona tiene historial, coach y siguiente paso.</p>
                    <p className="text-violet-300 font-semibold">Eso es ELEVA."</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: "Reducción en tiempo de cobranza", value: "−71%", color: "text-green-400" },
                    { label: "Anomalías detectadas a tiempo", value: "100%", color: "text-violet-400" },
                    { label: "Eventos con cierre de caja limpio", value: "97%", color: "text-teal-400" },
                    { label: "Coaches con contexto actualizado", value: "3× más", color: "text-indigo-400" },
                  ].map((s) => (
                    <div key={s.label} className="rounded-xl bg-white/[0.04] border border-white/5 p-4 text-center">
                      <p className={cn("text-2xl font-black", s.color)}>{s.value}</p>
                      <p className="text-[10px] text-white/30 mt-1 leading-tight">{s.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Section>
        </section>

        {/* ── SECCIÓN 6: ENROLAMIENTO A ECOSISTEMA ─────────────────────── */}
        <section className="px-6 py-24 bg-white/[0.02] border-y border-white/5">
          <div className="max-w-6xl mx-auto">
            <Section>
              <div className="text-center mb-16">
                <p className="text-xs uppercase tracking-widest text-indigo-400 font-bold mb-3">La filosofía</p>
                <h2 className="text-4xl sm:text-5xl font-black tracking-tight mb-4">
                  De enrolamiento{" "}
                  <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
                    a ecosistema.
                  </span>
                </h2>
                <p className="text-white/40 max-w-2xl mx-auto text-lg leading-relaxed">
                  ELEVA no reemplaza el enrolamiento. Lo profesionaliza. El resultado no es más ventas — es más claridad, más impacto sostenible y un centro que crece sin depender de que todo salga perfecto.
                </p>
              </div>
            </Section>

            <Section>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { icon: "🎯", title: "Leads nutridos antes de vender", text: "CRM con historial de contacto, evento de origen y nivel de interés. El staff sabe exactamente dónde está cada prospecto." },
                  { icon: "📋", title: "Compromisos con nombre", text: "El pipeline de enrolamiento muestra quién comprometió a quién, en qué nivel y cuándo. No hay compromisos que se pierdan en conversaciones." },
                  { icon: "✅", title: "Confirmaciones sin perseguir", text: "Campañas automáticas de confirmación, recordatorios y seguimiento por WhatsApp. Menos llamadas, más respuestas." },
                  { icon: "🎓", title: "Seguimiento post-entrenamiento", text: "Cada graduado tiene un estado claro. Los coaches saben quién está listo para el siguiente nivel antes de que ellos mismos lo pregunten." },
                  { icon: "🏅", title: "Becas como reconocimiento real", text: "Cada beca otorgada tiene autorización, registros del evento que la generó y trazabilidad de uso. No más dudas sobre si alguien 'ya gastó su beca'." },
                  { icon: "🌱", title: "Crecimiento sin perder el alma", text: "Más participantes, más generaciones, más revenue — pero con la misma calidad de acompañamiento. El sistema opera la escala, tú el impacto." },
                ].map((item) => (
                  <div key={item.title} className="rounded-2xl border border-white/8 bg-white/[0.02] p-5 hover:bg-white/[0.04] transition-colors">
                    <div className="text-2xl mb-3">{item.icon}</div>
                    <p className="font-bold text-white mb-2">{item.title}</p>
                    <p className="text-sm text-white/40 leading-relaxed">{item.text}</p>
                  </div>
                ))}
              </div>
            </Section>
          </div>
        </section>

        {/* ── CIERRE ────────────────────────────────────────────────────── */}
        <section className="px-6 py-32 text-center relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-violet-600/15 blur-[100px] rounded-full pointer-events-none" />
          <div className="relative z-10 max-w-3xl mx-auto">
            <Section>
              <div className="space-y-8">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-xs font-semibold">
                  <Star className="w-3 h-3" />
                  Demo disponible hoy
                </div>
                <h2 className="text-5xl sm:text-6xl font-black tracking-tight">
                  Tu centro ya{" "}
                  <span className="bg-gradient-to-r from-violet-400 via-indigo-400 to-violet-300 bg-clip-text text-transparent">
                    transforma vidas.
                  </span>
                </h2>
                <p className="text-2xl font-black text-white/50">
                  Ahora dale una operación a la altura.
                </p>
                <p className="text-white/30 max-w-xl mx-auto leading-relaxed">
                  ELEVA ya está corriendo. Puedes ver el sistema operativo completo en el demo de Creania Transformación — con datos reales de operación, finanzas, equipo y participantes.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
                  <Link href="/demo" className="flex items-center gap-2 px-8 py-4 bg-violet-600 hover:bg-violet-500 text-white rounded-xl font-bold text-lg transition-colors shadow-xl shadow-violet-600/30">
                    Ver demo operativo <ArrowRight className="w-5 h-5" />
                  </Link>
                  <Link href="/build" className="flex items-center gap-2 px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 rounded-xl font-bold text-lg transition-colors">
                    Diagnosticar mi centro
                  </Link>
                </div>
                <div className="flex items-center justify-center gap-6 pt-4">
                  {["Sin contratos anuales", "Onboarding incluido", "Soporte directo"].map((t) => (
                    <div key={t} className="flex items-center gap-1.5 text-xs text-white/30">
                      <CheckCircle2 className="w-3 h-3 text-violet-500" />
                      {t}
                    </div>
                  ))}
                </div>
              </div>
            </Section>
          </div>
        </section>

        {/* ── Footer mínimo ──────────────────────────────────────────────── */}
        <footer className="border-t border-white/5 px-6 py-8">
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-violet-600 flex items-center justify-center">
                <span className="text-white font-black text-xs">E</span>
              </div>
              <span className="font-black text-white/60 text-sm">ELEVA</span>
            </div>
            <div className="flex items-center gap-4 text-xs text-white/20">
              <Link href="/precios" className="hover:text-white/50 transition-colors">Precios</Link>
              <Link href="/demo" className="hover:text-white/50 transition-colors">Demo</Link>
              <Link href="/build" className="hover:text-white/50 transition-colors">Diagnóstico</Link>
              <Link href="/simulador" className="hover:text-white/50 transition-colors">Simulador</Link>
            </div>
            <p className="text-xs text-white/15">© 2025 ELEVA. Sistema operativo para centros de transformación.</p>
          </div>
        </footer>

      </main>
    </div>
  )
}
