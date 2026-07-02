import type { Metadata } from "next"

const BASE_URL = "https://elevaapp-drab.vercel.app"

export const metadata: Metadata = {
  title: "Para tu equipo — ELEVA para directores, coaches, staff y operadores",
  description:
    "Descubre cómo ELEVA transforma el rol de cada persona en tu centro: directores, entrenadores, coordinadores y staff de admisiones.",
  metadataBase: new URL(BASE_URL),
  openGraph: {
    title: "ELEVA — Para cada rol en tu centro de transformación",
    description:
      "Directores, coaches, operadores y staff: ELEVA tiene una propuesta concreta para cada persona que construye el centro.",
    type: "website",
    url: `${BASE_URL}/para-centros`,
    locale: "es_MX",
    siteName: "ELEVA",
    images: [{ url: `${BASE_URL}/og.png`, width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "ELEVA para tu equipo — directores, coaches, staff",
    description: "Una propuesta concreta para cada rol en el centro de transformación.",
    images: [`${BASE_URL}/og.png`],
  },
}

export default function ParaCentrosLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
