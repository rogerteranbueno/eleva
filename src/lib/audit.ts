import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/database.types";

type Service = SupabaseClient<Database>;

/** Auditoría de acciones sensibles. Se escribe junto con la acción, no después. */
export async function logAudit(
  service: Service,
  entry: {
    organizationId: string;
    actorPersonId: string;
    action: string;
    objectType: string;
    objectId?: string;
    details?: Record<string, unknown>;
  }
) {
  await service.from("audit_events").insert({
    organization_id: entry.organizationId,
    actor_person_id: entry.actorPersonId,
    action: entry.action,
    object_type: entry.objectType,
    object_id: entry.objectId,
    details: (entry.details ?? {}) as never,
  });
}

/** Evento de dominio (hechos en pasado, versión explícita). */
export async function emitDomainEvent(
  service: Service,
  event: {
    organizationId: string;
    name: string;
    version?: number;
    actor?: { type: string; id: string };
    subject?: { type: string; id: string };
    scope?: { type: string; id: string };
    properties?: Record<string, unknown>;
  }
) {
  await service.from("domain_events").insert({
    organization_id: event.organizationId,
    event_name: event.name,
    event_version: event.version ?? 1,
    actor: (event.actor ?? {}) as never,
    subject: (event.subject ?? {}) as never,
    scope: (event.scope ?? {}) as never,
    properties: (event.properties ?? {}) as never,
  });
}
