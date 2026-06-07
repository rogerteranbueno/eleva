# ELEVA — Master Brief para CloudCode
> Documento de referencia para revisar, auditar y evolucionar el sitio y demo de ELEVA.  
> Fecha: junio 2026 · Repo: `elevaapp` en `/Users/rogerteran/Downloads/elevaapp`

---

## 0. Para qué existe este documento

Este brief no es una lista de pantallas bonitas que agregar. Es la guía estratégica, operativa y técnica para que CloudCode entienda:

1. Qué industria está atacando ELEVA y cómo funciona de verdad.
2. Cuál es la visión completa del producto (qué debe hacer en producción).
3. Qué está construido en el demo y qué falta.
4. Qué promete el home y qué debe confirmar el demo.
5. Cuáles son las prioridades reales de implementación, en orden.
6. Cómo estructurar el código demo pensando en producción futura.

**La pregunta filtro.** Antes de implementar cualquier cosa, responde estas 10 preguntas. Si la respuesta es "no" a todas, no es prioridad:

1. ¿Ayuda a adquirir más participantes?
2. ¿Ayuda a activar mejor a los nuevos?
3. ¿Ayuda a retener y reactivar participantes?
4. ¿Ayuda a cobrar y reducir morosidad?
5. ¿Ayuda al staff a operar mejor?
6. ¿Ayuda al coach a llegar preparado?
7. ¿Ayuda al dueño a entender el pulso del centro?
8. ¿Aumenta el valor percibido por el participante?
9. ¿Reduce la dependencia del enrolamiento forzado?
10. ¿Prepara el producto para implementación real?

---

## 1. Cómo funciona de verdad un centro de transformación

Esta industria es específica. No es un gym ni una escuela. Entender su mecánica es la clave de todo.

### 1.1 El ciclo por fases

**Entrenamiento 1 — Básico / Posibilidad / Despertar**
- Dura 3 días: viernes noche, sábado completo, domingo completo.
- Jornadas largas (12-16 horas). Emocionalmente intensas.
- La persona normalmente llega *invitada* por alguien que ya vivió el proceso.
- El discurso suele ser: "esto puede cambiar tu vida".
- El centro cobra una cuota de inscripción.
- Aquí comienza la relación con el centro.

**Entrenamiento 2 — Avanzado**
- También dura 3 días, mismo formato intensivo.
- Profundiza la experiencia; aumenta el compromiso del participante.
- Muchas veces el siguiente paso (Entrenamiento 3) se vende al final de este fin de semana.

**Entrenamiento 3 — Vía / Sustentabilidad / Liderazgo**
- Dura varios meses (4–12 meses según el centro).
- Actividades recurrentes: generalmente fines de semana.
- El participante trabaja objetivos personales: vida, familia, pareja, salud, dinero, liderazgo, carrera, propósito.
- **Parte central de esta fase:** el participante debe *invitar* a personas al Entrenamiento 1. Esto sostiene el crecimiento del centro.
- Esa dinámica, sin sistema, puede verse como presión. Con sistema, se convierte en adquisición legítima, medible y acompañada de valor real.

### 1.2 El problema que ELEVA resuelve

Sin sistema, el centro opera con:
- Inscripciones por WhatsApp.
- Expedientes en Excel o Google Sheets.
- Seguimiento dependiente del criterio personal del coach.
- Grupos de WhatsApp saturados e imposibles de gestionar.
- Pagos registrados manualmente, morosidad detectada tarde.
- Sin KPIs por cohorte, fase o coach.
- Sin visibilidad de quién está apagándose vs. avanzando.
- Crecimiento dependiente de que la última generación enrole suficiente gente.

Si una cohorte enrola poco → el centro se contrae.  
Si un coach no da seguimiento → se pierde engagement.  
Si no se detecta morosidad → se acumula cartera vencida.  
Si no hay contenido ni eventos → todo depende de invitaciones directas.

### 1.3 La oportunidad

> **ELEVA no viene a eliminar el boca a boca. Viene a profesionalizarlo, hacerlo más justo y acompañarlo con más valor real.**

La frase madre sigue siendo fuerte:
> *"Si un mal fin de semana pone en riesgo tu centro, necesitas un mejor sistema."*

---

## 2. Visión del producto: qué debe hacer ELEVA

### 2.1 Posicionamiento

**ELEVA = el sistema operativo nativo para centros de transformación:**  
el lugar donde viven participantes, entrenamientos, expedientes, campañas, pagos, comunidad, expertos, insights y crecimiento.

