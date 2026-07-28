import Anthropic from "@anthropic-ai/sdk";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/database.types";
import type { Metric } from "@/modules/intelligence/metrics";
import { emitDomainEvent } from "@/lib/audit";

type Service = SupabaseClient<Database>;

/**
 * Gateway de IA de ELEVA — server-only.
 * Reglas del blueprint: la IA propone y explica con datos ya autorizados del
 * tenant; una persona decide. Nunca contacta, sanciona ni modifica nada.
 * Sin ANTHROPIC_API_KEY (o con ELEVA_AI_KILL_SWITCH=1) todo cae a plantillas
 * deterministas etiquetadas como tales.
 */

const MODEL = "claude-opus-5";

export function aiEnabled() {
  return (
    !!process.env.ANTHROPIC_API_KEY && process.env.ELEVA_AI_KILL_SWITCH !== "1"
  );
}

const SYSTEM = `Eres la inteligencia de negocios de ELEVA, la plataforma para centros de transformación personal. Escribes en español de México, con voz directa, cálida y específica.

Reglas inquebrantables:
- Solo usas los datos que se te entregan; nunca inventes cifras ni nombres.
- Cada afirmación cuantitativa menciona su fuente entre paréntesis (p. ej. "(fuente: asistencia por sesión)").
- Una señal es evidencia observable, jamás un diagnóstico clínico ni un juicio sobre la persona.
- Nunca uses vergüenza, FOMO, urgencia falsa ni presión. No llames "fracaso" a una pausa o ausencia.
- Distingue estimación, señal, recomendación y hecho. Tus recomendaciones son propuestas: la decisión es humana.
- Sé conciso: el equipo del centro tiene poco tiempo.`;

async function runClaude(args: {
  service: Service;
  organizationId: string;
  kind: string;
  prompt: string;
  maxTokens?: number;
}): Promise<{ text: string; model: string } | null> {
  if (!aiEnabled()) return null;
  const client = new Anthropic();
  const started = Date.now();
  try {
    const response = await client.beta.messages.create({
      model: MODEL,
      max_tokens: args.maxTokens ?? 1024,
      output_config: { effort: "low" },
      betas: ["server-side-fallback-2026-07-01"],
      fallbacks: "default",
      system: SYSTEM,
      messages: [{ role: "user", content: args.prompt }],
    });
    if (response.stop_reason === "refusal") return null;
    const text = response.content
      .filter((b) => b.type === "text")
      .map((b) => b.text)
      .join("\n")
      .trim();
    if (!text) return null;

    await emitDomainEvent(args.service, {
      organizationId: args.organizationId,
      name: "model.run",
      properties: {
        kind: args.kind,
        model: response.model,
        input_tokens: response.usage.input_tokens,
        output_tokens: response.usage.output_tokens,
        ms: Date.now() - started,
      },
    });
    return { text, model: response.model };
  } catch (error) {
    console.error("[ai] runClaude falló:", error);
    return null;
  }
}

// ---------------------------------------------------------------------------
// Resumen semanal del Pulso
// ---------------------------------------------------------------------------

export type WeeklySummaryResult = {
  lines: string[];
  source: "claude" | "plantilla";
  model?: string;
  generatedAt: string;
};

function templateSummary(args: {
  metrics: Metric[];
  centerMomentum: number;
  openCases: number;
  integrity: string[];
}): string[] {
  const lines: string[] = [];
  const byId = (id: string) => args.metrics.find((m) => m.id === id);
  const show = byId("show_rate");
  const activation = byId("hub_activation");
  const sla = byId("signal_sla");
  if (show?.value && show.value !== "—") {
    lines.push(
      `La asistencia va en ${show.value} ${show.comparison ? `(${show.comparison})` : ""} (fuente: registro de asistencia).`
    );
  }
  if (args.openCases > 0) {
    lines.push(
      `Hay ${args.openCases} casos abiertos en la cola; atenderlos hoy evita perder continuidad (fuente: motor de señales).`
    );
  }
  if (activation?.value && activation.value !== "—") {
    lines.push(
      `${activation.detail} (fuente: actividad del Hub).`
    );
  }
  if (sla?.detail) {
    lines.push(`Señales atendidas en 24 h: ${sla.value} — ${sla.detail} (fuente: intervenciones).`);
  }
  for (const note of args.integrity) {
    lines.push(`⚠️ ${note}`);
  }
  return lines.slice(0, 6);
}

