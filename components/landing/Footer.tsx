"use client"

import Link from "next/link"
import { useLang } from "@/lib/i18n"

export function Footer() {
  const { lang } = useLang()

  const tagline = lang === "en"
    ? "The institutional firm for transformation centers in LATAM. Formation, systems and growth."
    : "La firma institucional para centros de transformación en LATAM. Formación, sistema y crecimiento."

  const copyright = "© 2026 ELEVA · Estudio Oasis"
  const region = lang === "en"
    ? "For transformation centers · Mexico · LATAM"
    : "Para centros de transformación · México · LATAM"

  return (
    <footer className="border-t border-border px-6 py-12">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row items-start justify-between gap-10 mb-10">
          {/* Brand */}
          <div className="max-w-xs">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg bg-violet-600 flex items-center justify-center">
                <span className="text-foreground font-black text-xs">E</span>
              </div>
              <span className="font-black text-foreground text-base tracking-tight">ELEVA</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">{tagline}</p>
          </div>

          {/* Links */}
          <div className="flex gap-12 sm:gap-16 flex-wrap">
            <div>
              <p className="text-xs font-semibold text-foreground mb-4 uppercase tracking-widest">
                {lang === "en" ? "Services" : "Servicios"}
              </p>
              <div className="space-y-3">
                <Link href="#programas" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                  {lang === "en" ? "PACTO Implementation" : "Implementación PACTO"}
                </Link>
                <Link href="/academia" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                  {lang === "en" ? "ELEVA Academy" : "ELEVA Academy"}
                </Link>
                <Link href="/metodo" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                  {lang === "en" ? "Method & OS" : "Método y OS"}
                </Link>
                <Link href="#precios" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                  {lang === "en" ? "Pricing" : "Precios"}
                </Link>
                <Link href="/recursos" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                  {lang === "en" ? "Manifesto" : "Manifiesto"}
                </Link>
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-foreground mb-4 uppercase tracking-widest">
                {lang === "en" ? "Start" : "Iniciar"}
              </p>
              <div className="space-y-3">
                <Link href="/build" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                  {lang === "en" ? "Book a diagnosis" : "Agendar diagnóstico"}
                </Link>
                <Link href="/build" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                  {lang === "en" ? "Apply to PACTO" : "Aplicar a PACTO"}
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
            {lang === "en"
              ? "ELEVA® is the institutional standard for transformation centers in LATAM. Credentials verified by Acreditta. Methodology developed with professional ethics and applied psychology frameworks."
              : "ELEVA® es el estándar institucional para centros de transformación en LATAM. Credenciales verificadas por Acreditta. Metodología desarrollada con ética profesional y marcos de psicología aplicada."}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-muted-foreground">{copyright}</p>
            <p className="text-xs text-muted-foreground">{region}</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
