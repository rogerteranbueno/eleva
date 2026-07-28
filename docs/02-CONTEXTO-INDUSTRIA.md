# 02 · Contexto de industria

> Cómo funciona de verdad un centro de transformación. Este documento es el que evita que se construyan features y copy que no corresponden a la realidad del negocio.

Un centro de transformación **no es un gym, ni una escuela, ni una consultora**. Tiene una mecánica propia. Entenderla es la ventaja competitiva del proyecto.

---

## 1. El ciclo por fases

La estructura típica (linaje VIA, que es el más común en LATAM):

### Entrenamiento 1 — Básico / Posibilidad / Despertar
- **Duración:** 3 días — viernes noche, sábado completo, domingo completo.
- Jornadas de 12–16 horas. Emocionalmente intensas.
- La persona casi siempre llega **invitada** por alguien que ya vivió el proceso.
- El centro cobra cuota de inscripción.
- Aquí comienza la relación con el centro.

### Entrenamiento 2 — Avanzado
- Mismo formato de 3 días.
- Profundiza la experiencia y aumenta el compromiso.
- El siguiente paso (PL) frecuentemente se vende al cierre de este fin de semana.

### Entrenamiento 3 — PL / VIA / Liderazgo
- **Duración:** varios meses (4–12 según el centro).
- Se estructura en fines de semana temáticos: **Visión → Intimar → Apreciar → Graduación**.
- El participante trabaja objetivos personales: familia, pareja, salud, dinero, liderazgo, carrera, propósito.
- **Parte central de esta fase: el participante debe invitar personas al Entrenamiento 1.** Esto es lo que sostiene el crecimiento del centro.

> Esa dinámica de invitación, sin sistema, se percibe como presión. Con sistema se convierte en adquisición legítima, medible y acompañada de valor real. **Ese es el corazón de lo que ELEVA arregla.**

---

## 2. Roles reales de un centro

Este es el **canon**. Fue corregido explícitamente por el fundador y contradice el modelo genérico de "coach hace seguimiento". Respetarlo es crítico para el producto.

| Rol | Qué hace | Qué NO hace |
|---|---|---|
| **Entrenador / Facilitador** | Llega y da el entrenamiento. Conduce Básico, Avanzado y los PL. | **No hace seguimiento entre sesiones.** No es su función. |
| **Oficinas** | El seguimiento operativo real: llaman, contactan, registran pagos, logística de mesas de registro. Son quienes "saben a quién atender hoy". | No son voluntarios. No facilitan. |
| **Staff** | Voluntarios durante los entrenamientos. Cada uno queda asignado a un **grupo pequeño** de participantes. | No hacen seguimiento fuera del evento. |
| **Dream Team** | Graduados con experiencia. Supervisan y apoyan a Staff y Entrenador durante los eventos. | — |
| **Participante** | Persona en un programa activo. | — |
| **Graduado** | Completó uno o más niveles. Puede ser Staff o Dream Team en generaciones futuras. | — |
| **Dueño / Director** | Métricas, finanzas, crecimiento, salud del centro, decisiones estratégicas. | — |
| **Contabilidad** | Finanzas, cobranza, pagos, becas. Acceso limitado y específico. | — |

### Implicación directa en el producto

> **El dashboard de "a quién atender hoy" pertenece a Oficinas, no al Entrenador.**

- Vista de **Oficinas**: seguimiento, contactar hoy, en riesgo, cobranza.
- Vista de **Entrenador**: generación activa, staff asignado, incidencias de sala, brief pre-entrenamiento.
- El sistema debe modelar la cadena: **Staff → Grupo pequeño → Participantes**.

Construir una vista de "seguimiento" y dársela al Entrenador es un error de modelo de negocio, no solo de UX.

---

## 3. Vocabulario canónico

Usar el término equivocado delata que no se conoce la industria. Esto importa más de lo que parece: el dueño de centro detecta al vendedor genérico en la primera frase.

| ✅ Usar | ❌ Evitar | Por qué |
|---|---|---|
| **Generación** | Cohorte | "Cohorte" es técnico y externo. Nadie en un centro dice cohorte. |
| **Grupo pequeño** | Squad, breakout | Es el término real |
| **Entrenador** o **Facilitador** | Coach (a secas) | "Coach" en esta industria puede significar otra cosa |
| **Oficinas** | Back office, administración | Es el nombre real del equipo |
| **Participante** | Cliente, usuario, alumno | El vínculo no es de cliente |
| **Visión / Intimar / Apreciar / Graduación** | "Módulo 1, 2, 3" | Son los nombres reales de los fines de semana del PL |

