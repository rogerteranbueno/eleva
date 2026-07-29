import Link from "next/link";
import { notFound } from "next/navigation";
import { requireMember } from "@/lib/context";
import { createUserClient, createServiceClient } from "@/lib/supabase/server";
import { giveRecognition } from "@/app/actions/member";
import { Card, SectionTitle, Avatar, Badge } from "@/components/ui";
import { RelationBar } from "@/components/hub/RelationBar";
import { dateShort } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function PerfilPersonaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const ctx = await requireMember();

  // Lectura bajo RLS: solo veo a quien comparte generación conmigo (o equipo).
  const supabase = await createUserClient();
  const { data: person } = await supabase
    .from("people")
    .select("id, full_name, preferred_name, declaration, looking_for, bio, city, interests, skills, offers, available_to_serve, accepts_messages")
    .eq("id", id)
    .maybeSingle();
  if (!person) notFound();

  const service = createServiceClient();
  const [{ data: trajectory }, { data: serviceRoles }, { data: recognitions }, postsCount] =
    await Promise.all([
      service
        .from("stage_participations")
        .select("delivery_status, stage_runs(stage, name, status, generation_cycles(name, status))")
        .eq("person_id", id)
        .eq("organization_id", ctx.organizationId)
        .order("created_at"),
      service
        .from("team_assignments")
        .select("role, starts_at, ends_at, stage_runs(name)")
        .eq("person_id", id)
        .eq("organization_id", ctx.organizationId),
      supabase
        .from("recognitions")
        .select("text, impact, created_at, people:from_person_id(full_name)")
        .eq("to_person_id", id)
        .order("created_at", { ascending: false })
        .limit(10),
      service
        .from("posts")
        .select("id", { count: "exact", head: true })
        .eq("author_person_id", id),
    ]);

  // Logros (etapas completadas / graduación) + servicio con vigencia.
  // Nunca "staff" como nivel: servir es una asignación, no un escalafón.
  const nowIso = new Date().toISOString();
  const achievements = (trajectory ?? [])
    .filter((t) => t.delivery_status === "completo" && t.stage_runs)
    .map((t) =>
      t.stage_runs!.stage === "pl"
        ? `Graduación del ${t.stage_runs!.name}`
        : `Completó ${t.stage_runs!.name}`
    );
  const current = (trajectory ?? []).find(
    (t) => ["activo", "esperado"].includes(t.delivery_status) && t.stage_runs?.status !== "cerrada"
  );
  const activeService = (serviceRoles ?? []).filter(
    (t) => t.starts_at <= nowIso && (!t.ends_at || t.ends_at > nowIso)
  );

  const isSelf = id === ctx.personId;

  // Estado de la relación: seguir, conectar y escribir son actos distintos.
  const [{ data: follow }, { data: conn }, { data: req }] = isSelf
    ? [{ data: null }, { data: null }, { data: null }]
    : await Promise.all([
        supabase
          .from("follows")
          .select("id")
          .eq("follower_person_id", ctx.personId)
          .eq("followed_person_id", id)
          .maybeSingle(),
        supabase
          .from("connections")
          .select("id")
          .eq("person_a", [ctx.personId, id].sort()[0])
          .eq("person_b", [ctx.personId, id].sort()[1])
          .maybeSingle(),
        supabase
          .from("connection_requests")
          .select("id, status")
          .eq("from_person_id", ctx.personId)
          .eq("to_person_id", id)
          .maybeSingle(),
      ]);
  const following = !!follow;
  const connected = !!conn;
  const requestPending = req?.status === "pendiente";

  return (
    <div className="space-y-8 max-w-2xl">
      <nav aria-label="Miga de pan" className="text-sm text-faint">
        <Link href="/mi/personas" className="hover:text-muted">
          ← Personas
        </Link>
      </nav>

      <header className="flex items-start gap-4">
        <Avatar name={person.full_name} size={64} />
        <div className="min-w-0">
          <h1 className="text-2xl font-bold tracking-tight">{person.full_name}</h1>
          {person.declaration && (
            <blockquote className="mt-2 border-l-2 border-gold pl-3 text-sm italic text-gold/90">
              “{person.declaration}”
            </blockquote>
          )}
          {person.bio && <p className="mt-2 text-sm text-muted">{person.bio}</p>}
          <div className="mt-2 flex flex-wrap gap-1.5">
            {person.city && <Badge variant="neutral">{person.city}</Badge>}
            {person.available_to_serve && <Badge variant="aqua">Disponible para servir</Badge>}
            {(person.skills ?? []).map((s) => (
              <Badge key={`sk-${s}`} variant="neutral">{s}</Badge>
            ))}
            {(person.interests ?? []).map((i) => (
              <Badge key={`in-${i}`} variant="neutral">{i}</Badge>
            ))}
            {(person.looking_for ?? []).map((l) => (
              <Badge key={`lf-${l}`} variant="gold">Busca: {l}</Badge>
            ))}
          </div>
          {(person.offers ?? []).length > 0 && (
            <p className="mt-2 text-sm">
              <span className="font-medium">Ofrece:</span>{" "}
              <span className="text-muted">{person.offers!.join(" · ")}</span>
            </p>
          )}
        </div>
      </header>

      {!isSelf && (
        <RelationBar
          personId={person.id}
          personName={person.preferred_name ?? person.full_name.split(" ")[0]}
          following={following}
          connected={connected}
          requestPending={requestPending}
          acceptsMessages={person.accepts_messages ?? "centro"}
        />
      )}

      <section aria-label="Trayectoria">
        <SectionTitle>Camino de transformación</SectionTitle>
        <ul className="space-y-1.5">
          {achievements.map((a, i) => (
            <li key={i} className="flex items-center gap-2 text-sm text-muted">
              <span aria-hidden className="text-gold">◆</span>
              {a}
            </li>
          ))}
          {current && (
            <li className="flex items-center gap-2 text-sm text-muted">
              <span aria-hidden className="text-accent">◆</span>
              {current.stage_runs?.name}
              <Badge variant="ok">En curso</Badge>
            </li>
          )}
          {activeService.map((t, i) => (
            <li key={`s-${i}`} className="flex items-center gap-2 text-sm text-muted">
              <span aria-hidden className="text-aqua">◆</span>
              Sirve como {t.role === "capitan" ? "capitán" : t.role} · {t.stage_runs?.name}
            </li>
          ))}
          {achievements.length === 0 && !current && activeService.length === 0 && (
            <li className="text-sm text-muted">Su camino apenas comienza.</li>
          )}
          <li className="text-xs text-faint">
            {postsCount.count ?? 0} publicaciones en su comunidad
          </li>
        </ul>
      </section>

      <section aria-label="Reconocimientos">
        <SectionTitle>
          Reconocimientos{" "}
          <span aria-hidden className="text-gold">🏅</span>
        </SectionTitle>
        {(recognitions ?? []).length === 0 ? (
          <p className="text-sm text-muted">
            Aún no tiene reconocimientos. Los reconocimientos se ganan con
            acciones, no se piden.
          </p>
        ) : (
          <ul className="space-y-3">
            {recognitions!.map((r, i) => (
              <li key={i}>
                <Card className="!py-4 border-gold/25">
                  <p className="text-sm leading-relaxed">“{r.text}”</p>
                  {r.impact && (
                    <p className="mt-1.5 text-sm text-muted italic">
                      El impacto: {r.impact}
                    </p>
                  )}
                  <p className="mt-2 text-xs text-faint">
                    — {r.people?.full_name} · {dateShort(r.created_at)}
                  </p>
                </Card>
              </li>
            ))}
          </ul>
        )}
      </section>

      {!isSelf && (
        <section aria-label="Dar un reconocimiento">
          <SectionTitle>Reconocer a {person.preferred_name ?? person.full_name}</SectionTitle>
          <Card>
            <form action={giveRecognition} className="space-y-3">
              <input type="hidden" name="toPersonId" value={person.id} />
              <div>
                <label htmlFor="rec-text" className="block text-sm font-medium">
                  Te reconozco por…
                </label>
                <input
                  id="rec-text"
                  name="text"
                  type="text"
                  required
                  placeholder="La acción concreta que quieres reconocer"
                  className="mt-1 w-full rounded-lg border border-line bg-raised px-3 py-2 text-sm placeholder:text-faint"
                />
              </div>
              <div>
                <label htmlFor="rec-impact" className="block text-sm font-medium">
                  El impacto que tuvo en mí{" "}
                  <span className="font-normal text-faint">(opcional)</span>
                </label>
                <input
                  id="rec-impact"
                  name="impact"
                  type="text"
                  className="mt-1 w-full rounded-lg border border-line bg-raised px-3 py-2 text-sm"
                />
              </div>
              <button
                type="submit"
                className="rounded-lg bg-gold-soft px-4 py-2 text-sm font-semibold text-gold hover:opacity-90"
              >
                🏅 Reconocer
              </button>
            </form>
          </Card>
        </section>
      )}
    </div>
  );
}
