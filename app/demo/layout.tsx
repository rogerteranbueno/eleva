"use client"

import { useRouter } from "next/navigation"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Activity,
  AlertTriangle,
  User,
  Home,
  Target,
  TrendingUp,
  Users,
  RotateCcw,
  Building2,
  ChevronRight,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { DemoProvider, useDemoStore } from "@/lib/demo-store"

type NavScreen = {
  href: string
  label: string
  shortLabel: string
  icon: React.ComponentType<{ className?: string }>
  badge?: number
}

const OWNER_SCREENS: NavScreen[] = [
  { href: "/demo/pulso", label: "Pulso del Centro", shortLabel: "Pulso", icon: Activity },
  { href: "/demo/atencion", label: "Necesitan Atención", shortLabel: "Atención", icon: AlertTriangle, badge: 14 },
  { href: "/demo/expediente", label: "Expediente Valeria", shortLabel: "Expediente", icon: User },
]

const PARTICIPANT_SCREENS: NavScreen[] = [
  { href: "/demo/feed", label: "Mi Feed", shortLabel: "Feed", icon: Home },
  { href: "/demo/mision", label: "Mi Misión", shortLabel: "Misión", icon: Target },
  { href: "/demo/momentum", label: "Mi Momentum", shortLabel: "Momentum", icon: TrendingUp },
  { href: "/demo/tribu", label: "Mi Tribu", shortLabel: "Tribu", icon: Users },
]

const OWNER_PATHS = OWNER_SCREENS.map((s) => s.href)

function getViewFromPath(pathname: string): "owner" | "participant" {
  return OWNER_PATHS.includes(pathname) ? "owner" : "participant"
}

function DemoNav() {
  const pathname = usePathname()
  const router = useRouter()
  const { dispatch } = useDemoStore()
  const view = getViewFromPath(pathname)
  const screens = view === "owner" ? OWNER_SCREENS : PARTICIPANT_SCREENS

  return (
    <aside className="hidden md:flex flex-col w-60 min-h-screen bg-sidebar border-r border-sidebar-border flex-shrink-0">
      {/* Logo */}
      <div className="p-5 border-b border-sidebar-border">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center">
            <span className="text-white font-black text-sm">E</span>
          </div>
          <span className="font-black text-white text-lg tracking-tight">ELEVA</span>
        </Link>
        <div className="mt-1 flex items-center gap-1.5">
          <Building2 className="w-3 h-3 text-muted-foreground" />
          <span className="text-[11px] text-muted-foreground">Demo — Creania</span>
        </div>
      </div>

      {/* View switcher */}
      <div className="p-4 border-b border-sidebar-border">
        <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2 font-medium">Vista</p>
        <div className="flex rounded-lg overflow-hidden border border-sidebar-border">
          <button
            onClick={() => router.push("/demo/pulso")}
            className={cn(
              "flex-1 py-1.5 text-xs font-semibold transition-colors",
              view === "owner" ? "bg-violet-600 text-white" : "text-muted-foreground hover:text-foreground"
            )}
          >
            Dueño
          </button>
          <button
            onClick={() => router.push("/demo/feed")}
            className={cn(
              "flex-1 py-1.5 text-xs font-semibold transition-colors",
              view === "participant" ? "bg-violet-600 text-white" : "text-muted-foreground hover:text-foreground"
            )}
          >
            Participante
          </button>
        </div>
        {view === "participant" && (
          <p className="text-[10px] text-muted-foreground mt-2 text-center">Como Valeria Romo</p>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-0.5">
        <p className="text-[10px] uppercase tracking-widest text-muted-foreground px-3 py-2 font-medium">
          {view === "owner" ? "Panel del dueño" : "Mi espacio"}
        </p>
        {screens.map(({ href, label, icon: Icon, badge }) => {
          const active = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all group",
                active
                  ? "bg-violet-600/15 text-white border border-violet-600/30"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              )}
            >
              <Icon className={cn("w-4 h-4 flex-shrink-0", active ? "text-violet-400" : "")} />
              <span className="flex-1 font-medium">{label}</span>
              {badge && (
                <span className="w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                  {badge}
                </span>
              )}
              {active && <ChevronRight className="w-3 h-3 text-violet-400" />}
            </Link>
          )
        })}
      </nav>

      {/* Reset + back */}
      <div className="p-4 border-t border-sidebar-border space-y-0.5">
        <button
          onClick={() => dispatch({ type: "RESET" })}
          className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-xs text-muted-foreground hover:text-foreground hover:bg-sidebar-accent transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reiniciar demo
        </button>
        <Link
          href="/"
          className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-xs text-muted-foreground hover:text-foreground hover:bg-sidebar-accent transition-colors"
        >
          <ChevronRight className="w-3.5 h-3.5 rotate-180" />
          Volver al sitio
        </Link>
      </div>
    </aside>
  )
}

function MobileNav() {
  const pathname = usePathname()
  const router = useRouter()
  const { dispatch } = useDemoStore()
  const view = getViewFromPath(pathname)
  const screens = view === "owner" ? OWNER_SCREENS : PARTICIPANT_SCREENS

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-sidebar border-t border-sidebar-border">
      {/* View switcher */}
      <div className="flex border-b border-sidebar-border">
        <button
          onClick={() => router.push("/demo/pulso")}
          className={cn(
            "flex-1 py-1.5 text-xs font-semibold transition-colors",
            view === "owner" ? "text-violet-400 border-b-2 border-violet-600" : "text-muted-foreground"
          )}
        >
          Dueño
        </button>
        <button
          onClick={() => {
            dispatch({ type: "RESET" })
          }}
          className="px-3 py-1.5 text-muted-foreground"
          title="Reiniciar"
        >
          <RotateCcw className="w-3 h-3" />
        </button>
        <button
          onClick={() => router.push("/demo/feed")}
          className={cn(
            "flex-1 py-1.5 text-xs font-semibold transition-colors",
            view === "participant" ? "text-violet-400 border-b-2 border-violet-600" : "text-muted-foreground"
          )}
        >
          Participante
        </button>
      </div>
      {/* Screen tabs */}
      <div className="flex">
        {screens.map(({ href, shortLabel, icon: Icon }) => {
          const active = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex-1 flex flex-col items-center gap-1 py-2 transition-colors",
                active ? "text-violet-400" : "text-muted-foreground"
              )}
            >
              <Icon className="w-4 h-4" />
              <span className="text-[9px] font-medium leading-tight text-center whitespace-nowrap">{shortLabel}</span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

function DemoShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <DemoNav />
      <main className="flex-1 overflow-auto pb-28 md:pb-0">
        {children}
      </main>
      <MobileNav />
    </div>
  )
}

export default function DemoLayout({ children }: { children: React.ReactNode }) {
  return (
    <DemoProvider>
      <DemoShell>{children}</DemoShell>
    </DemoProvider>
  )
}
