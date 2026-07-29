import Link from "next/link";
import { requireMember } from "@/lib/context";
import { createUserClient, createServiceClient } from "@/lib/supabase/server";
import { updateMyCenterProfile } from "@/app/actions/community";
import { Card, SectionTitle, Avatar, Badge } from "@/components/ui";
import { dateShort, plural } from "@/lib/format";

export const dynamic = "force-dynamic";

const LOOKING_FOR = [
  "socios",
  "clientes",
  "mentoría",
  "trabajo",
  "acompañamiento",
  "colaboración",
];

const VISIBILITY = [
  { value: "centro", label: "Todo el centro" },
  { value: "generacion", label: "Solo mi generación" },
  { value: "privado", label: "Solo yo" },
];

/** Campo con su propia audiencia: la privacidad se decide por bloque, no de
 *  una sola vez para todo el perfil. */
function FieldVisibility({ field, current }: { field: string; current: string }) {
  return (
    <select
      name={`vis_${field}`}
      defaultValue={current}
      aria-label={`Quién puede ver este campo`}
      className="rounded-md border border-line bg-raised px-2 py-1 text-[11px] text-muted"
    >
      {VISIBILITY.map((v) => (
        <option key={v.value} value={v.value}>
          {v.label}
        </option>
      ))}
    </select>
  );
}

