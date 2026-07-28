-- ELEVA Hub Centro · Capa social v1 (activos de Creania sobre el modelo nuevo)
-- 9 tipos de publicación con campos estructurados, 7 reacciones con significado,
-- reconocimientos, perfil de transformación y avisos.

-- ---------------------------------------------------------------------------
-- 1) Posts: 9 tipos + campos estructurados
-- ---------------------------------------------------------------------------

alter table public.posts drop constraint posts_kind_check;
alter table public.posts add constraint posts_kind_check check (kind in (
  'declaracion', 'aprendizaje', 'pregunta', 'celebracion', 'evidencia',
  'proyecto', 'ayuda', 'oportunidad', 'aviso'
));
alter table public.posts add column fields jsonb not null default '{}'::jsonb;

-- ---------------------------------------------------------------------------
-- 2) Reacciones con significado (una por persona por post; sin "like")
-- ---------------------------------------------------------------------------

create table public.post_reactions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  post_id uuid not null references public.posts (id) on delete cascade,
  person_id uuid not null references public.people (id) on delete cascade,
  kind text not null check (kind in (
    'te_veo', 'te_reconozco', 'me_inspira', 'gracias',
    'estoy_contigo', 'poderoso', 'posibilidad'
  )),
  created_at timestamptz not null default now(),
  unique (post_id, person_id)
);

create index idx_post_reactions_post on public.post_reactions (post_id);

alter table public.post_reactions enable row level security;

-- Heredan la visibilidad del post; jamás la amplían.
create policy post_reactions_select on public.post_reactions for select using (
  can_view_post(post_id)
);
create policy post_reactions_insert_own on public.post_reactions for insert with check (
  person_id = current_person_id() and can_view_post(post_id)
);
create policy post_reactions_update_own on public.post_reactions for update using (
  person_id = current_person_id()
) with check (person_id = current_person_id());
create policy post_reactions_delete_own on public.post_reactions for delete using (
  person_id = current_person_id()
);

-- ---------------------------------------------------------------------------
-- 3) Reconocimientos ("Te reconozco por…" + impacto)
-- ---------------------------------------------------------------------------

create table public.recognitions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  from_person_id uuid not null references public.people (id) on delete cascade,
  to_person_id uuid not null references public.people (id) on delete cascade,
  text text not null,
  impact text,
  created_at timestamptz not null default now(),
  check (from_person_id != to_person_id)
);

create index idx_recognitions_to on public.recognitions (to_person_id);

alter table public.recognitions enable row level security;

-- Visibles para quien comparte generación con emisor o receptor, y para el equipo.
create policy recognitions_select on public.recognitions for select using (
  is_team(organization_id)
  or from_person_id = current_person_id()
  or to_person_id = current_person_id()
  or shares_cohort_with(to_person_id)
);
create policy recognitions_insert_own on public.recognitions for insert with check (
  from_person_id = current_person_id()
  and organization_id in (select active_org_ids())
  and (shares_cohort_with(to_person_id) or is_team_for_my_cohort(to_person_id))
);

-- ---------------------------------------------------------------------------
-- 4) Perfil de transformación (campos propios de la persona)
-- ---------------------------------------------------------------------------

alter table public.people add column declaration text;
alter table public.people add column looking_for text[] not null default '{}';

-- La persona edita SOLO su declaración y búsqueda (server actions usan su sesión).
create policy people_update_own_profile on public.people for update using (
  user_id = auth.uid()
) with check (user_id = auth.uid());

-- ---------------------------------------------------------------------------
-- 5) Avisos (notificaciones en producto)
-- ---------------------------------------------------------------------------

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  person_id uuid not null references public.people (id) on delete cascade,
  kind text not null check (kind in ('reaccion', 'comentario', 'reconocimiento', 'evento', 'sistema')),
  text text not null,
  href text,
  read boolean not null default false,
  created_at timestamptz not null default now()
);

create index idx_notifications_person on public.notifications (person_id, read, created_at desc);

alter table public.notifications enable row level security;

create policy notifications_select_own on public.notifications for select using (
  person_id = current_person_id()
);
create policy notifications_update_own on public.notifications for update using (
  person_id = current_person_id()
) with check (person_id = current_person_id());

-- ---------------------------------------------------------------------------
-- 6) Seed social mínimo para el demo
-- ---------------------------------------------------------------------------

do $$
declare
  org_aurora uuid := 'a0000000-0000-4000-8000-000000000001';
  p_val uuid := 'ae000000-0000-4000-8000-000000000004';
  p_ana uuid := 'ae000000-0000-4000-8000-000000000007';
begin
  -- Declaraciones de perfil
  update people set declaration = 'Estoy creando una vida donde las conversaciones difíciles ya no me detienen.', looking_for = array['buddy de accountability', 'amigos']
  where id = p_val;
  update people set declaration = 'Estoy creando espacios donde la gente se atreve a pedir ayuda.'
  where id = p_ana;
  update people set declaration = 'Estoy creando mi primer negocio sin traicionar mi descanso.'
  where id = 'ae000000-0000-4000-8000-000000000012'; -- Renata

  -- Reacciones de arranque en la conversación de la G42
  insert into post_reactions (organization_id, post_id, person_id, kind)
  select org_aurora, po.id, x.pid, x.kind
  from posts po
  cross join lateral (values
    ('ae000000-0000-4000-8000-000000000013'::uuid, 'me_inspira'),
    ('ae000000-0000-4000-8000-000000000014'::uuid, 'estoy_contigo')
  ) as x(pid, kind)
  where po.author_person_id = 'ae000000-0000-4000-8000-000000000013'
  on conflict do nothing;

  insert into post_reactions (organization_id, post_id, person_id, kind)
  select org_aurora, po.id, 'ae000000-0000-4000-8000-000000000020'::uuid, 'poderoso'
  from posts po where po.kind = 'celebracion'
  on conflict do nothing;

  -- Un reconocimiento sembrado
  insert into recognitions (organization_id, from_person_id, to_person_id, text, impact)
  values (
    org_aurora,
    'ae000000-0000-4000-8000-000000000014',
    p_val,
    'Te reconozco por acompañarme después de la Sesión 4 cuando yo quería salir corriendo.',
    'Me quedé, y esa sesión me cambió la semana.'
  );
end $$;
