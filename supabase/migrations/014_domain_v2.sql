-- ══════════════════════════════════════════════════════════════════════════
-- DOMINIO CANÓNICO v2 — contrato: blueprint doc 18
-- El ciclo real: Básico (3 días) → Avanzado (~15 días después) → PL (4 meses
-- con Visión/Intimar/Aprecio + graduación) → alumni/staff/capitán → siguiente
-- Básico. Planos de estado separados. Pases medibles. Ledger con asignación.
-- Todo el dato previo es sintético: rebuild + reseed (015), sin expand/contract.
-- ══════════════════════════════════════════════════════════════════════════

-- ---------------------------------------------------------------------------
-- 0) Retirar el modelo anterior (se conservan: identidad/orgs, posts/comments/
--    reactions/recognitions/notifications, audit, domain_events, ai_summaries)
-- ---------------------------------------------------------------------------

drop table if exists public.signals cascade;
drop table if exists public.interventions cascade;
drop table if exists public.outcomes cascade;
drop table if exists public.cases cascade;
drop table if exists public.mission_completions cascade;
drop table if exists public.missions cascade;
drop table if exists public.rsvps cascade;
drop table if exists public.attendance_records cascade;
drop table if exists public.small_group_members cascade;
drop table if exists public.small_groups cascade;
drop table if exists public.team_assignments cascade;
drop table if exists public.sessions cascade;
drop table if exists public.events cascade;
drop table if exists public.participation_state_history cascade;
drop table if exists public.participations cascade;
drop table if exists public.payments cascade;
drop table if exists public.charges cascade;
drop table if exists public.levels cascade;
drop table if exists public.cohorts cascade;

-- Políticas de tablas SOBREVIVIENTES que dependen de helpers de cohorte:
-- deben caer antes que las funciones (Postgres bloquea el drop si no).
-- can_view_post NO se tira: comments y post_reactions la usan; se reemplaza.
drop policy if exists posts_select on public.posts;
drop policy if exists posts_insert_member on public.posts;
drop policy if exists recognitions_select on public.recognitions;
drop policy if exists recognitions_insert_own on public.recognitions;
drop policy if exists people_select_cohort_mates on public.people;
drop policy if exists people_select_my_cohort_team on public.people;

drop function if exists public.is_cohort_member(uuid);
drop function if exists public.shares_cohort_with(uuid);
drop function if exists public.is_team_for_my_cohort(uuid);

-- El contenido social se resiembra apuntando al ciclo.
truncate table public.post_reactions, public.comments, public.posts cascade;
-- cascade: el check multi-columna (visibility_scope, cohort_id) cae con la columna
alter table public.posts drop column cohort_id cascade;

-- El rol de servicio "capitán" existe como asignación.
alter table public.role_assignments drop constraint role_assignments_role_check;
alter table public.role_assignments add constraint role_assignments_role_check check (role in (
  'dueno', 'oficinas', 'entrenador', 'coach', 'capitan', 'staff', 'dream_team', 'finanzas', 'participante'
));
alter table public.role_assignments drop column if exists cohort_id;

-- ---------------------------------------------------------------------------
-- 1) Ciclo y entrega
-- ---------------------------------------------------------------------------

create table public.generation_cycles (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  program_id uuid not null references public.programs (id) on delete cascade,
  name text not null,           -- "Generación 42"
  number int,
  status text not null default 'planeada' check (status in ('planeada', 'activa', 'graduada', 'cerrada')),
  created_at timestamptz not null default now()
);

create table public.stage_runs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  cycle_id uuid not null references public.generation_cycles (id) on delete cascade,
  stage text not null check (stage in ('basico', 'avanzado', 'pl')),
  name text not null,           -- "Básico G42"
  starts_on date not null,
  ends_on date not null,
  capacity int,
  location_id uuid references public.locations (id),
  price_cents bigint,
  currency char(3) not null default 'MXN',
  status text not null default 'planeada' check (status in ('planeada', 'activa', 'completada', 'cerrada')),
  created_at timestamptz not null default now(),
  unique (cycle_id, stage)
);

