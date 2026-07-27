"use client"

import { useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight, ChevronRight, Menu, X, Sun, Moon } from "lucide-react"
import { useLang } from "@/lib/i18n"
import { useTheme } from "@/lib/theme"

export function Nav() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { theme, toggle } = useTheme()
  const light = theme === "light"
  const { lang, setLang } = useLang()

  const links = [
    { href: "/academia",     label: lang === "en" ? "Academy"  : "Academia" },
    { href: "/caso",         label: lang === "en" ? "Case"     : "Caso real" },
    { href: "#como-empezar", label: lang === "en" ? "Pricing"  : "Precios" },
  ]

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/85 backdrop-blur-xl border-b border-border transition-colors duration-300">
      <div className="flex items-center justify-between px-6 py-3.5 max-w-7xl mx-auto">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center flex-shrink-0">
            <span className="text-white font-black text-sm">E</span>
          </div>
          <span className="font-black text-foreground text-lg tracking-tight">ELEVA</span>
        </Link>

        <div className="hidden sm:flex items-center gap-0.5">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-[13px] text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/5"
            >
              {l.label}
            </Link>
          ))}

          <button
            onClick={toggle}
            className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5 transition-colors flex items-center"
            aria-label={lang === "en" ? "Toggle theme" : "Cambiar tema"}
          >
            {light ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </button>
          <button
            onClick={() => setLang(lang === "es" ? "en" : "es")}
            className="px-2.5 py-1.5 rounded-lg text-[12px] font-bold text-muted-foreground hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5 transition-colors tracking-wider"
          >
            {lang === "es" ? "EN" : "ES"}
          </button>

          <Link href="/build" className="ml-2">
            <button className="flex items-center gap-1.5 px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white rounded-lg text-[13px] font-bold transition-colors">
              {lang === "en" ? "Book diagnosis" : "Agendar diagnóstico"} <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </Link>
        </div>

        <button
          onClick={() => setMobileOpen((p) => !p)}
          className="sm:hidden p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
          aria-label="Menú"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="sm:hidden border-t border-border overflow-hidden"
          >
            <div className="px-6 py-4 space-y-1 bg-background/95">
              {links.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-foreground hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                >
                  <ChevronRight className="w-4 h-4 text-violet-400" />{l.label}
                </Link>
              ))}
              <button
                onClick={() => { toggle(); setMobileOpen(false) }}
                className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5 transition-colors w-full text-left"
              >
                {light ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                {light ? (lang === "en" ? "Dark mode" : "Modo oscuro") : (lang === "en" ? "Light mode" : "Modo claro")}
              </button>
              <button
                onClick={() => { setLang(lang === "es" ? "en" : "es"); setMobileOpen(false) }}
                className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5 transition-colors w-full text-left font-bold tracking-wider"
              >
                {lang === "es" ? "🇺🇸 English" : "🇲🇽 Español"}
              </button>
              <Link href="/build" onClick={() => setMobileOpen(false)}>
                <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-violet-600 hover:bg-violet-500 text-white rounded-xl text-sm font-bold transition-colors mt-2">
                  {lang === "en" ? "Book diagnosis" : "Agendar diagnóstico"} <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
