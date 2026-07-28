"use client";

import { useState } from "react";
import { reactToPost } from "@/app/actions/member";
import { REACTIONS, REACTION_BY_KIND } from "@/modules/community/postTypes";

/** Reacciones con significado: chips agregados + selector. Una por persona. */
export function ReactionBar({
  postId,
  counts,
  mine,
}: {
  postId: string;
  counts: Record<string, number>;
  mine: string | null;
}) {
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);

  async function choose(kind: string) {
    setPending(true);
    setOpen(false);
    try {
      const fd = new FormData();
      fd.set("postId", postId);
      fd.set("kind", kind);
      await reactToPost(fd);
    } finally {
      setPending(false);
    }
  }

  const entries = Object.entries(counts).filter(([, n]) => n > 0);

  return (
    <div className="relative mt-3 flex flex-wrap items-center gap-1.5">
      {entries.map(([kind, n]) => {
        const def = REACTION_BY_KIND[kind];
        return (
          <button
            key={kind}
            onClick={() => choose(kind)}
            disabled={pending}
            title={def?.label}
            className={`rounded-full px-2 py-0.5 text-xs transition-colors ${
              mine === kind
                ? "bg-accent-soft text-accent-strong border border-accent/40"
                : "bg-raised text-muted border border-line hover:border-line-strong"
            }`}
          >
            <span aria-hidden>{def?.emoji}</span> {n}
          </button>
        );
      })}
      <button
        onClick={() => setOpen((o) => !o)}
        disabled={pending}
        aria-expanded={open}
        className="rounded-full border border-dashed border-line px-2.5 py-0.5 text-xs text-faint hover:border-accent hover:text-accent-strong"
      >
        {mine ? "Cambiar reacción" : "＋ Reaccionar"}
      </button>
      {open && (
        <div className="absolute bottom-full left-0 z-10 mb-2 w-64 rounded-xl border border-line bg-raised p-2 shadow-xl">
          {REACTIONS.map((r) => (
            <button
              key={r.kind}
              onClick={() => choose(r.kind)}
              className={`flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-sm transition-colors hover:bg-accent-soft ${
                mine === r.kind ? "text-accent-strong" : "text-foreground"
              }`}
            >
              <span aria-hidden>{r.emoji}</span> {r.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
