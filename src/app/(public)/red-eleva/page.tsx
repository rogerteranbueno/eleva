"use client";

import { motion } from "framer-motion";
import { Lock, Users, Globe2, ShieldCheck } from "lucide-react";
import { Nav } from "@/components/landing/Nav";
import { Footer } from "@/components/landing/Footer";
import { WaitlistForm } from "@/components/landing/WaitlistForm";

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number];

const GATES = [
  { label: "3 centros activos operando ELEVA OS", done: false },
  { label: "5 generaciones completas acompañadas", done: false },
  { label: "300 perfiles de centro elegibles para portar a Global", done: false },
  { label: "100 personas con opt-in explícito a identidad global", done: false },
  { label: "3 círculos temáticos con anfitrión y 4 semanas de ritmo sostenido", done: false },
  { label: "Reporte, bloqueo, moderación y apelación probados en producción", done: false },
];

const CIRCULOS_SEMILLA = [
  { name: "Pide y ofrece", desc: "Pedir apoyo concreto también es parte del entrenamiento." },
  { name: "Lo que nadie te dijo después de graduarte", desc: "El regreso a la vida diaria, contado por quienes ya lo vivieron." },
  { name: "Proyectos y colaboración", desc: "Personas entrenadas que construyen juntas, entre centros." },
];

export default function RedElevaPage() {
  return (
    <>
      <Nav />
      <main className="pt-16">
        {/* Hero honesto */}
        <section className="relative py-24 px-6 text-center overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-indigo-600/8 blur-3xl" />
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease }}
            className="relative max-w-3xl mx-auto"
          >
            <span className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-violet-300 bg-violet-500/10 border border-violet-500/25 px-3 py-1.5 rounded-full">
              <Lock className="w-3 h-3" /> Todavía cerrada
            </span>
            <h1 className="mt-6 text-5xl sm:text-6xl font-black text-foreground leading-[1.05]">
              La red entre personas
              <br />
              <span className="gradient-text">entrenadas de distintos centros.</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              Red ELEVA nace de comunidades reales ya activas — nunca se abre como un feed
              vacío. Hoy es una promesa con criterios públicos, no un producto disponible.
            </p>
          </motion.div>
        </section>

        {/* Qué será */}
        <section className="py-12 px-6 max-w-4xl mx-auto grid gap-5 sm:grid-cols-3">
          {[
            { icon: Users, title: "Descubrimiento", desc: "Encontrar a alguien por ciudad, interés o lo que ofrece, más allá de tu centro." },
            { icon: Globe2, title: "Círculos globales", desc: "Espacios temáticos con anfitrión, entre personas entrenadas de cualquier centro afiliado." },
            { icon: ShieldCheck, title: "Identidad portátil", desc: "Un perfil que decides llevar contigo, con credenciales verificadas por su centro de origen." },
          ].map((f) => (
            <div key={f.title} className="glass rounded-2xl p-6 space-y-2">
              <f.icon className="w-6 h-6 text-violet-300" />
              <p className="font-bold text-foreground">{f.title}</p>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </section>

        {/* Gates públicos */}
        <section className="py-16 px-6 max-w-3xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-black text-foreground text-center mb-3">
            Los criterios para abrir, en público
          </h2>
          <p className="text-sm text-muted-foreground text-center mb-8 max-w-lg mx-auto">
            No abrimos una red vacía. Estos son los mismos criterios que usamos internamente —
            los publicamos para que no sea una promesa sin forma.
          </p>
          <ul className="glass rounded-2xl divide-y divide-border overflow-hidden">
            {GATES.map((g) => (
              <li key={g.label} className="flex items-center gap-3 px-5 py-4">
                <span
                  className={`shrink-0 size-5 rounded-full border flex items-center justify-center ${
                    g.done ? "border-emerald-500/50 bg-emerald-500/15" : "border-border"
                  }`}
                  aria-hidden
                >
                  {g.done && <span className="size-2 rounded-full bg-emerald-400" />}
                </span>
                <span className="text-sm text-foreground/90">{g.label}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Cold start */}
        <section className="py-16 px-6 max-w-4xl mx-auto">
          <h2 className="text-2xl font-black text-foreground text-center mb-3">
            Cómo va a empezar
          </h2>
          <p className="text-sm text-muted-foreground text-center mb-8 max-w-lg mx-auto">
            Con tres círculos semilla, un anfitrión formado en cada uno y un ritmo sostenido
            de cuatro semanas antes de abrir a más gente.
          </p>
          <div className="grid gap-4 sm:grid-cols-3">
            {CIRCULOS_SEMILLA.map((c) => (
              <div key={c.name} className="rounded-xl border border-border p-5">
                <p className="font-bold text-sm text-foreground">{c.name}</p>
                <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">{c.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Waitlist */}
        <section className="py-16 px-6">
          <h2 className="text-2xl sm:text-3xl font-black text-foreground text-center mb-3">
            Anótate para cuando abramos
          </h2>
          <p className="text-sm text-muted-foreground text-center mb-8 max-w-md mx-auto">
            Sea que dirijas un centro o seas una persona entrenada en alguno, cuéntanos que
            te interesa.
          </p>
          <WaitlistForm />
        </section>
      </main>
      <Footer />
    </>
  );
}
