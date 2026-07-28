import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import type { Database } from "@/lib/database.types";

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

/** Cliente con el contexto del usuario (cookies de sesión). RLS aplica. */
export async function createUserClient() {
  const cookieStore = await cookies();
  return createServerClient<Database>(URL, ANON, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // Server Component sin capacidad de escribir cookies: el proxy refresca la sesión.
        }
      },
    },
  });
}

/**
 * Cliente de servicio: SOLO para comandos de servidor que ya pasaron por
 * authorize(). Nunca se importa desde un componente de cliente.
 */
export function createServiceClient() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) throw new Error("SUPABASE_SERVICE_ROLE_KEY no está configurada");
  return createClient<Database>(URL, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
