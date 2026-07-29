"use client"

import { useEffect, useState } from "react"
import { CheckCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface Props {
  message: string
  visible: boolean
  onHide: () => void
}

export function ActionToast({ message, visible, onHide }: Props) {
  useEffect(() => {
    if (visible) {
      const t = setTimeout(onHide, 3000)
      return () => clearTimeout(t)
    }
  }, [visible, onHide])

  return (
    <div
      className={cn(
        "fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-5 py-3 rounded-xl",
        "bg-violet-600 text-white shadow-2xl transition-all duration-300",
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
      )}
    >
      <CheckCircle className="w-5 h-5 flex-shrink-0" />
      <span className="text-sm font-medium">{message}</span>
    </div>
  )
}

export function useActionToast() {
  const [toast, setToast] = useState<{ message: string; visible: boolean }>({
    message: "",
    visible: false,
  })

  function show(message: string) {
    setToast({ message, visible: true })
  }

  function hide() {
    setToast((prev) => ({ ...prev, visible: false }))
  }

  return { toast, show, hide }
}
