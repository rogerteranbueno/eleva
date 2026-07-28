-- Alpha 2 · Correcciones de la auditoría del 28-jul
-- 1) Los miembros deben poder ver nombres del equipo que acompaña su generación
--    (staff/entrenador no tienen participación → la RLS los ocultaba: avatar "?").
-- 2) Horarios del seed a las 19:00 hora del centro (12:35 a.m. no es creíble).
-- 3) Usuario demo de finanzas para la vista de contadora.

-- ---------------------------------------------------------------------------
-- 1) Visibilidad del equipo de mi generación
-- ---------------------------------------------------------------------------

create or replace function public.is_team_for_my_cohort(p_person uuid)
returns boolean
language sql stable security definer
set search_path = public
as $$
  select exists (
    select 1
    from team_assignments ta
    join participations mine on mine.cohort_id = ta.cohort_id
    where ta.person_id = p_person
      and mine.person_id = current_person_id()
      and mine.state in ('confirmado', 'activo', 'pausa', 'completo', 'elegible_siguiente', 'inscrito_siguiente', 'alumni')
      and ta.starts_at <= now()
      and (ta.ends_at is null or ta.ends_at > now())
  )
$$;

create policy people_select_my_cohort_team on public.people for select using (
  is_team_for_my_cohort(id)
);

-- ---------------------------------------------------------------------------
-- 2) Horarios realistas: sesiones y eventos a las 19:00 America/Mexico_City
--    (solo el tenant demo; conserva el día, corrige la hora)
-- ---------------------------------------------------------------------------

update public.sessions s
set starts_at = (s.starts_at at time zone 'America/Mexico_City')::date + time '19:00' at time zone 'America/Mexico_City',
    ends_at = (s.starts_at at time zone 'America/Mexico_City')::date + time '22:00' at time zone 'America/Mexico_City'
from public.organizations o
where o.id = s.organization_id and o.is_demo;

update public.events e
set starts_at = (e.starts_at at time zone 'America/Mexico_City')::date + time '19:00' at time zone 'America/Mexico_City',
    ends_at = (e.starts_at at time zone 'America/Mexico_City')::date + time '21:30' at time zone 'America/Mexico_City'
from public.organizations o
where o.id = e.organization_id and o.is_demo;

-- ---------------------------------------------------------------------------
-- 3) Usuario demo de finanzas (Rosa Aguirre)
-- ---------------------------------------------------------------------------

do $$
declare
  u_fin uuid := 'de000000-0000-4000-8000-000000000007';
  p_fin uuid := 'ae000000-0000-4000-8000-000000000045';
  org_aurora uuid := 'a0000000-0000-4000-8000-000000000001';
  m_id uuid;
begin
  insert into auth.users (
    id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
    confirmation_token, recovery_token, email_change, email_change_token_new,
    email_change_token_current, phone_change, phone_change_token, reauthentication_token
  ) values (
    u_fin, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
    'finanzas@aurora.demo', extensions.crypt('ElevaDemo2026!', extensions.gen_salt('bf')), now(),
    '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb, now(), now(),
    '', '', '', '', '', '', '', ''
  );
  insert into auth.identities (id, user_id, provider_id, provider, identity_data, last_sign_in_at, created_at, updated_at)
  values (
    gen_random_uuid(), u_fin, u_fin::text, 'email',
    jsonb_build_object('sub', u_fin::text, 'email', 'finanzas@aurora.demo', 'email_verified', true),
    now(), now(), now()
  );

  insert into people (id, user_id, full_name, preferred_name, email, phone)
  values (p_fin, u_fin, 'Rosa Aguirre', 'Rosa', 'finanzas@aurora.demo', '+52 55 1000 0010');

  insert into organization_memberships (organization_id, person_id)
  values (org_aurora, p_fin)
  returning id into m_id;

  insert into role_assignments (organization_id, membership_id, role, starts_at)
  values (org_aurora, m_id, 'finanzas', now() - interval '120 days');
end $$;
