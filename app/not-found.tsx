import Link from "next/link"
import { ArrowLeft, Home } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 text-center">
      {/* Logo */}
      <div className="flex items-center gap-2 mb-10">
        <div className="w-9 h-9 rounded-xl bg-violet-600 flex items-center justify-center">
          <span className="text-white font-black text-base">E</span>
        </div>
        <span className="font-black text-white text-xl tracking-tight">ELEVA</span>
      </div>

      {/* Error code */}
      <p className="text-8xl font-black text-violet-600/30 leading-none select-none mb-4">404</p>

      {/* Copy */}
      <h1 className="text-3xl sm:text-4xl font-black text-foreground mb-3">
        Esta página no existe
      </h1>
      <p className="text-muted-foreground max-w-sm text-base leading-relaxed mb-8">
        Puede que el enlace esté roto o que la página haya sido movida. Pero tu centro no tiene
        que estarlo — vuelve al inicio.
      </p>

      {/* CTAs */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-sm font-bold transition-colors"
        >
          <Home className="w-4 h-4" />
          Volver al inicio
        </Link>
        <Link
          href="/demo"
          className="inline-flex items-center gap-2 px-6 py-3 border border-white/10 hover:border-white/20 text-muted-foreground hover:text-foreground rounded-xl text-sm font-semibold transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Ver el demo
        </Link>
      </div>
    </div>
  )
}
