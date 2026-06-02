"use client"

import { useState } from "react"
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

const OWNER_SCREENS = [
  { href: "/demo/pulso", label: "Pulso del Centro", icon: Activity },
  { href: "/demo/atencion", label: "Necesitan Atención", icon: AlertTriangle, badge: 14 },
  { href: "/demo/expediente", label: "Expediente Valeria", icon: User },
]

const PARTICIPANT_SCREENS = [
  { href: "/demo/feed", label: "Mi Feed", icon: Home },
  { href: "/demo/mision", label: "Mi Misión", icon: Target },
  { href: "/demo/momentum", label: "Mi Momentum", icon: TrendingUp },
  { href: "/demo/tribu", label: "Mi Tribu", icon: Users },
]

type View = "owner" | "participant"

function DemoNav({ view, setView }: { view: View; setView: (v: View) => void }) {
  const pathname = usePathname()
  const { dispatch } = useDemoStore()

  const screens = view === "owner" ? OWNER_SCREENS : PARTICIPANT_SCREENS

  return (
    <aside className="hidden md:flex flex-col w-64 min-h-screen bg-sidebar border-r border-sidebar-border flex-shrink-0">
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
            onClick={() => setView("owner")}
            className={cn(
              "flex-1 py-1.5 text-xs font-semibold transition-colors",
              view === "owner"
                ? "bg-violet-600 text-white"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Dueño
          </button>
          <button
            onClick={() => setView("participant")}
            className={cn(
              "flex-1 py-1.5 text-xs font-semibold transition-colors",
              view === "participant"
                ? "bg-violet-600 text-white"
                : "text-muted-foreground hover:text-foreground"
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

      {/* Reset */}
      <div className="p-4 border-t border-sidebar-border">
        <button
          onClick={() => dispatch({ type: "RESET" })}
          className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-xs text-muted-foreground hover:text-foreground hover:bg-sidebar-accent transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reiniciar demo
        </button>
        <Link
          href="/"
          className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-xs text-muted-foreground hover:text-foreground hover:bg-sidebar-accent transition-colors mt-0.5"
        >
          <ChevronRight className="w-3.5 h-3.5 rotate-180" />
          Volver al sitio
        </Link>
      </div>
    </aside>
  )
}

function MobileNav({ view, setView }: { view: View; setView: (v: View) => void }) {
  const pathname = usePathname()
  const screens = view === "owner" ? OWNER_SCREENS : PARTICIPANT_SCREENS

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-sidebar border-t border-sidebar-border">
      {/* View switcher mobile */}
      <div className="flex border-b border-sidebar-border">
        <button
          onClick={() => setView("owner")}
          className={cn(
            "flex-1 py-2 text-xs font-semibold transition-colors",
            view === "owner" ? "text-violet-400 border-b-2 border-violet-600" : "text-muted-foreground"
          )}
        >
          Dueño
        </button>
        <button
          onClick={() => setView("participant")}
          className={cn(
            "flex-1 py-2 text-xs font-semibold transition-colors",
            view === "participant" ? "text-violet-400 border-b-2 border-violet-600" : "text-muted-foreground"
          )}
        >
          Participante
        </button>
      </div>
      {/* Screen tabs */}
      <div className="flex">
        {screens.map(({ href, label, icon: Icon }) => {
          const active = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex-1 flex flex-col items-center gap-1 py-2.5 transition-colors",
                active ? "text-violet-400" : "text-muted-foreground"
              )}
            >
              <Icon className="w-4 h-4" />
              <span className="text-[9px] font-medium leading-tight text-center">{label.split(" ")[label.split(" ").length > 1 ? 1 : 0]}</span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

function DemoShell({ children }: { children: React.ReactNode }) {
  const [view, setView] = useState<View>("owner")

  return (
    <div className="flex min-h-screen">
      <DemoNav view={view} setView={setView} />
      <main className="flex-1 overflow-auto pb-32 md:pb-0">
        {children}
      </main>
      <MobileNav view={view} setView={setView} />
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
