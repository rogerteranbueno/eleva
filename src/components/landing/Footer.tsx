import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t border-border px-6 py-12">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row items-start justify-between gap-10 mb-10">
          {/* Brand */}
          <div className="max-w-xs">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg bg-violet-600 flex items-center justify-center">
                <span className="text-white font-black text-xs">E</span>
              </div>
              <span className="font-black text-foreground text-base tracking-tight">ELEVA</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              La plataforma institucional para centros de transformación en LATAM.
              Operación, decisión y comunidad en un mismo sistema.
            </p>
          </div>

          {/* Links */}
          <div className="flex gap-12 sm:gap-16 flex-wrap">
            <div>
              <p className="text-xs font-semibold text-foreground mb-4 uppercase tracking-widest">
                Sistema
              </p>
              <div className="space-y-3">
                <Link href="/plataforma" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                  La plataforma
                </Link>
                <Link href="/estandar-eleva" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Estándar ELEVA
                </Link>
                <Link href="/historia-transformacion" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Historia de la transformación
                </Link>
                <Link href="/#como-empezar" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Precios
                </Link>
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-foreground mb-4 uppercase tracking-widest">
                Iniciar
              </p>
              <div className="space-y-3">
                <Link href="/build" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Agendar diagnóstico
                </Link>
                <Link href="/login" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Entrar a mi centro
                </Link>
                <a href="mailto:hola@elevaapp.io" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                  hola@elevaapp.io
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-border pt-6 space-y-3">
          <p className="text-xs text-muted-foreground/60 text-center leading-relaxed max-w-2xl mx-auto">
            ELEVA® es el estándar institucional para centros de transformación en
            LATAM. Credenciales verificadas por Acreditta. Metodología desarrollada
            con ética profesional y marcos de psicología aplicada.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-muted-foreground">© 2026 ELEVA · Estudio Oasis</p>
            <p className="text-xs text-muted-foreground">
              Para centros de transformación · México · LATAM
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
