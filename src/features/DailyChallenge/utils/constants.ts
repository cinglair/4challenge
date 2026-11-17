import type { Level } from '../services/models'
import type { Key } from '../types'

export const LEVELS: Array<{ id: Level; label: string; hue: number }> = [
   { id: 'easy', label: 'Fácil', hue: 165 },
   { id: 'medium', label: 'Médio', hue: 85 },
   { id: 'hard', label: 'Difícil', hue: 25 },
]

/** Primeiro dia com desafios no banco (AAAA-MM-DD). */
export const FIRST_PUZZLE_DATE = '2026-11-01'

export const RANK: Record<Level, number> = { easy: 0, medium: 1, hard: 2 }

export const COUNT_WORD: Record<number, string> = {
   2: 'dois',
   3: 'três',
   4: 'quatro',
   5: 'cinco',
   6: 'seis',
}

/** Nível mínimo em que cada tecla é liberada. */
export const NEEDS: Partial<Record<Key, Level>> = {
   pow: 'medium',
   sqrt: 'medium',
   fact: 'hard',
}

export const LOCKED_NOTE: Record<Level, string> = {
   easy: '',
   medium: 'Potência e raiz entram no nível Médio.',
   hard: 'O fatorial entra no nível Difícil.',
}

export const OP_GLYPH = { '+': '+', '-': '−', '*': '×' } as const

export const PAD: Array<{ key: Key; label: string; text?: string }> = [
   { key: 'digit', label: 'Algarismo' },
   { key: '+', label: 'Mais', text: '+' },
   { key: '-', label: 'Menos', text: '−' },
   { key: '*', label: 'Vezes', text: '×' },
   { key: 'frac', label: 'Fração' },
   { key: 'group', label: 'Parênteses', text: '( )' },
   { key: 'pow', label: 'Potência' },
   { key: 'sqrt', label: 'Raiz quadrada' },
   { key: 'fact', label: 'Fatorial', text: '!' },
   { key: 'left', label: 'Cursor para a esquerda' },
   { key: 'right', label: 'Cursor para a direita' },
   { key: 'del', label: 'Apagar' },
]

/** Teclado físico → tecla do jogo. */
export const KEYBOARD: Record<string, Key> = {
   '+': '+',
   '-': '-',
   '*': '*',
   x: '*',
   X: '*',
   '/': 'frac',
   '(': 'group',
   ')': 'close',
   '^': 'pow',
   r: 'sqrt',
   R: 'sqrt',
   '!': 'fact',
   ArrowLeft: 'left',
   ArrowRight: 'right',
   ArrowUp: 'up',
   ArrowDown: 'down',
   Backspace: 'del',
   Enter: 'check',
   '=': 'check',
}
