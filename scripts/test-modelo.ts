/**
 * Criterio de aceptación del modelo canónico (blueprint doc 18):
 * el dominio debe representar sin contradicciones a Paulina Reyes —
 * graduada del PL G40 que regresa como staff del Básico G42 con 5 asignados,
 * seguimiento registrado, 2 enrolamientos, pago parcial de una certificación
 * en USD y presencia en el Hub — sin duplicar su perfil ni cambiar un "nivel".
 * También verifica los planos de estado separados y la honestidad de asistencia.
 * Corre con: npm run test:modelo
 */
import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";

for (const line of readFileSync(".env.local", "utf8").split("\n")) {
  const m = line.match(/^([A-Z_]+)=(.*)$/);
  if (m) process.env[m[1]] ??= m[2];
}

const s = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const PAULINA = "ae000000-0000-4000-8000-000000000046";
const RETIRADO = "ae000000-0000-4000-8000-000000000022";
const R40_PL = "c5000000-0000-4000-8000-000000004003";
const R42_BASICO = "c5000000-0000-4000-8000-000000004201";

let failures = 0;
function check(label: string, ok: boolean, detail?: unknown) {
  if (ok) console.log(`  ✓ ${label}`);
  else {
    failures++;
    console.error(`  ✗ ${label}`, detail ?? "");
  }
}

