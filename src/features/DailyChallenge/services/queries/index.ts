import { useQuery } from '@tanstack/react-query'

import { fetchDailyPuzzles } from '../http'
import { mapDailyPuzzleDTOToModel } from '../mappers'

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
