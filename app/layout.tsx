import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
})

export const metadata: Metadata = {
  title: "ELEVA — El sistema operativo para centros de transformación",
  description:
    "ELEVA centraliza la operación, la experiencia del participante y el crecimiento de tu centro en un solo sistema construido para cómo funciona esta industria.",
  openGraph: {
    title: "ELEVA — El sistema operativo para centros de transformación",
    description: "Si un mal fin de semana pone en riesgo tu centro, necesitas un mejor sistema.",
    type: "website",
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
        {children}
      </body>
    </html>
  )
}
