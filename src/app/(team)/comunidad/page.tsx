import Link from "next/link";
import { requireCapability } from "@/lib/capabilities";
import { createServiceClient } from "@/lib/supabase/server";
import { Card, SectionTitle, Badge, EmptyState, Avatar, PersonLink } from "@/components/ui";
import { timeAgo, plural, hoursAgo } from "@/lib/format";

export const dynamic = "force-dynamic";

/**
 * Consola de comunidad — lo que el centro realmente compra.
 *
 * Un centro no paga por un feed: paga por poder sostener una comunidad sin
 * depender de WhatsApp y de la memoria de una sola persona. Aquí está la cola
 * del anfitrión y la salud explicable.
 *
 * Lo que NUNCA aparece aquí: mensajes directos. No hay ruta a ellos, ni
 * siquiera para dirección.
 */
export default async function ConsolaComunidadPage() {
  const ctx = await requireCapability("community.moderate.center");
  const service = createServiceClient();
  const now = Date.now();

  const [{ data: spaces }, { data: posts }, { data: reports }, { data: members }] =
    await Promise.all([
      service
        .from("spaces")
        .select("id, kind, name, slug, ritual, host_person_id, people:host_person_id(full_name), space_memberships(person_id)")
        .eq("organization_id", ctx.organizationId)
        .is("archived_at", null),
      service
        .from("posts")
        .select(
          "id, kind, body, created_at, author_person_id, space_id, people:author_person_id(id, full_name), comments(id, created_at), post_reactions(person_id), spaces(name)"
        )
        .eq("organization_id", ctx.organizationId)
        .is("deleted_at", null)
        .order("created_at", { ascending: false }),
      service
        .from("reports")
        .select("id, target_kind, target_id, reason, detail, status, created_at, people:reporter_person_id(full_name)")
        .eq("organization_id", ctx.organizationId)
        .in("status", ["abierto", "en_revision"]),
      service
        .from("organization_memberships")
        .select("person_id")
        .eq("organization_id", ctx.organizationId)
        .eq("status", "active"),
    ]);

  const allPosts = posts ?? [];
  const totalMembers = (members ?? []).length;

  // ── Cola del anfitrión ────────────────────────────────────────────────
  const primeraSinRespuesta: typeof allPosts = [];
  const vistos = new Set<string>();
  for (const p of [...allPosts].reverse()) {
    if (vistos.has(p.author_person_id)) continue;
    vistos.add(p.author_person_id);
    if ((p.comments ?? []).length === 0 && hoursAgo(p.created_at) > 12) {
      primeraSinRespuesta.push(p);
    }
  }
  const preguntasAbiertas = allPosts.filter(
    (p) => ["pregunta", "ayuda"].includes(p.kind) && (p.comments ?? []).length === 0
  );
  const espaciosSinRitual = (spaces ?? []).filter(
    (s) => !s.ritual && ["circulo", "alumni"].includes(s.kind)
  );
  const espaciosSinAnfitrion = (spaces ?? []).filter(
    (s) => !s.host_person_id && s.kind !== "generacion"
  );

  // ── Salud (nunca volumen bruto ni tiempo en pantalla) ─────────────────
  const treintaDias = now - 30 * 24 * 3600_000;
  const recientes = allPosts.filter((p) => new Date(p.created_at).getTime() > treintaDias);

  const contribuyentes = new Map<string, number>();
  for (const p of recientes) {
    contribuyentes.set(p.author_person_id, (contribuyentes.get(p.author_person_id) ?? 0) + 1);
  }
  const activos = new Set<string>([...contribuyentes.keys()]);
  for (const p of recientes) {
    for (const r of p.post_reactions ?? []) activos.add(r.person_id);
  }

  const conRespuesta = recientes.filter((p) => (p.comments ?? []).length > 0);
  const tiemposRespuesta = conRespuesta.map((p) => {
    const first = [...(p.comments ?? [])].sort((a, b) =>
      a.created_at.localeCompare(b.created_at)
    )[0];
    return (new Date(first.created_at).getTime() - new Date(p.created_at).getTime()) / 3600_000;
  });
  const medianaHoras =
    tiemposRespuesta.length > 0
      ? [...tiemposRespuesta].sort((a, b) => a - b)[Math.floor(tiemposRespuesta.length / 2)]
      : null;

  const ordenados = [...contribuyentes.values()].sort((a, b) => b - a);
  const top10 = Math.max(1, Math.ceil(ordenados.length * 0.1));
  const concentracion =
    ordenados.length > 0
      ? Math.round(
          (ordenados.slice(0, top10).reduce((s, n) => s + n, 0) /
            ordenados.reduce((s, n) => s + n, 0)) *
            100
        )
      : 0;

  const salud = [
    {
      label: "Primera respuesta",
      value: recientes.length > 0 ? `${Math.round((conRespuesta.length / recientes.length) * 100)}%` : "—",
      note: `${conRespuesta.length} de ${recientes.length} publicaciones tuvieron respuesta`,
      alert: recientes.length > 0 && conRespuesta.length / recientes.length < 0.8,
    },
    {
      label: "Tiempo a primera respuesta",
      value: medianaHoras !== null ? `${Math.round(medianaHoras)} h` : "—",
      note: "mediana de los últimos 30 días",
      alert: medianaHoras !== null && medianaHoras > 24,
    },
    {
      label: "Activación",
      value: totalMembers > 0 ? `${Math.round((activos.size / totalMembers) * 100)}%` : "—",
      note: `${activos.size} de ${totalMembers} personas participaron`,
      alert: totalMembers > 0 && activos.size / totalMembers < 0.25,
    },
    {
      label: "Concentración",
      value: `${concentracion}%`,
      note: "de las contribuciones viene del 10% más activo",
      alert: concentracion > 60,
    },
  ];

  const colaTotal =
    primeraSinRespuesta.length +
    preguntasAbiertas.length +
    (reports ?? []).length +
    espaciosSinAnfitrion.length;

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-bold tracking-tight">Comunidad</h1>
        <p className="mt-1 text-sm text-muted">
          La salud del Hub de {ctx.organizationName}. Sostener una comunidad es trabajo, y
          este es el trabajo pendiente.
        </p>
      </header>

      <section aria-label="Salud" className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {salud.map((s) => (
          <Card key={s.label} className="!p-4">
            <p className={`text-2xl font-bold ${s.alert ? "text-gold" : ""}`}>{s.value}</p>
            <p className="text-xs font-medium">{s.label}</p>
            <p className="mt-0.5 text-[11px] text-faint">{s.note}</p>
          </Card>
        ))}
      </section>

      <section aria-label="Cola del anfitrión">
        <SectionTitle>
          Requiere a alguien del equipo
          {colaTotal > 0 && (
            <span className="ml-2 normal-case tracking-normal">
              <Badge variant={colaTotal > 5 ? "danger" : "gold"}>{colaTotal}</Badge>
            </span>
          )}
        </SectionTitle>

        {colaTotal === 0 ? (
          <EmptyState title="La comunidad está atendida.">
            Ninguna primera contribución sin respuesta, ninguna pregunta abierta y ningún
            reporte pendiente.
          </EmptyState>
        ) : (
          <div className="space-y-4">
            {primeraSinRespuesta.length > 0 && (
              <Card>
                <p className="text-sm font-semibold">
                  {plural(
                    primeraSinRespuesta.length,
                    "primera contribución sin respuesta",
                    "primeras contribuciones sin respuesta"
                  )}
                </p>
                <p className="mt-0.5 text-xs text-muted">
                  Es la señal más predictiva de que alguien no vuelve.
                </p>
                <ul className="mt-3 space-y-2">
                  {primeraSinRespuesta.slice(0, 5).map((p) => (
                    <li key={p.id} className="flex items-start gap-2.5 text-sm">
                      <Avatar name={p.people?.full_name ?? "?"} size={28} />
                      <div className="min-w-0 flex-1">
                        <PersonLink id={p.people?.id} name={p.people?.full_name ?? "—"} />
                        <span className="text-faint"> · {p.spaces?.name} · {timeAgo(p.created_at)}</span>
                        <p className="line-clamp-1 text-muted">{p.body}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </Card>
            )}

            {preguntasAbiertas.length > 0 && (
              <Card>
                <p className="text-sm font-semibold">
                  {plural(preguntasAbiertas.length, "pregunta sin resolver", "preguntas sin resolver")}
                </p>
                <ul className="mt-3 space-y-1.5 text-sm text-muted">
                  {preguntasAbiertas.slice(0, 5).map((p) => (
                    <li key={p.id} className="line-clamp-1">
                      {p.people?.full_name}: {p.body}
                    </li>
                  ))}
                </ul>
              </Card>
            )}

            {(reports ?? []).length > 0 && (
              <Card className="border-danger/30">
                <p className="text-sm font-semibold text-danger">
                  {plural((reports ?? []).length, "reporte pendiente", "reportes pendientes")}
                </p>
                <ul className="mt-3 space-y-2 text-sm">
                  {(reports ?? []).map((r) => (
                    <li key={r.id}>
                      <span className="font-medium">{r.reason.replaceAll("_", " ")}</span>
                      <span className="text-faint"> · reportó {r.people?.full_name} · {timeAgo(r.created_at)}</span>
                      {r.detail && <p className="text-muted">{r.detail}</p>}
                    </li>
                  ))}
                </ul>
                <p className="mt-2 text-xs text-faint">
                  Revisar un reporte deja registro de quién actuó y por qué.
                </p>
              </Card>
            )}

            {(espaciosSinAnfitrion.length > 0 || espaciosSinRitual.length > 0) && (
              <Card>
                <p className="text-sm font-semibold">Espacios que necesitan cuidado</p>
                <ul className="mt-2 space-y-1 text-sm text-muted">
                  {espaciosSinAnfitrion.map((s) => (
                    <li key={`h-${s.id}`}>{s.name} · sin anfitrión asignado</li>
                  ))}
                  {espaciosSinRitual.map((s) => (
                    <li key={`r-${s.id}`}>{s.name} · sin ritual definido</li>
                  ))}
                </ul>
                <p className="mt-2 text-xs text-faint">
                  Un espacio sin anfitrión y sin ritmo se apaga solo.
                </p>
              </Card>
            )}
          </div>
        )}
      </section>

      <section aria-label="Espacios">
        <SectionTitle>Espacios del centro</SectionTitle>
        <ul className="grid gap-3 md:grid-cols-2">
          {(spaces ?? [])
            .sort((a, b) => (b.space_memberships ?? []).length - (a.space_memberships ?? []).length)
            .map((s) => {
              const spacePosts = allPosts.filter((p) => p.space_id === s.id);
              const ultimo = spacePosts[0];
              return (
                <li key={s.id}>
                  <Card className="!py-4">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-semibold">{s.name}</p>
                      <Badge variant={s.kind === "generacion" ? "accent" : s.kind === "alumni" ? "gold" : "neutral"}>
                        {s.kind}
                      </Badge>
                    </div>
                    <p className="mt-1 text-xs text-faint">
                      {plural((s.space_memberships ?? []).length, "persona", "personas")}
                      {s.people?.full_name && ` · anfitriona: ${s.people.full_name}`}
                    </p>
                    <p className="mt-1.5 text-xs">
                      {ultimo ? (
                        <span className="text-muted">Última actividad {timeAgo(ultimo.created_at)}</span>
                      ) : (
                        <span className="text-gold">Sin actividad todavía</span>
                      )}
                    </p>
                  </Card>
                </li>
              );
            })}
        </ul>
      </section>

      <p className="text-xs text-faint max-w-2xl">
        Esta consola no mide volumen de publicaciones ni tiempo en pantalla: mide si la
        comunidad responde, si la conversación se reparte y si alguien está solo. Los
        mensajes directos entre personas no aparecen aquí ni en ninguna otra vista del
        centro.
      </p>
    </div>
  );
}
