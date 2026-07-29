-- ══════════════════════════════════════════════════════════════════════════
-- ALPHA 3 · Seed del Hub Centro
--
-- La auditoría notó que el demo tenía 1 notificación contra 9 interacciones:
-- «el demo no enseña que la red responde». Aquí se siembra el loop completo —
-- publicar → responder → avisar → volver — y la vida del centro fuera de una
-- sola generación: alumni que regresan, círculos con anfitrión, perfiles con
-- suficiente identidad para que alguien decida conectar.
-- ══════════════════════════════════════════════════════════════════════════

do $$
declare
  org uuid := 'a0000000-0000-4000-8000-000000000001';
  p_ofi uuid := 'ae000000-0000-4000-8000-000000000002';
  p_val uuid := 'ae000000-0000-4000-8000-000000000004';
  p_pau uuid := 'ae000000-0000-4000-8000-000000000046';
  p_marco uuid := 'ae000000-0000-4000-8000-000000000047';
  p_ivonne uuid := 'ae000000-0000-4000-8000-000000000060';
  p_ramon uuid := 'ae000000-0000-4000-8000-000000000061';
  p_claudia uuid := 'ae000000-0000-4000-8000-000000000062';
  sp_centro uuid;
  sp_alumni uuid;
  sp_pide uuid;
  sp_despues uuid;
  sp_g42 uuid;
  sp_g41 uuid;
  nuevo_post uuid;
  autor uuid;
  r record;
