-- ELEVA OS · Señales, casos, intervenciones y resultados
-- Una señal es evidencia observable con regla versionada; no es diagnóstico.
-- El ciclo: detectar → explicar → asignar → actuar → registrar resultado → aprender.

create table public.signal_definitions (
  id uuid primary key default gen_random_uuid(),
  key text not null,
  version int not null default 1,
  name text not null,
  description text not null,
  rule text not null, -- descripción humana de la regla determinista
  severity text not null default 'atencion' check (severity in ('info', 'atencion', 'urgente')),
  assigned_role text not null default 'oficinas',
  active boolean not null default true,
  created_at timestamptz not null default now(),
  unique (key, version)
);

create table public.cases (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  subject_person_id uuid references public.people (id) on delete set null,
  cohort_id uuid references public.cohorts (id) on delete set null,
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
  participation_id uuid references public.participations (id) on delete cascade,
  cohort_id uuid references public.cohorts (id) on delete set null,
  dedupe_key text not null unique, -- definición + sujeto + ventana → idempotencia
  status text not null default 'abierta' check (status in ('abierta', 'revisada', 'descartada')),
  evidence jsonb not null default '{}'::jsonb,
  explanation text not null, -- de dónde sale esta señal, en lenguaje humano
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
  draft_message text, -- borrador respetuoso; una persona decide y envía, nunca el sistema
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

create index idx_signals_org_status on public.signals (organization_id, status);
create index idx_signals_case on public.signals (case_id);
create index idx_cases_org_status on public.cases (organization_id, status);
create index idx_interventions_case on public.interventions (case_id);
create index idx_outcomes_case on public.outcomes (case_id);

-- ---------------------------------------------------------------------------
-- RLS: la operación de seguimiento pertenece al equipo con capacidad.
-- El participante NUNCA ve señales, casos ni intervenciones sobre sí mismo aquí
-- (el contacto le llega por canales humanos, no por el sistema de seguimiento).
-- ---------------------------------------------------------------------------

alter table public.signal_definitions enable row level security;
alter table public.signals enable row level security;
alter table public.cases enable row level security;
alter table public.interventions enable row level security;
alter table public.outcomes enable row level security;

-- Las definiciones son catálogo global no sensible para el equipo autenticado.
create policy signal_definitions_select on public.signal_definitions for select using (
  auth.uid() is not null and exists (select 1 from active_org_ids())
);

create policy signals_select on public.signals for select using (
  has_role(organization_id, array['dueno', 'oficinas', 'entrenador', 'finanzas'])
);

create policy cases_select on public.cases for select using (
  has_role(organization_id, array['dueno', 'oficinas', 'entrenador', 'finanzas'])
);

create policy interventions_select on public.interventions for select using (
  has_role(organization_id, array['dueno', 'oficinas', 'entrenador', 'finanzas'])
);

create policy outcomes_select on public.outcomes for select using (
  has_role(organization_id, array['dueno', 'oficinas', 'entrenador', 'finanzas'])
);
