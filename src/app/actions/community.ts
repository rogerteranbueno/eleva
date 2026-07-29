"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireMember } from "@/lib/context";
import { createServiceClient, createUserClient } from "@/lib/supabase/server";
import { emitDomainEvent } from "@/lib/audit";

/**
 * Acciones del Hub Centro.
 *
 * Dos reglas gobiernan este archivo:
 *  1. Se escribe con el cliente de USUARIO: RLS decide en qué espacio puede
 *     publicar cada persona. Publicar en un espacio del que no eres miembro
 *     no falla "en la interfaz": falla en la base.
 *  2. El contenido nunca sube de audiencia solo. Cambiar de espacio no es
 *     editar: hay que volver a publicar y decidirlo explícitamente.
 */

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

// ---------------------------------------------------------------------------
// Publicaciones
// ---------------------------------------------------------------------------

export async function createPostInSpace(formData: FormData) {
  const ctx = await requireMember();
  const spaceId = String(formData.get("spaceId"));
  const kind = String(formData.get("kind") || "declaracion");
  const body = String(formData.get("body") ?? "").trim();
  if (body.length < 3) throw new Error("Escribe tu publicación antes de compartirla.");

  const { POST_TYPE_BY_KIND } = await import("@/modules/community/postTypes");
  const typeDef = POST_TYPE_BY_KIND[kind];
  if (!typeDef) throw new Error("Tipo de publicación inválido.");
  if (typeDef.teamOnly && !ctx.isTeam) throw new Error("Solo el equipo publica avisos.");

  const fields: Record<string, string> = {};
  for (const def of typeDef.fields) {
    const value = String(formData.get(`field_${def.key}`) ?? "").trim();
    if (def.required && !value) throw new Error(`Falta el campo «${def.label}».`);
    if (value) fields[def.key] = value;
  }

  // El id se genera aquí, no se lee de vuelta con RETURNING: pedir el registro
  // recién insertado en la misma sentencia (insert().select()) dispara la
  // política SELECT de posts (can_view_post, que se auto-referencia) ANTES de
  // que la fila sea visible para esa evaluación, y Postgres rechaza la
  // sentencia completa como si el INSERT hubiera violado RLS. Generar el id
  // de antemano evita depender de RETURNING por completo.
  const postId = randomUUID();
  const supabase = await createUserClient();
  const { error } = await supabase.from("posts").insert({
    id: postId,
    organization_id: ctx.organizationId,
    space_id: spaceId,
    author_person_id: ctx.personId,
    kind,
    body,
    fields: fields as never,
  });
  if (error) throw new Error("No pudimos publicar. ¿Sigues en ese espacio?");

  // Menciones: @nombre resuelto contra la gente del mismo centro.
  const mentioned = [...body.matchAll(/@([\p{L}]+(?:\s[\p{L}]+)?)/gu)].map((m) => m[1]);
  if (mentioned.length > 0) {
    const service = createServiceClient();
    for (const name of mentioned.slice(0, 5)) {
      const { data: person } = await service
        .from("people")
        .select("id, full_name, organization_memberships!inner(organization_id)")
        .eq("organization_memberships.organization_id", ctx.organizationId)
        .ilike("full_name", `${name}%`)
        .limit(1)
        .maybeSingle();
      if (!person || person.id === ctx.personId) continue;
      await service.from("post_mentions").insert({
        organization_id: ctx.organizationId,
        post_id: postId,
        person_id: person.id,
      });
      await notify({
        organizationId: ctx.organizationId,
        personId: person.id,
        kind: "comentario",
        text: `${ctx.personName} te mencionó en una publicación.`,
        href: `/mi/comunidad/p/${postId}`,
      });
    }
  }

  await emitDomainEvent(createServiceClient(), {
    organizationId: ctx.organizationId,
    name: "post.created",
    actor: { type: "person", id: ctx.personId },
    scope: { type: "space", id: spaceId },
    properties: { kind },
  });

  revalidatePath("/mi/comunidad");
  revalidatePath("/mi");
}

export async function editPost(formData: FormData) {
  const ctx = await requireMember();
  const postId = String(formData.get("postId"));
  const body = String(formData.get("body") ?? "").trim();
  if (body.length < 3) throw new Error("La publicación no puede quedar vacía.");

  const supabase = await createUserClient();
  const { error } = await supabase
    .from("posts")
    .update({ body, edited_at: new Date().toISOString(), updated_at: new Date().toISOString() })
    .eq("id", postId)
    .eq("author_person_id", ctx.personId);
  if (error) throw new Error("No pudimos guardar tu edición.");
  revalidatePath(`/mi/comunidad/p/${postId}`);
  revalidatePath("/mi/comunidad");
}

