-- ══════════════════════════════════════════════════════════════════════════
-- ALPHA 3 · Release C — relaciones, mensajes y moderación
--
-- Contrato del blueprint doc 19 §12 y §19, que aquí se vuelve estructura:
--   «El centro NUNCA lee los mensajes directos.»
-- No es una promesa de la interfaz: las políticas solo dejan leer un mensaje a
-- los miembros de su conversación. Ni dirección, ni oficinas, ni la consola de
-- comunidad, ni la analítica tienen una ruta a ellos.
--
-- Tampoco toda co-membresía es amistad: seguir, conectar y escribir son actos
-- distintos, y cada uno puede bloquearse por separado.
-- ══════════════════════════════════════════════════════════════════════════

-- ---------------------------------------------------------------------------
-- 1) Relaciones
-- ---------------------------------------------------------------------------

create table public.follows (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  follower_person_id uuid not null references public.people (id) on delete cascade,
  followed_person_id uuid not null references public.people (id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (follower_person_id, followed_person_id),
  check (follower_person_id <> followed_person_id)
);

create table public.connection_requests (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  from_person_id uuid not null references public.people (id) on delete cascade,
  to_person_id uuid not null references public.people (id) on delete cascade,
  message text,
  status text not null default 'pendiente' check (status in ('pendiente', 'aceptada', 'declinada')),
  created_at timestamptz not null default now(),
  resolved_at timestamptz,
  unique (from_person_id, to_person_id),
  check (from_person_id <> to_person_id)
);

-- Conexión aceptada: se guarda ordenada para que exista una sola fila por par.
create table public.connections (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  person_a uuid not null references public.people (id) on delete cascade,
  person_b uuid not null references public.people (id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (person_a, person_b),
  check (person_a < person_b)
);

create table public.blocks (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  blocker_person_id uuid not null references public.people (id) on delete cascade,
  blocked_person_id uuid not null references public.people (id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (blocker_person_id, blocked_person_id),
  check (blocker_person_id <> blocked_person_id)
);

create table public.mutes (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  person_id uuid not null references public.people (id) on delete cascade,
  muted_person_id uuid references public.people (id) on delete cascade,
  muted_space_id uuid references public.spaces (id) on delete cascade,
  created_at timestamptz not null default now(),
  check (muted_person_id is not null or muted_space_id is not null)
);

create index idx_follows_follower on public.follows (follower_person_id);
create index idx_connections_a on public.connections (person_a);
create index idx_connections_b on public.connections (person_b);
create index idx_blocks_blocker on public.blocks (blocker_person_id);

create or replace function public.are_connected(p_other uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from connections c
    where (c.person_a = least(current_person_id(), p_other)
       and c.person_b = greatest(current_person_id(), p_other))
  )
$$;

create or replace function public.is_blocked_between(p_other uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from blocks b
    where (b.blocker_person_id = current_person_id() and b.blocked_person_id = p_other)
       or (b.blocker_person_id = p_other and b.blocked_person_id = current_person_id())
  )
$$;

-- ---------------------------------------------------------------------------
-- 2) Conversaciones privadas
-- ---------------------------------------------------------------------------

create table public.conversations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  kind text not null default 'directa' check (kind in ('directa', 'grupo')),
  created_by uuid references public.people (id) on delete set null,
  created_at timestamptz not null default now(),
  last_message_at timestamptz
);

create table public.conversation_members (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  conversation_id uuid not null references public.conversations (id) on delete cascade,
  person_id uuid not null references public.people (id) on delete cascade,
  last_read_at timestamptz,
  unique (conversation_id, person_id)
);

create table public.messages (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  conversation_id uuid not null references public.conversations (id) on delete cascade,
  sender_person_id uuid not null references public.people (id) on delete cascade,
  body text not null,
  created_at timestamptz not null default now(),
  deleted_at timestamptz
);

-- Cuando no hay relación suficiente, escribir es SOLICITAR, no enviar.
create table public.message_requests (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  from_person_id uuid not null references public.people (id) on delete cascade,
  to_person_id uuid not null references public.people (id) on delete cascade,
  body text not null,
  status text not null default 'pendiente' check (status in ('pendiente', 'aceptada', 'declinada')),
  created_at timestamptz not null default now(),
  resolved_at timestamptz,
  unique (from_person_id, to_person_id)
);

create index idx_conv_members_person on public.conversation_members (person_id);
create index idx_messages_conversation on public.messages (conversation_id, created_at);

create or replace function public.is_conversation_member(p_conversation uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from conversation_members cm
    where cm.conversation_id = p_conversation and cm.person_id = current_person_id()
  )
$$;

-- ---------------------------------------------------------------------------
-- 3) Moderación
-- ---------------------------------------------------------------------------

