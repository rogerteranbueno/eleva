import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { LangProvider } from "@/lib/i18n"
import { ThemeProvider } from "@/lib/theme"
import { Analytics } from "@vercel/analytics/next"
import { StickyCtaBanner } from "@/components/StickyCtaBanner"

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
})

const BASE_URL = "https://elevaapp-drab.vercel.app"

export const metadata: Metadata = {
  title: "ELEVA — Formación, operación y crecimiento para centros de transformación",
  description:
    "ELEVA forma a tu equipo, ordena tu operación e instala los datos para crecer. El sistema institucional para centros de transformación en LATAM.",
  metadataBase: new URL(BASE_URL),
  openGraph: {
    title: "ELEVA, El sistema operativo para centros de transformación",
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
        alt: "ELEVA, Sistema operativo para centros de transformación",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ELEVA, El sistema operativo para centros de transformación",
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
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "ELEVA",
    url: BASE_URL,
    logo: `${BASE_URL}/favicon.ico`,
    description: "La firma institucional para centros de transformación en LATAM.",
    email: "hola@elevaapp.io",
    areaServed: ["MX", "CO", "AR", "CL", "PE"],
    sameAs: [],
  }

  return (
    <html lang="es" className={`${inter.variable} dark`} suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen antialiased bg-background text-foreground">
        <ThemeProvider>
          <LangProvider>{children}</LangProvider>
          <StickyCtaBanner />
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
