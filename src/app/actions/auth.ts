"use server";

import { redirect } from "next/navigation";
import { createUserClient } from "@/lib/supabase/server";
import { getSessionContext } from "@/lib/context";

export type AuthState = { error?: string };

export async function signIn(
  _prev: AuthState,
  formData: FormData
): Promise<AuthState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  if (!email || !password) {
    return { error: "Escribe tu email y tu contraseña." };
  }

  const supabase = await createUserClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    return {
      error:
        error.message === "Invalid login credentials"
          ? "Email o contraseña incorrectos. Revisa e intenta de nuevo."
          : "No pudimos iniciar sesión. Intenta otra vez en unos segundos.",
    };
  }

  const ctx = await getSessionContext();
  redirect(ctx?.isTeam ? "/hoy" : "/mi");
}

export async function signOut() {
  const supabase = await createUserClient();
  await supabase.auth.signOut();
  redirect("/login");
}