-- Un Básico son 3 días tipados; un PL son hitos, actividades y llamadas.
-- Nunca "8 sesiones genéricas".
create table public.event_occurrences (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  stage_run_id uuid references public.stage_runs (id) on delete cascade,
  cycle_id uuid references public.generation_cycles (id) on delete cascade,
  kind text not null check (kind in (
    'dia_basico', 'dia_avanzado', 'hito_pl', 'graduacion',
    'actividad_equipo', 'llamada', 'evento_centro', 'evento_alumni'
  )),
  name text not null,           -- "Viernes", "Visión", "Carrera de equipo"
  description text,
  starts_at timestamptz not null,
  ends_at timestamptz,
  timezone text not null default 'America/Mexico_City',
  modality text not null default 'presencial' check (modality in ('presencial', 'online', 'hibrida')),
  location_text text,
  created_by uuid references public.people (id),
  created_at timestamptz not null default now(),
  check (stage_run_id is not null or cycle_id is not null or kind in ('evento_centro', 'evento_alumni'))
);

-- Planos de estado separados: registro y entrega aquí; finanzas SIEMPRE
-- derivada del ledger; asistencia por evento; pase en continuity_passes;
-- servicio en team_assignments. Un solo enum no representa la realidad.
create table public.stage_participations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  person_id uuid not null references public.people (id) on delete cascade,
  stage_run_id uuid not null references public.stage_runs (id) on delete cascade,
  registration_status text not null default 'confirmado' check (registration_status in (
    'invitado', 'iniciado', 'incompleto', 'confirmado', 'cancelado'
  )),
  delivery_status text not null default 'esperado' check (delivery_status in (
    'esperado', 'activo', 'pausa', 'retirado', 'completo', 'no_completo'
  )),
  source text,
  registered_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (person_id, stage_run_id)
);

create table public.participation_plane_history (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  participation_id uuid not null references public.stage_participations (id) on delete cascade,
  plane text not null check (plane in ('registro', 'entrega')),
  from_status text,
  to_status text not null,
  reason text,
  changed_by uuid references public.people (id),
  created_at timestamptz not null default now()
);

-- El faltante queda visible como "sin registro": expectativa sin registro.
create table public.attendance_expectations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  event_occurrence_id uuid not null references public.event_occurrences (id) on delete cascade,
  stage_participation_id uuid not null references public.stage_participations (id) on delete cascade,
  expected boolean not null default true,
  reason text,
  unique (event_occurrence_id, stage_participation_id)
);

create table public.attendance_records (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  event_occurrence_id uuid not null references public.event_occurrences (id) on delete cascade,
  stage_participation_id uuid not null references public.stage_participations (id) on delete cascade,
  status text not null check (status in ('presente', 'tarde', 'justificada', 'ausente')),
  recorded_by uuid references public.people (id),
  corrected boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (event_occurrence_id, stage_participation_id)
);

create table public.rsvps (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  event_occurrence_id uuid not null references public.event_occurrences (id) on delete cascade,
  person_id uuid not null references public.people (id) on delete cascade,
  status text not null check (status in ('confirmado', 'no_puedo')),
  responded_at timestamptz not null default now(),
  unique (event_occurrence_id, person_id)
);

-- ---------------------------------------------------------------------------
-- 2) Continuidad (pase) y enrolamiento
-- ---------------------------------------------------------------------------

-- El pase es un proceso verificable, no un estado del enum.
create table public.continuity_passes (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  from_participation_id uuid not null references public.stage_participations (id) on delete cascade,
  to_stage_run_id uuid references public.stage_runs (id) on delete set null,
  pass_status text not null default 'no_evaluado' check (pass_status in (
    'no_evaluado', 'elegible', 'conversado', 'ofrecido', 'aceptado', 'declinado', 'diferido'
  )),
  next_status text not null default 'sin_intencion' check (next_status in (
    'sin_intencion', 'reservado', 'inscrito', 'iniciado', 'no_show'
  )),
  evaluated_at timestamptz,
  conversed_at timestamptz,
  offered_at timestamptz,
  decided_at timestamptz,
  enrolled_at timestamptz,
  started_at timestamptz,
  recorded_by uuid references public.people (id),
  notes text,
  created_at timestamptz not null default now(),
  unique (from_participation_id)
);

