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
   const DIGIT: MathNode = { k: 'hole', of: 'digit' }
   const SIGN: MathNode = { k: 'hole', of: 'sign' }
   const SIGNS = ['op', 'fact', 'frac', 'pow', 'sqrt']
   const count = (row: Row, pick: (n: MathNode) => boolean): number =>
      row.reduce(
         (sum, n) =>
            sum +
            (pick(n) ? 1 : 0) +
            ('num' in n ? count(n.num, pick) + count(n.den, pick) : 0) +
            ('exp' in n ? count(n.exp, pick) : 0) +
            ('body' in n ? count(n.body, pick) : 0),
         0
      )

   it('esconde um sim, um não: algarismos a partir do 2º, sinais a partir do 1º', () => {
      const row: Row = [d(9), op('+'), { k: 'frac', num: [d(9)], den: [d(9)] }]
      expect(maskSolution(row)).toEqual([
         d(9),
         SIGN,
         { k: 'frac', num: [DIGIT], den: [d(9)] },
      ])
      expect(toText(maskSolution(row))).toBe(
         '9 algum sinal  ( um algarismo ) sobre (9) '
      )
   })

   it('mantém o formato da conta com somas e produtos', () => {
      const row: Row = [d(4), op('*'), d(4), op('-'), d(4)]
      expect(maskSolution(row)).toEqual([d(4), SIGN, DIGIT, op('-'), d(4)])
   })

   it('desmonta em linha a fração, a potência e a raiz escondidas', () => {
      expect(
         maskSolution([{ k: 'frac', num: [d(8), d(8)], den: [d(8)] }])
      ).toEqual([d(8), DIGIT, SIGN, d(8)])
      expect(maskSolution([d(2), { k: 'pow', exp: [d(2), d(2)] }])).toEqual([
         d(2),
         SIGN,
         DIGIT,
         d(2),
      ])
      expect(
         maskSolution([{ k: 'sqrt', body: [d(9)] }, op('+'), d(9)])
      ).toEqual([SIGN, { k: 'group', body: [d(9)] }, op('+'), DIGIT])
   })

   it('põe parênteses no que não é um número só ao desmontar', () => {
      // 55 / (5 + 5): a fração é o 1º sinal na ordem de leitura, então é ela que some
      const row: Row = [
         { k: 'frac', num: [d(5), d(5)], den: [d(5), op('+'), d(5)] },
      ]
      expect(maskSolution(row)).toEqual([
         d(5),
         DIGIT,
         SIGN,
         { k: 'group', body: [d(5), op('+'), DIGIT] },
      ])
   })

   it('mantém a fração quando o sinal escondido é outro', () => {
      // (5 + 55) / 5: o 1º sinal é o +, a fração fica à mostra
      const row: Row = [
         { k: 'frac', num: [d(5), op('+'), d(5), d(5)], den: [d(5)] },
      ]
      expect(maskSolution(row)).toEqual([
         { k: 'frac', num: [d(5), SIGN, DIGIT, d(5)], den: [DIGIT] },
      ])
   })

   it('em todo desafio mostra metade dos algarismos e metade dos sinais', () => {
      for (const level of Object.keys(MOCK_DB) as Level[])
         for (const [target, digit, n] of MOCK_DB[level]) {
            const solution = solvePuzzle({ target, digit, count: n, level })!
            const hint = maskSolution(solution)
            const label = `${level} ${target} (${n}×${digit}): ${toText(hint)}`
            const signs = count(solution, (x) => SIGNS.includes(x.k))

            expect(countDigits(hint), label).toBe(Math.ceil(n / 2))
            expect(
               count(hint, (x) => x.k === 'hole' && x.of === 'digit'),
               label
            ).toBe(Math.floor(n / 2))
            expect(
               count(hint, (x) => SIGNS.includes(x.k)),
               label
            ).toBe(Math.floor(signs / 2))
            expect(
               count(hint, (x) => x.k === 'hole' && x.of === 'sign'),
               label
            ).toBe(Math.ceil(signs / 2))
         }
   })
})
