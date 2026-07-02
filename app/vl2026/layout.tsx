"use client"

import { useRouter } from "next/navigation"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
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
  Database,
  ShieldCheck,
  DollarSign,
  ClipboardList,
  UserPlus,
  ChevronDown,
  Check,
  Globe,
  Brain,
  Trophy,
  GraduationCap,
  Send,
  Video,
  Star,
  GitMerge,
  LayoutDashboard,
  CalendarCheck,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { DemoProvider, useDemoStore } from "@/lib/demo-store"
import { CENTERS } from "@/data/level"
import { AIAssistant } from "@/components/demo/AIAssistant"

type NavScreen = {
  href: string
  label: string
  shortLabel: string
  icon: React.ComponentType<{ className?: string }>
  badge?: number
}

type View = "owner" | "ops" | "participant" | "coach"

const ATENCION_TOTAL = 14

function getOwnerScreens(atencionResolved: number): NavScreen[] {
  const remaining = Math.max(0, ATENCION_TOTAL - atencionResolved)
  return [
    { href: "/vl2026/pulso",        label: "Pulso del Centro",      shortLabel: "Pulso",    icon: Activity },
    { href: "/vl2026/atencion",     label: "Necesitan Atención",    shortLabel: "Atención", icon: AlertTriangle, ...(remaining > 0 ? { badge: remaining } : {}) },
    { href: "/vl2026/cohortes",     label: "Generaciones",          shortLabel: "Cohortes", icon: GitMerge },
    { href: "/vl2026/crm",          label: "Directorio CRM",        shortLabel: "CRM",      icon: Database },
    { href: "/vl2026/equipo",       label: "Visibilidad de Equipo", shortLabel: "Equipo",   icon: ShieldCheck },
    { href: "/vl2026/finanzas",     label: "Finanzas",              shortLabel: "Finanzas", icon: DollarSign },
    { href: "/vl2026/campanas",     label: "Campañas",              shortLabel: "Campañas", icon: Send },
    { href: "/vl2026/webinars",     label: "Noches de invitados",   shortLabel: "Webinars", icon: Video },
    { href: "/vl2026/inteligencia", label: "Motor de IA",           shortLabel: "IA",       icon: Brain },
    { href: "/vl2026/expediente",   label: "Expediente (demo)",     shortLabel: "Exp.",     icon: User },
  ]
}

const OPS_SCREENS: NavScreen[] = [
  { href: "/vl2026/ops/dashboard",          label: "Centro de Operaciones", shortLabel: "Centro",       icon: Activity },
  { href: "/vl2026/ops/registro",           label: "Mesa de Registro",      shortLabel: "Registro",     icon: ClipboardList },
  { href: "/vl2026/ops/enrolamiento",       label: "Pipeline Enrolamiento", shortLabel: "Pipeline",     icon: GitMerge },
  { href: "/vl2026/ops/pre-entrenamiento",  label: "Pre-entrenamiento",     shortLabel: "Pre-Train",    icon: Users },
  { href: "/vl2026/ops/comunidad",          label: "Hub de Comunidad",      shortLabel: "Comunidad",    icon: Globe },
  { href: "/vl2026/crm",                    label: "Directorio CRM",        shortLabel: "CRM",          icon: Database },
]

const PARTICIPANT_SCREENS: NavScreen[] = [
  { href: "/vl2026/mi-panel",       label: "Mi Panel",      shortLabel: "Panel",     icon: LayoutDashboard },
  { href: "/vl2026/feed",           label: "Mi Feed",       shortLabel: "Feed",      icon: Home },
  { href: "/vl2026/mision",         label: "Mi Misión",     shortLabel: "Misión",    icon: Target },
  { href: "/vl2026/momentum",       label: "Mi Momentum",   shortLabel: "Momentum",  icon: TrendingUp },
  { href: "/vl2026/tribu",          label: "Mi Tribu",      shortLabel: "Tribu",     icon: Users },
  { href: "/vl2026/logros",         label: "Mis Logros",    shortLabel: "Logros",    icon: Trophy },
  { href: "/vl2026/especialistas",  label: "Expertos",      shortLabel: "Expertos",  icon: Star },
]

