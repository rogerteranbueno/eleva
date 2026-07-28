"use server";

import { revalidatePath } from "next/cache";
import { requireMember } from "@/lib/context";
import { createServiceClient, createUserClient } from "@/lib/supabase/server";
import { emitDomainEvent } from "@/lib/audit";

/**
 * Acciones del miembro. Usan el cliente con contexto de USUARIO:
 * RLS es la segunda línea de defensa real, no un adorno.
 */

export async function rsvpToEvent(formData: FormData) {
  const ctx = await requireMember();
  const eventId = String(formData.get("eventId"));
  const status = String(formData.get("status"));
  if (!["confirmado", "no_puedo"].includes(status)) throw new Error("Respuesta inválida.");

  const supabase = await createUserClient();
  const { error } = await supabase.from("rsvps").upsert(
    {
      organization_id: ctx.organizationId,
      event_id: eventId,
      person_id: ctx.personId,
      status,
      responded_at: new Date().toISOString(),
    },
    { onConflict: "event_id,person_id" }
  );
  if (error) throw new Error("No pudimos registrar tu respuesta. Intenta de nuevo.");

  await emitDomainEvent(createServiceClient(), {
    organizationId: ctx.organizationId,
    name: "event.rsvp_created",
    actor: { type: "person", id: ctx.personId },
    subject: { type: "event", id: eventId },
    properties: { status },
  });
  revalidatePath("/mi");
}

export async function completeMission(formData: FormData) {
  const ctx = await requireMember();
  const missionId = String(formData.get("missionId"));
  const note = String(formData.get("note") ?? "").trim();

  const service = createServiceClient();
  const { data: mission } = await service
    .from("missions")
    .select("id, cohort_id, organization_id")
    .eq("id", missionId)
    .eq("organization_id", ctx.organizationId)
    .single();
  if (!mission) throw new Error("La misión no existe.");

  const { data: participation } = await service
    .from("participations")
    .select("id")
    .eq("cohort_id", mission.cohort_id)
    .eq("person_id", ctx.personId)
    .single();
  if (!participation) throw new Error("No formas parte de esta generación.");

  const supabase = await createUserClient();
  const { error } = await supabase.from("mission_completions").insert({
    organization_id: ctx.organizationId,
    mission_id: mission.id,
    participation_id: participation.id,
    note: note || null,
  });
  if (error && !error.message.includes("duplicate")) {
    throw new Error("No pudimos registrar tu misión. Intenta de nuevo.");
  }

  await emitDomainEvent(service, {
    organizationId: ctx.organizationId,
    name: "mission.completed",
    actor: { type: "person", id: ctx.personId },
    subject: { type: "mission", id: mission.id },
    scope: { type: "cohort", id: mission.cohort_id },
  });
  revalidatePath("/mi");
}

export async function createPost(formData: FormData) {
  const ctx = await requireMember();
  const cohortId = String(formData.get("cohortId"));
  const kind = String(formData.get("kind") || "declaracion");
  const body = String(formData.get("body") ?? "").trim();
  if (body.length < 3) throw new Error("Escribe tu publicación antes de compartirla.");
  if (!["declaracion", "aprendizaje", "pregunta", "celebracion", "evidencia"].includes(kind)) {
    throw new Error("Tipo de publicación inválido.");
  }

  const supabase = await createUserClient();
  const { error } = await supabase.from("posts").insert({
    organization_id: ctx.organizationId,
    cohort_id: cohortId,
    author_person_id: ctx.personId,
    kind,
    body,
    visibility_scope: "generacion",
  });
  if (error) throw new Error("No pudimos publicar. Intenta de nuevo.");

  await emitDomainEvent(createServiceClient(), {
    organizationId: ctx.organizationId,
    name: "post.created",
    actor: { type: "person", id: ctx.personId },
    scope: { type: "cohort", id: cohortId },
    properties: { kind },
  });
  revalidatePath("/mi");
  revalidatePath("/mi/generacion");
}

export async function createComment(formData: FormData) {
  const ctx = await requireMember();
  const postId = String(formData.get("postId"));
  const body = String(formData.get("body") ?? "").trim();
  if (!body) throw new Error("Escribe tu comentario.");

  const supabase = await createUserClient();
  const { error } = await supabase.from("comments").insert({
    organization_id: ctx.organizationId,
    post_id: postId,
    author_person_id: ctx.personId,
    body,
  });
  if (error) throw new Error("No pudimos comentar. Intenta de nuevo.");

  await emitDomainEvent(createServiceClient(), {
    organizationId: ctx.organizationId,
    name: "comment.created",
    actor: { type: "person", id: ctx.personId },
    subject: { type: "post", id: postId },
  });
  revalidatePath("/mi");
  revalidatePath("/mi/generacion");
}
