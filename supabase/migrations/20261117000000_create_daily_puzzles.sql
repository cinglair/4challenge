create table public.daily_puzzles (
  date date not null,
  level text not null check (level in ('easy', 'medium', 'hard')),
  target integer not null check (target > 0),
  digit smallint not null check (digit between 1 and 9),
  count smallint not null check (count between 2 and 6),
  hint jsonb not null,
  primary key (date, level)
);

comment on table public.daily_puzzles is 'Desafios diários do algarism.io: um por dia e nível.';
comment on column public.daily_puzzles.hint is 'Começo de uma solução (árvore da expressão), mostrado quando o jogador pede dica.';

alter table public.daily_puzzles enable row level security;

-- Leitura pública só até amanhã (UTC), o que cobre "hoje" em qualquer fuso
-- sem entregar os desafios futuros.
create policy "Desafios liberados são públicos"
  on public.daily_puzzles
  for select
  to anon, authenticated
  using (date <= (now() at time zone 'utc')::date + 1);

revoke all on public.daily_puzzles from anon, authenticated;
grant select on public.daily_puzzles to anon, authenticated;
