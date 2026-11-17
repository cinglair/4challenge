import type { DailyPuzzleDTO } from '../DTO'
import type { Puzzle } from '../models'

export function mapDailyPuzzleDTOToModel(dto: DailyPuzzleDTO): Puzzle {
   return {
      id: `${dto.date}-${dto.level}`,
      date: dto.date,
      level: dto.level,
      target: dto.target,
      digit: dto.digit,
      count: dto.count,
   }
}
