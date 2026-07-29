# ADR-003 · Alpha 3 — Centro vivo: confianza operativa + Hub Centro real

**Fecha:** 2026-07-28/29 · **Estado:** aplicado (migraciones 018–023)
**Contexto:** auditoría deep-dive del 28-jul + blueprint doc 19 (arquitectura social y
plan Alpha 3). El fundador reportó "falta todo" sobre la red social; se verificaron las
siete acusaciones técnicas contra el código antes de actuar — las siete eran ciertas.

## Lo que se encontró (verificado, no asumido)

| Hallazgo | Causa raíz |
|---|---|
| Dinero no confirmado contado como cobrado | `/finanzas` no filtraba `payment_allocations` por `payments.confirmed`; `/generaciones/[id]` sí — dos verdades del mismo ciclo, $24,000 de diferencia |
| Fechas que no correspondían al día | El seed usaba `current_date ± n` sin anclar a un día real de la semana |
| Capitán y staff a la vez | `team_assignments` (servicio por etapa) y `role_assignments` (capacidad de org) podían divergir sin reconciliarse |
| Staff veía expedientes fuera de su grupo / Finanzas entraba a generaciones por URL | **Causa sistémica**: las 18 páginas autenticadas renderizaban con `createServiceClient()`, que salta RLS por completo. `test:rls` verificaba la puerta de la base mientras la aplicación entraba por la ventana |
| IA mezclaba audiencias | El caché de `ai_summaries` era `(org, kind)`; un entrenador podía recibir el resumen generado con cifras financieras de dirección |
| Website no mostraba la arquitectura | Home conservaba narrativa de consultoría; OS+Hub+Growth+Red solo vivían en `/plataforma` |

## Decisión — cuatro frentes

### A · Confianza
- **`modules/finance/ledger.ts`**: única fuente de verdad del dinero (`chargeBalance`,
  `economyByCurrency`, `collectedByCurrency`). Cobrado = solo pagos confirmados menos
  devoluciones. `/finanzas`, `/generaciones/[id]` y `metrics.ts` lo consumen — no pueden
  volver a divergir porque no vuelven a calcular.
- **Trigger de invariante temporal** (`018`): un `dia_basico`/`dia_avanzado` cuyo nombre no
  coincide con el día real de `starts_at` en su zona horaria es **rechazado por la base**,
  no solo evitado por convención. Reseed (`019`) ancla Básico/Avanzado en viernes reales;
  los hitos del PL pasan a ser fin de semana completo, no una noche suelta.
- **`lib/capabilities.ts` + `lib/scope.ts`**: reemplazan `requireTeam(roles[])` y el `can`
  genérico. Una capacidad describe un permiso sobre un ámbito (`people.read.assigned`,
  `finance.read`, `cycle.read.all`…); `readablePersonIds`/`readableCycleIds` filtran
  explícitamente lo que el service client puede traer, para que el ámbito no dependa solo
  de RLS cuando la página no usa el cliente de usuario.
- **`ai_summaries.audience`**: el caché y el prompt se filtran por audiencia
  (`direccion|operacion|entrenador|finanzas`) — las métricas se recortan por capacidad
  ANTES de construir el prompt, no después.
- **`scripts/test-rutas.ts`** (nuevo): entra por HTTP como cada rol demo (cookie de sesión
  armada igual que `@supabase/ssr`) y afirma código de estado y ausencia de datos fuera de
  ámbito en el HTML — la capa de prueba que faltaba, la que habría cazado los tres huecos
  de acceso.

### B · Hub Centro
- **`spaces` + `space_memberships`** (`020`): tipos `generacion|centro|alumni|circulo|
  grupo|evento`. `posts.space_id` reemplaza `cycle_id`/`visibility_scope` — el espacio ES
  la audiencia. Backfill: cada ciclo → su espacio de generación; el centro gana `centro` y
  `alumni`; dos círculos temáticos semilla con anfitrión (doc 19 §17, cold start).
- Perfil de centro real (bio, ciudad, intereses, habilidades, ofrece, disponible para
  servir) con `profile_field_visibility` por campo.
