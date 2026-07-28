import { requireMember } from "@/lib/context";
import { createUserClient } from "@/lib/supabase/server";
import { updateMyProfile } from "@/app/actions/member";
import { Card, SectionTitle, Avatar } from "@/components/ui";
import { dateShort } from "@/lib/format";

export const dynamic = "force-dynamic";

const LOOKING_FOR_OPTIONS = [
  "buddy de accountability",
  "amigos",
  "mentores",
  "socios",
  "clientes",
  "networking en mi ciudad",
];

export default async function MiPerfilPage() {
  const ctx = await requireMember();
  const supabase = await createUserClient();

  const [{ data: me }, { data: recognitions }] = await Promise.all([
    supabase
      .from("people")
      .select("full_name, declaration, looking_for")
      .eq("id", ctx.personId)
      .single(),
    supabase
      .from("recognitions")
      .select("text, impact, created_at, people:from_person_id(full_name)")
      .eq("to_person_id", ctx.personId)
      .order("created_at", { ascending: false }),
  ]);

  const lookingFor = new Set(me?.looking_for ?? []);

  return (
    <div className="space-y-8 max-w-2xl">
      <header className="flex items-center gap-4">
        <Avatar name={ctx.personName} size={56} />
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{ctx.personName}</h1>
          <p className="mt-0.5 text-sm text-muted">{ctx.organizationName}</p>
        </div>
      </header>

      <section aria-label="Mi declaración">
        <SectionTitle>Mi perfil</SectionTitle>
        <Card>
          <form action={updateMyProfile} className="space-y-4">
            <div>
              <label htmlFor="declaration" className="block text-sm font-medium">
                Estoy creando…
              </label>
              <textarea
                id="declaration"
                name="declaration"
                rows={2}
                defaultValue={me?.declaration ?? ""}
                placeholder="La vida, el proyecto o el cambio que estás creando"
                className="mt-1 w-full rounded-lg border border-line bg-raised px-3 py-2 text-sm leading-relaxed placeholder:text-faint"
              />
              <p className="mt-1 text-xs text-faint">
                Tu declaración es visible para tu generación. Escríbela en presente.
              </p>
            </div>
            <fieldset>
              <legend className="text-sm font-medium">Busco</legend>
              <div className="mt-2 flex flex-wrap gap-2">
                {LOOKING_FOR_OPTIONS.map((option) => (
                  <label
                    key={option}
                    className="cursor-pointer rounded-full border border-line px-3 py-1 text-xs text-muted transition-colors has-checked:border-aqua has-checked:bg-aqua-soft has-checked:text-aqua hover:text-foreground"
                  >
                    <input
                      type="checkbox"
                      name="lookingFor"
                      value={option}
                      defaultChecked={lookingFor.has(option)}
                      className="sr-only"
                    />
                    {option}
                  </label>
                ))}
              </div>
            </fieldset>
            <button
              type="submit"
              className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-[#0b0a12] hover:opacity-90"
            >
              Guardar perfil
            </button>
          </form>
        </Card>
      </section>

      <section aria-label="Mis reconocimientos">
        <SectionTitle>
          Reconocimientos que he recibido <span aria-hidden>🏅</span>
        </SectionTitle>
        {(recognitions ?? []).length === 0 ? (
          <p className="text-sm text-muted">
            Todavía no recibes reconocimientos. Llegan solos cuando tu grupo ve
            tus acciones.
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
    </div>
  );
}
