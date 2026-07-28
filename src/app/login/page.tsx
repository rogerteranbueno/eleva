import { redirect } from "next/navigation";
import { getSessionContext, teamHome } from "@/lib/context";
import { LoginForm } from "./LoginForm";

export default async function LoginPage() {
  const ctx = await getSessionContext();
  if (ctx) redirect(teamHome(ctx));

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-4 py-10">
      <main className="w-full max-w-sm">
        <p className="text-center text-3xl font-bold tracking-tight">
          ELEVA<span className="text-accent">.</span>
        </p>
        <p className="mt-2 text-center text-sm text-muted">
          El sistema de tu centro: operación, decisión y comunidad.
        </p>
        <LoginForm />
        <section className="mt-8 rounded-(--radius-card) border border-line bg-surface p-4">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-muted">
            Ambiente demo · Centro Aurora
          </h2>
          <p className="mt-1 text-xs text-faint">
            Datos 100% sintéticos. Contraseña para todas las cuentas:{" "}
            <code className="text-muted">ElevaDemo2026!</code>
          </p>
          <ul className="mt-3 space-y-1.5 text-sm">
            <li>
              <span className="text-faint">Dirección · </span>
              <code>duena@aurora.demo</code>
            </li>
            <li>
              <span className="text-faint">Oficinas · </span>
              <code>oficinas@aurora.demo</code>
            </li>
            <li>
              <span className="text-faint">Participante · </span>
              <code>participante@aurora.demo</code>
            </li>
          </ul>
        </section>
      </main>
    </div>
  );
}