**ELEVA Momentum** = primer producto standalone / wedge product:  
la capa de engagement, seguimiento, comunidad e intervención que mantiene viva la transformación *entre* entrenamientos.

### 2.2 Arquitectura de marca

| Nombre | Rol |
|---|---|
| **ELEVA** | Marca madre / sistema operativo / oferta comercial completa |
| **ELEVA Momentum** | Primer producto / app principal de engagement y seguimiento |
| **Pulso del Centro** | Módulo/pantalla del dueño |
| **Mi Tribu** | Experiencia de cohorte/comunidad del participante |
| **Expediente Vivo** | Ficha profunda del participante |
| **Creania** (antes Potencius) | Tenant ficticio del demo — centro de transformación ejemplo |

> **IMPORTANTE:** En el demo actual el sidebar muestra "POTENCIUS" como nombre del producto/marca. Esto debe cambiarse a "ELEVA". El nombre del centro demo es "Creania Transformación" (ya está en `data/creania.ts`). "Potencius" NO debe aparecer en ningún lugar del UI — ni en el sidebar ni en la landing.

### 2.3 Las 4 etapas del sistema

#### Adquirir
Traer gente nueva sin depender exclusivamente de que la última generación enrole.
- Webinars públicos, noches de invitados, eventos híbridos.
- Links de referido por participante.
- Tracking de quién invitó a quién.
- CRM de leads con señales de interés (abrió email, asistió a webinar, respondió WhatsApp).
- Secuencias de nurturing multicanal (WhatsApp, email, SMS).
- Landing pages por evento.

#### Activar
Lograr que la persona que mostró interés entre bien preparada y entienda cómo sacarle provecho.
- Onboarding del participante: registro de expectativas y objetivos.
- Material previo, recordatorios logísticos, confirmación de asistencia.
- Primeras misiones antes del entrenamiento.
- Brief del coach antes de cada entrenamiento (lista de participantes, riesgos, objetivos, incidencias, pagos, recomendaciones de conversación).
- Alertas de no-show.

#### Retener
Mantener viva la transformación entre entrenamientos.
- Feed vivo del participante.
- Misiones, check-ins, retos, rachas.
- Momentum Score continuo.
- Comunidad por cohorte.
- Recursos, biblioteca, cursos online.
- Eventos de seguimiento y webinars exclusivos.
- Red de expertos para objetivos personales (nutriólogos, coaches financieros, psicólogos, mentores, etc.).
- Alertas de riesgo y campañas de reactivación.

#### Escalar
Operar como plataforma, no como eventos aislados.
- Dashboard del dueño con KPIs por fase, cohorte, coach.
- Campañas y automatizaciones multicanal.
- Pagos, morosidad, membresías.
- Webinars, cursos, red de expertos como líneas de ingreso adicionales.
- Multi-sede en el futuro.
- Inteligencia IA para detectar riesgo, generar planes, detectar anomalías.

---

## 3. Roles del sistema

### 3.1 Dueño / Director

Panel que da el pulso real del centro. Debe ver:
- Health Score y Momentum promedio.
- Participantes activos vs. en riesgo.
- Próximo entrenamiento y evento abierto.
- Pagos pendientes y morosidad.
- Conversión E1→E2→E3.
- Performance por coach.
- Campañas activas.
- Insights IA con planes de acción.

Debe poder hacer clic en un insight y generar un plan ejecutable.

### 3.2 Staff Operativo

Opera el día a día: participantes, leads, invitados, cohortes, pagos, notas, incidencias, asistencias, archivos, recordatorios, seguimiento, tickets.

### 3.3 Coach / Facilitador

Antes de cada entrenamiento, recibe brief con:
- Lista de participantes, fase y cohorte.
- Objetivos declarados, riesgos, incidencias previas.
- Pagos pendientes, personas con bajo engagement.
- Casos sensibles + recomendaciones de conversación.

Puede crear notas, enviar mensajes, crear misiones, escalar casos, recomendar especialistas.

### 3.4 Participante

Vive una experiencia útil y continua: Feed, misiones, progreso, Momentum, racha, tribu, recursos, eventos, especialistas, pagos, mensajes del coach.

### 3.5 Especialista (fase futura)

Perfil propio, recibe solicitudes, reserva sesiones, registra avance, puede cobrar o participar en revenue share.

---

## 4. Estado actual del demo

### 4.1 Stack técnico

