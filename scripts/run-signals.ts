/** Corre el motor de señales para un centro (por slug). Uso: npm run signals [-- slug] */
import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";
import { runSignalEngine } from "../src/modules/operations/signals";
import type { Database } from "../src/lib/database.types";

for (const line of readFileSync(".env.local", "utf8").split("\n")) {
  const m = line.match(/^([A-Z_]+)=(.*)$/);
  if (m) process.env[m[1]] ??= m[2];
}

const slug = process.argv[2] ?? "aurora";

async function main() {
  const service = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );
  const { data: org } = await service
    .from("organizations")
    .select("id, name")
    .eq("slug", slug)
    .single();
  if (!org) throw new Error(`No existe la organización «${slug}»`);

  const result = await runSignalEngine(service, org.id);
  console.log(
    `Señales de ${org.name}: ${result.created} creadas, ${result.skipped} ya existían.`
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
