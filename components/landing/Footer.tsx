"use client"

import Link from "next/link"
import { useLang } from "@/lib/i18n"

export function Footer() {
  const { lang } = useLang()

  const c = lang === "en" ? {
    tagline: "The operating system for personal transformation centers. Acquire, activate, retain and scale — in one panel.",
    productLabel: "Product",
    contactLabel: "Contact",
    links: {
      demo: "Interactive demo",
      build: "Build your system",
      schedule: "Schedule a session",
    },
    copyright: "© 2025 ELEVA · Estudio Oasis",
    region: "For personal transformation centers · Mexico · LATAM",
  } : {
    tagline: "El sistema operativo para centros de transformación personal. Adquirir, activar, retener y escalar, en un panel.",
    productLabel: "Producto",
    contactLabel: "Contacto",
    links: {
      demo: "Demo interactivo",
      build: "Construye tu sistema",
      schedule: "Agendar sesión",
    },
    copyright: "© 2025 ELEVA · Estudio Oasis",
    region: "Para centros de transformación personal · México · LATAM",
  }

  return (
    <footer className="border-t border-border px-6 py-12">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row items-start justify-between gap-10 mb-10">
          <div className="max-w-xs">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg bg-violet-600 flex items-center justify-center">
                <span className="text-white font-black text-xs">E</span>
              </div>
              <span className="font-black text-foreground text-base tracking-tight">ELEVA</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {c.tagline}
            </p>
          </div>
          <div className="flex gap-12 sm:gap-16">
            <div>
              <p className="text-xs font-semibold text-foreground mb-4 uppercase tracking-widest">{c.productLabel}</p>
              <div className="space-y-3">
                <Link href="/vl2026" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                  {c.links.demo}
                </Link>
                <Link href="/build" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                  {c.links.build}
                </Link>
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-foreground mb-4 uppercase tracking-widest">{c.contactLabel}</p>
              <div className="space-y-3">
                <a href="mailto:hola@elevaapp.io" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                  hola@elevaapp.io
                </a>
                <a href="#contacto" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                  {c.links.schedule}
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="border-t border-border pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">{c.copyright}</p>
          <p className="text-xs text-muted-foreground">{c.region}</p>
        </div>
      </div>
    </footer>
  )
}
