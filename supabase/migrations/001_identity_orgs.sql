-- ELEVA Core · Identidad y organizaciones
-- Regla del blueprint: el rol NUNCA es una propiedad global del perfil.
-- Persona ≠ cuenta. Membresías por organización, asignaciones con vigencia.

-- ---------------------------------------------------------------------------
-- Tablas
-- ---------------------------------------------------------------------------

create table public.people (
  id uuid primary key default gen_random_uuid(),
  user_id uuid unique references auth.users (id) on delete set null,
  full_name text not null,
  preferred_name text,
  email text,
  phone text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  brand jsonb not null default '{}'::jsonb,
  timezone text not null default 'America/Mexico_City',
  is_demo boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.locations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  name text not null,
  city text,
  created_at timestamptz not null default now()
);

create table public.organization_memberships (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  person_id uuid not null references public.people (id) on delete cascade,
  status text not null default 'active' check (status in ('active', 'inactive')),
  created_at timestamptz not null default now(),
  unique (organization_id, person_id)
);

-- Roles canónicos del centro (canon VIA): el seguimiento es de Oficinas,
-- el entrenador conduce, el staff acompaña grupos pequeños.
create table public.role_assignments (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  membership_id uuid not null references public.organization_memberships (id) on delete cascade,
  role text not null check (role in ('dueno', 'oficinas', 'entrenador', 'staff', 'dream_team', 'finanzas', 'participante')),
  cohort_id uuid, -- scope opcional; FK se agrega en 002
  starts_at timestamptz not null default now(),
  ends_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.consent_records (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  person_id uuid not null references public.people (id) on delete cascade,
  purpose text not null,
  channel text not null check (channel in ('email', 'whatsapp', 'sms', 'telefono')),
  granted boolean not null,
  text_version text not null,
  recorded_at timestamptz not null default now()
);

create index idx_memberships_org on public.organization_memberships (organization_id);
create index idx_memberships_person on public.organization_memberships (person_id);
create index idx_role_assignments_org on public.role_assignments (organization_id);
create index idx_role_assignments_membership on public.role_assignments (membership_id);
create index idx_consent_person on public.consent_records (person_id);

-- ---------------------------------------------------------------------------
-- Funciones de contexto (SECURITY DEFINER para evitar recursión de RLS)
-- ---------------------------------------------------------------------------

create or replace function public.current_person_id()
returns uuid
language sql stable security definer
set search_path = public
as $$
  select id from people where user_id = auth.uid()
$$;

create or replace function public.active_org_ids()
returns setof uuid
language sql stable security definer
set search_path = public
as $$
  select m.organization_id
  from organization_memberships m
  join people p on p.id = m.person_id
  where p.user_id = auth.uid()
    and m.status = 'active'
$$;

-- Rol vigente (respeta vigencia de la asignación: una asignación vencida pierde acceso)
create or replace function public.has_role(org uuid, roles text[])
returns boolean
language sql stable security definer
set search_path = public
as $$
  select exists (
    select 1
    from role_assignments ra
    join organization_memberships m on m.id = ra.membership_id
    join people p on p.id = m.person_id
    where p.user_id = auth.uid()
      and ra.organization_id = org
      and ra.role = any (roles)
      and ra.starts_at <= now()
      and (ra.ends_at is null or ra.ends_at > now())
      and m.status = 'active'
  )
$$;

create or replace function public.is_team(org uuid)
returns boolean
language sql stable security definer
set search_path = public
as $$
  select public.has_role(org, array['dueno', 'oficinas', 'entrenador', 'staff', 'dream_team', 'finanzas'])
$$;

-- ---------------------------------------------------------------------------
-- RLS: deny-by-default. Sin políticas de escritura para clientes en 001:
-- toda escritura de identidad/roles pasa por comandos de servidor auditados.
-- ---------------------------------------------------------------------------

alter table public.people enable row level security;
alter table public.organizations enable row level security;
alter table public.locations enable row level security;
alter table public.organization_memberships enable row level security;
alter table public.role_assignments enable row level security;
alter table public.consent_records enable row level security;

create policy people_select on public.people for select using (
  user_id = auth.uid()
  or exists (
    select 1 from organization_memberships m
    where m.person_id = people.id
      and m.organization_id in (select active_org_ids())
      and is_team(m.organization_id)
  )
);

create policy organizations_select on public.organizations for select using (
  id in (select active_org_ids())
);

create policy locations_select on public.locations for select using (
  organization_id in (select active_org_ids())
);

create policy memberships_select on public.organization_memberships for select using (
  person_id = current_person_id()
  or is_team(organization_id)
);

create policy role_assignments_select on public.role_assignments for select using (
  is_team(organization_id)
  or membership_id in (
    select id from organization_memberships where person_id = current_person_id()
  )
);

create policy consent_select on public.consent_records for select using (
  person_id = current_person_id()
  or has_role(organization_id, array['dueno', 'oficinas'])
);
