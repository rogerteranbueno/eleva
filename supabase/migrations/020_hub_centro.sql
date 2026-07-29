-- ══════════════════════════════════════════════════════════════════════════
-- ALPHA 3 · Release B — Hub Centro: de feed de generación a red del centro
--
-- Hasta hoy, "Hub" era un feed privado de una generación: cuando la generación
-- terminaba, la comunidad se apagaba. Aquí aparece el modelo que faltaba —
-- ESPACIOS— para que existan el centro, los alumni y los círculos temáticos,
-- y para que la audiencia de una publicación sea un objeto explícito y no un
-- enum de dos valores.
--
-- Regla que gobierna todo: el contenido NUNCA sube de audiencia solo. Publicar
-- en tu generación no lo pone en el centro; nada privado asciende por defecto.
-- ══════════════════════════════════════════════════════════════════════════

-- ---------------------------------------------------------------------------
-- 1) Espacios
-- ---------------------------------------------------------------------------

create table public.spaces (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  kind text not null check (kind in ('generacion', 'centro', 'alumni', 'circulo', 'grupo', 'evento')),
  slug text not null,
  name text not null,
  purpose text,                      -- para qué existe: sin propósito no hay espacio
  ritual text,                       -- qué pasa cada semana
  visibility text not null default 'miembros' check (visibility in ('miembros', 'centro')),
  cycle_id uuid references public.generation_cycles (id) on delete cascade,
  stage_run_id uuid references public.stage_runs (id) on delete cascade,
  host_person_id uuid references public.people (id) on delete set null,
  archived_at timestamptz,
  created_at timestamptz not null default now(),
  unique (organization_id, slug),
  -- Un espacio de generación SIEMPRE apunta a su ciclo.
  check (kind <> 'generacion' or cycle_id is not null)
);

create table public.space_memberships (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  space_id uuid not null references public.spaces (id) on delete cascade,
  person_id uuid not null references public.people (id) on delete cascade,
  role text not null default 'miembro' check (role in ('miembro', 'anfitrion', 'moderador')),
  joined_at timestamptz not null default now(),
  muted boolean not null default false,
  unique (space_id, person_id)
);

create index idx_spaces_org_kind on public.spaces (organization_id, kind);
create index idx_space_memberships_person on public.space_memberships (person_id);
create index idx_space_memberships_space on public.space_memberships (space_id);

-- ---------------------------------------------------------------------------
-- 2) Las publicaciones viven en un espacio
-- ---------------------------------------------------------------------------

alter table public.posts add column space_id uuid references public.spaces (id) on delete cascade;
alter table public.posts add column updated_at timestamptz;
alter table public.posts add column edited_at timestamptz;
alter table public.posts add column deleted_at timestamptz;
alter table public.posts add column pinned_at timestamptz;

create table public.post_mentions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  post_id uuid not null references public.posts (id) on delete cascade,
  person_id uuid not null references public.people (id) on delete cascade,
  unique (post_id, person_id)
);

create table public.saved_posts (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  post_id uuid not null references public.posts (id) on delete cascade,
  person_id uuid not null references public.people (id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (post_id, person_id)
);

create index idx_posts_space_created on public.posts (space_id, created_at desc);

-- ---------------------------------------------------------------------------
-- 3) Perfil del centro con privacidad por campo
--    "Se separa cuenta privada / perfil de centro / perfil global": el global
--    se prepara aquí pero permanece cerrado hasta que existan sus gates.
-- ---------------------------------------------------------------------------

alter table public.people add column bio text;
alter table public.people add column city text;
alter table public.people add column interests text[] not null default '{}';
alter table public.people add column skills text[] not null default '{}';
alter table public.people add column offers text[] not null default '{}';
alter table public.people add column available_to_serve boolean not null default false;
alter table public.people add column accepts_messages text not null default 'centro'
  check (accepts_messages in ('nadie', 'conexiones', 'centro'));

create table public.profile_field_visibility (
  id uuid primary key default gen_random_uuid(),
  person_id uuid not null references public.people (id) on delete cascade,
  field text not null,
  visibility text not null default 'centro' check (visibility in ('privado', 'generacion', 'centro')),
  unique (person_id, field)
);

alter table public.profile_field_visibility enable row level security;
create policy pfv_select on public.profile_field_visibility for select using (true);
create policy pfv_write_own on public.profile_field_visibility for all
  using (person_id = current_person_id())
  with check (person_id = current_person_id());

-- ---------------------------------------------------------------------------
-- 4) Backfill: los ciclos y el centro estrenan sus espacios
-- ---------------------------------------------------------------------------

do $$
declare
  org record;
  cyc record;
  sp_id uuid;
