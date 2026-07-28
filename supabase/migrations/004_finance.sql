-- ELEVA OS · Finanzas operativas mínimas
-- Dinero en unidades menores + moneda. Nunca se mezclan:
-- revenue_booked (contratado) ≠ cash_collected (cobrado) ≠ accounts_receivable (por cobrar).

create table public.charges (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  person_id uuid not null references public.people (id) on delete cascade,
  participation_id uuid references public.participations (id) on delete set null,
  concept text not null,
  amount_cents bigint not null check (amount_cents > 0),
  currency char(3) not null default 'MXN',
  due_on date not null,
  status text not null default 'pendiente' check (status in ('pendiente', 'parcial', 'pagado', 'cancelado')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.payments (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  charge_id uuid not null references public.charges (id) on delete cascade,
  amount_cents bigint not null check (amount_cents > 0),
  currency char(3) not null default 'MXN',
  method text not null check (method in ('efectivo', 'transferencia', 'tarjeta', 'otro')),
  reference text,
  paid_at timestamptz not null default now(),
  reconciled boolean not null default false,
  reconciled_at timestamptz,
  reconciled_by uuid references public.people (id),
  created_at timestamptz not null default now()
);

create index idx_charges_org on public.charges (organization_id);
create index idx_charges_person on public.charges (person_id);
create index idx_payments_charge on public.payments (charge_id);
create index idx_payments_org_paid on public.payments (organization_id, paid_at);

alter table public.charges enable row level security;
alter table public.payments enable row level security;

-- Finanzas: solo roles con capacidad financiera. Ocultar un botón no es control de acceso.
create policy charges_select on public.charges for select using (
  has_role(organization_id, array['dueno', 'finanzas', 'oficinas'])
);

create policy payments_select on public.payments for select using (
  has_role(organization_id, array['dueno', 'finanzas', 'oficinas'])
);
