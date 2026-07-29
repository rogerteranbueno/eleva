import Link from "next/link";
import { requireTeam, teamHome } from "@/lib/context";
import { roleLabel } from "@/lib/format";

export const dynamic = "force-dynamic";

/** Destino honesto cuando falta la capacidad: explica el límite en vez de
 *  fingir que la página no existe, y devuelve a la persona a su trabajo. */
export default async function SinAccesoPage() {
  const ctx = await requireTeam();
  return (
    <div className="mx-auto max-w-lg space-y-4 py-16 text-center">
      <p className="text-4xl" aria-hidden>
        🔒
      </p>
      <h1 className="text-2xl font-bold tracking-tight">Esta vista no es de tu rol</h1>
      <p className="text-sm text-muted">
        Tu acceso en {ctx.organizationName} es{" "}
        <strong className="text-foreground">{ctx.roles.map(roleLabel).join(" · ")}</strong>. En ELEVA
        cada rol ve exactamente lo que necesita para su trabajo: no es una restricción de
        confianza, es cómo se protege la información de las personas del centro.
      </p>
      <p className="text-sm text-muted">
        Si necesitas esta vista, pídele a Dirección que ajuste tu asignación.
      </p>
      <Link
        href={teamHome(ctx)}
        className="inline-block rounded-lg bg-accent px-5 py-2 text-sm font-semibold text-[#0b0a12] hover:opacity-90"
      >
        Volver a mi trabajo
      </Link>
    </div>
  );
}
