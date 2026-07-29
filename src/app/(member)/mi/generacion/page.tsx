import { redirect } from "next/navigation";

/** La conversación de generación ahora es una pestaña dentro de Comunidad:
 *  la generación dejó de ser el único lugar donde existe el centro. */
export default function GeneracionRedirect() {
  redirect("/mi/comunidad");
}
