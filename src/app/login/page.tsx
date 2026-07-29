import { redirect } from "next/navigation";
import { getSessionContext, teamHome } from "@/lib/context";
import { LoginForm } from "./LoginForm";
import { DemoAccounts } from "./DemoAccounts";

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
        <DemoAccounts />
      </main>
    </div>
  );
}