- **Framework:** Next.js 15 App Router (breaking changes vs. versiones anteriores — leer `node_modules/next/dist/docs/` antes de tocar APIs).
- **Estilos:** Tailwind CSS con utilities custom: `glass`, `glass-violet`, `glass-cyan`.
- **Animaciones:** Framer Motion (`motion.div`, `AnimatePresence`).
- **Estado global:** `useDemoStore()` + `useReducer` en `lib/demo-store.ts`.
- **Datos:** `data/creania.ts` con objetos `CENTERS`, `VALERIA` y más.
- **TypeScript:** strict mode — todos los archivos deben pasar `npx tsc --noEmit`.
- **Iconos:** Lucide React.
- **Utilitario de clases:** `cn()` de `@/lib/utils`.
- **Deploy:** Vercel — `vercel build --prod` → `vercel deploy --prebuilt --prod --scope rogerteranbuenos-projects`.

### 4.2 Rutas del demo construidas

| Ruta | Nombre | Vista | Estado |
|---|---|---|---|
| `/demo` | (intro o redirect) | — | Incompleto — actualmente redirige a `/demo/pulso` |
| `/demo/pulso` | Pulso del Centro | Dueño | ✅ Construido |
| `/demo/atencion` | Necesitan Atención | Dueño | ✅ Construido |
| `/demo/crm` | Directorio CRM | Dueño | ✅ Construido |
| `/demo/equipo` | Visibilidad de Equipo | Dueño | ✅ Construido |
| `/demo/finanzas` | Finanzas | Dueño | ✅ Construido (tabs Resumen + Historial) |
| `/demo/campanas` | Campañas | Dueño | ✅ Construido (drawer 3-pasos + automatizaciones) |
| `/demo/webinars` | Noches de Invitados | Dueño | ✅ Construido |
| `/demo/inteligencia` | Inteligencia IA | Dueño | ✅ Construido |
| `/demo/expediente` | Expediente Valeria | Dueño / Coach | ✅ Construido (tabs: Resumen, Actividad, Objetivos, Pagos, Notas, IA) |
| `/demo/feed` | Mi Feed | Participante | ✅ Construido |
| `/demo/mision` | Mi Misión | Participante | ✅ Construido |
| `/demo/momentum` | Mi Momentum | Participante | ✅ Construido |
| `/demo/tribu` | Mi Tribu | Participante | ✅ Construido |
| `/demo/logros` | Mis Logros | Participante | ✅ Construido |
| `/demo/coach` | Panel del Coach | Coach | ✅ Construido |
| `/demo/ops/registro` | Mesa de Registro | Ops | ✅ Construido |

### 4.3 Componentes demo construidos

| Componente | Función |
|---|---|
| `MomentumGauge.tsx` | Gauge visual del score de momentum |
| `PlanGenerator.tsx` | Generador de planes IA (dueño) |
| `InsightCard.tsx` | Card de insight accionable |
| `RegistrationDrawer.tsx` | Drawer 3-pasos para registrar participante |
| `CampaignComposer.tsx` | Compositor de campañas |
| `InvitarDrawer.tsx` | Drawer para invitar a eventos |
| `ShareEventModal.tsx` | Modal compartir evento (participante) |
| `ShareProgressCard.tsx` | Card compartir progreso (participante) |
| `ActionToast.tsx` | Toast de acción confirmada |
| `AvatarBadge.tsx` | Avatar con iniciales y badge |
| `InfoTooltip.tsx` | Tooltip informativo |
| `OnboardingModal.tsx` | Modal de onboarding |
| `PlanTipsDrawer.tsx` | Drawer con tips de plan IA |

### 4.4 Navegación (layout.tsx)

**Vista Dueño (9 items):** Pulso, Atención, CRM, Equipo, Finanzas, Campañas, Webinars, IA, Expediente.  
**Vista Coach (3 items):** Panel, Expediente IA, Directorio.  
**Vista Ops (2 items):** Mesa de Registro, Agregar Participante.  
**Vista Participante (5 items):** Feed, Misión, Momentum, Tribu, Logros.

Sidebar: `h-screen sticky top-0 overflow-y-auto` — corregido para no desbordarse con 9 items.

---

## 5. Auditoría home → demo

### 5.1 Qué promete el home (secciones actuales)

Secciones construidas en `app/page.tsx`:
- Hero con CTA al demo
- Dolor específico de la industria
- Solución por módulos (Pulso, Expediente, Campañas, etc.)
- 4 roles con sus beneficios (Dueño, Coach, Staff, Participante)
- Ecosistema de features
- Coach Marketplace (especialistas)
- Membresías (3 tiers: Esencial, Expansión, Maestría)
- Webinars / Noches de Invitados
- Proceso ELEVA (2 fases: Implementación 15-30 días + Optimización)
- CTA final