---

## 4. Cómo opera un centro sin sistema

Este es el estado inicial de casi todos los prospectos. Es el "antes" que el copy debe reflejar con precisión:

- Inscripciones por WhatsApp.
- Expedientes en Excel o Google Sheets.
- Seguimiento dependiente del criterio personal de quien esté disponible.
- Grupos de WhatsApp saturados e imposibles de gestionar.
- Pagos registrados a mano, morosidad detectada tarde.
- Sin KPIs por generación, fase o entrenador.
- Sin visibilidad de quién se está apagando vs. quién está listo para el siguiente paso.
- Crecimiento dependiente de que la última generación enrole suficiente gente.

**Las consecuencias en cadena:**

```
Si una generación enrola poco       → el centro se contrae
Si nadie da seguimiento             → se pierde engagement
Si no se detecta morosidad          → se acumula cartera vencida
Si no hay contenido ni eventos      → todo depende de invitaciones directas
```

---

## 5. Economía típica de un centro

Cifras de referencia del centro demo (TRANSFORMA Medellín, en `data/level.ts`) — sirven como orden de magnitud realista:

| Métrica | Valor |
|---|---|
| Participantes activos | 247 |
| En riesgo | 14 |
| Momentum promedio | 67% |
| Ingreso mensual | ~$342k MXN |
| Cobrado / pendiente | $293.6k / $48.6k |
| Margen neto | 72.6% |
| Entrenadores | 3 |
| Generaciones activas | 3 |

**Lecturas importantes:**
- El margen es alto (70%+) porque el costo variable es bajo — el negocio es de estructura, no de producto.
- El pendiente de cobro (~14% del ingreso) es dinero que ya se ganó y no se cobró. Es la victoria más rápida de una implementación.
- 14 personas en riesgo sobre 247 es ~6%. Cada una que se recupera vale su cuota completa.

---

## 6. Herencia histórica de la industria

ELEVA se posiciona explícitamente frente a 60 años de historia. Esto vive en `/historia-transformacion` y se resume en el home.

| Momento | Qué pasó |
|---|---|
| **1960s** | Movimiento del potencial humano — Maslow, Esalen, Rogers |
| **1971** | est (Werner Erhard) → después Landmark. ~600K personas |
| **1974** | Lifespring. Grupos grandes, controversias documentadas |
| **90s–2000s** | Adaptaciones en LATAM — México, Colombia, Argentina |
| **2024+** | ELEVA — estándar profesional, medible, ético |

**Lo que la industria heredó bien:** el poder de los grupos grandes, la inmersión como acelerador, la comunidad como sostén, el compromiso público como herramienta.

**Lo que ELEVA construye distinto:** sin presión psicológica ni dinámicas de influencia; entrenador formado y supervisado, no carismático; resultados medibles, no solo testimonios; transparencia sobre fuentes, riesgos y límites.

> ⚖️ **Obligatorio:** la página `/historia-transformacion` lleva disclaimer legal de no-afiliación con Werner Erhard, est, Landmark y Lifespring. Ver [`04-DIRECTRICES-DE-CONTENIDO.md`](04-DIRECTRICES-DE-CONTENIDO.md).

---

## 7. Las 10 preguntas filtro

Antes de construir cualquier feature o escribir cualquier sección, responder estas. **Si todas son "no", no es prioridad:**

1. ¿Ayuda a adquirir más participantes?
2. ¿Ayuda a activar mejor a los nuevos?
3. ¿Ayuda a retener y reactivar?
4. ¿Ayuda a cobrar y reducir morosidad?
5. ¿Ayuda a Oficinas a operar mejor?
6. ¿Ayuda al entrenador a llegar preparado?
7. ¿Ayuda al dueño a entender el pulso del centro?
8. ¿Aumenta el valor percibido por el participante?
9. ¿Reduce la dependencia del enrolamiento forzado?
10. ¿Prepara el producto para implementación real?

---

## Documentos relacionados

- [`01-VISION-Y-PROPOSITO.md`](01-VISION-Y-PROPOSITO.md) — la tesis
- [`07-PRODUCTO-ELEVA-OS.md`](07-PRODUCTO-ELEVA-OS.md) — cómo esta mecánica se traduce en software
