"use server";

import { redirect } from "next/navigation";
import { requireSession, teamHome, getSessionContext } from "@/lib/context";
import { createUserClient } from "@/lib/supabase/server";

/**
 * Selector de vista del demo: cambia entre las cuentas sintéticas del tenant
 * demo con un clic. SOLO funciona si la sesión actual pertenece a una
 * organización demo y el destino es una cuenta demo conocida.
 */
const DEMO_ACCOUNTS = new Set([
  "duena@aurora.demo",
  "oficinas@aurora.demo",
  "entrenador@aurora.demo",
  "finanzas@aurora.demo",
  "participante@aurora.demo",
]);

export async function switchDemoUser(formData: FormData) {
  const ctx = await requireSession();
  if (!ctx.isDemo) throw new Error("Solo disponible en el ambiente demo.");

  const email = String(formData.get("email") ?? "");
  if (!DEMO_ACCOUNTS.has(email)) throw new Error("Cuenta demo desconocida.");

  const supabase = await createUserClient();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password: "ElevaDemo2026!",
  });
  if (error) throw new Error("No se pudo cambiar de vista. Intenta de nuevo.");

  const next = await getSessionContext();
  redirect(next ? teamHome(next) : "/mi");
}
