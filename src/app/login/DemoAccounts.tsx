"use client";

import { ArrowRight } from "lucide-react";

const DEMO_ACCOUNTS = [
  { role: "Dirección", email: "duena@aurora.demo" },
  { role: "Oficinas", email: "oficinas@aurora.demo" },
  { role: "Participante", email: "participante@aurora.demo" },
];

const DEMO_PASSWORD = "ElevaDemo2026!";

export function DemoAccounts() {
  const handleDemoLogin = (email: string) => {
    const emailInput = document.getElementById("email") as HTMLInputElement;
    const passwordInput = document.getElementById("password") as HTMLInputElement;
    const submitButton = document.querySelector('button[type="submit"]') as HTMLButtonElement;

    if (emailInput && passwordInput && submitButton) {
      emailInput.value = email;
      passwordInput.value = DEMO_PASSWORD;
      emailInput.dispatchEvent(new Event("change", { bubbles: true }));
      passwordInput.dispatchEvent(new Event("change", { bubbles: true }));
      setTimeout(() => submitButton.click(), 0);
    }
  };

  return (
    <section className="mt-8 rounded-(--radius-card) border border-line bg-surface p-4">
      <h2 className="text-xs font-semibold uppercase tracking-wider text-muted">
        Ambiente demo · Centro Aurora
      </h2>
      <p className="mt-1 text-xs text-faint">
        Datos 100% sintéticos. Elige un perfil para entrar:
      </p>

      <ul className="mt-4 space-y-2">
        {DEMO_ACCOUNTS.map(({ role, email }) => (
          <li key={email}>
            <button
              onClick={() => handleDemoLogin(email)}
              className="w-full flex items-center justify-between p-3 rounded-lg bg-surface-2 border border-line hover:border-violet-500/40 hover:bg-surface-3 transition-all"
            >
              <div className="text-left">
                <p className="text-xs text-faint">{role}</p>
                <code className="text-sm text-foreground font-mono">{email}</code>
              </div>
              <ArrowRight className="w-4 h-4 text-muted shrink-0 ml-2" />
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
