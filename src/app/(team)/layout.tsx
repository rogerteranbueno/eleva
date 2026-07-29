import type { ReactNode } from "react";
import { requireTeam, teamHome, type SessionContext } from "@/lib/context";
import { hasCapability } from "@/lib/capabilities";
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
  const comunidad: NavItem = { href: "/comunidad", label: "Comunidad", icon: "generacion" };
  const miGrupo: NavItem = { href: "/mi-grupo", label: "Mi grupo", icon: "equipo" };
  const cobertura: NavItem = { href: "/cobertura", label: "Cobertura", icon: "equipo" };

  if (ctx.roles.includes("dueno")) {
    return [pulso, hoy, generaciones, comunidad, personas, finanzas, agenda, equipo, crm];
  }
  if (ctx.roles.includes("oficinas")) {
    return [hoy, personas, generaciones, comunidad, agenda, crm, finanzas, pulso];
  }
  if (ctx.roles.includes("finanzas")) {
    return [finanzas, hoy, pulso, personas];
  }
  if (ctx.roles.includes("entrenador") || ctx.roles.includes("coach")) {
    return [generaciones, hoy, personas, agenda, ...(hasCapability(ctx, "pulse.read") ? [pulso] : [])];
  }
  if (ctx.roles.includes("capitan")) {
    return [cobertura, hoy, miGrupo, generaciones, personas, agenda];
  }
  if (ctx.roles.includes("staff")) {
    return [miGrupo, generaciones, personas, agenda];
  }
  // dream_team
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
