"use client";

import { useState } from "react";
import { createPostInSpace } from "@/app/actions/community";
import { POST_TYPES, type PostTypeDef } from "@/modules/community/postTypes";

/**
 * Composer compacto.
 *
 * La auditoría encontró que las ocho tarjetas de tipo ocupaban la primera
 * pantalla completa en móvil: se entraba a la comunidad y se veía un
 * formulario, no una conversación. Ahora el composer es UNA línea que se
 * expande, y los tipos viven dentro.
 */
export function Composer({
  spaceId,
  spaceName,
  authorName,
  isTeam,
}: {
  spaceId: string;
  spaceName: string;
  authorName: string;
  isTeam: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<PostTypeDef | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const available = POST_TYPES.filter((t) => !t.teamOnly || isTeam);

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="flex w-full items-center gap-3 rounded-(--radius-card) border border-line bg-surface px-4 py-3 text-left text-sm text-faint transition-colors hover:border-line-strong hover:bg-raised"
      >
        <span
          aria-hidden
          className="flex size-8 shrink-0 items-center justify-center rounded-full bg-accent-soft text-accent-strong"
        >
          +
        </span>
        Comparte algo con {spaceName}, {authorName}…
      </button>
    );
  }

  return (
    <div className="rounded-(--radius-card) border border-line bg-surface p-4">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-medium">
          {selected ? (
            <>
              <span aria-hidden>{selected.emoji}</span> {selected.label}
            </>
          ) : (
            "¿Qué quieres compartir?"
          )}
        </p>
        <button
          onClick={() => {
            setOpen(false);
            setSelected(null);
          }}
          className="text-xs text-faint hover:text-muted"
        >
          Cancelar
        </button>
      </div>

      {/* La audiencia SIEMPRE visible antes de publicar. */}
      <p className="mt-1 text-xs text-muted">
        Se publica en <strong className="text-foreground">{spaceName}</strong>. Solo quien
        pertenece a ese espacio lo verá.
      </p>

      {!selected ? (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {available.map((t) => (
            <button
              key={t.kind}
              onClick={() => setSelected(t)}
              title={t.desc}
              className="rounded-full border border-line px-3 py-1.5 text-xs text-muted transition-colors hover:border-accent hover:text-accent-strong"
            >
              <span aria-hidden>{t.emoji}</span> {t.label}
            </button>
          ))}
        </div>
      ) : (
        <form
          action={createPostInSpace}
          onSubmit={() => setSubmitting(true)}
          className="mt-3 space-y-3"
        >
          <input type="hidden" name="spaceId" value={spaceId} />
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
                required={f.required}
                placeholder={f.placeholder}
                className="mt-1 w-full rounded-lg border border-line bg-raised px-3 py-2 text-sm placeholder:text-faint"
              />
            </div>
          ))}

          <div>
            <label htmlFor="composer-body" className="sr-only">
              Tu publicación
            </label>
            <textarea
              id="composer-body"
              name="body"
              rows={3}
              required
              autoFocus
              placeholder={selected.bodyPlaceholder}
              className="w-full rounded-lg border border-line bg-raised px-3 py-2 text-sm leading-relaxed placeholder:text-faint"
            />
            <p className="mt-1 text-[11px] text-faint">
              Escribe @ y un nombre para mencionar a alguien.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="submit"
              disabled={submitting}
              className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-[#0b0a12] hover:opacity-90 disabled:opacity-50"
            >
              {submitting ? "Publicando…" : "Compartir"}
            </button>
            <button
              type="button"
              onClick={() => setSelected(null)}
              className="text-xs text-faint hover:text-muted"
            >
              ← Cambiar tipo
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
