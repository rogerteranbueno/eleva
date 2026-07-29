import type { ReactNode } from "react";
import { requireMember } from "@/lib/context";
import { createUserClient } from "@/lib/supabase/server";
import { AppShell, type NavItem } from "@/components/AppShell";
import { DemoGuide } from "@/components/demo/DemoGuide";

export default async function MemberLayout({ children }: { children: ReactNode }) {
  const ctx = await requireMember();
  const supabase = await createUserClient();

  const { count } = await supabase
    .from("notifications")
    .select("id", { count: "exact", head: true })
    .eq("person_id", ctx.personId)
    .eq("read", false);

  /**
   * Cinco destinos, y el perfil entre ellos.
   *
   * Antes la barra móvil tomaba los primeros cinco de una lista de seis y
   * "Mi perfil" desaparecía justo en el dispositivo donde vive una red social.
   * Los avisos se mudaron a la campana del header.
   */
  const nav: NavItem[] = [
    { href: "/mi", label: "Inicio", icon: "inicio" },
    { href: "/mi/comunidad", label: "Comunidad", icon: "generacion" },
    { href: "/mi/eventos", label: "Eventos", icon: "eventos" },
    { href: "/mi/personas", label: "Personas", icon: "personas" },
    { href: "/mi/mensajes", label: "Mensajes", icon: "avisos" },
    { href: "/mi/perfil", label: "Mi perfil", icon: "perfil" },
  ];

  return (
    <AppShell
      ctx={ctx}
      nav={nav}
      homeHref="/mi"
      notificationsHref="/mi/avisos"
      unreadCount={count ?? 0}
      extra={ctx.isDemo ? <DemoGuide roles={ctx.roles} /> : null}
    >
      {children}
    </AppShell>
  );
}
