-- ELEVA Core · Auditoría y eventos de dominio (outbox lean)
-- El evento de producto no sustituye auditoría; la auditoría no sustituye analítica.

create table public.audit_events (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references public.organizations (id) on delete cascade,
  actor_person_id uuid references public.people (id),
  action text not null,
  object_type text not null,
  object_id uuid,
  details jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

-- Formato del doc 11: hechos en pasado, versión explícita, actor y sujeto separados.
create table public.domain_events (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references public.organizations (id) on delete cascade,
  event_name text not null,
  event_version int not null default 1,
  actor jsonb not null default '{}'::jsonb,
  subject jsonb not null default '{}'::jsonb,
  scope jsonb not null default '{}'::jsonb,
  correlation_id uuid,
  properties jsonb not null default '{}'::jsonb,
  occurred_at timestamptz not null default now()
);

create index idx_audit_org_created on public.audit_events (organization_id, created_at);
create index idx_domain_events_org_name on public.domain_events (organization_id, event_name, occurred_at);

-- Server-only: RLS habilitado sin políticas de cliente. Solo la dueña consulta auditoría.
alter table public.audit_events enable row level security;
alter table public.domain_events enable row level security;

create policy audit_select_dueno on public.audit_events for select using (
  organization_id is not null and has_role(organization_id, array['dueno'])
);

-- ---------------------------------------------------------------------------
-- Compañeros de generación: un miembro puede ver nombres de quienes comparten
-- su generación (para autores de posts y "quién me acompaña"), nada más.
-- SECURITY DEFINER evita recursión de RLS sobre participations.
-- ---------------------------------------------------------------------------

create or replace function public.shares_cohort_with(p_person uuid)
returns boolean
language sql stable security definer
set search_path = public
as $$
  select exists (
    select 1
    from participations mine
    join participations theirs on theirs.cohort_id = mine.cohort_id
    where mine.person_id = current_person_id()
      and theirs.person_id = p_person
      and mine.state in ('confirmado', 'activo', 'pausa', 'completo', 'elegible_siguiente', 'inscrito_siguiente', 'alumni')
      and theirs.state in ('confirmado', 'activo', 'pausa', 'completo', 'elegible_siguiente', 'inscrito_siguiente', 'alumni')
  )
$$;

create policy people_select_cohort_mates on public.people for select using (
  shares_cohort_with(id)
);
