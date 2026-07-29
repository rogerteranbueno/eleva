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
      event_occurrence_id: eventId,
      person_id: ctx.personId,
      status,
      responded_at: new Date().toISOString(),
    },
    { onConflict: "event_occurrence_id,person_id" }
  );
  if (error) throw new Error("No pudimos registrar tu respuesta. Intenta de nuevo.");

  await emitDomainEvent(createServiceClient(), {
    organizationId: ctx.organizationId,
    name: "event.rsvp_created",
    actor: { type: "person", id: ctx.personId },
    subject: { type: "event_occurrence", id: eventId },
    properties: { status },
  });
  revalidatePath("/mi");
  revalidatePath("/mi/eventos");
}

export async function completeMission(formData: FormData) {
  const ctx = await requireMember();
  const missionId = String(formData.get("missionId"));
  const note = String(formData.get("note") ?? "").trim();

  const service = createServiceClient();
  const { data: mission } = await service
    .from("missions")
    .select("id, stage_run_id, organization_id")
    .eq("id", missionId)
    .eq("organization_id", ctx.organizationId)
    .single();
  if (!mission) throw new Error("La misión no existe.");

  const { data: participation } = await service
    .from("stage_participations")
    .select("id")
    .eq("stage_run_id", mission.stage_run_id)
    .eq("person_id", ctx.personId)
    .single();
  if (!participation) throw new Error("No formas parte de esta etapa.");

  const supabase = await createUserClient();
  const { error } = await supabase.from("mission_completions").insert({
    organization_id: ctx.organizationId,
    mission_id: mission.id,
    stage_participation_id: participation.id,
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
    scope: { type: "stage_run", id: mission.stage_run_id },
  });
  revalidatePath("/mi");
}

/** Marca un libro del PL como leído. Es un logro propio, no una tarea vigilada. */
export async function markReadingDone(formData: FormData) {
  const ctx = await requireMember();
  const assignmentId = String(formData.get("assignmentId"));

  const service = createServiceClient();
  const { data: assignment } = await service
    .from("reading_assignments")
    .select("id, stage_run_id")
    .eq("id", assignmentId)
    .eq("organization_id", ctx.organizationId)
    .single();
  if (!assignment) throw new Error("La lectura no existe.");

  const { data: participation } = await service
    .from("stage_participations")
    .select("id")
    .eq("stage_run_id", assignment.stage_run_id)
    .eq("person_id", ctx.personId)
    .single();
  if (!participation) throw new Error("No formas parte de esta etapa.");

  const supabase = await createUserClient();
  const { error } = await supabase.from("reading_progress").insert({
    organization_id: ctx.organizationId,
    assignment_id: assignment.id,
    stage_participation_id: participation.id,
  });
  if (error && !error.message.includes("duplicate")) {
    throw new Error("No pudimos registrar tu lectura. Intenta de nuevo.");
  }

  await emitDomainEvent(service, {
    organizationId: ctx.organizationId,
    name: "reading.completed",
    actor: { type: "person", id: ctx.personId },
    subject: { type: "reading_assignment", id: assignment.id },
  });
  revalidatePath("/mi");
}

/* createPost vive ahora en actions/community.ts: publica en un ESPACIO. */

async function notify(args: {
  organizationId: string;
  personId: string;
  kind: "reaccion" | "comentario" | "reconocimiento" | "evento" | "sistema";
  text: string;
  href?: string;
}) {
  const service = createServiceClient();
  await service.from("notifications").insert({
    organization_id: args.organizationId,
    person_id: args.personId,
    kind: args.kind,
    text: args.text,
    href: args.href,
  });
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

  const service = createServiceClient();
  const { data: post } = await service
    .from("posts")
    .select("author_person_id")
    .eq("id", postId)
    .single();
  if (post && post.author_person_id !== ctx.personId) {
    await notify({
      organizationId: ctx.organizationId,
      personId: post.author_person_id,
      kind: "comentario",
      text: `${ctx.personName} respondió a tu publicación.`,
      href: "/mi/comunidad",
    });
  }

  await emitDomainEvent(service, {
    organizationId: ctx.organizationId,
    name: "comment.created",
    actor: { type: "person", id: ctx.personId },
    subject: { type: "post", id: postId },
  });
  revalidatePath("/mi");
  revalidatePath("/mi/comunidad");
}

