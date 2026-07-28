"use client";

import { useState, useTransition } from "react";
import { generateAIDraft } from "@/app/actions/cases";

/** Borrador editable con opción de generarlo con IA. El humano siempre
 *  decide si lo envía y cómo; el sistema no contacta a nadie. */
export function DraftField({
  caseId,
  defaultValue,
  aiAvailable,
}: {
  caseId: string;
  defaultValue: string;
  aiAvailable: boolean;
}) {
  const [value, setValue] = useState(defaultValue);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleGenerate() {
    setError(null);
    startTransition(async () => {
      try {
        const channelSelect = document.getElementById(
          "channel"
        ) as HTMLSelectElement | null;
        const draft = await generateAIDraft(
          caseId,
          channelSelect?.value ?? "whatsapp"
        );
        if (draft) {
          setValue(draft);
        } else {
          setError("La IA no está disponible ahora; edita la plantilla.");
        }
      } catch {
        setError("No se pudo generar el borrador. Intenta de nuevo.");
      }
    });
  }

  return (
    <div>
      <div className="flex items-center justify-between gap-2">
        <label htmlFor="draftMessage" className="block text-sm font-medium">
          Borrador del mensaje{" "}
          <span className="font-normal text-faint">
            — tú decides si lo envías y cómo; el sistema no contacta a nadie
          </span>
        </label>
        {aiAvailable && (
          <button
            type="button"
            onClick={handleGenerate}
            disabled={pending}
            className="shrink-0 rounded-lg bg-accent-soft px-3 py-1 text-xs font-semibold text-accent-strong hover:bg-accent/25 disabled:opacity-50"
          >
            {pending ? "Generando…" : "✦ Borrador con IA"}
          </button>
        )}
      </div>
      <textarea
        id="draftMessage"
        name="draftMessage"
        rows={4}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="mt-1 w-full rounded-lg border border-line bg-raised px-3 py-2 text-sm leading-relaxed"
      />
      {error && <p className="mt-1 text-xs text-danger">{error}</p>}
    </div>
  );
}
