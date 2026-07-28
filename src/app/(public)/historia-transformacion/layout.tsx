import type { Metadata } from "next"

const BASE_URL = "https://eleva-plataforma.vercel.app"

export const metadata: Metadata = {
  title: "Historia de la transformación, Del est y Lifespring al estándar profesional · ELEVA",
  description:
    "La industria de transformación personal tiene 50 años de historia: est, Lifespring, Landmark y los modelos que influyeron en América Latina. ELEVA estudia esa historia para construir un estándar más profesional.",
  metadataBase: new URL(BASE_URL),
  openGraph: {
    title: "La historia de la transformación, ELEVA",
    description:
      "Werner Erhard, John Hanley, Lifespring, Landmark: lo que la industria aportó, lo que documentó la historia, y por qué ELEVA representa la siguiente etapa profesional.",
    type: "article",
    url: `${BASE_URL}/historia-transformacion`,
    locale: "es_MX",
    siteName: "ELEVA",
    images: [],
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
