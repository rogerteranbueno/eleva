-- ══════════════════════════════════════════════════════════════════════════
-- SEED CANÓNICO · Centro Aurora sobre el dominio v2 (doc 18)
-- G40 graduada (alumni) · G41 con PL en curso (mes 2/4) · G42 en la ventana
-- crítica Básico→Avanzado · G43 llenándose desde el PL y el CRM.
-- Criterio de aceptación: Paulina Reyes — graduada del PL G40, staff del
-- Básico G42 con 5 asignados y seguimiento, enroló a 2 personas, paga
-- parcialmente una certificación en USD y vive en el Hub. Sin duplicarse.
-- Usuarios nuevos: staff@aurora.demo (Paulina), capitan@aurora.demo (Marco),
-- pl@aurora.demo (Ivonne). Password: ElevaDemo2026!
-- ══════════════════════════════════════════════════════════════════════════

create or replace function public._seed_auth_user(uid uuid, em text)
returns void language plpgsql security definer as $fn$
begin
  insert into auth.users (
    id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
    confirmation_token, recovery_token, email_change, email_change_token_new,
    email_change_token_current, phone_change, phone_change_token, reauthentication_token
  ) values (
    uid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
    em, extensions.crypt('ElevaDemo2026!', extensions.gen_salt('bf')), now(),
    '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb, now(), now(),
    '', '', '', '', '', '', '', ''
  );
  insert into auth.identities (id, user_id, provider_id, provider, identity_data, last_sign_in_at, created_at, updated_at)
  values (gen_random_uuid(), uid, uid::text, 'email',
    jsonb_build_object('sub', uid::text, 'email', em, 'email_verified', true), now(), now(), now());
end;
$fn$;

do $$
declare
  org uuid := 'a0000000-0000-4000-8000-000000000001';
  prog uuid := 'ac000000-0000-4000-8000-000000000001';
  loc uuid := 'a1000000-0000-4000-8000-000000000001';
  tz constant text := 'America/Mexico_City';

  -- personas clave existentes
  p_duena uuid := 'ae000000-0000-4000-8000-000000000001'; -- Mariana
  p_ofi uuid := 'ae000000-0000-4000-8000-000000000002';   -- Carla
  p_entr uuid := 'ae000000-0000-4000-8000-000000000003';  -- Diego
  p_val uuid := 'ae000000-0000-4000-8000-000000000004';   -- Valeria
  p_ana uuid := 'ae000000-0000-4000-8000-000000000007';
  p_jorge uuid := 'ae000000-0000-4000-8000-000000000008';
  p_lucia uuid := 'ae000000-0000-4000-8000-000000000009';
  -- personas nuevas
  p_pau uuid := 'ae000000-0000-4000-8000-000000000046';   -- Paulina (staff@)
  p_marco uuid := 'ae000000-0000-4000-8000-000000000047'; -- Marco (capitan@)

  -- ciclos y etapas
  cy40 uuid := 'c4000000-0000-4000-8000-000000000040';
  cy41 uuid := 'c4000000-0000-4000-8000-000000000041';
  cy42 uuid := 'c4000000-0000-4000-8000-000000000042';
  cy43 uuid := 'c4000000-0000-4000-8000-000000000043';
  r40b uuid := 'c5000000-0000-4000-8000-000000004001';
  r40a uuid := 'c5000000-0000-4000-8000-000000004002';
  r40p uuid := 'c5000000-0000-4000-8000-000000004003';
  r41b uuid := 'c5000000-0000-4000-8000-000000004101';
  r41a uuid := 'c5000000-0000-4000-8000-000000004102';
  r41p uuid := 'c5000000-0000-4000-8000-000000004103';
  r42b uuid := 'c5000000-0000-4000-8000-000000004201';
  r42a uuid := 'c5000000-0000-4000-8000-000000004202';
  r42p uuid := 'c5000000-0000-4000-8000-000000004203';
  r43b uuid := 'c5000000-0000-4000-8000-000000004301';

  g42_ids uuid[];      -- 20 participantes del Básico G42 (Valeria + ae..10-28)
  g40_ids uuid[];      -- 15 alumni (ae..30-44)
  pl_ids uuid[];       -- 12 participantes del PL G41 (ae..60-71)
  pl_names text[] := array[
    'Ivonne Cásares', 'Ramón Uribe', 'Claudia Meraz', 'Esteban Bátiz',
    'Norma Cedillo', 'Aldo Barrera', 'Pilar Roldán', 'Gustavo Nieto',
    'Elena Zubiri', 'Federico Ayala', 'Sandra Quiroz', 'Miguel Terrazas'
  ];

  ev record;
  sp record;
  pid uuid;
  part_id uuid;
  plan_id_v uuid;
  charge_id_v uuid;
  pay_id uuid;
  batch_prev uuid;
  batch_now uuid;
  grp uuid;
  i int;
  j int;
  idx int;
  ev_ids uuid[];
  sp_id_of uuid;
