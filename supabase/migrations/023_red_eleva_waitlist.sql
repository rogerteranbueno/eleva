-- ══════════════════════════════════════════════════════════════════════════
-- Red ELEVA — lista de espera pública.
-- La red global permanece cerrada hasta cumplir sus gates (doc 19 §16): esta
-- tabla solo recibe intención, nunca abre acceso. Insert-only para el rol
-- anónimo; lectura reservada al equipo de producto vía service role.
-- ══════════════════════════════════════════════════════════════════════════

create table public.red_eleva_waitlist (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null,
  role text not null check (role in ('dirijo_centro', 'persona_entrenada')),
  center_name text,
  message text,
  created_at timestamptz not null default now()
);

alter table public.red_eleva_waitlist enable row level security;

create policy waitlist_insert_anon on public.red_eleva_waitlist for insert
  to anon, authenticated
  with check (true);
-- Sin política de SELECT: nadie lee esto por el cliente público, ni siquiera
-- quien lo envió. Solo el service role (consola interna) accede.
