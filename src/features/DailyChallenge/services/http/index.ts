import type { DailyPuzzleDTO, PuzzleHintDTO, PuzzleSolutionDTO } from '../DTO'
import type { Level } from '../models'

/** Lê a tabela `daily_puzzles` pela API REST do Supabase. */
async function selectDailyPuzzles<T>(query: Record<string, string>) {
   const url = import.meta.env.VITE_SUPABASE_URL
   const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
   if (!url || !key)
      throw new Error(
         'Defina VITE_SUPABASE_URL e VITE_SUPABASE_PUBLISHABLE_KEY (veja o README).'
      )

   const response = await fetch(
      `${url}/rest/v1/daily_puzzles?${new URLSearchParams(query)}`,
      { headers: { apikey: key } }
   )
   if (!response.ok)
      throw new Error(`Falha ao buscar os desafios (HTTP ${response.status}).`)
   return (await response.json()) as T[]
}

/** Os três desafios de um dia (AAAA-MM-DD). */
export async function fetchDailyPuzzles(
   date: string
): Promise<DailyPuzzleDTO[]> {
   const puzzles = await selectDailyPuzzles<DailyPuzzleDTO>({
      select: 'date,level,target,digit,count',
      date: `eq.${date}`,
   })
   if (puzzles.length === 0) throw new Error(`Não há desafios para ${date}.`)
   return puzzles
}

/** A dica de um desafio, buscada só quando o jogador pede. */
export async function fetchPuzzleHint(
   date: string,
   level: Level
): Promise<PuzzleHintDTO> {
   const [found] = await selectDailyPuzzles<PuzzleHintDTO>({
      select: 'hint',
      date: `eq.${date}`,
      level: `eq.${level}`,
   })
   if (!found) throw new Error(`Não há dica para ${date} (${level}).`)
   return found
}

/** Uma solução possível de um desafio, buscada só quando o jogador desiste. */
export async function fetchPuzzleSolution(
   date: string,
   level: Level
): Promise<PuzzleSolutionDTO> {
   const [found] = await selectDailyPuzzles<PuzzleSolutionDTO>({
      select: 'solution',
      date: `eq.${date}`,
      level: `eq.${level}`,
   })
   if (!found?.solution)
      throw new Error(`Não há solução para ${date} (${level}).`)
   return found
}

/** Todos os desafios já liberados até `today`, do dia mais recente ao mais antigo. */
export async function fetchReleasedPuzzles(
   today: string
): Promise<DailyPuzzleDTO[]> {
   return selectDailyPuzzles<DailyPuzzleDTO>({
      select: 'date,level,target,digit,count',
      date: `lte.${today}`,
      order: 'date.desc',
   })
}
