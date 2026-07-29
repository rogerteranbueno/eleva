-- ══════════════════════════════════════════════════════════════════════════
-- ALPHA 3 · Release A — invariantes que hacen imposible el dato deshonesto
-- La auditoría del 28-jul encontró seis días de etapa cuyo nombre no
-- correspondía a su fecha ("Viernes" cayendo en domingo), un resumen de IA
-- compartido entre audiencias con permisos distintos, y objetos hijos que
-- confiaban en la organización de la sesión en vez de la de su padre.
-- Esto no se corrige con cuidado al escribir: se corrige en la base.
-- ══════════════════════════════════════════════════════════════════════════

-- ---------------------------------------------------------------------------
-- 1) El nombre del día debe coincidir con la fecha real, en la zona del evento
-- ---------------------------------------------------------------------------

create or replace function public.check_event_day_name()
returns trigger language plpgsql as $$
declare
  dia text;
  esperado text;
begin
  if new.kind not in ('dia_basico', 'dia_avanzado') then
    return new;
  end if;
  -- Nombre del día en la zona del evento, sin depender del locale del servidor.
  dia := (array['domingo','lunes','martes','miércoles','jueves','viernes','sábado'])[
    extract(dow from (new.starts_at at time zone new.timezone))::int + 1
  ];
  esperado := lower(trim(new.name));
  if esperado in ('domingo','lunes','martes','miércoles','miercoles','jueves','viernes','sábado','sabado')
     and translate(esperado, 'áéíóú', 'aeiou') <> translate(dia, 'áéíóú', 'aeiou') then
    raise exception
      'El evento se llama «%» pero su fecha cae en % (% en %). Un día de etapa no puede contradecir su calendario.',
      new.name, dia, (new.starts_at at time zone new.timezone)::date, new.timezone;
  end if;
  return new;
end;
$$;

create trigger event_day_name_matches_date
  before insert or update of name, starts_at, timezone, kind
  on public.event_occurrences
  for each row execute function public.check_event_day_name();

-- ---------------------------------------------------------------------------
-- 2) La IA se cachea por AUDIENCIA, no solo por tipo
--    Sin esto, un entrenador recibe el resumen que se generó con las cifras
--    financieras que solo dirección puede ver.
-- ---------------------------------------------------------------------------

alter table public.ai_summaries add column audience text not null default 'direccion';
-- El índice de 011 no conocía la audiencia: se reemplaza por el de la clave real.
drop index if exists public.idx_ai_summaries_lookup;
create index idx_ai_summaries_lookup
  on public.ai_summaries (organization_id, kind, audience, ref_id, created_at desc);

-- Los resúmenes previos se generaron sin ese aislamiento: se descartan.
delete from public.ai_summaries where kind = 'pulso_semanal';

-- ---------------------------------------------------------------------------
-- 3) Integridad compuesta: un hijo no puede pertenecer a otra organización
--    que su padre. Antes solo lo garantizaba la acción de servidor.
-- ---------------------------------------------------------------------------

create or replace function public.check_same_org_as_parent()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  parent_org uuid;
begin
  if tg_table_name = 'comments' then
    select organization_id into parent_org from posts where id = new.post_id;
  elsif tg_table_name = 'post_reactions' then
    select organization_id into parent_org from posts where id = new.post_id;
  elsif tg_table_name = 'attendance_records' or tg_table_name = 'attendance_expectations' then
    select organization_id into parent_org from event_occurrences where id = new.event_occurrence_id;
  elsif tg_table_name = 'payment_allocations' then
    select organization_id into parent_org from charges where id = new.charge_id;
  end if;
  if parent_org is not null and parent_org <> new.organization_id then
    raise exception 'Integridad: el registro pertenece a otra organización que su padre.';
  end if;
  return new;
end;
$$;

create trigger comments_same_org before insert or update on public.comments
  for each row execute function public.check_same_org_as_parent();
create trigger post_reactions_same_org before insert or update on public.post_reactions
  for each row execute function public.check_same_org_as_parent();
create trigger attendance_records_same_org before insert or update on public.attendance_records
  for each row execute function public.check_same_org_as_parent();
create trigger attendance_expectations_same_org before insert or update on public.attendance_expectations
  for each row execute function public.check_same_org_as_parent();
create trigger payment_allocations_same_org before insert or update on public.payment_allocations
  for each row execute function public.check_same_org_as_parent();

-- ---------------------------------------------------------------------------
-- 4) Una asignación de servicio no puede contradecirse a sí misma
--    Jorge Pineda figuraba como capitán de la G42 y staff en Equipo.
-- ---------------------------------------------------------------------------

-- Una persona no sirve dos roles distintos en la MISMA etapa a la vez.
create unique index uniq_team_assignment_person_stage
  on public.team_assignments (person_id, stage_run_id)
  where ends_at is null;

-- El rol de organización refleja el servicio de mayor alcance vigente.
do $$
declare
  r record;
  rank_of constant jsonb := '{"entrenador":4,"capitan":3,"coach":2,"staff":1}'::jsonb;
begin
  for r in
    select ta.person_id,
           ta.organization_id,
           (array_agg(ta.role order by (rank_of ->> ta.role)::int desc))[1] as top_role
    from team_assignments ta
    where ta.starts_at <= now() and (ta.ends_at is null or ta.ends_at > now())
    group by ta.person_id, ta.organization_id
  loop
    -- Cierra roles de servicio que ya no corresponden…
    update role_assignments ra
    set ends_at = now()
    from organization_memberships m
    where ra.membership_id = m.id
      and m.person_id = r.person_id
      and ra.organization_id = r.organization_id
      and ra.role in ('entrenador', 'coach', 'capitan', 'staff')
      and ra.role <> r.top_role
      and (ra.ends_at is null or ra.ends_at > now());

    -- …y garantiza que el vigente exista.
    if not exists (
      select 1 from role_assignments ra
      join organization_memberships m on m.id = ra.membership_id
      where m.person_id = r.person_id
        and ra.organization_id = r.organization_id
        and ra.role = r.top_role
        and ra.starts_at <= now()
        and (ra.ends_at is null or ra.ends_at > now())
    ) then
      insert into role_assignments (organization_id, membership_id, role, starts_at)
      select r.organization_id, m.id, r.top_role, now()
      from organization_memberships m
      where m.person_id = r.person_id and m.organization_id = r.organization_id;
    end if;
  end loop;
end $$;
