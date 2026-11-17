import { describe, expect, it } from 'vitest'

import { MOCK_DB } from '../mocks/daily-puzzles'
import type { Level } from '../services/models'
import type { MathNode, Row } from '../types'
import {
   countDigits,
   evaluate,
   hintDigits,
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
   const MORE: MathNode = { k: 'more' }

   it('mostra o começo da conta e termina em reticências', () => {
      const row: Row = [d(9), op('+'), { k: 'frac', num: [d(9)], den: [d(9)] }]
      expect(maskSolution(row)).toEqual([d(9), op('+'), MORE])
      expect(toText(maskSolution(row))).toBe('9 mais  …')
   })

   it('mostra metade dos algarismos e os sinais até o próximo', () => {
      // 5 + 5 + 5 + 5 + 5 → 5 + 5 + …
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
      expect(maskSolution(row)).toEqual([d(5), op('+'), d(5), op('+'), MORE])
   })

   it('corta no meio de um número, como em qualquer começo de conta', () => {
      // 555 / 5 + 5 → 55…
      const row: Row = [
         { k: 'frac', num: [d(5), d(5), d(5)], den: [d(5)] },
         op('+'),
         d(5),
      ]
      expect(maskSolution(row)).toEqual([d(5), d(5), MORE])
   })

   it('não mostra a barra da fração quando corta no numerador', () => {
      // (4⁴ − 44) / 4 → 4⁴ − …
      const row: Row = [
         {
            k: 'frac',
            num: [d(4), { k: 'pow', exp: [d(4)] }, op('-'), d(4), d(4)],
            den: [d(4)],
         },
      ]
      expect(maskSolution(row)).toEqual([
         d(4),
         { k: 'pow', exp: [d(4)] },
         op('-'),
         MORE,
      ])
   })

   it('mostra a barra quando o numerador já passou inteiro', () => {
      // 88 / (8 + 8) → 88 / …
      const row: Row = [
         { k: 'frac', num: [d(8), d(8)], den: [d(8), op('+'), d(8)] },
      ]
      expect(maskSolution(row)).toEqual([
         { k: 'frac', num: [d(8), d(8)], den: [MORE] },
      ])
   })

   it('deixa aberto o parêntese que ainda não fechou', () => {
      // ((1 + 1 + 1)! − 1)! − 1 → ((1 + 1 + …
      const inner: MathNode = {
         k: 'group',
         body: [d(1), op('+'), d(1), op('+'), d(1)],
      }
      const row: Row = [
         { k: 'group', body: [inner, { k: 'fact' }, op('-'), d(1)] },
         { k: 'fact' },
         op('-'),
         d(1),
      ]
      expect(maskSolution(row)).toEqual([
         {
            k: 'group',
            open: true,
            body: [
               {
                  k: 'group',
                  open: true,
                  body: [d(1), op('+'), d(1), op('+'), MORE],
               },
            ],
         },
      ])
   })

   it('mantém a raiz e o expoente em que o corte caiu', () => {
      // √(8 + 8) + 8 → √(8 + …
      expect(
         maskSolution([
            { k: 'sqrt', body: [d(8), op('+'), d(8)] },
            op('+'),
            d(8),
         ])
      ).toEqual([{ k: 'sqrt', body: [d(8), op('+'), MORE] }])
      // 2^(2 + 2) → 2^(…
      expect(
         maskSolution([d(2), { k: 'pow', exp: [d(2), op('+'), d(2)] }])
      ).toEqual([d(2), { k: 'pow', exp: [MORE] }])
   })

   it('em todo desafio mostra metade dos algarismos e só umas reticências, no fim', () => {
      // ordem de leitura, descendo nas partes de cada nó
      const flat = (row: Row): MathNode[] =>
         row.flatMap((n) => [
            ...('num' in n ? [...flat(n.num), n, ...flat(n.den)] : []),
            ...('exp' in n ? [n, ...flat(n.exp)] : []),
            ...('body' in n ? [n, ...flat(n.body)] : []),
            ...('num' in n || 'exp' in n || 'body' in n ? [] : [n]),
         ])

      for (const level of Object.keys(MOCK_DB) as Level[])
         for (const [target, digit, count] of MOCK_DB[level]) {
            const hint = maskSolution(
               solvePuzzle({ target, digit, count, level })!
            )
            const label = `${level} ${target} (${count}×${digit}): ${toText(hint)}`
            const tokens = flat(hint)

            expect(countDigits(hint), label).toBe(hintDigits(count))
            expect(
               tokens.filter((n) => n.k === 'more'),
               label
            ).toHaveLength(1)
            expect(tokens.at(-1), label).toEqual(MORE)
         }
   })
})