### 5.2 Qué confirma el demo

| Promesa del home | Demo la confirma | Notas |
|---|---|---|
| Panel del dueño con salud y riesgo | ✅ Pulso + Atención | |
| Expediente vivo del participante | ✅ `/demo/expediente` | Falta tab Journey (ver §6.1) |
| Momentum Score visible | ✅ Gauge en Pulso + pantalla Momentum | |
| Cohortes activas | ✅ En Pulso y Coach | |
| Campañas y automatizaciones | ✅ `/demo/campanas` | |
| Pagos y morosidad | ✅ `/demo/finanzas` | |
| Webinars / Noches de invitados | ✅ `/demo/webinars` | |
| Especialistas / Coach Marketplace | ⚠️ Parcial | En home sí, en demo no hay pantalla de especialistas. El expediente solo referencia. |
| Membresías | ⚠️ Parcial | En home sí. En demo no hay pantalla de membresías del participante. |
| IA generando plan | ✅ `/demo/inteligencia` + `PlanGenerator` | |
| Mesa de registro (ops) | ✅ `/demo/ops/registro` | |
| Vista participante completa | ✅ Feed + Misión + Momentum + Tribu + Logros | |
| Coach con brief pre-entrenamiento | ✅ `/demo/coach` | |
| Journey del participante (E1→E2→E3) | ❌ Falta | No hay tab Journey en el expediente |
| Compartir progreso / invitar | ✅ `ShareEventModal` + `ShareProgressCard` | |
| Registro de nuevo participante | ✅ `RegistrationDrawer` desde CRM | |
| Naming: ELEVA vs POTENCIUS | ❌ Falta | Sidebar dice "POTENCIUS" — debe decir "ELEVA" |
| Demo flow guiado | ❌ Falta | No hay pantalla intro que explique el recorrido |

---

## 6. Gaps prioritarios a implementar (en orden)

### Gap 1 — Naming: POTENCIUS → ELEVA

**Archivo:** `app/demo/layout.tsx` línea ~176  
**Problema:** El sidebar muestra "POTENCIUS" como si fuera el nombre del producto, lo que contradice directamente la marca "ELEVA" que usa el home.  
**Fix:** Cambiar el texto del logo en el sidebar de "POTENCIUS" a "ELEVA". El centro demo se llama "Creania Transformación" (ya en `data/creania.ts`), no confundir.

```tsx
// Antes
<span className="font-black text-white text-lg tracking-tight">POTENCIUS</span>
// Después
<span className="font-black text-white text-lg tracking-tight">ELEVA</span>
```

También revisar si "Potencius" aparece en cualquier otro archivo del demo y reemplazar.

---

### Gap 2 — Tab "Journey" en el Expediente

**Archivo:** `app/demo/expediente/page.tsx`  
**Por qué importa:** El expediente es la pantalla más importante del sistema. Sin el Journey, el dueño o coach no ve la historia completa del participante — que es exactamente lo que diferencia a ELEVA de un Excel.

Añadir un tab **"Journey"** como primer tab (antes de Resumen). Debe mostrar una línea de tiempo vertical con las etapas del participante:

**Etapa 1 — Adquirir (completada)**
- Lead source: "Referida por Diego Salinas"
- Fecha primer contacto: 02 feb 2025
- Evento de entrada: "Noche de invitados - enero 2025"

**Etapa 2 — Activar · Despertar (completada)**
- Fecha del Despertar: 15 feb 2025
- Score de activación: "Alta"
- Nota del coach: "Llegó con mucha energía, declaró objetivo de familia y finanzas"
- Días hasta enrolarse en Expansión: 7

**Etapa 3 — Activar · Expansión (completada)**
- Contenido consumido: 82%
- Misiones completadas en esta fase: 7/9
- Nota del coach: "Consistente, buen engagement grupal, liderazgo natural"
- Momentum al entrar a Vía Creania: 71%

**Etapa 4 — Retener · Vía Creania (activa)**
- Mes actual: 3 de 5 (barra de progreso)
- Objetivo trazado: "Generar $50k MXN de ingreso extra antes de diciembre"
- Avance: 35%
- Eventos asistidos: 8 de 11
- Momentum actual: 76% ↑

**Etapa 5 — Escalar (bloqueada)**
- Card con candado: "Disponible al completar Vía Creania"
- Vista previa: Mentoría, referidos, comunidad extendida