/** Una reacción por persona por post; volver a elegir la misma la quita. */
export async function reactToPost(formData: FormData) {
  const ctx = await requireMember();
  const postId = String(formData.get("postId"));
  const kind = String(formData.get("kind"));

  const supabase = await createUserClient();
  const { data: existing } = await supabase
    .from("post_reactions")
    .select("id, kind")
    .eq("post_id", postId)
    .eq("person_id", ctx.personId)
    .maybeSingle();

  if (existing?.kind === kind) {
    await supabase.from("post_reactions").delete().eq("id", existing.id);
  } else if (existing) {
    await supabase.from("post_reactions").update({ kind }).eq("id", existing.id);
  } else {
    const { error } = await supabase.from("post_reactions").insert({
      organization_id: ctx.organizationId,
      post_id: postId,
      person_id: ctx.personId,
      kind,
    });
    if (error) throw new Error("No pudimos registrar tu reacción.");

    const service = createServiceClient();
    const { data: post } = await service
      .from("posts")
      .select("author_person_id")
      .eq("id", postId)
      .single();
    if (post && post.author_person_id !== ctx.personId) {
      const { REACTION_BY_KIND } = await import("@/modules/community/postTypes");
      await notify({
        organizationId: ctx.organizationId,
        personId: post.author_person_id,
        kind: "reaccion",
        text: `${ctx.personName} reaccionó «${REACTION_BY_KIND[kind]?.label ?? kind}» a tu publicación.`,
        href: "/mi/comunidad",
      });
    }
  }
  revalidatePath("/mi/comunidad");
  revalidatePath("/mi");
}

export async function giveRecognition(formData: FormData) {
  const ctx = await requireMember();
  const toPersonId = String(formData.get("toPersonId"));
  const text = String(formData.get("text") ?? "").trim();
  const impact = String(formData.get("impact") ?? "").trim();
  if (text.length < 5) throw new Error("Escribe por qué reconoces a esta persona.");

  const supabase = await createUserClient();
  const { error } = await supabase.from("recognitions").insert({
    organization_id: ctx.organizationId,
    from_person_id: ctx.personId,
    to_person_id: toPersonId,
    text,
    impact: impact || null,
  });
  if (error) throw new Error("No pudimos registrar el reconocimiento.");

  await notify({
    organizationId: ctx.organizationId,
    personId: toPersonId,
    kind: "reconocimiento",
    text: `${ctx.personName} te reconoció: «${text.slice(0, 80)}»`,
    href: "/mi/perfil",
  });
  await emitDomainEvent(createServiceClient(), {
    organizationId: ctx.organizationId,
    name: "recognition.given",
    actor: { type: "person", id: ctx.personId },
    subject: { type: "person", id: toPersonId },
  });
  revalidatePath(`/mi/personas/${toPersonId}`);
}

export async function updateMyProfile(formData: FormData) {
  const ctx = await requireMember();
  const declaration = String(formData.get("declaration") ?? "").trim();
  const lookingFor = formData
    .getAll("lookingFor")
    .map(String)
    .filter(Boolean);

  const supabase = await createUserClient();
  const { error } = await supabase
    .from("people")
    .update({
      declaration: declaration || null,
      looking_for: lookingFor,
      updated_at: new Date().toISOString(),
    })
    .eq("id", ctx.personId);
  if (error) throw new Error("No pudimos guardar tu perfil.");
  revalidatePath("/mi/perfil");
}

export async function markNotificationsRead() {
  const ctx = await requireMember();
  const supabase = await createUserClient();
  await supabase
    .from("notifications")
    .update({ read: true })
    .eq("person_id", ctx.personId)
    .eq("read", false);
  revalidatePath("/mi/avisos");
}