begin
  select id into sp_centro from spaces where organization_id = org and kind = 'centro';
  select id into sp_alumni from spaces where organization_id = org and kind = 'alumni';
  select id into sp_pide from spaces where organization_id = org and slug = 'pide-ofrece';
  select id into sp_despues from spaces where organization_id = org and slug = 'despues-de-graduarte';
  select s.id into sp_g42 from spaces s join generation_cycles c on c.id = s.cycle_id
    where s.organization_id = org and c.number = 42;
  select s.id into sp_g41 from spaces s join generation_cycles c on c.id = s.cycle_id
    where s.organization_id = org and c.number = 41;

  -- ── Anfitriones de los círculos ─────────────────────────────────────────
  update spaces set host_person_id = p_pau where id = sp_pide;
  update spaces set host_person_id = p_marco where id = sp_despues;
  update spaces set host_person_id = p_ofi where id = sp_centro;

  -- Semilla de miembros de los círculos (10-20 personas, doc 19 §17).
  insert into space_memberships (organization_id, space_id, person_id, role)
  values (org, sp_pide, p_pau, 'anfitrion'), (org, sp_despues, p_marco, 'anfitrion')
  on conflict do nothing;

  insert into space_memberships (organization_id, space_id, person_id)
  select org, sp_pide, m.person_id
  from organization_memberships m
  where m.organization_id = org and m.status = 'active'
  order by m.person_id limit 14
  on conflict do nothing;

  insert into space_memberships (organization_id, space_id, person_id)
  select org, sp_despues, sm.person_id
  from space_memberships sm
  where sm.space_id = sp_alumni
  limit 12
  on conflict do nothing;

  -- ── Perfiles con identidad suficiente para conectar ─────────────────────
  update people set
    bio = 'Graduada del PL G40. Sirvo como staff porque acompañar me sigue enseñando.',
    city = 'Ciudad de México', interests = array['servicio', 'liderazgo', 'lectura'],
    skills = array['acompañamiento', 'facilitación'], offers = array['mentoría a quien entra al Básico'],
    available_to_serve = true
  where id = p_pau;

  update people set
    bio = 'Construyo un negocio de alimentos saludables. En el PL aprendí a pedir ayuda.',
    city = 'Ciudad de México', interests = array['emprendimiento', 'nutrición'],
    skills = array['ventas', 'operaciones'], offers = array['asesoría para lanzar tu primer producto'],
    looking_for = array['socios', 'clientes']
  where id = p_ivonne;

  update people set
    bio = 'Capitán de la G41. Mi trabajo es que nadie del equipo cargue solo.',
    city = 'Querétaro', interests = array['equipos', 'montañismo'],
    skills = array['coordinación', 'logística'], offers = array['organizar actividades de equipo'],
    available_to_serve = true
  where id = p_marco;

  update people set
    bio = 'Terminé mi Básico hace unos días y sigo procesando lo que se movió.',
    city = 'Ciudad de México', interests = array['escritura', 'familia'],
    looking_for = array['acompañamiento']
  where id = p_val;

  update people set
    bio = 'Diseñadora. Después del PL retomé un proyecto que llevaba tres años parado.',
    city = 'Guadalajara', interests = array['diseño', 'arte'],
    skills = array['identidad visual'], offers = array['revisión de marca sin costo a graduados']
  where id = p_claudia;

  -- ── Conversación del CENTRO (más allá de una generación) ────────────────
  insert into posts (organization_id, space_id, author_person_id, kind, body, created_at)
  values
    (org, sp_centro, p_ofi, 'aviso',
     'Bienvenidas y bienvenidos al Hub del centro. Este espacio es de todas las generaciones: aquí viven los avisos, los eventos abiertos y las conversaciones que cruzan promociones.',
     now() - interval '9 days'),
    (org, sp_centro, p_marco, 'celebracion',
     'La G41 cerró su fin de semana de Visión con 12 de 12 presentes. Gracias al equipo que sostuvo la logística.',
     now() - interval '5 days'),
    (org, sp_alumni, p_pau, 'oportunidad',
     'Se abren lugares de staff para el Básico G43. Servir es la mejor forma que conozco de seguir entrenando.',
     now() - interval '3 days'),
    (org, sp_despues, p_marco, 'pregunta',
     '¿Qué fue lo más difícil de tu primera semana después de graduarte? Yo volví al trabajo el lunes y sentí que nadie hablaba mi idioma.',
     now() - interval '2 days'),
    (org, sp_pide, p_ivonne, 'ayuda',
     'Busco a alguien que haya montado una cocina certificada. Necesito entender los permisos antes de firmar el local.',
     now() - interval '30 hours');

  -- ── El loop completo: respuestas Y sus avisos ───────────────────────────
  -- Sin notificaciones, el demo no demuestra que la red responde.
  for r in
    select p.id as post_id, p.author_person_id, p.space_id, s.name as space_name
    from posts p join spaces s on s.id = p.space_id
    where p.organization_id = org
  loop
    -- Reacciones y comentarios ya sembrados generan su aviso.
    insert into notifications (organization_id, person_id, kind, text, href, created_at)
    select org, r.author_person_id, 'comentario',
           pe.full_name || ' respondió a tu publicación en ' || r.space_name || '.',
           '/mi/comunidad/p/' || r.post_id, c.created_at
    from comments c join people pe on pe.id = c.author_person_id
    where c.post_id = r.post_id and c.author_person_id <> r.author_person_id;

    insert into notifications (organization_id, person_id, kind, text, href, created_at)
    select org, r.author_person_id, 'reaccion',
           pe.full_name || ' reaccionó a tu publicación.',
           '/mi/comunidad/p/' || r.post_id, pr.created_at
    from post_reactions pr join people pe on pe.id = pr.person_id
    where pr.post_id = r.post_id and pr.person_id <> r.author_person_id;
  end loop;

  -- Respuestas nuevas en los espacios del centro, cada una con su aviso.
  select id into nuevo_post from posts
    where space_id = sp_despues and author_person_id = p_marco limit 1;
  insert into comments (organization_id, post_id, author_person_id, body, created_at)
  values
    (org, nuevo_post, p_claudia,
     'Lo mismo. Lo que me ayudó fue no intentar explicarlo: solo empecé a hacer las cosas distinto y la gente lo notó sola.',
     now() - interval '20 hours'),
    (org, nuevo_post, p_pau,
     'A mí me salvó volver como staff. Regresar al salón desde el otro lado me ordenó todo.',
     now() - interval '14 hours');
  insert into notifications (organization_id, person_id, kind, text, href, created_at)
  values
    (org, p_marco, 'comentario', 'Claudia Meraz respondió a tu pregunta en Lo que nadie te dijo después de graduarte.', '/mi/comunidad/p/' || nuevo_post, now() - interval '20 hours'),
    (org, p_marco, 'comentario', 'Paulina Reyes respondió a tu pregunta en Lo que nadie te dijo después de graduarte.', '/mi/comunidad/p/' || nuevo_post, now() - interval '14 hours');

  select id into nuevo_post from posts
    where space_id = sp_pide and author_person_id = p_ivonne limit 1;
  insert into comments (organization_id, post_id, author_person_id, body, created_at)
  values (org, nuevo_post, p_claudia,
    'Yo pasé por eso el año pasado. Te escribo por mensaje y te paso el contacto de la persona que me llevó los permisos.',
    now() - interval '6 hours');
  insert into notifications (organization_id, person_id, kind, text, href, created_at)
  values (org, p_ivonne, 'comentario', 'Claudia Meraz respondió a tu petición de ayuda.', '/mi/comunidad/p/' || nuevo_post, now() - interval '6 hours');

  -- ── Relaciones y una conversación privada real ──────────────────────────
  insert into follows (organization_id, follower_person_id, followed_person_id) values
    (org, p_val, p_pau), (org, p_ivonne, p_marco), (org, p_claudia, p_pau)
  on conflict do nothing;

  insert into connections (organization_id, person_a, person_b) values
    (org, least(p_ivonne, p_claudia), greatest(p_ivonne, p_claudia)),
    (org, least(p_pau, p_marco), greatest(p_pau, p_marco))
  on conflict do nothing;

  -- Solicitud pendiente: Valeria quiere escribirle a su staff.
  insert into connection_requests (organization_id, from_person_id, to_person_id, message)
  values (org, p_val, p_pau, 'Hola Paulina, me gustaría seguir en contacto después del Básico.')
  on conflict do nothing;

  -- Conversación privada Ivonne ↔ Claudia (el centro NO puede leerla).
  insert into conversations (id, organization_id, kind, created_by, last_message_at)
  values ('c0000000-0000-4000-8000-000000000001', org, 'directa', p_claudia, now() - interval '5 hours');
  insert into conversation_members (organization_id, conversation_id, person_id, last_read_at) values
    (org, 'c0000000-0000-4000-8000-000000000001', p_claudia, now() - interval '5 hours'),
    (org, 'c0000000-0000-4000-8000-000000000001', p_ivonne, null);
  insert into messages (organization_id, conversation_id, sender_person_id, body, created_at) values
    (org, 'c0000000-0000-4000-8000-000000000001', p_claudia,
     'Ivonne, aquí va el contacto que te dije. Dile que vas de mi parte.', now() - interval '5 hours'),
    (org, 'c0000000-0000-4000-8000-000000000001', p_claudia,
     'Y si quieres, el jueves te cuento cómo fue mi proceso con Protección Civil.', now() - interval '5 hours');
  insert into notifications (organization_id, person_id, kind, text, href, created_at)
  values (org, p_ivonne, 'sistema', 'Claudia Meraz te envió un mensaje.', '/mi/mensajes', now() - interval '5 hours');

  -- Solicitud de mensaje sin relación previa: Ramón le escribe a Valeria.
  insert into message_requests (organization_id, from_person_id, to_person_id, body)
  values (org, p_ramon, p_val,
    'Hola Valeria, vi tu publicación sobre el Básico. Yo estoy en el PL y me pasó algo parecido, si quieres platicamos.')
  on conflict do nothing;

  -- ── Un reporte abierto para que la consola tenga qué mostrar ────────────
  select id into nuevo_post from posts where space_id = sp_pide limit 1;
  insert into reports (organization_id, reporter_person_id, target_kind, target_id, reason, detail)
  values (org, p_val, 'post', nuevo_post, 'spam',
    'Me parece que esto es promoción de un negocio, no una petición de ayuda.');
end $$;
