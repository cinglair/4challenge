import type { Puzzle } from '../services/models'
import { LEVELS } from './constants'
import { countWord } from './format'

/*
 * Textos do desafio de um dia: título, descrição e enunciados por extenso.
 * Usados na tela e na pré-renderização (scripts/prerender.mjs), que roda no
 * Node: só imports relativos aqui.
 */

type PuzzleFacts = Pick<Puzzle, 'level' | 'target' | 'digit' | 'count'>

/** Os desafios na ordem Fácil, Médio, Difícil. */
export const byLevel = <T extends PuzzleFacts>(puzzles: T[]): T[] =>
   LEVELS.flatMap((l) => puzzles.filter((p) => p.level === l.id))

/** Ex.: "11 com três algarismos 5". */
export const puzzlePhrase = (p: PuzzleFacts) =>
   `${p.target} com ${countWord(p.count)} algarismos ${p.digit}`

/** Ex.: "Fácil: forme 11 com três algarismos 5." */
export function puzzleSentence(p: PuzzleFacts): string {
   const label = LEVELS.find((l) => l.id === p.level)!.label
   return `${label}: forme ${puzzlePhrase(p)}.`
}

/** Ex.: "11 com três algarismos 5 · 22 com quatro algarismos 8 · …" */
export const puzzleSummary = (puzzles: PuzzleFacts[]) =>
   byLevel(puzzles).map(puzzlePhrase).join(' · ')

export const challengeTitle = (longDate: string) =>
   `Desafio de matemática de ${longDate}`

export function challengeDescription(
   longDate: string,
   puzzles: PuzzleFacts[]
): string {
   if (!puzzles.length)
      return `Os três desafios de matemática de ${longDate}: forme o número-alvo usando um único algarismo.`
   const phrases = byLevel(puzzles).map(puzzlePhrase)
   const list =
      phrases.length > 1
         ? phrases.slice(0, -1).join(', ') + ' e ' + phrases.at(-1)
         : phrases[0]
   return `Desafios de matemática de ${longDate}: forme ${list}.`
}
