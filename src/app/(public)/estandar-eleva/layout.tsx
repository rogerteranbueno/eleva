import type { Metadata } from "next"

const BASE_URL = "https://eleva-plataforma.vercel.app"

export const metadata: Metadata = {
  title: "El estándar ELEVA, Formación profesional real para entrenadores y centros",
  description:
    "Qué exige ELEVA para certificar entrenadores, coaches y centros de transformación. No certificamos por asistencia. Certificamos por desempeño observable.",
  metadataBase: new URL(BASE_URL),
  openGraph: {
    title: "El estándar ELEVA, Formación profesional para una industria que necesita elevarse",
    description:
      "Formación filosófica, psicología, seguridad psicológica, diseño instruccional, ética, datos y operación. El nuevo estándar para centros de transformación en LATAM.",
    type: "website",
    url: `${BASE_URL}/estandar-eleva`,
    locale: "es_MX",
    siteName: "ELEVA",
    images: [],
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
