"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

export type Lang = "es" | "en"

interface LangCtx {
  lang: Lang
  setLang: (l: Lang) => void
}

const Ctx = createContext<LangCtx>({ lang: "es", setLang: () => {} })

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("es")

  useEffect(() => {
    try {
      const saved = localStorage.getItem("eleva-lang") as Lang
      if (saved === "en" || saved === "es") setLangState(saved)
    } catch {}
  }, [])

  const setLang = (l: Lang) => {
    setLangState(l)
    try {
      localStorage.setItem("eleva-lang", l)
      document.documentElement.lang = l
    } catch {}
  }

  return <Ctx.Provider value={{ lang, setLang }}>{children}</Ctx.Provider>
}

export function useLang() {
  return useContext(Ctx)
}

/** Shorthand: pick a string by current language */
export type T = { es: string; en: string }
export function pick(d: T, lang: Lang): string {
  return d[lang]
}
