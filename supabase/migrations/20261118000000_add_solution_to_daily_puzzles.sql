-- Uma solução possível de cada desafio, mostrada quando o jogador desiste.
-- Fica nula até a carga: rode `supabase/seed.sql` depois desta migração para
-- preencher os desafios que já existem.
alter table public.daily_puzzles add column solution jsonb;

comment on column public.daily_puzzles.solution is 'Uma solução possível (árvore da expressão), mostrada quando o jogador pede para ver a solução.';
