-- Seed · Centro Aurora (tenant demo 100% sintético) + Centro Norte (aislamiento)
-- Regla del blueprint: el demo se deriva de una historia validada, con datos
-- sintéticos, en un tenant aislado. Misión Vital y Lerner son clientes, no demos.
--
-- Usuarios demo (password ElevaDemo2026!):
--   duena@aurora.demo · oficinas@aurora.demo · entrenador@aurora.demo
--   participante@aurora.demo · exstaff@aurora.demo (asignación vencida)
--   norte@norte.demo (otro centro, para pruebas cross-tenant)
--
-- El seed deja huecos deliberados (ausencias, pagos vencidos, confirmaciones
-- pendientes, registro incompleto, primera contribución sin respuesta) para que
-- el motor de señales produzca una cola real, no una maqueta.

create or replace function public._seed_auth_user(uid uuid, em text)
returns void language plpgsql security definer as $fn$
begin
  insert into auth.users (
    id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data, created_at, updated_at
  ) values (
    uid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
    em, extensions.crypt('ElevaDemo2026!', extensions.gen_salt('bf')), now(),
    '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb, now(), now()
  );
  insert into auth.identities (
    id, user_id, provider_id, provider, identity_data, last_sign_in_at, created_at, updated_at
  ) values (
    gen_random_uuid(), uid, uid::text, 'email',
    jsonb_build_object('sub', uid::text, 'email', em, 'email_verified', true),
    now(), now(), now()
  );
end;
$fn$;

do $$
declare
  org_aurora  uuid := 'a0000000-0000-4000-8000-000000000001';
  org_norte   uuid := 'b0000000-0000-4000-8000-000000000001';
  loc_roma    uuid := 'a1000000-0000-4000-8000-000000000001';
  prog_camino uuid := 'ac000000-0000-4000-8000-000000000001';
  lvl_basico  uuid := 'ac000000-0000-4000-8000-000000000011';
  lvl_avanzado uuid := 'ac000000-0000-4000-8000-000000000012';
  lvl_pl      uuid := 'ac000000-0000-4000-8000-000000000013';
  g41         uuid := 'cc000000-0000-4000-8000-000000000041';
  g42         uuid := 'cc000000-0000-4000-8000-000000000042';

  -- auth users
  u_duena uuid := 'de000000-0000-4000-8000-000000000001';
  u_ofi   uuid := 'de000000-0000-4000-8000-000000000002';
  u_entr  uuid := 'de000000-0000-4000-8000-000000000003';
  u_part  uuid := 'de000000-0000-4000-8000-000000000004';
  u_norte uuid := 'de000000-0000-4000-8000-000000000005';
  u_exst  uuid := 'de000000-0000-4000-8000-000000000006';

  -- personas clave
  p_duena  uuid := 'ae000000-0000-4000-8000-000000000001'; -- Mariana Solís
  p_ofi    uuid := 'ae000000-0000-4000-8000-000000000002'; -- Carla Núñez
  p_entr   uuid := 'ae000000-0000-4000-8000-000000000003'; -- Diego Ramos
  p_val    uuid := 'ae000000-0000-4000-8000-000000000004'; -- Valeria Ortiz (participante demo)
  p_norte  uuid := 'ae000000-0000-4000-8000-000000000005'; -- Pablo Ríos (Centro Norte)
  p_exst   uuid := 'ae000000-0000-4000-8000-000000000006'; -- Tania Robles (ex staff)
  p_ana    uuid := 'ae000000-0000-4000-8000-000000000007'; -- Ana Beltrán (staff)
  p_jorge  uuid := 'ae000000-0000-4000-8000-000000000008'; -- Jorge Pineda (staff)
  p_lucia  uuid := 'ae000000-0000-4000-8000-000000000009'; -- Lucía Vega (staff)

  -- G42: ae..10 = Luis Herrera, ae..11 = Sofía Cano, ae..12 = Renata Ibarra, ae..13-28 genéricos
  g42_ids uuid[];
  g42_names text[] := array[
    'Luis Herrera', 'Sofía Cano', 'Renata Ibarra',
    'Mariana Peña', 'Andrés Silva', 'Paola Mena', 'Rodrigo Lara', 'Diana Flores',
    'Emilio Cruz', 'Karla Márquez', 'Tomás Aguilar', 'Fernanda Ríos', 'Óscar Delgado',
    'Alejandra Bravo', 'Iván Castañeda', 'Camila Serrano', 'Héctor Molina',
    'Lorena Cabrera', 'Sergio Peralta'
  ];
  g41_names text[] := array[
    'Alma Vidal', 'Bruno Estrada', 'Carmen Loya', 'Daniel Osorio', 'Elisa Fuentes',
    'Fabián Torres', 'Gina Salas', 'Hugo Navarro', 'Irene Cortés', 'Javier Luna',
    'Karina Bosque', 'Leo Zamora', 'Mónica Reyna', 'Nadia Ponce', 'Omar Villa'
  ];

  grp_ambar uuid := 'ab000000-0000-4000-8000-000000000001';
  grp_cedro uuid := 'ab000000-0000-4000-8000-000000000002';
  grp_rio   uuid := 'ab000000-0000-4000-8000-000000000003';

  ev_circulo uuid := 'ee000000-0000-4000-8000-000000000001';
  ev_noche   uuid := 'ee000000-0000-4000-8000-000000000002';
  mi_conv    uuid := 'ed000000-0000-4000-8000-000000000001';
  mi_carta   uuid := 'ed000000-0000-4000-8000-000000000002';
  post_renata uuid := 'ef000000-0000-4000-8000-000000000001';

  s_ids uuid[];
  pid uuid;
  att_row record;
  part_id uuid;
  charge_id uuid;
  i int;
  idx int;
  session_starts timestamptz[] := array[
    now() - interval '19 days', now() - interval '16 days', now() - interval '12 days',
    now() - interval '9 days',  now() - interval '5 days',  now() - interval '2 days',
    now() + interval '5 days',  now() + interval '9 days'
  ];
  att_status text;
