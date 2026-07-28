# 04 · Directrices de contenido

> Cómo se escribe ELEVA. Reglas de voz, vocabulario, prohibiciones y obligaciones legales.

Este documento tiene prioridad sobre cualquier recomendación externa de marketing. Varias de sus reglas nacieron de errores reales que ya costaron rehacer el sitio.

---

## Regla permanente: material VIA

> 🔒 **Los manuales de entrenamiento VIA y el material metodológico de centros clientes se absorben como inteligencia de contexto. NUNCA se publican en el sitio ni en el producto.**

Esto aplica a:
- Contenido de manuales de entrenamiento
- Estructuras de ejercicios y dinámicas
- Guiones de facilitación
- Material propietario de cualquier centro cliente

**Qué sí se puede hacer:** usar ese conocimiento para escribir con precisión sobre la industria, nombrar correctamente las fases y roles, y diseñar features que correspondan a la operación real.

**Qué no:** reproducir, parafrasear de cerca, o publicar ese material en cualquier superficie pública.

Esta restricción es permanente y no admite excepciones por conveniencia comercial.

---

## Voz

**Somos un par técnico que conoce la industria, no un vendedor.**

| Atributo | Sí | No |
|---|---|---|
| **Registro** | Directo, adulto, específico | Motivacional, inspiracional, épico |
| **Autoridad** | Por conocimiento demostrado de la mecánica | Por adjetivos ("líderes", "revolucionario") |
| **Ritmo** | Frases cortas. Puntos finales. | Párrafos densos con subordinadas |
| **Postura** | Diagnóstico honesto, incluso incómodo | Complacencia con el prospecto |

**Prueba de fuego:** si la frase podría estar en el sitio de cualquier consultora, está mal. Debe sonar a alguien que ha estado dentro de un centro un domingo a las 11pm.

**Ejemplo del estándar:**

> ✅ *"Tú facilitas, vendes y administras al mismo tiempo. Cuando fallas o te vas, el centro se detiene. No es sostenible y los dos lo sabemos."*
>
> ❌ *"ELEVA acompaña a Centros de Transformación a crecer de manera sostenible."*

El primero nombra el dolor con precisión. El segundo es un slogan intercambiable.

---

## Reglas de copy no negociables

### 1. El Diagnóstico 360 es pagado
Nunca "gratuito", "sin costo", ni "de cortesía". Lo único sin costo es la **llamada de calificación** previa. Esta contradicción fue el hallazgo #1 de dos auditorías independientes.

### 2. Un solo CTA principal por página
El CTA es **"Solicitar diagnóstico"** → `/build`. Los secundarios existen pero no compiten visualmente (peso, color, tamaño).

### 3. Ninguna cifra sin origen verificable
Si no se puede documentar, se quita o se reformula como observación cualitativa con disclaimer.

| ❌ Antes | ✅ Después |
|---|---|
| "40+ coaches certificados" | "4 certificaciones activas — CTF™, DCT™, LCT™, IFS™" |
| "6 países en LATAM" | *(eliminado)* |
| "El 90% de los coaches…" | "La gran mayoría de los coaches…" |
| "+240% crecimiento promedio" | *(eliminado — no defendible)* |

Encabezado obligatorio en secciones de métricas: *"Lo que observamos cuando los centros operan con datos."* — enmarca como observación interna, no como promesa.

### 4. Vocabulario aterrizado
| ❌ Evitar | ✅ Usar |
|---|---|
| "institución escalable" | "procesos, equipo y sistema listos para usarse" |
| "capacidad instalada" | "gente formada que puede operar sin ti" |
| "transformación digital" | "ordenar la operación" |
| "arquitectura de infraestructura" | "el sistema que usa tu equipo todos los días" |

