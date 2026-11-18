import { localISODate, parseISODate } from '@/src/shared'

import type { Plays } from '../types'
import { FIRST_PUZZLE_DATE } from './constants'

/** Um mês do calendário; `month` vai de 0 (janeiro) a 11. */
export interface MonthRef {
   year: number
   month: number
}

export const WEEKDAYS = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S']

export function monthOf(iso: string): MonthRef {
   const d = parseISODate(iso)
   return { year: d.getFullYear(), month: d.getMonth() }
}

export function shiftMonth({ year, month }: MonthRef, delta: number): MonthRef {
   const d = new Date(year, month + delta, 1)
   return { year: d.getFullYear(), month: d.getMonth() }
}

/** Negativo se `a` vem antes de `b`, zero se é o mesmo mês. */
export const compareMonth = (a: MonthRef, b: MonthRef) =>
   (a.year - b.year) * 12 + (a.month - b.month)

/**
 * Dias do mês em AAAA-MM-DD, com `null` nas casas vazias antes do dia 1
 * (a semana começa no domingo).
 */
export function buildMonthGrid({
   year,
   month,
}: MonthRef): Array<string | null> {
   const blanks = new Date(year, month, 1).getDay()
   const days = new Date(year, month + 1, 0).getDate()
   return [
      ...Array.from({ length: blanks }, () => null),
      ...Array.from({ length: days }, (_, i) =>
         localISODate(new Date(year, month, i + 1))
      ),
   ]
}

/** Ex.: "novembro de 2026". */
export function formatMonthLabel({ year, month }: MonthRef): string {
   return new Intl.DateTimeFormat('pt-BR', {
      month: 'long',
      year: 'numeric',
   }).format(new Date(year, month, 1))
}

export type DayProgress = 'none' | 'partial' | 'done'

/** Quanto do dia já foi resolvido, a partir do progresso guardado. */
export function dayProgress(plays: Plays | null): DayProgress {
   if (!plays) return 'none'
   const solved = Object.values(plays).filter((p) => p.solved).length
   if (solved === 0) return 'none'
   return solved === Object.keys(plays).length ? 'done' : 'partial'
}

/** O dia tem desafio liberado: do primeiro dia do banco até hoje. */
export const isPlayableDate = (date: string, today: string) =>
   date >= FIRST_PUZZLE_DATE && date <= today
