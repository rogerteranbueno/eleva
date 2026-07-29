"use client"

import { Sun, Moon } from "lucide-react"
import { useTheme } from "@/lib/theme"

export function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, toggle } = useTheme()
  return (
    <button
      onClick={toggle}
      className={`p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5 transition-colors ${className}`}
      aria-label="Cambiar tema"
    >
      {theme === "light" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
    </button>
  )
}
