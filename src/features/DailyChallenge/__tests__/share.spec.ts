import { describe, expect, it } from 'vitest'

import { buildShareText } from '../utils'

describe('buildShareText', () => {
   it('diz o nível e o dia e convida a tentar', () => {
      expect(buildShareText('hard', '2026-11-17')).toBe(
         'Resolvi o desafio Difícil do dia 17 de novembro no algarism.io 🦉 Você consegue?\nhttps://algarism.io'
      )
      expect(buildShareText('easy', '2026-03-01')).toContain(
         'desafio Fácil do dia 1 de março'
      )
   })

   it('não leva nada da conta: só nível, dia e o endereço', () => {
      const text = buildShareText('medium', '2026-11-17')
      expect(text).not.toMatch(/[+\-×÷=√!^]/)
      // os únicos números são o dia do mês
      expect(text.match(/\d+/g)).toEqual(['17'])
   })
})
