# ADR-002 · Dominio canónico v2: el ciclo real de un centro de transformación

**Fecha:** 2026-07-28 · **Estado:** aplicado (migraciones 014–017)
**Contexto:** auditoría operativa/técnica/datos/finanzas del 28-jul + blueprint doc 18
(modelo operativo canónico). Decisiones D-013–D-018 confirmadas por el fundador.

## Problema

El modelo v0/Alpha-2 describía un curso genérico: cohortes con 8 sesiones, un solo
enum de participación, pagos con FK a un cargo y un booleano de conciliación. La
realidad de un centro VIA es un **ciclo**: Básico de 3 días (vie–dom) → Avanzado
~15 días después → PL de 4 meses (hitos Visión/Intimar/Aprecio + graduación,
actividades entre semanas, libros, llamadas de staff, enrolamientos que llenan el
siguiente Básico) → alumni que regresan como staff/capitán. Un enum no puede decir
"pagó parcial + asistió + aceptó el pase" a la vez; una FK pago→cargo no puede
repartir una transferencia entre dos mensualidades.

## Decisión

**Rebuild + reseed** (todo el dato era sintético): se eliminaron las tablas del
modelo viejo y se recrearon canónicas. Se conservaron identidad/orgs, la capa
social (re-apuntada), auditoría y ai_summaries.

1. **Ciclo y etapas.** `generation_cycles` (la generación: unidad social y
   comercial) → `stage_runs` (basico|avanzado|pl con fechas, cupo, precio) →
   `event_occurrences` TIPADOS (dia_basico, hito_pl, actividad_equipo, llamada,
   graduacion, evento_centro/alumni). Nunca "sesión N".

2. **Planos de estado separados** en `stage_participations`:
   `registration_status` (invitado→confirmado|cancelado) y `delivery_status`
   (esperado→activo→completo|no_completo|retirado|pausa). Las finanzas SIEMPRE se
   derivan del ledger; la asistencia vive por evento; el pase en su propia tabla.
   Historial por plano en `participation_plane_history`.

3. **Asistencia honesta.** `attendance_expectations` × `attendance_records`: el
   denominador es lo ESPERADO y el faltante es "sin registro" — visible, jamás
   desaparece. Toda métrica de asistencia divide entre expectativas.

4. **El pase es un proceso medible.** `continuity_passes` con `pass_status`
   (no_evaluado→elegible→conversado→ofrecido→aceptado|declinado|diferido) +
   `next_status` (reservado→inscrito→iniciado|no_show), timestamps por paso y
   `recorded_by`. La ventana crítica Básico→Avanzado es un funnel operable.

5. **Enrolamiento con atribución.** `prospects` (plano CRM pre-participación) +
   `enrollment_attributions` (quién enroló a quién, en qué contexto del PL, con
   qué resultado). El siguiente Básico se traza hasta sus fuentes.

6. **Servicio ≠ nivel.** `team_assignments` con rol entrenador|coach|capitan|staff,
   ámbito stage_run, `reports_to` y vigencia. Una graduada que sirve de staff no
   cambia de "nivel": suma una asignación. (Criterio de aceptación doc 18: caso
   Paulina Reyes, verificado por `npm run test:modelo`.)

7. **Ledger financiero.** `payments` SIN FK a cargo + `payment_allocations` (una
   transferencia se reparte a N cargos; sin asignación = pago no identificado,
   visible). `payment_plans` → installments como charges. `refunds`, `discounts`
   (beca|descuento|ajuste con approved_by), `expenses` por etapa,
   `reconciliation_batches` por periodo (reemplaza al booleano). Regla dura: las
   monedas jamás se suman entre sí.

8. **Casos tipados.** `cases.kind` (finanzas|entrega|pase|registro|comunidad|
   operacion). El entrenador no ve ni opera casos de finanzas — garantizado en
   RLS, en las acciones y en la UI. Señales con dedupe de bucket semanal: una
   condición persistente descartada REAPARECE. Evento honesto:
   `intervention.recorded` (guardar borrador ≠ ejecutar contacto).

9. **La comunidad vive en el ciclo.** `posts.cycle_id`: la generación conversa a
   través de sus etapas sin resetear su espacio.

## RLS

Helpers nuevos (`is_cycle_member`, `is_stage_member`, `is_staff_of_participation`,
`has_stage_role`, `shares_cycle_with`, `is_team_for_my_cycle`). El staff SOLO ve
su grupo asignado (016); el ledger solo dueno|finanzas|oficinas; el participante
no ve el pipeline del pase sobre sí mismo (lo vive en persona). Verificado por
`npm run test:rls` (~70 aserciones) con usuarios reales.

## Consecuencias

- El OS opera el ciclo real: funnel del pase accionable, agenda tipada, CRM de
  prospectos, cobertura de capitán, mi-grupo de staff, /mi por etapa.
- Las métricas certificadas usan denominadores esperados, cash confirmado por
  moneda y el funnel por paso; el Pulso declara provisional lo que no reconcilia.
- Cambiar la forma del dominio exigió reescribir el motor de señales, las
  acciones y casi todas las vistas — el costo de haber modelado un "curso" antes
  de entender el negocio. El blueprint doc 18 es ahora el contrato del dominio.
