import { cache } from "react";
import { notFound } from "next/navigation";
import { createServiceClient } from "@/lib/supabase/server";
import { capabilitiesOf } from "@/lib/capabilities";
import type { SessionContext } from "@/lib/context";

/**
 * Ámbito de lectura.
 *
 * Las páginas renderizan con el cliente de servicio (para poder hacer joins y
 * agregados que RLS no expresa), y ese cliente SALTA las políticas de la base.
 * Por eso la autorización no puede quedarse en RLS: cada lectura de personas o
 * participaciones tiene que filtrarse por un ámbito calculado aquí.
 *
 * `"all"` significa "todo el centro" y solo lo devuelven roles con capacidad
 * operativa amplia. Cualquier otro rol recibe una lista explícita de ids.
 */

export type Scope = "all" | string[];

export function scopeIncludes(scope: Scope, id: string): boolean {
  return scope === "all" || scope.includes(id);
}

/** Filtro para PostgREST: aplica `.in(column, ids)` salvo que el ámbito sea total. */
export function applyScope<T extends { in: (col: string, vals: string[]) => T }>(
  query: T,
  column: string,
  scope: Scope
): T {
  if (scope === "all") return query;
  // `.in()` con arreglo vacío revienta en PostgREST: usamos un id imposible.
  return query.in(column, scope.length > 0 ? scope : ["00000000-0000-0000-0000-000000000000"]);
}

/**
 * Participaciones que este contexto puede leer.
 * - operativo amplio → todas las del centro
 * - staff/dream_team → solo las de sus grupos asignados, más las propias
 * - capitán → las de las etapas donde tiene asignación vigente
 */
export const readableParticipationIds = cache(
  async (ctx: SessionContext): Promise<Scope> => {
    const caps = capabilitiesOf(ctx);
    if (caps.has("cycle.read.all")) return "all";

    const service = createServiceClient();
    const now = new Date().toISOString();
    const ids = new Set<string>();

    // Siempre las propias.
    const { data: own } = await service
      .from("stage_participations")
      .select("id")
      .eq("person_id", ctx.personId)
      .eq("organization_id", ctx.organizationId);
    for (const p of own ?? []) ids.add(p.id);

    // Las de los grupos que acompaña como staff.
    const { data: groups } = await service
      .from("small_groups")
      .select("small_group_members(stage_participation_id)")
      .eq("staff_person_id", ctx.personId)
      .eq("organization_id", ctx.organizationId);
    for (const g of groups ?? []) {
      for (const m of g.small_group_members ?? []) ids.add(m.stage_participation_id);
    }

    // Las de las etapas donde coordina (capitán/entrenador de esa etapa).
    const { data: assignments } = await service
      .from("team_assignments")
      .select("stage_run_id, role")
      .eq("person_id", ctx.personId)
      .eq("organization_id", ctx.organizationId)
      .in("role", ["capitan", "entrenador", "coach"])
      .lte("starts_at", now)
      .or(`ends_at.is.null,ends_at.gt.${now}`);
    const runIds = [...new Set((assignments ?? []).map((a) => a.stage_run_id))];
    if (runIds.length > 0) {
      const { data: inRuns } = await service
        .from("stage_participations")
        .select("id")
        .in("stage_run_id", runIds);
      for (const p of inRuns ?? []) ids.add(p.id);
    }

    return [...ids];
  }
);

/** Personas que este contexto puede abrir en un expediente. */
export const readablePersonIds = cache(
  async (ctx: SessionContext): Promise<Scope> => {
    const caps = capabilitiesOf(ctx);
    if (caps.has("people.read.operational")) return "all";

    const service = createServiceClient();
    const scope = await readableParticipationIds(ctx);
    const ids = new Set<string>([ctx.personId]);
    if (scope === "all") return "all";
    if (scope.length > 0) {
      const { data } = await service
        .from("stage_participations")
        .select("person_id")
        .in("id", scope);
      for (const p of data ?? []) ids.add(p.person_id);
    }
    return [...ids];
  }
);

/**
 * Guarda de expediente: 404 si la persona está fuera del ámbito.
 * Un 404 (no un 403) evita confirmar que esa persona existe en el centro.
 */
export async function assertCanReadPerson(
  ctx: SessionContext,
  personId: string
): Promise<void> {
  const scope = await readablePersonIds(ctx);
  if (!scopeIncludes(scope, personId)) notFound();
}

/** Ciclos que este contexto puede abrir. */
export const readableCycleIds = cache(
  async (ctx: SessionContext): Promise<Scope> => {
    const caps = capabilitiesOf(ctx);
    if (caps.has("cycle.read.all")) return "all";

    const service = createServiceClient();
    const now = new Date().toISOString();
    const runIds = new Set<string>();

    const { data: assignments } = await service
      .from("team_assignments")
      .select("stage_run_id")
      .eq("person_id", ctx.personId)
      .eq("organization_id", ctx.organizationId)
      .lte("starts_at", now)
      .or(`ends_at.is.null,ends_at.gt.${now}`);
    for (const a of assignments ?? []) runIds.add(a.stage_run_id);

    const { data: own } = await service
      .from("stage_participations")
      .select("stage_run_id")
      .eq("person_id", ctx.personId)
      .eq("organization_id", ctx.organizationId);
    for (const p of own ?? []) runIds.add(p.stage_run_id);

    if (runIds.size === 0) return [];
    const { data: runs } = await service
      .from("stage_runs")
      .select("cycle_id")
      .in("id", [...runIds]);
    return [...new Set((runs ?? []).map((r) => r.cycle_id))];
  }
);

export async function assertCanReadCycle(
  ctx: SessionContext,
  cycleId: string
): Promise<void> {
  const scope = await readableCycleIds(ctx);
  if (!scopeIncludes(scope, cycleId)) notFound();
}
