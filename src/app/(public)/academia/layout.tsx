import type { Metadata } from "next"

const BASE_URL = "https://eleva-plataforma.vercel.app"

export const metadata: Metadata = {
  title: "ELEVA Academy, Formación profesional para entrenadores de transformación",
  description:
    "Certificaciones y programas para coaches, facilitadores y directores de centros de transformación en LATAM. CTF™, DCT™, LCT™ e IFS™.",
  metadataBase: new URL(BASE_URL),
  openGraph: {
    title: "ELEVA Academy, Formación profesional para entrenadores",
    description:
      "La mayoría de los coaches sabe el material. Pocos saben cómo llevarlo a otro ser humano en transformación. ELEVA Academy forma a los segundos.",
    type: "website",
    url: `${BASE_URL}/academia`,
    locale: "es_MX",
    siteName: "ELEVA",
    images: [],
  },
  twitter: {
    card: "summary_large_image",
    title: "ELEVA Academy, Formación profesional para entrenadores",
    description: "Certificaciones CTF™, DCT™, LCT™ e IFS™ para centros de transformación.",
    
  },
}

export default function AcademiaLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