async function main() {
  console.log("\n— Caso Paulina: una persona, una historia, cero contradicciones —");

  const { data: personas } = await s.from("people").select("id").eq("full_name", "Paulina Reyes");
  check("existe UN solo perfil de Paulina (sin duplicar)", personas?.length === 1, personas?.length);

  const { data: parts } = await s
    .from("stage_participations")
    .select("stage_run_id, delivery_status, registration_status")
    .eq("person_id", PAULINA);
  check("tiene exactamente 3 participaciones (su ciclo G40)", parts?.length === 3, parts);
  const pl = parts?.find((p) => p.stage_run_id === R40_PL);
  check("su PL G40 sigue 'completo' (graduada; nada lo sobrescribió)", pl?.delivery_status === "completo", pl);
  check(
    "NO tiene participación en el Básico G42 (lo sirve, no lo cursa)",
    !parts?.some((p) => p.stage_run_id === R42_BASICO)
  );

  const { data: ta } = await s
    .from("team_assignments")
    .select("stage_run_id, role, ends_at, reports_to_person_id")
    .eq("person_id", PAULINA);
  const staffB = ta?.find((t) => t.stage_run_id === R42_BASICO);
  check("sirve el Básico G42 como asignación de staff (no un 'nivel')", staffB?.role === "staff", ta);
  check("la asignación tiene vigencia (termina)", !!staffB?.ends_at);
  check("reporta a un capitán", !!staffB?.reports_to_person_id);

  const { data: grupo } = await s
    .from("small_groups")
    .select("id, small_group_members(id)")
    .eq("staff_person_id", PAULINA)
    .eq("stage_run_id", R42_BASICO)
    .single();
  check("su grupo tiene 5 participantes asignados", grupo?.small_group_members?.length === 5, grupo?.small_group_members?.length);

  const { data: fu } = await s
    .from("follow_up_interactions")
    .select("done_at, resultado")
    .eq("staff_person_id", PAULINA);
  check("registró seguimiento: 5 esperados", fu?.length === 5, fu?.length);
  check("al menos 3 realizados con resultado", (fu?.filter((f) => f.done_at && f.resultado).length ?? 0) >= 3);

  const { data: attr } = await s
    .from("enrollment_attributions")
    .select("enrolled_person_id, status")
    .eq("enroller_person_id", PAULINA);
  check("enroló a 2 personas (atribución auditable)", attr?.length === 2, attr?.length);

  const { data: cargo } = await s
    .from("charges")
    .select("id, currency, status, amount_cents, payment_allocations(amount_cents, payments(currency))")
    .eq("person_id", PAULINA)
    .eq("concept", "Certificación ELEVA Coach")
    .single();
  check("certificación en USD con estado parcial", cargo?.currency === "USD" && cargo?.status === "parcial", cargo);
  const asignado = (cargo?.payment_allocations ?? []).reduce((a: number, x: any) => a + x.amount_cents, 0);
  check("pago parcial asignado (USD 600 de 1,200)", asignado === 60000, asignado);
  check(
    "las monedas no se mezclan (asignación USD↔USD)",
    (cargo?.payment_allocations ?? []).every((x: any) => x.payments?.currency === "USD")
  );

  const { data: hub } = await s.from("comments").select("id").eq("author_person_id", PAULINA);
  check("está presente en el Hub (comentó a su generación acompañada)", (hub?.length ?? 0) >= 1, hub?.length);

  console.log("\n— Planos de estado separados: la persona retirada del Básico G42 —");
  {
    const { data: sp } = await s
      .from("stage_participations")
      .select("id, registration_status, delivery_status")
      .eq("person_id", RETIRADO)
      .eq("stage_run_id", R42_BASICO)
      .single();
    check("registro: 'confirmado' (sí se registró)", sp?.registration_status === "confirmado", sp);
    check("entrega: 'retirado' (se fue el sábado)", sp?.delivery_status === "retirado", sp);
    const { data: cargoRet } = await s
      .from("charges")
      .select("status, payment_allocations(payment_id)")
      .eq("person_id", RETIRADO)
      .single();
    check("finanzas: pagó (derivado del ledger, no del enum)", cargoRet?.status === "pagado", cargoRet);
    const payId = (cargoRet?.payment_allocations as any[])?.[0]?.payment_id;
    const { data: refund } = await s.from("refunds").select("amount_cents").eq("payment_id", payId).single();
    check("y existe su devolución auditada", refund?.amount_cents === 850000, refund);
  }

  console.log("\n— Asistencia honesta: el faltante es 'sin registro', no desaparece —");
  {
    const { data: domingo } = await s
      .from("event_occurrences")
      .select("id")
      .eq("stage_run_id", R42_BASICO)
      .eq("name", "Domingo")
      .single();
    const { count: expected } = await s
      .from("attendance_expectations")
      .select("id", { count: "exact", head: true })
      .eq("event_occurrence_id", domingo!.id);
    const { count: recorded } = await s
      .from("attendance_records")
      .select("id", { count: "exact", head: true })
      .eq("event_occurrence_id", domingo!.id);
    check("domingo del Básico: 20 esperados", expected === 20, expected);
    check("17 con registro → 3 'sin registro' VISIBLES en el denominador", recorded === 17, recorded);
  }

  console.log("\n— Ledger: una transferencia repartida entre dos cargos —");
  {
    const { data: pago } = await s
      .from("payments")
      .select("amount_cents, payment_allocations(amount_cents)")
      .eq("reference", "PL12-RAMON")
      .single();
    check("el pago de Ramón existe ($14,000)", pago?.amount_cents === 1400000, pago?.amount_cents);
    check(
      "repartido en 2 asignaciones de $7,000",
      pago?.payment_allocations?.length === 2 &&
        pago.payment_allocations.every((a: any) => a.amount_cents === 700000),
      pago?.payment_allocations
    );
  }

  console.log("\n— Pase medible: el funnel G42 Básico→Avanzado suma —");
  {
    const { data: passes } = await s
      .from("continuity_passes")
      .select("pass_status, next_status, stage_participations!continuity_passes_from_participation_id_fkey!inner(stage_run_id)")
      .eq("stage_participations.stage_run_id", R42_BASICO);
    const by = (f: (p: any) => boolean) => passes?.filter(f).length ?? 0;
    const inscritos = by((p) => ["inscrito", "iniciado"].includes(p.next_status));
    const cola = by((p) => p.pass_status === "aceptado" && p.next_status === "sin_intencion");
    check("17 pases evaluables (uno por participación completa)", passes?.length === 17, passes?.length);
    check("al menos 8 inscritos al Avanzado", inscritos >= 8, inscritos);
    // invariante del funnel: los 10 aceptados están inscritos o en la cola
    check("aceptados = inscritos + cola (el funnel suma)", inscritos + cola === 10, { inscritos, cola });
    check("elegibles sin conversar visibles como trabajo pendiente", by((p) => p.pass_status === "elegible") <= 3);
  }

  console.log(failures === 0 ? "\n✅ El modelo canónico representa la realidad sin contradicciones." : `\n❌ ${failures} contradiccion(es).`);
  process.exit(failures === 0 ? 0 : 1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
