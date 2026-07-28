import Link from "next/link";
import { notFound } from "next/navigation";
import { requireTeam } from "@/lib/context";
import { createServiceClient } from "@/lib/supabase/server";
import {
  registerIntervention,
  recordOutcome,
  dismissCase,
} from "@/app/actions/cases";
import {
  Card,
  SectionTitle,
  PriorityBadge,
  CaseStatusBadge,
  PersonLink,
} from "@/components/ui";
import { dateTime, hoursAgo } from "@/lib/format";

export const dynamic = "force-dynamic";

const KIND_LABEL: Record<string, string> = {
  contactar: "Contactar a la persona",
  corregir_dato: "Corregir un dato",
  reprogramar: "Reprogramar",
  ofrecer_opciones: "Ofrecer opciones",
  escalar: "Escalar al equipo",
  cerrar_sin_contacto: "Cerrar sin contactar",
};

const RESULT_LABEL: Record<string, string> = {
  respuesta_recibida: "Respondió",
  dato_corregido: "Dato corregido",
  opcion_elegida: "Eligió una opción",
  asistencia_posterior: "Volvió a asistir",
  pago_resuelto: "Pago resuelto",
  pausa_solicitada: "Pidió una pausa",
  sin_accion_por_respeto: "Sin acción, por respeto a su preferencia",
  no_alcanzado: "No la alcanzamos",
  otro: "Otro",
};

