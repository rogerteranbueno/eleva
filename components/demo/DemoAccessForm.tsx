"use client"

import { useActionState, useState } from "react"
import { ArrowRight, Lock, Loader2 } from "lucide-react"
import { grantDemoAccess, type DemoAccessState } from "@/app/actions/demo-access"
import { cn } from "@/lib/utils"

export function DemoAccessForm() {
  const [state, action, pending] = useActionState<DemoAccessState, FormData>(
    grantDemoAccess,
    undefined,
  )
  const [showCode, setShowCode] = useState(false)

  return (
    <form action={action} className="space-y-3">
      {/* Name */}
      <div>
        <label htmlFor="demo-name" className="text-xs text-muted-foreground mb-1.5 block font-medium">
          Tu nombre
        </label>
        <input
          id="demo-name"
          name="name"
          type="text"
          placeholder="Carlos Londoño"
          autoComplete="given-name"
          className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 text-sm focus:outline-none focus:border-violet-500/60 focus:bg-white/8 transition-all"
        />
      </div>

      {/* Email */}
      <div>
        <label htmlFor="demo-email" className="text-xs text-muted-foreground mb-1.5 block font-medium">
          Tu correo <span className="text-red-400">*</span>
        </label>
        <input
          id="demo-email"
          name="email"
          type="email"
          placeholder="carlos@micenter.com"
          required
          autoComplete="email"
          className={cn(
            "w-full px-4 py-3 rounded-xl bg-white/5 border text-white placeholder:text-white/30 text-sm focus:outline-none transition-all",
            state?.error
              ? "border-red-500/50 focus:border-red-500/70"
              : "border-white/10 focus:border-violet-500/60 focus:bg-white/8",
          )}
        />
        {state?.error && (
          <p className="text-xs text-red-400 mt-1.5">{state.error}</p>
        )}
      </div>

      {/* Código QA — colapsable */}
      {showCode ? (
        <div>
          <label htmlFor="demo-code" className="text-xs text-muted-foreground mb-1.5 block font-medium">
            Código de acceso
          </label>
          <input
            id="demo-code"
            name="code"
            type="text"
            placeholder="••••••••"
            autoComplete="off"
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 text-sm focus:outline-none focus:border-violet-500/60 transition-all font-mono tracking-widest"
          />
        </div>
      ) : (
        <input type="hidden" name="code" value="" />
      )}

      {/* CTA */}
      <button
        type="submit"
        disabled={pending}
        className="w-full flex items-center justify-center gap-2.5 px-5 py-3.5 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold text-sm transition-all active:scale-[0.98]"
      >
        {pending ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <ArrowRight className="w-4 h-4" />
        )}
        {pending ? "Abriendo acceso…" : "Acceder al demo completo"}
      </button>

      {/* Toggle código */}
      <button
        type="button"
        onClick={() => setShowCode((p) => !p)}
        className="w-full flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground hover:text-foreground transition-colors py-1"
      >
        <Lock className="w-3 h-3" />
        {showCode ? "Ocultar código de acceso" : "¿Tienes código de acceso interno?"}
      </button>
    </form>
  )
}
