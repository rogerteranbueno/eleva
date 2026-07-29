"use client";

import { useState } from "react";
import {
  toggleFollow,
  requestConnection,
  startConversation,
  blockPerson,
} from "@/app/actions/community";

/**
 * Relación con otra persona.
 *
 * Seguir, conectar y escribir son actos distintos, con consecuencias distintas:
 * seguir es unilateral, conectar requiere aceptación, y escribir depende de lo
 * que la otra persona haya decidido en su perfil. Bloquear deshace todo.
 */
export function RelationBar({
  personId,
  personName,
  following,
  connected,
  requestPending,
  acceptsMessages,
}: {
  personId: string;
  personName: string;
  following: boolean;
  connected: boolean;
  requestPending: boolean;
  acceptsMessages: string;
}) {
  const [panel, setPanel] = useState<"none" | "mensaje" | "conectar" | "bloquear">("none");

  const puedeEscribir = connected || acceptsMessages === "centro";
  const escribirLabel = puedeEscribir ? "Enviar mensaje" : "Solicitar mensaje";

  return (
    <div className="rounded-(--radius-card) border border-line bg-surface p-4">
      <div className="flex flex-wrap gap-2">
        <form action={toggleFollow}>
          <input type="hidden" name="personId" value={personId} />
          <button
            type="submit"
            className={`rounded-lg border px-3.5 py-1.5 text-sm transition-colors ${
              following
                ? "border-accent bg-accent-soft text-accent-strong"
                : "border-line text-muted hover:border-accent hover:text-accent-strong"
            }`}
          >
            {following ? "Siguiendo" : "Seguir"}
          </button>
        </form>

        {connected ? (
          <span className="rounded-lg border border-ok/40 bg-ok-soft px-3.5 py-1.5 text-sm text-ok">
            Conectados
          </span>
        ) : requestPending ? (
          <span className="rounded-lg border border-line px-3.5 py-1.5 text-sm text-faint">
            Solicitud enviada
          </span>
        ) : (
          <button
            onClick={() => setPanel(panel === "conectar" ? "none" : "conectar")}
            className="rounded-lg border border-line px-3.5 py-1.5 text-sm text-muted hover:border-accent hover:text-accent-strong"
          >
            Conectar
          </button>
        )}

        {acceptsMessages === "nadie" ? (
          <span className="rounded-lg px-3.5 py-1.5 text-sm text-faint">
            No recibe mensajes
          </span>
        ) : (
          <button
            onClick={() => setPanel(panel === "mensaje" ? "none" : "mensaje")}
            className="rounded-lg border border-line px-3.5 py-1.5 text-sm text-muted hover:border-accent hover:text-accent-strong"
          >
            {escribirLabel}
          </button>
        )}

        <button
          onClick={() => setPanel(panel === "bloquear" ? "none" : "bloquear")}
          className="ml-auto rounded-lg px-3 py-1.5 text-xs text-faint hover:text-danger"
        >
          Bloquear
        </button>
      </div>

      {panel === "conectar" && (
        <form action={requestConnection} className="mt-3 space-y-2">
          <input type="hidden" name="personId" value={personId} />
          <label htmlFor="conn-msg" className="block text-xs font-medium text-muted">
            Una nota para {personName} (opcional)
          </label>
          <input
            id="conn-msg"
            name="message"
            placeholder="Por qué te gustaría conectar…"
            className="w-full rounded-lg border border-line bg-raised px-3 py-2 text-sm"
          />
          <button
            type="submit"
            className="rounded-lg bg-accent px-4 py-1.5 text-sm font-semibold text-[#0b0a12]"
          >
            Enviar solicitud
          </button>
        </form>
      )}

      {panel === "mensaje" && (
        <form action={startConversation} className="mt-3 space-y-2">
          <input type="hidden" name="personId" value={personId} />
          <label htmlFor="msg-body" className="block text-xs font-medium text-muted">
            Mensaje para {personName}
          </label>
          <textarea
            id="msg-body"
            name="body"
            rows={3}
            required
            placeholder="Hola…"
            className="w-full rounded-lg border border-line bg-raised px-3 py-2 text-sm"
          />
          <p className="text-[11px] text-faint">
            {puedeEscribir
              ? "Solo ustedes dos pueden leer esta conversación: el centro no tiene acceso a los mensajes directos."
              : `Como aún no están conectados, ${personName} recibirá una solicitud y decidirá si abre la conversación.`}
          </p>
          <button
            type="submit"
            className="rounded-lg bg-accent px-4 py-1.5 text-sm font-semibold text-[#0b0a12]"
          >
            {escribirLabel}
          </button>
        </form>
      )}

      {panel === "bloquear" && (
        <form action={blockPerson} className="mt-3 space-y-2">
          <input type="hidden" name="personId" value={personId} />
          <p className="text-sm text-muted">
            Bloquear a {personName} deshace la conexión, deja de mostrar sus publicaciones y
            le impide escribirte. Puedes revertirlo desde tu perfil.
          </p>
          <button
            type="submit"
            className="rounded-lg border border-danger px-4 py-1.5 text-sm font-medium text-danger hover:bg-danger-soft"
          >
            Sí, bloquear
          </button>
        </form>
      )}
    </div>
  );
}
