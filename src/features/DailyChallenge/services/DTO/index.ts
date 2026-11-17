/** Um desafio como vem do banco de dados. */
export interface DailyPuzzleDTO {
   id: string
   date: string
   level: 'easy' | 'medium' | 'hard'
   target: number
   digit: number
   count: number
}
