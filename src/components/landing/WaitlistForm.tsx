"use client";

import { useState } from "react";
import { joinRedElevaWaitlist } from "@/app/actions/public";

/**
 * Lista de espera de Red ELEVA. Cliente porque necesita mostrar el estado
 * "gracias" sin recargar — pero nunca finge que el registro abre acceso: solo
 * registra intención (doc 19 §16, gates de Global).
 */
export function WaitlistForm() {
  const [role, setRole] = useState<"dirijo_centro" | "persona_entrenada">("dirijo_centro");
  const [state, setState] = useState<"idle" | "submitting" | "done" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="glass rounded-2xl p-7 md:p-8 max-w-md mx-auto">
      {state === "done" ? (
        <div className="text-center py-6">
          <p className="text-2xl mb-2">✦</p>
          <p className="text-lg font-bold text-foreground">Tu lugar quedó registrado.</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Te escribiremos cuando Red ELEVA abra su beta cerrada. Esto no crea ninguna cuenta
            todavía — solo tu intención de estar ahí.
          </p>
        </div>
      ) : (
        <form
          action={async (formData) => {
            setState("submitting");
            setError(null);
            const res = await joinRedElevaWaitlist(formData);
            if (res.ok) setState("done");
            else {
              setState("error");
              setError(res.error ?? "Algo salió mal.");
            }
          }}
          className="space-y-4"
        >
          <div>
            <label className="text-xs font-semibold text-foreground/70 uppercase tracking-wide">
              Quién eres
            </label>
            <div className="mt-2 flex gap-2">
              {(
                [
                  ["dirijo_centro", "Dirijo un centro"],
                  ["persona_entrenada", "Soy persona entrenada"],
                ] as const
              ).map(([value, label]) => (
                <button
                  type="button"
                  key={value}
                  onClick={() => setRole(value)}
                  className={`flex-1 rounded-lg border px-3 py-2 text-xs font-semibold transition-colors ${
                    role === value
                      ? "border-violet-500/50 bg-violet-500/15 text-violet-200"
                      : "border-border text-muted-foreground hover:border-violet-500/30"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
            <input type="hidden" name="role" value={role} />
          </div>

          <div>
            <label htmlFor="fullName" className="text-xs font-semibold text-foreground/70 uppercase tracking-wide">
              Nombre
            </label>
            <input
              id="fullName"
              name="fullName"
              required
              className="mt-1.5 w-full rounded-lg border border-border bg-background/40 px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50"
              placeholder="Tu nombre completo"
            />
          </div>

          <div>
            <label htmlFor="email" className="text-xs font-semibold text-foreground/70 uppercase tracking-wide">
              Correo
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="mt-1.5 w-full rounded-lg border border-border bg-background/40 px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50"
              placeholder="tu@correo.com"
            />
          </div>

          {role === "dirijo_centro" && (
            <div>
              <label htmlFor="centerName" className="text-xs font-semibold text-foreground/70 uppercase tracking-wide">
                Centro <span className="normal-case font-normal">(opcional)</span>
              </label>
              <input
                id="centerName"
                name="centerName"
                className="mt-1.5 w-full rounded-lg border border-border bg-background/40 px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50"
                placeholder="Nombre de tu centro"
              />
            </div>
          )}

          <div>
            <label htmlFor="message" className="text-xs font-semibold text-foreground/70 uppercase tracking-wide">
              Por qué te interesa <span className="normal-case font-normal">(opcional)</span>
            </label>
            <textarea
              id="message"
              name="message"
              rows={2}
              className="mt-1.5 w-full rounded-lg border border-border bg-background/40 px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50"
              placeholder="Cuéntanos brevemente…"
            />
          </div>

          {error && <p className="text-xs text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={state === "submitting"}
            className="w-full px-5 py-3 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white rounded-xl text-sm font-bold transition-colors"
          >
            {state === "submitting" ? "Guardando…" : "Unirme a la lista de espera"}
          </button>
          <p className="text-[11px] text-muted-foreground/70 text-center leading-relaxed">
            Esto no abre acceso ni crea una cuenta. Red ELEVA sigue cerrada hasta cumplir sus
            criterios de comunidad y seguridad.
          </p>
        </form>
      )}
    </div>
  );
}
