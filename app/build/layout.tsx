import type { Metadata } from "next"

const BASE_URL = "https://elevaapp-drab.vercel.app"

export const metadata: Metadata = {
  title: "Diagnóstico ELEVA 360 — Agenda una evaluación de tu centro",
  description:
    "Completa el formulario de diagnóstico y el equipo de ELEVA revisará si podemos ayudarte a profesionalizar o escalar tu centro de transformación.",
  metadataBase: new URL(BASE_URL),
  openGraph: {
    title: "Diagnóstico ELEVA 360 — Evalúa tu centro",
    description:
      "5 pasos para entender dónde está tu centro y qué necesita para escalar. El equipo de ELEVA revisará tu perfil y te contactará.",
    type: "website",
    url: `${BASE_URL}/build`,
    locale: "es_MX",
    siteName: "ELEVA",
    images: [{ url: `${BASE_URL}/og.png`, width: 1200, height: 630 }],
  },
  robots: { index: false, follow: false },
}

export default function BuildLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
