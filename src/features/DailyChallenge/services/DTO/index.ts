import type { Row } from '../../types'

/** Um desafio como vem do banco de dados (tabela `daily_puzzles`). */
export interface DailyPuzzleDTO {
   date: string
   level: 'easy' | 'medium' | 'hard'
   target: number
   digit: number
   count: number
}

/** A dica de um desafio: o começo de uma solução. */
export interface PuzzleHintDTO {
   hint: Row
}
