# 06 · Arquitectura técnica

> Stack, convenciones, patrones y deploy.

---

## ⚠️ Regla previa a tocar código

El repo corre **Next.js 16**, que tiene breaking changes respecto a versiones anteriores. Del `AGENTS.md` del repo:

> *This is NOT the Next.js you know. APIs, conventions and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code.*

Antes de usar cualquier API de Next que no esté ya presente en el código, leer la guía correspondiente en `node_modules/next/dist/docs/`.

---

## Stack

| Capa | Tecnología |
|---|---|
| Framework | Next.js 16.2.7 (App Router) |
| React | 19.2.4 |
| Lenguaje | TypeScript 5 (strict) |
| Estilos | Tailwind CSS 4 |
| Animación | Framer Motion 12 |
| Iconos | Lucide React |
| Gráficas | Recharts 3 |
| UI base | shadcn + `@base-ui/react` |
| Analytics | `@vercel/analytics` |
| Deploy | Vercel |

---

## Estructura

```
app/
  layout.tsx            # Root: metadata, JSON-LD, providers
  page.tsx              # Home — Server Component
  sitemap.ts            # Sitemap dinámico
  robots.ts             # robots.txt
  privacidad/           # Legal
  terminos/             # Legal
  caso/ academia/ build/ pacto/ …
  vl2026/               # Demo interactivo
components/
  landing/              # Secciones del sitio público
  demo/                 # Componentes del demo
  ui/                   # Primitivos shadcn
lib/
  i18n.tsx              # useLang() — ES/EN
  theme.tsx             # useTheme() — dark/light
  demo-store.tsx        # useDemoStore() — estado del demo
  types.ts              # Tipos compartidos
  use-in-view.ts        # Hook de scroll reveal
  utils.ts              # cn()
data/
  level.ts              # Fuente de verdad del demo
docs/                   # Esta documentación
```

---

## Patrón crítico: Server vs Client Components

**El home es Server Component.** Esto es SEO, no preferencia estética.

```tsx
// app/page.tsx — SIN "use client"
import { Nav } from "@/components/landing/Nav"

export default function HomePage() {
  return <><Nav /><main>…</main></>
}
```

Si `page.tsx` lleva `"use client"`, toda la página se renderiza en cliente y **Google recibe HTML vacío**. Este bug existió y se corrigió extrayendo el `Nav` (que sí necesita estado) a su propio archivo cliente.

**La regla:**
> Las páginas son Server Components. Los componentes que necesitan estado, hooks o eventos llevan `"use client"` **en su propio archivo**, y la página los importa.

Componentes que necesitan `"use client"`: cualquiera con `useState`, `useLang()`, `useTheme()`, `useInView()`, `motion.*` o handlers.

---

## Convenciones de código

**Animación de secciones** — patrón estándar:

```tsx
"use client"
import { motion } from "framer-motion"
import { useInView } from "@/lib/use-in-view"

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number]

export function MiSeccion() {
  const { ref, inView } = useInView(0.1)
  return (
    <section ref={ref} className="py-20 px-6 max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, ease, delay: i * 0.1 }}
      >…</motion.div>
    </section>
  )
}
```

**Estilos**
- Utilities custom: `glass`, `glass-violet`, `glass-cyan` (en `globals.css`).
- Colores por tokens semánticos: `text-foreground`, `text-muted-foreground`, `border-border`, `bg-background`. **Nunca** `text-white` o `text-black` directo — rompe el modo claro.
- Acento de marca: `violet-600` / `violet-400`.
- Semáforo: rojo (crítico) → naranja → ámbar → emerald (bien).
- Combinar clases con `cn()` de `@/lib/utils`.

**TypeScript**
- Strict mode. Todo debe pasar `npx tsc --noEmit`.
- Tipos compartidos en `lib/types.ts`.

**Datos**
- El demo lee de `data/level.ts`. **No hardcodear datos inline** en componentes — facilita la transición a datos reales.

---

## SEO

Implementado:

| Pieza | Ubicación |
|---|---|
| Metadata (title, description, OG, Twitter) | `app/layout.tsx` |
| JSON-LD `Organization` | `app/layout.tsx` (inyectado en `<head>`) |
| Sitemap | `app/sitemap.ts` |
| robots.txt | `app/robots.ts` (disallow `/api/`, `/actions/`) |
| SSR del home | `app/page.tsx` sin `"use client"` |

Al agregar una ruta pública nueva: añadirla a `app/sitemap.ts` y darle `export const metadata` propia.

---

## Deploy

**Dos remotes.** Hay que empujar a los dos:

```bash
git push origin main && git push vercel main
```

| Remote | Repo | Rol |
|---|---|---|
| `origin` | `Estudio-Oasis/elevaapp` | Repo de equipo |
| `vercel` | `rogerteranbueno/eleva` | **Dispara el deploy** |

Producción: `https://elevaapp-drab.vercel.app`

**Dev local** — la config de launch se llama `eleva-dev` (puerto 3000). Usar las herramientas de preview, no `npm run dev` en background.

---

## Deuda técnica conocida

| Ítem | Detalle |
|---|---|
| `/precios` desalineada | Estructura de precio que contradice el home |
| Componentes huérfanos | ~9 secciones de landing sin uso en `components/landing/` |
| Referencias `creania.eleva.app` | Placeholders en `components/demo/` — el Hub real es `creania.vercel.app` |
| "LEVEL" residual | `ShareProgressCard.tsx:113` menciona LEVEL; el centro demo es TRANSFORMA |
| Sin tests | No hay suite de pruebas |

---

## Documentos relacionados

- [`05-ARQUITECTURA-DEL-SITIO.md`](05-ARQUITECTURA-DEL-SITIO.md) — rutas y narrativa
- [`08-ESTADO-Y-ROADMAP.md`](08-ESTADO-Y-ROADMAP.md) — prioridades