begin
  -- ids de participantes G42 (hex válido: 10..28)
  g42_ids := array(
    select format('ae000000-0000-4000-8000-0000000000%s', lpad(n::text, 2, '0'))::uuid
    from generate_series(10, 28) n
  );
  s_ids := array(
    select format('cd000000-0000-4000-8000-0000000000%s', lpad(n::text, 2, '0'))::uuid
    from generate_series(1, 8) n
  );

  -- -------------------------------------------------------------------------
  -- Organizaciones y auth
  -- -------------------------------------------------------------------------
  insert into organizations (id, name, slug, timezone, is_demo, brand) values
    (org_aurora, 'Centro Aurora', 'aurora', 'America/Mexico_City', true, '{"color":"#7C5CFC"}'),
    (org_norte, 'Centro Norte', 'norte', 'America/Monterrey', true, '{}');

  insert into locations (id, organization_id, name, city) values
    (loc_roma, org_aurora, 'Sede Roma', 'Ciudad de México');

  perform _seed_auth_user(u_duena, 'duena@aurora.demo');
  perform _seed_auth_user(u_ofi, 'oficinas@aurora.demo');
  perform _seed_auth_user(u_entr, 'entrenador@aurora.demo');
  perform _seed_auth_user(u_part, 'participante@aurora.demo');
  perform _seed_auth_user(u_norte, 'norte@norte.demo');
  perform _seed_auth_user(u_exst, 'exstaff@aurora.demo');

  -- -------------------------------------------------------------------------
  -- Personas
  -- -------------------------------------------------------------------------
  insert into people (id, user_id, full_name, preferred_name, email, phone) values
    (p_duena, u_duena, 'Mariana Solís', 'Mariana', 'duena@aurora.demo', '+52 55 1000 0001'),
    (p_ofi, u_ofi, 'Carla Núñez', 'Carla', 'oficinas@aurora.demo', '+52 55 1000 0002'),
    (p_entr, u_entr, 'Diego Ramos', 'Diego', 'entrenador@aurora.demo', '+52 55 1000 0003'),
    (p_val, u_part, 'Valeria Ortiz', 'Valeria', 'participante@aurora.demo', '+52 55 1000 0004'),
    (p_norte, u_norte, 'Pablo Ríos', 'Pablo', 'norte@norte.demo', '+52 81 2000 0001'),
    (p_exst, u_exst, 'Tania Robles', 'Tania', 'exstaff@aurora.demo', '+52 55 1000 0006'),
    (p_ana, null, 'Ana Beltrán', 'Ana', 'ana.beltran@correo.demo', '+52 55 1000 0007'),
    (p_jorge, null, 'Jorge Pineda', 'Jorge', 'jorge.pineda@correo.demo', '+52 55 1000 0008'),
    (p_lucia, null, 'Lucía Vega', 'Lucía', 'lucia.vega@correo.demo', '+52 55 1000 0009');

  -- Participantes G42 (Paola ae..15 y Rodrigo ae..16 sin teléfono → registro incompleto)
  foreach pid in array g42_ids loop
    idx := array_position(g42_ids, pid);
    insert into people (id, full_name, email, phone) values (
      pid,
      g42_names[idx],
      lower(replace(translate(g42_names[idx], 'áéíóúÁÉÍÓÚñÑ', 'aeiouAEIOUnN'), ' ', '.')) || '@correo.demo',
      case when idx in (6, 7) then null else '+52 55 2000 00' || lpad(idx::text, 2, '0') end
    );
  end loop;

  -- Personas G41 (ae..30-44)
  for i in 1..15 loop
    insert into people (id, full_name, email, phone) values (
      format('ae000000-0000-4000-8000-0000000000%s', (29 + i)::text)::uuid,
      g41_names[i],
      lower(replace(translate(g41_names[i], 'áéíóúÁÉÍÓÚñÑ', 'aeiouAEIOUnN'), ' ', '.')) || '@correo.demo',
      '+52 55 3000 00' || lpad(i::text, 2, '0')
    );
  end loop;

  -- -------------------------------------------------------------------------
  -- Membresías y roles (asignaciones con vigencia; Tania vencida hace 30 días)
  -- -------------------------------------------------------------------------
  insert into organization_memberships (id, organization_id, person_id)
  select gen_random_uuid(), org_aurora, p.id from people p where p.id != p_norte;

  insert into organization_memberships (organization_id, person_id) values (org_norte, p_norte);

  insert into role_assignments (organization_id, membership_id, role, starts_at, ends_at)
  select org_aurora, m.id,
    case m.person_id
      when p_duena then 'dueno' when p_ofi then 'oficinas' when p_entr then 'entrenador'
      when p_ana then 'staff' when p_jorge then 'staff' when p_lucia then 'staff'
      when p_exst then 'staff'
      else 'participante'
    end,
    now() - interval '120 days',
    case m.person_id when p_exst then now() - interval '30 days' else null end
  from organization_memberships m where m.organization_id = org_aurora;

  insert into role_assignments (organization_id, membership_id, role, starts_at)
  select org_norte, m.id, 'oficinas', now() - interval '60 days'
  from organization_memberships m where m.organization_id = org_norte;

  -- -------------------------------------------------------------------------
  -- Programa, niveles y generaciones
  -- -------------------------------------------------------------------------
  insert into programs (id, organization_id, name, description) values
    (prog_camino, org_aurora, 'Camino Aurora', 'Programa de transformación personal del Centro Aurora.');

  insert into levels (id, organization_id, program_id, name, sequence) values
    (lvl_basico, org_aurora, prog_camino, 'Básico', 1),
    (lvl_avanzado, org_aurora, prog_camino, 'Avanzado', 2),
    (lvl_pl, org_aurora, prog_camino, 'PL', 3);

  insert into cohorts (id, organization_id, program_id, level_id, location_id, name, code, starts_on, ends_on, status) values
    (g41, org_aurora, prog_camino, lvl_basico, loc_roma, 'Generación 41 · Básico', 'G41', current_date - 120, current_date - 40, 'cerrada'),
    (g42, org_aurora, prog_camino, lvl_basico, loc_roma, 'Generación 42 · Básico', 'G42', current_date - 21, current_date + 35, 'activa');

  -- Equipo de la G42
  insert into team_assignments (organization_id, cohort_id, person_id, role, starts_at) values
    (org_aurora, g42, p_entr, 'entrenador', now() - interval '30 days'),
    (org_aurora, g42, p_ofi, 'oficinas', now() - interval '30 days'),
    (org_aurora, g42, p_ana, 'staff', now() - interval '30 days'),
    (org_aurora, g42, p_jorge, 'staff', now() - interval '30 days'),
    (org_aurora, g42, p_lucia, 'staff', now() - interval '30 days');

  -- -------------------------------------------------------------------------
  -- Participaciones G42 (Valeria + 19) — todas activas
  -- -------------------------------------------------------------------------
  insert into participations (organization_id, person_id, cohort_id, state, source, registered_at)
  select org_aurora, x.pid, g42, 'activo', 'website', now() - interval '25 days'
  from unnest(g42_ids || p_val) as x(pid);

  -- Participaciones G41: 6 completo · 6 elegible_siguiente · 3 inscrito_siguiente
  for i in 1..15 loop
    insert into participations (organization_id, person_id, cohort_id, state, source, registered_at)
    values (
      org_aurora,
      format('ae000000-0000-4000-8000-0000000000%s', (29 + i)::text)::uuid,
      g41,
      case when i <= 6 then 'completo' when i <= 12 then 'elegible_siguiente' else 'inscrito_siguiente' end,
      'referido', now() - interval '125 days'
    );
  end loop;

  -- Grupos pequeños de la G42
  insert into small_groups (id, organization_id, cohort_id, name, staff_person_id) values
    (grp_ambar, org_aurora, g42, 'Grupo Ámbar', p_ana),
    (grp_cedro, org_aurora, g42, 'Grupo Cedro', p_jorge),
    (grp_rio, org_aurora, g42, 'Grupo Río', p_lucia);

  insert into small_group_members (organization_id, small_group_id, participation_id)
  select org_aurora,
    case
      when pa.person_id in (p_val, g42_ids[1], g42_ids[4], g42_ids[5], g42_ids[6], g42_ids[7]) then grp_ambar
      when pa.person_id in (g42_ids[2], g42_ids[8], g42_ids[9], g42_ids[10], g42_ids[11], g42_ids[12]) then grp_cedro
      else grp_rio
    end,
    pa.id
  from participations pa where pa.cohort_id = g42;

  -- -------------------------------------------------------------------------
  -- Sesiones y asistencia (6 pasadas, 2 futuras)
  -- Luis: ausente en 5 y 6 · Sofía: ausente en 4, 5 y 6 · resto casi completo
  -- -------------------------------------------------------------------------
  for i in 1..8 loop
    insert into sessions (id, organization_id, cohort_id, name, sequence, starts_at, ends_at)
    values (s_ids[i], org_aurora, g42, 'Sesión ' || i, i, session_starts[i], session_starts[i] + interval '3 hours');
  end loop;

  for i in 1..6 loop
    for att_row in
      select * from participations where cohort_id = g42
    loop
      att_status := 'presente';
      if att_row.person_id = g42_ids[1] and i >= 5 then att_status := 'ausente'; end if;      -- Luis
      if att_row.person_id = g42_ids[2] and i >= 4 then att_status := 'ausente'; end if;      -- Sofía
      if att_row.person_id = g42_ids[8] and i = 3 then att_status := 'ausente'; end if;       -- Diana, aislada
      if att_row.person_id = g42_ids[13] and i = 2 then att_status := 'justificada'; end if;  -- Óscar
      insert into attendance_records (organization_id, session_id, participation_id, status, recorded_by)
      values (org_aurora, s_ids[i], att_row.id, att_status, p_ofi);
    end loop;
  end loop;

  -- -------------------------------------------------------------------------
  -- Finanzas: inscripción $8,500 MXN por participante de G42
  -- 13 pagados (3 sin conciliar) · 4 parciales vencidos · 2 pendientes futuros · 1 pendiente vencido
  -- -------------------------------------------------------------------------
  foreach pid in array (g42_ids || p_val) loop
    idx := coalesce(array_position(g42_ids, pid), 0); -- Valeria = 0
    select id into part_id from participations where person_id = pid and cohort_id = g42;

    if idx in (1, 2, 8, 9) then
      -- parcial y vencido (Luis, Sofía, Diana, Emilio)
      insert into charges (id, organization_id, person_id, participation_id, concept, amount_cents, due_on, status)
      values (gen_random_uuid(), org_aurora, pid, part_id, 'Inscripción · Básico G42', 850000, current_date - 21, 'parcial')
      returning id into charge_id;
      insert into payments (organization_id, charge_id, amount_cents, method, reference, paid_at, reconciled, reconciled_at, reconciled_by)
      values (org_aurora, charge_id, 400000, 'transferencia', 'TRF-' || idx, now() - interval '20 days', true, now() - interval '19 days', p_ofi);
    elsif idx = 10 then
      -- pendiente y vencido (Karla)
      insert into charges (organization_id, person_id, participation_id, concept, amount_cents, due_on, status)
      values (org_aurora, pid, part_id, 'Inscripción · Básico G42', 850000, current_date - 21, 'pendiente');
    elsif idx in (11, 12) then
      -- pendiente con vencimiento futuro (plan de pagos)
      insert into charges (organization_id, person_id, participation_id, concept, amount_cents, due_on, status)
      values (org_aurora, pid, part_id, 'Inscripción · Básico G42', 850000, current_date + 7, 'pendiente');
    else
      -- pagado (índices 3-7 y 13-19 y Valeria); 3 pagos sin conciliar
      insert into charges (id, organization_id, person_id, participation_id, concept, amount_cents, due_on, status)
      values (gen_random_uuid(), org_aurora, pid, part_id, 'Inscripción · Básico G42', 850000, current_date - 21, 'pagado')
      returning id into charge_id;
      insert into payments (organization_id, charge_id, amount_cents, method, reference, paid_at, reconciled, reconciled_at, reconciled_by)
      values (
        org_aurora, charge_id, 850000,
        case when idx % 3 = 0 then 'tarjeta' else 'transferencia' end,
        'PAY-' || idx, now() - (18 + (idx % 5)) * interval '1 day',
        idx not in (13, 14, 15),
        case when idx not in (13, 14, 15) then now() - interval '15 days' end,
        case when idx not in (13, 14, 15) then p_ofi end
      );
    end if;
  end loop;

  -- Consentimientos de contacto para las personas con seguimiento probable
  insert into consent_records (organization_id, person_id, purpose, channel, granted, text_version)
  select org_aurora, x.pid, 'seguimiento_operativo', 'whatsapp', true, 'v1-2026'
  from unnest(array[p_val, g42_ids[1], g42_ids[2], g42_ids[8], g42_ids[9], g42_ids[10]]) as x(pid);
  insert into consent_records (organization_id, person_id, purpose, channel, granted, text_version)
  values (org_aurora, g42_ids[3], 'seguimiento_operativo', 'email', true, 'v1-2026');

  -- -------------------------------------------------------------------------
  -- Eventos, misiones y conversación de la generación
  -- -------------------------------------------------------------------------
  insert into events (id, organization_id, cohort_id, title, description, starts_at, ends_at, modality, location_text, created_by) values
    (ev_circulo, org_aurora, g42, 'Círculo de integración', 'Espacio de la Generación 42 para compartir avances y prepararse para la segunda mitad del Básico.', now() + interval '2 days', now() + interval '2 days 3 hours', 'presencial', 'Sede Roma · Salón 2', p_ofi),
    (ev_noche, org_aurora, null, 'Noche de graduados', 'Encuentro abierto para graduados de todas las generaciones.', now() + interval '9 days', now() + interval '9 days 3 hours', 'hibrida', 'Sede Roma · Terraza', p_ofi);

  -- 15 confirmados al Círculo; sin responder: Valeria, Luis, Sofía, Renata y Mariana Peña
  insert into rsvps (organization_id, event_id, person_id, status, responded_at)
  select org_aurora, ev_circulo, x.pid, 'confirmado', now() - interval '1 day'
  from unnest(g42_ids[5:19]) as x(pid);

  insert into missions (id, organization_id, cohort_id, title, description, due_on, sequence) values
    (mi_conv, org_aurora, g42, 'Conversación valiente', 'Ten una conversación pendiente con alguien importante para ti y registra qué descubriste.', current_date + 4, 1),
    (mi_carta, org_aurora, g42, 'Carta a mi futuro yo', 'Escríbete una carta para leer el día de tu graduación.', current_date + 10, 2);

  -- 12 completaron la primera misión (Valeria no — es su siguiente acción)
  insert into mission_completions (organization_id, mission_id, participation_id, note, completed_at)
  select org_aurora, mi_conv, pa.id, 'Misión registrada durante la sesión.', now() - interval '3 days'
  from participations pa
  where pa.cohort_id = g42 and pa.person_id in (select unnest(g42_ids[5:16]));

  -- Conversación: posts con respuesta del staff + la primera contribución de Renata SIN respuesta (hace 30 h)
  insert into posts (organization_id, cohort_id, author_person_id, kind, body, created_at) values
    (org_aurora, g42, g42_ids[4], 'aprendizaje', 'Después de la Sesión 4 entendí que llevo años posponiendo la conversación con mi papá. Esta semana la voy a tener.', now() - interval '5 days'),
    (org_aurora, g42, g42_ids[11], 'declaracion', 'Declaro que esta semana voy a pedir ayuda cuando la necesite, sin justificarme.', now() - interval '3 days'),
    (org_aurora, g42, g42_ids[12], 'celebracion', '¡Cerré mi primera venta después de 4 meses! La misión de la conversación valiente me destrabó.', now() - interval '2 days');

  insert into comments (organization_id, post_id, author_person_id, body)
  select org_aurora, po.id, p_ana, 'Gracias por compartirlo. Aquí estamos para acompañarte.'
  from posts po where po.author_person_id = g42_ids[4];

  insert into comments (organization_id, post_id, author_person_id, body)
  select org_aurora, po.id, p_jorge, '¡Enorme! Cuéntanos en el Círculo cómo lo lograste.'
  from posts po where po.author_person_id = g42_ids[12];

  insert into posts (id, organization_id, cohort_id, author_person_id, kind, body, created_at) values
    (post_renata, org_aurora, g42, g42_ids[3], 'pregunta', '¿Alguien más siente que después de la Sesión 6 quedaron cosas moviéndose? Es mi primera vez compartiendo aquí y no sé bien cómo procesarlo.', now() - interval '30 hours');

  insert into posts (organization_id, cohort_id, author_person_id, kind, body, visibility_scope, created_at) values
    (org_aurora, null, p_ofi, 'aviso', 'Bienvenida, Generación 42. Este es el espacio de su generación: aquí viven sus misiones, eventos y conversaciones.', 'centro', now() - interval '20 days');

  -- -------------------------------------------------------------------------
  -- Centro Norte: datos mínimos para probar aislamiento entre tenants
  -- -------------------------------------------------------------------------
  insert into programs (organization_id, name) values (org_norte, 'Programa Norte');
  insert into levels (organization_id, program_id, name, sequence)
  select org_norte, id, 'Básico', 1 from programs where organization_id = org_norte;
  insert into cohorts (organization_id, program_id, level_id, name, starts_on, status)
  select org_norte, p.id, l.id, 'Norte G1', current_date - 10, 'activa'
  from programs p join levels l on l.program_id = p.id where p.organization_id = org_norte;
  insert into charges (organization_id, person_id, concept, amount_cents, due_on, status)
  values (org_norte, p_norte, 'Prueba Norte', 100000, current_date, 'pendiente');
end $$;

drop function public._seed_auth_user(uuid, text);
