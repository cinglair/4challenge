import type { Row } from '../types'
import { COUNT_WORD } from './constants'

export function formatValue(v: number): string {
   const near = Math.round(v)
   if (Math.abs(v - near) < 1e-9) return '= ' + near.toLocaleString('pt-BR')
   return '≈ ' + v.toLocaleString('pt-BR', { maximumFractionDigits: 3 })
}

/** "quatro" para 4; cai no próprio número fora da tabela. */
export const countWord = (count: number): string | number =>
   COUNT_WORD[count] ?? count

/** Versão em texto corrido, para leitores de tela. */
export function toText(row: Row): string {
   return row
      .map((n): string => {
         switch (n.k) {
            case 'digit':
               return String(n.v)
            case 'op':
               return n.v === '+'
                  ? ' mais '
                  : n.v === '-'
                    ? ' menos '
                    : ' vezes '
            case 'fact':
               return ' fatorial'
            case 'frac':
               return ` (${toText(n.num)}) sobre (${toText(n.den)}) `
            case 'pow':
               return ` elevado a (${toText(n.exp)}) `
            case 'sqrt':
               return ` raiz de (${toText(n.body)}) `
            case 'group':
               return ` (${toText(n.body)}) `
            case 'hole':
               return ' alguma coisa '
         }
      })
      .join('')
}

/** Ex.: "terça-feira, 17 de novembro". */
export function formatDateLabel(date: Date): string {
   return new Intl.DateTimeFormat('pt-BR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
   }).format(date)
}
