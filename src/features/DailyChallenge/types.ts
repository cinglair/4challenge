import type { Level, Puzzle } from './services/models'

/** A expressão é uma árvore: cada linha (Row) é uma lista de nós. */
export type MathNode =
   | { k: 'digit'; v: number }
   | { k: 'op'; v: '+' | '-' | '*' }
   | { k: 'fact' }
   | { k: 'frac'; num: Row; den: Row }
   | { k: 'pow'; exp: Row } // expoente do termo imediatamente anterior
   | { k: 'sqrt'; body: Row }
   | { k: 'group'; body: Row } // parênteses
   // lacuna de uma dica (um algarismo ou um sinal escondido); nunca entra na conta do jogador
   | { k: 'hole'; of: 'digit' | 'sign' }
export type Row = MathNode[]

export type Slot = 'num' | 'den' | 'exp' | 'body'
export interface Step {
   i: number
   slot: Slot
}
/** Caminho da raiz até uma linha + posição dentro dela. */
export interface Cursor {
   path: Step[]
   index: number
}

export interface Doc {
   root: Row
   cursor: Cursor
}

export type Key =
   | 'digit'
   | '+'
   | '-'
   | '*'
   | 'frac'
   | 'group'
   | 'close'
   | 'pow'
   | 'sqrt'
   | 'fact'
   | 'left'
   | 'right'
   | 'up'
   | 'down'
   | 'del'
   | 'clear'
   | 'check'

export interface Play {
   root: Row
   solved: boolean
   tries: number
   /** A dica deste nível está à mostra. */
   hinted: boolean
}
export type Plays = Record<Level, Play>

export interface Note {
   text: string
   tone: 'bad' | 'info'
   stamp: number // muda a cada aviso, para repetir a animação
}

export interface Game {
   level: Level
   plays: Plays
   cursor: Cursor
   note: Note | null
   /** Acabou de acertar o nível em jogo (dispara a comemoração). */
   celebrating: boolean
}

export type GameAction =
   | { type: 'level'; level: Level }
   | { type: 'place'; cursor: Cursor }
   | { type: 'hint' }
   | { type: 'key'; key: Key; puzzle: Puzzle }
   | { type: 'wrongDigit'; puzzle: Puzzle }

export type Evaluation =
   { ok: true; value: number } | { ok: false; error: string }
