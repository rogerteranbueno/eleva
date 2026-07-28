-- ELEVA Core · Programas, niveles, generaciones y participaciones
-- "Generación", no "cohorte", en la UI; los estados canónicos permanecen para analítica.

create table public.programs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  name text not null,
  description text,
  created_at timestamptz not null default now()
);

create table public.levels (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  program_id uuid not null references public.programs (id) on delete cascade,
  name text not null,
  sequence int not null,
  created_at timestamptz not null default now(),
  unique (program_id, sequence)
);

create table public.cohorts (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  program_id uuid not null references public.programs (id) on delete cascade,
  level_id uuid not null references public.levels (id),
  location_id uuid references public.locations (id),
  name text not null,
  code text,
  starts_on date not null,
  ends_on date,
  status text not null default 'planeada' check (status in ('planeada', 'activa', 'cerrada')),
  created_at timestamptz not null default now()
);

alter table public.role_assignments
  add constraint role_assignments_cohort_fk
  foreign key (cohort_id) references public.cohorts (id) on delete set null;

-- Estados canónicos del PRD del OS. Los centros renombran etiquetas visibles;
-- la semántica no cambia por cliente.
create table public.participations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  person_id uuid not null references public.people (id) on delete cascade,
  cohort_id uuid not null references public.cohorts (id) on delete cascade,
  state text not null default 'lead' check (state in (
    'lead', 'aplicado', 'registrado', 'pago_parcial', 'pagado', 'confirmado',
    'activo', 'pausa', 'completo', 'no_completo',
    'elegible_siguiente', 'inscrito_siguiente', 'alumni'
  )),
  source text,
  registered_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (person_id, cohort_id)
);

create table public.participation_state_history (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  participation_id uuid not null references public.participations (id) on delete cascade,
  from_state text,
  to_state text not null,
  reason text,
  changed_by uuid references public.people (id),
  created_at timestamptz not null default now()
);

create table public.small_groups (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  cohort_id uuid not null references public.cohorts (id) on delete cascade,
  name text not null,
  staff_person_id uuid references public.people (id),
  created_at timestamptz not null default now()
);

create table public.small_group_members (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  small_group_id uuid not null references public.small_groups (id) on delete cascade,
  participation_id uuid not null references public.participations (id) on delete cascade,
  unique (small_group_id, participation_id)
);

create table public.team_assignments (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  cohort_id uuid not null references public.cohorts (id) on delete cascade,
  person_id uuid not null references public.people (id) on delete cascade,
  role text not null check (role in ('entrenador', 'staff', 'dream_team', 'oficinas')),
  starts_at timestamptz not null default now(),
  ends_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.sessions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  cohort_id uuid not null references public.cohorts (id) on delete cascade,
  name text not null,
  sequence int,
  starts_at timestamptz not null,
  ends_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.attendance_records (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  session_id uuid not null references public.sessions (id) on delete cascade,
  participation_id uuid not null references public.participations (id) on delete cascade,
  status text not null check (status in ('presente', 'ausente', 'justificada', 'tarde')),
  recorded_by uuid references public.people (id),
  corrected boolean not null default false,
  correction_reason text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (session_id, participation_id)
);

create index idx_participations_org on public.participations (organization_id);
create index idx_participations_cohort on public.participations (cohort_id);
create index idx_participations_person on public.participations (person_id);
create index idx_sessions_cohort on public.sessions (cohort_id);
create index idx_attendance_session on public.attendance_records (session_id);
create index idx_attendance_participation on public.attendance_records (participation_id);

-- ---------------------------------------------------------------------------
-- Contexto de miembro: qué generaciones habito con participación real
-- ---------------------------------------------------------------------------

create or replace function public.is_cohort_member(cohort uuid)
returns boolean
language sql stable security definer
set search_path = public
as $$
  select exists (
    select 1 from participations pa
    where pa.cohort_id = cohort
      and pa.person_id = current_person_id()
      and pa.state in ('confirmado', 'activo', 'pausa', 'completo', 'elegible_siguiente', 'inscrito_siguiente', 'alumni')
  )
$$;

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------

alter table public.programs enable row level security;
alter table public.levels enable row level security;
alter table public.cohorts enable row level security;
alter table public.participations enable row level security;
alter table public.participation_state_history enable row level security;
alter table public.small_groups enable row level security;
alter table public.small_group_members enable row level security;
alter table public.team_assignments enable row level security;
alter table public.sessions enable row level security;
alter table public.attendance_records enable row level security;

create policy programs_select on public.programs for select using (is_team(organization_id));
create policy levels_select on public.levels for select using (is_team(organization_id));

create policy cohorts_select on public.cohorts for select using (
  is_team(organization_id) or is_cohort_member(id)
);

-- El participante ve SOLO su participación; los estados de otros no son públicos.
create policy participations_select on public.participations for select using (
  person_id = current_person_id() or is_team(organization_id)
);

create policy participation_history_select on public.participation_state_history for select using (
  is_team(organization_id)
);

create policy small_groups_select on public.small_groups for select using (
  is_team(organization_id) or is_cohort_member(cohort_id)
);

create policy small_group_members_select on public.small_group_members for select using (
  is_team(organization_id)
  or exists (
    select 1 from small_groups g
    where g.id = small_group_members.small_group_id
      and is_cohort_member(g.cohort_id)
  )
);

create policy team_assignments_select on public.team_assignments for select using (
  is_team(organization_id) or is_cohort_member(cohort_id)
);

create policy sessions_select on public.sessions for select using (
  is_team(organization_id) or is_cohort_member(cohort_id)
);

-- Asistencia: el participante ve la propia; el equipo la de su organización.
create policy attendance_select on public.attendance_records for select using (
  is_team(organization_id)
  or exists (
    select 1 from participations pa
    where pa.id = attendance_records.participation_id
      and pa.person_id = current_person_id()
  )
);
