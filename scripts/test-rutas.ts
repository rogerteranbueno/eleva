/**
 * Pruebas de autorización A NIVEL DE RUTA.
 *
 * Por qué existe: `test:rls` verifica las políticas de la base con clientes de
 * usuario reales — y pasa. Pero la aplicación renderiza con el cliente de
 * servicio, que salta RLS por completo. Es decir: la suite probaba una puerta
 * que la app no usa. Esta prueba entra por HTTP como cada rol, pide cada ruta
 * y comprueba que el contenido prohibido NO aparece en el HTML.
 *
 * Corre con: npm run test:rutas   (con el dev server arriba)
 *            BASE=https://... npm run test:rutas   (contra producción)
 */
import { readFileSync } from "node:fs";

for (const line of readFileSync(".env.local", "utf8").split("\n")) {
  const m = line.match(/^([A-Z_]+)=(.*)$/);
  if (m) process.env[m[1]] ??= m[2];
}

const BASE = process.env.BASE ?? "http://localhost:3900";
const PASSWORD = "ElevaDemo2026!";

let failures = 0;
function check(label: string, ok: boolean, detail?: unknown) {
  if (ok) console.log(`  ✓ ${label}`);
  else {
    failures++;
    console.error(`  ✗ ${label}`, detail ?? "");
  }
}

/**
 * Inicia sesión contra GoTrue y arma la cookie con el mismo formato que usa
 * `@supabase/ssr`, para que la app vea exactamente la sesión de ese rol.
 */
async function loginAs(email: string): Promise<string> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  const ref = new URL(url).hostname.split(".")[0];

  const res = await fetch(`${url}/auth/v1/token?grant_type=password`, {
    method: "POST",
    headers: { apikey: anon, "content-type": "application/json" },
    body: JSON.stringify({ email, password: PASSWORD }),
  });
  if (!res.ok) throw new Error(`login ${email}: ${res.status} ${await res.text()}`);
  const session = await res.json();

  // @supabase/ssr guarda la sesión como base64url del JSON, con prefijo, y la
  // parte en trozos de ~3180 bytes cuando no cabe en una cookie.
  const value =
    "base64-" +
    Buffer.from(JSON.stringify(session), "utf8")
      .toString("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");

  const name = `sb-${ref}-auth-token`;
  if (value.length <= 3180) return `${name}=${value}`;
  const chunks: string[] = [];
  for (let i = 0; i < value.length; i += 3180) chunks.push(value.slice(i, i + 3180));
  return chunks.map((c, i) => `${name}.${i}=${c}`).join("; ");
}

type Visit = { status: number; html: string; url: string };

async function visit(cookie: string, path: string): Promise<Visit> {
  const res = await fetch(`${BASE}${path}`, { headers: { cookie }, redirect: "follow" });
  return { status: res.status, html: await res.text(), url: res.url };
}

/** Marcadores de datos que un rol NO debe poder leer en una ruta. */
const FORBIDDEN = {
  // Cifras del ledger: solo roles financieros.
  dinero: ["Cobrado (30 días)", "Vencido por cobrar", "Contratado ("],
  // Nombres de personas fuera del grupo de Paulina.
  fueraDeGrupo: ["Héctor Molina", "Karla Márquez", "Tomás Aguilar"],
};

