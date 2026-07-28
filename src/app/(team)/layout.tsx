import type { ReactNode } from "react";
import { requireTeam, can, teamHome, type SessionContext } from "@/lib/context";
import { AppShell, type NavItem } from "@/components/AppShell";
import { DemoGuide } from "@/components/demo/DemoGuide";

/** Cada rol empieza por su trabajo. La nav comparte gramática, no orden. */
function navForRole(ctx: SessionContext): NavItem[] {
  const pulso: NavItem = { href: "/pulso", label: "Pulso", icon: "pulso" };
  const hoy: NavItem = { href: "/hoy", label: "Hoy", icon: "hoy" };
  const personas: NavItem = { href: "/personas", label: "Personas", icon: "personas" };
  const generaciones: NavItem = { href: "/generaciones", label: "Generaciones", icon: "generaciones" };
  const finanzas: NavItem = { href: "/finanzas", label: "Finanzas", icon: "finanzas" };
  const agenda: NavItem = { href: "/agenda", label: "Agenda", icon: "agenda" };
  const equipo: NavItem = { href: "/equipo", label: "Equipo", icon: "equipo" };
  const crm: NavItem = { href: "/crm", label: "CRM", icon: "crm" };

  if (ctx.roles.includes("dueno")) {
    return [pulso, hoy, generaciones, personas, finanzas, agenda, equipo, crm];
  }
  if (ctx.roles.includes("oficinas")) {
    return [hoy, personas, generaciones, agenda, crm, finanzas, pulso];
  }
  if (ctx.roles.includes("finanzas")) {
    return [finanzas, pulso, personas];
  }
  if (ctx.roles.includes("entrenador")) {
    return [generaciones, hoy, personas, agenda, ...(can.viewPulse(ctx) ? [pulso] : [])];
  }
  // staff / dream_team
  return [hoy, generaciones, personas, agenda];
}

export default async function TeamLayout({ children }: { children: ReactNode }) {
  const ctx = await requireTeam();

  return (
    <AppShell
      ctx={ctx}
      nav={navForRole(ctx)}
      homeHref={teamHome(ctx)}
      showSystemMap
      extra={ctx.isDemo ? <DemoGuide roles={ctx.roles} /> : null}
    >
      {children}
    </AppShell>
  );
}
