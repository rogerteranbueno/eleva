import { requireCapability } from "@/lib/capabilities";
import { createServiceClient } from "@/lib/supabase/server";
import { recordFollowUp } from "@/app/actions/operations";
import { Card, SectionTitle, Badge, DeliveryBadge, EmptyState, Avatar, PersonLink } from "@/components/ui";
import { dateShort, plural, timeAgo } from "@/lib/format";

export const dynamic = "force-dynamic";

const RESULT_OPTIONS = [
  { value: "contactada", label: "Contactada" },
  { value: "sin_respuesta", label: "Sin respuesta" },
  { value: "reagendada", label: "Reagendada" },
  { value: "escalada", label: "Escalar" },
];

export default async function MiGrupoPage() {
  const ctx = await requireCapability(["followup.read.own", "followup.read.coverage"]);
  const service = createServiceClient();
  const today = new Date().toISOString().slice(0, 10);

  const [{ data: groups }, { data: calls }, { data: attribs }] = await Promise.all([
    service
      .from("small_groups")
      .select(
        "id, name, stage_runs(name, generation_cycles(name)), small_group_members(stage_participation_id, stage_participations(id, person_id, delivery_status, people(full_name, preferred_name)))"
      )
      .eq("staff_person_id", ctx.personId),
    service
      .from("follow_up_interactions")
      .select(
        "id, expected_on, done_at, resultado, notes, stage_participations(person_id, people(full_name, preferred_name))"
      )
      .eq("staff_person_id", ctx.personId)
      .order("expected_on"),
    service
      .from("enrollment_attributions")
      .select("id, status, created_at, enrolled:enrolled_person_id(full_name)")
      .eq("enroller_person_id", ctx.personId)
      .order("created_at", { ascending: false }),
  ]);

  const pending = (calls ?? []).filter((c) => !c.done_at);
  const overdue = pending.filter((c) => c.expected_on < today);
  const done = (calls ?? []).filter((c) => c.done_at).slice(-5).reverse();

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-bold tracking-tight">Hola, {ctx.preferredName}</h1>
        <p className="mt-1 text-sm text-muted">
          Tu servicio: tu grupo, tu seguimiento y tus enrolamientos. Acompañar es el trabajo; esto
          solo lo hace visible.
        </p>
      </header>

      {/* ── Llamadas de seguimiento ── */}
      <section aria-label="Seguimiento">
        <SectionTitle>
          Tu seguimiento
          {overdue.length > 0 && (
            <span className="ml-2 normal-case tracking-normal">
              <Badge variant="danger">{plural(overdue.length, "vencida", "vencidas")}</Badge>
            </span>
          )}
        </SectionTitle>
        {pending.length === 0 ? (
          <EmptyState title="No tienes llamadas pendientes.">
            Cuando Oficinas o tu capitán programen seguimiento, aparecerá aquí.
          </EmptyState>
        ) : (
          <ul className="space-y-2.5">
            {pending.map((c) => {
              const person = c.stage_participations?.people;
              const late = c.expected_on < today;
              return (
                <li
                  key={c.id}
                  className="rounded-(--radius-card) border border-line bg-surface p-4"
                >
                  <div className="flex flex-wrap items-center gap-2.5">
                    <Avatar name={person?.full_name ?? "?"} size={30} />
                    <PersonLink
                      id={c.stage_participations?.person_id}
                      name={person?.full_name ?? "—"}
                    />
                    <span className={`text-xs ${late ? "text-danger" : "text-faint"}`}>
                      esperada {dateShort(c.expected_on + "T12:00:00")}
                      {late && " · vencida"}
                    </span>
                  </div>
                  <form action={recordFollowUp} className="mt-3 flex flex-wrap items-center gap-2">
                    <input type="hidden" name="callId" value={c.id} />
                    <select
                      name="resultado"
                      required
                      className="rounded-lg border border-line bg-raised px-2.5 py-1.5 text-xs"
                      defaultValue=""
                    >
                      <option value="" disabled>
                        ¿Cómo salió?
                      </option>
                      {RESULT_OPTIONS.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                    <input
                      name="notes"
                      placeholder="Nota breve (opcional)"
                      className="min-w-0 flex-1 rounded-lg border border-line bg-raised px-2.5 py-1.5 text-xs"
                    />
                    <button
                      type="submit"
                      className="rounded-lg bg-accent px-3 py-1.5 text-xs font-semibold text-[#0b0a12] hover:opacity-90"
                    >
                      Registrar
                    </button>
                  </form>
                </li>
              );
            })}
          </ul>
        )}
        {done.length > 0 && (
          <ul className="mt-3 space-y-1 text-sm text-muted">
            {done.map((c) => (
              <li key={c.id}>
                ✓ {c.stage_participations?.people?.full_name} · {c.resultado}{" "}
                <span className="text-faint">· {timeAgo(c.done_at!)}</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* ── Mi grupo ── */}
      <section aria-label="Mi grupo">
        <SectionTitle>Tu grupo asignado</SectionTitle>
        {(groups ?? []).length === 0 ? (
          <EmptyState title="No tienes grupo asignado ahora.">
            Las asignaciones de servicio tienen vigencia: cuando sirvas una etapa, tu grupo vivirá
            aquí.
          </EmptyState>
        ) : (
          <div className="grid gap-3 md:grid-cols-2">
            {(groups ?? []).map((g) => (
              <Card key={g.id}>
                <h3 className="font-semibold">{g.name}</h3>
                <p className="text-xs text-faint">
                  {g.stage_runs?.generation_cycles?.name} · {g.stage_runs?.name}
                </p>
                <ul className="mt-3 space-y-2">
                  {(g.small_group_members ?? []).map((m) => {
                    const sp = m.stage_participations!;
                    return (
                      <li key={m.stage_participation_id} className="flex items-center gap-2.5 text-sm">
                        <Avatar name={sp.people?.full_name ?? "?"} size={26} />
                        <span className="min-w-0 flex-1">
                          <PersonLink id={sp.person_id} name={sp.people?.full_name ?? "—"} />
                        </span>
                        <DeliveryBadge status={sp.delivery_status} />
                      </li>
                    );
                  })}
                </ul>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* ── Mis enrolamientos ── */}
      <section aria-label="Mis enrolamientos">
        <SectionTitle>Tus enrolamientos</SectionTitle>
        {(attribs ?? []).length === 0 ? (
          <p className="text-sm text-muted">
            Aún no tienes enrolamientos registrados. Cuando invites a alguien y Oficinas lo registre,
            quedará acreditado aquí.
          </p>
        ) : (
          <ul className="space-y-2">
            {(attribs ?? []).map((a) => (
              <li
                key={a.id}
                className="flex items-center justify-between gap-3 rounded-(--radius-card) border border-line bg-surface px-4 py-3 text-sm"
              >
                <span className="font-medium">{a.enrolled?.full_name}</span>
                <Badge
                  variant={
                    a.status === "confirmado" ? "ok" : a.status === "registrado" ? "aqua" : "neutral"
                  }
                >
                  {a.status === "lead"
                    ? "En camino"
                    : a.status === "registrado"
                      ? "Registrado"
                      : a.status === "confirmado"
                        ? "Confirmado"
                        : "No avanzó"}
                </Badge>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
