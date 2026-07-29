import type { Metadata } from "next";

const BASE_URL = "https://eleva-plataforma.vercel.app";

export const metadata: Metadata = {
  title: "ELEVA Hub Centro — El centro digital de tu comunidad",
  description:
    "Tu centro no termina cuando termina el entrenamiento. Hub Centro es la comunidad privada del centro: generación, centro y alumni, con perfiles, eventos, mensajes y una consola para sostenerla.",
  metadataBase: new URL(BASE_URL),
  openGraph: {
    title: "ELEVA Hub Centro",
    description: "El lugar donde vive la comunidad de tu centro, más allá de una generación.",
    type: "website",
    url: `${BASE_URL}/hub-centro`,
    locale: "es_MX",
    siteName: "ELEVA",
    images: [],
  },
};

export default function HubCentroLayout({ children }: { children: React.ReactNode }) {
  return children;
}
