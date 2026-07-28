import Link from "next/link";
import { notFound } from "next/navigation";
import { requireTeam, can } from "@/lib/context";
import { createServiceClient } from "@/lib/supabase/server";
import {
  Card,
  SectionTitle,
  Avatar,
  ParticipationStateBadge,
  CaseStatusBadge,
} from "@/components/ui";
import { money, dateShort, dateTime } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function PersonaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const ctx = await requireTeam();
  const service = createServiceClient();

  const { data: person } = await service
    .from("people")
    .select(
      "id, full_name, preferred_name, email, phone, created_at, organization_memberships!inner(organization_id)"
    )
    .eq("id", id)
    .eq("organization_memberships.organization_id", ctx.organizationId)
    .single();
  if (!person) notFound();

  const financeAllowed = can.viewFinance(ctx);
  const casesAllowed = can.operateCases(ctx);

  const [participations, attendance, charges, cases, consents, groupRows] =
    await Promise.all([
      service
        .from("participations")
        .select("id, state, registered_at, source, cohorts(id, name, status)")
        .eq("person_id", id)
        .eq("organization_id", ctx.organizationId)
        .order("created_at"),
      service
        .from("attendance_records")
        .select("status, sessions(name, starts_at, cohort_id), participations!inner(person_id)")
        .eq("participations.person_id", id)
        .eq("organization_id", ctx.organizationId)
        .order("created_at"),
      financeAllowed
        ? service
            .from("charges")
            .select("id, concept, amount_cents, currency, due_on, status, payments(amount_cents, paid_at, reconciled)")
            .eq("person_id", id)
            .eq("organization_id", ctx.organizationId)
        : Promise.resolve({ data: null }),
      casesAllowed
        ? service
            .from("cases")
            .select("id, title, status, priority, opened_at")
            .eq("subject_person_id", id)
            .eq("organization_id", ctx.organizationId)
            .order("opened_at", { ascending: false })
        : Promise.resolve({ data: null }),
      service
        .from("consent_records")
        .select("purpose, channel, granted, recorded_at")
        .eq("person_id", id)
        .eq("organization_id", ctx.organizationId),
      service
        .from("small_group_members")
        .select("small_groups(name, people:staff_person_id(full_name)), participations!inner(person_id)")
        .eq("participations.person_id", id)
        .eq("organization_id", ctx.organizationId),
    ]);

  const attRows = attendance.data ?? [];
  const presentCount = attRows.filter((a) =>
    ["presente", "tarde"].includes(a.status)
  ).length;
  const group = groupRows.data?.[0]?.small_groups;

  return (
    <div className="space-y-8 max-w-3xl">
      <nav aria-label="Miga de pan" className="text-sm text-faint">
        <Link href="/personas" className="hover:text-muted">
          ← Personas
        </Link>
      </nav>

      <header className="flex items-center gap-4">
        <Avatar name={person.full_name} size={56} />
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{person.full_name}</h1>
          <p className="mt-0.5 text-sm text-muted">
            {person.email ?? "sin email"} · {person.phone ?? "sin teléfono"}
          </p>
          {group && (
            <p className="mt-0.5 text-xs text-faint">
              {group.name} · acompaña {group.people?.full_name}
            </p>
          )}
        </div>
      </header>

      <section aria-label="Participaciones">
        <SectionTitle>Participaciones</SectionTitle>
        <div className="space-y-2">
          {(participations.data ?? []).map((pa) => (
            <Card key={pa.id} className="flex items-center justify-between gap-3 !py-3.5">
              <div>
                <Link
                  href={`/generaciones/${pa.cohorts?.id}`}
                  className="font-medium hover:text-accent-strong"
                >
                  {pa.cohorts?.name}
                </Link>
                <p className="text-xs text-faint">
                  {pa.source && `Origen: ${pa.source} · `}
                  {pa.registered_at && `registro ${dateShort(pa.registered_at)}`}
                </p>
              </div>
              <ParticipationStateBadge state={pa.state} />
            </Card>
          ))}
          {(participations.data ?? []).length === 0 && (
            <p className="text-sm text-muted">Sin participaciones registradas.</p>
          )}
        </div>
      </section>

      <section aria-label="Asistencia">
        <SectionTitle>Asistencia</SectionTitle>
        {attRows.length === 0 ? (
          <p className="text-sm text-muted">Sin sesiones registradas todavía.</p>
        ) : (
          <Card>
            <p className="text-sm">
              <span className="text-xl font-bold">{presentCount}</span>
              <span className="text-muted"> de {attRows.length} sesiones</span>
            </p>
            <ul className="mt-3 flex flex-wrap gap-1.5" aria-label="Detalle por sesión">
              {attRows.map((a, i) => (
                <li
                  key={i}
                  title={`${a.sessions?.name}: ${a.status}`}
                  className={`rounded px-2 py-1 text-xs font-medium ${
                    ["presente", "tarde"].includes(a.status)
                      ? "bg-ok-soft text-ok"
                      : a.status === "justificada"
                        ? "bg-gold-soft text-gold"
                        : "bg-danger-soft text-danger"
                  }`}
                >
                  {a.sessions?.name?.replace("Sesión ", "S")} ·{" "}
                  {a.status === "presente"
                    ? "✓"
                    : a.status === "tarde"
                      ? "tarde"
                      : a.status === "justificada"
                        ? "just."
                        : "✗"}
                </li>
              ))}
            </ul>
          </Card>
        )}
      </section>

      {financeAllowed && charges.data && (
        <section aria-label="Pagos">
          <SectionTitle>Cargos y pagos</SectionTitle>
          <div className="space-y-2">
            {charges.data.map((c) => {
              const paid = (c.payments ?? []).reduce((s, p) => s + p.amount_cents, 0);
              const unreconciled = (c.payments ?? []).some((p) => !p.reconciled);
              return (
                <Card key={c.id} className="!py-3.5">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-medium text-sm">{c.concept}</p>
                      <p className="text-xs text-faint">
                        vence {c.due_on} · pagado {money(paid, c.currency.trim())} de{" "}
                        {money(c.amount_cents, c.currency.trim())}
                        {unreconciled && " · pago sin conciliar"}
                      </p>
                    </div>
                    <ParticipationStateBadge
                      state={
                        c.status === "pagado"
                          ? "pagado"
                          : c.status === "parcial"
                            ? "pago_parcial"
                            : c.status
                      }
                    />
                  </div>
                </Card>
              );
            })}
            {charges.data.length === 0 && (
              <p className="text-sm text-muted">Sin cargos registrados.</p>
            )}
          </div>
        </section>
      )}

      {casesAllowed && cases.data && cases.data.length > 0 && (
        <section aria-label="Casos">
          <SectionTitle>Casos de seguimiento</SectionTitle>
          <ul className="space-y-2">
            {cases.data.map((c) => (
              <li key={c.id}>
                <Link
                  href={`/casos/${c.id}`}
                  className="flex items-center justify-between gap-3 rounded-(--radius-card) border border-line bg-surface px-4 py-3 hover:bg-raised"
                >
                  <span className="text-sm font-medium">{c.title}</span>
                  <CaseStatusBadge status={c.status} />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section aria-label="Consentimientos">
        <SectionTitle>Consentimientos</SectionTitle>
        {(consents.data ?? []).length === 0 ? (
          <p className="text-sm text-muted">
            Sin consentimientos registrados. Antes de contactar por un canal
            directo, confirma la preferencia de la persona.
          </p>
        ) : (
          <ul className="flex flex-wrap gap-2">
            {consents.data!.map((c, i) => (
              <li
                key={i}
                className="rounded-full bg-aqua-soft px-3 py-1 text-xs text-aqua"
              >
                {c.channel} · {c.purpose.replaceAll("_", " ")} ·{" "}
                {dateShort(c.recorded_at)}
              </li>
            ))}
          </ul>
        )}
      </section>

      <p className="text-xs text-faint max-w-lg">
        Este expediente muestra hechos operativos con acceso por capacidad. No
        contiene valoraciones personales ni etiquetas clínicas, y cada consulta
        sensible queda dentro del ámbito de tu rol ({dateTime(new Date())}).
      </p>
    </div>
  );
}
