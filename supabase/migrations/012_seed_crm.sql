-- Seed demo · Pipeline de entrada: Generación 43 (planeada) con personas
-- en estados tempranos, para que el CRM cuente la historia completa
-- lead → aplicado → registrado → pagado → confirmado.

do $$
declare
  org_aurora uuid := 'a0000000-0000-4000-8000-000000000001';
  prog_camino uuid := 'ac000000-0000-4000-8000-000000000001';
  lvl_basico uuid := 'ac000000-0000-4000-8000-000000000011';
  loc_roma uuid := 'a1000000-0000-4000-8000-000000000001';
  g43 uuid := 'cc000000-0000-4000-8000-000000000043';
  names text[] := array[
    'Regina Salcedo', 'Mateo Quintana', 'Ximena Prado',
    'Bruno Cervantes', 'Valentina Ochoa', 'Adrián Palacios'
  ];
  states text[] := array['lead', 'lead', 'aplicado', 'aplicado', 'registrado', 'pagado'];
  sources text[] := array['website', 'referido', 'website', 'instagram', 'website', 'referido'];
  pid uuid;
  m_id uuid;
  i int;
begin
  insert into cohorts (id, organization_id, program_id, level_id, location_id, name, code, starts_on, ends_on, status)
  values (g43, org_aurora, prog_camino, lvl_basico, loc_roma, 'Generación 43 · Básico', 'G43', current_date + 40, current_date + 96, 'planeada');

  for i in 1..6 loop
    pid := format('ae000000-0000-4000-8000-0000000000%s', (49 + i)::text)::uuid;
    insert into people (id, full_name, email, phone) values (
      pid,
      names[i],
      lower(replace(translate(names[i], 'áéíóúÁÉÍÓÚñÑ', 'aeiouAEIOUnN'), ' ', '.')) || '@correo.demo',
      '+52 55 4000 00' || lpad(i::text, 2, '0')
    );
    insert into organization_memberships (organization_id, person_id)
    values (org_aurora, pid)
    returning id into m_id;
    insert into role_assignments (organization_id, membership_id, role, starts_at)
    values (org_aurora, m_id, 'participante', now());
    insert into participations (organization_id, person_id, cohort_id, state, source, created_at)
    values (org_aurora, pid, g43, states[i], sources[i], now() - (7 - i) * interval '1 day');
  end loop;
end $$;
