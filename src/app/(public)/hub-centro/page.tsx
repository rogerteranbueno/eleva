"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Users,
  MessageCircle,
  Heart,
  ShieldCheck,
  Lock,
  Radio,
} from "lucide-react";
import { Nav } from "@/components/landing/Nav";
import { Footer } from "@/components/landing/Footer";

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number];

const CIRCULOS = [
  {
    icon: Users,
    name: "Generación",
    audience: "Quienes viven el mismo recorrido",
    desc: "Confianza inmediata. Lo que se comparte en el Básico, el Avanzado y el PL de una generación se queda ahí — nunca sube de audiencia sin que la persona lo decida.",
  },
  {
    icon: Radio,
    name: "Centro",
    audience: "Todo el centro, todas las generaciones",
    desc: "Avisos, eventos abiertos y conversaciones que cruzan promociones. El lugar donde el centro entero existe como una sola comunidad.",
  },
  {
    icon: Heart,
    name: "Alumni y círculos",
    audience: "Quienes ya se graduaron",
    desc: "La transformación no termina en la graduación. Alumni se acompañan, sirven como staff en el siguiente Básico y sostienen círculos temáticos con anfitrión y ritmo propio.",
  },
];

const REAL_VS_WHATSAPP = [
  {
    tema: "¿Quién responde primero?",
    whatsapp: "Depende de quién esté despierto y con el chat abierto.",
    hub: "La consola de comunidad muestra toda primera contribución sin respuesta.",
  },
  {
    tema: "¿Qué pasa si el staff cambia?",
    whatsapp: "El historial y el contexto se pierden con la persona.",
    hub: "El centro es dueño de su comunidad — no una cuenta personal.",
  },
  {
    tema: "¿Quién ve qué?",
    whatsapp: "Todo o nada: un grupo, todos adentro, sin matices.",
    hub: "Generación, centro y alumni son audiencias distintas y explícitas.",
  },
  {
    tema: "¿Y los mensajes privados?",
    whatsapp: "El centro puede pedir acceso al teléfono de cualquiera.",
    hub: "Los mensajes directos son de las dos personas. El centro nunca los lee.",
  },
];

export default function HubCentroPage() {
  return (
    <>
      <Nav />
      <main className="pt-16">
        {/* Hero */}
        <section className="relative py-24 px-6 text-center overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-violet-600/8 blur-3xl" />
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease }}
            className="relative max-w-3xl mx-auto"
          >
            <span className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400 bg-emerald-500/10 border border-emerald-500/25 px-3 py-1.5 rounded-full">
              Disponible en Alpha
            </span>
            <h1 className="mt-6 text-5xl sm:text-6xl font-black text-foreground leading-[1.05]">
              Tu centro no termina
              <br />
              <span className="gradient-text">cuando termina el entrenamiento.</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              ELEVA une la operación del centro con un espacio digital para cada generación,
              una comunidad alumni y, con su autorización, una red entre personas entrenadas
              de distintos centros.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link href="/build">
                <button className="flex items-center gap-2 px-6 py-3.5 bg-violet-600 hover:bg-violet-500 text-white rounded-xl text-sm font-bold transition-colors">
                  Agendar diagnóstico <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
              <Link href="/login">
                <button className="px-6 py-3.5 border border-border hover:border-violet-500/40 text-foreground rounded-xl text-sm font-semibold transition-colors">
                  Ver el demo interactivo
                </button>
              </Link>
            </div>
          </motion.div>
        </section>

        {/* Los tres círculos */}
        <section className="py-16 px-6 max-w-5xl mx-auto">
          <p className="text-xs font-bold text-violet-400 uppercase tracking-widest mb-3 text-center">
            Tres círculos, una sola comunidad
          </p>
          <h2 className="text-3xl sm:text-4xl font-black text-foreground text-center max-w-xl mx-auto mb-12">
            Cada expansión de audiencia es una decisión explícita
          </h2>
          <div className="grid gap-5 md:grid-cols-3">
            {CIRCULOS.map((c, i) => (
              <motion.div
                key={c.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, ease, delay: i * 0.08 }}
                className="glass rounded-2xl p-7 space-y-3"
              >
                <div className="w-11 h-11 rounded-xl bg-violet-500/15 border border-violet-500/25 flex items-center justify-center">
                  <c.icon className="w-5 h-5 text-violet-300" />
                </div>
                <h3 className="text-lg font-bold text-foreground">{c.name}</h3>
                <p className="text-xs font-semibold text-violet-400 uppercase tracking-wide">
                  {c.audience}
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed">{c.desc}</p>
              </motion.div>
            ))}
          </div>
          <p className="mt-6 text-center text-sm text-muted-foreground max-w-lg mx-auto">
            Nada privado de una generación sube al centro solo. Nada del centro sale a la red
            global sin que la persona active su perfil ahí.
          </p>
        </section>

        {/* WhatsApp vs Hub */}
        <section className="py-16 px-6 max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-black text-foreground text-center mb-3">
            No es otro grupo de WhatsApp
          </h2>
          <p className="text-sm text-muted-foreground text-center max-w-lg mx-auto mb-10">
            Un grupo se pierde cuando alguien lo sale. Una comunidad institucional no debería.
          </p>
          <div className="glass rounded-2xl overflow-hidden divide-y divide-border">
            {REAL_VS_WHATSAPP.map((row) => (
              <div key={row.tema} className="grid sm:grid-cols-[1fr_1fr_1fr] gap-4 p-5">
                <p className="text-sm font-bold text-foreground">{row.tema}</p>
                <p className="text-sm text-muted-foreground">
                  <span className="text-xs font-semibold text-foreground/50 uppercase tracking-wide block mb-1">
                    WhatsApp
                  </span>
                  {row.whatsapp}
                </p>
                <p className="text-sm text-foreground/90">
                  <span className="text-xs font-semibold text-violet-400 uppercase tracking-wide block mb-1">
                    Hub Centro
                  </span>
                  {row.hub}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Privacidad */}
        <section className="py-16 px-6">
          <div className="max-w-3xl mx-auto glass-violet rounded-2xl p-8 md:p-10">
            <div className="flex items-start gap-4">
              <Lock className="w-8 h-8 text-violet-300 shrink-0 mt-1" />
              <div>
                <h2 className="text-2xl font-black text-foreground">Privado por defecto</h2>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                  Tu perfil de centro no es tu perfil privado. Cada campo — biografía, ciudad,
                  intereses, lo que ofreces — declara su propia audiencia: solo tú, tu generación
                  o todo el centro. Los mensajes directos son de las dos personas: ni dirección ni
                  el equipo de comunidad pueden leerlos. Bloquear, silenciar y reportar están
                  disponibles desde el primer día, no como una promesa a futuro.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-full">
                    <ShieldCheck className="w-3.5 h-3.5" /> Mensajes directos privados
                  </div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-full">
                    <MessageCircle className="w-3.5 h-3.5" /> Reportar y bloquear
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA final */}
        <section className="py-16 px-6 text-center">
          <h2 className="text-2xl sm:text-3xl font-black text-foreground mb-4">
            ¿Quieres que tu centro tenga esto?
          </h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/build">
              <button className="flex items-center gap-2 px-6 py-3.5 bg-violet-600 hover:bg-violet-500 text-white rounded-xl text-sm font-bold transition-colors">
                Agendar diagnóstico <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
            <Link href="/red-eleva">
              <button className="px-6 py-3.5 border border-border hover:border-violet-500/40 text-foreground rounded-xl text-sm font-semibold transition-colors">
                Conocer la Red ELEVA →
              </button>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