-- Plano CRM: la relación antes (y entre) participaciones.
create table public.prospects (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  person_id uuid not null references public.people (id) on delete cascade,
  target_stage_run_id uuid references public.stage_runs (id) on delete set null,
  crm_status text not null default 'nuevo' check (crm_status in (
    'nuevo', 'contactado', 'cita', 'interesado', 'registro_iniciado', 'convertido', 'perdido', 'reactivable'
  )),
  source text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Atribución auditable: quién enroló a quién, en qué contexto y qué pasó.
create table public.enrollment_attributions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  enrolled_person_id uuid not null references public.people (id) on delete cascade,
  enroller_person_id uuid not null references public.people (id) on delete cascade,
  context_stage_run_id uuid references public.stage_runs (id) on delete set null,
  prospect_id uuid references public.prospects (id) on delete set null,
  status text not null default 'lead' check (status in ('lead', 'registrado', 'confirmado', 'no_avanzo')),
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- 3) Equipo y acompañamiento (asignaciones con ámbito y vigencia)
-- ---------------------------------------------------------------------------

create table public.team_assignments (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  stage_run_id uuid not null references public.stage_runs (id) on delete cascade,
  person_id uuid not null references public.people (id) on delete cascade,
  role text not null check (role in ('entrenador', 'coach', 'capitan', 'staff')),
  reports_to_person_id uuid references public.people (id),
  starts_at timestamptz not null default now(),
  ends_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.small_groups (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  stage_run_id uuid not null references public.stage_runs (id) on delete cascade,
  name text not null,
  staff_person_id uuid references public.people (id),
  created_at timestamptz not null default now()
);

create table public.small_group_members (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  small_group_id uuid not null references public.small_groups (id) on delete cascade,
  stage_participation_id uuid not null references public.stage_participations (id) on delete cascade,
  unique (small_group_id, stage_participation_id)
);

-- Llamadas de seguimiento del staff (PL): esperada → realizada con resultado.
create table public.follow_up_interactions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  stage_participation_id uuid not null references public.stage_participations (id) on delete cascade,
  staff_person_id uuid not null references public.people (id) on delete cascade,
  expected_on date not null,
  done_at timestamptz,
  resultado text check (resultado in ('contactada', 'sin_respuesta', 'reagendada', 'escalada')),
  notes text,
  created_at timestamptz not null default now()
);

create table public.reading_assignments (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  stage_run_id uuid not null references public.stage_runs (id) on delete cascade,
  title text not null,
  author text,
  due_on date,
  created_at timestamptz not null default now()
);

create table public.reading_progress (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  assignment_id uuid not null references public.reading_assignments (id) on delete cascade,
  stage_participation_id uuid not null references public.stage_participations (id) on delete cascade,
  completed_at timestamptz not null default now(),
  unique (assignment_id, stage_participation_id)
);

create table public.missions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  stage_run_id uuid not null references public.stage_runs (id) on delete cascade,
  title text not null,
  description text,
  due_on date,
  sequence int,
  created_at timestamptz not null default now()
);

create table public.mission_completions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  mission_id uuid not null references public.missions (id) on delete cascade,
  stage_participation_id uuid not null references public.stage_participations (id) on delete cascade,
  note text,
  completed_at timestamptz not null default now(),
  unique (mission_id, stage_participation_id)
);

-- ---------------------------------------------------------------------------
-- 4) Ledger financiero mínimo
-- ---------------------------------------------------------------------------

create table public.payment_plans (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  stage_participation_id uuid references public.stage_participations (id) on delete set null,
  person_id uuid not null references public.people (id) on delete cascade,
  concept text not null,
  total_cents bigint not null check (total_cents > 0),
  currency char(3) not null default 'MXN',
  installments_count int not null default 1,
  created_at timestamptz not null default now()
);