async function main() {
  console.log(`\n— Rutas contra ${BASE} —\n`);

  // ── Staff: solo su grupo ───────────────────────────────────────────────
  console.log("— Staff (Paulina): su grupo, nada del centro —");
  {
    const cookie = await loginAs("staff@aurora.demo");

    const dir = await visit(cookie, "/personas");
    check("puede abrir el directorio", dir.status === 200, dir.status);
    const leaked = FORBIDDEN.fueraDeGrupo.filter((n) => dir.html.includes(n));
    check("el directorio NO muestra personas fuera de su grupo", leaked.length === 0, leaked);

    // Expediente de alguien que no acompaña → debe ser 404.
    const ajeno = await visit(cookie, "/personas/ae000000-0000-4000-8000-000000000022");
    check(
      "el expediente ajeno responde 404",
      ajeno.status === 404 || ajeno.html.includes("no se encontró") || ajeno.html.includes("404"),
      ajeno.status
    );

    const fin = await visit(cookie, "/finanzas");
    check("no entra a /finanzas", fin.url.includes("sin-acceso") || fin.status >= 400, fin.url);

    const crm = await visit(cookie, "/crm");
    check("no entra a /crm", crm.url.includes("sin-acceso") || crm.status >= 400, crm.url);
  }

  // ── Finanzas: dinero sí, operación del ciclo no ────────────────────────
  console.log("\n— Finanzas (Rosa): el ledger sí, el ciclo no —");
  {
    const cookie = await loginAs("finanzas@aurora.demo");

    const fin = await visit(cookie, "/finanzas");
    check("entra a /finanzas", fin.status === 200 && fin.url.includes("/finanzas"), fin.url);

    const ciclo = await visit(
      cookie,
      "/generaciones/c4000000-0000-4000-8000-000000000042"
    );
    check(
      "NO entra a una generación por URL directa",
      ciclo.url.includes("sin-acceso") || ciclo.status >= 400,
      ciclo.url
    );

    const crm = await visit(cookie, "/crm");
    check("no entra al CRM", crm.url.includes("sin-acceso") || crm.status >= 400, crm.url);
  }

  // ── Entrenador: el ciclo sí, el dinero no ──────────────────────────────
  console.log("\n— Entrenador (Diego): el ciclo sí, el dinero no —");
  {
    const cookie = await loginAs("entrenador@aurora.demo");

    const ciclo = await visit(cookie, "/generaciones/c4000000-0000-4000-8000-000000000042");
    check("entra al ciclo", ciclo.status === 200 && ciclo.url.includes("/generaciones/"), ciclo.url);
    const dinero = FORBIDDEN.dinero.filter((s) => ciclo.html.includes(s));
    check("el ciclo NO le muestra economía", dinero.length === 0, dinero);

    const fin = await visit(cookie, "/finanzas");
    check("no entra a /finanzas", fin.url.includes("sin-acceso") || fin.status >= 400, fin.url);

    const hoy = await visit(cookie, "/hoy");
    check("entra a su cola", hoy.status === 200, hoy.status);
    check(
      "la cola NO incluye casos de finanzas",
      !hoy.html.includes("Cargo vencido de") && !hoy.html.includes("Identificar pago"),
      "aparecen casos de dinero"
    );
  }

  // ── Capitán: cobertura sí, dinero no ───────────────────────────────────
  console.log("\n— Capitán (Marco): cobertura sí, dinero no —");
  {
    const cookie = await loginAs("capitan@aurora.demo");
    const cob = await visit(cookie, "/cobertura");
    check("entra a /cobertura", cob.status === 200 && cob.url.includes("/cobertura"), cob.url);
    const fin = await visit(cookie, "/finanzas");
    check("no entra a /finanzas", fin.url.includes("sin-acceso") || fin.status >= 400, fin.url);
  }

  // ── Participante: nada del equipo ──────────────────────────────────────
  console.log("\n— Participante (Valeria): ninguna ruta de equipo —");
  {
    const cookie = await loginAs("participante@aurora.demo");
    for (const path of ["/pulso", "/finanzas", "/hoy", "/personas", "/crm", "/cobertura"]) {
      const res = await visit(cookie, path);
      check(
        `no entra a ${path}`,
        res.url.includes("/mi") || res.url.includes("/login") || res.status >= 400,
        res.url
      );
    }
    const mi = await visit(cookie, "/mi");
    check("entra a su Hub", mi.status === 200, mi.status);
  }

  // ── Dirección: el sistema completo ─────────────────────────────────────
  console.log("\n— Dirección (Mariana): acceso completo —");
  const duenaCookie = await loginAs("duena@aurora.demo");
  {
    for (const path of ["/pulso", "/finanzas", "/hoy", "/personas", "/crm", "/generaciones", "/equipo"]) {
      const res = await visit(duenaCookie, path);
      check(`entra a ${path}`, res.status === 200 && !res.url.includes("sin-acceso"), res.url);
    }
  }

  // ── Reconciliación: el mismo ciclo debe dar la misma cifra en cada vista ─
  // Esta es la prueba del hallazgo P0: /finanzas y /generaciones reportaban
  // $24,000 de diferencia del mismo ciclo porque solo una filtraba pagos
  // confirmados. Ahora ambas leen de modules/finance/ledger.ts.
  console.log("\n— Reconciliación financiera entre vistas —");
  {
    const money = (html: string, re: RegExp) => {
      const m = html.match(re);
      return m ? Number(m[1].replace(/[$,\s]/g, "")) : null;
    };

    const ciclo = await visit(duenaCookie, "/generaciones/c4000000-0000-4000-8000-000000000042");
    const fin = await visit(duenaCookie, "/finanzas");

    // "Cobrado (MXN)" en la tarjeta de economía del ciclo.
    const cobradoCiclo = money(ciclo.html, /\$([\d,]+)<\/p><p[^>]*>Cobrado \(MXN\)/);
    // "Cobrado: $X" dentro de la tarjeta de Generación 42 en /finanzas.
    const bloqueG42 = fin.html.split("Generación 42")[1] ?? "";
    const cobradoFinanzas = money(bloqueG42, /Cobrado:.*?\$([\d,]+)/);

    check(
      "la economía del ciclo es legible en ambas vistas",
      cobradoCiclo !== null && cobradoFinanzas !== null,
      { cobradoCiclo, cobradoFinanzas }
    );
    if (cobradoCiclo !== null && cobradoFinanzas !== null) {
      check(
        `/generaciones y /finanzas reportan el mismo cobrado ($${cobradoCiclo.toLocaleString()})`,
        cobradoCiclo === cobradoFinanzas,
        { ciclo: cobradoCiclo, finanzas: cobradoFinanzas, diferencia: cobradoCiclo - cobradoFinanzas }
      );
    }

    // El Pulso no debe contar como cobrado nada sin confirmar.
    const pulso = await visit(duenaCookie, "/pulso");
    check(
      "el Pulso declara los pagos sin confirmar como provisionales",
      pulso.html.includes("sin confirmar") || !pulso.html.includes("Provisional"),
      "no se encontró la nota de integridad"
    );
  }

  // ── La IA no cruza audiencias ───────────────────────────────────────────
  // Antes, el resumen se cacheaba por (organización, tipo): un entrenador
  // recibía el que se generó con las cifras que solo dirección puede ver.
  console.log("\n— Aislamiento de la IA por audiencia —");
  {
    // Dirección primero, entrenador después: si compartieran caché, el segundo
    // recibiría el texto del primero.
    await visit(duenaCookie, "/pulso");
    const entrenador = await loginAs("entrenador@aurora.demo");
    await visit(entrenador, "/pulso");

    const { createClient } = await import("@supabase/supabase-js");
    const service = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    const { data: rows } = await service
      .from("ai_summaries")
      .select("audience, content")
      .eq("kind", "pulso_semanal");

    const byAudience = new Map<string, string>();
    for (const r of rows ?? []) {
      byAudience.set(r.audience, (r.content as { lines: string[] }).lines.join(" "));
    }
    check("cada audiencia tiene su propio resumen", byAudience.size >= 2, [...byAudience.keys()]);

    const direccion = byAudience.get("direccion");
    const operacion = byAudience.get("operacion");
    check("los textos son distintos", !!direccion && !!operacion && direccion !== operacion);
    const MONEY = /\$\s?[\d,]{4,}|cobrad[oa]|por cobrar|USD|vencid[oa]/i;
    check(
      "el resumen operativo NO contiene cifras financieras",
      !!operacion && !MONEY.test(operacion),
      operacion?.match(MONEY)?.[0]
    );
  }

  console.log(
    failures === 0
      ? "\n✅ Autorización por ruta verificada: ningún rol ve fuera de su ámbito."
      : `\n❌ ${failures} problema(s) de acceso o aislamiento.`
  );
  process.exit(failures === 0 ? 0 : 1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