/** Borrado suave: el hilo y sus respuestas no se rompen. */
export async function deletePost(formData: FormData) {
  const ctx = await requireMember();
  const postId = String(formData.get("postId"));
  const supabase = await createUserClient();
  const { error } = await supabase
    .from("posts")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", postId)
    .eq("author_person_id", ctx.personId);
  if (error) throw new Error("No pudimos eliminar la publicación.");
  revalidatePath("/mi/comunidad");
  redirect("/mi/comunidad");
}

export async function toggleSavePost(formData: FormData) {
  const ctx = await requireMember();
  const postId = String(formData.get("postId"));
  const supabase = await createUserClient();
  const { data: existing } = await supabase
    .from("saved_posts")
    .select("id")
    .eq("post_id", postId)
    .eq("person_id", ctx.personId)
    .maybeSingle();
  if (existing) {
    await supabase.from("saved_posts").delete().eq("id", existing.id);
  } else {
    await supabase.from("saved_posts").insert({
      organization_id: ctx.organizationId,
      post_id: postId,
      person_id: ctx.personId,
    });
  }
  revalidatePath(`/mi/comunidad/p/${postId}`);
  revalidatePath("/mi/comunidad");
}

// ---------------------------------------------------------------------------
// Espacios
// ---------------------------------------------------------------------------

export async function joinSpace(formData: FormData) {
  const ctx = await requireMember();
  const spaceId = String(formData.get("spaceId"));
  const supabase = await createUserClient();
  const { error } = await supabase.from("space_memberships").insert({
    organization_id: ctx.organizationId,
    space_id: spaceId,
    person_id: ctx.personId,
  });
  if (error && !error.message.includes("duplicate")) {
    throw new Error("Ese espacio no está abierto para unirse.");
  }
  revalidatePath("/mi/comunidad");
}

export async function leaveSpace(formData: FormData) {
  const ctx = await requireMember();
  const spaceId = String(formData.get("spaceId"));
  const supabase = await createUserClient();
  await supabase
    .from("space_memberships")
    .delete()
    .eq("space_id", spaceId)
    .eq("person_id", ctx.personId);
  revalidatePath("/mi/comunidad");
}

// ---------------------------------------------------------------------------
// Relaciones
// ---------------------------------------------------------------------------

export async function toggleFollow(formData: FormData) {
  const ctx = await requireMember();
  const personId = String(formData.get("personId"));
  const supabase = await createUserClient();
  const { data: existing } = await supabase
    .from("follows")
    .select("id")
    .eq("follower_person_id", ctx.personId)
    .eq("followed_person_id", personId)
    .maybeSingle();
  if (existing) {
    await supabase.from("follows").delete().eq("id", existing.id);
  } else {
    const { error } = await supabase.from("follows").insert({
      organization_id: ctx.organizationId,
      follower_person_id: ctx.personId,
      followed_person_id: personId,
    });
    if (error) throw new Error("No pudimos registrar que sigues a esta persona.");
  }
  revalidatePath(`/mi/personas/${personId}`);
}

export async function requestConnection(formData: FormData) {
  const ctx = await requireMember();
  const personId = String(formData.get("personId"));
  const message = String(formData.get("message") ?? "").trim() || null;
  const supabase = await createUserClient();
  const { error } = await supabase.from("connection_requests").insert({
    organization_id: ctx.organizationId,
    from_person_id: ctx.personId,
    to_person_id: personId,
    message,
  });
  if (error && !error.message.includes("duplicate")) {
    throw new Error("No pudimos enviar la solicitud.");
  }
  await notify({
    organizationId: ctx.organizationId,
    personId,
    kind: "sistema",
    text: `${ctx.personName} quiere conectar contigo.`,
    href: "/mi/avisos",
  });
  revalidatePath(`/mi/personas/${personId}`);
}

export async function resolveConnection(formData: FormData) {
  const ctx = await requireMember();
  const requestId = String(formData.get("requestId"));
  const accept = String(formData.get("accept")) === "1";
  const supabase = await createUserClient();

  const { data: req } = await supabase
    .from("connection_requests")
    .select("id, from_person_id, to_person_id")
    .eq("id", requestId)
    .maybeSingle();
  if (!req || req.to_person_id !== ctx.personId) throw new Error("Solicitud no encontrada.");

  await supabase
    .from("connection_requests")
    .update({
      status: accept ? "aceptada" : "declinada",
      resolved_at: new Date().toISOString(),
    })
    .eq("id", requestId);

  if (accept) {
    const [a, b] = [req.from_person_id, req.to_person_id].sort();
    const service = createServiceClient();
    await service
      .from("connections")
      .insert({ organization_id: ctx.organizationId, person_a: a, person_b: b });
    await notify({
      organizationId: ctx.organizationId,
      personId: req.from_person_id,
      kind: "sistema",
      text: `${ctx.personName} aceptó tu conexión.`,
      href: `/mi/personas/${ctx.personId}`,
    });
  }
  revalidatePath("/mi/avisos");
}