create table public.charges (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  person_id uuid not null references public.people (id) on delete cascade,
  stage_participation_id uuid references public.stage_participations (id) on delete set null,
  plan_id uuid references public.payment_plans (id) on delete set null,
  concept text not null,
  amount_cents bigint not null check (amount_cents > 0),
  currency char(3) not null default 'MXN',
  due_on date not null,
  status text not null default 'pendiente' check (status in ('pendiente', 'parcial', 'pagado', 'cancelado')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Un pago NO pertenece a un cargo: se reparte mediante asignaciones.
-- Sin asignación = pago no identificado (visible, nunca escondido).
create table public.payments (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  person_id uuid references public.people (id) on delete set null,
  amount_cents bigint not null check (amount_cents > 0),
  currency char(3) not null default 'MXN',
  method text not null check (method in ('efectivo', 'transferencia', 'tarjeta', 'otro')),
  reference text,
  paid_at timestamptz not null default now(),
  confirmed boolean not null default true, -- confirmado por evidencia/PSP
  reconciliation_batch_id uuid,            -- FK abajo
  recorded_by uuid references public.people (id),
  created_at timestamptz not null default now()
);

create table public.payment_allocations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  payment_id uuid not null references public.payments (id) on delete cascade,
  charge_id uuid not null references public.charges (id) on delete cascade,
  amount_cents bigint not null check (amount_cents > 0),
  created_at timestamptz not null default now(),
  unique (payment_id, charge_id)
);

create table public.refunds (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  payment_id uuid not null references public.payments (id) on delete cascade,
  amount_cents bigint not null check (amount_cents > 0),
  currency char(3) not null default 'MXN',
  reason text not null,
  approved_by uuid references public.people (id),
  created_at timestamptz not null default now()
);

create table public.discounts (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  charge_id uuid not null references public.charges (id) on delete cascade,
  amount_cents bigint not null check (amount_cents > 0),
  kind text not null check (kind in ('beca', 'descuento', 'ajuste')),
  reason text not null,
  approved_by uuid references public.people (id),
  created_at timestamptz not null default now()
);

create table public.expenses (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  stage_run_id uuid references public.stage_runs (id) on delete set null,
  category text not null check (category in (
    'entrenador', 'sede', 'materiales', 'alimentos', 'viajes', 'logistica', 'comisiones', 'fees', 'otro'
  )),
  concept text not null,
  amount_cents bigint not null check (amount_cents > 0),
  currency char(3) not null default 'MXN',
  incurred_on date not null,
  recorded_by uuid references public.people (id),
  created_at timestamptz not null default now()
);

create table public.reconciliation_batches (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  period_start date not null,
  period_end date not null,
  status text not null default 'abierta' check (status in ('abierta', 'cerrada')),
  closed_by uuid references public.people (id),
  closed_at timestamptz,
  created_at timestamptz not null default now()
);

alter table public.payments
  add constraint payments_batch_fk foreign key (reconciliation_batch_id)
  references public.reconciliation_batches (id) on delete set null;

-- ---------------------------------------------------------------------------
-- 5) Señales, casos e intervenciones v2 (con tipo de caso)
-- ---------------------------------------------------------------------------

