-- Os endpoints da aplicação exigem usuário autenticado.
revoke all on table public.peaks, public.surfs from anon;

-- O usuário autenticado pode gerenciar os próprios picos.
grant select, insert, update, delete
on table public.peaks
to authenticated;

-- As operações disponíveis nesta etapa para sessões.
grant select, insert, delete
on table public.surfs
to authenticated;