export async function blockPerson(formData: FormData) {
  const ctx = await requireMember();
  const personId = String(formData.get("personId"));
  const supabase = await createUserClient();
  await supabase.from("blocks").insert({
    organization_id: ctx.organizationId,
    blocker_person_id: ctx.personId,
    blocked_person_id: personId,
  });
  // Bloquear deshace la relación en ambos sentidos.
  const service = createServiceClient();
  const [a, b] = [ctx.personId, personId].sort();
  await service.from("connections").delete().eq("person_a", a).eq("person_b", b);
  await service
    .from("follows")
    .delete()
    .or(
      `and(follower_person_id.eq.${ctx.personId},followed_person_id.eq.${personId}),and(follower_person_id.eq.${personId},followed_person_id.eq.${ctx.personId})`
    );
  revalidatePath("/mi/personas");
  redirect("/mi/personas");
}

// ---------------------------------------------------------------------------
// Mensajes — el centro nunca los lee (política, no promesa)
// ---------------------------------------------------------------------------

export async function sendMessage(formData: FormData) {
  const ctx = await requireMember();
  const conversationId = String(formData.get("conversationId"));
  const body = String(formData.get("body") ?? "").trim();
  if (!body) throw new Error("Escribe tu mensaje.");

  const supabase = await createUserClient();
  const { error } = await supabase.from("messages").insert({
    organization_id: ctx.organizationId,
    conversation_id: conversationId,
    sender_person_id: ctx.personId,
    body,
  });
  if (error) throw new Error("No pudimos enviar el mensaje.");

  const service = createServiceClient();
  await service
    .from("conversations")
    .update({ last_message_at: new Date().toISOString() })
    .eq("id", conversationId);
  const { data: others } = await service
    .from("conversation_members")
    .select("person_id")
    .eq("conversation_id", conversationId)
    .neq("person_id", ctx.personId);
  for (const o of others ?? []) {
    await notify({
      organizationId: ctx.organizationId,
      personId: o.person_id,
      kind: "sistema",
      text: `${ctx.personName} te envió un mensaje.`,
      href: `/mi/mensajes/${conversationId}`,
    });
  }
  revalidatePath(`/mi/mensajes/${conversationId}`);
}

/**
 * Escribir a alguien: si hay conexión, abre conversación; si no, envía una
 * SOLICITUD. Nadie recibe mensajes de desconocidos sin poder filtrarlos.
 */
export async function startConversation(formData: FormData) {
  const ctx = await requireMember();
  const personId = String(formData.get("personId"));
  const body = String(formData.get("body") ?? "").trim();
  if (!body) throw new Error("Escribe tu mensaje.");

  const service = createServiceClient();
  const [a, b] = [ctx.personId, personId].sort();
  const { data: connection } = await service
    .from("connections")
    .select("id")
    .eq("person_a", a)
    .eq("person_b", b)
    .maybeSingle();
  const { data: target } = await service
    .from("people")
    .select("accepts_messages")
    .eq("id", personId)
    .single();

  const puedeEscribirDirecto =
    !!connection || target?.accepts_messages === "centro";
  if (!puedeEscribirDirecto) {
    await service.from("message_requests").insert({
      organization_id: ctx.organizationId,
      from_person_id: ctx.personId,
      to_person_id: personId,
      body,
    });
    await notify({
      organizationId: ctx.organizationId,
      personId,
      kind: "sistema",
      text: `${ctx.personName} te envió una solicitud de mensaje.`,
      href: "/mi/mensajes",
    });
    revalidatePath("/mi/mensajes");
    return;
  }

  // ¿Ya existe una conversación directa entre las dos?
  const { data: mine } = await service
    .from("conversation_members")
    .select("conversation_id")
    .eq("person_id", ctx.personId);
  const { data: theirs } = await service
    .from("conversation_members")
    .select("conversation_id")
    .eq("person_id", personId);
  const shared = (mine ?? [])
    .map((m) => m.conversation_id)
    .find((id) => (theirs ?? []).some((t) => t.conversation_id === id));

  let conversationId = shared;
  if (!conversationId) {
    const { data: conv, error } = await service
      .from("conversations")
      .insert({
        organization_id: ctx.organizationId,
        kind: "directa",
        created_by: ctx.personId,
        last_message_at: new Date().toISOString(),
      })
      .select("id")
      .single();
    if (error) throw new Error("No pudimos abrir la conversación.");
    conversationId = conv.id;
    await service.from("conversation_members").insert([
      { organization_id: ctx.organizationId, conversation_id: conversationId, person_id: ctx.personId },
      { organization_id: ctx.organizationId, conversation_id: conversationId, person_id: personId },
    ]);
  }

  await service.from("messages").insert({
    organization_id: ctx.organizationId,
    conversation_id: conversationId,
    sender_person_id: ctx.personId,
    body,
  });
  await notify({
    organizationId: ctx.organizationId,
    personId,
    kind: "sistema",
    text: `${ctx.personName} te envió un mensaje.`,
    href: `/mi/mensajes/${conversationId}`,
  });
  redirect(`/mi/mensajes/${conversationId}`);
}

