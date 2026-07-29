"use client"

import { useActionState, useState } from "react"
import { ArrowRight, Lock, Loader2, ChevronDown, BarChart3, Users, ClipboardList, Heart } from "lucide-react"
import { grantDemoAccess, type DemoAccessState } from "@/app/actions/demo-access"
import { cn } from "@/lib/utils"

const PROFILES = [
  {
    email:       "dueno@transforma.co",
    password:    "Eleva2026",
    role:        "Dueño del Centro",
    persona:     "Carlos Mendoza",
    tagline:     "Pulso, finanzas, CRM y equipo",
    icon:        BarChart3,
    accent:      "violet",
  },
  {
    email:       "coach@transforma.co",
    password:    "Eleva2026",
    role:        "Coach",
    persona:     "Ana Reyes",
    tagline:     "Tribu, sesiones y seguimiento",
    icon:        Users,
    accent:      "blue",
  },
  {
    email:       "ops@transforma.co",
    password:    "Eleva2026",
    role:        "Oficinas / Ops",
    persona:     "Karla Ríos",
    tagline:     "Registro, pipeline y operaciones",
    icon:        ClipboardList,
    accent:      "emerald",
  },
  {
    email:       "participante@transforma.co",
    password:    "Eleva2026",
    role:        "Participante",
    persona:     "Valeria Romo",
    tagline:     "Mi panel, misiones y comunidad",
    icon:        Heart,
    accent:      "pink",
  },
] as const

type Accent = "violet" | "blue" | "emerald" | "pink"

const ACCENTS: Record<Accent, { card: string; badge: string; icon: string; btn: string; cred: string }> = {
  violet:  { card: "hover:border-violet-500/40",  badge: "bg-violet-500/10 text-violet-300 border-violet-500/20",  icon: "text-violet-400",  btn: "bg-violet-600 hover:bg-violet-500",   cred: "text-violet-300" },
  blue:    { card: "hover:border-blue-500/40",    badge: "bg-blue-500/10 text-blue-300 border-blue-500/20",        icon: "text-blue-400",    btn: "bg-blue-600 hover:bg-blue-500",       cred: "text-blue-300"   },
  emerald: { card: "hover:border-emerald-500/40", badge: "bg-emerald-500/10 text-emerald-300 border-emerald-500/20", icon: "text-emerald-400", btn: "bg-emerald-600 hover:bg-emerald-500", cred: "text-emerald-300" },
  pink:    { card: "hover:border-pink-500/40",    badge: "bg-pink-500/10 text-pink-300 border-pink-500/20",        icon: "text-pink-400",    btn: "bg-pink-600 hover:bg-pink-500",       cred: "text-pink-300"   },
}

export function DemoAccessForm() {
  const [state, action, pending] = useActionState<DemoAccessState, FormData>(
    grantDemoAccess,
    undefined,
  )
  const [activeProfile, setActiveProfile] = useState<string | null>(null)
  const [showEmail, setShowEmail] = useState(false)
  const [showCode, setShowCode] = useState(false)

  return (
    <div className="space-y-5">
      {/* ── Profile cards ─────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {PROFILES.map((p) => {
          const a = ACCENTS[p.accent]
          const Icon = p.icon
          const isActive = activeProfile === p.email

          return (
            <form key={p.email} action={action} onSubmit={() => setActiveProfile(p.email)}>
              <input type="hidden" name="email"    value={p.email} />
              <input type="hidden" name="password" value={p.password} />
              <input type="hidden" name="code"     value="" />
              <input type="hidden" name="name"     value={p.persona} />

              <button
                type="submit"
                disabled={pending}
                className={cn(
                  "w-full text-left rounded-2xl border border-white/8 p-4 transition-all space-y-3",
                  "bg-white/3 hover:bg-white/5 active:scale-[0.99]",
                  a.card,
                  isActive && pending && "opacity-70",
                )}
              >
                {/* Header */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className={cn("w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0", a.icon)}>
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <span className={cn("text-[10px] px-2 py-0.5 rounded-full border font-bold", a.badge)}>
                      {p.role}
                    </span>
                  </div>
                  {isActive && pending
                    ? <Loader2 className="w-3.5 h-3.5 text-muted-foreground animate-spin flex-shrink-0" />
                    : <ArrowRight className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                  }
                </div>

                {/* Persona + tagline */}
                <div>
                  <p className="text-sm font-bold text-white">{p.persona}</p>
                  <p className="text-[11px] text-muted-foreground">{p.tagline}</p>
                </div>

                {/* Credentials */}
                <div className="flex items-center gap-2 pt-1 border-t border-white/5">
                  <code className={cn("text-[10px] font-mono", a.cred)}>{p.email}</code>
                  <span className="text-muted-foreground/40">·</span>
                  <code className="text-[10px] font-mono text-muted-foreground">{p.password}</code>
                </div>
              </button>
            </form>
          )
        })}
      </div>

      {/* Error from profile login */}
      {state?.error && !showEmail && (
        <p className="text-xs text-red-400 text-center">{state.error}</p>
      )}

      {/* ── Toggle: acceso con correo propio ─────────────────── */}
      <button
        type="button"
        onClick={() => setShowEmail((p) => !p)}
        className="w-full flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground hover:text-foreground transition-colors py-1"
      >
        <ChevronDown className={cn("w-3 h-3 transition-transform", showEmail && "rotate-180")} />
        {showEmail ? "Ocultar acceso con correo propio" : "¿Tienes correo corporativo? Accede directamente"}
      </button>

      {/* ── Email form ────────────────────────────────────────── */}
      {showEmail && (
        <form action={action} className="space-y-3 pt-1 border-t border-white/8">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] text-muted-foreground mb-1.5 block font-medium">Nombre</label>
              <input
                name="name"
                type="text"
                placeholder="Tu nombre"
                autoComplete="given-name"
                className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 text-sm focus:outline-none focus:border-violet-500/60 transition-all"
              />
            </div>
            <div>
              <label className="text-[10px] text-muted-foreground mb-1.5 block font-medium">
                Correo <span className="text-red-400">*</span>
              </label>
              <input
                name="email"
                type="email"
                placeholder="tu@centro.com"
                required
                autoComplete="email"
                className={cn(
                  "w-full px-3 py-2.5 rounded-xl bg-white/5 border text-white placeholder:text-white/30 text-sm focus:outline-none transition-all",
                  state?.error
                    ? "border-red-500/50 focus:border-red-400"
                    : "border-white/10 focus:border-violet-500/60",
                )}
              />
            </div>
          </div>

          <input type="hidden" name="password" value="" />

          {/* QA code */}
          {showCode ? (
            <div>
              <label className="text-[10px] text-muted-foreground mb-1.5 block font-medium">Código de acceso interno</label>
              <input
                name="code"
                type="text"
                placeholder="••••••••"
                autoComplete="off"
                className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 text-sm focus:outline-none focus:border-violet-500/60 transition-all font-mono tracking-widest"
              />
            </div>
          ) : (
            <input type="hidden" name="code" value="" />
          )}

          {state?.error && (
            <p className="text-xs text-red-400">{state.error}</p>
          )}

          <div className="flex items-center gap-2">
            <button
              type="submit"
              disabled={pending}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-60 text-white font-bold text-sm transition-all active:scale-[0.98]"
            >
              {pending ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
              {pending ? "Accediendo…" : "Acceder al demo"}
            </button>
            <button
              type="button"
              onClick={() => setShowCode((p) => !p)}
              className="p-3 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-colors"
              title="Código de acceso interno"
            >
              <Lock className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
