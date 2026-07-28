import Link from "next/link";
import { notFound } from "next/navigation";
import { requireMember } from "@/lib/context";
import { createUserClient, createServiceClient } from "@/lib/supabase/server";
import { giveRecognition } from "@/app/actions/member";
import { Card, SectionTitle, Avatar, Badge } from "@/components/ui";
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
    .select("id, full_name, preferred_name, declaration, looking_for")
    .eq("id", id)
    .maybeSingle();
  if (!person) notFound();

  const service = createServiceClient();
  const [{ data: trajectory }, { data: recognitions }, postsCount] =
    await Promise.all([
      service
        .from("participations")
        .select("state, cohorts(name, status)")
        .eq("person_id", id)
        .eq("organization_id", ctx.organizationId)
        .order("created_at"),
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

  const isSelf = id === ctx.personId;

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
          {(person.looking_for ?? []).length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {person.looking_for!.map((l) => (
                <Badge key={l} variant="aqua">Busca: {l}</Badge>
              ))}
            </div>
          )}
        </div>
      </header>

      <section aria-label="Trayectoria">
        <SectionTitle>Camino de transformación</SectionTitle>
        <ul className="space-y-1.5">
          {(trajectory ?? []).map((t, i) => (
            <li key={i} className="flex items-center gap-2 text-sm text-muted">
              <span aria-hidden className="text-accent">◆</span>
              {t.cohorts?.name}
              {t.cohorts?.status === "activa" && (
                <Badge variant="ok">En curso</Badge>
              )}
            </li>
          ))}
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
