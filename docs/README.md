# Documentación de ELEVA

> Contexto completo del proyecto: qué es, por qué existe, cómo se comunica y cómo está construido.

**Repo:** `elevaapp` · **Producción:** [elevaapp-drab.vercel.app](https://elevaapp-drab.vercel.app) · **Actualizado:** julio 2026

---

## Qué es ELEVA en una frase

> Una firma institucional que profesionaliza centros de transformación en LATAM — formando a su gente, ordenando su operación e instalando los datos para crecer.

La tesis completa: **el límite de los mejores centros no es la metodología, es la organización detrás de ella.**

---

## Los documentos

| # | Documento | Para qué sirve |
|---|---|---|
| 01 | [Visión y propósito](01-VISION-Y-PROPOSITO.md) | La tesis, el posicionamiento, a quién le hablamos y en qué ELEVA se niega a convertirse |
| 02 | [Contexto de industria](02-CONTEXTO-INDUSTRIA.md) | Cómo funciona de verdad un centro: ciclo por fases, roles canónicos, vocabulario, economía |
| 03 | [Modelo de negocio](03-MODELO-DE-NEGOCIO.md) | La escalera comercial, precios, ICP y reglas de la oferta |
| 04 | [Directrices de contenido](04-DIRECTRICES-DE-CONTENIDO.md) | Voz, reglas de copy, prohibiciones y obligaciones legales |
| 05 | [Arquitectura del sitio](05-ARQUITECTURA-DEL-SITIO.md) | Rutas, narrativa del home, navegación |
| 06 | [Arquitectura técnica](06-ARQUITECTURA-TECNICA.md) | Stack, convenciones, patrón Server/Client, deploy |
| 07 | [Producto — ELEVA OS](07-PRODUCTO-ELEVA-OS.md) | Visión del software, las 4 etapas, vistas por rol, estado del demo |
| 08 | [Estado y roadmap](08-ESTADO-Y-ROADMAP.md) | Qué se resolvió, qué falta, en qué orden, cómo filtrar recomendaciones externas |

---

## Por dónde empezar según lo que vayas a hacer

**Escribir o editar copy**
→ [04 · Directrices](04-DIRECTRICES-DE-CONTENIDO.md) primero, luego [02 · Industria](02-CONTEXTO-INDUSTRIA.md) para el vocabulario.

**Tocar código**
→ [06 · Técnica](06-ARQUITECTURA-TECNICA.md). Ojo con la regla de Next.js 16 y el patrón Server/Client.

**Agregar o cambiar una sección del sitio**
→ [05 · Arquitectura del sitio](05-ARQUITECTURA-DEL-SITIO.md) para el arco narrativo y la regla de "el home no crece".

**Construir features del OS**
→ [07 · Producto](07-PRODUCTO-ELEVA-OS.md) + el modelo de roles de [02 · Industria](02-CONTEXTO-INDUSTRIA.md).

**Decidir qué hacer siguiente**
→ [08 · Estado y roadmap](08-ESTADO-Y-ROADMAP.md).

**Evaluar una recomendación externa**
→ [08 · Estado y roadmap](08-ESTADO-Y-ROADMAP.md#cómo-se-evalúan-las-recomendaciones-externas).

---

## Reglas que no se negocian

Estas aparecen desarrolladas en sus documentos, pero se repiten aquí porque romperlas ha costado rehacer trabajo:

1. 🔒 **El material VIA nunca se publica.** Se absorbe como inteligencia de contexto. Sin excepciones. → [04](04-DIRECTRICES-DE-CONTENIDO.md#regla-permanente-material-via)
2. 💰 **El Diagnóstico 360 es pagado.** Lo gratuito es la llamada de calificación previa. → [03](03-MODELO-DE-NEGOCIO.md)
3. 📊 **Ninguna cifra sin origen verificable.** → [04](04-DIRECTRICES-DE-CONTENIDO.md)
4. 🎯 **Un solo CTA principal por página** — "Solicitar diagnóstico" → `/build`. → [04](04-DIRECTRICES-DE-CONTENIDO.md)
5. 🗣️ **Generación, no cohorte. Entrenador, no coach. El seguimiento es de Oficinas.** → [02](02-CONTEXTO-INDUSTRIA.md)
6. 📖 **El dolor antes que el producto.** Nunca abrir con OS, Hub, PACTO o CTF™. → [04](04-DIRECTRICES-DE-CONTENIDO.md)
7. 🚫 **Sin urgencia ni escasez manufacturada.** Es lo que la industria necesita superar. → [01](01-VISION-Y-PROPOSITO.md)
8. 🔀 **Deploy a los dos remotes:** `git push origin main && git push vercel main`. → [06](06-ARQUITECTURA-TECNICA.md)

---

## Documentos previos

`CLOUDCODE_MASTER_BRIEF.md` (junio 2026, raíz del repo) fue el brief original. Sigue siendo útil para el detalle del producto, pero está parcialmente desactualizado: menciona Next.js 15 (hoy 16), la ruta `/demo` (hoy `/vl2026`) y el centro demo "Creania" (hoy "TRANSFORMA"). **Ante cualquier discrepancia, manda `docs/`.**
