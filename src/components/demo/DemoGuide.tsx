"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { switchDemoUser } from "@/app/actions/demo";

/**
 * Guía del demo — recorrido guiado por rol, portado del demo vl2026.
 * Solo se monta en el tenant demo. Es un guion de venta, no un tooltip.
 */

type Step = { route: string; label: string; pitch: string };

const GUIDES: Record<string, { persona: string; intro: string; steps: Step[] }> = {
  dueno: {
    persona: "Mariana Solís · Dirección",
    intro: "Muéstrale el sistema operativo completo del centro.",
    steps: [
      { route: "/pulso", label: "Pulso del centro", pitch: "Aquí empieza su mañana: momentum, ingresos y alertas en 30 segundos." },
      { route: "/hoy", label: "Cola de decisiones", pitch: "Cada señal explica su regla y su fuente. Nada depende de la memoria." },
      { route: "/generaciones", label: "Generaciones", pitch: "La unidad real de entrega: roster, asistencia y equipo reconciliados." },
      { route: "/finanzas", label: "Finanzas", pitch: "Cobrado vs. por cobrar sin mezclar conceptos; conciliación con un clic." },
      { route: "/equipo", label: "Equipo", pitch: "Roles con vigencia: una asignación vencida pierde acceso sola." },
      { route: "/crm", label: "CRM", pitch: "El lead y el alumni son la misma persona en la misma historia." },
    ],
  },
  oficinas: {
    persona: "Carla Núñez · Oficinas",
    intro: "El equipo que sí hace seguimiento. Su cola sustituye los chats.",
    steps: [
      { route: "/hoy", label: "Su cola de hoy", pitch: "Sabe a quién atender hoy sin preguntarle a nadie." },
      { route: "/agenda", label: "Agenda y check-in", pitch: "Pasa lista en vivo; la asistencia alimenta señales y momentum." },
      { route: "/personas", label: "Personas", pitch: "Expediente 360 con acceso por capacidad, sin etiquetas clínicas." },
      { route: "/crm", label: "Pipeline", pitch: "De lead a participante activo sin duplicar registros." },
    ],
  },
  entrenador: {
    persona: "Diego Ramos · Entrenador",
    intro: "El entrenador conduce; el sistema le da contexto sin ruido.",
    steps: [
      { route: "/generaciones", label: "Su generación", pitch: "Roster, grupos pequeños y asistencia de un vistazo." },
      { route: "/hoy", label: "Incidencias", pitch: "Solo ve los casos de su ámbito; el seguimiento es de Oficinas." },
    ],
  },
  finanzas: {
    persona: "Rosa Aguirre · Finanzas",
    intro: "La contadora ve exactamente lo suyo, nada más.",
    steps: [
      { route: "/finanzas", label: "Cargos y pagos", pitch: "Aging real y conciliación auditada." },
      { route: "/pulso", label: "Pulso", pitch: "Las cifras declaran si están reconciliadas o provisionales." },
    ],
  },
};

const VIEWS = [
  { email: "duena@aurora.demo", label: "Dirección" },
  { email: "oficinas@aurora.demo", label: "Oficinas" },
  { email: "entrenador@aurora.demo", label: "Entrenador" },
  { email: "finanzas@aurora.demo", label: "Finanzas" },
  { email: "participante@aurora.demo", label: "Participante" },
];

export function DemoGuide({ roles }: { roles: string[] }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(true);

  const key = ["dueno", "oficinas", "entrenador", "finanzas"].find((r) =>
    roles.includes(r)
  );
  const guide = key ? GUIDES[key] : null;

  const currentIdx = guide
    ? guide.steps.findIndex(
        (s) => pathname === s.route || pathname.startsWith(s.route + "/")
      )
    : -1;
  const next = guide && currentIdx >= 0 ? guide.steps[currentIdx + 1] : guide?.steps[0];

  return (
    <div className="mt-4 rounded-xl border border-gold/30 bg-gold-soft/40 px-3 py-3 text-xs">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between font-semibold text-gold"
        aria-expanded={open}
      >
        Guía del demo
        <span aria-hidden>{open ? "−" : "+"}</span>
      </button>
      {open && (
        <div className="mt-2 space-y-3">
          {guide && (
            <>
              <p className="text-faint">{guide.persona}</p>
              <p className="text-muted leading-relaxed">
                {currentIdx >= 0 ? guide.steps[currentIdx].pitch : guide.intro}
              </p>
              {next ? (
                <button
                  onClick={() => router.push(next.route)}
                  className="w-full rounded-lg bg-gold/20 px-2 py-1.5 font-semibold text-gold hover:bg-gold/30"
                >
                  Siguiente: {next.label} →
                </button>
              ) : (
                <p className="text-ok">✓ Recorrido completo</p>
              )}
            </>
          )}
          <div>
            <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-faint">
              Cambiar de vista
            </p>
            <div className="flex flex-wrap gap-1">
              {VIEWS.map((v) => (
                <form key={v.email} action={switchDemoUser}>
                  <input type="hidden" name="email" value={v.email} />
                  <button
                    type="submit"
                    className={`rounded px-2 py-1 text-[11px] ${
                      key && GUIDES[key]?.persona.includes(v.label)
                        ? "bg-gold/25 text-gold font-semibold"
                        : "text-muted hover:bg-raised hover:text-foreground"
                    }`}
                  >
                    {v.label}
                  </button>
                </form>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