export default async function CasePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const ctx = await requireTeam();
  const service = createServiceClient();

  const { data: caseRow } = await service
    .from("cases")
    .select(
      "id, title, priority, status, due_at, opened_at, closed_at, closed_reason, subject_person_id, people:subject_person_id(id, full_name, preferred_name, phone, email), cohorts(id, name)"
    )
    .eq("id", id)
    .eq("organization_id", ctx.organizationId)
    .single();
  if (!caseRow) notFound();

  const [{ data: signals }, { data: interventions }, { data: outcomes }, { data: consents }] =
    await Promise.all([
      service
        .from("signals")
        .select(
          "id, explanation, evidence, status, detected_at, signal_definitions(name, rule, description)"
        )
        .eq("case_id", id)
        .order("detected_at"),
      service
        .from("interventions")
        .select(
          "id, kind, channel, draft_message, notes, performed_at, people:performed_by(full_name)"
        )
        .eq("case_id", id)
        .order("performed_at"),
      service
        .from("outcomes")
        .select("id, result, notes, recorded_at, people:recorded_by(full_name)")
        .eq("case_id", id)
        .order("recorded_at"),
      caseRow.subject_person_id
        ? service
            .from("consent_records")
            .select("channel, granted")
            .eq("person_id", caseRow.subject_person_id)
            .eq("granted", true)
        : Promise.resolve({ data: [] as { channel: string; granted: boolean }[] }),
    ]);

  const isOpen = ["abierto", "en_progreso", "esperando"].includes(caseRow.status);
  const hasIntervention = (interventions ?? []).length > 0;
  const person = caseRow.people;
  const consentChannels = (consents ?? []).map((c) => c.channel);

  const draftDefault = person
    ? `Hola, ${person.preferred_name ?? person.full_name.split(" ")[0]}. Desde ${ctx.organizationName} queremos saber cómo estás. No necesitas explicarnos nada; si te sirve, podemos ayudarte a encontrar una forma ligera de retomar o resolver cualquier pendiente. ¿Te gustaría que lo veamos juntos?`
    : "";

  return (
    <div className="space-y-8 max-w-3xl">
      <nav aria-label="Miga de pan" className="text-sm text-faint">
        <Link href="/hoy" className="hover:text-muted">
          ← Volver a Hoy
        </Link>
      </nav>

      <header>
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-2xl font-bold tracking-tight">{caseRow.title}</h1>
          <PriorityBadge priority={caseRow.priority} />
          <CaseStatusBadge status={caseRow.status} />
        </div>
        <p className="mt-2 text-sm text-muted">
          {person && (
            <>
              Sobre{" "}
              <PersonLink id={person.id} name={person.full_name} /> ·{" "}
            </>
          )}
          {caseRow.cohorts?.name && (
            <>
              <Link
                href={`/generaciones/${caseRow.cohorts.id}`}
                className="hover:text-foreground underline-offset-4 hover:underline"
              >
                {caseRow.cohorts.name}
              </Link>{" "}
              ·{" "}
            </>
          )}
          abierto el {dateTime(caseRow.opened_at)}
        </p>
      </header>

      <section aria-label="Señales">
        <SectionTitle>Por qué existe este caso</SectionTitle>
        <div className="space-y-3">
          {(signals ?? []).map((s) => (
            <Card key={s.id}>
              <p className="text-sm font-semibold text-accent-strong">
                {s.signal_definitions?.name}
              </p>
              <p className="mt-1.5 text-sm leading-relaxed">{s.explanation}</p>
              <p className="mt-2 text-xs text-faint">
                Regla: {s.signal_definitions?.rule} · Detectada hace{" "}
                {hoursAgo(s.detected_at)} h
              </p>
            </Card>
          ))}
          {(signals ?? []).length === 0 && (
            <p className="text-sm text-muted">Caso creado manualmente.</p>
          )}
        </div>
      </section>

      {(hasIntervention || (outcomes ?? []).length > 0) && (
        <section aria-label="Historial">
          <SectionTitle>Qué se ha hecho</SectionTitle>
          <ol className="space-y-3">
            {(interventions ?? []).map((iv) => (
              <li key={iv.id}>
                <Card>
                  <p className="text-sm font-semibold">
                    {KIND_LABEL[iv.kind] ?? iv.kind}
                    {iv.channel && iv.channel !== "ninguno" && (
                      <span className="font-normal text-muted"> · por {iv.channel}</span>
                    )}
                  </p>
                  {iv.draft_message && (
                    <blockquote className="mt-2 border-l-2 border-line-strong pl-3 text-sm text-muted italic">
                      {iv.draft_message}
                    </blockquote>
                  )}
                  {iv.notes && <p className="mt-2 text-sm text-muted">{iv.notes}</p>}
                  <p className="mt-2 text-xs text-faint">
                    {iv.people?.full_name} · {dateTime(iv.performed_at)}
                  </p>
                </Card>
              </li>
            ))}
            {(outcomes ?? []).map((o) => (
              <li key={o.id}>
                <Card className="border-ok/40">
                  <p className="text-sm font-semibold text-ok">
                    Resultado: {RESULT_LABEL[o.result] ?? o.result}
                  </p>
                  {o.notes && <p className="mt-1.5 text-sm text-muted">{o.notes}</p>}
                  <p className="mt-2 text-xs text-faint">
                    {o.people?.full_name} · {dateTime(o.recorded_at)}
                  </p>
                </Card>
              </li>
            ))}
          </ol>
        </section>
      )}

      {isOpen && !hasIntervention && (
        <section aria-label="Registrar intervención">
          <SectionTitle>Registrar una intervención</SectionTitle>
          <Card>
            <form action={registerIntervention} className="space-y-4">
              <input type="hidden" name="caseId" value={caseRow.id} />
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="kind" className="block text-sm font-medium">
                    Qué vas a hacer
                  </label>
                  <select
                    id="kind"
                    name="kind"
                    required
                    className="mt-1 w-full rounded-lg border border-line bg-raised px-3 py-2 text-sm"
                  >
                    {Object.entries(KIND_LABEL).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="channel" className="block text-sm font-medium">
                    Canal
                  </label>
                  <select
                    id="channel"
                    name="channel"
                    className="mt-1 w-full rounded-lg border border-line bg-raised px-3 py-2 text-sm"
                    defaultValue={consentChannels[0] ?? "ninguno"}
                  >
                    <option value="ninguno">Sin contacto directo</option>
                    <option value="whatsapp">
                      WhatsApp{consentChannels.includes("whatsapp") ? " · con consentimiento" : ""}
                    </option>
                    <option value="telefono">
                      Teléfono{consentChannels.includes("telefono") ? " · con consentimiento" : ""}
                    </option>
                    <option value="email">
                      Email{consentChannels.includes("email") ? " · con consentimiento" : ""}
                    </option>
                    <option value="presencial">En persona</option>
                  </select>
                </div>
              </div>
              {person && (
                <div>
                  <label htmlFor="draftMessage" className="block text-sm font-medium">
                    Borrador del mensaje{" "}
                    <span className="font-normal text-faint">
                      — tú decides si lo envías y cómo; el sistema no contacta a nadie
                    </span>
                  </label>
                  <textarea
                    id="draftMessage"
                    name="draftMessage"
                    rows={4}
                    defaultValue={draftDefault}
                    className="mt-1 w-full rounded-lg border border-line bg-raised px-3 py-2 text-sm leading-relaxed"
                  />
                </div>
              )}
              <div>
                <label htmlFor="notes" className="block text-sm font-medium">
                  Notas operativas <span className="font-normal text-faint">(opcional)</span>
                </label>
                <input
                  id="notes"
                  name="notes"
                  type="text"
                  className="mt-1 w-full rounded-lg border border-line bg-raised px-3 py-2 text-sm"
                  placeholder="Contexto para el equipo"
                />
              </div>
              <button
                type="submit"
                className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-[#0b0a12] hover:opacity-90"
              >
                Registrar intervención
              </button>
            </form>
          </Card>
        </section>
      )}

      {isOpen && hasIntervention && (
        <section aria-label="Registrar resultado">
          <SectionTitle>Registrar el resultado</SectionTitle>
          <Card>
            <form action={recordOutcome} className="space-y-4">
              <input type="hidden" name="caseId" value={caseRow.id} />
              <div>
                <label htmlFor="result" className="block text-sm font-medium">
                  Qué ocurrió
                </label>
                <select
                  id="result"
                  name="result"
                  required
                  className="mt-1 w-full rounded-lg border border-line bg-raised px-3 py-2 text-sm"
                >
                  {Object.entries(RESULT_LABEL).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="outcome-notes" className="block text-sm font-medium">
                  Notas <span className="font-normal text-faint">(opcional)</span>
                </label>
                <input
                  id="outcome-notes"
                  name="notes"
                  type="text"
                  className="mt-1 w-full rounded-lg border border-line bg-raised px-3 py-2 text-sm"
                />
              </div>
              <p className="text-xs text-faint">
                Al registrar el resultado, el caso se cierra y queda auditado. El
                resultado documenta lo que pasó; no califica a la persona.
              </p>
              <button
                type="submit"
                className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-[#0b0a12] hover:opacity-90"
              >
                Registrar resultado y cerrar
              </button>
            </form>
          </Card>
        </section>
      )}

      {isOpen && (
        <section aria-label="Descartar caso">
          <details className="group">
            <summary className="cursor-pointer text-sm text-faint hover:text-muted">
              ¿La señal es incorrecta? Descartar este caso
            </summary>
            <Card className="mt-3">
              <form action={dismissCase} className="flex flex-col gap-3 sm:flex-row">
                <input type="hidden" name="caseId" value={caseRow.id} />
                <input
                  name="reason"
                  type="text"
                  required
                  placeholder="Motivo del descarte (obligatorio)"
                  className="flex-1 rounded-lg border border-line bg-raised px-3 py-2 text-sm"
                />
                <button
                  type="submit"
                  className="rounded-lg border border-line px-4 py-2 text-sm text-muted hover:border-danger hover:text-danger"
                >
                  Descartar
                </button>
              </form>
              <p className="mt-2 text-xs text-faint">
                Si el dato fuente está mal (p. ej. una asistencia sin registrar),
                corrígelo también en su origen para que la señal no reaparezca.
              </p>
            </Card>
          </details>
        </section>
      )}

      {!isOpen && (
        <p className="text-sm text-muted">
          Caso cerrado el {caseRow.closed_at ? dateTime(caseRow.closed_at) : "—"}
          {caseRow.closed_reason && ` · ${RESULT_LABEL[caseRow.closed_reason] ?? caseRow.closed_reason}`}
        </p>
      )}
    </div>
  );
}
