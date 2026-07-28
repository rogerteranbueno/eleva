-- ELEVA Hub Centro · Comunidad mínima para el home del participante
-- La unidad social inicial es la generación, no el feed.
-- Los hijos (comentarios, RSVPs) heredan la visibilidad del padre; nunca la amplían.

create table public.events (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  cohort_id uuid references public.cohorts (id) on delete cascade, -- null = evento del centro
  title text not null,
  description text,
  starts_at timestamptz not null,
  ends_at timestamptz,
  timezone text not null default 'America/Mexico_City',
  modality text not null default 'presencial' check (modality in ('presencial', 'online', 'hibrida')),
  location_text text,
  created_by uuid references public.people (id),
  created_at timestamptz not null default now()
);

create table public.rsvps (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  event_id uuid not null references public.events (id) on delete cascade,
  person_id uuid not null references public.people (id) on delete cascade,
  status text not null check (status in ('confirmado', 'no_puedo')),
  responded_at timestamptz not null default now(),
  unique (event_id, person_id)
);

create table public.missions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  cohort_id uuid not null references public.cohorts (id) on delete cascade,
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
  participation_id uuid not null references public.participations (id) on delete cascade,
  note text,
  completed_at timestamptz not null default now(),
  unique (mission_id, participation_id)
);

create table public.posts (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  cohort_id uuid references public.cohorts (id) on delete cascade,
  author_person_id uuid not null references public.people (id) on delete cascade,
  kind text not null default 'declaracion' check (kind in ('declaracion', 'aprendizaje', 'pregunta', 'celebracion', 'evidencia', 'aviso')),
  body text not null,
  visibility_scope text not null default 'generacion' check (visibility_scope in ('generacion', 'centro')),
  created_at timestamptz not null default now(),
  check (visibility_scope != 'generacion' or cohort_id is not null)
);

create table public.comments (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  post_id uuid not null references public.posts (id) on delete cascade,
  author_person_id uuid not null references public.people (id) on delete cascade,
  body text not null,
  created_at timestamptz not null default now()
);

create index idx_events_org_starts on public.events (organization_id, starts_at);
create index idx_rsvps_event on public.rsvps (event_id);
create index idx_missions_cohort on public.missions (cohort_id);
create index idx_posts_cohort_created on public.posts (cohort_id, created_at);
create index idx_comments_post on public.comments (post_id);

-- ---------------------------------------------------------------------------
-- Visibilidad de un post: función única para que los hijos hereden exactamente
-- ---------------------------------------------------------------------------

create or replace function public.can_view_post(p_post uuid)
returns boolean
language sql stable security definer
set search_path = public
as $$
  select exists (
    select 1 from posts po
    where po.id = p_post
      and (
        is_team(po.organization_id)
        or (po.visibility_scope = 'generacion' and is_cohort_member(po.cohort_id))
        or (po.visibility_scope = 'centro' and po.organization_id in (select active_org_ids()))
      )
  )
$$;

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------

alter table public.events enable row level security;
alter table public.rsvps enable row level security;
alter table public.missions enable row level security;
alter table public.mission_completions enable row level security;
alter table public.posts enable row level security;
alter table public.comments enable row level security;

create policy events_select on public.events for select using (
  is_team(organization_id)
  or (cohort_id is not null and is_cohort_member(cohort_id))
  or (cohort_id is null and organization_id in (select active_org_ids()))
);

create policy rsvps_select on public.rsvps for select using (
  person_id = current_person_id() or is_team(organization_id)
);

-- El miembro confirma por sí mismo, solo en eventos que puede ver.
create policy rsvps_insert_own on public.rsvps for insert with check (
  person_id = current_person_id()
  and exists (
    select 1 from events e
    where e.id = rsvps.event_id
      and e.organization_id = rsvps.organization_id
      and (
        (e.cohort_id is not null and is_cohort_member(e.cohort_id))
        or (e.cohort_id is null and e.organization_id in (select active_org_ids()))
      )
  )
);

create policy rsvps_update_own on public.rsvps for update using (
  person_id = current_person_id()
) with check (person_id = current_person_id());

create policy missions_select on public.missions for select using (
  is_team(organization_id) or is_cohort_member(cohort_id)
);

create policy mission_completions_select on public.mission_completions for select using (
  is_team(organization_id)
  or exists (
    select 1 from participations pa
    where pa.id = mission_completions.participation_id
      and pa.person_id = current_person_id()
  )
);

create policy mission_completions_insert_own on public.mission_completions for insert with check (
  exists (
    select 1 from participations pa
    where pa.id = mission_completions.participation_id
      and pa.person_id = current_person_id()
      and pa.organization_id = mission_completions.organization_id
  )
);

create policy posts_select on public.posts for select using (can_view_post(id));

create policy posts_insert_member on public.posts for insert with check (
  author_person_id = current_person_id()
  and (
    (visibility_scope = 'generacion' and is_cohort_member(cohort_id))
    or (visibility_scope = 'centro' and is_team(organization_id))
  )
);

-- Los comentarios heredan la visibilidad del post; jamás la amplían.
create policy comments_select on public.comments for select using (can_view_post(post_id));

create policy comments_insert_member on public.comments for insert with check (
  author_person_id = current_person_id() and can_view_post(post_id)
);
