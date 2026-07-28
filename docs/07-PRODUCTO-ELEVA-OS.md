# 07 · Producto — ELEVA OS

> La visión del software: qué debe hacer, para quién, y qué está construido hoy en el demo.

---

## Posicionamiento

**ELEVA OS es el sistema operativo nativo para centros de transformación.** El lugar donde viven participantes, entrenamientos, expedientes, campañas, pagos, comunidad, expertos e insights.

**Importante:** el OS no se vende suelto. Es una pieza dentro de PACTO (la implementación). Ver [`03-MODELO-DE-NEGOCIO.md`](03-MODELO-DE-NEGOCIO.md).

### Arquitectura de marca

| Nombre | Rol |
|---|---|
| **ELEVA** | Marca madre — firma, sistema y oferta comercial completa |
| **ELEVA OS** | La plataforma operativa |
| **ELEVA Momentum** | Capa de engagement y seguimiento entre entrenamientos |
| **ELEVA Hub** | Comunidad — vive aparte en `creania.vercel.app` |
| **Pulso del Centro** | Pantalla del dueño |
| **Mi Tribu** | Experiencia de generación del participante |
| **Expediente Vivo** | Ficha profunda del participante |

---

## Las 4 etapas del sistema

Todo el producto se organiza en cuatro etapas que corresponden al ciclo real de un centro ([`02-CONTEXTO-INDUSTRIA.md`](02-CONTEXTO-INDUSTRIA.md)).

### Adquirir
Traer gente nueva sin depender exclusivamente de que la última generación enrole.
- Webinars públicos, noches de invitados, eventos híbridos
- Links de referido por participante y tracking de quién invitó a quién
- CRM de leads con señales de interés
- Secuencias de nurturing (WhatsApp, email, SMS)

### Activar
Que quien mostró interés entre bien preparado.
- Onboarding con registro de expectativas y objetivos
- Material previo, recordatorios, confirmación de asistencia
- **Brief del entrenador** antes de cada entrenamiento
- Alertas de no-show

### Retener
Mantener viva la transformación **entre** entrenamientos. Es donde más valor agrega el sistema.
- Feed vivo, misiones, check-ins, rachas
- **Momentum Score** continuo
- Comunidad por generación
- Red de expertos para objetivos personales
- Alertas de riesgo y campañas de reactivación

### Escalar
Operar como plataforma, no como eventos aislados.
- Dashboard del dueño con KPIs por fase, generación y entrenador
- Pagos, morosidad, membresías
- Webinars, cursos y red de expertos como líneas de ingreso
- Multi-sede
- IA para detectar riesgo y generar planes

---

## Vistas por rol

> ⚠️ El modelo de roles es el punto donde más fácil se equivoca el producto. Ver el canon completo en [`02-CONTEXTO-INDUSTRIA.md`](02-CONTEXTO-INDUSTRIA.md#2-roles-reales-de-un-centro).

### Dueño / Director
Pulso real del centro: health score, momentum promedio, activos vs. en riesgo, próximo entrenamiento, morosidad, conversión E1→E2→E3, performance por entrenador, insights IA con planes accionables.

### Oficinas
**El seguimiento operativo vive aquí, no en el entrenador.** A quién contactar hoy, registro de pagos, logística de mesas de registro, incidencias.

### Entrenador / Facilitador
Brief pre-entrenamiento: lista de participantes con fase y generación, objetivos declarados, riesgos e incidencias previas, pagos pendientes, casos sensibles con recomendaciones de conversación. Genera notas y escala casos.

### Participante
Feed, misiones, progreso, Momentum, racha, tribu, recursos, eventos, especialistas, pagos, mensajes.

### Especialista *(fase futura)*
Perfil propio, recibe solicitudes, reserva sesiones, registra avance, revenue share.

---

## Estado del demo

Ruta base: **`/vl2026`** · Centro ficticio: **TRANSFORMA** (Medellín, Colombia) · Datos en `data/level.ts`

### Vista Dueño
| Ruta | Pantalla |
|---|---|
| `/vl2026/pulso` | Pulso del Centro |
| `/vl2026/atencion` | Necesitan atención |
| `/vl2026/crm` | Directorio CRM |
| `/vl2026/equipo` | Visibilidad de equipo |
| `/vl2026/finanzas` | Finanzas |
| `/vl2026/campanas` | Campañas |
| `/vl2026/webinars` | Noches de invitados |
| `/vl2026/inteligencia` | Inteligencia IA |
| `/vl2026/cohortes` | Generaciones |
| `/vl2026/expediente` | Expediente vivo |

### Vista Oficinas / Ops
| Ruta | Pantalla |
|---|---|
| `/vl2026/ops/dashboard` | Dashboard operativo |
| `/vl2026/ops/registro` | Mesa de registro |
| `/vl2026/ops/enrolamiento` | Enrolamiento |
| `/vl2026/ops/pre-entrenamiento` | Pre-entrenamiento |
| `/vl2026/ops/comunidad` | Comunidad |

### Vista Entrenador
`/vl2026/coach` — panel y brief.

### Vista Participante
| Ruta | Pantalla |
|---|---|
| `/vl2026/feed` | Mi feed |
| `/vl2026/mision` | Mi misión |
| `/vl2026/momentum` | Mi momentum |
| `/vl2026/tribu` | Mi tribu |
| `/vl2026/logros` | Mis logros |
| `/vl2026/especialistas` | Expertos |
| `/vl2026/mi-panel` | Panel personal |

---

## El flujo demo más importante

Si solo funciona una cosa en el demo, debe ser esta:

```
Dueño ve un insight  →  clic en "Generar plan"
        ↓
Sistema genera plan contextualizado (no genérico)
        ↓
Cada paso tiene acción rápida ("Enviar WhatsApp", "Crear campaña", "Ver expediente")
        ↓
Al ejecutar → ActionToast confirma
```

Es la historia más poderosa del producto: **el sistema no solo informa, propone y ejecuta.** Componentes: `PlanGenerator.tsx`, `InsightCard.tsx`, `ActionToast.tsx`.

---

## Principio de diseño del demo

**Todo dato debe leerse de `data/level.ts`.** Nada hardcodeado inline. Esto no es purismo: es lo que permite cambiar el centro demo o conectar datos reales sin reescribir pantallas.

---

## Documentos relacionados

- [`02-CONTEXTO-INDUSTRIA.md`](02-CONTEXTO-INDUSTRIA.md) — roles y mecánica real
- [`06-ARQUITECTURA-TECNICA.md`](06-ARQUITECTURA-TECNICA.md) — convenciones de código
- [`08-ESTADO-Y-ROADMAP.md`](08-ESTADO-Y-ROADMAP.md) — qué falta