export async function resolveMessageRequest(formData: FormData) {
  const ctx = await requireMember();
  const requestId = String(formData.get("requestId"));
  const accept = String(formData.get("accept")) === "1";
  const service = createServiceClient();

  const { data: req } = await service
    .from("message_requests")
    .select("id, from_person_id, to_person_id, body")
    .eq("id", requestId)
    .single();
  if (!req || req.to_person_id !== ctx.personId) throw new Error("Solicitud no encontrada.");

  await service
    .from("message_requests")
    .update({
      status: accept ? "aceptada" : "declinada",
      resolved_at: new Date().toISOString(),
    })
    .eq("id", requestId);
  if (!accept) {
    revalidatePath("/mi/mensajes");
    return;
  }

  const { data: conv } = await service
    .from("conversations")
    .insert({
      organization_id: ctx.organizationId,
      kind: "directa",
      created_by: req.from_person_id,
      last_message_at: new Date().toISOString(),
    })
    .select("id")
    .single();
  await service.from("conversation_members").insert([
    { organization_id: ctx.organizationId, conversation_id: conv!.id, person_id: ctx.personId },
    { organization_id: ctx.organizationId, conversation_id: conv!.id, person_id: req.from_person_id },
  ]);
  await service.from("messages").insert({
    organization_id: ctx.organizationId,
    conversation_id: conv!.id,
    sender_person_id: req.from_person_id,
    body: req.body,
  });
  redirect(`/mi/mensajes/${conv!.id}`);
}

// ---------------------------------------------------------------------------
// Moderación
// ---------------------------------------------------------------------------

export async function reportContent(formData: FormData) {
  const ctx = await requireMember();
  const targetKind = String(formData.get("targetKind"));
  const targetId = String(formData.get("targetId"));
  const reason = String(formData.get("reason"));
  const detail = String(formData.get("detail") ?? "").trim() || null;
  if (!["post", "comment", "person", "message"].includes(targetKind)) {
    throw new Error("Objeto inválido.");
  }

  const supabase = await createUserClient();
  const { error } = await supabase.from("reports").insert({
    organization_id: ctx.organizationId,
    reporter_person_id: ctx.personId,
    target_kind: targetKind,
    target_id: targetId,
    reason,
    detail,
  });
  if (error) throw new Error("No pudimos registrar tu reporte.");

  await emitDomainEvent(createServiceClient(), {
    organizationId: ctx.organizationId,
    name: "report.created",
    actor: { type: "person", id: ctx.personId },
    properties: { target_kind: targetKind, reason },
  });
  revalidatePath("/mi/comunidad");
}

export async function updateMyCenterProfile(formData: FormData) {
  const ctx = await requireMember();
  const list = (key: string) =>
    String(formData.get(key) ?? "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
      .slice(0, 8);

  const supabase = await createUserClient();
  const { error } = await supabase
    .from("people")
    .update({
      declaration: String(formData.get("declaration") ?? "").trim() || null,
      bio: String(formData.get("bio") ?? "").trim() || null,
      city: String(formData.get("city") ?? "").trim() || null,
      interests: list("interests"),
      skills: list("skills"),
      offers: list("offers"),
      looking_for: formData.getAll("lookingFor").map(String).filter(Boolean),
      available_to_serve: formData.get("availableToServe") === "on",
      accepts_messages: String(formData.get("acceptsMessages") ?? "centro"),
      updated_at: new Date().toISOString(),
    })
    .eq("id", ctx.personId);
  if (error) throw new Error("No pudimos guardar tu perfil.");

  // Privacidad por campo: cada bloque decide su audiencia.
  const service = createServiceClient();
  for (const field of ["bio", "city", "interests", "skills", "offers", "declaration"]) {
    const visibility = String(formData.get(`vis_${field}`) ?? "centro");
    if (!["privado", "generacion", "centro"].includes(visibility)) continue;
    await service
      .from("profile_field_visibility")
      .upsert(
        { person_id: ctx.personId, field, visibility },
        { onConflict: "person_id,field" }
      );
  }
  revalidatePath("/mi/perfil");
}
