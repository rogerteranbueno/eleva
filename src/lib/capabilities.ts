import { redirect } from "next/navigation";
import { requireSession, type Role, type SessionContext } from "@/lib/context";

/**
 * Capacidades de dominio.
 *
 * La auditoría encontró que "es equipo" era una abstracción demasiado amplia:
 * dirección, oficinas, entrenador, coach, capitán, staff y finanzas caían bajo
 * la misma condición, y por eso finanzas podía abrir generaciones por URL y el
 * staff podía leer expedientes fuera de su grupo.
 *
 * Una capacidad describe UN permiso concreto sobre UN ámbito. Los roles se
 * traducen a capacidades; las páginas y las acciones exigen capacidades, nunca
 * "pertenece al equipo".
 */

export type Capability =
  // Personas
  | "people.read.assigned" // solo su grupo/ámbito
  | "people.read.operational" // directorio operativo del centro
  | "people.read.contact" // teléfono y correo
  // Ciclo y entrega
  | "cycle.read.all"
  | "cycle.read.assigned"
  | "attendance.write.assigned"
  | "attendance.write.all"
  | "pass.record"
  | "pass.enroll"
  // Dinero
  | "finance.read"
  | "finance.write" // registrar y asignar pagos
  | "finance.approve" // becas, devoluciones y gastos: requieren aprobación
  | "finance.close_period"
  // Trabajo
  | "case.operate.operational"
  | "case.operate.finance"
  | "crm.read"
  | "crm.write"
  | "followup.read.own"
  | "followup.read.coverage"
  | "team.read"
  // Inteligencia
  | "pulse.read"
  | "audit.read"
  // Comunidad
  | "community.read.own_spaces"
  | "community.moderate.center";

const ROLE_CAPABILITIES: Record<Role, Capability[]> = {
  dueno: [
    "people.read.assigned",
    "people.read.operational",
    "people.read.contact",
    "cycle.read.all",
    "attendance.write.all",
    "pass.record",
    "pass.enroll",
    "finance.read",
    "finance.write",
    "finance.approve",
    "finance.close_period",
    "case.operate.operational",
    "case.operate.finance",
    "crm.read",
    "crm.write",
    "followup.read.coverage",
    "team.read",
    "pulse.read",
    "audit.read",
    "community.read.own_spaces",
    "community.moderate.center",
  ],
  oficinas: [
    "people.read.assigned",
    "people.read.operational",
    "people.read.contact",
    "cycle.read.all",
    "attendance.write.all",
    "pass.record",
    "pass.enroll",
    "finance.read",
    "finance.write",
    "case.operate.operational",
    "case.operate.finance",
    "crm.read",
    "crm.write",
    "followup.read.coverage",
    "team.read",
    "pulse.read",
    "community.read.own_spaces",
    "community.moderate.center",
  ],
  // Finanzas ve dinero e identidad para cobrar — no la operación del ciclo ni
  // la conversación privada de las generaciones.
  finanzas: [
    "people.read.operational",
    "people.read.contact",
    "finance.read",
    "finance.write",
    "finance.approve",
    "finance.close_period",
    "case.operate.finance",
    "pulse.read",
    "community.read.own_spaces",
  ],
  entrenador: [
    "people.read.operational",
    "people.read.contact",
    "cycle.read.all",
    "attendance.write.all",
    "pass.record",
    "case.operate.operational",
    "followup.read.coverage",
    "team.read",
    "pulse.read",
    "community.read.own_spaces",
  ],
  coach: [
    "people.read.operational",
    "cycle.read.all",
    "attendance.write.all",
    "pass.record",
    "case.operate.operational",
    "team.read",
    "community.read.own_spaces",
  ],
  // El capitán cuida al equipo que acompaña: cobertura sí, dinero no.
  capitan: [
    "people.read.assigned",
    "people.read.operational",
    "cycle.read.assigned",
    "attendance.write.assigned",
    "case.operate.operational",
    "followup.read.coverage",
    "team.read",
    "community.read.own_spaces",
  ],
  // El staff acompaña a SU grupo. Nada más.
  staff: [
    "people.read.assigned",
    "cycle.read.assigned",
    "attendance.write.assigned",
    "followup.read.own",
    "community.read.own_spaces",
  ],
  dream_team: ["people.read.assigned", "cycle.read.assigned", "community.read.own_spaces"],
  participante: ["community.read.own_spaces"],
};

export function capabilitiesOf(ctx: SessionContext): Set<Capability> {
  const set = new Set<Capability>();
  for (const role of ctx.roles) {
    for (const cap of ROLE_CAPABILITIES[role] ?? []) set.add(cap);
  }
  return set;
}

export function hasCapability(ctx: SessionContext, cap: Capability): boolean {
  return capabilitiesOf(ctx).has(cap);
}

export function hasAnyCapability(ctx: SessionContext, caps: Capability[]): boolean {
  const own = capabilitiesOf(ctx);
  return caps.some((c) => own.has(c));
}

/**
 * Guarda de página. Sustituye a `requireTeam()` sin lista de roles, que era
 * la causa de que finanzas pudiera abrir /generaciones/[id] por URL directa.
 */
export async function requireCapability(
  cap: Capability | Capability[]
): Promise<SessionContext> {
  const ctx = await requireSession();
  const caps = Array.isArray(cap) ? cap : [cap];
  if (!hasAnyCapability(ctx, caps)) {
    redirect(ctx.isTeam ? "/sin-acceso" : "/mi");
  }
  return ctx;
}

/** Misma verificación para comandos de servidor: lanza en vez de redirigir. */
export function assertCapability(ctx: SessionContext, cap: Capability): void {
  if (!hasCapability(ctx, cap)) {
    throw new Error(`Tu rol no tiene la capacidad «${cap}» para esta acción.`);
  }
}