Datos a añadir en `data/creania.ts` en el objeto `VALERIA`:
```ts
leadSource: "Referida por Diego Salinas",
despertar: { date: "15 feb 2025", coachNote: "Llegó con mucha energía, declaró objetivo de familia y finanzas", activationScore: "Alta", daysToExpansion: 7 },
expansion: { contentPct: 82, missionsCompleted: 7, totalMissions: 9, coachNote: "Consistente, buen engagement grupal, liderazgo natural", momentumAtEntry: 71 },
```

---

### Gap 3 — Pantalla intro de metodología en `/demo`

**Archivo:** `app/demo/page.tsx`  
**Problema:** Actualmente redirige a `/demo/pulso`. Esto elimina el contexto del "por qué" del sistema.  
**Fix:** Convertir en pantalla real que el usuario ve *antes* de entrar al software.

Debe mostrar:
- Encabezado: "Este es el sistema operativo de [nombre del centro]"
- Subtítulo: "ELEVA convierte entrenamientos intensivos en un sistema continuo de seguimiento, comunidad y crecimiento."
- 4 tarjetas en fila (2×2 en mobile) con las etapas del sistema:

  | Etapa | Ícono | Descripción breve | Métrica clave |
  |---|---|---|---|
  | **Adquirir** | `UserPlus` | Webinars, CRM de leads, referidos | "80% más fácil enrolar a un lead nutrido" |
  | **Activar** | `Zap` | Onboarding, brief de coach, misiones | "94% de activación en primeros 7 días" |
  | **Retener** | `Heart` | Feed, momentum, tribu, eventos | "3x más retención vs. promedio del sector" |
  | **Escalar** | `TrendingUp` | Finanzas, campañas, IA, multi-sede | "+240% crecimiento anual promedio" |

- Dos CTAs grandes:
  - **"Ver como dueño"** → `/demo/pulso` (violeta, icono `Building2`)
  - **"Ver como participante"** → `/demo/feed` (emerald, icono `User`)
- Link sutil "Saltar intro y explorar libremente →" para usuarios que regresan.

---

### Gap 4 — IA: Plan generator accionable en Pulso

**Archivo:** `app/demo/pulso/page.tsx` (y `components/demo/PlanGenerator.tsx`)  
**Por qué importa:** El brief dice que el demo flow clave es: dueño ve insight → hace clic → sistema genera plan → ejecuta acción. Si esto no funciona fluidamente en Pulso, el demo no cuenta la historia más poderosa.

Verificar que en `/demo/pulso`:
1. Cada insight card tiene botón "Generar plan".
2. Al hacer clic abre `PlanGenerator` con el plan contextualizado (no genérico).
3. El plan tiene pasos numerados, cada paso con una acción rápida disponible (botón "Enviar WhatsApp", "Crear campaña", "Ver expediente").
4. Al ejecutar una acción aparece `ActionToast` confirmando.

Si alguno de esos pasos no funciona o está cortocircuitado, es el gap más importante a cerrar.

---

### Gap 5 — Tab "Comunicación" en el Expediente

**Archivo:** `app/demo/expediente/page.tsx`  
**Por qué importa:** El brief especifica que el expediente debe tener un tab de Comunicación que muestre el historial completo de contacto con ese participante (mensajes enviados, emails, WhatsApps, campañas recibidas, respuestas, último contacto, próximo seguimiento). Esto cierra el loop entre campañas y expediente.

Añadir tab **"Comunicación"** (entre Actividad y Objetivos):
- Línea de tiempo de mensajes enviados por el sistema (WhatsApp, email, in-app).
- Cada entrada: canal (badge WhatsApp verde / Email azul / App violeta), fecha, contenido del mensaje, estado (enviado / abierto / respondido).
- Métrica superior: "Último contacto: hace 2 días · Próximo seguimiento: 7 jun"
- CTA: "Enviar mensaje ahora" que abre drawer de composer.

---

### Gap 6 — Pantalla de Especialistas en la vista participante

**Archivo nuevo:** `app/demo/especialistas/page.tsx`  
**Por qué importa:** El home promete una red de expertos (coaches financieros, nutriólogos, psicólogos, mentores). Si el participante no puede ver ni interactuar con esto en el demo, esa promesa queda sin confirmar.

Añadir a `PARTICIPANT_SCREENS` en `layout.tsx` (con icono `Star` de lucide):
```tsx
{ href: "/demo/especialistas", label: "Expertos", shortLabel: "Expertos", icon: Star }
```

La pantalla muestra 6 especialistas con:
- Foto/avatar con iniciales, nombre, especialidad, rating (estrellas), precio/sesión, tags, botón "Reservar sesión" (que abre toast de demo).
- Filtros por categoría: Salud / Finanzas / Carrera / Bienestar / Pareja.
- Banner superior: "Recomendado por tu coach: 2 especialistas para tus objetivos actuales".