const COACH_SCREENS: NavScreen[] = [
  { href: "/vl2026/coach", label: "Panel del Coach", shortLabel: "Panel", icon: GraduationCap },
  { href: "/vl2026/expediente", label: "Expediente IA", shortLabel: "IA", icon: Brain },
  { href: "/vl2026/crm", label: "Directorio", shortLabel: "CRM", icon: Database },
]

const OWNER_PATHS = getOwnerScreens(0).map((s) => s.href)
const OPS_PATHS   = OPS_SCREENS.map((s) => s.href)
const COACH_PATHS = COACH_SCREENS.map((s) => s.href)

function getViewFromPath(pathname: string): View {
  if (OWNER_PATHS.includes(pathname)) return "owner"
  if (OPS_PATHS.includes(pathname) || pathname.startsWith("/vl2026/ops")) return "ops"
  if (COACH_PATHS.includes(pathname) || pathname.startsWith("/vl2026/coach")) return "coach"
  if (pathname === "/vl2026/mi-panel") return "participant"
  return "participant"
}

function CenterSelector() {
  const [open, setOpen] = useState(false)
  const { state, dispatch } = useDemoStore()
  const selected = CENTERS.find((c) => c.id === state.selectedCenter) ?? CENTERS[0]

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((p) => !p)}
        className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs bg-sidebar-accent hover:bg-sidebar-accent/80 transition-colors text-left"
      >
        <Globe className="w-3.5 h-3.5 text-violet-400 flex-shrink-0" />
        <span className="flex-1 font-medium text-foreground truncate">{selected.name}</span>
        <ChevronDown className={cn("w-3.5 h-3.5 text-muted-foreground transition-transform", open && "rotate-180")} />
      </button>
      {open && (
        <div className="absolute top-full left-0 right-0 mt-1 z-50 bg-sidebar border border-sidebar-border rounded-lg shadow-lg overflow-hidden">
          {CENTERS.map((center) => (
            <button
              key={center.id}
              onClick={() => { dispatch({ type: "SET_CENTER", centerId: center.id }); setOpen(false) }}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 text-left hover:bg-sidebar-accent transition-colors"
            >
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-foreground truncate">{center.name}</p>
                <p className="text-[10px] text-muted-foreground">{center.city} · {center.activeParticipants} participantes</p>
              </div>
              {center.id === state.selectedCenter && (
                <Check className="w-3.5 h-3.5 text-violet-400 flex-shrink-0" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function ViewSwitcher({ view, className }: { view: View; className?: string }) {
  const router = useRouter()
  const views = [
    { id: "owner" as View,       label: "Dueño",  href: "/vl2026/pulso",        activeColor: "bg-violet-600" },
    { id: "coach" as View,       label: "Coach",  href: "/vl2026/coach",        activeColor: "bg-emerald-600" },
    { id: "ops" as View,         label: "Ops",    href: "/vl2026/ops/dashboard", activeColor: "bg-cyan-600" },
    { id: "participant" as View, label: "Usuario",href: "/vl2026/feed",         activeColor: "bg-violet-600" },
  ]
  return (
    <div className={cn("flex rounded-lg overflow-hidden border border-sidebar-border", className)}>
      {views.map((v, i) => (
        <button
          key={v.id}
          onClick={() => router.push(v.href)}
          className={cn(
            "flex-1 py-1.5 text-[10px] font-semibold transition-colors",
            i > 0 && "border-l border-sidebar-border",
            view === v.id ? `${v.activeColor} text-white` : "text-muted-foreground hover:text-foreground"
          )}
        >
          {v.label}
        </button>
      ))}
    </div>
  )
}

function DemoNav() {
  const pathname = usePathname()
  const { dispatch, state } = useDemoStore()
  const view = getViewFromPath(pathname)
  const screens =
    view === "owner" ? getOwnerScreens(state.atencionResolved) :
    view === "ops"   ? OPS_SCREENS :
    view === "coach" ? COACH_SCREENS :
    PARTICIPANT_SCREENS

  const navLabel =
    view === "owner" ? "Panel del dueño" :
    view === "ops"   ? "Operaciones" :
    view === "coach" ? "Vista del coach" :
    "Mi espacio"

  return (
    <aside className="hidden md:flex flex-col w-60 h-screen sticky top-0 overflow-y-auto bg-sidebar border-r border-sidebar-border flex-shrink-0">
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
          <span className="text-[11px] text-muted-foreground">Demo interactivo</span>
        </div>
      </div>

      {/* Center selector, only in owner view */}
      {view === "owner" && (
        <div className="p-4 border-b border-sidebar-border">
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2 font-medium">Centro</p>
          <CenterSelector />
        </div>
      )}

      {/* View switcher */}
      <div className="p-4 border-b border-sidebar-border">
        <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2 font-medium">Vista</p>
        <ViewSwitcher view={view} />
        {view === "participant" && (
          <p className="text-[10px] text-muted-foreground mt-2 text-center">Como Valeria Romo</p>
        )}
        {view === "ops" && (
          <p className="text-[10px] text-muted-foreground mt-2 text-center">Como Karla Ríos · Operaciones</p>
        )}
        {view === "coach" && (
          <p className="text-[10px] text-muted-foreground mt-2 text-center">Como Ana Reyes · Gen. Omega</p>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-0.5">
        <p className="text-[10px] uppercase tracking-widest text-muted-foreground px-3 py-2 font-medium">
          {navLabel}
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

      {/* AI Assistant, visible for owner, coach, ops only */}
      {view !== "participant" && (
        <div className="px-3 pb-2">
          <AIAssistant role={view as "owner" | "coach" | "ops"} />
        </div>
      )}

      {/* Reset + back + CTA */}
      <div className="p-4 border-t border-sidebar-border space-y-0.5">
        <a
          href="mailto:hola@elevaapp.io?subject=Quiero%20agendar%20sesión%20estratégica"
          className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-xs font-semibold text-violet-400 hover:text-violet-300 hover:bg-violet-500/10 transition-colors"
        >
          <CalendarCheck className="w-3.5 h-3.5" />
          Agendar sesión gratis
        </a>
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
  const { dispatch, state } = useDemoStore()
  const view = getViewFromPath(pathname)
  const screens =
    view === "owner" ? getOwnerScreens(state.atencionResolved) :
    view === "ops"   ? OPS_SCREENS :
    view === "coach" ? COACH_SCREENS :
    PARTICIPANT_SCREENS

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-sidebar border-t border-sidebar-border">
      {/* View switcher */}
      <div className="flex items-center border-b border-sidebar-border px-1 gap-0">
        {[
          { id: "owner" as View,       label: "Dueño",  href: "/vl2026/pulso",        active: "text-violet-400 border-b-2 border-violet-600" },
          { id: "coach" as View,       label: "Coach",  href: "/vl2026/coach",        active: "text-emerald-400 border-b-2 border-emerald-500" },
          { id: "ops" as View,         label: "Ops",    href: "/vl2026/ops/dashboard", active: "text-cyan-400 border-b-2 border-cyan-500" },
          { id: "participant" as View, label: "Usuario",href: "/vl2026/feed",         active: "text-violet-400 border-b-2 border-violet-600" },
        ].map((v) => (
          <button
            key={v.id}
            onClick={() => router.push(v.href)}
            className={cn("flex-1 py-1.5 text-[10px] font-semibold transition-colors", view === v.id ? v.active : "text-muted-foreground")}
          >
            {v.label}
          </button>
        ))}
        <button onClick={() => dispatch({ type: "RESET" })} className="px-2 py-1.5 text-muted-foreground" title="Reiniciar">
          <RotateCcw className="w-3 h-3" />
        </button>
      </div>
      {/* Screen tabs, scrollable when many items (owner has 10) */}
      <div className={cn("flex", screens.length > 5 ? "overflow-x-auto scrollbar-none" : "")}>
        {screens.map(({ href, shortLabel, icon: Icon, badge }) => {
          const active = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex flex-col items-center gap-1 py-2 transition-colors flex-shrink-0",
                screens.length > 5 ? "w-[62px]" : "flex-1",
                active ? "text-violet-400" : "text-muted-foreground"
              )}
            >
              <div className="relative">
                <Icon className="w-4 h-4" />
                {badge && (
                  <span className="absolute -top-1 -right-1.5 min-w-[14px] h-[14px] rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center px-0.5 leading-none">
                    {badge > 9 ? "9+" : badge}
                  </span>
                )}
              </div>
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