export default async function MiPerfilPage() {
  const ctx = await requireMember();
  const supabase = await createUserClient();

  const { data: me } = await supabase
    .from("people")
    .select(
      "id, full_name, preferred_name, email, phone, declaration, bio, city, interests, skills, offers, looking_for, available_to_serve, accepts_messages"
    )
    .eq("id", ctx.personId)
    .single();

  const service = createServiceClient();
  const [{ data: visibility }, { data: recognitions }, { data: blocked }, { data: saved }] =
    await Promise.all([
      service.from("profile_field_visibility").select("field, visibility").eq("person_id", ctx.personId),
      supabase
        .from("recognitions")
        .select("text, impact, created_at, people:from_person_id(full_name)")
        .eq("to_person_id", ctx.personId)
        .order("created_at", { ascending: false }),
      supabase
        .from("blocks")
        .select("id, people:blocked_person_id(id, full_name)")
        .eq("blocker_person_id", ctx.personId),
      supabase
        .from("saved_posts")
        .select("post_id, posts(id, body, people:author_person_id(full_name))")
        .eq("person_id", ctx.personId)
        .limit(5),
    ]);

  const visOf = (field: string) =>
    (visibility ?? []).find((v) => v.field === field)?.visibility ?? "centro";

  return (
    <div className="space-y-8 max-w-2xl">
      <header className="flex items-center gap-4">
        <Avatar name={me?.full_name ?? ctx.personName} size={56} />
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{me?.full_name}</h1>
          <p className="text-sm text-muted">
            Tu perfil en {ctx.organizationName}. Tú decides qué se ve y quién lo ve.
          </p>
        </div>
      </header>

      <form action={updateMyCenterProfile} className="space-y-5">
        <Card className="space-y-4">
          <div>
            <div className="flex items-center justify-between gap-2">
              <label htmlFor="declaration" className="text-sm font-medium">
                Tu declaración
              </label>
              <FieldVisibility field="declaration" current={visOf("declaration")} />
            </div>
            <textarea
              id="declaration"
              name="declaration"
              rows={2}
              defaultValue={me?.declaration ?? ""}
              placeholder="Estoy creando…"
              className="mt-1 w-full rounded-lg border border-line bg-raised px-3 py-2 text-sm"
            />
          </div>

          <div>
            <div className="flex items-center justify-between gap-2">
              <label htmlFor="bio" className="text-sm font-medium">
                Sobre ti
              </label>
              <FieldVisibility field="bio" current={visOf("bio")} />
            </div>
            <textarea
              id="bio"
              name="bio"
              rows={3}
              defaultValue={me?.bio ?? ""}
              placeholder="Quién eres, qué haces, qué te trajo aquí…"
              className="mt-1 w-full rounded-lg border border-line bg-raised px-3 py-2 text-sm"
            />
          </div>

          <div>
            <div className="flex items-center justify-between gap-2">
              <label htmlFor="city" className="text-sm font-medium">
                Ciudad
              </label>
              <FieldVisibility field="city" current={visOf("city")} />
            </div>
            <input
              id="city"
              name="city"
              defaultValue={me?.city ?? ""}
              placeholder="Dónde vives"
              className="mt-1 w-full rounded-lg border border-line bg-raised px-3 py-2 text-sm"
            />
          </div>
        </Card>

        <Card className="space-y-4">
          <p className="text-sm font-medium">Para que te encuentren</p>
          {[
            { key: "interests", label: "Intereses", ph: "montañismo, escritura, nutrición" },
            { key: "skills", label: "Habilidades", ph: "ventas, diseño, finanzas" },
            { key: "offers", label: "Qué ofreces", ph: "mentoría a quien entra al Básico" },
          ].map((f) => (
            <div key={f.key}>
              <div className="flex items-center justify-between gap-2">
                <label htmlFor={f.key} className="text-sm">
                  {f.label} <span className="text-faint">(separa con comas)</span>
                </label>
                <FieldVisibility field={f.key} current={visOf(f.key)} />
              </div>
              <input
                id={f.key}
                name={f.key}
                defaultValue={(me?.[f.key as "interests"] ?? []).join(", ")}
                placeholder={f.ph}
                className="mt-1 w-full rounded-lg border border-line bg-raised px-3 py-2 text-sm"
              />
            </div>
          ))}

          <fieldset>
            <legend className="text-sm">Qué buscas</legend>
            <div className="mt-1.5 flex flex-wrap gap-2">
              {LOOKING_FOR.map((l) => (
                <label
                  key={l}
                  className="cursor-pointer rounded-full border border-line px-3 py-1.5 text-xs text-muted has-checked:border-accent has-checked:bg-accent-soft has-checked:text-accent-strong"
                >
                  <input
                    type="checkbox"
                    name="lookingFor"
                    value={l}
                    defaultChecked={(me?.looking_for ?? []).includes(l)}
                    className="sr-only"
                  />
                  {l}
                </label>
              ))}
            </div>
          </fieldset>

          <label className="flex items-center gap-2.5 text-sm">
            <input
              type="checkbox"
              name="availableToServe"
              defaultChecked={me?.available_to_serve ?? false}
              className="size-4 rounded border-line"
            />
            Estoy disponible para servir en una próxima generación
          </label>
        </Card>

        <Card className="space-y-3">
          <p className="text-sm font-medium">Quién puede escribirte</p>
          <div className="space-y-2">
            {[
              { value: "centro", label: "Cualquier persona de mi centro" },
              { value: "conexiones", label: "Solo mis conexiones (el resto envía solicitud)" },
              { value: "nadie", label: "Nadie por ahora" },
            ].map((o) => (
              <label key={o.value} className="flex items-center gap-2.5 text-sm">
                <input
                  type="radio"
                  name="acceptsMessages"
                  value={o.value}
                  defaultChecked={(me?.accepts_messages ?? "centro") === o.value}
                  className="size-4"
                />
                {o.label}
              </label>
            ))}
          </div>
          <p className="text-xs text-faint">
            Tus mensajes directos son privados: el equipo de tu centro no puede leerlos.
          </p>
        </Card>

        <button
          type="submit"
          className="rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-[#0b0a12] hover:opacity-90"
        >
          Guardar mi perfil
        </button>
      </form>

      {(recognitions ?? []).length > 0 && (
        <section aria-label="Reconocimientos">
          <SectionTitle>
            Reconocimientos <span aria-hidden className="text-gold">🏅</span>
          </SectionTitle>
          <ul className="space-y-3">
            {(recognitions ?? []).map((r, i) => (
              <li key={i}>
                <Card className="!py-4 border-gold/25">
                  <p className="text-sm leading-relaxed">“{r.text}”</p>
                  {r.impact && (
                    <p className="mt-1.5 text-sm text-muted italic">El impacto: {r.impact}</p>
                  )}
                  <p className="mt-2 text-xs text-faint">
                    — {r.people?.full_name} · {dateShort(r.created_at)}
                  </p>
                </Card>
              </li>
            ))}
          </ul>
        </section>
      )}

      {(saved ?? []).length > 0 && (
        <section aria-label="Guardados">
          <SectionTitle>Guardados</SectionTitle>
          <ul className="space-y-2">
            {(saved ?? []).map((s) => (
              <li key={s.post_id}>
                <Link
                  href={`/mi/comunidad/p/${s.post_id}`}
                  className="block rounded-(--radius-card) border border-line bg-surface px-4 py-3 text-sm hover:bg-raised"
                >
                  <span className="text-faint">{s.posts?.people?.full_name}: </span>
                  <span className="line-clamp-2 text-muted">{s.posts?.body}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {(blocked ?? []).length > 0 && (
        <section aria-label="Personas bloqueadas">
          <SectionTitle>{plural((blocked ?? []).length, "persona bloqueada", "personas bloqueadas")}</SectionTitle>
          <ul className="flex flex-wrap gap-2">
            {(blocked ?? []).map((b) => (
              <li key={b.id}>
                <Badge variant="neutral">{b.people?.full_name}</Badge>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