create table public.cases (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  kind text not null default 'operacion' check (kind in (
    'finanzas', 'entrega', 'pase', 'registro', 'comunidad', 'operacion'
  )),
  subject_person_id uuid references public.people (id) on delete set null,
  stage_run_id uuid references public.stage_runs (id) on delete set null,
  cycle_id uuid references public.generation_cycles (id) on delete set null,
  title text not null,
  priority text not null default 'media' check (priority in ('alta', 'media', 'baja')),
  status text not null default 'abierto' check (status in ('abierto', 'en_progreso', 'esperando', 'resuelto', 'descartado')),
  assigned_role text not null default 'oficinas',
  assignee_person_id uuid references public.people (id),
  due_at timestamptz,
  opened_at timestamptz not null default now(),
  closed_at timestamptz,
  closed_reason text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.signals (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  definition_id uuid not null references public.signal_definitions (id),
  case_id uuid references public.cases (id) on delete set null,
  subject_person_id uuid references public.people (id) on delete cascade,
  stage_participation_id uuid references public.stage_participations (id) on delete cascade,
  stage_run_id uuid references public.stage_runs (id) on delete set null,
  dedupe_key text not null unique, -- incluye bucket temporal: condiciones persistentes reaparecen
  status text not null default 'abierta' check (status in ('abierta', 'revisada', 'descartada')),
  evidence jsonb not null default '{}'::jsonb,
  explanation text not null,
  detected_at timestamptz not null default now(),
  reviewed_at timestamptz,
  reviewed_by uuid references public.people (id)
);

create table public.interventions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  case_id uuid not null references public.cases (id) on delete cascade,
  kind text not null check (kind in ('contactar', 'corregir_dato', 'reprogramar', 'ofrecer_opciones', 'escalar', 'cerrar_sin_contacto')),
  channel text check (channel in ('whatsapp', 'telefono', 'email', 'presencial', 'ninguno')),
  draft_message text,
  notes text,
  performed_by uuid references public.people (id),
  performed_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create table public.outcomes (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  case_id uuid not null references public.cases (id) on delete cascade,
  intervention_id uuid references public.interventions (id) on delete set null,
  result text not null check (result in (
    'respuesta_recibida', 'dato_corregido', 'opcion_elegida', 'asistencia_posterior',
    'pago_resuelto', 'pausa_solicitada', 'sin_accion_por_respeto', 'no_alcanzado', 'otro'
  )),
  notes text,
  recorded_by uuid references public.people (id),
  recorded_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- 6) Comunidad: el espacio social vive en el CICLO
-- ---------------------------------------------------------------------------

alter table public.posts add column cycle_id uuid references public.generation_cycles (id) on delete cascade;
alter table public.posts drop constraint posts_visibility_scope_check;
alter table public.posts add constraint posts_visibility_scope_check check (visibility_scope in ('generacion', 'centro'));
alter table public.posts add constraint posts_scope_check check (visibility_scope != 'generacion' or cycle_id is not null);

-- ---------------------------------------------------------------------------
-- 7) Índices
-- ---------------------------------------------------------------------------

create index idx_stage_runs_cycle on public.stage_runs (cycle_id);
create index idx_events_v2_stage on public.event_occurrences (stage_run_id, starts_at);
create index idx_events_v2_org_starts on public.event_occurrences (organization_id, starts_at);
create index idx_sp_stage on public.stage_participations (stage_run_id);
create index idx_sp_person on public.stage_participations (person_id);
create index idx_expectations_event on public.attendance_expectations (event_occurrence_id);
create index idx_att_v2_event on public.attendance_records (event_occurrence_id);
create index idx_passes_from on public.continuity_passes (from_participation_id);
create index idx_passes_to on public.continuity_passes (to_stage_run_id);
create index idx_prospects_org_status on public.prospects (organization_id, crm_status);
create index idx_attrib_enroller on public.enrollment_attributions (enroller_person_id);
create index idx_team_v2_stage on public.team_assignments (stage_run_id);
create index idx_followups_staff on public.follow_up_interactions (staff_person_id, expected_on);
create index idx_charges_v2_org on public.charges (organization_id, due_on);
create index idx_payments_v2_org on public.payments (organization_id, paid_at);
create index idx_allocations_payment on public.payment_allocations (payment_id);
create index idx_allocations_charge on public.payment_allocations (charge_id);
create index idx_cases_v2_org_status on public.cases (organization_id, status);
create index idx_signals_v2_org_status on public.signals (organization_id, status);
create index idx_posts_cycle on public.posts (cycle_id, created_at);

-- ---------------------------------------------------------------------------
-- 8) Helpers de autorización (SECURITY DEFINER)
-- ---------------------------------------------------------------------------

create or replace function public.is_stage_member(stage uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from stage_participations sp
    where sp.stage_run_id = stage
      and sp.person_id = current_person_id()
      and sp.registration_status = 'confirmado'
  )
$$;

create or replace function public.is_cycle_member(cycle uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from stage_participations sp
    join stage_runs sr on sr.id = sp.stage_run_id
    where sr.cycle_id = cycle
      and sp.person_id = current_person_id()
      and sp.registration_status = 'confirmado'
  )
$$;

create or replace function public.shares_cycle_with(p_person uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1
    from stage_participations mine
    join stage_runs sr1 on sr1.id = mine.stage_run_id
    join stage_runs sr2 on sr2.cycle_id = sr1.cycle_id
    join stage_participations theirs on theirs.stage_run_id = sr2.id
    where mine.person_id = current_person_id()
      and theirs.person_id = p_person
      and mine.registration_status = 'confirmado'
      and theirs.registration_status = 'confirmado'
  )
