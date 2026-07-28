import type { ReactNode } from "react";
import { requireMember } from "@/lib/context";
import { AppShell, type NavItem } from "@/components/AppShell";
import { DemoGuide } from "@/components/demo/DemoGuide";

export default async function MemberLayout({
  children,
}: {
  children: ReactNode;
}) {
  const ctx = await requireMember();

  const nav: NavItem[] = [
    { href: "/mi", label: "Inicio", icon: "inicio" },
    { href: "/mi/generacion", label: "Mi generación", icon: "generacion" },
    { href: "/mi/personas", label: "Personas", icon: "personas" },
    { href: "/mi/eventos", label: "Eventos", icon: "eventos" },
    { href: "/mi/avisos", label: "Avisos", icon: "avisos" },
    { href: "/mi/perfil", label: "Mi perfil", icon: "perfil" },
  ];

  return (
    <AppShell
      ctx={ctx}
      nav={nav}
      homeHref="/mi"
      extra={ctx.isDemo ? <DemoGuide roles={ctx.roles} /> : null}
    >
      {children}
    </AppShell>
  );
}
