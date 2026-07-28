/**
 * Catálogo social del Hub Centro — heredado de Creania, sobre el modelo nuevo.
 * 9 tipos de publicación con campos estructurados y 7 reacciones con
 * significado. Nunca "like", nunca "muro".
 */

export type FieldDef = { key: string; label: string; placeholder: string; required?: boolean };

export type PostTypeDef = {
  kind: string;
  label: string;
  emoji: string;
  desc: string;
  bodyPlaceholder: string;
  fields: FieldDef[];
  teamOnly?: boolean;
};

export const POST_TYPES: PostTypeDef[] = [
  {
    kind: "declaracion",
    label: "Declaración",
    emoji: "📣",
    desc: "Declara qué vas a crear o cambiar esta semana.",
    bodyPlaceholder: "Declaro que…",
    fields: [],
  },
  {
    kind: "aprendizaje",
    label: "Aprendizaje",
    emoji: "💡",
    desc: "Comparte algo que descubriste sobre ti o tu proceso.",
    bodyPlaceholder: "Esta semana me di cuenta de que…",
    fields: [],
  },
  {
    kind: "evidencia",
    label: "Evidencia",
    emoji: "✅",
    desc: "Muestra una acción que tomaste después de declararla.",
    bodyPlaceholder: "Cuenta brevemente qué pasó…",
    fields: [
      { key: "declare", label: "Declaré que", placeholder: "Lo que había declarado…", required: true },
      { key: "hice", label: "La acción que tomé", placeholder: "Lo que hice al respecto…", required: true },
      { key: "aprendi", label: "Aprendí", placeholder: "Qué me llevo (opcional)" },
      { key: "siguientePaso", label: "Siguiente paso", placeholder: "Qué sigue (opcional)" },
    ],
  },
  {
    kind: "pregunta",
    label: "Pregunta",
    emoji: "❓",
    desc: "Pregunta a tu generación; alguien ya pasó por ahí.",
    bodyPlaceholder: "¿Alguien más…?",
    fields: [],
  },
  {
    kind: "celebracion",
    label: "Celebración",
    emoji: "🎉",
    desc: "Celebra un logro tuyo o de alguien de tu grupo.",
    bodyPlaceholder: "¡Lo logré! …",
    fields: [
      { key: "aQuien", label: "A quién celebras", placeholder: "Si celebras a alguien más (opcional)" },
    ],
  },
  {
    kind: "ayuda",
    label: "Ayuda",
    emoji: "🤲",
    desc: "Pide apoyo concreto. Pedir también es parte del entrenamiento.",
    bodyPlaceholder: "Contexto de lo que estás atravesando…",
    fields: [
      { key: "necesito", label: "Necesito", placeholder: "Qué apoyo concreto necesitas", required: true },
      { key: "plazo", label: "Para cuándo", placeholder: "Si hay una fecha (opcional)" },
    ],
  },
  {
    kind: "proyecto",
    label: "Proyecto",
    emoji: "🚀",
    desc: "Presenta el proyecto que estás construyendo.",
    bodyPlaceholder: "De qué va tu proyecto…",
    fields: [
      { key: "nombre", label: "Nombre del proyecto", placeholder: "Cómo se llama", required: true },
      { key: "busco", label: "Busco", placeholder: "Aliados, feedback, clientes… (opcional)" },
    ],
  },
  {
    kind: "oportunidad",
    label: "Oportunidad",
    emoji: "💼",
    desc: "Ofrece algo a tu comunidad: trabajo, colaboración, un espacio.",
    bodyPlaceholder: "Detalles de la oportunidad…",
    fields: [
      { key: "ofrezco", label: "Ofrezco", placeholder: "Qué ofreces", required: true },
      { key: "para", label: "Ideal para", placeholder: "A quién le sirve (opcional)" },
    ],
  },
  {
    kind: "aviso",
    label: "Aviso",
    emoji: "📌",
    desc: "Comunicado del equipo del centro.",
    bodyPlaceholder: "El aviso…",
    fields: [],
    teamOnly: true,
  },
];

export const POST_TYPE_BY_KIND = Object.fromEntries(POST_TYPES.map((t) => [t.kind, t]));

export const FIELD_LABELS: Record<string, string> = Object.fromEntries(
  POST_TYPES.flatMap((t) => t.fields.map((f) => [f.key, f.label]))
);

export const REACTIONS: { kind: string; label: string; emoji: string }[] = [
  { kind: "te_veo", label: "Te veo", emoji: "👁️" },
  { kind: "te_reconozco", label: "Te reconozco", emoji: "🏅" },
  { kind: "me_inspira", label: "Me inspira", emoji: "✨" },
  { kind: "gracias", label: "Gracias por compartir", emoji: "🙏" },
  { kind: "estoy_contigo", label: "Estoy contigo", emoji: "🤝" },
  { kind: "poderoso", label: "Poderoso", emoji: "🔥" },
  { kind: "posibilidad", label: "Me abrió posibilidad", emoji: "🌱" },
];

export const REACTION_BY_KIND = Object.fromEntries(REACTIONS.map((r) => [r.kind, r]));
