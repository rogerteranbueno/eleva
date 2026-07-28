"use client";

import { useState } from "react";
import { createPost } from "@/app/actions/member";
import { POST_TYPES, type PostTypeDef } from "@/modules/community/postTypes";

/** Composer en 2 pasos (patrón Creania): elegir tipo → formulario dinámico. */
export function Composer({
  cohortId,
  authorName,
  isTeam,
}: {
  cohortId: string;
  authorName: string;
  isTeam: boolean;
}) {
  const [selected, setSelected] = useState<PostTypeDef | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const available = POST_TYPES.filter((t) => !t.teamOnly || isTeam);

  if (!selected) {
    return (
      <div className="rounded-(--radius-card) border border-line bg-surface p-5">
        <p className="text-sm text-muted">
          ¿Qué quieres compartir con tu generación, {authorName}?
        </p>
        <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
          {available.map((t) => (
            <button
              key={t.kind}
              onClick={() => setSelected(t)}
              className="rounded-xl border border-line bg-raised px-3 py-3 text-left transition-colors hover:border-accent"
            >
              <p className="text-sm font-semibold">
                <span aria-hidden className="mr-1.5">{t.emoji}</span>
                {t.label}
              </p>
              <p className="mt-0.5 text-xs leading-snug text-faint">{t.desc}</p>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-(--radius-card) border border-accent/30 bg-surface p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold">
          <span aria-hidden className="mr-1.5">{selected.emoji}</span>
          {selected.label}
        </p>
        <button
          onClick={() => setSelected(null)}
          className="text-xs text-faint hover:text-muted"
        >
          ← Cambiar tipo
        </button>
      </div>
      <form
        action={async (formData) => {
          setSubmitting(true);
          try {
            await createPost(formData);
            setSelected(null);
          } finally {
            setSubmitting(false);
          }
        }}
        className="mt-3 space-y-3"
      >
        <input type="hidden" name="cohortId" value={cohortId} />
        <input type="hidden" name="kind" value={selected.kind} />
        {selected.fields.map((f) => (
          <div key={f.key}>
            <label htmlFor={`field_${f.key}`} className="block text-xs font-medium text-muted">
              {f.label}
              {f.required && <span className="text-danger"> *</span>}
            </label>
            <input
              id={`field_${f.key}`}
              name={`field_${f.key}`}
              type="text"
              required={f.required}
              placeholder={f.placeholder}
              className="mt-1 w-full rounded-lg border border-line bg-raised px-3 py-2 text-sm placeholder:text-faint"
            />
          </div>
        ))}
        <div>
          <label htmlFor="body" className="sr-only">Tu publicación</label>
          <textarea
            id="body"
            name="body"
            rows={3}
            required
            placeholder={selected.bodyPlaceholder}
            className="w-full rounded-lg border border-line bg-raised px-3 py-2 text-sm leading-relaxed placeholder:text-faint"
          />
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={submitting}
            className="rounded-lg bg-accent px-5 py-2 text-sm font-semibold text-[#0b0a12] hover:opacity-90 disabled:opacity-50"
          >
            {submitting ? "Publicando…" : "Compartir"}
          </button>
        </div>
      </form>
    </div>
  );
}
