"use client"

import Link from "next/link"
import { useState, useEffect, useRef } from "react"
import {
  ArrowRight,
  CheckCircle2,
  Brain,
  Activity,
  Users,
  Zap,
  TrendingUp,
  ChevronRight,
  BarChart3,
  MessageCircle,
  Calendar,
  BookOpen,
  Target,
  Globe,
  Layers,
  X,
  DollarSign,
  ClipboardList,
  GitMerge,
  Database,
  ShieldCheck,
  Send,
  Video,
  LayoutDashboard,
} from "lucide-react"
import { cn } from "@/lib/utils"

// ─── Hook ─────────────────────────────────────────────────────────────────────

function useInView(threshold = 0.12) {
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

// ─── Section wrapper ──────────────────────────────────────────────────────────

function Section({ children, className }: { children: React.ReactNode; className?: string }) {
  const { ref, inView } = useInView()
  return (
    <div
      ref={ref}
      className={cn(
        "transition-all duration-700",
        inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8",
        className
      )}
    >
      {children}
    </div>
  )
}

// ─── Mockup shell ─────────────────────────────────────────────────────────────

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

// ─── Mockup: Pre-entrenamiento ────────────────────────────────────────────────

function MockupPreEntrenamiento() {
  const dias = [
    { dia: "Día 1",  tipo: "Video",       titulo: "Conoce a tu coach",             canal: "WhatsApp", estado: "enviado",     done: true },
    { dia: "Día 3",  tipo: "Correo",      titulo: "Qué traer al básico",           canal: "Email",    estado: "enviado",     done: true },
    { dia: "Día 6",  tipo: "Video",       titulo: "Historia de un participante",   canal: "WhatsApp", estado: "enviado",     done: true },
    { dia: "Día 10", tipo: "Recurso",     titulo: "Preguntas para reflexionar",    canal: "Email",    estado: "enviado",     done: true },
    { dia: "Día 13", tipo: "Recordatorio",titulo: "Mañana es tu básico",           canal: "WhatsApp", estado: "programado",  done: false },
    { dia: "Día 15", tipo: "Check-in",    titulo: "¿Listo para transformarte?",   canal: "WhatsApp", estado: "programado",  done: false },
  ]
  return (
    <MockupShell label="eleva.app / pre-entrenamiento · Valeria Romo">
      <div className="space-y-2">
        <div className="flex items-center justify-between mb-3">
          <p className="text-[10px] text-white/40 uppercase tracking-wider font-semibold">Secuencia de 15 días</p>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-violet-600/20 text-violet-300 border border-violet-500/20">4/6 enviados</span>
        </div>
        {dias.map((d) => (
          <div key={d.dia} className="flex items-center gap-3 py-1.5 border-b border-white/[0.04]">
            <span className="text-[9px] text-white/25 w-10 flex-shrink-0 font-mono">{d.dia}</span>
            <div className="flex-1 min-w-0">
              <p className="text-[11px] text-white/80 font-medium truncate">{d.titulo}</p>
              <p className="text-[9px] text-white/30">{d.tipo} · {d.canal}</p>
            </div>
            <span className={cn("text-[9px] font-semibold", d.done ? "text-green-400" : "text-yellow-400")}>{d.estado}</span>
          </div>
        ))}
      </div>
    </MockupShell>
  )
}

// ─── Mockup: Necesitan atención ───────────────────────────────────────────────

function MockupAtencion() {
  const participantes = [
    { nombre: "Carlos Peñafiel", dias: 8, motivo: "Sin llamada de coaching",  accion: "Contactar hoy",        urgencia: "alta"  },
    { nombre: "Paola Serrano",   dias: 5, motivo: "Tarea no entregada",       accion: "Verificar compromiso", urgencia: "media" },
    { nombre: "Omar Castillo",   dias: 4, motivo: "Pago pendiente",           accion: "Enviar recordatorio",  urgencia: "media" },
    { nombre: "Sofía Méndez",    dias: 2, motivo: "Sin asistencia",           accion: "Check-in WhatsApp",    urgencia: "baja"  },
  ]
  const colores: Record<string, string> = {
    alta:  "text-red-400 bg-red-500/10 border-red-500/20",
    media: "text-orange-400 bg-orange-500/10 border-orange-500/20",
    baja:  "text-yellow-400 bg-yellow-500/10 border-yellow-500/20",
  }
  return (
    <MockupShell label="eleva.app / necesitan atención hoy">
      <div className="space-y-2.5">
        <div className="flex items-center justify-between mb-3">
          <p className="text-[10px] text-white/40 uppercase tracking-wider font-semibold">14 participantes detectados</p>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-500/15 text-red-400 border border-red-500/20">Intervención recomendada</span>
        </div>
        {participantes.map((p) => (
          <div key={p.nombre} className="flex items-start gap-3 py-1.5 border-b border-white/[0.04]">
            <div className="w-7 h-7 rounded-full bg-white/[0.06] flex items-center justify-center text-[10px] text-white/40 font-semibold flex-shrink-0 mt-0.5">
              {p.nombre.split(" ").map((n) => n[0]).join("").slice(0, 2)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[11px] text-white/80 font-medium">{p.nombre}</p>
              <p className="text-[9px] text-white/30">{p.motivo} · {p.dias}d sin actividad</p>
            </div>
            <span className={cn("text-[9px] font-semibold px-2 py-0.5 rounded-full border flex-shrink-0", colores[p.urgencia])}>
              {p.accion}
            </span>
          </div>
        ))}
      </div>
    </MockupShell>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

// ─── Module data ─────────────────────────────────────────────────────────────

const MODULOS = [
  {
    num: "01",
    icon: ClipboardList,
    nombre: "Mesa de Registro",
    tagline: "El día del evento, sin caos.",
    descripcion: "Check-in en tiempo real, registro de pagos, confirmaciones para el siguiente entrenamiento e incidencias — todo en una sola pantalla. Sin papeles, sin hojas de Excel, sin información perdida.",
    bullets: ["Check-in por nombre, QR o búsqueda rápida", "Registro de pago y comprobante en el momento", "Confirmación automática para el siguiente nivel", "Incidencias documentadas con foto y seguimiento", "Reporte en tiempo real para el dueño", "Historial completo por participante"],
    color: "violet",
  },
  {
    num: "02",
    icon: DollarSign,
    nombre: "Finanzas",
    tagline: "Cada peso con origen, responsable y estado.",
    descripcion: "MRR, P&L, caja, becas, comprobantes y anomalías detectadas automáticamente. No necesitas perseguir a nadie para saber qué pasó con el dinero del centro.",
    bullets: ["Dashboard MRR por generación y mes", "P&L con costos de equipo y margen neto", "Detección automática de anomalías", "Gestión de becas con autorización y seguimiento", "Conciliación de caja post-evento", "Historial auditable de cada transacción"],
    color: "green",
  },
  {
    num: "03",
    icon: Database,
    nombre: "CRM Vivo",
    tagline: "El expediente completo de cada persona.",
    descripcion: "Historial desde el primer contacto hasta hoy: cursos, pagos, referidos, notas del coach, incidencias y estado de seguimiento. Nada se pierde aunque cambie el coach o la administración.",
    bullets: ["Timeline de toda la relación con el participante", "Notas del coach enlazadas a cada sesión", "Registro de referidos y origen del contacto", "Estado de pagos e historial financiero", "Incidencias y resoluciones documentadas", "Exportable para análisis externos"],
    color: "blue",
  },
  {
    num: "04",
    icon: GitMerge,
    nombre: "Generaciones",
    tagline: "Cada cohorte como una unidad viva.",
    descripcion: "Fase actual, asistencia, momentum, conversión al siguiente nivel y rentabilidad por generación. Ves de un vistazo cuál generación necesita atención y cuál está en su mejor momento.",
    bullets: ["Fase actual y progreso de cada cohorte", "Momentum score en tiempo real", "Tasa de asistencia y participación", "Conversión fase a fase por generación", "Rentabilidad individual y grupal", "Alertas automáticas de generaciones en riesgo"],
    color: "violet",
  },
  {
    num: "05",
    icon: ShieldCheck,
    nombre: "Visibilidad de Equipo",
    tagline: "El dueño sabe quién está haciendo qué.",
    descripcion: "Actividad de cada coach, tareas asignadas, contactos del día y participantes bajo su cargo. Visibilidad sin microgestión — sabes el estado de tu equipo sin necesitar una junta para preguntarlo.",
    bullets: ["Panel de actividad por coach en tiempo real", "Tareas asignadas y estado de cumplimiento", "Participantes asignados y su momentum", "Contactos del día y respuesta pendiente", "Historial de notas y sesiones por coach", "Comparativo de desempeño del equipo"],
    color: "orange",
  },
  {
    num: "06",
    icon: GitMerge,
    nombre: "Pipeline Enrolamiento",
    tagline: "La conversión visible de principio a fin.",
    descripcion: "Cada invitado, cada compromiso, cada confirmación — rastreado. El pipeline convierte el enrolamiento de una actividad de intuición a un proceso medible con etapas, responsables y fechas.",
    bullets: ["Etapas: invitado → comprometido → confirmado → inscrito", "Responsable y fecha de compromiso por lead", "Becas como parte del pipeline, no aparte", "Seguimiento automático a los 24, 48 y 72 horas", "Conversión por coach y por generación", "Reporte de enrolamiento para el dueño"],
    color: "blue",
  },
  {
    num: "07",
    icon: Send,
    nombre: "Campañas",
    tagline: "Comunicación que llega en el momento correcto.",
    descripcion: "Correos, WhatsApp y notificaciones enviados automáticamente según el estado del participante. Sin depender de que alguien recuerde enviar el mensaje del lunes.",
    bullets: ["Secuencias automáticas por etapa del participante", "Templates de correo y WhatsApp editables", "Segmentación por generación, fase y comportamiento", "Recordatorios de pago sin intervención humana", "Campañas de reactivación para inactivos", "Métricas de apertura y respuesta"],
    color: "green",
  },
  {
    num: "08",
    icon: LayoutDashboard,
    nombre: "Dashboard del Dueño",
    tagline: "El pulso del centro en 30 segundos.",
    descripcion: "Todo lo que importa en una pantalla: participantes activos, ingresos del mes, generaciones en curso, alertas de atención y momentum general. Entra, revisa, decide — sin buscar en cinco lugares distintos.",
    bullets: ["KPIs principales al abrir la app", "Alertas priorizadas por urgencia", "Momentum por generación en tiempo real", "Ingresos cobrados vs pendientes del mes", "Próximos eventos y confirmaciones", "Acceso rápido a cualquier módulo"],
    color: "violet",
  },
  {
    num: "09",
    icon: Users,
    nombre: "Pre-Entrenamiento",
    tagline: "15 días que cambian el resultado del básico.",
    descripcion: "Secuencia automática de contenido para los participantes inscritos antes de su primer entrenamiento. Videos de coaches, recursos de reflexión, comunicaciones por WhatsApp y correo. Llegan listos.",
    bullets: ["Secuencia de 15 días totalmente automatizada", "Videos introductorios de cada coach", "Recursos de reflexión y preparación mental", "Comunicaciones por WhatsApp y correo", "Tracking de recursos abiertos y vistos", "Activación antes de pisar el salón"],
    color: "orange",
  },
  {
    num: "10",
    icon: Globe,
    nombre: "Hub de Comunidad",
    tagline: "El centro que no termina cuando termina el entrenamiento.",
    descripcion: "Módulos de coaching personal, especialistas, webinars y grupos de práctica para mantener activos a participantes y graduados. La comunidad como motor de retención y crecimiento.",
    bullets: ["Booking de sesiones de coaching personal", "Red de especialistas por área de vida", "Calendario de webinars y eventos virtuales", "Grupos de práctica por fase y generación", "Contenido exclusivo para graduados", "Identificación automática de champions"],
    color: "green",
  },
  {
    num: "11",
    icon: BarChart3,
    nombre: "Simulador de Crecimiento",
    tagline: "Proyecta el futuro antes de tomarlo.",
    descripcion: "Modela el impacto de cada decisión: subir la cuota, abrir una nueva generación, cambiar el número de coaches, agregar un nuevo programa. Ve el efecto en ingresos y retención antes de ejecutar.",
    bullets: ["Proyección de MRR a 6 y 12 meses", "Simulador de ROI por módulo", "Modela nuevas generaciones y cuotas", "Impacto de cambios en el equipo", "Benchmarks del sector integrados", "Exportable para presentar a socios o inversionistas"],
    color: "blue",
  },
]

const COLOR_MAP: Record<string, { pill: string; border: string; bg: string; text: string; bullet: string }> = {
  violet: { pill: "bg-violet-600/15 border-violet-500/25 text-violet-300", border: "border-violet-500/20", bg: "bg-violet-600/[0.06]", text: "text-violet-400", bullet: "bg-violet-500/20 text-violet-400" },
  blue:   { pill: "bg-blue-600/15 border-blue-500/25 text-blue-300",       border: "border-blue-500/20",   bg: "bg-blue-600/[0.06]",   text: "text-blue-400",   bullet: "bg-blue-500/20 text-blue-400"   },
  green:  { pill: "bg-emerald-600/15 border-emerald-500/25 text-emerald-300", border: "border-emerald-500/20", bg: "bg-emerald-600/[0.06]", text: "text-emerald-400", bullet: "bg-emerald-500/20 text-emerald-400" },
  orange: { pill: "bg-orange-500/15 border-orange-500/25 text-orange-300", border: "border-orange-500/20", bg: "bg-orange-500/[0.06]",  text: "text-orange-400", bullet: "bg-orange-500/20 text-orange-400" },
}

type Modulo = typeof MODULOS[number]

// ─── Module modal ─────────────────────────────────────────────────────────────

function ModuleModal({ mod, onClose }: { mod: Modulo; onClose: () => void }) {
  const c = COLOR_MAP[mod.color]
  const Icon = mod.icon
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose() }
    document.addEventListener("keydown", handler)
    return () => document.removeEventListener("keydown", handler)
  }, [onClose])
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className={cn("relative w-full max-w-lg rounded-3xl border p-8 bg-[#0d0d18] shadow-2xl shadow-black/80", c.border)}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/[0.06] hover:bg-white/[0.12] flex items-center justify-center transition-colors"
        >
          <X className="w-4 h-4 text-white/50" />
        </button>

        <div className={cn("inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-bold uppercase tracking-wider mb-5", c.pill)}>
          <span className="font-black">{mod.num}</span>
          {mod.nombre}
        </div>

        <div className={cn("w-12 h-12 rounded-2xl border flex items-center justify-center mb-5", c.bg, c.border)}>
          <Icon className={cn("w-6 h-6", c.text)} />
        </div>

        <h3 className="text-2xl font-black text-white mb-2">{mod.nombre}</h3>
        <p className={cn("text-sm font-semibold mb-4", c.text)}>{mod.tagline}</p>
        <p className="text-sm text-white/50 leading-relaxed mb-6">{mod.descripcion}</p>

        <div className="grid grid-cols-1 gap-2">
          {mod.bullets.map((b) => (
            <div key={b} className="flex items-start gap-2.5">
              <div className={cn("w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5", c.bullet)}>
                <CheckCircle2 className="w-3 h-3" />
              </div>
              <span className="text-sm text-white/60">{b}</span>
            </div>
          ))}
        </div>

        <div className="mt-8 pt-6 border-t border-white/8">
          <Link
            href="/vl2026"
            onClick={onClose}
            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-sm transition-colors"
          >
            Ver este módulo en el demo <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function MetodoPage() {
  const [selectedModule, setSelectedModule] = useState<Modulo | null>(null)
  const [activePhase, setActivePhase] = useState<string | null>(null)
  const adquisicionRef = useRef<HTMLElement>(null)
  const activacionRef  = useRef<HTMLElement>(null)
  const retencionRef   = useRef<HTMLElement>(null)
  const revolucionRef  = useRef<HTMLElement>(null)

  useEffect(() => {
    const refs = [adquisicionRef, activacionRef, retencionRef, revolucionRef]
    const obs = new IntersectionObserver(
      (entries) => { entries.forEach(e => { if (e.isIntersecting) setActivePhase(e.target.id) }) },
      { threshold: 0.25, rootMargin: "-15% 0px -15% 0px" }
    )
    refs.forEach(r => { if (r.current) obs.observe(r.current) })
    return () => obs.disconnect()
  }, [])

  return (
    <div className="min-h-screen bg-[#07070f] text-white">

      {/* AARR Progress sidebar — desktop only */}
      <div className={cn(
        "hidden lg:flex fixed right-6 top-1/2 -translate-y-1/2 flex-col gap-4 z-40 transition-opacity duration-500",
        activePhase ? "opacity-100" : "opacity-0 pointer-events-none"
      )}>
        {[
          { id: "adquisicion", label: "Adquisición", dot: "bg-violet-500" },
          { id: "activacion",  label: "Activación",  dot: "bg-blue-500"   },
          { id: "retencion",   label: "Retención",   dot: "bg-emerald-500" },
          { id: "revolucion",  label: "Revolución",  dot: "bg-orange-500" },
        ].map(({ id, label, dot }) => (
          <button
            key={id}
            onClick={() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })}
            className="group flex items-center gap-2.5 justify-end"
          >
            <span className={cn(
              "text-[11px] font-semibold transition-all duration-200",
              activePhase === id ? "text-white/65" : "text-white/0 group-hover:text-white/40"
            )}>{label}</span>
            <div className={cn(
              "rounded-full transition-all duration-300",
              activePhase === id ? cn(dot, "w-3 h-3") : "bg-white/20 w-2 h-2 group-hover:bg-white/40"
            )} />
          </button>
        ))}
      </div>

      {/* Nav mínimo */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/[0.06] bg-[#07070f]/90 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-violet-600 flex items-center justify-center">
              <span className="text-white font-black text-xs">E</span>
            </div>
            <span className="font-black text-white tracking-tight">ELEVA</span>
          </Link>
          <Link
            href="/vl2026"
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-violet-600 hover:bg-violet-500 text-white text-sm font-bold transition-colors"
          >
            Ver demo <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </header>

      {/* ── HERO ── */}
      <section className="pt-40 pb-28 px-6 relative overflow-hidden">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[900px] h-[450px] bg-[radial-gradient(ellipse_at_center,rgba(124,58,237,0.13),transparent_70%)] pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center relative">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/[0.04] text-[11px] text-white/50 font-medium mb-10">
            <Zap className="w-3 h-3 text-violet-400" />
            El modelo que separa los centros que crecen de los que sobreviven
          </div>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-[1.05] tracking-tight mb-6">
            Los centros que crecen
            <br />
            <span className="text-white">tienen un sistema.</span>
            <br />
            <span className="text-white/25">Los que no, tienen caos.</span>
          </h1>
          <p className="text-lg text-white/45 max-w-xl mx-auto mb-12 leading-relaxed">
            AARR: Adquisición, Activación, Retención, Revolución.
            <br />
            Así se construye un centro que escala.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/vl2026"
              className="flex items-center gap-2 px-8 py-4 rounded-full bg-violet-600 hover:bg-violet-500 text-white font-bold text-base transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              Ver el sistema en acción <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/simulador"
              className="flex items-center gap-2 px-8 py-4 rounded-full border border-white/15 hover:border-white/30 text-white/60 hover:text-white font-medium text-base transition-colors"
            >
              Simular mi impacto
            </Link>
          </div>
        </div>
      </section>

      {/* ── SECCIÓN 1: EL PROBLEMA ── */}
      <section className="py-24 px-6 border-t border-white/[0.06]">
        <div className="max-w-5xl mx-auto">
          <Section>
            <div className="text-center mb-16">
              <p className="text-[11px] uppercase tracking-[0.2em] text-white/30 font-semibold mb-4">El punto de partida</p>
              <h2 className="text-4xl sm:text-5xl font-black leading-tight">
                Así opera la mayoría
                <br />
                <span className="text-white/30">de los centros hoy.</span>
              </h2>
            </div>
          </Section>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: BarChart3,
                titulo: "Sin ciencia de datos",
                descripcion: "Las decisiones se toman con intuición y WhatsApp. Nadie sabe qué participante está a punto de abandonar hasta que ya se fue.",
                consecuencia: "Pierdes entre 18–25% de tu ingreso mensual sin saber exactamente por qué.",
                colorText: "text-red-400",
                colorBorder: "border-red-500/15",
                colorBg: "bg-red-500/[0.04]",
              },
              {
                icon: Brain,
                titulo: "Sin inteligencia para coaches",
                descripcion: "El coach llega a cada sesión sin saber cómo llegó emocionalmente el participante, qué prometió la semana pasada ni qué patrones tiene.",
                consecuencia: "El 88% de los entrenamientos de transformación suceden sin ningún brief previo. El impacto se reduce a la mitad.",
                colorText: "text-orange-400",
                colorBorder: "border-orange-500/15",
                colorBg: "bg-orange-500/[0.04]",
              },
              {
                icon: Activity,
                titulo: "Sin detección de patrones",
                descripcion: "Cuando alguien deja de asistir, de responder o de pagar, nadie lo detecta hasta que el daño ya está hecho.",
                consecuencia: "Se tarda 3.2 días en detectar un problema crítico. Para entonces la conversación ya es de retención, no de transformación.",
                colorText: "text-yellow-400",
                colorBorder: "border-yellow-500/15",
                colorBg: "bg-yellow-500/[0.04]",
              },
            ].map(({ icon: Icon, titulo, descripcion, consecuencia, colorText, colorBorder, colorBg }) => (
              <Section key={titulo}>
                <div className={cn("rounded-2xl border p-7 h-full flex flex-col", colorBorder, colorBg)}>
                  <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center mb-5 border", colorBg, colorBorder)}>
                    <Icon className={cn("w-5 h-5", colorText)} />
                  </div>
                  <h3 className="text-lg font-black text-white mb-3">{titulo}</h3>
                  <p className="text-sm text-white/45 leading-relaxed mb-5 flex-1">{descripcion}</p>
                  <div className={cn("rounded-xl p-4 border", colorBorder, colorBg)}>
                    <p className={cn("text-sm font-bold leading-snug", colorText)}>{consecuencia}</p>
                  </div>
                </div>
              </Section>
            ))}
          </div>

          <Section>
            <p className="text-center text-2xl font-black text-white/40 mt-16">
              No es falta de compromiso.{" "}
              <span className="text-white">Es falta de sistema.</span>
            </p>
          </Section>
        </div>
      </section>

      {/* ── SECCIÓN 2: EL MODELO AARR ── */}
      <section className="py-24 px-6 border-t border-white/[0.06]">
        <div className="max-w-5xl mx-auto">
          <Section>
            <div className="text-center mb-14">
              <p className="text-[11px] uppercase tracking-[0.2em] text-white/30 font-semibold mb-4">El sistema</p>
              <h2 className="text-4xl sm:text-5xl font-black leading-tight mb-6">
                AARR: el modelo que convierte
                <br />
                <span className="text-white/30">un centro en un sistema que crece solo.</span>
              </h2>
              <p className="text-base text-white/40 max-w-2xl mx-auto">
                Cada fase tiene mecánicas concretas, métricas claras y herramientas en ELEVA. No es teoría. Es operación.
              </p>
            </div>
          </Section>
          <Section>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto">
              {[
                { letra: "A", nombre: "Adquisición", from: "from-violet-600", to: "to-violet-700" },
                { letra: "A", nombre: "Activación",  from: "from-blue-600",   to: "to-indigo-700" },
                { letra: "R", nombre: "Retención",   from: "from-emerald-600",to: "to-green-700" },
                { letra: "R", nombre: "Revolución",  from: "from-orange-500", to: "to-amber-600" },
              ].map(({ letra, nombre, from, to }) => (
                <div key={nombre} className={cn("flex items-center justify-center gap-3 px-4 py-3.5 rounded-2xl bg-gradient-to-r", from, to)}>
                  <span className="text-4xl sm:text-5xl font-black text-white/90">{letra}</span>
                  <span className="text-sm font-bold text-white/80">{nombre}</span>
                </div>
              ))}
            </div>
          </Section>
        </div>
      </section>

      {/* ── SECCIÓN 3: ADQUISICIÓN ── */}
      <section id="adquisicion" ref={adquisicionRef} className="py-24 px-6 border-t border-white/[0.06] relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_15%_50%,rgba(124,58,237,0.09),transparent)] pointer-events-none" />
        <div className="max-w-5xl mx-auto relative">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <Section>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-600/15 border border-violet-500/25 text-violet-300 text-xs font-bold uppercase tracking-wider mb-6">
                  <span className="w-5 h-5 rounded-full bg-violet-600 flex items-center justify-center text-white text-xs font-black">A</span>
                  Adquisición
                </div>
                <h2 className="text-3xl sm:text-4xl font-black leading-tight mb-6">
                  Prepara a cada persona para aprovechar al máximo lo que viene.
                </h2>
                <p className="text-white/50 leading-relaxed mb-5">
                  La mayoría de los centros espera que el evento haga todo el trabajo. Pero la experiencia que alguien tiene en su primer entrenamiento depende en gran medida de cómo llegó.
                </p>
                <p className="text-white/50 leading-relaxed mb-8">
                  ELEVA activa un protocolo de nutrición automática los 15 días antes del básico: videos de los coaches que van a conocer, recursos que calientan la mente para lo que viene, comunicaciones por WhatsApp y correo. No se adelanta el contenido profundo. Se prepara a la persona para recibirlo.
                </p>
              </Section>
              <Section>
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="rounded-2xl bg-violet-600/10 border border-violet-500/15 p-5">
                    <p className="text-4xl sm:text-5xl font-black text-violet-300 mb-1">4.2×</p>
                    <p className="text-xs text-white/40 leading-snug">más conversión básico→avanzado con nutrición previa</p>
                  </div>
                  <div className="rounded-2xl bg-violet-600/10 border border-violet-500/15 p-5">
                    <p className="text-4xl sm:text-5xl font-black text-violet-300 mb-1">+3×</p>
                    <p className="text-xs text-white/40 leading-snug">más personas que dijeron sí el domingo pero no pagaron ese día, se inscriben con seguimiento estructurado en los primeros 5 días</p>
                  </div>
                </div>
                <div className="rounded-2xl border border-violet-500/25 bg-violet-600/[0.07] p-5 sm:p-7">
                  <span className="text-5xl text-violet-400/35 font-black leading-none block mb-2">“</span>
                  <p className="text-sm sm:text-base font-semibold text-white/75 leading-relaxed">
                    El objetivo no es llenar el básico. Es que quien llegue llegue listo para transformarse, y pague el siguiente nivel porque quiere, no porque lo convencieron.
                  </p>
                </div>
              </Section>
            </div>
            <Section>
              <MockupPreEntrenamiento />
            </Section>
          </div>
        </div>
      </section>

      {/* ── SECCIÓN 4: ACTIVACIÓN ── */}
      <section id="activacion" ref={activacionRef} className="py-24 px-6 border-t border-white/[0.06] bg-white/[0.015] relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_85%_50%,rgba(59,130,246,0.08),transparent)] pointer-events-none" />
        <div className="max-w-5xl mx-auto relative">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <Section className="order-2 lg:order-1">
              <MockupAtencion />
            </Section>
            <div className="order-1 lg:order-2">
              <Section>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-600/15 border border-blue-500/25 text-blue-300 text-xs font-bold uppercase tracking-wider mb-6">
                  <span className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-black">A</span>
                  Activación
                </div>
                <h2 className="text-3xl sm:text-4xl font-black leading-tight mb-6">
                  Entre entrenamiento y entrenamiento, el sistema no para.
                </h2>
                <p className="text-white/50 leading-relaxed mb-5">
                  El entrenamiento es donde inicia la transformación. Pero lo que pasa entre un fin de semana y el siguiente determina si eso se sostiene o si se pierde. Y ahí es exactamente donde la mayoría de los centros desaparece.
                </p>
                <p className="text-white/50 leading-relaxed mb-8">
                  ELEVA trackea touchpoints concretos por participante. Cada señal se procesa y genera un dashboard que dice a quién atender hoy, con qué urgencia y con qué tipo de conversación.
                </p>
              </Section>
              <Section>
                <div className="space-y-2 mb-8">
                  {[
                    { icon: MessageCircle, label: "Llamadas de coaching completadas" },
                    { icon: BookOpen,      label: "Material de lectura entregado" },
                    { icon: Target,        label: "Tareas semanales" },
                    { icon: Users,         label: "Participación en sesiones grupales" },
                    { icon: Calendar,      label: "Asistencia a actividades" },
                    { icon: Activity,      label: "Respuesta a check-ins del sistema" },
                  ].map(({ icon: Icon, label }) => (
                    <div key={label} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-blue-600/20 border border-blue-500/25 flex items-center justify-center flex-shrink-0">
                        <CheckCircle2 className="w-3 h-3 text-blue-400" />
                      </div>
                      <span className="text-sm text-white/55">{label}</span>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="rounded-2xl bg-blue-600/10 border border-blue-500/15 p-5">
                    <p className="text-4xl sm:text-5xl font-black text-blue-300 mb-1">71%</p>
                    <p className="text-xs text-white/40 leading-snug">retención activa vs 43% promedio sin sistema</p>
                  </div>
                  <div className="rounded-2xl bg-blue-600/10 border border-blue-500/15 p-5">
                    <p className="text-4xl sm:text-5xl font-black text-blue-300 mb-1">+41pts</p>
                    <p className="text-xs text-white/40 leading-snug">NPS cuando el coach tiene contexto antes de cada sesión</p>
                  </div>
                </div>
                <div className="rounded-2xl border border-blue-500/25 bg-blue-600/[0.07] p-5 sm:p-7">
                  <span className="text-5xl text-blue-400/35 font-black leading-none block mb-2">"</span>
                  <p className="text-sm sm:text-base font-semibold text-white/75 leading-relaxed">
                    No necesitas intuir quién está en riesgo. El sistema ya lo sabe. Solo necesitas actuar.
                  </p>
                </div>
              </Section>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECCIÓN 5: RETENCIÓN ── */}
      <section id="retencion" ref={retencionRef} className="py-24 px-6 border-t border-white/[0.06] relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_20%,rgba(16,185,129,0.07),transparent)] pointer-events-none" />
        <div className="max-w-5xl mx-auto relative">
          <Section>
            <div className="text-center mb-14">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-600/15 border border-emerald-500/25 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-6">
                <span className="w-5 h-5 rounded-full bg-emerald-600 flex items-center justify-center text-white text-xs font-black">R</span>
                Retención
              </div>
              <h2 className="text-4xl sm:text-5xl font-black leading-tight mb-6">
                El graduado no es el fin del camino.
                <br />
                <span className="text-white/30">Es el inicio del ecosistema.</span>
              </h2>
              <p className="text-base text-white/45 max-w-2xl mx-auto leading-relaxed">
                El error más costoso es tratar a los graduados como clientes pasados. Un graduado que se mantiene conectado refiere, compra, aprende y eventualmente se convierte en parte de la metodología.
              </p>
            </div>
          </Section>
          <Section>
            <p className="text-center text-white/50 max-w-2xl mx-auto mb-12 leading-relaxed">
              ELEVA activa módulos de comunidad que mantienen conectados a activos y graduados. El sistema identifica a los champions automáticamente: las personas con mayor momentum, NPS y referidos, para saber a quién involucrar en los próximos programas.
            </p>
          </Section>
          <div className="grid md:grid-cols-3 gap-6 mb-14">
            {[
              {
                icon: Users,
                titulo: "Coaching personal",
                descripcion: "Participantes contratan sesiones individuales con coaches certificados directamente desde la plataforma, cuando lo necesiten.",
              },
              {
                icon: Layers,
                titulo: "Especialistas",
                descripcion: "Red de expertos en áreas complementarias disponibles para la comunidad — nutrición, finanzas, relaciones, liderazgo.",
              },
              {
                icon: Globe,
                titulo: "Webinars y eventos",
                descripcion: "Calendario de actividades que mantiene el pulso de la comunidad activa sin requerir un nuevo entrenamiento presencial.",
              },
            ].map(({ icon: Icon, titulo, descripcion }) => (
              <Section key={titulo}>
                <div className="rounded-2xl border border-emerald-500/15 bg-emerald-500/[0.04] p-7 h-full">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/[0.08] border border-emerald-500/15 flex items-center justify-center mb-5">
                    <Icon className="w-5 h-5 text-emerald-400" />
                  </div>
                  <h3 className="text-base font-black text-white mb-3">{titulo}</h3>
                  <p className="text-sm text-white/45 leading-relaxed">{descripcion}</p>
                </div>
              </Section>
            ))}
          </div>
          <Section>
            <div className="grid grid-cols-2 gap-4 max-w-lg mx-auto mb-10">
              <div className="rounded-2xl bg-emerald-600/10 border border-emerald-500/15 p-5 text-center">
                <p className="text-4xl sm:text-5xl font-black text-emerald-300 mb-1">3×</p>
                <p className="text-xs text-white/40 leading-snug">más probabilidad de que un participante referido lleve a alguien al siguiente nivel</p>
              </div>
              <div className="rounded-2xl bg-emerald-600/10 border border-emerald-500/15 p-5 text-center">
                <p className="text-4xl sm:text-5xl font-black text-emerald-300 mb-1">88%</p>
                <p className="text-xs text-white/40 leading-snug">de champions identificados se convierten en co-facilitadores de nuevos programas</p>
              </div>
            </div>
            <div className="rounded-2xl border border-emerald-500/25 bg-emerald-600/[0.07] p-5 sm:p-7 max-w-lg mx-auto">
              <span className="text-5xl text-emerald-400/35 font-black leading-none block mb-2">"</span>
              <p className="text-sm sm:text-base font-semibold text-white/75 leading-relaxed">
                Un centro que retiene bien no necesita crecer a base de presión de enrolamiento. Crece a base de comunidad.
              </p>
            </div>
          </Section>
        </div>
      </section>

      {/* ── SECCIÓN 6: REVOLUCIÓN ── */}
      <section id="revolucion" ref={revolucionRef} className="py-24 px-6 border-t border-white/[0.06] bg-white/[0.015] relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_20%,rgba(249,115,22,0.07),transparent)] pointer-events-none" />
        <div className="max-w-5xl mx-auto relative">
          <Section>
            <div className="text-center mb-14">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/15 border border-orange-500/25 text-orange-300 text-xs font-bold uppercase tracking-wider mb-6">
                <span className="w-5 h-5 rounded-full bg-orange-500 flex items-center justify-center text-white text-xs font-black">R</span>
                Revolución
              </div>
              <h2 className="text-4xl sm:text-5xl font-black leading-tight mb-6">
                Cuando el sistema opera solo,
                <br />
                <span className="text-white/30">el dueño puede enfocarse en lo que importa.</span>
              </h2>
              <p className="text-base text-white/45 max-w-2xl mx-auto leading-relaxed">
                La mayoría de los dueños de centros de transformación son, primero, personas que aman lo que hacen. La operación los aleja de eso. El sistema debe liberar al dueño, no atarlo.
              </p>
            </div>
          </Section>
          <Section>
            <p className="text-center text-white/50 max-w-2xl mx-auto mb-14 leading-relaxed">
              Con AARR operando en ELEVA, el centro deja de depender del enrolamiento como principal motor. Los programas nacen de la comunidad, los coaches tienen más contexto, los participantes refieren porque están transformados de verdad, y los graduados siguen participando. El centro escala sin perder alma.
            </p>
          </Section>

          <div className="grid md:grid-cols-3 gap-4 mb-14">
            {[
              { antes: "Enrolamiento como presión constante",      despues: "Comunidad que crece orgánicamente" },
              { antes: "Decisiones por intuición y WhatsApp",      despues: "Decisiones por datos en tiempo real" },
              { antes: "Operación que consume al dueño",           despues: "Sistema que libera al dueño" },
            ].map(({ antes, despues }) => (
              <Section key={antes}>
                <div className="rounded-2xl border border-white/8 overflow-hidden h-full">
                  <div className="p-5 bg-red-500/[0.04] border-b border-white/5">
                    <p className="text-xs text-red-400/70 uppercase tracking-wider font-semibold mb-2">Antes</p>
                    <p className="text-sm text-white/40 leading-snug">{antes}</p>
                  </div>
                  <div className="p-5 bg-orange-500/[0.06]">
                    <p className="text-xs text-orange-400/80 uppercase tracking-wider font-semibold mb-2">Con AARR</p>
                    <p className="text-sm text-white/80 font-medium leading-snug">{despues}</p>
                  </div>
                </div>
              </Section>
            ))}
          </div>

          <Section>
            <div className="grid grid-cols-2 gap-4 max-w-lg mx-auto mb-10">
              <div className="rounded-2xl bg-orange-500/10 border border-orange-500/15 p-5 text-center">
                <p className="text-4xl sm:text-5xl font-black text-orange-300 mb-1">+240%</p>
                <p className="text-xs text-white/40 leading-snug">crecimiento promedio en 12 meses con AARR completo implementado</p>
              </div>
              <div className="rounded-2xl bg-orange-500/10 border border-orange-500/15 p-5 text-center">
                <p className="text-4xl sm:text-5xl font-black text-orange-300 mb-1">&lt;90d</p>
                <p className="text-xs text-white/40 leading-snug">promedio para recuperar la inversión en el sistema</p>
              </div>
            </div>
            <div className="rounded-2xl border border-orange-500/25 bg-orange-500/[0.07] p-5 sm:p-7 max-w-xl mx-auto">
              <span className="text-5xl text-orange-400/35 font-black leading-none block mb-2">"</span>
              <p className="text-sm sm:text-base font-semibold text-white/75 leading-relaxed">
                Este es el futuro de la transformación: centros que dependen menos de la inspiración del momento y más de sistemas que funcionan todos los días, con o sin el dueño presente.
              </p>
            </div>
          </Section>
        </div>
      </section>

      {/* ── SECCIÓN 7: CAC / LTV ── */}
      <section className="py-24 px-6 border-t border-white/[0.06]">
        <div className="max-w-4xl mx-auto">
          <Section>
            <div className="text-center mb-14">
              <p className="text-[11px] uppercase tracking-[0.2em] text-white/30 font-semibold mb-4">La ecuación del negocio</p>
              <h2 className="text-4xl sm:text-5xl font-black leading-tight mb-6">
                Dos números que definen
                <br />
                <span className="text-white/30">si tu centro crece o sobrevive.</span>
              </h2>
            </div>
          </Section>

          <div className="grid md:grid-cols-2 gap-6 mb-14">
            <Section>
              <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.06] border border-white/10 text-white/50 text-xs font-black uppercase tracking-wider mb-5">CAC</div>
                <p className="text-4xl font-black text-white mb-3">Costo de adquisición</p>
                <p className="text-white/45 leading-relaxed text-sm">
                  Todo lo que gastas para que alguien nuevo entre al centro: el evento de enrolamiento, el tiempo del equipo, los materiales, el seguimiento. Dividido entre cuántas personas se inscribieron. Ese es tu CAC.
                </p>
              </div>
            </Section>
            <Section>
              <div className="rounded-3xl border border-violet-500/20 bg-violet-600/[0.05] p-8">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-600/20 border border-violet-500/30 text-violet-300 text-xs font-black uppercase tracking-wider mb-5">LTV</div>
                <p className="text-4xl font-black text-white mb-3">Valor de vida del cliente</p>
                <p className="text-white/45 leading-relaxed text-sm">
                  Todo lo que genera una persona durante su relación con tu centro: mensualidades, siguiente nivel, coaching personal, referidos que trae. Cuanto más tiempo se queda y más avanza, mayor es su LTV.
                </p>
              </div>
            </Section>
          </div>

          <Section>
            <div className="rounded-3xl border border-violet-500/30 bg-violet-600/[0.07] p-10 text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(124,58,237,0.12),transparent)] pointer-events-none" />
              <p className="text-2xl sm:text-3xl font-black text-white leading-snug mb-6 max-w-2xl mx-auto relative">
                La razón por la que siempre necesitas más enrolamiento es una sola: el CAC es alto y el LTV es bajo.
              </p>
              <p className="text-white/50 leading-relaxed max-w-xl mx-auto mb-8 text-sm relative">
                Si una persona te cuesta $6,000 conseguir y se va en tres meses pagando $4,200, el negocio no cierra. Pero si esa misma persona se queda 18 meses, sube al siguiente nivel y refiere a dos personas más que entran casi gratis, la ecuación entera cambia.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 text-sm relative">
                <div className="flex items-center gap-2 px-5 py-3 rounded-full bg-red-500/10 border border-red-500/20">
                  <span className="text-red-400 font-black">Sin sistema</span>
                  <span className="text-white/30">→</span>
                  <span className="text-white/50">LTV bajo · CAC siempre alto</span>
                </div>
                <div className="flex items-center gap-2 px-5 py-3 rounded-full bg-violet-600/15 border border-violet-500/25">
                  <span className="text-violet-300 font-black">Con ELEVA</span>
                  <span className="text-white/30">→</span>
                  <span className="text-white/70">LTV sube · CAC cae solo</span>
                </div>
              </div>
            </div>
          </Section>
        </div>
      </section>

      {/* ── SECCIÓN 8: LOS 11 MÓDULOS ── */}
      <section className="py-24 px-6 border-t border-white/[0.06]">
        <div className="max-w-5xl mx-auto">
          <Section>
            <div className="text-center mb-14">
              <p className="text-[11px] uppercase tracking-[0.2em] text-white/30 font-semibold mb-4">El ecosistema completo</p>
              <h2 className="text-4xl sm:text-5xl font-black leading-tight mb-6">
                Todo lo que puede llegar
                <br />
                <span className="text-white/30">a ser tu centro con el sistema.</span>
              </h2>
              <p className="text-base text-white/40 max-w-2xl mx-auto">
                AARR se opera a través de 11 módulos. Cada uno resuelve una pieza del sistema. Juntos, hacen que el centro funcione solo.
              </p>
            </div>
          </Section>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {MODULOS.map((mod) => {
              const c = COLOR_MAP[mod.color]
              const Icon = mod.icon
              return (
                <Section key={mod.num}>
                  <button
                    onClick={() => setSelectedModule(mod)}
                    className={cn(
                      "w-full text-left rounded-2xl border p-5 transition-all hover:scale-[1.02] active:scale-[0.98] group",
                      c.border, c.bg,
                      "hover:border-opacity-50"
                    )}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className={cn("w-9 h-9 rounded-xl border flex items-center justify-center", c.bg, c.border)}>
                        <Icon className={cn("w-4 h-4", c.text)} />
                      </div>
                      <span className={cn("text-[10px] font-black opacity-40 group-hover:opacity-70 transition-opacity", c.text)}>{mod.num}</span>
                    </div>
                    <p className="text-sm font-black text-white mb-1 leading-tight">{mod.nombre}</p>
                    <p className="text-[11px] text-white/35 leading-snug">{mod.tagline}</p>
                    <div className={cn("mt-3 text-[10px] font-semibold flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity", c.text)}>
                      Ver detalle <ChevronRight className="w-3 h-3" />
                    </div>
                  </button>
                </Section>
              )
            })}
          </div>

          <Section>
            <p className="text-center text-sm text-white/25 mt-10">
              Haz clic en cualquier módulo para ver qué incluye.
            </p>
          </Section>
        </div>
      </section>

      {/* ── SECCIÓN 8: SIN ELEVA / CON ELEVA ── */}
      <section className="py-24 px-6 border-t border-white/[0.06]">
        <div className="max-w-4xl mx-auto">
          <Section>
            <div className="text-center mb-14">
              <p className="text-[11px] uppercase tracking-[0.2em] text-white/30 font-semibold mb-4">En pocas palabras</p>
              <h2 className="text-4xl sm:text-5xl font-black leading-tight">
                La diferencia,
                <span className="text-white/30"> en lo cotidiano.</span>
              </h2>
            </div>
          </Section>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Sin ELEVA */}
            <Section>
              <div className="rounded-3xl border border-white/8 bg-white/[0.02] p-8 h-full">
                <div className="flex items-center gap-3 mb-7">
                  <div className="w-8 h-8 rounded-full bg-white/[0.06] border border-white/10 flex items-center justify-center">
                    <span className="text-white/30 text-lg font-black leading-none">×</span>
                  </div>
                  <span className="text-base font-black text-white/40">Sin ELEVA</span>
                </div>
                <div className="space-y-4">
                  {[
                    "Llegas el lunes y no sabes cuánto se cobró el fin de semana.",
                    "El coach entra a sesión sin saber nada del participante que tiene enfrente.",
                    "Alguien no ha pagado hace tres semanas y te enteraste hoy.",
                    "¿Cuántos van al siguiente nivel? Depende de quién pregunta.",
                    "La información del centro vive en WhatsApp, Excel y la memoria de alguien.",
                    "Cuando se va un coach, se va también el historial de sus participantes.",
                  ].map((t) => (
                    <div key={t} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-red-400 text-[10px] font-black">×</span>
                      </div>
                      <p className="text-sm text-white/35 leading-snug">{t}</p>
                    </div>
                  ))}
                </div>
              </div>
            </Section>

            {/* Con ELEVA */}
            <Section>
              <div className="rounded-3xl border border-violet-500/20 bg-violet-600/[0.05] p-8 h-full">
                <div className="flex items-center gap-3 mb-7">
                  <div className="w-8 h-8 rounded-full bg-violet-600/20 border border-violet-500/30 flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4 text-violet-400" />
                  </div>
                  <span className="text-base font-black text-violet-300">Con ELEVA</span>
                </div>
                <div className="space-y-4">
                  {[
                    "El lunes abres la app y en 30 segundos sabes exactamente cómo quedó el fin de semana.",
                    "El coach llega a cada sesión con el historial, las notas y las señales del participante.",
                    "El día 3 después del vencimiento ya llegó el recordatorio automático.",
                    "La conversión al siguiente nivel es un número en tiempo real, no una estimación.",
                    "Toda la información del centro vive en un solo lugar, accesible para quien deba verla.",
                    "El centro no depende de ninguna persona en particular para seguir funcionando.",
                  ].map((t) => (
                    <div key={t} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-violet-500/20 border border-violet-500/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <CheckCircle2 className="w-3 h-3 text-violet-400" />
                      </div>
                      <p className="text-sm text-white/70 leading-snug">{t}</p>
                    </div>
                  ))}
                </div>
              </div>
            </Section>
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ── */}
      <section className="py-32 px-6 border-t border-white/[0.06]">
        <div className="max-w-3xl mx-auto text-center">
          <Section>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/[0.04] text-[11px] text-white/40 font-medium mb-8">
              <TrendingUp className="w-3 h-3 text-violet-400" />
              40+ centros ya operan con AARR en ELEVA
            </div>
            <h2 className="text-4xl sm:text-5xl font-black leading-tight mb-6">
              Tu centro ya tiene la metodología.
              <br />
              <span className="text-white/30">Ahora dale el sistema.</span>
            </h2>
            <p className="text-base text-white/40 mb-12 max-w-xl mx-auto leading-relaxed">
              ELEVA ya está corriendo en LEVEL Transformación. Puedes ver cada fase de AARR operando con datos reales — sin registro, sin demo call, sin pitch.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
              <Link
                href="/vl2026"
                className="flex items-center gap-2 px-8 py-4 rounded-full bg-violet-600 hover:bg-violet-500 text-white font-bold text-base transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                Ver el sistema en vivo <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/simulador"
                className="flex items-center gap-2 px-8 py-4 rounded-full border border-white/15 hover:border-white/30 text-white/55 hover:text-white font-medium text-base transition-colors"
              >
                Simular el impacto <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-white/25">
              {["Sin contratos anuales", "Onboarding incluido", "ROI en < 90 días"].map((t) => (
                <div key={t} className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3 h-3 text-emerald-500/50" />
                  {t}
                </div>
              ))}
            </div>
          </Section>
        </div>
      </section>

      {/* Footer mínimo */}
      <footer className="border-t border-white/[0.06] py-8 px-6">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-violet-600 flex items-center justify-center">
              <span className="text-white font-black text-xs">E</span>
            </div>
            <span className="font-black text-white text-sm tracking-tight">ELEVA</span>
          </Link>
          <div className="flex items-center gap-6 text-xs text-white/25">
            <Link href="/precios"   className="hover:text-white/60 transition-colors">Precios</Link>
            <Link href="/numeros"   className="hover:text-white/60 transition-colors">Números</Link>
            <Link href="/vl2026"      className="hover:text-white/60 transition-colors">Demo</Link>
            <Link href="/simulador" className="hover:text-white/60 transition-colors">Simulador</Link>
          </div>
          <p className="text-xs text-white/15">© 2025 ELEVA</p>
        </div>
      </footer>

      {/* Modal de módulo */}
      {selectedModule && (
        <ModuleModal mod={selectedModule} onClose={() => setSelectedModule(null)} />
      )}

    </div>
  )
}