create table public.reports (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  reporter_person_id uuid not null references public.people (id) on delete cascade,
  target_kind text not null check (target_kind in ('post', 'comment', 'person', 'message')),
  target_id uuid not null,
  reason text not null check (reason in (
    'acoso', 'spam', 'contenido_inapropiado', 'historia_de_tercero', 'seguridad', 'otro'
  )),
  detail text,
  status text not null default 'abierto' check (status in ('abierto', 'en_revision', 'resuelto', 'desestimado')),
  created_at timestamptz not null default now()
);

create table public.moderation_actions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  report_id uuid references public.reports (id) on delete set null,
  moderator_person_id uuid not null references public.people (id) on delete cascade,
  action text not null check (action in (
    'ocultar_contenido', 'eliminar_contenido', 'advertir', 'suspender_espacio', 'sin_accion'
  )),
  target_kind text not null,
  target_id uuid not null,
  rationale text not null,          -- moderar sin motivo escrito no es moderar
  created_at timestamptz not null default now()
);

create index idx_reports_org_status on public.reports (organization_id, status);

-- ---------------------------------------------------------------------------
-- 4) RLS — aquí vive la promesa de privacidad
-- ---------------------------------------------------------------------------

alter table public.follows enable row level security;
alter table public.connection_requests enable row level security;
alter table public.connections enable row level security;
alter table public.blocks enable row level security;
alter table public.mutes enable row level security;
alter table public.conversations enable row level security;
alter table public.conversation_members enable row level security;
alter table public.messages enable row level security;
alter table public.message_requests enable row level security;
alter table public.reports enable row level security;
alter table public.moderation_actions enable row level security;

-- Relaciones: cada quien ve las suyas; seguir es público dentro del centro.
create policy follows_select on public.follows for select using (
  follower_person_id = current_person_id()
  or followed_person_id = current_person_id()
);
create policy follows_write_own on public.follows for all
  using (follower_person_id = current_person_id())
  with check (follower_person_id = current_person_id() and not is_blocked_between(followed_person_id));

create policy conn_req_select on public.connection_requests for select using (
  from_person_id = current_person_id() or to_person_id = current_person_id()
);
create policy conn_req_insert on public.connection_requests for insert with check (
  from_person_id = current_person_id() and not is_blocked_between(to_person_id)
);
create policy conn_req_resolve on public.connection_requests for update
  using (to_person_id = current_person_id())
  with check (to_person_id = current_person_id());

create policy connections_select on public.connections for select using (
  person_a = current_person_id() or person_b = current_person_id()
);
create policy connections_delete_own on public.connections for delete using (
  person_a = current_person_id() or person_b = current_person_id()
);

create policy blocks_own on public.blocks for all
  using (blocker_person_id = current_person_id())
  with check (blocker_person_id = current_person_id());
create policy mutes_own on public.mutes for all
  using (person_id = current_person_id())
  with check (person_id = current_person_id());

-- ── Mensajes: SOLO los miembros de la conversación. Sin excepción de rol. ──
create policy conversations_select on public.conversations for select using (
  is_conversation_member(id)
);
create policy conv_members_select on public.conversation_members for select using (
  is_conversation_member(conversation_id)
);
create policy messages_select on public.messages for select using (
  is_conversation_member(conversation_id) and deleted_at is null
);
create policy messages_insert on public.messages for insert with check (
  sender_person_id = current_person_id() and is_conversation_member(conversation_id)
);
create policy messages_delete_own on public.messages for update
  using (sender_person_id = current_person_id())
  with check (sender_person_id = current_person_id());

create policy msg_req_select on public.message_requests for select using (
  from_person_id = current_person_id() or to_person_id = current_person_id()
);
create policy msg_req_insert on public.message_requests for insert with check (
  from_person_id = current_person_id() and not is_blocked_between(to_person_id)
);
create policy msg_req_resolve on public.message_requests for update
  using (to_person_id = current_person_id())
  with check (to_person_id = current_person_id());

-- Reportes: quien reporta ve el suyo; quien modera ve los de su centro.
create policy reports_select on public.reports for select using (
  reporter_person_id = current_person_id()
  or has_role(organization_id, array['dueno', 'oficinas'])
);
create policy reports_insert_own on public.reports for insert with check (
  reporter_person_id = current_person_id()
);
create policy moderation_actions_select on public.moderation_actions for select using (
  has_role(organization_id, array['dueno', 'oficinas'])
);

-- Los perfiles bloqueados dejan de verse entre sí.
drop policy people_select_cycle_mates on public.people;
create policy people_select_cycle_mates on public.people for select using (
  shares_cycle_with(id) and not is_blocked_between(id)
);

-- Compañeros de espacio también se ven (el centro y los círculos existen).
create policy people_select_space_mates on public.people for select using (
  exists (
    select 1
    from space_memberships mine
    join space_memberships theirs on theirs.space_id = mine.space_id
    where mine.person_id = current_person_id() and theirs.person_id = people.id
  )
  and not is_blocked_between(id)
);