export async function getWeeklySummary(
  service: Service,
  organizationId: string,
  data: {
    metrics: Metric[];
    centerMomentum: number;
    openCases: number;
    integrity: string[];
    organizationName: string;
  }
): Promise<WeeklySummaryResult> {
  // Cache: un resumen por día es suficiente para un Pulso.
  const { data: cached } = await service
    .from("ai_summaries")
    .select("content, source, model, created_at")
    .eq("organization_id", organizationId)
    .eq("kind", "pulso_semanal")
    .gt("created_at", new Date(Date.now() - 20 * 3600_000).toISOString())
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (cached) {
    const content = cached.content as { lines: string[] };
    return {
      lines: content.lines,
      source: cached.source as "claude" | "plantilla",
      model: cached.model ?? undefined,
      generatedAt: cached.created_at,
    };
  }

  const fallback = templateSummary(data);
  let lines = fallback;
  let source: "claude" | "plantilla" = "plantilla";
  let model: string | undefined;

  const claudeResult = await runClaude({
    service,
    organizationId,
    kind: "pulso_semanal",
    maxTokens: 900,
    prompt: `Escribe el resumen semanal del Pulso de "${data.organizationName}" para su equipo de dirección.

Datos certificados de hoy (JSON):
${JSON.stringify(
      {
        momentum_del_centro: data.centerMomentum,
        casos_abiertos: data.openCases,
        notas_de_integridad: data.integrity,
        metricas: data.metrics.map((m) => ({
          nombre: m.name,
          valor: m.value,
          detalle: m.detail,
          comparacion: m.comparison,
          estado: m.state,
          fuente: m.source,
        })),
      },
      null,
      2
    )}

Devuelve entre 3 y 5 líneas, una por renglón, sin viñetas ni numeración. Cada línea: un hallazgo o recomendación accionable con su fuente entre paréntesis. Si alguna métrica está "provisional", dilo. Cierra con la acción más importante de la semana.`,
  });
  if (claudeResult) {
    const parsed = claudeResult.text
      .split("\n")
      .map((l) => l.replace(/^[-•*\d.\s]+/, "").trim())
      .filter((l) => l.length > 10)
      .slice(0, 6);
    if (parsed.length >= 2) {
      lines = parsed;
      source = "claude";
      model = claudeResult.model;
    }
  }

  await service.from("ai_summaries").insert({
    organization_id: organizationId,
    kind: "pulso_semanal",
    content: { lines } as never,
    source,
    model,
  });

  return { lines, source, model, generatedAt: new Date().toISOString() };
}

// ---------------------------------------------------------------------------
// Lectura de un caso
// ---------------------------------------------------------------------------

export async function getCaseExplanation(
  service: Service,
  organizationId: string,
  caseData: {
    id: string;
    title: string;
    updatedAt: string;
    signals: { name?: string; explanation: string; rule?: string }[];
    personName?: string;
    momentumScore?: number;
    consentChannels: string[];
  }
): Promise<{ text: string; model?: string } | null> {
  if (!aiEnabled()) return null;

  const { data: cached } = await service
    .from("ai_summaries")
    .select("content, model, created_at")
    .eq("organization_id", organizationId)
    .eq("kind", "caso")
    .eq("ref_id", caseData.id)
    .gt("created_at", caseData.updatedAt)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (cached) {
    return {
      text: (cached.content as { text: string }).text,
      model: cached.model ?? undefined,
    };
  }

  const result = await runClaude({
    service,
    organizationId,
    kind: "caso",
    maxTokens: 600,
    prompt: `Un miembro del equipo de Oficinas abre este caso de seguimiento. Escribe una lectura breve (máximo 4 frases en un solo párrafo): qué está pasando según la evidencia, y qué conviene hacer primero y por qué. Recuerda: propuesta, no orden; sin juicios sobre la persona.

Caso: ${caseData.title}
${caseData.personName ? `Persona: ${caseData.personName}` : ""}
${caseData.momentumScore !== undefined ? `Momentum (participación activa 30 días): ${caseData.momentumScore}/100` : ""}
Canales con consentimiento: ${caseData.consentChannels.length ? caseData.consentChannels.join(", ") : "ninguno registrado"}
Señales:
${caseData.signals.map((s) => `- ${s.name ?? "señal"}: ${s.explanation}`).join("\n")}`,
  });
  if (!result) return null;

  await service.from("ai_summaries").insert({
    organization_id: organizationId,
    kind: "caso",
    ref_id: caseData.id,
    content: { text: result.text } as never,
    source: "claude",
    model: result.model,
  });

  return result;
}

// ---------------------------------------------------------------------------
// Borrador de mensaje respetuoso
// ---------------------------------------------------------------------------

export async function draftContactMessage(
  service: Service,
  organizationId: string,
  args: {
    organizationName: string;
    personPreferredName: string;
    channel: string;
    signals: { explanation: string }[];
  }
): Promise<string | null> {
  const result = await runClaude({
    service,
    organizationId,
    kind: "borrador",
    maxTokens: 400,
    prompt: `Escribe un borrador de mensaje de ${args.channel} de parte del equipo de "${args.organizationName}" para ${args.personPreferredName}. Contexto interno (NO lo menciones literalmente): ${args.signals.map((s) => s.explanation).join(" · ")}

Reglas del mensaje: cálido y breve (máximo 3 frases), sin culpar ni pedir explicaciones, sin mencionar "señales" ni "sistema", ofrece una forma ligera de retomar o resolver, termina con una pregunta abierta. Devuelve SOLO el texto del mensaje.`,
  });
  return result?.text ?? null;
}