---

### Gap 7 — Anomalías financieras en Finanzas

**Archivo:** `app/demo/finanzas/page.tsx`  
**Por qué importa:** El brief especifica detección de anomalías como una función clave de Finanzas. Actualmente la pantalla muestra resumen + historial pero no alerta proactiva sobre casos anómalos.

Añadir una sección "Alertas del sistema" (badge rojo con número en el tab) con casos concretos:
- "Participante activo sin pago registrado (3 casos)"
- "Pago registrado sin comprobante (1 caso)"
- "Monto pagado distinto al plan acordado (2 casos)"
- Cada alerta con botón "Revisar" que lleva al expediente o abre drawer.

---

## 7. Estructura de datos demo (data/creania.ts)

El archivo `data/creania.ts` es la fuente de verdad de todos los datos del demo. Cada módulo debe leer desde aquí, no hardcodear datos inline. Esto facilita la transición a producción real.

### Objetos actuales
- `CENTERS[]` — Array de centros con métricas
- `VALERIA` — Perfil rico de la participante demo

### Objetos a añadir

**`FINANCIALS`**
```ts
export const FINANCIALS = {
  mrr: 247000,
  cobradoMes: 198400,
  pendienteMes: 48600,
  vsMesAnterior: 12,
  equipo: {
    coaches: { count: 3, costo: 54000 },
    staff: { count: 2, costo: 18000 },
    plataforma: 8500,
  },
  costoTotal: 80500,
  margenNeto: 67,
  pendientes: [
    { nombre: "Valeria Romo", monto: 4200, diasVencido: 3 },
    { nombre: "Omar Castillo", monto: 4200, diasVencido: 5 },
    { nombre: "Paola Serrano", monto: 8900, diasVencido: 7 },
    { nombre: "Carlos Peñafiel", monto: 4200, diasVencido: 0 },
  ],
}
```

**Extensión de `VALERIA`**
```ts
leadSource: "Referida por Diego Salinas",
despertar: {
  date: "15 feb 2025",
  coachNote: "Llegó con mucha energía, declaró objetivo de familia y finanzas. Alta disposición.",
  activationScore: "Alta" as const,
  daysToExpansion: 7,
},
expansion: {
  contentPct: 82,
  missionsCompleted: 7,
  totalMissions: 9,
  coachNote: "Consistente, buen engagement grupal. Liderazgo natural dentro del grupo. Recomendada para rol de guía.",
  momentumAtEntry: 71,
},
comunicacion: [
  { canal: "whatsapp", fecha: "02 jun 2026", contenido: "Hola Valeria, ¿cómo va tu objetivo esta semana?", estado: "respondido" },
  { canal: "email", fecha: "28 may 2026", contenido: "Recap de la semana 12 de Vía Creania", estado: "abierto" },
  { canal: "app", fecha: "25 may 2026", contenido: "Nueva misión disponible: Registro de hábitos semana 3", estado: "enviado" },
],
```

**`COHORTES`**
```ts
export const COHORTES = [
  {
    id: "omega",
    nombre: "Gen. Omega",
    fase: "Vía Creania",
    coach: "Ana Reyes",
    participantes: 89,
    momentum: 76,
    enRiesgo: 8,
    cuposDisponibles: 0,
    mesActual: 3,
    totalMeses: 5,
  },
  {
    id: "norte",
    nombre: "Gen. Norte",
    fase: "Expansión",
    coach: "Marco Torres",
    participantes: 54,
    momentum: 68,
    enRiesgo: 5,
    cuposDisponibles: 6,
    mesActual: null,
    totalMeses: null,
  },
  {
    id: "via12",
    nombre: "Vía 12",
    fase: "Básico",
    coach: "Sofía Medina",
    participantes: 104,
    momentum: 71,
    enRiesgo: 14,
    cuposDisponibles: 4,
    mesActual: null,
    totalMeses: null,
  },
]
```

