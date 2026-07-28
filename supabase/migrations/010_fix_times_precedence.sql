-- Corrige 009: AT TIME ZONE tiene mayor precedencia que "+", así que la hora
-- quedó interpretada en UTC (13:00 locales). Paréntesis explícitos.

update public.sessions s
set starts_at = ((s.starts_at at time zone 'America/Mexico_City')::date + time '19:00') at time zone 'America/Mexico_City',
    ends_at   = ((s.starts_at at time zone 'America/Mexico_City')::date + time '22:00') at time zone 'America/Mexico_City'
from public.organizations o
where o.id = s.organization_id and o.is_demo;

update public.events e
set starts_at = ((e.starts_at at time zone 'America/Mexico_City')::date + time '19:00') at time zone 'America/Mexico_City',
    ends_at   = ((e.starts_at at time zone 'America/Mexico_City')::date + time '21:30') at time zone 'America/Mexico_City'
from public.organizations o
where o.id = e.organization_id and o.is_demo;
