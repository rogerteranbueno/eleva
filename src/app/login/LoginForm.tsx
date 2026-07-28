"use client";

import { useActionState } from "react";
import { signIn, type AuthState } from "@/app/actions/auth";

export function LoginForm() {
  const [state, action, pending] = useActionState<AuthState, FormData>(
    signIn,
    {}
  );

  return (
    <form action={action} className="mt-8 space-y-4">
      <div>
        <label htmlFor="email" className="block text-sm font-medium">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          className="mt-1 w-full rounded-lg border border-line bg-raised px-3 py-2.5 text-sm placeholder:text-faint focus:border-accent"
          placeholder="tu@centro.com"
        />
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-medium">
          Contraseña
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="mt-1 w-full rounded-lg border border-line bg-raised px-3 py-2.5 text-sm focus:border-accent"
        />
      </div>
      {state.error && (
        <p role="alert" className="rounded-lg bg-danger-soft px-3 py-2 text-sm text-danger">
          {state.error}
        </p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-[#0b0a12] transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {pending ? "Entrando…" : "Entrar"}
      </button>
    </form>
  );
}