begin
  for org in select id, slug, name from organizations loop
    -- Espacio del centro: todas las personas con membresía activa.
    insert into spaces (organization_id, kind, slug, name, purpose, ritual, visibility)
    values (
      org.id, 'centro', 'centro', org.name,
      'El lugar donde el centro entero conversa, más allá de una generación.',
      'Aviso de la semana los lunes.', 'centro'
    ) returning id into sp_id;
    insert into space_memberships (organization_id, space_id, person_id)
    select org.id, sp_id, m.person_id
    from organization_memberships m
    where m.organization_id = org.id and m.status = 'active';

    -- Espacio alumni: quienes ya completaron un PL.
    insert into spaces (organization_id, kind, slug, name, purpose, ritual, visibility)
    values (
      org.id, 'alumni', 'alumni', 'Alumni ' || org.name,
      'Las personas graduadas siguen aquí: se acompañan, sirven y vuelven.',
      'Encuentro de graduados cada mes.', 'miembros'
    ) returning id into sp_id;
    insert into space_memberships (organization_id, space_id, person_id)
    select distinct org.id, sp_id, sp.person_id
    from stage_participations sp
    join stage_runs sr on sr.id = sp.stage_run_id
    where sp.organization_id = org.id
      and sr.stage = 'pl'
      and sp.delivery_status = 'completo'
    on conflict do nothing;

    -- Un espacio por generación, con su gente ya dentro.
    for cyc in select id, name from generation_cycles where organization_id = org.id loop
      insert into spaces (organization_id, kind, slug, name, purpose, cycle_id, visibility)
      values (
        org.id, 'generacion', 'gen-' || replace(lower(cyc.name), ' ', '-'), cyc.name,
        'El espacio privado de ' || cyc.name || ' a través de todas sus etapas.',
        cyc.id, 'miembros'
      ) returning id into sp_id;

      insert into space_memberships (organization_id, space_id, person_id)
      select distinct org.id, sp_id, sp.person_id
      from stage_participations sp
      join stage_runs sr on sr.id = sp.stage_run_id
      where sr.cycle_id = cyc.id and sp.registration_status = 'confirmado'
      on conflict do nothing;

      -- El equipo que sirve también conversa en la generación.
      insert into space_memberships (organization_id, space_id, person_id, role)
      select distinct org.id, sp_id, ta.person_id, 'anfitrion'
      from team_assignments ta
      join stage_runs sr on sr.id = ta.stage_run_id
      where sr.cycle_id = cyc.id
        and ta.starts_at <= now()
        and (ta.ends_at is null or ta.ends_at > now())
      on conflict do nothing;

      -- Las publicaciones existentes se mudan al espacio de su ciclo.
      update posts set space_id = sp_id where cycle_id = cyc.id;
    end loop;

    -- Las que eran del centro pasan al espacio del centro.
    update posts p set space_id = (
      select s.id from spaces s where s.organization_id = org.id and s.kind = 'centro'
    )
    where p.organization_id = org.id and p.space_id is null;
  end loop;
end $$;

alter table public.posts alter column space_id set not null;
alter table public.posts drop constraint posts_scope_check;
-- La política vieja lee visibility_scope: cae antes que la columna.
drop policy if exists posts_insert_member on public.posts;
alter table public.posts drop column visibility_scope;
alter table public.posts drop column cycle_id;

-- ---------------------------------------------------------------------------
-- 5) Visibilidad: la membresía del espacio ES la audiencia
-- ---------------------------------------------------------------------------

create or replace function public.is_space_member(p_space uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from space_memberships sm
    where sm.space_id = p_space and sm.person_id = current_person_id()
  )
$$;

create or replace function public.can_view_post(p_post uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1
    from posts po
    join spaces s on s.id = po.space_id
    where po.id = p_post
      and po.deleted_at is null
      and (
        is_space_member(s.id)
        or (s.visibility = 'centro' and s.organization_id in (select active_org_ids()))
      )
  )
$$;

alter table public.spaces enable row level security;
alter table public.space_memberships enable row level security;
alter table public.post_mentions enable row level security;
alter table public.saved_posts enable row level security;

create policy spaces_select on public.spaces for select using (
  archived_at is null
  and (
    is_space_member(id)
    or (visibility = 'centro' and organization_id in (select active_org_ids()))
    or has_role(organization_id, array['dueno', 'oficinas'])
  )
);
create policy space_memberships_select on public.space_memberships for select using (
  person_id = current_person_id()
  or is_space_member(space_id)
  or has_role(organization_id, array['dueno', 'oficinas'])
);
-- Unirse a un espacio abierto del centro es decisión de la persona.
create policy space_memberships_join_open on public.space_memberships for insert with check (
  person_id = current_person_id()
  and exists (
    select 1 from spaces s
    where s.id = space_memberships.space_id
      and s.organization_id = space_memberships.organization_id
      and s.archived_at is null
      and s.kind in ('centro', 'circulo')
  )
);
create policy space_memberships_leave_own on public.space_memberships for delete using (
  person_id = current_person_id()
);

create policy post_mentions_select on public.post_mentions for select using (can_view_post(post_id));
create policy saved_posts_own on public.saved_posts for all
  using (person_id = current_person_id())
  with check (person_id = current_person_id() and can_view_post(post_id));

-- Publicar exige ser miembro del espacio: nadie escribe en una audiencia
-- a la que no pertenece.
create policy posts_insert_member on public.posts for insert with check (
  author_person_id = current_person_id() and is_space_member(space_id)
);
create policy posts_update_own on public.posts for update
  using (author_person_id = current_person_id())
  with check (author_person_id = current_person_id());

-- ---------------------------------------------------------------------------
-- 6) Círculos temáticos semilla (cold start del doc 19 §17)
-- ---------------------------------------------------------------------------

do $$
declare
  org record;
  sp_id uuid;
begin
  for org in select id, name from organizations where is_demo loop
    insert into spaces (organization_id, kind, slug, name, purpose, ritual, visibility, host_person_id)
    values
      (org.id, 'circulo', 'pide-ofrece', 'Pide y ofrece',
       'Pedir apoyo concreto también es parte del entrenamiento. Aquí se pide y se ofrece.',
       'Cada lunes: qué necesitas esta semana.', 'centro', null),
      (org.id, 'circulo', 'despues-de-graduarte', 'Lo que nadie te dijo después de graduarte',
       'El regreso a la vida diaria después del PL, contado por quienes ya lo vivieron.',
       'Una pregunta abierta cada jueves.', 'centro', null);
  end loop;
end $$;