$$;

create or replace function public.is_team_for_my_cycle(p_person uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1
    from team_assignments ta
    join stage_runs sr on sr.id = ta.stage_run_id
    join stage_runs mine_sr on mine_sr.cycle_id = sr.cycle_id
    join stage_participations mine on mine.stage_run_id = mine_sr.id
    where ta.person_id = p_person
      and mine.person_id = current_person_id()
      and mine.registration_status = 'confirmado'
      and ta.starts_at <= now()
      and (ta.ends_at is null or ta.ends_at > now())
  )
$$;

-- Staff: ¿esta participación está en un grupo que me asignaron?
create or replace function public.is_staff_of_participation(p_participation uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1
    from small_group_members sgm
    join small_groups sg on sg.id = sgm.small_group_id
    where sgm.stage_participation_id = p_participation
      and sg.staff_person_id = current_person_id()
  )
$$;

-- Rol de equipo vigente en una etapa concreta (capitán/staff/entrenador/coach).
create or replace function public.has_stage_role(stage uuid, roles text[])
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from team_assignments ta
    where ta.stage_run_id = stage
      and ta.person_id = current_person_id()
      and ta.role = any (roles)
      and ta.starts_at <= now()
      and (ta.ends_at is null or ta.ends_at > now())
  )
$$;

create or replace function public.can_view_post(p_post uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from posts po
    where po.id = p_post
      and (
        is_team(po.organization_id)
        or (po.visibility_scope = 'generacion' and is_cycle_member(po.cycle_id))
        or (po.visibility_scope = 'centro' and po.organization_id in (select active_org_ids()))
      )
  )
$$;

-- ---------------------------------------------------------------------------
-- 9) RLS deny-by-default
-- ---------------------------------------------------------------------------

alter table public.generation_cycles enable row level security;
alter table public.stage_runs enable row level security;
alter table public.event_occurrences enable row level security;
alter table public.stage_participations enable row level security;
alter table public.participation_plane_history enable row level security;
alter table public.attendance_expectations enable row level security;
alter table public.attendance_records enable row level security;
alter table public.rsvps enable row level security;
alter table public.continuity_passes enable row level security;
alter table public.prospects enable row level security;
alter table public.enrollment_attributions enable row level security;
alter table public.team_assignments enable row level security;
alter table public.small_groups enable row level security;
alter table public.small_group_members enable row level security;
alter table public.follow_up_interactions enable row level security;
alter table public.reading_assignments enable row level security;
alter table public.reading_progress enable row level security;
alter table public.missions enable row level security;
alter table public.mission_completions enable row level security;
alter table public.payment_plans enable row level security;
alter table public.charges enable row level security;
alter table public.payments enable row level security;
alter table public.payment_allocations enable row level security;
alter table public.refunds enable row level security;
alter table public.discounts enable row level security;
alter table public.expenses enable row level security;
alter table public.reconciliation_batches enable row level security;
alter table public.cases enable row level security;
alter table public.signals enable row level security;
alter table public.interventions enable row level security;
alter table public.outcomes enable row level security;

-- Ciclos y etapas: equipo del centro o miembro del ciclo.
create policy cycles_select on public.generation_cycles for select using (
  is_team(organization_id) or is_cycle_member(id)
);
create policy stage_runs_select on public.stage_runs for select using (
  is_team(organization_id) or is_cycle_member(cycle_id)
);
create policy events_v2_select on public.event_occurrences for select using (
  is_team(organization_id)
  or (stage_run_id is not null and exists (
        select 1 from stage_runs sr where sr.id = event_occurrences.stage_run_id and is_cycle_member(sr.cycle_id)))
  or (cycle_id is not null and is_cycle_member(cycle_id))
  or (kind in ('evento_centro', 'evento_alumni') and organization_id in (select active_org_ids()))
);

-- Participaciones: propia, equipo del centro, o staff de su grupo.
create policy sp_select on public.stage_participations for select using (
  person_id = current_person_id()
  or is_team(organization_id)
  or is_staff_of_participation(id)
);
create policy plane_history_select on public.participation_plane_history for select using (
  is_team(organization_id)
);

