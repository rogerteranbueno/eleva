-- ELEVA Intelligence · Cache de salidas de IA
-- La IA propone y explica; nunca decide ni ejecuta. Cada salida queda
-- etiquetada con su fuente (claude | plantilla) y su modelo.

create table public.ai_summaries (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  kind text not null check (kind in ('pulso_semanal', 'caso')),
  ref_id uuid, -- id del caso cuando kind = 'caso'
  content jsonb not null,
  source text not null check (source in ('claude', 'plantilla')),
  model text,
  usage jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index idx_ai_summaries_lookup on public.ai_summaries (organization_id, kind, ref_id, created_at desc);

alter table public.ai_summaries enable row level security;

create policy ai_summaries_select on public.ai_summaries for select using (
  has_role(organization_id, array['dueno', 'oficinas', 'finanzas', 'entrenador'])
);
