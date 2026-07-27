import type { MetadataRoute } from "next"

const BASE_URL = "https://elevaapp-drab.vercel.app"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/actions/"],
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
  }
}
