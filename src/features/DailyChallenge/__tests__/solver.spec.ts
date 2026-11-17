import { describe, expect, it } from 'vitest'

import { MOCK_DB } from '../mocks/daily-puzzles'
import type { Level } from '../services/models'
import type { MathNode, Row } from '../types'
import {
   countDigits,
   evaluate,
   hintBudget,
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
   const HOLE: MathNode = { k: 'hole' }

   it('mostra um pedaço da conta e esconde o resto', () => {
      const row: Row = [d(9), op('+'), { k: 'frac', num: [d(9)], den: [d(9)] }]
      expect(maskSolution(row)).toEqual([d(9), op('+'), HOLE])
   })

   it('mostra a parcela que cabe na dica, mesmo que não seja a primeira', () => {
      const row: Row = [d(4), op('*'), d(4), op('-'), d(4)]
      expect(toText(maskSolution(row))).toBe(' alguma coisa  menos 4')
   })

   it('junta as parcelas escondidas numa lacuna só', () => {
      // 5 + 5 + 5 + 5 + 5: a dica pode mostrar dois dos cinco algarismos
      const row: Row = [
         d(5),
         op('+'),
         d(5),
         op('+'),
         d(5),
         op('+'),
         d(5),
         op('+'),
         d(5),
      ]
      expect(maskSolution(row)).toEqual([d(5), op('+'), d(5), op('+'), HOLE])
   })

   it('num termo só, mostra a parte menor da estrutura', () => {
      expect(
         maskSolution([{ k: 'frac', num: [d(8), d(8)], den: [d(8)] }])
      ).toEqual([{ k: 'frac', num: [HOLE], den: [d(8)] }])
      expect(maskSolution([d(2), { k: 'pow', exp: [d(2), d(2)] }])).toEqual([
         d(2),
         { k: 'pow', exp: [HOLE] },
      ])
      expect(
         maskSolution([
            { k: 'group', body: [d(3), op('+'), d(3)] },
            { k: 'fact' },
         ])
      ).toEqual([{ k: 'group', body: [d(3), op('+'), HOLE] }, { k: 'fact' }])
   })

   it('não abre a estrutura de parcelas grandes que estão dentro de outra conta', () => {
      // (4⁴ − 44) / 4 → ▢ / 4, sem entregar a potência nem a subtração
      const row: Row = [
         {
            k: 'frac',
            num: [d(4), { k: 'pow', exp: [d(4)] }, op('-'), d(4), d(4)],
            den: [d(4)],
         },
      ]
      expect(maskSolution(row)).toEqual([
         { k: 'frac', num: [HOLE], den: [d(4)] },
      ])
   })

   it('entrega no máximo metade dos algarismos, e nunca só uma lacuna', () => {
      for (const level of Object.keys(MOCK_DB) as Level[])
         for (const [target, digit, count] of MOCK_DB[level]) {
            const hint = maskSolution(
               solvePuzzle({ target, digit, count, level })!
            )
            const label = `${level} ${target} (${count}×${digit}): ${toText(hint)}`
            expect(kinds(hint), label).toContain('hole')
            expect(countDigits(hint), label).toBeLessThanOrEqual(
               hintBudget(count)
            )
            expect(countDigits(hint), label).toBeGreaterThan(0)
         }
   })
})
