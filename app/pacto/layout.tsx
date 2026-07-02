import type { Metadata } from "next"

const BASE_URL = "https://elevaapp-drab.vercel.app"

export const metadata: Metadata = {
  title: "PACTO, Programa de Aceleración para Centros de Transformación · ELEVA",
  description:
    "16 semanas. 12 módulos. 8 entregables. PACTO instala la academia interna, los procesos y el sistema de crecimiento que tu centro necesita para escalar.",
  metadataBase: new URL(BASE_URL),
  openGraph: {
    title: "PACTO, Implementación intensiva para centros de transformación",
    description:
      "PACTO no es una capacitación. Es capacidad instalada. Academia interna, playbooks, ELEVA OS y plan de crecimiento en 16 semanas.",
    type: "website",
    url: `${BASE_URL}/pacto`,
    locale: "es_MX",
    siteName: "ELEVA",
    images: [{ url: `${BASE_URL}/og.png`, width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "PACTO, Programa de Aceleración · ELEVA",
    description: "16 semanas. 12 módulos. 8 entregables. Capacidad instalada, no consultoría.",
    images: [`${BASE_URL}/og.png`],
  },
}

export default function PactoLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