create policy expectations_select on public.attendance_expectations for select using (
  is_team(organization_id)
  or exists (select 1 from stage_participations sp where sp.id = attendance_expectations.stage_participation_id and sp.person_id = current_person_id())
);
create policy att_v2_select on public.attendance_records for select using (
  is_team(organization_id)
  or exists (select 1 from stage_participations sp where sp.id = attendance_records.stage_participation_id and sp.person_id = current_person_id())
  or is_staff_of_participation(stage_participation_id)
);

create policy rsvps_v2_select on public.rsvps for select using (
  person_id = current_person_id() or is_team(organization_id)
);
create policy rsvps_v2_insert_own on public.rsvps for insert with check (
  person_id = current_person_id()
  and exists (
    select 1 from event_occurrences e
    where e.id = rsvps.event_occurrence_id
      and e.organization_id = rsvps.organization_id
      and (
        (e.stage_run_id is not null and is_stage_member(e.stage_run_id))
        or (e.cycle_id is not null and is_cycle_member(e.cycle_id))
        or (e.kind in ('evento_centro', 'evento_alumni') and e.organization_id in (select active_org_ids()))
      )
  )
);
create policy rsvps_v2_update_own on public.rsvps for update using (
  person_id = current_person_id()
) with check (person_id = current_person_id());

-- Pase y CRM: solo equipo con capacidad (el participante lo vive en persona,
-- no como un pipeline sobre sí mismo).
create policy passes_select on public.continuity_passes for select using (
  has_role(organization_id, array['dueno', 'oficinas', 'entrenador', 'coach'])
);
create policy prospects_select on public.prospects for select using (
  has_role(organization_id, array['dueno', 'oficinas'])
);
create policy attributions_select on public.enrollment_attributions for select using (
  has_role(organization_id, array['dueno', 'oficinas'])
  or enroller_person_id = current_person_id()
);

create policy team_v2_select on public.team_assignments for select using (
  is_team(organization_id)
  or exists (select 1 from stage_runs sr where sr.id = team_assignments.stage_run_id and is_cycle_member(sr.cycle_id))
);
create policy groups_v2_select on public.small_groups for select using (
  is_team(organization_id)
  or exists (select 1 from stage_runs sr where sr.id = small_groups.stage_run_id and is_cycle_member(sr.cycle_id))
);
create policy group_members_v2_select on public.small_group_members for select using (
  is_team(organization_id)
  or exists (
    select 1 from small_groups sg
    join stage_runs sr on sr.id = sg.stage_run_id
    where sg.id = small_group_members.small_group_id and is_cycle_member(sr.cycle_id)
  )
);

-- Seguimiento de staff: el staff ve SOLO el suyo; la persona ve el propio
-- sin notas operativas (columna completa solo equipo — nota: RLS es por fila;
-- el detalle sensible va por servidor).
create policy followups_select on public.follow_up_interactions for select using (
  staff_person_id = current_person_id()
  or has_role(organization_id, array['dueno', 'oficinas', 'capitan', 'entrenador'])
);

create policy readings_select on public.reading_assignments for select using (
  is_team(organization_id)
  or exists (select 1 from stage_runs sr where sr.id = reading_assignments.stage_run_id and is_cycle_member(sr.cycle_id))
);
create policy reading_progress_select on public.reading_progress for select using (
  is_team(organization_id)
  or exists (select 1 from stage_participations sp where sp.id = reading_progress.stage_participation_id and sp.person_id = current_person_id())
);
create policy reading_progress_insert_own on public.reading_progress for insert with check (
  exists (select 1 from stage_participations sp where sp.id = reading_progress.stage_participation_id and sp.person_id = current_person_id())
);

create policy missions_v2_select on public.missions for select using (
  is_team(organization_id)
  or exists (select 1 from stage_runs sr where sr.id = missions.stage_run_id and is_cycle_member(sr.cycle_id))
);
create policy mission_completions_v2_select on public.mission_completions for select using (
  is_team(organization_id)
  or exists (select 1 from stage_participations sp where sp.id = mission_completions.stage_participation_id and sp.person_id = current_person_id())
);
create policy mission_completions_v2_insert_own on public.mission_completions for insert with check (
  exists (select 1 from stage_participations sp where sp.id = mission_completions.stage_participation_id and sp.person_id = current_person_id() and sp.organization_id = mission_completions.organization_id)
);

