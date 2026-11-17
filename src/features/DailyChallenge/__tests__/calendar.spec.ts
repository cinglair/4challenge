import { describe, expect, it } from 'vitest'

import {
   buildMonthGrid,
   compareMonth,
   dayProgress,
   emptyPlays,
   monthOf,
   shiftMonth,
} from '../utils'

describe('calendar', () => {
   it('monta o mês com as casas vazias antes do dia 1', () => {
      // 1º de novembro de 2026 cai num domingo; 1º de dezembro, numa terça.
      const november = buildMonthGrid({ year: 2026, month: 10 })
      expect(november[0]).toBe('2026-11-01')
      expect(november).toHaveLength(30)

      const december = buildMonthGrid({ year: 2026, month: 11 })
      expect(december.slice(0, 3)).toEqual([null, null, '2026-12-01'])
      expect(december.at(-1)).toBe('2026-12-31')
   })

   it('conta 29 dias em fevereiro de ano bissexto', () => {
      const days = buildMonthGrid({ year: 2028, month: 1 }).filter(Boolean)
      expect(days).toHaveLength(29)
   })

   it('lê o mês de uma data sem escorregar de fuso', () => {
      expect(monthOf('2026-03-01')).toEqual({ year: 2026, month: 2 })
      expect(monthOf('2026-12-31')).toEqual({ year: 2026, month: 11 })
   })

   it('anda entre meses atravessando a virada do ano', () => {
      expect(shiftMonth({ year: 2026, month: 0 }, -1)).toEqual({
         year: 2025,
         month: 11,
      })
      expect(shiftMonth({ year: 2026, month: 11 }, 1)).toEqual({
         year: 2027,
         month: 0,
      })
      expect(
         compareMonth({ year: 2026, month: 0 }, { year: 2025, month: 11 })
      ).toBe(1)
   })

   it('resume o progresso de um dia', () => {
      const plays = emptyPlays()
      expect(dayProgress(null)).toBe('none')
      expect(dayProgress(plays)).toBe('none')
      plays.easy.solved = true
      expect(dayProgress(plays)).toBe('partial')
      plays.medium.solved = true
      plays.hard.solved = true
      expect(dayProgress(plays)).toBe('done')
   })
})
