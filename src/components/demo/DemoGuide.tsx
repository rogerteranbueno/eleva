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
    intro: "Muéstrale el sistema operativo completo del centro sobre el ciclo real.",
    steps: [
      { route: "/pulso", label: "Pulso del centro", pitch: "Su mañana en 30 segundos: momentum, funnel del pase, dinero por moneda y alertas." },
      { route: "/hoy", label: "Cola de decisiones", pitch: "Cada señal explica su regla y su fuente. Los casos son tipados: finanzas solo lo ven roles financieros." },
      { route: "/generaciones", label: "El ciclo", pitch: "Básico → Avanzado → PL: la línea de tiempo real de cada generación, con su pase medible." },
      { route: "/finanzas", label: "Finanzas", pitch: "Ledger de verdad: pagos repartidos a cargos, dinero sin identificar visible, monedas separadas." },
      { route: "/equipo", label: "Equipo", pitch: "Staff y capitán son asignaciones con vigencia, no niveles: la graduada que sirve sigue siendo la misma persona." },
      { route: "/crm", label: "CRM", pitch: "El PL llena el siguiente Básico: cada prospecto trae a su enrolador atribuido." },
    ],
  },
  oficinas: {
    persona: "Carla Núñez · Oficinas",
    intro: "El equipo que sí hace seguimiento. Su cola sustituye los chats.",
    steps: [
      { route: "/hoy", label: "Su cola de hoy", pitch: "La ventana crítica Básico→Avanzado vive aquí: aceptados sin inscribir, registros incompletos, asistencia sin registrar." },
      { route: "/agenda", label: "Agenda tipada", pitch: "Días de Básico, hitos del PL, actividades: pasar lista es contra lo ESPERADO, el faltante queda visible." },
      { route: "/personas", label: "Personas", pitch: "Expediente 360 por planos: registro, entrega, pase y dinero nunca se mezclan en un solo estado." },
      { route: "/crm", label: "Camino al Básico", pitch: "«Registrar al Básico» crea participación + cargo en un solo hecho auditado." },
    ],
  },
  entrenador: {
    persona: "Diego Ramos · Entrenador",
    intro: "El entrenador conduce el pase; el dinero no es suyo.",
    steps: [
      { route: "/generaciones", label: "El ciclo y su pase", pitch: "Registra conversación → oferta → decisión → inscripción. Cada paso queda auditado." },
      { route: "/hoy", label: "Incidencias", pitch: "Ve casos de entrega y pase; los de finanzas ni le aparecen." },
    ],
  },
  finanzas: {
    persona: "Rosa Aguirre · Finanzas",
    intro: "La contadora ve exactamente lo suyo, nada más.",
    steps: [
      { route: "/finanzas", label: "El ledger", pitch: "Asigna el pago sin identificar, confirma evidencia y cierra el periodo: eso es conciliar." },
      { route: "/pulso", label: "Pulso", pitch: "Cobrado = solo confirmado. Las cifras declaran si están reconciliadas o provisionales." },
    ],
  },
  capitan: {
    persona: "Marco Elizondo · Capitán",
    intro: "El capitán cuida al equipo que cuida a la generación.",
    steps: [
      { route: "/cobertura", label: "Cobertura", pitch: "Su staff, sus grupos y los seguimientos vencidos — nadie carga solo." },
      { route: "/hoy", label: "Su cola", pitch: "Las llamadas vencidas de su staff le llegan como casos asignados a capitanía." },
    ],
  },
  staff: {
    persona: "Paulina Reyes · Staff",
    intro: "Graduada del PL que regresa a servir. Mismo perfil, nueva asignación.",
    steps: [
      { route: "/mi-grupo", label: "Su grupo", pitch: "5 personas asignadas, sus llamadas de seguimiento y sus enrolamientos acreditados." },
      { route: "/agenda", label: "Pasar lista", pitch: "Solo ve a su grupo: el acceso es por capacidad, garantizado en la base." },
    ],
  },
};

const VIEWS = [
  { email: "duena@aurora.demo", label: "Dirección" },
  { email: "oficinas@aurora.demo", label: "Oficinas" },
  { email: "entrenador@aurora.demo", label: "Entrenador" },
  { email: "finanzas@aurora.demo", label: "Finanzas" },
  { email: "capitan@aurora.demo", label: "Capitán" },
  { email: "staff@aurora.demo", label: "Staff" },
  { email: "participante@aurora.demo", label: "Valeria (Básico)" },
  { email: "pl@aurora.demo", label: "Ivonne (PL)" },
];

export function DemoGuide({ roles }: { roles: string[] }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(true);

  const key = ["dueno", "oficinas", "entrenador", "finanzas", "capitan", "staff"].find((r) =>
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
