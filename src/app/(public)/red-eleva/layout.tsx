import type { Metadata } from "next";

const BASE_URL = "https://eleva-plataforma.vercel.app";

export const metadata: Metadata = {
  title: "Red ELEVA — La red entre personas entrenadas de distintos centros",
  description:
    "Una red opt-in entre personas entrenadas de distintos centros, ciudades y metodologías. Todavía no está abierta: nace de comunidades reales, no de un feed vacío.",
  metadataBase: new URL(BASE_URL),
  openGraph: {
    title: "Red ELEVA",
    description: "Nace de comunidades reales ya activas — nunca como una red vacía.",
    type: "website",
    url: `${BASE_URL}/red-eleva`,
    locale: "es_MX",
    siteName: "ELEVA",
    images: [],
  },
};

export default function RedElevaLayout({ children }: { children: React.ReactNode }) {
  return children;
}
