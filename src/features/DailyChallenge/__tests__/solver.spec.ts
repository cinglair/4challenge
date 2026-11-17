import { describe, expect, it } from 'vitest'

import { MOCK_DB } from '../mocks/daily-puzzles'
import type { Level } from '../services/models'
import type { MathNode, Row } from '../types'
import {
   countDigits,
   evaluate,
   maskSolution,
   solvePuzzle,
   toText,
} from '../utils'

const d = (v: number): MathNode => ({ k: 'digit', v })
const op = (v: '+' | '-' | '*'): MathNode => ({ k: 'op', v })

const kinds = (row: Row): string[] =>
   row.flatMap((n) => [
      n.k,
      ...('num' in n ? [...kinds(n.num), ...kinds(n.den)] : []),
      ...('exp' in n ? kinds(n.exp) : []),
      ...('body' in n ? kinds(n.body) : []),
   ])

describe('solvePuzzle', () => {
   const all = (Object.keys(MOCK_DB) as Level[]).flatMap((level) =>
      MOCK_DB[level].map(([target, digit, count]) => ({
         level,
         target,
         digit,
         count,
      }))
   )

   it.each(all)(
      'resolve $level: $target com $count algarismos $digit',
      (puzzle) => {
         const row = solvePuzzle(puzzle)
         expect(row).not.toBeNull()
         expect(evaluate(row!)).toEqual({ ok: true, value: puzzle.target })
         expect(countDigits(row!)).toBe(puzzle.count)

         // só usa o que o nível libera
         const used = kinds(row!)
         if (puzzle.level !== 'hard') expect(used).not.toContain('fact')
         if (puzzle.level === 'easy') {
            expect(used).not.toContain('pow')
            expect(used).not.toContain('sqrt')
         }
      }
   )

   it('devolve null quando não há conta possível', () => {
      expect(
         solvePuzzle({ target: 7, digit: 1, count: 2, level: 'easy' })
      ).toBeNull()
   })
})

describe('maskSolution', () => {
   it('mostra o começo da conta e esconde o resto', () => {
      const row: Row = [d(9), op('+'), { k: 'frac', num: [d(9)], den: [d(9)] }]
      expect(maskSolution(row)).toEqual([d(9), op('+'), { k: 'hole' }])
   })

   it('prefere cortar numa soma a cortar numa multiplicação', () => {
      const row: Row = [d(4), op('*'), d(4), op('-'), d(4)]
      expect(toText(maskSolution(row))).toBe('4 vezes 4 menos  alguma coisa ')
   })

   it('esconde o denominador, o expoente ou o miolo quando não há operador solto', () => {
      expect(
         maskSolution([{ k: 'frac', num: [d(8), d(8)], den: [d(8)] }])
      ).toEqual([{ k: 'frac', num: [d(8), d(8)], den: [{ k: 'hole' }] }])
      expect(maskSolution([d(2), { k: 'pow', exp: [d(2), d(2)] }])).toEqual([
         d(2),
         { k: 'pow', exp: [{ k: 'hole' }] },
      ])
      expect(
         maskSolution([
            { k: 'group', body: [d(3), op('+'), d(3)] },
            { k: 'fact' },
         ])
      ).toEqual([
         { k: 'group', body: [d(3), op('+'), { k: 'hole' }] },
         { k: 'fact' },
      ])
   })

   it('nunca entrega a solução inteira', () => {
      for (const level of Object.keys(MOCK_DB) as Level[])
         for (const [target, digit, count] of MOCK_DB[level]) {
            const hint = maskSolution(
               solvePuzzle({ target, digit, count, level })!
            )
            expect(kinds(hint)).toContain('hole')
            expect(countDigits(hint)).toBeLessThan(count)
         }
   })
})
