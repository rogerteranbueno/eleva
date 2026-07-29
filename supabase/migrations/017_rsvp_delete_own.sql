-- Una persona puede retirar su propia confirmación (faltaba la política DELETE;
-- sin ella, el delete "exitoso" borraba 0 filas en silencio).
create policy rsvps_v2_delete_own on public.rsvps for delete using (
  person_id = current_person_id()
);
