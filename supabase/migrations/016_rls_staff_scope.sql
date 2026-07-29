-- ══════════════════════════════════════════════════════════════════════════
-- Alcance fino de RLS v2:
-- 1) is_team reconoce capitán y coach (asignaciones de servicio vigentes).
-- 2) El STAFF no ve todas las participaciones/asistencias del centro:
--    solo las propias y las de su grupo asignado. Ocultar un botón no es
--    control de acceso; esto lo garantiza la base.
-- ══════════════════════════════════════════════════════════════════════════

create or replace function public.is_team(org uuid)
returns boolean
language sql stable security definer
set search_path = public
as $$
  select public.has_role(org, array['dueno', 'oficinas', 'entrenador', 'coach', 'capitan', 'staff', 'dream_team', 'finanzas'])
$$;

-- Roles con lectura operativa AMPLIA (sin staff).
drop policy sp_select on public.stage_participations;
create policy sp_select on public.stage_participations for select using (
  person_id = current_person_id()
  or has_role(organization_id, array['dueno', 'oficinas', 'entrenador', 'coach', 'capitan', 'dream_team', 'finanzas'])
  or is_staff_of_participation(id)
);

drop policy att_v2_select on public.attendance_records;
create policy att_v2_select on public.attendance_records for select using (
  has_role(organization_id, array['dueno', 'oficinas', 'entrenador', 'coach', 'capitan'])
  or exists (select 1 from stage_participations sp where sp.id = attendance_records.stage_participation_id and sp.person_id = current_person_id())
  or is_staff_of_participation(stage_participation_id)
);

drop policy expectations_select on public.attendance_expectations;
create policy expectations_select on public.attendance_expectations for select using (
  has_role(organization_id, array['dueno', 'oficinas', 'entrenador', 'coach', 'capitan'])
  or exists (select 1 from stage_participations sp where sp.id = attendance_expectations.stage_participation_id and sp.person_id = current_person_id())
  or is_staff_of_participation(stage_participation_id)
);

drop policy plane_history_select on public.participation_plane_history;
create policy plane_history_select on public.participation_plane_history for select using (
  has_role(organization_id, array['dueno', 'oficinas', 'entrenador'])
);
