import { cn } from "@/lib/utils"

interface Props {
  initials: string
  size?: "xs" | "sm" | "md" | "lg"
  color?: "violet" | "cyan" | "green" | "orange" | "red" | "auto"
  className?: string
}

const COLORS = [
  "bg-violet-600",
  "bg-cyan-600",
  "bg-emerald-600",
  "bg-orange-600",
  "bg-pink-600",
  "bg-blue-600",
]

function colorFromInitials(initials: string) {
  const idx = (initials.charCodeAt(0) + (initials.charCodeAt(1) || 0)) % COLORS.length
  return COLORS[idx]
}

export function AvatarBadge({ initials, size = "md", color = "auto", className }: Props) {
  const sizes = {
    xs: "w-6 h-6 text-[10px]",
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-12 h-12 text-base",
  }

  const colorClass =
    color === "auto" ? colorFromInitials(initials)
    : color === "violet" ? "bg-violet-600"
    : color === "cyan" ? "bg-cyan-600"
    : color === "green" ? "bg-emerald-600"
    : color === "orange" ? "bg-orange-600"
    : "bg-red-600"

  return (
    <div
      className={cn(
        "rounded-full flex items-center justify-center font-bold text-white flex-shrink-0",
        sizes[size],
        colorClass,
        className
      )}
    >
      {initials}
    </div>
  )
}
