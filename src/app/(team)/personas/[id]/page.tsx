import Link from "next/link";
import { notFound } from "next/navigation";
import { requireCapability, hasCapability } from "@/lib/capabilities";
import { assertCanReadPerson } from "@/lib/scope";
import { createServiceClient } from "@/lib/supabase/server";
import {
  Card,
  SectionTitle,
  Avatar,
  Badge,
  RegistrationBadge,
  DeliveryBadge,
  PassBadge,
  CaseStatusBadge,
} from "@/components/ui";
import { money, dateShort, dateTime, roleLabel } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function PersonaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const ctx = await requireCapability(["people.read.assigned", "people.read.operational"]);
  // El expediente se abre solo si la persona está en el ámbito del rol: el
  // staff ve a su grupo, no al centro entero.
  await assertCanReadPerson(ctx, id);
  const service = createServiceClient();

  const { data: person } = await service
    .from("people")
    .select(
      "id, full_name, preferred_name, email, phone, declaration, created_at, organization_memberships!inner(organization_id)"
    )
    .eq("id", id)
    .eq("organization_memberships.organization_id", ctx.organizationId)
    .single();
  if (!person) notFound();

  const financeAllowed = hasCapability(ctx, "finance.read");
  const casesAllowed = hasCapability(ctx, "case.operate.operational");
  const contactAllowed = hasCapability(ctx, "people.read.contact");

  const [participations, expectations, charges, cases, consents, groupRows, service_roles, attribs] =
    await Promise.all([
      service
        .from("stage_participations")
        .select(
          "id, registration_status, delivery_status, registered_at, source, stage_runs(id, name, stage, starts_on, generation_cycles(id, name, status)), continuity_passes!continuity_passes_from_participation_id_fkey(pass_status, next_status)"
        )
        .eq("person_id", id)
        .eq("organization_id", ctx.organizationId)
        .order("created_at"),
      service
        .from("attendance_expectations")
        .select(
          "event_occurrence_id, stage_participation_id, event_occurrences(name, starts_at, stage_runs(name)), stage_participations!inner(person_id)"
        )
        .eq("stage_participations.person_id", id)
        .eq("organization_id", ctx.organizationId),
      financeAllowed
        ? service
            .from("charges")
            .select(
              "id, concept, amount_cents, currency, due_on, status, payment_allocations(amount_cents, payments(paid_at, confirmed)), discounts(amount_cents, kind)"
            )
            .eq("person_id", id)
            .eq("organization_id", ctx.organizationId)
            .order("due_on")
        : Promise.resolve({ data: null }),
      casesAllowed
        ? service
            .from("cases")
            .select("id, title, kind, status, priority, opened_at")
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
        .select(
          "small_groups(name, people:staff_person_id(full_name)), stage_participations!inner(person_id)"
        )
        .eq("stage_participations.person_id", id)
        .eq("organization_id", ctx.organizationId),
      service
        .from("team_assignments")
        .select("role, starts_at, ends_at, stage_runs(name, generation_cycles(name))")
        .eq("person_id", id)
        .eq("organization_id", ctx.organizationId)
        .order("starts_at", { ascending: false }),
      service
        .from("enrollment_attributions")
        .select("id, status, enrolled:enrolled_person_id(full_name)")
        .eq("enroller_person_id", id)
        .eq("organization_id", ctx.organizationId),
    ]);

  // Asistencia contra lo esperado (con "sin registro" visible).
  const expRows = expectations.data ?? [];
  const { data: attRecords } = expRows.length
    ? await service
        .from("attendance_records")
        .select("event_occurrence_id, stage_participation_id, status")
        .in("stage_participation_id", [...new Set(expRows.map((e) => e.stage_participation_id))])
    : { data: [] as never[] };
  const recBy = new Map(
    (attRecords ?? []).map((r) => [`${r.event_occurrence_id}:${r.stage_participation_id}`, r.status])
  );
  const attRows = expRows
    .map((e) => ({
      key: `${e.event_occurrence_id}:${e.stage_participation_id}`,
      name: e.event_occurrences?.name ?? "—",
      run: e.event_occurrences?.stage_runs?.name ?? "",
      startsAt: e.event_occurrences?.starts_at ?? "",
      status: recBy.get(`${e.event_occurrence_id}:${e.stage_participation_id}`) ?? "sin_registro",
    }))
    .filter((r) => new Date(r.startsAt) < new Date())
    .sort((a, b) => a.startsAt.localeCompare(b.startsAt));
  const presentCount = attRows.filter((a) => ["presente", "tarde"].includes(a.status)).length;

  const group = groupRows.data?.[0]?.small_groups;
  const now = new Date().toISOString();
  const activeService = (service_roles.data ?? []).filter(
    (t) => t.starts_at <= now && (!t.ends_at || t.ends_at > now)
  );
  const pastService = (service_roles.data ?? []).filter((t) => t.ends_at && t.ends_at <= now);

  // Trayectoria agrupada por ciclo.
  const byCycle = new Map<
    string,
    { name: string; parts: NonNullable<typeof participations.data> }
  >();
  for (const pa of participations.data ?? []) {
    const cyc = pa.stage_runs?.generation_cycles;
    if (!cyc) continue;
    if (!byCycle.has(cyc.id)) byCycle.set(cyc.id, { name: cyc.name, parts: [] });
    byCycle.get(cyc.id)!.parts.push(pa);
  }

  return (
    <div className="space-y-8 max-w-3xl">
      <nav aria-label="Miga de pan" className="text-sm text-faint">
        <Link href="/personas" className="hover:text-muted">
          ← Personas
        </Link>
      </nav>

      <header className="flex items-start gap-4">
        <Avatar name={person.full_name} size={56} />
        <div className="min-w-0">
          <h1 className="text-2xl font-bold tracking-tight">{person.full_name}</h1>
          {contactAllowed ? (
            <p className="mt-0.5 text-sm text-muted">
              {person.email ?? "sin email"} · {person.phone ?? "sin teléfono"}
            </p>
          ) : (
            <p className="mt-0.5 text-sm text-faint">
              Datos de contacto reservados a Oficinas y Dirección.
            </p>
          )}
          {group && (
            <p className="mt-0.5 text-xs text-faint">
              {group.name} · acompaña {group.people?.full_name}
            </p>
          )}
          {activeService.length > 0 && (
            <p className="mt-1.5 flex flex-wrap gap-1.5">
              {activeService.map((t, i) => (
                <Badge key={i} variant="aqua">
                  {roleLabel(t.role)} · {t.stage_runs?.name}
                </Badge>
              ))}
            </p>
          )}
        </div>
      </header>

      {/* ── Trayectoria ── */}
      <section aria-label="Trayectoria">
        <SectionTitle>Trayectoria por generación</SectionTitle>
        <div className="space-y-3">
          {[...byCycle.entries()].map(([cycleId, cyc]) => (
            <Card key={cycleId} className="!py-4">
              <Link
                href={`/generaciones/${cycleId}`}
                className="font-semibold hover:text-accent-strong"
              >
                {cyc.name}
              </Link>
              <ul className="mt-2.5 space-y-2">
                {cyc.parts
                  .sort((a, b) =>
                    (a.stage_runs?.starts_on ?? "").localeCompare(b.stage_runs?.starts_on ?? "")
                  )
                  .map((pa) => {
                    const pass = pa.continuity_passes;
                    return (
                      <li key={pa.id} className="flex flex-wrap items-center gap-2 text-sm">
                        <span className="w-24 shrink-0 font-medium">
                          {pa.stage_runs?.name.split(" ")[0]}
                        </span>
                        <RegistrationBadge status={pa.registration_status} />
                        <DeliveryBadge status={pa.delivery_status} />
                        {pass && pass.pass_status !== "no_evaluado" && (
                          <PassBadge passStatus={pass.pass_status} nextStatus={pass.next_status} />
                        )}
                        {pa.source && <span className="text-xs text-faint">vía {pa.source}</span>}
                      </li>
                    );
                  })}
              </ul>
            </Card>
          ))}
          {byCycle.size === 0 && (
            <p className="text-sm text-muted">Sin participaciones registradas.</p>
          )}
          {pastService.length > 0 && (
            <p className="text-xs text-faint">
              Servicio previo:{" "}
              {pastService
                .map((t) => `${roleLabel(t.role)} · ${t.stage_runs?.name}`)
                .join(" · ")}
            </p>
          )}
        </div>
      </section>

      {/* ── Asistencia ── */}
      <section aria-label="Asistencia">
        <SectionTitle>Asistencia</SectionTitle>
        {attRows.length === 0 ? (
          <p className="text-sm text-muted">Sin días de etapa esperados todavía.</p>
        ) : (
          <Card>
            <p className="text-sm">
              <span className="text-xl font-bold">{presentCount}</span>
              <span className="text-muted"> de {attRows.length} esperados</span>
            </p>
            <ul className="mt-3 flex flex-wrap gap-1.5" aria-label="Detalle por evento">
              {attRows.map((a) => (
                <li
                  key={a.key}
                  title={`${a.run} · ${a.name}: ${a.status.replace("_", " ")}`}
                  className={`rounded px-2 py-1 text-xs font-medium ${
                    ["presente", "tarde"].includes(a.status)
                      ? "bg-ok-soft text-ok"
                      : a.status === "justificada"
                        ? "bg-gold-soft text-gold"
                        : a.status === "sin_registro"
                          ? "bg-raised text-faint"
                          : "bg-danger-soft text-danger"
                  }`}
                >
                  {a.name} ·{" "}
                  {a.status === "presente"
                    ? "✓"
                    : a.status === "tarde"
                      ? "tarde"
                      : a.status === "justificada"
                        ? "just."
                        : a.status === "sin_registro"
                          ? "sin registro"
                          : "✗"}
                </li>
              ))}
            </ul>
          </Card>
        )}
      </section>

      {/* ── Ledger propio ── */}
      {financeAllowed && charges.data && (
        <section aria-label="Pagos">
          <SectionTitle>Cargos y pagos</SectionTitle>
          <div className="space-y-2">
            {charges.data.map((c) => {
              const allocated = (c.payment_allocations ?? []).reduce(
                (s, a) => s + a.amount_cents,
                0
              );
              const discounted = (c.discounts ?? []).reduce((s, d) => s + d.amount_cents, 0);
              const unconfirmed = (c.payment_allocations ?? []).some(
                (a) => a.payments && !a.payments.confirmed
              );
              return (
                <Card key={c.id} className="!py-3.5">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-medium text-sm">{c.concept}</p>
                      <p className="text-xs text-faint">
                        vence {c.due_on} · cubierto{" "}
                        {money(allocated + discounted, c.currency.trim())} de{" "}
                        {money(c.amount_cents, c.currency.trim())}
                        {discounted > 0 &&
                          ` (incluye ${money(discounted, c.currency.trim())} de ${
                            c.discounts?.[0]?.kind ?? "descuento"
                          })`}
                        {unconfirmed && " · pago por confirmar"}
                      </p>
                    </div>
                    <Badge
                      variant={
                        c.status === "pagado" ? "ok" : c.status === "parcial" ? "gold" : "neutral"
                      }
                    >
                      {c.status === "pagado"
                        ? "Pagado"
                        : c.status === "parcial"
                          ? "Parcial"
                          : c.status === "cancelado"
                            ? "Cancelado"
                            : "Pendiente"}
                    </Badge>
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

      {/* ── Enrolamientos que originó ── */}
      {(attribs.data ?? []).length > 0 && (
        <section aria-label="Enrolamientos">
          <SectionTitle>Enrolamientos que originó</SectionTitle>
          <ul className="flex flex-wrap gap-2">
            {attribs.data!.map((a) => (
              <li key={a.id}>
                <Badge variant={a.status === "registrado" || a.status === "confirmado" ? "ok" : "neutral"}>
                  {a.enrolled?.full_name}
                </Badge>
              </li>
            ))}
          </ul>
        </section>
      )}

      {casesAllowed && cases.data && cases.data.length > 0 && (
        <section aria-label="Casos">
          <SectionTitle>Casos de seguimiento</SectionTitle>
          <ul className="space-y-2">
            {cases.data
              .filter((c) => c.kind !== "finanzas" || financeAllowed)
              .map((c) => (
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
            Sin consentimientos registrados. Antes de contactar por un canal directo, confirma la
            preferencia de la persona.
          </p>
        ) : (
          <ul className="flex flex-wrap gap-2">
            {consents.data!.map((c, i) => (
              <li key={i} className="rounded-full bg-aqua-soft px-3 py-1 text-xs text-aqua">
                {c.channel} · {c.purpose.replaceAll("_", " ")} · {dateShort(c.recorded_at)}
              </li>
            ))}
          </ul>
        )}
      </section>

      <p className="text-xs text-faint max-w-lg">
        Este expediente muestra hechos operativos con acceso por capacidad, en planos separados:
        registro, entrega, pase y dinero nunca se mezclan en un solo estado ({dateTime(new Date())}).
      </p>
    </div>
  );
}