- `/mi/comunidad` con pestañas (Mi generación · Centro · Alumni · Círculos), composer
  compacto (antes: 8 tarjetas ocupaban la primera pantalla móvil), permalink de post,
  editar/eliminar/guardar/reportar, menciones.
- `/mi/personas` pasa de lista de generación a directorio del centro con búsqueda.
- `/comunidad` en `(team)`: consola con cola del anfitrión (primeras contribuciones sin
  respuesta, preguntas abiertas, reportes, espacios sin anfitrión) y salud explicable
  (activación, tiempo a primera respuesta, concentración del top 10%) — nunca volumen
  bruto.
- Nav móvil corregida: `nav.slice(0,5)` hacía desaparecer "Mi perfil"; los avisos se
  mudaron a una campana con badge en el header, dejando 5 destinos con perfil incluido.

### C · Relaciones, mensajes y moderación
- `follows`, `connection_requests`/`connections`, `blocks`, `mutes` (`021`).
- `conversations`+`messages`+`message_requests`: 1:1, con solicitud cuando no hay
  relación suficiente. **El centro nunca los lee** — no hay política RLS que lo permita,
  ni ruta en la consola, ni endpoint de analítica. Probado por API directa: dirección
  autenticada contra `/rest/v1/messages` devuelve `[]`.
- `reports`→`moderation_actions` con motivo obligatorio y ámbito auditado.

### D · Website
- Nav/Footer con Hub Centro y Red ELEVA. Páginas `/hub-centro` (los tres círculos,
  comparación honesta con WhatsApp, privacidad) y `/red-eleva` (gates públicos del doc 19
  §16, cold start, lista de espera real en `red_eleva_waitlist` — insert-only, sin
  política de lectura pública). `/plataforma` corrige sus bullets de Hub Centro/Global a
  la arquitectura real. El `SYSTEM_MAP` del sidebar autenticado deja de declarar "activo"
  lo que es Alpha.

## Un hallazgo de implementación: RLS + `RETURNING`

Al construir `createPostInSpace`, un `insert().select().single()` con el cliente de
usuario fallaba con `42501 new row violates row-level security policy`, mientras el mismo
insert sin `.select()` (equivalente a `Prefer: return=minimal`) funcionaba. Reproducido
con `fetch` directo a PostgREST: `return=minimal` → 201, `return=representation` → 403.
La política `SELECT` de `posts` (`can_view_post`, que se auto-referencia sobre `posts`)
evaluada durante el `RETURNING` del propio `INSERT` no ve la fila recién insertada como
visible. Solución: generar el `id` en el servidor (`randomUUID()`) y no depender de
`RETURNING` en absoluto — más simple que investigar el límite exacto de Postgres/PostgREST
en este punto, y elimina la clase de bug para cualquier tabla con una política `SELECT`
auto-referencial.

## Verificación

`test:rls` (~80 aserciones, incluye 8 nuevas de Alpha 3) · `test:modelo` (29, canon doc 18)
· `test:rutas` (nuevo, ~35 aserciones de autorización por HTTP + reconciliación financiera
+ aislamiento de IA, verificado contra dev) · build y typecheck limpios · flujos E2E en
navegador: publicar en el centro, unirse a un círculo, mensaje directo con redirección,
lista de espera de Red ELEVA con verificación en base de datos.

## Consecuencias

- El costo de no separar RLS-como-verificado de RLS-como-lo-que-protege-la-app fue tres
  huecos de acceso reales en producción. `test:rutas` queda como gate permanente.
- Hub Centro deja de ser "la conversación de una generación" para ser lo que el blueprint
  pedía: comunidad institucional que persiste más allá de un rol o una etapa — probado
  explícitamente con el caso de la ex-staff, que pierde acceso operativo pero conserva su
  lugar en la comunidad del centro.
- Red Global sigue cerrada — el gate correcto dado un solo tenant sintético — pero ya no
  es una promesa sin forma: sus criterios son públicos y hay una lista de espera real.
