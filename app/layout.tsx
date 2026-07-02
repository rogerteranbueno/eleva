import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { LangProvider } from "@/lib/i18n"
import { Analytics } from "@vercel/analytics/next"
import { StickyCtaBanner } from "@/components/StickyCtaBanner"

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
})

const BASE_URL = "https://elevaapp-drab.vercel.app"

export const metadata: Metadata = {
  title: "ELEVA — El sistema operativo para centros de transformación",
  description:
    "ELEVA centraliza la operación, la experiencia del participante y el crecimiento de tu centro en un solo sistema construido para cómo funciona esta industria.",
  metadataBase: new URL(BASE_URL),
  openGraph: {
    title: "ELEVA — El sistema operativo para centros de transformación",
    description: "Si un mal fin de semana pone en riesgo tu centro, necesitas un mejor sistema.",
    type: "website",
    url: BASE_URL,
    locale: "es_MX",
    siteName: "ELEVA",
    images: [
      {
        url: `${BASE_URL}/og.png`,
        width: 1200,
        height: 630,
        alt: "ELEVA — Sistema operativo para centros de transformación",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ELEVA — El sistema operativo para centros de transformación",
    description: "Si un mal fin de semana pone en riesgo tu centro, necesitas un mejor sistema.",
    images: [`${BASE_URL}/og.png`],
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className={`${inter.variable} dark`} suppressHydrationWarning>
      <body className="min-h-screen antialiased bg-background text-foreground">
        <LangProvider>{children}</LangProvider>
        <StickyCtaBanner />
        <Analytics />
      </body>
    </html>
  )
}
