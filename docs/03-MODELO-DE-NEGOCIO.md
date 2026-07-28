# 03 · Modelo de negocio

> Qué se vende, a qué precio, en qué orden, y cuáles son las reglas de la oferta.

---

## La escalera comercial

La oferta es una secuencia de tres peldaños. **Nunca se vende el segundo sin el primero.**

```
Llamada de calificación (sin costo)
        ↓
Diagnóstico ELEVA 360 — desde USD $1,500
        ↓
PACTO (implementación) — desde USD $15,000
        ↓
ELEVA Partner — desde USD $1,000/mes
```

---

## Peldaño 0 · Llamada de calificación

- **Costo:** sin costo.
- **Propósito:** verificar fit antes de cobrar nada. Es un filtro, no una venta.
- **Regla de discurso:** esto es lo único gratuito en toda la oferta. Se llama **"llamada de calificación"**, nunca "diagnóstico gratuito".
- Si no hay fit, se dice de frente. Esto es parte de la promesa pública del sitio.

---

## Peldaño 1 · Diagnóstico ELEVA 360

| Campo | Valor |
|---|---|
| **Precio** | Desde USD $1,500 |
| **Duración** | 3 semanas |
| **Entregable** | Plan de acción de 90 días + sesión ejecutiva |

**Qué incluye:**
- Auditoría de ventas y admisiones
- Auditoría de experiencia del participante
- Revisión de staff y roles
- Riesgos operativos y oportunidades
- Plan de 90 días + sesión ejecutiva

**Reglas comerciales:**
- El monto **se descuenta al contratar PACTO**. Esto baja la fricción sin regalar el trabajo.
- Es el CTA principal de todo el sitio. Todos los caminos llevan a `/build`.

> ⚠️ **Regla crítica de copy:** el Diagnóstico 360 es **pagado**. Nunca llamarlo gratuito, sin costo, ni de cortesía. Esta contradicción ya existió en el sitio y fue el hallazgo #1 de dos auditorías independientes.

---

## Peldaño 2 · PACTO (implementación)

| Campo | Valor |
|---|---|
| **Precio** | Desde USD $15,000 |
| **Naturaleza** | Implementación, no formación |

**Qué incluye:**
- Academia interna diseñada
- Formación de entrenadores y staff
- Procesos documentados y listos para usarse
- ELEVA OS instalado y en uso
- Plan de crecimiento a 90 días

**Frase de posicionamiento obligatoria:**
> **"No es un curso. Es una implementación."**

Esta distinción es el diferenciador central contra la competencia (academias que cobran $17.5k por entrenamiento intensivo sin plataforma ni implementación).

---

## Peldaño 3 · ELEVA Partner

| Campo | Valor |
|---|---|
| **Precio** | Desde USD $1,000/mes |
| **Requisito** | Disponible solo tras completar PACTO |

**Qué incluye:**
- Sesiones mensuales de dirección
- Soporte estratégico continuo
- Comunidad de directores LATAM
- Actualizaciones de playbooks
- Benchmark de métricas del sector

Es el ingreso recurrente y el indicador de que la implementación funcionó.

---

## Funnel secundario · ELEVA Academy

Ruta: `/academia`

Dirigido a **entrenadores y coaches individuales**, no a dueños de centro. Certificaciones activas: CTF™, DCT™, LCT™, IFS™.

**Regla de separación:** este funnel no debe contaminar el mensaje del home. El home habla al dueño de centro; la Academia se ofrece como camino alterno desde el hero ("Soy coach o entrenador") y desde el nav.

---

## ⚠️ Inconsistencia pendiente de resolver

Existen **dos estructuras de precio distintas** en el sitio:

| Ruta | Estructura | Estado |
|---|---|---|
| `/` (home, `PreciosPivotSection`) | Diagnóstico $1,500 → PACTO $15,000 → Partner $1,000/mes | ✅ Canónica |
| `/precios` | Base $15,000 / Robusta $30,000 / mantenimiento $699/mes | ⚠️ Funnel de software, no alineado |

`/precios` corresponde a una etapa anterior del proyecto donde ELEVA se vendía como software. **Está pendiente decidir si se unifica o se elimina.** Mientras no se resuelva, un prospecto que llegue a `/precios` por buscador ve una oferta que no coincide con la del home.

**Recomendación:** eliminar `/precios` o convertirla en redirect a `/#como-empezar`. La estructura del home es la que refleja el negocio actual.

> Registrado también en [`08-ESTADO-Y-ROADMAP.md`](08-ESTADO-Y-ROADMAP.md).

---

## Perfil de cliente ideal (ICP)

**Sí es cliente:**
- Centro de transformación con 3–15 años operando
- 50–400 participantes activos
- Metodología propia o de linaje VIA
- El dueño sigue siendo el facilitador principal
- Ya intentó ordenarse con Excel/Notion/CRM genérico y falló
- Presupuesto para una implementación de 5 cifras

**No es cliente (todavía):**
- Coach individual sin centro → va a `/academia`
- Centro de menos de 2 años sin metodología estabilizada
- Quien busca solo software → no hay venta de licencia standalone
- Quien busca resultados garantizados por escrito

---

## Reglas de la oferta

**1. Nunca se promete un resultado numérico.**
Los casos publicados llevan disclaimer: *"Los resultados varían según el punto de partida, el equipo y el nivel de implementación de cada centro."*

**2. Los precios son visibles.**
Decisión deliberada, en contra de la recomendación de algunos asesores externos. Un dueño de centro que no ve precio se va a la competencia. El precio visible filtra mal y califica bien.

**3. Un solo CTA principal por página.**
El CTA es "Solicitar diagnóstico" → `/build`. Los CTA secundarios existen pero no compiten visualmente.

**4. Todo cliente firma NDA.**
Por eso los casos de estudio muestran resultados reales con identidad protegida. Esto se declara abiertamente en el sitio — es un elemento de confianza, no una limitación que esconder.

---

## Documentos relacionados

- [`01-VISION-Y-PROPOSITO.md`](01-VISION-Y-PROPOSITO.md) — a quién le hablamos
- [`04-DIRECTRICES-DE-CONTENIDO.md`](04-DIRECTRICES-DE-CONTENIDO.md) — cómo se comunica la oferta
- [`05-ARQUITECTURA-DEL-SITIO.md`](05-ARQUITECTURA-DEL-SITIO.md) — dónde vive cada pieza
