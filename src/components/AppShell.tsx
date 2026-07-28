"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import type { SessionContext } from "@/lib/context";
import { signOut } from "@/app/actions/auth";
import { Avatar } from "@/components/ui";
import { roleLabel } from "@/lib/format";

export type NavItem = { href: string; label: string; icon: keyof typeof icons };

const icons = {
  hoy: (
    <path d="M12 8v4l2.5 2.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
  ),
  pulso: <path d="M3 12h4l2-7 4 14 2-7h6" />,
  personas: (
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM22 21v-2a4 4 0 0 0-3-3.87M15 3.13a4 4 0 0 1 0 7.75" />
  ),
  generaciones: (
    <path d="M12 3 2 8l10 5 10-5-10-5ZM2 13l10 5 10-5" />
  ),
  inicio: (
    <path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7h-6v7H4a1 1 0 0 1-1-1V10Z" />
  ),
  eventos: (
    <path d="M8 2v4M16 2v4M3 9h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z" />
  ),
  generacion: (
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM23 21v-2a4 4 0 0 0-3-3.87" />
  ),
  finanzas: (
    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
  ),
  agenda: (
    <path d="M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2ZM9 16l2 2 4-4" />
  ),
  equipo: (
    <path d="M18 21a6 6 0 0 0-12 0M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM21 8l-2 2-1-1" />
  ),
  crm: (
    <path d="M3 4h18l-7 8v6l-4 2v-8L3 4Z" />
  ),
} as const;

function Icon({ name }: { name: keyof typeof icons }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-5 shrink-0"
    >
      {icons[name]}
    </svg>
  );
}

const SYSTEM_MAP = [
  { label: "ELEVA OS", state: "activo" },
  { label: "Hub Centro", state: "activo" },
  { label: "Growth", state: "proximamente" },
  { label: "Hub Global", state: "proximamente" },
  { label: "Standards", state: "proximamente" },
] as const;

export function AppShell({
  ctx,
  nav,
  homeHref = "/",
  showSystemMap = false,
  extra,
  children,
}: {
  ctx: SessionContext;
  nav: NavItem[];
  homeHref?: string;
  showSystemMap?: boolean;
  extra?: ReactNode;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const active =
    nav
      .map((n) => n.href)
      .filter((href) => pathname === href || pathname.startsWith(href + "/"))
      .sort((a, b) => b.length - a.length)[0] ??
    (pathname.startsWith("/casos") ? "/hoy" : pathname);
  return (
    <div className="flex min-h-dvh w-full">
      {/* Rail lateral — desktop */}
      <aside className="hidden md:flex w-60 shrink-0 flex-col border-r border-line bg-surface/60 px-4 py-6 sticky top-0 h-dvh">
        <Link href={homeHref} className="flex items-center gap-2 px-2">
          <span className="text-lg font-bold tracking-tight">
            ELEVA<span className="text-accent">.</span>
          </span>
          <span className="rounded bg-accent-soft px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-accent-strong">
            Alpha
          </span>
        </Link>
        <p className="mt-1 px-2 text-xs text-faint truncate">{ctx.organizationName}</p>
        {ctx.isDemo && (
          <p className="mt-2 mx-2 rounded-md bg-gold-soft px-2 py-1 text-[11px] leading-tight text-gold">
            Ambiente demo · datos sintéticos
          </p>
        )}
        <nav className="mt-6 flex flex-col gap-1 overflow-y-auto" aria-label="Principal">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active === item.href ? "page" : undefined}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                active === item.href
                  ? "bg-accent-soft text-accent-strong"
                  : "text-muted hover:bg-raised hover:text-foreground"
              }`}
            >
              <Icon name={item.icon} />
              {item.label}
            </Link>
          ))}
        </nav>
        {showSystemMap && (
          <div className="mt-5 border-t border-line pt-4 px-2">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-faint">
              El sistema ELEVA
            </p>
            <ul className="mt-2 space-y-1">
              {SYSTEM_MAP.map((s) => (
                <li
                  key={s.label}
                  className="flex items-center justify-between text-xs"
                >
                  <span className={s.state === "activo" ? "text-muted" : "text-faint"}>
                    {s.label}
                  </span>
                  {s.state === "activo" ? (
                    <span className="size-1.5 rounded-full bg-ok" aria-label="activo" />
                  ) : (
                    <span className="text-[9px] uppercase tracking-wider text-faint">
                      pronto
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
        {extra}
        <div className="mt-auto border-t border-line pt-4 px-1">
          <div className="flex items-center gap-3">
            <Avatar name={ctx.personName} size={34} />
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{ctx.personName}</p>
              <p className="truncate text-xs text-faint">
                {ctx.roles.map(roleLabel).join(" · ")}
              </p>
            </div>
          </div>
          <form action={signOut}>
            <button
              type="submit"
              className="mt-3 w-full rounded-lg border border-line px-3 py-1.5 text-xs text-muted hover:text-foreground hover:border-line-strong"
            >
              Cerrar sesión
            </button>
          </form>
        </div>
      </aside>

      {/* Contenido */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Header móvil */}
        <header className="md:hidden sticky top-0 z-20 flex items-center justify-between border-b border-line bg-background/90 px-4 py-3 backdrop-blur">
          <span className="flex items-center gap-1.5 font-bold">
            ELEVA<span className="text-accent">.</span>
            <span className="rounded bg-accent-soft px-1 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-accent-strong">
              Alpha
            </span>
          </span>
          <div className="flex items-center gap-2">
            {ctx.isDemo && (
              <span className="rounded-md bg-gold-soft px-2 py-0.5 text-[10px] text-gold">
                demo
              </span>
            )}
            <form action={signOut}>
              <button type="submit" className="text-xs text-muted underline underline-offset-4">
                Salir
              </button>
            </form>
          </div>
        </header>

        <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-6 md:px-8 md:py-8 pb-24 md:pb-8">
          {children}
        </main>

        {/* Bottom nav — móvil */}
        <nav
          aria-label="Principal"
          className="md:hidden fixed inset-x-0 bottom-0 z-20 flex border-t border-line bg-surface/95 backdrop-blur"
        >
          {nav.slice(0, 5).map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active === item.href ? "page" : undefined}
              className={`flex flex-1 flex-col items-center gap-0.5 py-2.5 text-[11px] ${
                active === item.href ? "text-accent-strong" : "text-faint"
              }`}
            >
              <Icon name={item.icon} />
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}

