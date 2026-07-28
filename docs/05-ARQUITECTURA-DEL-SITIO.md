# 05 · Arquitectura del sitio

> Qué rutas existen, qué hace cada una, y cómo está construida la narrativa del home.

---

## Mapa de rutas

### Rutas principales (funnel de conversión)

| Ruta | Rol | Estado |
|---|---|---|
| `/` | Home — narrativa completa de conversión | ✅ Canónica |
| `/caso` | Caso de estudio real (TRANSFORMA Medellín, NDA) | ✅ Prueba social principal |
| `/build` | Formulario de solicitud de Diagnóstico 360 | ✅ Destino de todos los CTA |
| `/academia` | Funnel secundario — entrenadores y coaches | ✅ Activa |
| `/pacto` | Alcance detallado de la implementación | ✅ Activa |

### Rutas de profundidad (contenido de apoyo)

| Ruta | Rol |
|---|---|
| `/historia-transformacion` | 60 años de industria + disclaimer legal de no-afiliación |
| `/metodo` | Método y ELEVA OS |
| `/estandar-eleva` | Frameworks internos (CMM, TRS, PCS, TOS, RCP) |
| `/recursos` | Manifiesto y material de fondo |
| `/numeros` | Métricas del sector |
| `/simulador` | Simulador de proyección para centros |
| `/funcionalidades` | Detalle de features del OS |
| `/para-centros` | Página de oferta para dueños |

### Legal

| Ruta | Rol |
|---|---|
| `/privacidad` | Aviso de privacidad — 8 secciones, derechos ARCO |
| `/terminos` | Términos y condiciones — 9 secciones, ley mexicana |

### Demo interactivo

`/vl2026/*` — demo funcional con centro ficticio. Ver [`07-PRODUCTO-ELEVA-OS.md`](07-PRODUCTO-ELEVA-OS.md).

### ⚠️ Ruta en conflicto

| Ruta | Problema |
|---|---|
| `/precios` | Estructura de precio de software ($15k/$30k/$699mes) que **no coincide** con la del home ($1,500/$15,000/$1,000mes). Pendiente unificar o eliminar. |

---

## Narrativa del home

El home sigue el arco obligatorio de [`04-DIRECTRICES-DE-CONTENIDO.md`](04-DIRECTRICES-DE-CONTENIDO.md#estructura-narrativa-obligatoria). Orden de secciones en `app/page.tsx`:

```
1. HeroSection          →  Reconocimiento
2. ProblemaSection      →  Nombrar el problema
3. SolucionSection      →  Qué hacemos, en orden
4. CasoTeaserSection    →  Prueba
5. PreciosPivotSection  →  Cómo empezar  (id: #como-empezar)
6. TestimonialsSection  →  Más prueba
7. HistoriaTeaserSection→  Contexto y autoridad
8. CierreSection        →  Acción
```

### Sección por sección

**1 · HeroSection**
- Titular: *"Tu metodología funciona. El centro todavía depende solo de ti."*
- Sub: el límite no es la metodología, es la organización detrás.
- Dos caminos: **"Dirijo un centro"** → `#problema` · **"Soy coach o entrenador"** → `/academia`
- CTA primario: "Solicitar diagnóstico" → `/build`

> El titular valida antes de confrontar. La primera frase le da la razón; la segunda nombra el problema.

**2 · ProblemaSection** (`id="problema"`)
- *"No es la metodología. Es la organización detrás."*
- Tres tarjetas de dolor: el dueño como cuello de botella (rojo), sin datos sin defensa (naranja), metodología que no se transfiere (ámbar).

**3 · SolucionSection** (`id="como-funciona"`)
- *"ELEVA hace tres cosas, en este orden."*
- 01 Formamos a tu gente · 02 Ordenamos tu operación · 03 Construimos el crecimiento
- El orden numerado es intencional — ver [`01-VISION-Y-PROPOSITO.md`](01-VISION-Y-PROPOSITO.md).

**4 · CasoTeaserSection**
- Pull quote + tres métricas: 89→247 participantes · 28%→8% churn · $38k→$112k ingresos
- Enlace a `/caso`

**5 · PreciosPivotSection** (`id="como-empezar"`)
- Los tres peldaños con precios visibles. Ver [`03-MODELO-DE-NEGOCIO.md`](03-MODELO-DE-NEGOCIO.md).

**6 · TestimonialsSection** — testimonios bajo NDA + enlace al caso completo.

**7 · HistoriaTeaserSection** — timeline de 60 años + enlace a `/historia-transformacion`.

**8 · CierreSection**
- *"Empieza por saber exactamente dónde estás."*
- CTA: "Solicitar Diagnóstico 360" → `/build`
- Tres bullets de confianza: llamada de calificación sin costo · respuesta en <24h · si no hay fit, se dice de frente.

---

## Navegación

**Nav (3 enlaces, deliberadamente mínimo):**

| Enlace | Destino |
|---|---|
| Academia | `/academia` |
| Caso real | `/caso` |
| Precios | `#como-empezar` |
| **Agendar diagnóstico** (botón) | `/build` |

> El nav tenía 4+ enlaces con etiquetas abstractas ("Sistema", "Programas"). Se redujo a tres porque cada enlace extra en el nav es una salida del funnel.

**Footer:** Servicios (PACTO, Academy, Caso, Precios) · Iniciar (diagnóstico, PACTO, email) · Legal (Privacidad, Términos).

---

## Componentes de landing sin uso

Tras las reestructuraciones quedaron componentes huérfanos en `components/landing/`. No se han borrado por si se retoman, pero **no están en el home**:

`LegacySection` · `TesisSection` · `DivisionesSection` · `CicloSection` · `MarcosSection` · `NoHacemosSection` · `QueHaceSection` · `PACTOSection` · `GrowthEngineSection`

> Antes de crear un componente nuevo, revisar si alguno de estos ya resuelve el caso.

---

## Reglas de arquitectura

**1. El home no crece.** Sección nueva en el home = sección vieja que sale. Ocho bloques es el techo.

**2. La profundidad vive en rutas propias.** Frameworks, manifiesto y material conceptual van a `/recursos` o `/estandar-eleva`, nunca al home.

**3. Los anchors deben existir.** `#como-empezar`, `#problema` y `#como-funciona` están definidos en `app/page.tsx` y en las secciones. Un enlace a un ancla inexistente no falla visiblemente — falla en silencio.

**4. Toda ruta pública va al sitemap.** `app/sitemap.ts`.

---

## Documentos relacionados

- [`04-DIRECTRICES-DE-CONTENIDO.md`](04-DIRECTRICES-DE-CONTENIDO.md) — el arco narrativo
- [`06-ARQUITECTURA-TECNICA.md`](06-ARQUITECTURA-TECNICA.md) — cómo está construido
