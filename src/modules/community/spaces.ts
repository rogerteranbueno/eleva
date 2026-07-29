import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/database.types";

/**
 * Espacios del Hub Centro.
 *
 * Los tres círculos concéntricos del blueprint doc 19: la generación (confianza
 * inmediata), el centro y sus alumni (continuidad), y —cuando existan sus
 * gates— la red global. Cada expansión es una decisión explícita: nada privado
 * asciende solo.
 */

export type SpaceKind = "generacion" | "centro" | "alumni" | "circulo" | "grupo" | "evento";

export const SPACE_KIND_LABEL: Record<SpaceKind, string> = {
  generacion: "Mi generación",
  centro: "Centro",
  alumni: "Alumni",
  circulo: "Círculo",
  grupo: "Mi grupo",
  evento: "Evento",
};

export const SPACE_KIND_HINT: Record<SpaceKind, string> = {
  generacion: "Tu generación a través de todas sus etapas. Lo que compartes aquí se queda aquí.",
  centro: "Todo el centro, de todas las generaciones.",
  alumni: "Quienes ya se graduaron: se acompañan, sirven y vuelven.",
  circulo: "Un tema, un anfitrión y un ritmo.",
  grupo: "Tu grupo pequeño.",
  evento: "La conversación alrededor de un evento.",
};

/** Orden de las pestañas: de lo más íntimo a lo más abierto. */
const ORDER: SpaceKind[] = ["generacion", "grupo", "centro", "alumni", "circulo", "evento"];

export type SpaceSummary = {
  id: string;
  kind: SpaceKind;
  slug: string;
  name: string;
  purpose: string | null;
  ritual: string | null;
  hostName?: string | null;
  memberCount: number;
  isMember: boolean;
  canJoin: boolean;
};

/** Espacios que esta persona puede ver, ordenados para la navegación. */
export async function listSpacesFor(
  supabase: SupabaseClient<Database>,
  personId: string
): Promise<SpaceSummary[]> {
  const { data } = await supabase
    .from("spaces")
    .select(
      "id, kind, slug, name, purpose, ritual, visibility, people:host_person_id(full_name), space_memberships(person_id)"
    )
    .is("archived_at", null);

  return (data ?? [])
    .map((s) => {
      const members = s.space_memberships ?? [];
      return {
        id: s.id,
        kind: s.kind as SpaceKind,
        slug: s.slug,
        name: s.name,
        purpose: s.purpose,
        ritual: s.ritual,
        hostName: s.people?.full_name ?? null,
        memberCount: members.length,
        isMember: members.some((m) => m.person_id === personId),
        canJoin:
          !members.some((m) => m.person_id === personId) &&
          ["centro", "circulo"].includes(s.kind),
      };
    })
    .sort((a, b) => {
      const byKind = ORDER.indexOf(a.kind) - ORDER.indexOf(b.kind);
      return byKind !== 0 ? byKind : a.name.localeCompare(b.name);
    });
}

/** El espacio que se abre por defecto: el más íntimo del que ya es miembro. */
export function defaultSpace(spaces: SpaceSummary[]): SpaceSummary | undefined {
  return spaces.find((s) => s.isMember) ?? spaces[0];
}