begin
  g42_ids := array(select format('ae000000-0000-4000-8000-0000000000%s', lpad(n::text, 2, '0'))::uuid from generate_series(10, 28) n) || p_val;
  g40_ids := array(select format('ae000000-0000-4000-8000-0000000000%s', n::text)::uuid from generate_series(30, 44) n);
  pl_ids := array(select format('ae000000-0000-4000-8000-0000000000%s', n::text)::uuid from generate_series(60, 71) n);

  -- ── Personas y cuentas nuevas ─────────────────────────────────────────────
  perform _seed_auth_user('de000000-0000-4000-8000-000000000008', 'staff@aurora.demo');
  perform _seed_auth_user('de000000-0000-4000-8000-000000000009', 'capitan@aurora.demo');
  perform _seed_auth_user('de000000-0000-4000-8000-00000000000a', 'pl@aurora.demo');

  insert into people (id, user_id, full_name, preferred_name, email, phone, declaration) values
    (p_pau, 'de000000-0000-4000-8000-000000000008', 'Paulina Reyes', 'Paulina', 'staff@aurora.demo', '+52 55 5000 0001',
     'Estoy creando una vida donde servir a otros es mi forma de seguir creciendo.'),
    (p_marco, 'de000000-0000-4000-8000-000000000009', 'Marco Elizondo', 'Marco', 'capitan@aurora.demo', '+52 55 5000 0002',
     'Estoy creando equipos donde nadie carga solo.');

  for i in 1..12 loop
    pid := pl_ids[i];
    if i = 1 then
      insert into people (id, user_id, full_name, preferred_name, email, phone, declaration)
      values (pid, 'de000000-0000-4000-8000-00000000000a', pl_names[i], split_part(pl_names[i], ' ', 1), 'pl@aurora.demo', '+52 55 6000 0001',
        'Estoy creando un negocio que financia mi libertad y la de mi familia.');
    else
      insert into people (id, full_name, email, phone)
      values (pid, pl_names[i],
        lower(replace(translate(pl_names[i], 'áéíóúÁÉÍÓÚñÑ', 'aeiouAEIOUnN'), ' ', '.')) || '@correo.demo',
        '+52 55 6000 00' || lpad(i::text, 2, '0'));
    end if;
  end loop;

  insert into organization_memberships (organization_id, person_id)
  select org, x.pid from unnest(array[p_pau, p_marco] || pl_ids) as x(pid);

  insert into role_assignments (organization_id, membership_id, role, starts_at)
  select org, m.id, 'participante', now() - interval '200 days'
  from organization_memberships m
  where m.organization_id = org and m.person_id = any (array[p_pau, p_marco] || pl_ids);

  -- Paulina y Marco: asignaciones de SERVICIO con vigencia (no niveles).
  insert into role_assignments (organization_id, membership_id, role, starts_at, ends_at)
  select org, m.id, 'staff', now() - interval '30 days', now() + interval '60 days'
  from organization_memberships m
  where m.organization_id = org and m.person_id = p_pau;

  insert into role_assignments (organization_id, membership_id, role, starts_at, ends_at)
  select org, m.id, 'capitan', now() - interval '50 days', now() + interval '80 days'
  from organization_memberships m
  where m.organization_id = org and m.person_id = p_marco;

  -- ── Ciclos y etapas ───────────────────────────────────────────────────────
  insert into generation_cycles (id, organization_id, program_id, name, number, status) values
    (cy40, org, prog, 'Generación 40', 40, 'graduada'),
    (cy41, org, prog, 'Generación 41', 41, 'activa'),
    (cy42, org, prog, 'Generación 42', 42, 'activa'),
    (cy43, org, prog, 'Generación 43', 43, 'planeada');

  insert into stage_runs (id, organization_id, cycle_id, stage, name, starts_on, ends_on, capacity, location_id, price_cents, currency, status) values
    (r40b, org, cy40, 'basico',   'Básico G40',   current_date - 210, current_date - 208, 25, loc,  850000, 'MXN', 'cerrada'),
    (r40a, org, cy40, 'avanzado', 'Avanzado G40', current_date - 195, current_date - 193, 25, loc, 1200000, 'MXN', 'cerrada'),
    (r40p, org, cy40, 'pl',       'PL G40',       current_date - 180, current_date - 60,  20, loc, 2800000, 'MXN', 'cerrada'),
    (r41b, org, cy41, 'basico',   'Básico G41',   current_date - 75,  current_date - 73,  25, loc,  850000, 'MXN', 'completada'),
    (r41a, org, cy41, 'avanzado', 'Avanzado G41', current_date - 60,  current_date - 58,  25, loc, 1200000, 'MXN', 'completada'),
    (r41p, org, cy41, 'pl',       'PL G41',       current_date - 45,  current_date + 75,  20, loc, 2800000, 'MXN', 'activa'),
    (r42b, org, cy42, 'basico',   'Básico G42',   current_date - 12,  current_date - 10,  25, loc,  850000, 'MXN', 'completada'),
    (r42a, org, cy42, 'avanzado', 'Avanzado G42', current_date + 5,   current_date + 7,   25, loc, 1200000, 'MXN', 'planeada'),
    (r42p, org, cy42, 'pl',       'PL G42',       current_date + 21,  current_date + 141, 20, loc, 2800000, 'MXN', 'planeada'),
    (r43b, org, cy43, 'basico',   'Básico G43',   current_date + 40,  current_date + 42,  30, loc,  850000, 'MXN', 'planeada');

  -- ── Eventos tipados ──────────────────────────────────────────────────────
  -- Básico G42: viernes / sábado / domingo (hace 12–10 días)
  for i in 0..2 loop
    insert into event_occurrences (organization_id, stage_run_id, kind, name, starts_at, ends_at, modality, location_text)
    values (org, r42b, 'dia_basico',
      (array['Viernes', 'Sábado', 'Domingo'])[i + 1],
      ((current_date - 12 + i) + time '09:00') at time zone tz,
      ((current_date - 12 + i) + time '21:00') at time zone tz,
      'presencial', 'Sede Roma · Salón principal');
  end loop;
  -- Avanzado G42: en 5–7 días
  for i in 0..2 loop
    insert into event_occurrences (organization_id, stage_run_id, kind, name, starts_at, ends_at, modality, location_text)
    values (org, r42a, 'dia_avanzado',
      (array['Viernes', 'Sábado', 'Domingo'])[i + 1],
      ((current_date + 5 + i) + time '09:00') at time zone tz,
      ((current_date + 5 + i) + time '21:00') at time zone tz,
      'presencial', 'Sede Roma · Salón principal');
  end loop;
  -- PL G41: hitos Visión (hace 14d) / Intimar (+14d) / Aprecio (+45d) / Graduación (+75d)
  insert into event_occurrences (organization_id, stage_run_id, kind, name, description, starts_at, ends_at, modality, location_text) values
    (org, r41p, 'hito_pl', 'Visión',  'Primer fin de semana del PL.',
      ((current_date - 14) + time '19:00') at time zone tz, ((current_date - 12) + time '20:00') at time zone tz, 'presencial', 'Sede Roma'),
    (org, r41p, 'hito_pl', 'Intimar', 'Segundo fin de semana del PL.',
      ((current_date + 14) + time '19:00') at time zone tz, ((current_date + 16) + time '20:00') at time zone tz, 'presencial', 'Sede Roma'),
    (org, r41p, 'hito_pl', 'Aprecio', 'Tercer fin de semana del PL.',
      ((current_date + 45) + time '19:00') at time zone tz, ((current_date + 47) + time '20:00') at time zone tz, 'presencial', 'Sede Roma'),
    (org, r41p, 'graduacion', 'Graduación G41', 'Cierre y celebración del PL.',
      ((current_date + 75) + time '18:00') at time zone tz, ((current_date + 75) + time '22:00') at time zone tz, 'presencial', 'Sede Roma · Terraza'),
    (org, r41p, 'actividad_equipo', 'Reunión de equipos', 'Actividad entre semanas: avances de proyecto.',
      ((current_date - 7) + time '19:30') at time zone tz, ((current_date - 7) + time '21:30') at time zone tz, 'online', 'Zoom del centro'),
    (org, r41p, 'actividad_equipo', 'Carrera de contribución', 'Actividad entre semanas: carrera con causa.',
      ((current_date + 5) + time '08:00') at time zone tz, ((current_date + 5) + time '11:00') at time zone tz, 'presencial', 'Bosque de Chapultepec');
  -- Evento alumni del centro
  insert into event_occurrences (organization_id, kind, name, description, starts_at, ends_at, modality, location_text)
  values (org, 'evento_alumni', 'Noche de graduados', 'Encuentro abierto para graduados de todas las generaciones.',
    ((current_date + 9) + time '19:00') at time zone tz, ((current_date + 9) + time '21:30') at time zone tz, 'hibrida', 'Sede Roma · Terraza');

  -- ── Participaciones ──────────────────────────────────────────────────────
  -- G40 completo (alumni) + Paulina
  foreach pid in array (g40_ids || p_pau) loop
    insert into stage_participations (organization_id, person_id, stage_run_id, registration_status, delivery_status, registered_at)
    values
      (org, pid, r40b, 'confirmado', 'completo', now() - interval '215 days'),
      (org, pid, r40a, 'confirmado', 'completo', now() - interval '200 days'),
      (org, pid, r40p, 'confirmado', case when pid = any (array[g40_ids[14], g40_ids[15]]) then 'no_completo' else 'completo' end, now() - interval '185 days');
  end loop;

  -- G41: básico y avanzado completos, PL activo (12 personas + Marco pasó por G41 como participante? Marco es alumni G40)
  foreach pid in array pl_ids loop
    insert into stage_participations (organization_id, person_id, stage_run_id, registration_status, delivery_status, registered_at)
    values
      (org, pid, r41b, 'confirmado', 'completo', now() - interval '80 days'),
      (org, pid, r41a, 'confirmado', 'completo', now() - interval '65 days'),
      (org, pid, r41p, 'confirmado', 'activo', now() - interval '50 days');
  end loop;

  -- Marco: alumni de G40 (ya insertado en g40_ids? no — Marco es aparte)
  insert into stage_participations (organization_id, person_id, stage_run_id, registration_status, delivery_status, registered_at)
  values
    (org, p_marco, r40b, 'confirmado', 'completo', now() - interval '215 days'),
    (org, p_marco, r40a, 'confirmado', 'completo', now() - interval '200 days'),
    (org, p_marco, r40p, 'confirmado', 'completo', now() - interval '185 days');

  -- G42 Básico: 20 personas. 17 completo, 1 retirado (Óscar ae..22), 2 no_completo (ae..27, ae..28)
  foreach pid in array g42_ids loop
    insert into stage_participations (organization_id, person_id, stage_run_id, registration_status, delivery_status, source, registered_at)
    values (org, pid, r42b, 'confirmado',
      case pid
        when 'ae000000-0000-4000-8000-000000000022'::uuid then 'retirado'
        when 'ae000000-0000-4000-8000-000000000027'::uuid then 'no_completo'
        when 'ae000000-0000-4000-8000-000000000028'::uuid then 'no_completo'
        else 'completo'
      end,
      'website', now() - interval '25 days');
  end loop;

  -- ── Asistencia del Básico G42: expectativas para TODOS los días ──────────
  ev_ids := array(select id from event_occurrences where stage_run_id = r42b order by starts_at);
  for sp in select * from stage_participations where stage_run_id = r42b loop
    for i in 1..3 loop
      insert into attendance_expectations (organization_id, event_occurrence_id, stage_participation_id)
      values (org, ev_ids[i], sp.id);
      -- registros: retirado solo viernes; no_completo faltan domingo; 2 SIN REGISTRO el domingo
      if sp.person_id = 'ae000000-0000-4000-8000-000000000022'::uuid and i > 1 then
        continue; -- retirado: sin registro sáb/dom (visible como faltante)
      elsif sp.person_id in ('ae000000-0000-4000-8000-000000000027'::uuid, 'ae000000-0000-4000-8000-000000000028'::uuid) and i = 3 then
        insert into attendance_records (organization_id, event_occurrence_id, stage_participation_id, status, recorded_by)
        values (org, ev_ids[i], sp.id, 'ausente', p_ofi);
      elsif sp.person_id in ('ae000000-0000-4000-8000-000000000013'::uuid, 'ae000000-0000-4000-8000-000000000014'::uuid) and i = 3 then
        null; -- SIN REGISTRO deliberado el domingo → métrica honesta + señal
      else
        insert into attendance_records (organization_id, event_occurrence_id, stage_participation_id, status, recorded_by)
        values (org, ev_ids[i], sp.id, case when i = 2 and sp.person_id = 'ae000000-0000-4000-8000-000000000020'::uuid then 'tarde' else 'presente' end, p_ofi);
      end if;
    end loop;
  end loop;

  -- Asistencia del hito Visión (PL G41): todos esperados, 11 presentes, 1 justificada
  select id into pid from event_occurrences where stage_run_id = r41p and name = 'Visión';
  for sp in select * from stage_participations where stage_run_id = r41p loop
    insert into attendance_expectations (organization_id, event_occurrence_id, stage_participation_id) values (org, pid, sp.id);
    insert into attendance_records (organization_id, event_occurrence_id, stage_participation_id, status, recorded_by)
    values (org, pid, sp.id, case when sp.person_id = pl_ids[12] then 'justificada' else 'presente' end, p_ofi);
  end loop;

  -- ── Pases Básico G42 → Avanzado G42 ──────────────────────────────────────
  -- 17 completos: 15 elegibles (3 sin conversar aún), 12 conversados,
  -- 10 aceptados (8 inscritos, 2 sin inscribir → cola), 1 declinado, 1 diferido.
  idx := 0;
  for sp in
    select spx.* from stage_participations spx
    where spx.stage_run_id = r42b and spx.delivery_status = 'completo'
    order by spx.person_id
  loop
    idx := idx + 1;
    if idx <= 8 then
      -- aceptado e inscrito (Valeria está aquí)
      insert into continuity_passes (organization_id, from_participation_id, to_stage_run_id, pass_status, next_status,
        evaluated_at, conversed_at, offered_at, decided_at, enrolled_at, recorded_by)
      values (org, sp.id, r42a, 'aceptado', 'inscrito',
        now() - interval '9 days', now() - interval '8 days', now() - interval '8 days', now() - interval '7 days', now() - interval '6 days', p_entr);
      insert into stage_participations (organization_id, person_id, stage_run_id, registration_status, delivery_status, source, registered_at)
      values (org, sp.person_id, r42a, case when idx <= 6 then 'confirmado' else 'incompleto' end, 'esperado', 'pase', now() - interval '6 days');
    elsif idx <= 10 then
      -- aceptado SIN inscribir → trabajo de la ventana crítica
      insert into continuity_passes (organization_id, from_participation_id, to_stage_run_id, pass_status, next_status,
        evaluated_at, conversed_at, offered_at, decided_at, recorded_by)
      values (org, sp.id, r42a, 'aceptado', 'sin_intencion',
        now() - interval '9 days', now() - interval '8 days', now() - interval '8 days', now() - interval '7 days', p_entr);
    elsif idx = 11 then
      insert into continuity_passes (organization_id, from_participation_id, to_stage_run_id, pass_status, evaluated_at, conversed_at, offered_at, decided_at, recorded_by)
      values (org, sp.id, r42a, 'declinado', now() - interval '9 days', now() - interval '8 days', now() - interval '8 days', now() - interval '7 days', p_entr);
    elsif idx = 12 then
      insert into continuity_passes (organization_id, from_participation_id, to_stage_run_id, pass_status, evaluated_at, conversed_at, offered_at, decided_at, notes, recorded_by)
      values (org, sp.id, r42a, 'diferido', now() - interval '9 days', now() - interval '8 days', now() - interval '8 days', now() - interval '7 days', 'Prefiere entrar con la G43 por agenda laboral.', p_entr);
    elsif idx <= 15 then
      -- elegible, conversación pendiente → señal de pase
      insert into continuity_passes (organization_id, from_participation_id, to_stage_run_id, pass_status, evaluated_at, recorded_by)
      values (org, sp.id, r42a, 'elegible', now() - interval '9 days', p_entr);
    else
      insert into continuity_passes (organization_id, from_participation_id, pass_status)
      values (org, sp.id, 'no_evaluado');
    end if;
  end loop;

  -- Pases G41 Avanzado → PL (histórico, todos iniciados)
  for sp in select spx.* from stage_participations spx where spx.stage_run_id = r41a loop
    insert into continuity_passes (organization_id, from_participation_id, to_stage_run_id, pass_status, next_status,
      evaluated_at, conversed_at, offered_at, decided_at, enrolled_at, started_at, recorded_by)
    values (org, sp.id, r41p, 'aceptado', 'iniciado',
      now() - interval '57 days', now() - interval '56 days', now() - interval '56 days', now() - interval '55 days', now() - interval '52 days', now() - interval '45 days', p_entr);
  end loop;

  -- ── Prospects y enrolamiento hacia la G43 ────────────────────────────────
  -- ae..50-55 existen de antes. Estados CRM variados; 3 enrolados desde el PL,
  -- 2 enrolados por Paulina (su criterio doc 18).
  for i in 1..6 loop
    pid := format('ae000000-0000-4000-8000-0000000000%s', (49 + i)::text)::uuid;
    insert into prospects (organization_id, person_id, target_stage_run_id, crm_status, source, created_at)
    values (org, pid, r43b,
      (array['nuevo', 'contactado', 'cita', 'interesado', 'registro_iniciado', 'registro_iniciado'])[i],
      (array['website', 'enrolamiento_pl', 'enrolamiento_pl', 'enrolamiento_pl', 'referido_staff', 'referido_staff'])[i],
      now() - (8 - i) * interval '1 day')
    returning id into part_id;
    if i in (2, 3, 4) then
      insert into enrollment_attributions (organization_id, enrolled_person_id, enroller_person_id, context_stage_run_id, prospect_id, status)
      values (org, pid, pl_ids[i - 1], r41p, part_id, 'lead');
    elsif i in (5, 6) then
      insert into enrollment_attributions (organization_id, enrolled_person_id, enroller_person_id, context_stage_run_id, prospect_id, status)
      values (org, pid, p_pau, r42b, part_id, 'lead');
    end if;
  end loop;
  -- 2 registros iniciados al Básico G43
  for i in 5..6 loop
    pid := format('ae000000-0000-4000-8000-0000000000%s', (49 + i)::text)::uuid;
    insert into stage_participations (organization_id, person_id, stage_run_id, registration_status, delivery_status, source, registered_at)
    values (org, pid, r43b, 'iniciado', 'esperado', 'referido_staff', now() - interval '2 days');
  end loop;

  -- ── Equipo ───────────────────────────────────────────────────────────────
  insert into team_assignments (organization_id, stage_run_id, person_id, role, reports_to_person_id, starts_at, ends_at) values
    -- Básico G42: Diego entrenador, Jorge capitán, Paulina/Ana/Lucía staff
    (org, r42b, p_entr, 'entrenador', null, now() - interval '30 days', now() + interval '10 days'),
    (org, r42b, p_jorge, 'capitan', p_entr, now() - interval '30 days', now() + interval '10 days'),
    (org, r42b, p_pau, 'staff', p_jorge, now() - interval '30 days', now() + interval '10 days'),
    (org, r42b, p_ana, 'staff', p_jorge, now() - interval '30 days', now() + interval '10 days'),
    (org, r42b, p_lucia, 'staff', p_jorge, now() - interval '30 days', now() + interval '10 days'),
    -- Avanzado G42: mismo equipo base
    (org, r42a, p_entr, 'entrenador', null, now() - interval '10 days', now() + interval '15 days'),
    (org, r42a, p_pau, 'staff', p_entr, now() - interval '10 days', now() + interval '15 days'),
    -- PL G41: Diego entrenador, Marco capitán, Ana/Lucía staff
    (org, r41p, p_entr, 'entrenador', null, now() - interval '50 days', now() + interval '80 days'),
    (org, r41p, p_marco, 'capitan', p_entr, now() - interval '50 days', now() + interval '80 days'),
    (org, r41p, p_ana, 'staff', p_marco, now() - interval '50 days', now() + interval '80 days'),
    (org, r41p, p_lucia, 'staff', p_marco, now() - interval '50 days', now() + interval '80 days');

  -- Grupos pequeños del Básico G42 (4 grupos): Paulina con 5 asignados (incluye a Valeria)
  insert into small_groups (id, organization_id, stage_run_id, name, staff_person_id) values
    ('ab000000-0000-4000-8000-000000000011', org, r42b, 'Grupo Ámbar', p_pau),
    ('ab000000-0000-4000-8000-000000000012', org, r42b, 'Grupo Cedro', p_ana),
    ('ab000000-0000-4000-8000-000000000013', org, r42b, 'Grupo Río', p_lucia),
    ('ab000000-0000-4000-8000-000000000014', org, r42b, 'Grupo Sol', p_ana);
  idx := 0;
  for sp in select spx.* from stage_participations spx where spx.stage_run_id = r42b order by (spx.person_id = p_val) desc, spx.person_id loop
    idx := idx + 1;
    grp := (array[
      'ab000000-0000-4000-8000-000000000011',
      'ab000000-0000-4000-8000-000000000012',
      'ab000000-0000-4000-8000-000000000013',
      'ab000000-0000-4000-8000-000000000014'
    ])[((idx - 1) / 5) + 1]::uuid;
    insert into small_group_members (organization_id, small_group_id, stage_participation_id) values (org, grp, sp.id);
  end loop;

  -- Grupos del PL G41 (2 grupos de 6)
  insert into small_groups (id, organization_id, stage_run_id, name, staff_person_id) values
    ('ab000000-0000-4000-8000-000000000021', org, r41p, 'Equipo Fuego', p_ana),
    ('ab000000-0000-4000-8000-000000000022', org, r41p, 'Equipo Mar', p_lucia);
  idx := 0;
  for sp in select spx.* from stage_participations spx where spx.stage_run_id = r41p order by spx.person_id loop
    idx := idx + 1;
    grp := (array['ab000000-0000-4000-8000-000000000021', 'ab000000-0000-4000-8000-000000000022'])[((idx - 1) / 6) + 1]::uuid;
    insert into small_group_members (organization_id, small_group_id, stage_participation_id) values (org, grp, sp.id);
  end loop;

  -- ── Seguimiento de staff ─────────────────────────────────────────────────
  -- PL G41: llamadas semanales; 2 vencidas de Ana (→ señales), próximas de Lucía
  idx := 0;
  for sp in select spx.*, sg.staff_person_id as staff_pid
    from stage_participations spx
    join small_group_members sgm on sgm.stage_participation_id = spx.id
    join small_groups sg on sg.id = sgm.small_group_id
    where spx.stage_run_id = r41p
  loop
    idx := idx + 1;
    -- llamada de la semana pasada: realizada
    insert into follow_up_interactions (organization_id, stage_participation_id, staff_person_id, expected_on, done_at, resultado)
    values (org, sp.id, sp.staff_pid, current_date - 8, ((current_date - 8) + time '20:00') at time zone tz,
      case when idx % 4 = 0 then 'reagendada' else 'contactada' end);
    -- llamada de esta semana: 2 vencidas (Ana), el resto próximas o hechas
    if idx in (1, 2) then
      insert into follow_up_interactions (organization_id, stage_participation_id, staff_person_id, expected_on)
      values (org, sp.id, sp.staff_pid, current_date - 3); -- vencida sin resultado
    elsif idx % 2 = 0 then
      insert into follow_up_interactions (organization_id, stage_participation_id, staff_person_id, expected_on, done_at, resultado)
      values (org, sp.id, sp.staff_pid, current_date - 1, ((current_date - 1) + time '20:30') at time zone tz, 'contactada');
    else
      insert into follow_up_interactions (organization_id, stage_participation_id, staff_person_id, expected_on)
      values (org, sp.id, sp.staff_pid, current_date + 2);
    end if;
  end loop;

  -- Paulina: seguimiento post-Básico de sus 5 asignados (3 hechos, 2 próximos)
  idx := 0;
  for sp in select sgm.stage_participation_id as spid
    from small_group_members sgm
    where sgm.small_group_id = 'ab000000-0000-4000-8000-000000000011'
  loop
    idx := idx + 1;
    if idx <= 3 then
      insert into follow_up_interactions (organization_id, stage_participation_id, staff_person_id, expected_on, done_at, resultado, notes)
      values (org, sp.spid, p_pau, current_date - 5, ((current_date - 5) + time '19:30') at time zone tz, 'contactada', 'Integración del Básico; lista para el Avanzado.');
    else
      insert into follow_up_interactions (organization_id, stage_participation_id, staff_person_id, expected_on)
      values (org, sp.spid, p_pau, current_date + 1);
    end if;
  end loop;

  -- ── Libros y misiones del PL ─────────────────────────────────────────────
  insert into reading_assignments (id, organization_id, stage_run_id, title, author, due_on) values
    ('ad000000-0000-4000-8000-000000000001', org, r41p, 'El poder está en ti', 'L. Aurora', current_date - 20),
    ('ad000000-0000-4000-8000-000000000002', org, r41p, 'Liderar sirviendo', 'C. Monte', current_date + 10);
  idx := 0;
  for sp in select spx.* from stage_participations spx where spx.stage_run_id = r41p order by spx.person_id loop
    idx := idx + 1;
    if idx <= 10 then
      insert into reading_progress (organization_id, assignment_id, stage_participation_id, completed_at)
      values (org, 'ad000000-0000-4000-8000-000000000001', sp.id, now() - interval '22 days');
    end if;
    if idx <= 3 then
      insert into reading_progress (organization_id, assignment_id, stage_participation_id, completed_at)
      values (org, 'ad000000-0000-4000-8000-000000000002', sp.id, now() - interval '2 days');
    end if;
  end loop;

  insert into missions (id, organization_id, stage_run_id, title, description, due_on, sequence) values
    ('ed000000-0000-4000-8000-000000000011', org, r41p, 'Proyecto de contribución', 'Avanza tu proyecto de equipo y registra el aprendizaje.', current_date + 12, 1),
    ('ed000000-0000-4000-8000-000000000012', org, r42a, 'Carta de compromiso', 'Escribe tu compromiso para el Avanzado y compártelo con tu grupo.', current_date + 4, 1);

  -- ── Ledger ───────────────────────────────────────────────────────────────
  insert into reconciliation_batches (id, organization_id, period_start, period_end, status, closed_by, closed_at) values
    ('ba000000-0000-4000-8000-000000000001', org, current_date - 45, current_date - 16, 'cerrada', p_duena, now() - interval '14 days');
  insert into reconciliation_batches (id, organization_id, period_start, period_end, status) values
    ('ba000000-0000-4000-8000-000000000002', org, current_date - 15, current_date + 15, 'abierta');
  batch_prev := 'ba000000-0000-4000-8000-000000000001';
  batch_now := 'ba000000-0000-4000-8000-000000000002';

  -- Básico G42: $8,500 por persona, vencido hace 15 días.
  -- La persona retirada (ae..22) pagó y se le devolvió; del resto: 16 pagados,
  -- 2 parciales, 1 pendiente (vencido → señal).
  idx := 0;
  for sp in select spx.* from stage_participations spx where spx.stage_run_id = r42b order by spx.person_id loop
    if sp.person_id = 'ae000000-0000-4000-8000-000000000022'::uuid then
      insert into charges (organization_id, person_id, stage_participation_id, concept, amount_cents, due_on, status)
      values (org, sp.person_id, sp.id, 'Básico G42', 850000, current_date - 15, 'pagado')
      returning id into charge_id_v;
      insert into payments (organization_id, person_id, amount_cents, method, reference, paid_at, confirmed, reconciliation_batch_id, recorded_by)
      values (org, sp.person_id, 850000, 'transferencia', 'B42-RET', now() - interval '20 days', true, batch_prev, p_ofi)
      returning id into pay_id;
      insert into payment_allocations (organization_id, payment_id, charge_id, amount_cents) values (org, pay_id, charge_id_v, 850000);
      insert into refunds (organization_id, payment_id, amount_cents, reason, approved_by)
      values (org, pay_id, 850000, 'Retiro el sábado del Básico; política de devolución aplicada.', p_duena);
      continue;
    end if;
    idx := idx + 1;
    insert into charges (organization_id, person_id, stage_participation_id, concept, amount_cents, due_on, status)
    values (org, sp.person_id, sp.id, 'Básico G42', 850000, current_date - 15,
      case when idx <= 16 then 'pagado' when idx <= 18 then 'parcial' else 'pendiente' end)
    returning id into charge_id_v;
    if idx <= 16 then
      insert into payments (organization_id, person_id, amount_cents, method, reference, paid_at, confirmed, reconciliation_batch_id, recorded_by)
      values (org, sp.person_id, 850000, case when idx % 3 = 0 then 'tarjeta' else 'transferencia' end, 'B42-' || idx, now() - interval '20 days', true, batch_prev, p_ofi)
      returning id into pay_id;
      insert into payment_allocations (organization_id, payment_id, charge_id, amount_cents) values (org, pay_id, charge_id_v, 850000);
    elsif idx <= 18 then
      insert into payments (organization_id, person_id, amount_cents, method, reference, paid_at, confirmed, reconciliation_batch_id, recorded_by)
      values (org, sp.person_id, 400000, 'transferencia', 'B42P-' || idx, now() - interval '18 days', true, batch_prev, p_ofi)
      returning id into pay_id;
      insert into payment_allocations (organization_id, payment_id, charge_id, amount_cents) values (org, pay_id, charge_id_v, 400000);
    end if;
  end loop;

  -- Avanzado G42: $12,000 para los 8 inscritos, vence en 3 días
  idx := 0;
  for sp in select spx.* from stage_participations spx where spx.stage_run_id = r42a order by spx.person_id loop
    idx := idx + 1;
    insert into charges (organization_id, person_id, stage_participation_id, concept, amount_cents, due_on, status)
    values (org, sp.person_id, sp.id, 'Avanzado G42', 1200000, current_date + 3,
      case when idx <= 5 then 'pagado' when idx <= 7 then 'parcial' else 'pendiente' end)
    returning id into charge_id_v;
    if idx <= 5 then
      insert into payments (organization_id, person_id, amount_cents, method, reference, paid_at, confirmed, reconciliation_batch_id, recorded_by)
      values (org, sp.person_id, 1200000, 'transferencia', 'A42-' || idx, now() - interval '4 days', idx <= 3, batch_now, p_ofi)
      returning id into pay_id;
      insert into payment_allocations (organization_id, payment_id, charge_id, amount_cents) values (org, pay_id, charge_id_v, 1200000);
    elsif idx <= 7 then
      insert into payments (organization_id, person_id, amount_cents, method, reference, paid_at, confirmed, reconciliation_batch_id, recorded_by)
      values (org, sp.person_id, 600000, 'transferencia', 'A42P-' || idx, now() - interval '3 days', true, batch_now, p_ofi)
      returning id into pay_id;
      insert into payment_allocations (organization_id, payment_id, charge_id, amount_cents) values (org, pay_id, charge_id_v, 600000);
    end if;
  end loop;

  -- PL G41: plan de $28,000 en 4 mensualidades de $7,000
  idx := 0;
  for sp in select spx.* from stage_participations spx where spx.stage_run_id = r41p order by spx.person_id loop
    idx := idx + 1;
    insert into payment_plans (organization_id, stage_participation_id, person_id, concept, total_cents, installments_count)
    values (org, sp.id, sp.person_id, 'PL G41 · plan 4 pagos', 2800000, 4)
    returning id into plan_id_v;
    for j in 1..4 loop
      insert into charges (organization_id, person_id, stage_participation_id, plan_id, concept, amount_cents, due_on, status)
      values (org, sp.person_id, sp.id, plan_id_v, 'PL G41 · mensualidad ' || j, 700000,
        current_date - 45 + (j - 1) * 30,
        case
          when j = 1 then 'pagado'
          when j = 2 and idx in (3, 4) then 'pendiente'      -- vencidas → señal
          when j = 2 and idx = 5 then 'parcial'              -- beca cubre parte
          when j = 2 then 'pagado'
          else 'pendiente'                                    -- futuras
        end)
      returning id into charge_id_v;
      -- mensualidad 1: pagada por todos (Ramón paga 1+2 en una sola transferencia)
      if j = 1 and idx != 2 then
        insert into payments (organization_id, person_id, amount_cents, method, reference, paid_at, confirmed, reconciliation_batch_id, recorded_by)
        values (org, sp.person_id, 700000, 'transferencia', 'PL1-' || idx, now() - interval '40 days', true, batch_prev, p_ofi)
        returning id into pay_id;
        insert into payment_allocations (organization_id, payment_id, charge_id, amount_cents) values (org, pay_id, charge_id_v, 700000);
      end if;
      if j = 2 and idx not in (2, 3, 4, 5) then
        insert into payments (organization_id, person_id, amount_cents, method, reference, paid_at, confirmed, reconciliation_batch_id, recorded_by)
        values (org, sp.person_id, 700000, 'transferencia', 'PL2-' || idx, now() - interval '12 days', true, batch_now, p_ofi)
        returning id into pay_id;
        insert into payment_allocations (organization_id, payment_id, charge_id, amount_cents) values (org, pay_id, charge_id_v, 700000);
      end if;
      if j = 2 and idx = 5 then
        insert into discounts (organization_id, charge_id, amount_cents, kind, reason, approved_by)
        values (org, charge_id_v, 200000, 'beca', 'Beca parcial aprobada por dirección.', p_duena);
        insert into payments (organization_id, person_id, amount_cents, method, reference, paid_at, confirmed, reconciliation_batch_id, recorded_by)
        values (org, sp.person_id, 300000, 'efectivo', 'PL2B-' || idx, now() - interval '10 days', true, batch_now, p_ofi)
        returning id into pay_id;
        insert into payment_allocations (organization_id, payment_id, charge_id, amount_cents) values (org, pay_id, charge_id_v, 300000);
      end if;
    end loop;
    -- Ramón (idx 2): UNA transferencia de $14,000 repartida a mensualidades 1 y 2
    if idx = 2 then
      insert into payments (organization_id, person_id, amount_cents, method, reference, paid_at, confirmed, reconciliation_batch_id, recorded_by)
      values (org, sp.person_id, 1400000, 'transferencia', 'PL12-RAMON', now() - interval '38 days', true, batch_prev, p_ofi)
      returning id into pay_id;
      insert into payment_allocations (organization_id, payment_id, charge_id, amount_cents)
      select org, pay_id, c.id, 700000 from charges c
      where c.plan_id = plan_id_v and c.concept in ('PL G41 · mensualidad 1', 'PL G41 · mensualidad 2');
      update charges set status = 'pagado' where plan_id = plan_id_v and concept = 'PL G41 · mensualidad 2';
    end if;
  end loop;

  -- Pago NO identificado: transferencia sin persona ni asignación
  insert into payments (organization_id, person_id, amount_cents, method, reference, paid_at, confirmed, reconciliation_batch_id, recorded_by)
  values (org, null, 850000, 'transferencia', 'TRF-9921-SIN-ID', now() - interval '2 days', true, batch_now, p_ofi);

  -- Paulina: certificación en USD, pago parcial (criterio doc 18 + moneda separada)
  insert into charges (organization_id, person_id, concept, amount_cents, currency, due_on, status)
  values (org, p_pau, 'Certificación ELEVA Coach', 120000, 'USD', current_date + 20, 'parcial')
  returning id into charge_id_v;
  insert into payments (organization_id, person_id, amount_cents, currency, method, reference, paid_at, confirmed, reconciliation_batch_id, recorded_by)
  values (org, p_pau, 60000, 'USD', 'tarjeta', 'CERT-PAU', now() - interval '5 days', true, batch_now, p_ofi)
  returning id into pay_id;
  insert into payment_allocations (organization_id, payment_id, charge_id, amount_cents) values (org, pay_id, charge_id_v, 60000);

  -- Gastos por etapa → margen por generación
  insert into expenses (organization_id, stage_run_id, category, concept, amount_cents, incurred_on, recorded_by) values
    (org, r42b, 'entrenador', 'Honorarios entrenador Básico G42', 2500000, current_date - 10, p_ofi),
    (org, r42b, 'sede', 'Renta salón 3 días', 1200000, current_date - 10, p_ofi),
    (org, r42b, 'materiales', 'Materiales y gafetes', 400000, current_date - 12, p_ofi),
    (org, r41p, 'sede', 'Sede fin de semana Visión', 800000, current_date - 14, p_ofi),
    (org, r41p, 'entrenador', 'Honorarios PL mes 1', 1500000, current_date - 15, p_ofi);

  -- ── Comunidad por ciclo ──────────────────────────────────────────────────
  insert into posts (organization_id, cycle_id, author_person_id, kind, body, created_at) values
    (org, cy42, p_val, 'declaracion', 'Declaro que voy a llegar a la graduación habiendo tenido las tres conversaciones que llevo años evitando. La primera ya está hecha.', now() - interval '8 days'),
    (org, cy42, g42_ids[4], 'aprendizaje', 'El domingo del Básico entendí que llevo años posponiendo la conversación con mi papá. Esta semana la voy a tener.', now() - interval '7 days'),
    (org, cy42, g42_ids[6], 'celebracion', '¡Confirmé mi lugar en el Avanzado! Gracias a mi grupo por no soltarme.', now() - interval '3 days');
  insert into posts (id, organization_id, cycle_id, author_person_id, kind, body, created_at) values
    ('ef000000-0000-4000-8000-000000000002', org, cy42, g42_ids[3], 'pregunta', '¿Alguien más siente que después del Básico quedaron cosas moviéndose? Es mi primera vez compartiendo aquí y no sé bien cómo procesarlo.', now() - interval '30 hours');
  insert into comments (organization_id, post_id, author_person_id, body)
  select org, po.id, p_pau, 'Aquí estamos para acompañarte. En tu llamada de esta semana lo platicamos con calma.'
  from posts po where po.author_person_id = g42_ids[4] and po.kind = 'aprendizaje';

  -- PL G41: comunidad densa
  insert into posts (organization_id, cycle_id, author_person_id, kind, fields, body, created_at) values
    (org, cy41, pl_ids[1], 'evidencia', '{"declare": "Que mi negocio facturaría su primer mes de 6 cifras", "hice": "Lancé la preventa con mi equipo del PL", "aprendi": "Pedir apoyo multiplica"}'::jsonb,
     'La actividad de equipo me empujó a lanzar de una vez. Preventa abierta.', now() - interval '6 days'),
    (org, cy41, pl_ids[3], 'ayuda', '{"necesito": "Contactos en medios locales para la carrera de contribución", "plazo": "Esta semana"}'::jsonb,
     'El equipo Mar está organizando la carrera del sábado y necesitamos difusión.', now() - interval '2 days'),
    (org, cy41, pl_ids[5], 'celebracion', '{}'::jsonb, 'Enrolé a mi hermana al Básico G43. Verla decidirse fue mi momento de la semana.', now() - interval '1 day'),
    (org, cy41, pl_ids[2], 'aprendizaje', '{}'::jsonb, 'El libro de este mes me está costando y eso también es información: me cuesta recibir.', now() - interval '4 days');
  insert into comments (organization_id, post_id, author_person_id, body)
  select org, po.id, p_marco, 'Equipo Mar: mañana en la reunión cerramos la logística. Cuenten conmigo.'
  from posts po where po.author_person_id = pl_ids[3];
  insert into comments (organization_id, post_id, author_person_id, body)
  select org, po.id, pl_ids[7], '¡Ahí estaremos todo el equipo Fuego apoyando!'
  from posts po where po.author_person_id = pl_ids[3];
  insert into post_reactions (organization_id, post_id, person_id, kind)
  select org, po.id, x.pid, x.kind from posts po
  cross join lateral (values (pl_ids[4], 'poderoso'), (pl_ids[6], 'me_inspira'), (pl_ids[8], 'te_reconozco')) as x(pid, kind)
  where po.author_person_id = pl_ids[1]
  on conflict do nothing;
  insert into post_reactions (organization_id, post_id, person_id, kind)
  select org, po.id, pl_ids[9], 'posibilidad' from posts po where po.author_person_id = pl_ids[5]
  on conflict do nothing;

  -- Aviso del centro
  insert into posts (organization_id, author_person_id, kind, body, visibility_scope, created_at)
  values (org, p_ofi, 'aviso', 'Generación 42: su Avanzado es este fin de semana. Confirmen su lugar y revisen la logística en Eventos.', 'centro', now() - interval '2 days');

  -- Reconocimiento en el PL
  insert into recognitions (organization_id, from_person_id, to_person_id, text, impact)
  values (org, pl_ids[3], pl_ids[1], 'Te reconozco por lanzar tu preventa aunque el miedo estaba ahí.', 'Me mostraste que se puede actuar con miedo.');

  -- ── RSVPs ────────────────────────────────────────────────────────────────
  -- Día 1 del Avanzado G42: 5 confirmados de 8 inscritos (Valeria pendiente → su CTA)
  select id into pid from event_occurrences where stage_run_id = r42a order by starts_at limit 1;
  idx := 0;
  for sp in select spx.* from stage_participations spx where spx.stage_run_id = r42a order by (spx.person_id = p_val) desc, spx.person_id loop
    idx := idx + 1;
    if idx > 3 then -- Valeria (1) y dos más quedan sin confirmar
      insert into rsvps (organization_id, event_occurrence_id, person_id, status) values (org, pid, sp.person_id, 'confirmado');
    end if;
  end loop;
  -- Noche de graduados: algunos alumni
  select id into pid from event_occurrences where kind = 'evento_alumni' limit 1;
  for i in 1..6 loop
    insert into rsvps (organization_id, event_occurrence_id, person_id, status) values (org, pid, g40_ids[i], 'confirmado');
  end loop;

  -- ── Ivonne (pl@) perfil ──────────────────────────────────────────────────
  update people set looking_for = array['socios', 'clientes'] where id = pl_ids[1];
end $$;

drop function public._seed_auth_user(uuid, text);