-- Ledger: solo roles financieros. Ocultar un botón no es control de acceso.
create policy plans_select on public.payment_plans for select using (
  has_role(organization_id, array['dueno', 'finanzas', 'oficinas'])
);
create policy charges_v2_select on public.charges for select using (
  has_role(organization_id, array['dueno', 'finanzas', 'oficinas'])
);
create policy payments_v2_select on public.payments for select using (
  has_role(organization_id, array['dueno', 'finanzas', 'oficinas'])
);
create policy allocations_select on public.payment_allocations for select using (
  has_role(organization_id, array['dueno', 'finanzas', 'oficinas'])
);
create policy refunds_select on public.refunds for select using (
  has_role(organization_id, array['dueno', 'finanzas', 'oficinas'])
);
create policy discounts_select on public.discounts for select using (
  has_role(organization_id, array['dueno', 'finanzas', 'oficinas'])
);
create policy expenses_select on public.expenses for select using (
  has_role(organization_id, array['dueno', 'finanzas'])
);
create policy batches_select on public.reconciliation_batches for select using (
  has_role(organization_id, array['dueno', 'finanzas', 'oficinas'])
);

-- Casos: los de finanzas SOLO para roles financieros; el resto para el equipo
-- operativo. El entrenador no ve ni opera casos financieros.
create policy cases_v2_select on public.cases for select using (
  case
    when kind = 'finanzas' then has_role(organization_id, array['dueno', 'finanzas', 'oficinas'])
    else has_role(organization_id, array['dueno', 'oficinas', 'entrenador', 'coach', 'capitan'])
  end
);
create policy signals_v2_select on public.signals for select using (
  exists (
    select 1 from cases c where c.id = signals.case_id
      and (case
        when c.kind = 'finanzas' then has_role(c.organization_id, array['dueno', 'finanzas', 'oficinas'])
        else has_role(c.organization_id, array['dueno', 'oficinas', 'entrenador', 'coach', 'capitan'])
      end)
  )
);
create policy interventions_v2_select on public.interventions for select using (
  exists (
    select 1 from cases c where c.id = interventions.case_id
      and (case
        when c.kind = 'finanzas' then has_role(c.organization_id, array['dueno', 'finanzas', 'oficinas'])
        else has_role(c.organization_id, array['dueno', 'oficinas', 'entrenador', 'coach', 'capitan'])
      end)
  )
);
create policy outcomes_v2_select on public.outcomes for select using (
  exists (
    select 1 from cases c where c.id = outcomes.case_id
      and (case
        when c.kind = 'finanzas' then has_role(c.organization_id, array['dueno', 'finanzas', 'oficinas'])
        else has_role(c.organization_id, array['dueno', 'oficinas', 'entrenador', 'coach', 'capitan'])
      end)
  )
);

-- Posts: recrear políticas sobre el ciclo.
drop policy if exists posts_select on public.posts;
drop policy if exists posts_insert_member on public.posts;
create policy posts_select on public.posts for select using (can_view_post(id));
create policy posts_insert_member on public.posts for insert with check (
  author_person_id = current_person_id()
  and (
    (visibility_scope = 'generacion' and is_cycle_member(cycle_id))
    or (visibility_scope = 'centro' and is_team(organization_id))
  )
);

-- Perfil visible entre compañeros de ciclo y hacia el equipo que acompaña.
create policy people_select_cycle_mates on public.people for select using (
  shares_cycle_with(id)
);
create policy people_select_my_cycle_team on public.people for select using (
  is_team_for_my_cycle(id)
);

-- Reconocimientos: recreadas sobre los helpers de ciclo.
create policy recognitions_select on public.recognitions for select using (
  is_team(organization_id)
  or from_person_id = current_person_id()
  or to_person_id = current_person_id()
  or shares_cycle_with(to_person_id)
  or shares_cycle_with(from_person_id)
);
create policy recognitions_insert_own on public.recognitions for insert with check (
  from_person_id = current_person_id()
  and (shares_cycle_with(to_person_id) or is_team_for_my_cycle(to_person_id))
);
