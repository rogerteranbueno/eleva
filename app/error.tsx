"use client"

import Link from "next/link"
import { useEffect } from "react"
import { RefreshCw, Home } from "lucide-react"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log to an error-tracking service when available
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 text-center">
      {/* Logo */}
      <div className="flex items-center gap-2 mb-10">
        <div className="w-9 h-9 rounded-xl bg-violet-600 flex items-center justify-center">
          <span className="text-white font-black text-base">E</span>
        </div>
        <span className="font-black text-white text-xl tracking-tight">ELEVA</span>
      </div>

      {/* Icon */}
      <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-6">
        <span className="text-3xl">⚡</span>
      </div>

      {/* Copy */}
      <h1 className="text-3xl sm:text-4xl font-black text-foreground mb-3">
        Algo salió mal
      </h1>
      <p className="text-muted-foreground max-w-sm text-base leading-relaxed mb-8">
        Ocurrió un error inesperado. Intenta recargar — si el problema persiste,
        escríbenos a{" "}
        <a
          href="mailto:hola@elevaapp.io"
          className="text-violet-400 hover:text-violet-300 underline underline-offset-2"
        >
          hola@elevaapp.io
        </a>
        .
      </p>

      {/* CTAs */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <button
          onClick={reset}
          className="inline-flex items-center gap-2 px-6 py-3 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-sm font-bold transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Intentar de nuevo
        </button>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 border border-white/10 hover:border-white/20 text-muted-foreground hover:text-foreground rounded-xl text-sm font-semibold transition-colors"
        >
          <Home className="w-4 h-4" />
          Volver al inicio
        </Link>
      </div>

      {/* Error digest for debugging */}
      {error.digest && (
        <p className="mt-8 text-[11px] text-muted-foreground/40 font-mono">
          Error ID: {error.digest}
        </p>
      )}
    </div>
  )
}
