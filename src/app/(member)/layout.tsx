import type { ReactNode } from "react";
import { requireMember } from "@/lib/context";
import { AppShell, type NavItem } from "@/components/AppShell";

export default async function MemberLayout({
  children,
}: {
  children: ReactNode;
}) {
  const ctx = await requireMember();

  const nav: NavItem[] = [
    { href: "/mi", label: "Inicio", icon: "inicio" },
    { href: "/mi/generacion", label: "Mi generación", icon: "generacion" },
    { href: "/mi/eventos", label: "Eventos", icon: "eventos" },
  ];

  return (
    <AppShell ctx={ctx} nav={nav}>
      {children}
    </AppShell>
  );
}
