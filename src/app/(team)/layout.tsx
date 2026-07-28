import type { ReactNode } from "react";
import { requireTeam, can } from "@/lib/context";
import { AppShell, type NavItem } from "@/components/AppShell";

export default async function TeamLayout({ children }: { children: ReactNode }) {
  const ctx = await requireTeam();

  const nav: NavItem[] = [
    { href: "/hoy", label: "Hoy", icon: "hoy" },
    ...(can.viewPulse(ctx)
      ? [{ href: "/pulso", label: "Pulso", icon: "pulso" } as NavItem]
      : []),
    { href: "/personas", label: "Personas", icon: "personas" },
    { href: "/generaciones", label: "Generaciones", icon: "generaciones" },
  ];

  return (
    <AppShell ctx={ctx} nav={nav}>
      {children}
    </AppShell>
  );
}
