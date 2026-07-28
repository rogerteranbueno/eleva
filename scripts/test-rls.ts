/**
 * Pruebas de aislamiento RLS contra la base real (tenant demo sintético).
 * Regla del blueprint: la privacidad entre centros se prueba, nunca se infiere.
 * Corre con: npm run test:rls
 */
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";

for (const line of readFileSync(".env.local", "utf8").split("\n")) {
  const m = line.match(/^([A-Z_]+)=(.*)$/);
  if (m) process.env[m[1]] ??= m[2];
}

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const PASSWORD = "ElevaDemo2026!";

const VALERIA_PERSON = "ae000000-0000-4000-8000-000000000004";
const AURORA_ORG = "a0000000-0000-4000-8000-000000000001";
const G42 = "cc000000-0000-4000-8000-000000000042";

let failures = 0;
function check(label: string, ok: boolean, detail?: unknown) {
  if (ok) {
    console.log(`  ✓ ${label}`);
  } else {
    failures++;
    console.error(`  ✗ ${label}`, detail ?? "");
  }
}

async function loginAs(email: string): Promise<SupabaseClient> {
  const client = createClient(URL, ANON, { auth: { persistSession: false } });
  const { error } = await client.auth.signInWithPassword({ email, password: PASSWORD });
  if (error) throw new Error(`login ${email}: ${error.message}`);
  return client;
}

async function count(client: SupabaseClient, table: string, filter?: (q: any) => any) {
  let q = client.from(table).select("id", { count: "exact", head: true });
  if (filter) q = filter(q);
  const { count: c, error } = await q;
  if (error) return { c: -1, error };
  return { c: c ?? 0 };
}

async function main() {
  console.log("\n— Cliente anónimo: nada visible —");
  {
    const anon = createClient(URL, ANON, { auth: { persistSession: false } });
    for (const table of ["people", "organizations", "cohorts", "charges", "posts", "cases"]) {
      const { c } = await count(anon, table);
      check(`anónimo no ve ${table}`, c === 0);
    }
  }

  console.log("\n— Centro Norte (Pablo, oficinas de OTRO centro): cero acceso a Aurora —");
  {
    const norte = await loginAs("norte@norte.demo");
    const orgs = await norte.from("organizations").select("slug");
    check("solo ve su organización", orgs.data?.length === 1 && orgs.data[0].slug === "norte", orgs.data);
    const valeria = await norte.from("people").select("id").eq("id", VALERIA_PERSON);
    check("no ve a personas de Aurora", (valeria.data ?? []).length === 0, valeria.data);
    const cohorts = await norte.from("cohorts").select("id, name");
    check("no ve generaciones de Aurora", (cohorts.data ?? []).every((r) => r.name === "Norte G1"), cohorts.data);
    const { c: postsC } = await count(norte, "posts");
    check("no ve conversación de Aurora", postsC === 0);
    const charges = await norte.from("charges").select("organization_id");
    check("solo ve finanzas de su centro", (charges.data ?? []).every((r) => r.organization_id !== AURORA_ORG), charges.data?.length);
    const { c: casesC } = await count(norte, "cases", (q) => q.eq("organization_id", AURORA_ORG));
    check("no ve casos de Aurora", casesC === 0);
  }

  console.log("\n— Participante (Valeria): comunidad sí, operación y finanzas no —");
  {
    const val = await loginAs("participante@aurora.demo");
    const { c: peopleC } = await count(val, "people");
    check("ve a sus compañeros de generación", peopleC >= 20, peopleC);
    const { c: chargesC } = await count(val, "charges");
    check("NO ve finanzas (ni las propias en v0)", chargesC === 0, chargesC);
    const { c: casesC } = await count(val, "cases");
    check("NO ve casos de seguimiento", casesC === 0, casesC);
    const { c: signalsC } = await count(val, "signals");
    check("NO ve señales", signalsC === 0, signalsC);
    const { c: partC } = await count(val, "participations");
    check("ve SOLO su participación", partC === 1, partC);
    const { c: postsC } = await count(val, "posts");
    check("ve la conversación de su generación", postsC >= 4, postsC);
    const { c: attC } = await count(val, "attendance_records");
    check("ve solo su asistencia (6 sesiones)", attC === 6, attC);
    const { c: auditC } = await count(val, "audit_events");
    check("NO ve auditoría", auditC === 0, auditC);
    const badPost = await val.from("posts").insert({
      organization_id: AURORA_ORG,
      cohort_id: G42,
      author_person_id: "ae000000-0000-4000-8000-000000000010", // Luis, no ella
      kind: "declaracion",
      body: "suplantación",
    });
    check("no puede publicar a nombre de otra persona", badPost.error !== null);
  }

  console.log("\n— Ex staff (Tania, asignación vencida hace 30 días): pierde acceso de equipo —");
  {
    const ex = await loginAs("exstaff@aurora.demo");
    const { c: cohortsC } = await count(ex, "cohorts");
    check("no ve generaciones (rol vencido, sin participación)", cohortsC === 0, cohortsC);
    const { c: peopleC } = await count(ex, "people");
    check("solo se ve a sí misma", peopleC === 1, peopleC);
    const { c: casesC } = await count(ex, "cases");
    check("no ve casos", casesC === 0, casesC);
    const { c: chargesC } = await count(ex, "charges");
    check("no ve finanzas", chargesC === 0, chargesC);
  }

  console.log("\n— Oficinas (Carla): operación completa de SU centro, nada del otro —");
  {
    const ofi = await loginAs("oficinas@aurora.demo");
    const { c: peopleC } = await count(ofi, "people");
    check("ve a todas las personas de Aurora", peopleC >= 40, peopleC);
    const { c: partC } = await count(ofi, "participations");
    check("ve las 35 participaciones", partC === 35, partC);
    const { c: chargesC } = await count(ofi, "charges");
    check("ve finanzas de Aurora (20 cargos)", chargesC === 20, chargesC);
    const norteCohorts = await ofi.from("cohorts").select("name").eq("name", "Norte G1");
    check("no ve generaciones del Centro Norte", (norteCohorts.data ?? []).length === 0, norteCohorts.data);
    const { c: attC } = await count(ofi, "attendance_records");
    check("ve la asistencia completa (120 registros)", attC === 120, attC);
  }

  console.log("\n— Dueña (Mariana): Pulso y auditoría permitidos —");
  {
    const duena = await loginAs("duena@aurora.demo");
    const audit = await duena.from("audit_events").select("id").limit(1);
    check("la consulta de auditoría está permitida", audit.error === null, audit.error);
    const { c: chargesC } = await count(duena, "charges");
    check("ve finanzas", chargesC === 20, chargesC);
  }

  console.log(failures === 0 ? "\n✅ Aislamiento verificado: todas las pruebas pasan." : `\n❌ ${failures} prueba(s) fallaron.`);
  process.exit(failures === 0 ? 0 : 1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