**`ESPECIALISTAS`**
```ts
export const ESPECIALISTAS = [
  { id: "e1", nombre: "Dr. Rafael Muñoz", especialidad: "Coach Financiero", rating: 4.9, sesiones: 342, precioPorHora: 1200, tags: ["Finanzas", "Emprendimiento"], recomendado: true },
  { id: "e2", nombre: "Lic. Patricia Vega", especialidad: "Psicóloga", rating: 4.8, sesiones: 218, precioPorHora: 950, tags: ["Bienestar", "Pareja"], recomendado: true },
  { id: "e3", nombre: "Dra. Carmen Olvera", especialidad: "Nutrióloga", rating: 4.7, sesiones: 189, precioPorHora: 800, tags: ["Salud", "Hábitos"], recomendado: false },
  { id: "e4", nombre: "Lic. Jorge Salinas", especialidad: "Mentor de Carrera", rating: 4.6, sesiones: 156, precioPorHora: 1100, tags: ["Carrera", "Liderazgo"], recomendado: false },
  { id: "e5", nombre: "Dr. Héctor Blanco", especialidad: "Terapeuta de Pareja", rating: 4.9, sesiones: 401, precioPorHora: 1400, tags: ["Pareja", "Familia"], recomendado: false },
  { id: "e6", nombre: "Lic. Andrea Cruz", especialidad: "Coach de Hábitos", rating: 4.5, sesiones: 127, precioPorHora: 750, tags: ["Hábitos", "Productividad"], recomendado: false },
]
```

---

## 8. Modelo de datos para producción futura

Aunque hoy el demo use mock data en `data/creania.ts`, la arquitectura del código debe quedar estructurada pensando en estas entidades reales. Los nombres de variables, tipos TypeScript e interfaces deben coincidir con este modelo para que la migración a Supabase (o similar) sea directa.

```
organizations          — empresa / franquicia matriz
centers                — cada sede / centro (multi-tenant)
locations              — direcciones físicas de cada centro
users                  — todos los usuarios del sistema
roles                  — owner | coach | staff | participant | specialist
participants           — registro de participante
participant_profiles   — datos demográficos y personales ampliados
participant_journeys   — historia completa E1→E2→E3
phases                 — definición de fases (Básico, Expansión, Vía, etc.)
trainings              — instancias de entrenamiento (fin de semana concreto)
cohorts                — generaciones (Gen. Omega, Gen. Norte, etc.)
cohort_members         — participante ↔ cohorte
coaches                — perfil específico del coach
staff_notes            — notas de staff sobre participante
incidents              — incidencias y eventualidades
tasks                  — tareas para staff/coach
missions               — misiones asignadas a participantes
submissions            — entregas de misiones
checkins               — check-ins de participantes
events                 — webinars, noches de invitados, entrenamientos
event_attendees        — asistentes por evento
referrals              — quién invitó a quién
leads                  — personas que mostraron interés pero no se inscribieron
campaigns              — campañas de email/WhatsApp/SMS/in-app
campaign_messages      — mensajes individuales de una campaña
notifications          — notificaciones in-app
payments               — pagos registrados
payment_plans          — acuerdos de pago / facilidades
invoices               — comprobantes
financial_incidents    — anomalías financieras detectadas
specialists            — perfil de especialistas externos
specialist_sessions    — sesiones reservadas con especialistas
content_items          — PDFs, audios, videos, guías
courses                — cursos online con lecciones
resources              — recursos de la biblioteca
community_posts        — posts en el feed de cohorte
comments               — comentarios a posts
reactions              — reacciones (like, corazón, fuego)
ai_insights            — insights generados por IA
action_plans           — planes de acción generados por IA
activity_logs          — log de todas las acciones del sistema
```

### Convención de tipos TypeScript

En `lib/types.ts`, cada entidad debe tener una interfaz que refleje el esquema de producción:

```ts
// Ejemplo
export interface Participant {
  id: string
  centerId: string
  cohortId: string
  coachId: string
  name: string
  phone: string
  email: string
  phase: "basico" | "expansion" | "via" | "completado"
  momentumScore: number
  streak: number
  leadSource: string
  referredById: string | null
  createdAt: string
  updatedAt: string
}

export interface AIInsight {
  id: string
  participantId: string | null  // null = insight del centro completo
  centerId: string
  type: "risk" | "opportunity" | "anomaly" | "plan"
  title: string
  body: string
  priority: "high" | "medium" | "low"
  actionPlan: ActionStep[]
  createdAt: string
}

export interface ActionStep {
  order: number
  description: string
  actionType: "whatsapp" | "email" | "campaign" | "mission" | "event" | "ticket"
  targetId?: string
}
```

---

## 9. Demo flow ideal (guión de venta)

El demo debe poder recorrerse en 3–4 minutos y dejar claro el valor. Este es el guión:

**Paso 1 — Landing**
- CTA visible: "Ver demo interactivo" → entra a `/demo` sin registro.

**Paso 2 — Intro metodología (`/demo`)**
- Ve las 4 etapas del sistema con métricas clave.
- Elige "Ver como dueño".

