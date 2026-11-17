import { describe, expect, it } from 'vitest'

import type { MathNode, Row } from '../types'
import { evaluate } from '../utils'

const d = (v: number): MathNode => ({ k: 'digit', v })
const op = (v: '+' | '-' | '*'): MathNode => ({ k: 'op', v })

const valueOf = (row: Row) => {
   const res = evaluate(row)
   if (!res.ok) throw new Error(res.error)
   return res.value
}
const errorOf = (row: Row) => {
   const res = evaluate(row)
   return res.ok ? null : res.error
}

describe('evaluate', () => {
   it('junta algarismos vizinhos em um número', () => {
      expect(valueOf([d(7), d(7)])).toBe(77)
   })

   it('respeita a precedência de × sobre + e −', () => {
      expect(valueOf([d(4), op('+'), d(4), op('*'), d(4)])).toBe(20)
      expect(valueOf([d(4), op('-'), d(4), op('*'), d(4)])).toBe(-12)
   })

   it('avalia fração, potência, raiz e fatorial', () => {
      expect(valueOf([{ k: 'frac', num: [d(8), d(8)], den: [d(8)] }])).toBe(11)
      expect(valueOf([d(2), { k: 'pow', exp: [d(2), d(2)] }])).toBe(2 ** 22)
      expect(valueOf([{ k: 'sqrt', body: [d(9)] }])).toBe(3)
      expect(valueOf([d(5), { k: 'fact' }])).toBe(120)
   })

   it('aplica fatorial e potência antes do menos unário', () => {
      expect(valueOf([op('-'), d(3), { k: 'fact' }])).toBe(-6)
      expect(valueOf([op('-'), d(2), { k: 'pow', exp: [d(2)] }])).toBe(-4)
   })

   it('aceita multiplicação implícita ao lado de parênteses e raiz', () => {
      const group: MathNode = { k: 'group', body: [d(3), op('+'), d(3)] }
      expect(valueOf([d(3), group])).toBe(18)
      expect(valueOf([group, d(3)])).toBe(18)
      expect(valueOf([d(4), { k: 'sqrt', body: [d(4)] }])).toBe(8)
   })

   it('resolve um desafio do nível difícil: 5! + 5 + 5 + (5 − 5/5)… = 132', () => {
      // 5! + 5 + 5 + … com quatro 5: 5! + (55 + 5)/5 = 132
      const row: Row = [
         d(5),
         { k: 'fact' },
         op('+'),
         { k: 'frac', num: [d(5), d(5), op('+'), d(5)], den: [d(5)] },
      ]
      expect(valueOf(row)).toBe(132)
   })

   it('explica o que há de errado na conta', () => {
      expect(errorOf([])).toBe('Ainda há um espaço vazio na conta.')
      expect(errorOf([d(1), op('+')])).toBe('A conta termina em um operador.')
      expect(errorOf([d(1), op('+'), op('*'), d(1)])).toBe(
         'Há dois operadores seguidos.'
      )
      expect(errorOf([{ k: 'frac', num: [d(1)], den: [d(0)] }])).toBe(
         'Divisão por zero.'
      )
      expect(errorOf([{ k: 'pow', exp: [d(2)] }])).toBe(
         'Falta a base da potência.'
      )
      expect(
         errorOf([{ k: 'frac', num: [d(1)], den: [d(2)] }, { k: 'fact' }])
      ).toBe('Fatorial só vale para inteiros a partir de zero.')
      expect(errorOf([{ k: 'sqrt', body: [op('-'), d(4)] }])).toBe(
         'Não dá para tirar raiz de número negativo.'
      )
   })
})
