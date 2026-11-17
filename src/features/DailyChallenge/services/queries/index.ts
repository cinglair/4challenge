import { useQuery } from '@tanstack/react-query'

import { fetchDailyPuzzles, fetchPuzzleHint } from '../http'
import { mapDailyPuzzleDTOToModel } from '../mappers'
import type { Level } from '../models'

export const dailyPuzzlesQueryKey = (date: string) =>
   ['daily-puzzles', date] as const

export function useDailyPuzzlesQuery(date: string) {
   return useQuery({
      queryKey: dailyPuzzlesQueryKey(date),
      queryFn: () => fetchDailyPuzzles(date),
      select: (data) => data.map(mapDailyPuzzleDTOToModel),
      staleTime: Infinity,
   })
}

export const puzzleHintQueryKey = (date: string, level: Level) =>
   ['puzzle-hint', date, level] as const

/** A dica só é buscada quando `enabled` — isto é, quando o jogador pede. */
export function usePuzzleHintQuery(
   date: string,
   level: Level,
   enabled: boolean
) {
   return useQuery({
      queryKey: puzzleHintQueryKey(date, level),
      queryFn: () => fetchPuzzleHint(date, level),
      select: (data) => data.hint,
      enabled,
      staleTime: Infinity,
   })
}