**Paso 3 — Pulso del Centro (`/demo/pulso`)**
- Ve: Momentum 71%, 247 activos, 14 en riesgo, 3 cohortes, evento próximo.
- Ve insight: "14 participantes con momentum bajo necesitan atención."
- Hace clic "Generar plan" → ve un plan de 7 pasos con acciones ejecutables.

**Paso 4 — Necesitan Atención (`/demo/atencion`)**
- Ve la cola priorizada: nombre, fase, cohorte, último contacto, acción sugerida.
- Ejecuta acción rápida: "Enviar recordatorio" → toast confirma.

**Paso 5 — Expediente (`/demo/expediente`)**
- Ve el tab Journey: historia completa de Valeria, E1→E2→E3→Vía activa.
- Ve tab IA: patrón detectado, riesgo, fortaleza, preguntas sugeridas para el coach.

**Paso 6 — Vista Coach (`/demo/coach`)**
- Ve brief antes del entrenamiento: lista de participantes, riesgos, objetivos, pagos.

**Paso 7 — Vista Participante (`/demo/feed`)**
- Cambia de vista a "Usuario". Ve el feed vivo como Valeria.
- Ve misión activa, Momentum, Tribu con leaderboard.

**Paso 8 — Cierre**
- Volver al home → CTA: "Implementar ELEVA en mi centro" o "Agendar sesión estratégica".

---

## 10. KPIs que el sistema debe mostrar

### Adquisición
- Leads nuevos / mes
- Invitados por participante activo
- Asistentes a webinars
- Conversión invitado → E1
- Referidos por cohorte
- Fuente de lead (pie chart)

### Activación
- Asistencia al E1 / E2
- Onboarding completado %
- No-shows
- Primeras misiones completadas (primeros 7 días)

### Retención
- Momentum Score (promedio + tendencia)
- Participantes con racha activa
- Misiones completadas / semana
- Conversión E1→E2→E3
- Permanencia en fase 3
- Reactivaciones logradas este mes

### Finanzas
- MRR
- Pagos pendientes / morosidad
- Ingresos por membresía
- Recuperación de pagos esta semana

### Staff / Coaches
- Notas capturadas
- Casos escalados
- Participantes contactados
- Cohortes en riesgo asignadas

---

## 11. Instrucción de implementación para CloudCode

Prioridad de implementación inmediata (en orden):

| # | Gap | Archivo(s) | Complejidad |
|---|---|---|---|
| 1 | Cambiar "POTENCIUS" → "ELEVA" en sidebar | `app/demo/layout.tsx` | Baja |
| 2 | Tab Journey en Expediente | `app/demo/expediente/page.tsx` + `data/creania.ts` | Media |
| 3 | Pantalla intro metodología en `/demo` | `app/demo/page.tsx` | Media |
| 4 | Plan generator funcional en Pulso | `app/demo/pulso/page.tsx` | Media |
| 5 | Tab Comunicación en Expediente | `app/demo/expediente/page.tsx` | Media |
| 6 | Pantalla Especialistas (participante) | `app/demo/especialistas/page.tsx` + `layout.tsx` + `data/creania.ts` | Media |
| 7 | Alertas de anomalías en Finanzas | `app/demo/finanzas/page.tsx` | Baja |

**Reglas de implementación:**

1. Siempre pasar `npx tsc --noEmit` antes de dar por terminado cualquier cambio.
2. Todo dato demo vive en `data/creania.ts` — no hardcodear inline.
3. Tipos nuevos van en `lib/types.ts`, siguiendo la convención de producción.
4. No crear archivos de documentación (`.md`) adicionales — trabajar desde este brief.
5. Los iconos son siempre de `lucide-react`.
6. Las clases de animación usan siempre Framer Motion, no CSS transitions crudas para elementos principales.
7. Usar `cn()` para todas las clases condicionales.
8. El sidebar tiene 9 items en vista dueño — revisar que el `shortLabel` de cualquier item nuevo no cause overflow en mobile (375px).
9. Para deploy: `cd /Users/rogerteran/Downloads/elevaapp && vercel build --prod && vercel deploy --prebuilt --prod --scope rogerteranbuenos-projects`.

**Criterio de éxito del demo:**

Un dueño de centro que vea este demo en 3–4 minutos debe pensar:
> "Esto reemplaza mi Excel, mi WhatsApp y mi caos operativo. Esto me ayuda a saber qué está pasando, reducir morosidad, retener más y depender menos de que la última generación enrole bien."

---

*Fin del brief. Versión: junio 2026.*
