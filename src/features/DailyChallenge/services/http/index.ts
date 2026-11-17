import { MOCK_DB } from '../../mocks/daily-puzzles'
import type { DailyPuzzleDTO } from '../DTO'

const MOCK_LEVELS = ['easy', 'medium', 'hard'] as const

/** Troque o corpo desta função pela chamada real (ex.: GET /api/puzzles?date=…). */
export async function fetchDailyPuzzles(
   date: string
): Promise<DailyPuzzleDTO[]> {
   await new Promise((r) => setTimeout(r, 300)) // simula a latência da rede
   const day = Math.floor(Date.parse(date + 'T00:00:00Z') / 86_400_000)
   return MOCK_LEVELS.map((level) => {
      const list = MOCK_DB[level]
      const [target, digit, count] =
         list[((day % list.length) + list.length) % list.length]
      return { id: `${date}-${level}`, date, level, target, digit, count }
   })
}
