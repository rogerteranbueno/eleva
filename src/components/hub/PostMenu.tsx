"use client";

import { useState } from "react";
import { editPost, deletePost, toggleSavePost, reportContent } from "@/app/actions/community";

const REASONS = [
  { value: "acoso", label: "Acoso o trato hostil" },
  { value: "spam", label: "Spam o promoción" },
  { value: "contenido_inapropiado", label: "Contenido inapropiado" },
  { value: "historia_de_tercero", label: "Cuenta la historia de otra persona" },
  { value: "seguridad", label: "Me preocupa su seguridad" },
  { value: "otro", label: "Otro motivo" },
];

/** Menú de una publicación: guardar, editar, eliminar y reportar.
 *  Reportar existe para TODAS, incluida la propia comunidad: una red sin
 *  forma de decir "esto no está bien" no es un lugar seguro. */
export function PostMenu({
  postId,
  isAuthor,
  saved,
  body,
}: {
  postId: string;
  isAuthor: boolean;
  saved: boolean;
  body: string;
}) {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"menu" | "editar" | "reportar">("menu");

  return (
    <div className="relative shrink-0">
      <button
        onClick={() => {
          setOpen((o) => !o);
          setMode("menu");
        }}
        aria-label="Opciones de la publicación"
        aria-expanded={open}
        className="rounded-md px-2 py-1 text-faint hover:bg-raised hover:text-foreground"
      >
        ···
      </button>

      {open && (
        <div className="absolute right-0 top-8 z-20 w-72 rounded-xl border border-line bg-surface p-2 shadow-lg">
          {mode === "menu" && (
            <ul className="text-sm">
              <li>
                <form action={toggleSavePost}>
                  <input type="hidden" name="postId" value={postId} />
                  <button
                    type="submit"
                    className="w-full rounded-lg px-3 py-2 text-left hover:bg-raised"
                  >
                    {saved ? "Quitar de guardados" : "Guardar"}
                  </button>
                </form>
              </li>
              <li>
                <button
                  onClick={() => {
                    navigator.clipboard?.writeText(
                      `${window.location.origin}/mi/comunidad/p/${postId}`
                    );
                    setOpen(false);
                  }}
                  className="w-full rounded-lg px-3 py-2 text-left hover:bg-raised"
                >
                  Copiar enlace
                </button>
              </li>
              {isAuthor && (
                <>
                  <li>
                    <button
                      onClick={() => setMode("editar")}
                      className="w-full rounded-lg px-3 py-2 text-left hover:bg-raised"
                    >
                      Editar
                    </button>
                  </li>
                  <li>
                    <form action={deletePost}>
                      <input type="hidden" name="postId" value={postId} />
                      <button
                        type="submit"
                        className="w-full rounded-lg px-3 py-2 text-left text-danger hover:bg-danger-soft"
                      >
                        Eliminar
                      </button>
                    </form>
                  </li>
                </>
              )}
              {!isAuthor && (
                <li>
                  <button
                    onClick={() => setMode("reportar")}
                    className="w-full rounded-lg px-3 py-2 text-left text-muted hover:bg-raised"
                  >
                    Reportar
                  </button>
                </li>
              )}
            </ul>
          )}

          {mode === "editar" && (
            <form action={editPost} className="space-y-2 p-1">
              <input type="hidden" name="postId" value={postId} />
              <label htmlFor={`edit-${postId}`} className="text-xs font-medium">
                Editar publicación
              </label>
              <textarea
                id={`edit-${postId}`}
                name="body"
                defaultValue={body}
                rows={4}
                className="w-full rounded-lg border border-line bg-raised px-2.5 py-2 text-sm"
              />
              <p className="text-[11px] text-faint">
                Quedará marcada como editada. Cambiar de espacio no es editar: para eso
                se publica de nuevo.
              </p>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 rounded-lg bg-accent px-3 py-1.5 text-xs font-semibold text-[#0b0a12]"
                >
                  Guardar
                </button>
                <button
                  type="button"
                  onClick={() => setMode("menu")}
                  className="rounded-lg border border-line px-3 py-1.5 text-xs text-muted"
                >
                  Cancelar
                </button>
              </div>
            </form>
          )}

          {mode === "reportar" && (
            <form action={reportContent} className="space-y-2 p-1">
              <input type="hidden" name="targetKind" value="post" />
              <input type="hidden" name="targetId" value={postId} />
              <label htmlFor={`reason-${postId}`} className="text-xs font-medium">
                ¿Qué está pasando?
              </label>
              <select
                id={`reason-${postId}`}
                name="reason"
                required
                defaultValue=""
                className="w-full rounded-lg border border-line bg-raised px-2.5 py-2 text-sm"
              >
                <option value="" disabled>
                  Elige un motivo…
                </option>
                {REASONS.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.label}
                  </option>
                ))}
              </select>
              <input
                name="detail"
                placeholder="Cuéntanos más (opcional)"
                className="w-full rounded-lg border border-line bg-raised px-2.5 py-2 text-sm"
              />
              <p className="text-[11px] text-faint">
                Lo revisa el equipo de tu centro. Tu reporte no es anónimo para ellos, y
                la persona reportada no sabe quién lo envió.
              </p>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 rounded-lg bg-accent px-3 py-1.5 text-xs font-semibold text-[#0b0a12]"
                >
                  Enviar reporte
                </button>
                <button
                  type="button"
                  onClick={() => setMode("menu")}
                  className="rounded-lg border border-line px-3 py-1.5 text-xs text-muted"
                >
                  Cancelar
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
