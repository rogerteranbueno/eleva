# 08 · Estado y roadmap

> Dónde está el proyecto hoy, qué se resolvió, qué falta y en qué orden.

**Última actualización:** julio 2026

---

## Historia de las reestructuraciones

El sitio pasó por tres correcciones grandes, todas originadas en auditorías externas y en la crítica del propio fundador ("lo siento abrumador y sin storytelling").

### Sprint 1 · Credibilidad
El sitio publicaba cifras que no se podían defender.

- Eliminados: "40+ coaches certificados", "6 países en LATAM", "+240% crecimiento", "3.2×"
- "El 90% de los coaches" → "La gran mayoría de los coaches"
- `NumbersSection` reencuadrada: *"Lo que observamos cuando los centros operan con datos"* + disclaimer de variación
- **Contradicción resuelta:** el sitio ofrecía "diagnóstico gratuito" y cobraba $1,500. Ahora: llamada de calificación sin costo → Diagnóstico 360 pagado, descontable de PACTO

### Sprint 2 · Claridad y prueba
- Dos caminos explícitos en el hero: "Dirijo un centro" / "Soy coach o entrenador"
- Nueva página `/caso` — caso real bajo NDA con métricas antes/después
- Nav reducido de 4+ enlaces abstractos a 3 concretos

### Sprint 3 · Narrativa
El sitio abría con vocabulario de producto antes de que el visitante reconociera su problema.

- Hero reescrito: *"Tu metodología funciona. El centro todavía depende solo de ti."*
- Nuevas secciones: `ProblemaSection`, `SolucionSection`, `CasoTeaserSection`
- Retiradas del home: `QueHaceSection`, `PACTOSection`
- Orden nuevo: hero → problema → solución → prueba → precios → testimonios → historia → cierre

### Sprint 4 · SEO y legal
- **SSR del home** — se quitó `"use client"` de `app/page.tsx` extrayendo el `Nav`. Google recibía HTML vacío
- JSON-LD `Organization` en `layout.tsx`
- `robots.ts` creado; `sitemap.ts` corregido (tenía rutas inexistentes)
- `/privacidad` y `/terminos` creadas y enlazadas desde el footer
- Footer: enlaces rotos corregidos (`#programas`, `#precios` apuntaban a anclas eliminadas)

---

## Estado actual

### ✅ Resuelto
- Narrativa de conversión completa en el home
- Credibilidad: sin cifras indefendibles
- Oferta coherente en el home (Diagnóstico → PACTO → Partner)
- Caso de estudio real publicado
- SSR, JSON-LD, sitemap, robots
- Páginas legales
- Demo funcional por rol en `/vl2026`

### ⚠️ Abierto

| Ítem | Impacto | Detalle |
|---|---|---|
| **`/precios` desalineada** | Alto | Muestra $15k/$30k/$699mes vs. el home $1,500/$15k/$1,000mes. Un prospecto que llegue por buscador ve otra oferta |
| **Sin "personas reales"** | Alto | No hay página de equipo. Vender profesionalización sin mostrar quién está detrás es una brecha de confianza |
| **Sin WhatsApp visible** | Medio | En LATAM el dueño impaciente quiere hablar directo. Única recomendación aprovechable del último informe externo |
| **Sin blog / recursos activos** | Medio | No hay contenido que capture búsqueda long-tail |
| **Sin analytics de conversión** | Medio | Hay Vercel Analytics (tráfico) pero no eventos de CTA ni embudo |
| **Sin fotos reales** | Medio | Depende de material que el cliente debe proveer |
| **Componentes huérfanos** | Bajo | ~9 secciones de landing sin uso |
| **Referencias residuales** | Bajo | `creania.eleva.app` en demo; "LEVEL" en `ShareProgressCard.tsx:113` |
| **Sin tests** | Bajo | No hay suite |

---

## Roadmap sugerido

### Prioridad 1 — Coherencia comercial
1. **Resolver `/precios`.** Redirigir a `/#como-empezar` o rehacerla con la estructura canónica. Es la única inconsistencia que un prospecto puede ver.
2. **WhatsApp en footer y nav.** Cambio pequeño, alto retorno en LATAM.

### Prioridad 2 — Confianza
3. **Página de equipo.** Quiénes son, qué han hecho, por qué saben de esta industria. Es la brecha de confianza más grande que queda.
4. **Eventos de conversión.** Instrumentar clics de CTA y envíos de `/build` para poder optimizar con datos.

### Prioridad 3 — Adquisición
5. **Blog / recursos** con 3–5 artículos de fondo (CAC vs LTV en centros, continuidad entre fases, cómo formar Oficinas).
6. **Fotos reales** de entrenamientos, sujeto a material disponible y a los NDA vigentes.

### Prioridad 4 — Higiene
7. Limpiar componentes huérfanos y referencias residuales.
8. Evaluar consolidar rutas de profundidad (`/metodo`, `/estandar-eleva`, `/recursos`, `/funcionalidades`, `/para-centros`, `/numeros` se solapan).

---

## Cómo se evalúan las recomendaciones externas

El proyecto ha recibido varios informes de deep research. **No todos son aplicables.** Criterios de filtro:

| Aceptar si… | Rechazar si… |
|---|---|
| Señala una contradicción verificable en el sitio | Propone copy genérico intercambiable |
| Corrige un problema técnico medible (SEO, accesibilidad) | Pide ocultar precios |
| Aporta una pieza de confianza que falta | Sugiere cifras que no podemos documentar |
| Respeta el arco narrativo | Propone urgencia o escasez manufacturada |
| | Recomienda usar marcas de terceros como aval |

**Ejemplo real:** un informe recomendó publicar *"El 85% de nuestros centros reportan aumento en retención"* y ocultar precios. Ambas se rechazaron — la primera reintroduce el problema que costó el Sprint 1; la segunda contradice la decisión deliberada de precio visible. Del mismo informe **sí** se tomó la recomendación de WhatsApp visible.

> Ver criterios completos en [`04-DIRECTRICES-DE-CONTENIDO.md`](04-DIRECTRICES-DE-CONTENIDO.md).

---

## Documentos relacionados

- [`03-MODELO-DE-NEGOCIO.md`](03-MODELO-DE-NEGOCIO.md) — la inconsistencia de `/precios`
- [`06-ARQUITECTURA-TECNICA.md`](06-ARQUITECTURA-TECNICA.md) — deuda técnica
