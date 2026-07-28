"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import {
  ArrowRight,
  Activity,
  Users,
  Globe2,
  Megaphone,
  GraduationCap,
  ShieldCheck,
} from "lucide-react"
import { Nav } from "@/components/landing/Nav"
import { Footer } from "@/components/landing/Footer"

const CAPABILITIES = [
  {
    icon: Activity,
    name: "ELEVA OS",
    status: "Disponible en Alpha",
    statusColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/25",
    desc: "El sistema administrativo y de decisión del centro. Señales con fuente, cola de trabajo diaria, casos con intervención y resultado, finanzas reconciliadas y un Pulso que explica cada cifra.",
    bullets: [
      "¿Qué está ocurriendo y qué requiere atención hoy?",
      "¿Quién debe actuar, qué hizo y qué resultado tuvo?",
      "¿Dónde se pierde continuidad, dinero o capacidad?",
    ],
  },
  {
    icon: Users,
    name: "ELEVA Hub Centro",
    status: "Disponible en Alpha",
    statusColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/25",
    desc: "La comunidad digital privada de cada centro. La experiencia empieza con la generación real de la persona: qué le toca hacer, quién la acompaña y qué está ocurriendo en su grupo.",
    bullets: [
      "Generaciones, misiones, eventos y conversación con significado",
      "Reacciones y reconocimientos, no likes vacíos",
      "Toda primera contribución recibe respuesta",
    ],
  },
  {
    icon: Megaphone,
    name: "ELEVA Growth",
    status: "En construcción",
    statusColor: "text-amber-400 bg-amber-500/10 border-amber-500/25",
    desc: "Presencia digital, adquisición y crecimiento: websites premium, formularios, CRM, campañas y automatizaciones — para que el recorrido de una persona no se rompa entre el website y la operación.",
    bullets: [
      "De lead a participante en una misma historia",
      "Adquisición, activación, retención, referidos y reactivación",
    ],
  },
  {
    icon: Globe2,
    name: "ELEVA Hub Global",
    status: "Tras sus gates",
    statusColor: "text-violet-300 bg-violet-500/10 border-violet-500/25",
    desc: "La red entre personas entrenadas de distintos centros, ciudades y metodologías. Nace de comunidades reales ya activas — nunca como una red vacía. Participación siempre voluntaria.",
    bullets: [
      "Nada privado del centro pasa automáticamente a la red global",
      "Cada persona decide qué parte de su trayectoria comparte",
    ],
  },
  {
    icon: GraduationCap,
    name: "ELEVA Standards y Academy",
    status: "Tras sus gates",
    statusColor: "text-violet-300 bg-violet-500/10 border-violet-500/25",
    desc: "Convertir metodologías y talento en sistemas de calidad reproducibles: formación de entrenadores y staff, rúbricas, evidencia, certificación y protocolos éticos.",
    bullets: [
      "Tu metodología documentada, protegida y enseñable",
      "Menos dependencia de personas individuales",
    ],
  },
]

export default function PlataformaPage() {
  return (
    <>
      <Nav />
      <main className="pt-16">
        {/* Hero */}
        <section className="relative py-24 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-violet-400 bg-violet-500/10 border border-violet-500/20 px-3 py-1.5 rounded-full">
                La plataforma
              </span>
              <h1 className="mt-6 text-5xl sm:text-6xl font-black text-foreground leading-[1.05]">
                No es una app.
                <br />
                <span className="gradient-text">Es el sistema de tu centro.</span>
              </h1>
              <p className="mt-6 text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                ELEVA no es cinco negocios separados. Es un sistema institucional
                de cinco capacidades conectadas que comparten identidad, datos y
                una misma historia: la de cada persona que pasa por tu centro.
              </p>
            </motion.div>
          </div>
        </section>

        <div className="section-rule max-w-6xl mx-auto" />

        {/* Principio rector */}
        <section className="py-16 px-6">
          <div className="max-w-3xl mx-auto text-center">
            <blockquote className="text-2xl sm:text-3xl font-bold text-foreground/90 leading-snug">
              &ldquo;La transformación deja de depender de un individuo cuando se
              convierte en sistema, y se sostiene en el tiempo cuando también se
              convierte en comunidad.&rdquo;
            </blockquote>
            <p className="mt-4 text-sm text-muted-foreground">
              ELEVA une ambas: el sistema para operar y decidir, y la comunidad
              para continuar y crecer.
            </p>
          </div>
        </section>

        {/* Capacidades */}
        <section className="py-12 px-6">
          <div className="max-w-5xl mx-auto space-y-6">
            {CAPABILITIES.map((cap, i) => (
              <motion.div
                key={cap.name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="glass rounded-2xl p-8 md:flex md:items-start md:gap-8"
              >
                <div className="flex items-center gap-4 md:w-72 md:shrink-0">
                  <div className="w-12 h-12 rounded-xl bg-violet-500/15 border border-violet-500/25 flex items-center justify-center shrink-0">
                    <cap.icon className="w-6 h-6 text-violet-300" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-foreground">{cap.name}</h2>
                    <span
                      className={`mt-1 inline-block text-[10px] font-bold uppercase tracking-wider border px-2 py-0.5 rounded-full ${cap.statusColor}`}
                    >
                      {cap.status}
                    </span>
                  </div>
                </div>
                <div className="mt-4 md:mt-0">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {cap.desc}
                  </p>
                  <ul className="mt-3 space-y-1.5">
                    {cap.bullets.map((b) => (
                      <li key={b} className="text-sm text-foreground/80 flex gap-2">
                        <span className="text-violet-400 shrink-0">·</span>
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Cómo se entrega */}
        <section className="py-16 px-6">
          <div className="max-w-4xl mx-auto">
            <div className="glass-violet rounded-2xl p-8 md:p-10">
              <div className="flex items-start gap-4">
                <ShieldCheck className="w-8 h-8 text-violet-300 shrink-0 mt-1" />
                <div>
                  <h2 className="text-2xl font-black text-foreground">
                    No vendemos accesos. Instalamos sistemas.
                  </h2>
                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                    ELEVA se entrega como una implementación institucional:
                    diagnosticamos tu organización, ordenamos procesos y roles,
                    migramos tu información, configuramos la plataforma,
                    capacitamos a tu equipo y acompañamos la adopción. La
                    plataforma, la implementación y el acompañamiento forman
                    parte de la misma propuesta.
                  </p>
                  <div className="mt-6 flex flex-wrap gap-3">
                    <Link href="/build">
                      <button className="flex items-center gap-2 px-5 py-2.5 bg-violet-600 hover:bg-violet-500 text-white rounded-xl text-sm font-bold transition-colors">
                        Agendar diagnóstico <ArrowRight className="w-4 h-4" />
                      </button>
                    </Link>
                    <Link href="/login">
                      <button className="px-5 py-2.5 border border-border hover:border-violet-500/40 text-foreground rounded-xl text-sm font-semibold transition-colors">
                        Ver el demo interactivo
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
