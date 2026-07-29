-- ══════════════════════════════════════════════════════════════════════════
-- ALPHA 3 · Release A — el calendario deja de mentir
-- El seed anterior usaba `current_date ± n`, así que "Viernes" caía en jueves
-- y el "Viernes" del Avanzado caía en domingo. Un centro que comunicara esas
-- fechas citaría a su gente el día equivocado.
-- Aquí se reanclan los días de etapa en viernes reales y los hitos del PL
-- pasan a ser fines de semana completos, no reuniones nocturnas sueltas.
-- ══════════════════════════════════════════════════════════════════════════

do $$
declare
  tz constant text := 'America/Mexico_City';
  run record;
  ev record;
  viernes date;
  offset_dias int;
begin
  -- ── Básico y Avanzado: viernes → sábado → domingo ────────────────────────
  for run in
    select id, starts_on, stage from stage_runs where stage in ('basico', 'avanzado')
  loop
    -- Primer viernes en o después de la fecha planeada (dow: viernes = 5).
    viernes := run.starts_on + ((5 - extract(dow from run.starts_on)::int + 7) % 7);

    for ev in
      select id, name from event_occurrences
      where stage_run_id = run.id and kind in ('dia_basico', 'dia_avanzado')
    loop
      offset_dias := case lower(ev.name)
        when 'viernes' then 0
        when 'sábado' then 1
        when 'domingo' then 2
        else null
      end;
      if offset_dias is null then continue; end if;

      update event_occurrences set
        starts_at = ((viernes + offset_dias) + time '09:00') at time zone tz,
        ends_at   = ((viernes + offset_dias) + time '21:00') at time zone tz
      where id = ev.id;
    end loop;

    update stage_runs set starts_on = viernes, ends_on = viernes + 2 where id = run.id;
  end loop;

  -- ── Hitos del PL: fin de semana completo, no una noche suelta ────────────
  for ev in
    select e.id, e.starts_at, e.name
    from event_occurrences e
    where e.kind = 'hito_pl'
  loop
    viernes := (ev.starts_at at time zone tz)::date;
    viernes := viernes + ((5 - extract(dow from viernes)::int + 7) % 7);
    update event_occurrences set
      starts_at = (viernes + time '19:00') at time zone tz,
      ends_at   = ((viernes + 2) + time '20:00') at time zone tz,
      description = coalesce(description, '') ||
        case when coalesce(description, '') = '' then '' else ' ' end ||
        'Fin de semana completo: viernes por la tarde a domingo.'
    where id = ev.id;
  end loop;

  -- ── Graduación: domingo por la tarde ─────────────────────────────────────
  for ev in select e.id, e.starts_at from event_occurrences e where e.kind = 'graduacion' loop
    viernes := (ev.starts_at at time zone tz)::date;
    -- Próximo domingo (dow = 0).
    viernes := viernes + ((0 - extract(dow from viernes)::int + 7) % 7);
    update event_occurrences set
      starts_at = (viernes + time '17:00') at time zone tz,
      ends_at   = (viernes + time '21:00') at time zone tz
    where id = ev.id;
  end loop;

  -- ── El PL termina el día de su graduación ────────────────────────────────
  update stage_runs sr set ends_on = (
    select max((e.starts_at at time zone tz)::date)
    from event_occurrences e
    where e.stage_run_id = sr.id and e.kind = 'graduacion'
  )
  where sr.stage = 'pl'
    and exists (
      select 1 from event_occurrences e
      where e.stage_run_id = sr.id and e.kind = 'graduacion'
    );
end $$;

-- Verificación dura: si algo quedó mal, la migración falla en vez de mentir.
do $$
declare
  malos int;
begin
  select count(*) into malos
  from event_occurrences e
  where e.kind in ('dia_basico', 'dia_avanzado')
    and translate(lower(trim(e.name)), 'áéíóú', 'aeiou') <> translate(
      (array['domingo','lunes','martes','miercoles','jueves','viernes','sabado'])[
        extract(dow from (e.starts_at at time zone e.timezone))::int + 1
      ], 'áéíóú', 'aeiou');
  if malos > 0 then
    raise exception 'Quedan % eventos cuyo nombre no coincide con su fecha.', malos;
  end if;
end $$;
