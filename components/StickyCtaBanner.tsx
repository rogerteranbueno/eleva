"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight, X } from "lucide-react"

const HIDDEN_PATHS = ["/build", "/vl2026", "/simulador"]
const SCROLL_THRESHOLD = 500

export function StickyCtaBanner() {
  const pathname = usePathname()
  const [visible, setVisible] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    setDismissed(false)
    setVisible(false)
  }, [pathname])

  useEffect(() => {
    if (HIDDEN_PATHS.some((p) => pathname.startsWith(p))) return

    const onScroll = () => {
      setVisible(window.scrollY > SCROLL_THRESHOLD)
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [pathname])

  const shouldShow = visible && !dismissed && !HIDDEN_PATHS.some((p) => pathname.startsWith(p))

  return (
    <AnimatePresence>
      {shouldShow && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
          className="fixed bottom-5 inset-x-4 z-50 flex items-center justify-between gap-3 max-w-lg mx-auto px-4 py-3 rounded-2xl bg-violet-600 shadow-2xl shadow-violet-900/60"
        >
          <p className="text-sm font-bold text-foreground leading-tight">
            ¿Quieres ordenar tu centro para crecer?{" "}
            <span className="text-violet-200 font-medium hidden sm:inline">
              Agenda un diagnóstico.
            </span>
          </p>
          <div className="flex items-center gap-2 shrink-0">
            <Link href="/build">
              <button className="flex items-center gap-1.5 px-4 py-2 bg-white text-violet-700 font-black text-sm rounded-xl hover:bg-violet-50 transition-colors group">
                Agendar
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </Link>
            <button
              onClick={() => setDismissed(true)}
              className="p-1.5 text-violet-200 hover:text-foreground transition-colors"
              aria-label="Cerrar"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
