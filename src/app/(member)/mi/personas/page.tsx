import Link from "next/link";
import { requireMember } from "@/lib/context";
import { createServiceClient, createUserClient } from "@/lib/supabase/server";
import { Card, SectionTitle, Avatar, EmptyState, Badge } from "@/components/ui";
import { roleLabel } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function MiPersonasPage() {
  const ctx = await requireMember();
  const supabase = await createUserClient();

  const { data: participation } = await supabase
    .from("participations")
    .select("id, cohort_id, cohorts(id, name)")
    .eq("person_id", ctx.personId)
    .in("state", ["confirmado", "activo", "pausa"])
    .limit(1)
    .maybeSingle();

  if (!participation?.cohorts) {
    return <EmptyState title="Todavía no estás en una generación activa." />;
  }
  const cohort = participation.cohorts;

  // Roster resuelto en servidor (nombres visibles por política de compañeros).
  const service = createServiceClient();
  const [{ data: mates }, { data: team }] = await Promise.all([
    service
      .from("participations")
      .select("person_id, people(id, full_name, declaration)")
      .eq("cohort_id", cohort.id)
      .in("state", ["confirmado", "activo", "pausa"]),
    service
      .from("team_assignments")
      .select("role, people(id, full_name, declaration)")
      .eq("cohort_id", cohort.id),
  ]);

  return (
    <div className="space-y-8 max-w-2xl">
      <header>
        <h1 className="text-2xl font-bold tracking-tight">Personas</h1>
        <p className="mt-1 text-sm text-muted">
          Tu generación y el equipo que la acompaña.
        </p>
      </header>

      <section aria-label="Equipo">
        <SectionTitle>Te acompañan</SectionTitle>
        <ul className="grid gap-2 sm:grid-cols-2">
          {(team ?? []).map((t, i) => (
            <li key={i}>
              <Card className="flex items-center gap-3 !py-3">
                <Avatar name={t.people?.full_name ?? "?"} size={36} />
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{t.people?.full_name}</p>
                  <Badge variant="aqua">{roleLabel(t.role)}</Badge>
                </div>
              </Card>
            </li>
          ))}
        </ul>
      </section>

      <section aria-label="Mi generación">
        <SectionTitle>{cohort.name}</SectionTitle>
        <ul className="space-y-2">
          {(mates ?? [])
            .filter((m) => m.person_id !== ctx.personId)
            .map((m) => (
              <li key={m.person_id}>
                <Link
                  href={`/mi/personas/${m.person_id}`}
                  className="flex items-center gap-3 rounded-(--radius-card) border border-line bg-surface px-4 py-3 transition-colors hover:bg-raised"
                >
                  <Avatar name={m.people?.full_name ?? "?"} size={38} />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium">{m.people?.full_name}</p>
                    {m.people?.declaration && (
                      <p className="truncate text-xs text-muted italic">
                        “{m.people.declaration}”
                      </p>
                    )}
                  </div>
                  <span aria-hidden className="text-faint">→</span>
                </Link>
              </li>
            ))}
        </ul>
      </section>
    </div>
  );
}
