"use client"

import Link from "next/link"
import { useState, useEffect, useRef } from "react"
import {
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
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

export default function MetodoPage() {
  return (
    <div className="min-h-screen bg-[#07070f] text-white">

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
            href="/demo"
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-violet-600 hover:bg-violet-500 text-white text-sm font-bold transition-colors"
          >
            Ver demo <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </header>

      {/* ── HERO ── */}
      <section className="pt-40 pb-28 px-6">
        <div className="max-w-4xl mx-auto text-center">
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
              href="/demo"
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
                consecuencia: "El 88% de las sesiones de coaching suceden sin ningún brief previo. El impacto se reduce a la mitad.",
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
                Cada fase tiene mecánicas concretas, métricas claras y herramientas en ELEVA. No es teoría — es operación.
              </p>
            </div>
          </Section>
          <Section>
            <div className="flex flex-wrap items-center justify-center gap-3">
              {[
                { letra: "A", nombre: "Adquisición", from: "from-violet-600", to: "to-violet-700" },
                { letra: "A", nombre: "Activación",  from: "from-blue-600",   to: "to-indigo-700" },
                { letra: "R", nombre: "Retención",   from: "from-emerald-600",to: "to-green-700" },
                { letra: "R", nombre: "Revolución",  from: "from-orange-500", to: "to-amber-600" },
              ].map(({ letra, nombre, from, to }) => (
                <div key={nombre} className={cn("flex items-center gap-3 px-6 py-3.5 rounded-2xl bg-gradient-to-r", from, to)}>
                  <span className="text-3xl font-black text-white/90">{letra}</span>
                  <span className="text-sm font-bold text-white/80">{nombre}</span>
                </div>
              ))}
            </div>
          </Section>
        </div>
      </section>

      {/* ── SECCIÓN 3: ADQUISICIÓN ── */}
      <section className="py-24 px-6 border-t border-white/[0.06]">
        <div className="max-w-5xl mx-auto">
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
                  ELEVA activa un protocolo de nutrición automática los 15 días antes del básico: videos de los coaches que van a conocer, recursos que calientan la mente para lo que viene, comunicaciones por WhatsApp y correo. No se adelanta el contenido profundo — se prepara a la persona para recibirlo.
                </p>
              </Section>
              <Section>
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="rounded-2xl bg-violet-600/10 border border-violet-500/15 p-5">
                    <p className="text-3xl font-black text-violet-300 mb-1">4.2×</p>
                    <p className="text-xs text-white/40 leading-snug">más conversión básico→avanzado con nutrición previa</p>
                  </div>
                  <div className="rounded-2xl bg-violet-600/10 border border-violet-500/15 p-5">
                    <p className="text-3xl font-black text-violet-300 mb-1">−34d</p>
                    <p className="text-xs text-white/40 leading-snug">promedio menos para confirmar el siguiente nivel</p>
                  </div>
                </div>
                <p className="text-sm text-white/35 italic leading-relaxed border-l-2 border-violet-500/30 pl-4">
                  &ldquo;El objetivo no es llenar el básico. Es que quien llegue llegue listo para transformarse — y pague el siguiente nivel porque quiere, no porque lo convencieron.&rdquo;
                </p>
              </Section>
            </div>
            <Section>
              <MockupPreEntrenamiento />
            </Section>
          </div>
        </div>
      </section>

      {/* ── SECCIÓN 4: ACTIVACIÓN ── */}
      <section className="py-24 px-6 border-t border-white/[0.06] bg-white/[0.015]">
        <div className="max-w-5xl mx-auto">
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
                  La transformación no ocurre en el entrenamiento. Ocurre en los días entre uno y otro. Y ahí es exactamente donde la mayoría de los centros desaparece.
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
                    <p className="text-3xl font-black text-blue-300 mb-1">71%</p>
                    <p className="text-xs text-white/40 leading-snug">retención activa vs 43% promedio sin sistema</p>
                  </div>
                  <div className="rounded-2xl bg-blue-600/10 border border-blue-500/15 p-5">
                    <p className="text-3xl font-black text-blue-300 mb-1">+41pts</p>
                    <p className="text-xs text-white/40 leading-snug">NPS cuando el coach tiene contexto antes de cada sesión</p>
                  </div>
                </div>
                <p className="text-sm text-white/35 italic leading-relaxed border-l-2 border-blue-500/30 pl-4">
                  &ldquo;No necesitas intuir quién está en riesgo. El sistema ya lo sabe. Solo necesitas actuar.&rdquo;
                </p>
              </Section>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECCIÓN 5: RETENCIÓN ── */}
      <section className="py-24 px-6 border-t border-white/[0.06]">
        <div className="max-w-5xl mx-auto">
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
              ELEVA activa módulos de comunidad que mantienen conectados a activos y graduados. El sistema identifica a los champions automáticamente — las personas con mayor momentum, NPS y referidos — para saber a quién involucrar en los próximos programas.
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
                <p className="text-3xl font-black text-emerald-300 mb-1">3×</p>
                <p className="text-xs text-white/40 leading-snug">más probabilidad de que un participante referido lleve a alguien al siguiente nivel</p>
              </div>
              <div className="rounded-2xl bg-emerald-600/10 border border-emerald-500/15 p-5 text-center">
                <p className="text-3xl font-black text-emerald-300 mb-1">88%</p>
                <p className="text-xs text-white/40 leading-snug">de champions identificados se convierten en co-facilitadores de nuevos programas</p>
              </div>
            </div>
            <p className="text-center text-sm text-white/35 italic max-w-lg mx-auto border-l-2 border-emerald-500/30 pl-4">
              &ldquo;Un centro que retiene bien no necesita crecer a base de presión de enrolamiento. Crece a base de comunidad.&rdquo;
            </p>
          </Section>
        </div>
      </section>

      {/* ── SECCIÓN 6: REVOLUCIÓN ── */}
      <section className="py-24 px-6 border-t border-white/[0.06] bg-white/[0.015]">
        <div className="max-w-5xl mx-auto">
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
                    <p className="text-[10px] text-red-400/60 uppercase tracking-wider font-semibold mb-2">Antes</p>
                    <p className="text-sm text-white/40 leading-snug">{antes}</p>
                  </div>
                  <div className="p-5 bg-orange-500/[0.06]">
                    <p className="text-[10px] text-orange-400/70 uppercase tracking-wider font-semibold mb-2">Con AARR</p>
                    <p className="text-sm text-white/80 font-medium leading-snug">{despues}</p>
                  </div>
                </div>
              </Section>
            ))}
          </div>

          <Section>
            <div className="grid grid-cols-2 gap-4 max-w-lg mx-auto mb-10">
              <div className="rounded-2xl bg-orange-500/10 border border-orange-500/15 p-5 text-center">
                <p className="text-3xl font-black text-orange-300 mb-1">+240%</p>
                <p className="text-xs text-white/40 leading-snug">crecimiento promedio en 12 meses con AARR completo implementado</p>
              </div>
              <div className="rounded-2xl bg-orange-500/10 border border-orange-500/15 p-5 text-center">
                <p className="text-3xl font-black text-orange-300 mb-1">&lt;90d</p>
                <p className="text-xs text-white/40 leading-snug">promedio para recuperar la inversión en el sistema</p>
              </div>
            </div>
            <p className="text-center text-sm text-white/35 italic max-w-xl mx-auto border-l-2 border-orange-500/30 pl-4">
              &ldquo;Este es el futuro de la transformación: centros que dependen menos de la inspiración del momento y más de sistemas que funcionan todos los días, con o sin el dueño presente.&rdquo;
            </p>
          </Section>
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
              ELEVA ya está corriendo en Creania Transformación. Puedes ver cada fase de AARR operando con datos reales — sin registro, sin demo call, sin pitch.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
              <Link
                href="/demo"
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
            <Link href="/demo"      className="hover:text-white/60 transition-colors">Demo</Link>
            <Link href="/simulador" className="hover:text-white/60 transition-colors">Simulador</Link>
          </div>
          <p className="text-xs text-white/15">© 2025 ELEVA</p>
        </div>
      </footer>

    </div>
  )
}
