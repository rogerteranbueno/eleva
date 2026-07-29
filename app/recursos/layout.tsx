import type { Metadata } from "next"

const BASE_URL = "https://elevaapp-drab.vercel.app"

export const metadata: Metadata = {
  title: "Manifiesto Institucional, ELEVA · Por qué existimos",
  description:
    "El manifiesto, los principios y los marcos de trabajo que guían todo lo que ELEVA hace. Por qué creemos que los centros de transformación merecen una infraestructura profesional.",
  metadataBase: new URL(BASE_URL),
  openGraph: {
    title: "Manifiesto ELEVA, Por qué existimos",
    description:
      "La siguiente generación de centros no se construye sólo en la sala. Se construye con formación, sistemas, estándares y datos.",
    type: "website",
    url: `${BASE_URL}/recursos`,
    locale: "es_MX",
    siteName: "ELEVA",
    images: [{ url: `${BASE_URL}/og.png`, width: 1200, height: 630 }],
  },
}

export default function RecursosLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
