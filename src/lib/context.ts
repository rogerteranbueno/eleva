import { cache } from "react";
import { redirect } from "next/navigation";
import { createServiceClient, createUserClient } from "@/lib/supabase/server";

export type Role =
  | "dueno"
  | "oficinas"
  | "entrenador"
  | "coach"
  | "capitan"
  | "staff"
  | "dream_team"
  | "finanzas"
  | "participante";

export const TEAM_ROLES: Role[] = [
  "dueno",
  "oficinas",
  "entrenador",
  "coach",
  "capitan",
  "staff",
  "dream_team",
  "finanzas",
];

export type SessionContext = {
  userId: string;
  personId: string;
  personName: string;
  preferredName: string;
  organizationId: string;
  organizationName: string;
  organizationSlug: string;
  isDemo: boolean;
  roles: Role[];
  isTeam: boolean;
};

/**
 * Contexto verificado de sesión. El tenant activo se deriva de la membresía,
 * jamás de un parámetro del cliente. Roles = asignaciones vigentes hoy.
 */
export const getSessionContext = cache(
  async (): Promise<SessionContext | null> => {
    const supabase = await createUserClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return null;

    const service = createServiceClient();
    const { data: person } = await service
      .from("people")
      .select("id, full_name, preferred_name")
      .eq("user_id", user.id)
      .single();
    if (!person) return null;

    const { data: memberships } = await service
      .from("organization_memberships")
      .select("id, organization_id, organizations(name, slug, is_demo)")
      .eq("person_id", person.id)
      .eq("status", "active");
    const membership = memberships?.[0];
    if (!membership) return null;

    const now = new Date().toISOString();
    const { data: assignments } = await service
      .from("role_assignments")
      .select("role, starts_at, ends_at")
      .eq("membership_id", membership.id)
      .lte("starts_at", now);
    const roles = (assignments ?? [])
      .filter((a) => !a.ends_at || a.ends_at > now)
      .map((a) => a.role as Role);

    const org = membership.organizations;
    return {
      userId: user.id,
      personId: person.id,
      personName: person.full_name,
      preferredName: person.preferred_name ?? person.full_name.split(" ")[0],
      organizationId: membership.organization_id,
      organizationName: org?.name ?? "",
      organizationSlug: org?.slug ?? "",
      isDemo: org?.is_demo ?? false,
      roles,
      isTeam: roles.some((r) => TEAM_ROLES.includes(r)),
    };
  }
);

export async function requireSession(): Promise<SessionContext> {
  const ctx = await getSessionContext();
  if (!ctx) redirect("/login");
  return ctx;
}

/** Exige un rol de equipo vigente; opcionalmente uno de una lista concreta. */
export async function requireTeam(roles?: Role[]): Promise<SessionContext> {
  const ctx = await requireSession();
  if (!ctx.isTeam) redirect("/mi");
  if (roles && !ctx.roles.some((r) => roles.includes(r))) redirect("/hoy");
  return ctx;
}

export async function requireMember(): Promise<SessionContext> {
  const ctx = await requireSession();
  if (!ctx.roles.includes("participante") && !ctx.isTeam) redirect("/login");
  return ctx;
}

/** Home por rol: cada quien empieza por su trabajo, no por el mapa de módulos. */
export function teamHome(ctx: SessionContext): string {
  if (ctx.roles.includes("dueno")) return "/pulso";
  if (ctx.roles.includes("oficinas")) return "/hoy";
  if (ctx.roles.includes("finanzas")) return "/finanzas";
  if (ctx.roles.includes("entrenador") || ctx.roles.includes("coach")) return "/generaciones";
  if (ctx.roles.includes("capitan")) return "/cobertura";
  if (ctx.roles.includes("staff")) return "/mi-grupo";
  if (ctx.isTeam) return "/hoy";
  return "/mi";
}

export type CaseKind = "finanzas" | "entrega" | "pase" | "registro" | "comunidad" | "operacion";

/* La autorización vive en `lib/capabilities.ts`. Aquí solo queda la sesión:
   quién eres, en qué centro y con qué roles vigentes. */
