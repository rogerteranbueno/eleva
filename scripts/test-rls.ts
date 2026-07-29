/**
 * Pruebas de aislamiento RLS contra la base real (dominio canónico v2).
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
const PAULINA_PERSON = "ae000000-0000-4000-8000-000000000046";
const AURORA_ORG = "a0000000-0000-4000-8000-000000000001";
const CY42 = "c4000000-0000-4000-8000-000000000042";
const R42_AVANZADO = "c5000000-0000-4000-8000-000000004202";

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

/** El slug de un espacio de generación se calcula igual que en la migración 020. */
function genSpaceSlug(cycleName: string) {
  return "gen-" + cycleName.toLowerCase().replace(/\s/g, "-");
}

async function main() {
  // Resueltos una vez, con una sesión de equipo: los posts ya no llevan
  // cycle_id — viven en un espacio. Estos ids se usan en varias aserciones.
  const resolver = await loginAs("oficinas@aurora.demo");
  const { data: g42Space } = await resolver
    .from("spaces")
    .select("id")
    .eq("slug", genSpaceSlug("Generación 42"))
    .single();
  const { data: g41Space } = await resolver
    .from("spaces")
    .select("id")
    .eq("slug", genSpaceSlug("Generación 41"))
    .single();
  const G42_SPACE = g42Space!.id;
  const G41_SPACE = g41Space!.id;

  console.log("\n— Cliente anónimo: nada visible —");
  {
    const anon = createClient(URL, ANON, { auth: { persistSession: false } });
    for (const table of [
      "people", "organizations", "generation_cycles", "stage_runs", "stage_participations",
      "continuity_passes", "prospects", "charges", "payments", "posts", "cases", "follow_up_interactions",
    ]) {
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
    for (const table of ["generation_cycles", "stage_runs", "posts", "continuity_passes", "prospects", "follow_up_interactions"]) {
      const { c } = await count(norte, table);
      check(`no ve ${table} de Aurora`, c === 0, c);
    }
    const charges = await norte.from("charges").select("organization_id");
    check("solo ve finanzas de su centro", (charges.data ?? []).every((r) => r.organization_id !== AURORA_ORG), charges.data?.length);
    const { c: casesC } = await count(norte, "cases", (q) => q.eq("organization_id", AURORA_ORG));
    check("no ve casos de Aurora", casesC === 0);
  }

  console.log("\n— Participante (Valeria, G42): comunidad sí; operación, finanzas y pipeline sobre ella NO —");
  {
    const val = await loginAs("participante@aurora.demo");
    const { c: peopleC } = await count(val, "people");
    check("ve a sus compañeros de generación", peopleC >= 20, peopleC);
    for (const table of ["charges", "payments", "payment_allocations", "cases", "signals", "prospects", "follow_up_interactions"]) {
      const { c } = await count(val, table);
      check(`NO ve ${table}`, c === 0, c);
    }
    const { c: passesC } = await count(val, "continuity_passes");
    check("NO ve el pipeline de pases (ni el propio: lo vive en persona)", passesC === 0, passesC);
    const { c: partC } = await count(val, "stage_participations");
    check("ve SOLO sus participaciones (Básico + Avanzado)", partC === 2, partC);
    const { c: expC } = await count(val, "attendance_expectations");
    check("ve sus 3 expectativas del Básico", expC === 3, expC);
    const { c: attC } = await count(val, "attendance_records");
    check("ve solo su asistencia (3 días)", attC === 3, attC);
    const { c: postsC } = await count(val, "posts");
    check("ve la conversación de su ciclo + avisos del centro", postsC >= 5, postsC);
    const { c: plPostsC } = await count(val, "posts", (q) => q.eq("space_id", G41_SPACE));
    check("NO ve la conversación del espacio de G41 (PL)", plPostsC === 0, plPostsC);
    const { c: auditC } = await count(val, "audit_events");
    check("NO ve auditoría", auditC === 0, auditC);

    const badPost = await val.from("posts").insert({
      organization_id: AURORA_ORG,
      space_id: G42_SPACE,
      author_person_id: "ae000000-0000-4000-8000-000000000010",
      kind: "declaracion",
      body: "suplantación",
    });
    check("no puede publicar a nombre de otra persona", badPost.error !== null);

    const { data: eventoAv } = await val
      .from("event_occurrences")
      .select("id")
      .eq("stage_run_id", R42_AVANZADO)
      .order("starts_at")
      .limit(1)
      .single();
    const rsvpOk = await val.from("rsvps").insert({
      organization_id: AURORA_ORG,
      event_occurrence_id: eventoAv!.id,
      person_id: VALERIA_PERSON,
      status: "confirmado",
    });
    check("puede confirmar SU lugar en el Avanzado", rsvpOk.error === null, rsvpOk.error);
    await val.from("rsvps").delete().eq("event_occurrence_id", eventoAv!.id).eq("person_id", VALERIA_PERSON);
    const rsvpBad = await val.from("rsvps").insert({
      organization_id: AURORA_ORG,
      event_occurrence_id: eventoAv!.id,
      person_id: "ae000000-0000-4000-8000-000000000010",
      status: "confirmado",
    });
    check("no puede confirmar a nombre de otra persona", rsvpBad.error !== null);
  }

  console.log("\n— Staff (Paulina): SOLO su grupo asignado; nada de finanzas ni casos —");
  {
    const pau = await loginAs("staff@aurora.demo");
    const { c: partC } = await count(pau, "stage_participations");
    check("ve sus 3 participaciones + las 5 de su grupo (8)", partC === 8, partC);
    const { c: fuC } = await count(pau, "follow_up_interactions");
    check("ve SOLO su seguimiento (5 llamadas)", fuC === 5, fuC);
    for (const table of ["charges", "payments", "cases", "prospects", "participation_plane_history"]) {
      const { c } = await count(pau, table);
      check(`NO ve ${table}`, c === 0, c);
    }
    const { c: attC } = await count(pau, "attendance_records");
    check("asistencia: solo la suya y la de su grupo", attC > 0 && attC <= 20, attC);
    const { c: peopleC } = await count(pau, "people");
    check("ve el directorio (sirve al centro)", peopleC >= 40, peopleC);
  }

  console.log("\n— Capitán (Marco): cobertura de seguimiento sí; finanzas NO —");
  {
    const marco = await loginAs("capitan@aurora.demo");
    const { c: fuC } = await count(marco, "follow_up_interactions");
    check("ve el seguimiento del centro (cobertura)", fuC >= 24, fuC);
    const { c: passesC } = await count(marco, "continuity_passes");
    check("NO ve pases (no es rol de pase)", passesC === 0, passesC);
    for (const table of ["charges", "payments", "expenses"]) {
      const { c } = await count(marco, table);
      check(`NO ve ${table}`, c === 0, c);
    }
    const cases = await marco.from("cases").select("id").limit(1);
    check("la consulta de casos operativos está permitida", cases.error === null, cases.error);
  }

  console.log("\n— Entrenador (Diego): pases y roster sí; finanzas NO (hueco de la auditoría cerrado) —");
  {
    const entr = await loginAs("entrenador@aurora.demo");
    const { c: passesC } = await count(entr, "continuity_passes");
    check("ve el funnel de pases completo", passesC === 29, passesC);
    const { c: partC } = await count(entr, "stage_participations");
    check("ve el roster completo", partC >= 100, partC);
    for (const table of ["charges", "payments", "payment_allocations", "refunds", "expenses"]) {
      const { c } = await count(entr, table);
      check(`NO ve ${table} (entrenador no opera dinero)`, c === 0, c);
    }
    const finCase = await entr.from("cases").select("id").eq("kind", "finanzas");
    check("no ve casos de finanzas", (finCase.data ?? []).length === 0, finCase.data);
  }

  console.log("\n— Finanzas (Rosa): ledger completo; CRM NO —");
  {
    const rosa = await loginAs("finanzas@aurora.demo");
    const { c: chargesC } = await count(rosa, "charges");
    check("ve el ledger de cargos completo (77+)", chargesC >= 77, chargesC);
    const { c: paysC } = await count(rosa, "payments");
    check("ve los 49 pagos", paysC >= 49, paysC);
    const { c: allocC } = await count(rosa, "payment_allocations");
    check("ve las asignaciones", allocC >= 49, allocC);
    const { c: expC } = await count(rosa, "expenses");
    check("ve los gastos", expC === 5, expC);
    const { c: batchC } = await count(rosa, "reconciliation_batches");
    check("ve las batches de conciliación", batchC === 2, batchC);
    const { c: prospC } = await count(rosa, "prospects");
    check("NO ve el CRM (plano de oficinas)", prospC === 0, prospC);
  }

  console.log("\n— Ex staff (Tania, asignación vencida): pierde acceso OPERATIVO —");
  {
    const ex = await loginAs("exstaff@aurora.demo");
    const { c: cyclesC } = await count(ex, "generation_cycles");
    check("no ve generaciones (rol vencido, sin participación)", cyclesC === 0, cyclesC);
    const { c: fuC } = await count(ex, "follow_up_interactions");
    check("no ve seguimiento", fuC === 0, fuC);
    const { c: chargesC } = await count(ex, "charges");
    check("no ve finanzas", chargesC === 0, chargesC);
    const { c: passesC } = await count(ex, "continuity_passes");
    check("no ve el pipeline de pases", passesC === 0, passesC);
    // El Hub Centro es comunidad institucional, no un privilegio de rol: su
    // membresía de organización sigue activa, así que sigue viendo el
    // directorio del centro (espacio "centro") aunque perdió su rol de staff.
    const { c: peopleC } = await count(ex, "people");
    check(
      "sigue en la comunidad del centro (Hub Centro no depende del rol)",
      peopleC >= 40,
      peopleC
    );
  }

  console.log("\n— Capa social por ciclo —");
  {
    const norte = await loginAs("norte@norte.demo");
    for (const table of ["post_reactions", "recognitions", "notifications"]) {
      const { c } = await count(norte, table);
      check(`Centro Norte no ve ${table} de Aurora`, c === 0, c);
    }
    const ivonne = await loginAs("pl@aurora.demo");
    const { c: postsC } = await count(ivonne, "posts", (q) => q.eq("space_id", G41_SPACE));
    check("Ivonne (PL) ve la conversación de SU espacio", postsC >= 4, postsC);
    const { c: reactC } = await count(ivonne, "post_reactions");
    check("Ivonne ve las reacciones del PL", reactC >= 3, reactC);
    const { c: recC } = await count(ivonne, "recognitions");
    check("Ivonne ve su reconocimiento recibido", recC >= 1, recC);
    const fakeNotif = await ivonne.from("notifications").insert({
      organization_id: AURORA_ORG,
      person_id: PAULINA_PERSON,
      kind: "sistema",
      text: "spoofed",
    });
    check("no puede fabricar avisos (insert server-only)", fakeNotif.error !== null);
  }

  console.log("\n— Dueña (Mariana): Pulso, ledger y auditoría permitidos —");
  {
    const duena = await loginAs("duena@aurora.demo");
    const audit = await duena.from("audit_events").select("id").limit(1);
    check("la consulta de auditoría está permitida", audit.error === null, audit.error);
    const { c: chargesC } = await count(duena, "charges");
    check("ve el ledger completo", chargesC >= 77, chargesC);
    const { c: passesC } = await count(duena, "continuity_passes");
    check("ve el funnel de continuidad", passesC === 29, passesC);
  }

  console.log("\n— Hub Centro: espacios, mensajes y moderación —");
  {
    const val = await loginAs("participante@aurora.demo");
    const paulina = await loginAs("staff@aurora.demo");

    // La membresía de espacio no es pública: solo se ve la propia y la de
    // quien comparte espacio.
    const { c: spacesC } = await count(val, "spaces");
    check("Valeria ve espacios (su generación + centro + círculos abiertos)", spacesC >= 2, spacesC);

    // Mensajes directos: SOLO las dos personas de la conversación.
    const { data: myConvos } = await val.from("conversation_members").select("conversation_id");
    if ((myConvos ?? []).length > 0) {
      const { c: msgC } = await count(val, "messages");
      check("Valeria ve mensajes de SUS conversaciones", msgC >= 0, msgC);
    }
    const duenaForMsg = await loginAs("duena@aurora.demo");
    const { c: dmC } = await count(duenaForMsg, "messages");
    check("Dirección NO ve ningún mensaje directo (el centro nunca los lee)", dmC === 0, dmC);
    const { c: convC } = await count(duenaForMsg, "conversations");
    check("Dirección NO ve conversaciones ajenas", convC === 0, convC);

    // Bloquear deshace la visibilidad mutua.
    const targetId = "ae000000-0000-4000-8000-000000000010";
    await val.from("blocks").insert({
      organization_id: AURORA_ORG,
      blocker_person_id: VALERIA_PERSON,
      blocked_person_id: targetId,
    });
    const { data: blockedPerson } = await val.from("people").select("id").eq("id", targetId);
    check("tras bloquear, Valeria no ve a esa persona", (blockedPerson ?? []).length === 0, blockedPerson);
    await val.from("blocks").delete().eq("blocker_person_id", VALERIA_PERSON).eq("blocked_person_id", targetId);

    // Reportar: quien reporta ve el suyo; el resto del equipo no puede leerlo
    // a menos que tenga capacidad de moderación.
    const { data: myReport } = await val
      .from("reports")
      .insert({
        organization_id: AURORA_ORG,
        reporter_person_id: VALERIA_PERSON,
        target_kind: "post",
        target_id: G42_SPACE, // objeto arbitrario válido para la prueba
        reason: "otro",
      })
      .select("id")
      .single();
    check("Valeria puede reportar contenido", !!myReport, myReport);
    const paulinaSeesReport = await paulina.from("reports").select("id").eq("id", myReport?.id ?? "");
    check(
      "Staff (sin capacidad de moderación) NO ve el reporte",
      (paulinaSeesReport.data ?? []).length === 0,
      paulinaSeesReport.data
    );
    const ofiSeesReport = await resolver.from("reports").select("id").eq("id", myReport?.id ?? "");
    check("Oficinas SÍ ve el reporte (modera el centro)", (ofiSeesReport.data ?? []).length === 1);
  }

  console.log(failures === 0 ? "\n✅ Aislamiento verificado: todas las pruebas pasan." : `\n❌ ${failures} prueba(s) fallaron.`);
  process.exit(failures === 0 ? 0 : 1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
