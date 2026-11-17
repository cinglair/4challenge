export type Level = 'easy' | 'medium' | 'hard'

/** Um desafio do dia. */
export interface Puzzle {
   id: string
   date: string // AAAA-MM-DD
   level: Level
   target: number // número a formar
   digit: number // algarismo permitido
   count: number // quantas vezes ele deve aparecer
}
