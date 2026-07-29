import type { MetadataRoute } from "next"

const BASE_URL = "https://elevaapp-drab.vercel.app"

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: BASE_URL,                              lastModified: new Date(), changeFrequency: "weekly",  priority: 1.0 },
    { url: `${BASE_URL}/caso`,                    lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE_URL}/academia`,                lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE_URL}/build`,                   lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/pacto`,                   lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/metodo`,                  lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE_URL}/historia-transformacion`, lastModified: new Date(), changeFrequency: "yearly",  priority: 0.5 },
    { url: `${BASE_URL}/recursos`,                lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/privacidad`,              lastModified: new Date(), changeFrequency: "yearly",  priority: 0.3 },
    { url: `${BASE_URL}/terminos`,                lastModified: new Date(), changeFrequency: "yearly",  priority: 0.3 },
  ]
}
