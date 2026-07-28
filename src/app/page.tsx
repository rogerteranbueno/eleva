import { redirect } from "next/navigation";
import { getSessionContext } from "@/lib/context";

export default async function Home() {
  const ctx = await getSessionContext();
  if (!ctx) redirect("/login");
  redirect(ctx.isTeam ? "/hoy" : "/mi");
}
