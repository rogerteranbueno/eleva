"use server";

import { createServiceClient } from "@/lib/supabase/server";

/**
 * Acciones públicas del website. Sin sesión: cualquiera puede llamarlas desde
 * una página no autenticada. La lista de espera de Red ELEVA solo registra
 * intención — no otorga acceso a nada.
 */
export async function joinRedElevaWaitlist(
  formData: FormData
): Promise<{ ok: boolean; error?: string }> {
  const fullName = String(formData.get("fullName") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const role = String(formData.get("role") ?? "");
  const centerName = String(formData.get("centerName") ?? "").trim() || null;
  const message = String(formData.get("message") ?? "").trim() || null;

  if (!fullName || !email || !["dirijo_centro", "persona_entrenada"].includes(role)) {
    return { ok: false, error: "Completa tu nombre, correo y quién eres." };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, error: "Ese correo no parece válido." };
  }

  const service = createServiceClient();
  const { error } = await service.from("red_eleva_waitlist").insert({
    full_name: fullName,
    email,
    role,
    center_name: centerName,
    message,
  });
  if (error) return { ok: false, error: "No pudimos guardar tu lugar. Intenta de nuevo." };
  return { ok: true };
}