### 5. Vocabulario de industria
Ver [`02-CONTEXTO-INDUSTRIA.md`](02-CONTEXTO-INDUSTRIA.md#3-vocabulario-canónico). Resumen: **Generación** (no cohorte), **Entrenador** (no coach a secas), **Oficinas**, **Grupo pequeño**, **Participante**.

### 6. PACTO se posiciona con una frase fija
> **"No es un curso. Es una implementación."**

---

## Prohibiciones

Estas prácticas son exactamente lo que la industria necesita superar. Usarlas contradice la tesis del proyecto.

- ❌ **Urgencia manufacturada** — "solo quedan 5 cupos", "última oportunidad", contadores regresivos
- ❌ **Escasez falsa** — cupos limitados que no son limitados
- ❌ **Presión emocional** — "tu legado te espera", "no dejes pasar esta oportunidad"
- ❌ **Promesas de resultado** — cualquier cifra prometida de crecimiento, retención o facturación
- ❌ **Testimonios sin respaldo** — todo testimonio corresponde a un cliente real bajo NDA
- ❌ **Nombres de terceros como aval** — no se usan marcas de formadores externos para prestar credibilidad

> Si el sitio suena como el marketing que la industria necesita superar, el sitio está mal.

---

## Obligaciones legales

### Disclaimer de resultados
Obligatorio en toda página con métricas de caso:
> *"Los resultados varían según el punto de partida, el equipo y el nivel de implementación de cada centro."*

### Disclaimer de no-afiliación
Obligatorio en `/historia-transformacion`. El contenido menciona est, Landmark, Lifespring y Werner Erhard como contexto histórico. Debe quedar explícito que **ELEVA no tiene afiliación con ninguna de esas organizaciones**.

### NDA y casos de estudio
Todo cliente firma NDA. Los casos muestran resultados reales con identidad protegida. Esto se declara abiertamente — es señal de confianza, no limitación a esconder:
> *"Datos reales · Identidad protegida por NDA"*

### Páginas legales
`/privacidad` y `/terminos` deben estar enlazadas desde el footer en todo momento.

---

## Estructura narrativa obligatoria

Toda página de conversión sigue este arco. Saltarse un paso es lo que hacía denso al sitio anterior:

```
Reconocimiento del dolor  →  el visitante se ve retratado
        ↓
Nombrar el problema        →  el problema tiene estructura, no es culpa suya
        ↓
Solución ordenada          →  qué hacemos y en qué orden
        ↓
Prueba                     →  caso real con datos
        ↓
Acción                     →  un CTA, sin ambigüedad
```

**El error a evitar:** abrir con vocabulario de producto (OS, Hub, PACTO, CTF™) antes de que el visitante reconozca su propio problema. El producto se nombra **después** del dolor, nunca antes.

---

## Bilingüe (ES / EN)

El sitio soporta ES/EN vía `useLang()` de `lib/i18n.tsx`.

- **ES es el idioma canónico.** Se escribe primero y es el que se revisa.
- EN es traducción funcional, no adaptación creativa.
- El selector vive en el nav.
- Al agregar copy nuevo con `lang === "en" ? … : …`, verificar que ambas ramas existan — una rama vacía rompe el layout.

---

## Checklist antes de publicar copy

- [ ] ¿Alguna cifra sin origen verificable?
- [ ] ¿Dice "diagnóstico gratuito" en algún lado?
- [ ] ¿Hay más de un CTA compitiendo?
- [ ] ¿Usa "cohorte" en vez de "generación"?
- [ ] ¿Nombra el producto antes que el dolor?
- [ ] ¿Hay urgencia o escasez manufacturada?
- [ ] ¿Las páginas con métricas llevan disclaimer?
- [ ] ¿Se filtró material VIA?

---

## Documentos relacionados

- [`01-VISION-Y-PROPOSITO.md`](01-VISION-Y-PROPOSITO.md) — en qué ELEVA se niega a convertirse
- [`02-CONTEXTO-INDUSTRIA.md`](02-CONTEXTO-INDUSTRIA.md) — vocabulario canónico
- [`03-MODELO-DE-NEGOCIO.md`](03-MODELO-DE-NEGOCIO.md) — reglas de la oferta
