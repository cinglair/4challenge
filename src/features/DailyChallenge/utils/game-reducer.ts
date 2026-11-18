import type {
   Cursor,
   Doc,
   Game,
   GameAction,
   Note,
   Play,
   Plays,
} from '../types'
import { LOCKED_NOTE, NEEDS, RANK } from './constants'
import { evaluate, isTarget } from './evaluate'
import {
   backspace,
   closeGroup,
   countDigits,
   endCursor,
   insertNode,
   moveLeft,
   moveRight,
   moveVertical,
} from './expression-tree'
import { countWord, formatValue } from './format'

let stamp = 0
const note = (text: string, tone: Note['tone'] = 'bad'): Note => ({
   text,
   tone,
   stamp: ++stamp,
})

/** Nível encerrado: resolvido ou com a solução à mostra. Não aceita mais jogadas. */
export const isClosed = (play: Play) => play.solved || !!play.revealed

export function createInitialGame(plays: Plays): Game {
   return {
      level: 'easy',
      plays,
      cursor: endCursor(plays.easy.root),
      note: null,
      celebrating: false,
   }
}

export function gameReducer(g: Game, a: GameAction): Game {
   switch (a.type) {
      case 'level':
         return {
            ...g,
            level: a.level,
            cursor: endCursor(g.plays[a.level].root),
            note: null,
            celebrating: false,
         }
      case 'place':
         return isClosed(g.plays[g.level]) ? g : { ...g, cursor: a.cursor }
      case 'hint': {
         const play = g.plays[g.level]
         if (isClosed(play)) return g
         return {
            ...g,
            plays: {
               ...g.plays,
               [g.level]: { ...play, hinted: !play.hinted, usedHint: true },
            },
            note: null,
         }
      }
      case 'reveal': {
         // desistiu: fica guardado como não resolvido, com a solução à mostra
         const play = g.plays[g.level]
         if (isClosed(play)) return g
         return {
            ...g,
            plays: {
               ...g.plays,
               [g.level]: { ...play, hinted: false, revealed: true },
            },
            note: null,
         }
      }
      case 'wrongDigit':
         return isClosed(g.plays[g.level])
            ? g
            : { ...g, note: note(`Neste desafio só vale o ${a.puzzle.digit}.`) }
      case 'key': {
         const play = g.plays[g.level]
         if (isClosed(play)) return g
         const needs = NEEDS[a.key]
         if (needs && RANK[g.level] < RANK[needs])
            return { ...g, note: note(LOCKED_NOTE[needs], 'info') }

         const doc: Doc = { root: play.root, cursor: g.cursor }
         const edit = (next: Doc): Game => ({
            ...g,
            plays: { ...g.plays, [g.level]: { ...play, root: next.root } },
            cursor: next.cursor,
            note: null,
         })
         const move = (cursor: Cursor): Game => ({ ...g, cursor })

         switch (a.key) {
            case 'digit':
               return edit(insertNode(doc, { k: 'digit', v: a.puzzle.digit }))
            case '+':
            case '-':
            case '*':
               return edit(insertNode(doc, { k: 'op', v: a.key }))
            case 'frac':
               return edit(insertNode(doc, { k: 'frac', num: [], den: [] }))
            case 'group':
               return edit(insertNode(doc, { k: 'group', body: [] }))
            case 'pow':
               return edit(insertNode(doc, { k: 'pow', exp: [] }))
            case 'sqrt':
               return edit(insertNode(doc, { k: 'sqrt', body: [] }))
            case 'fact':
               return edit(insertNode(doc, { k: 'fact' }))
            case 'del':
               return edit(backspace(doc))
            case 'clear':
               return edit({ root: [], cursor: { path: [], index: 0 } })
            case 'left':
               return move(moveLeft(doc))
            case 'right':
               return move(moveRight(doc))
            case 'up':
               return move(moveVertical(doc, 'up'))
            case 'down':
               return move(moveVertical(doc, 'down'))
            case 'close':
               return move(closeGroup(doc))
            case 'check': {
               const { target, digit, count } = a.puzzle
               if (!play.root.length)
                  return {
                     ...g,
                     note: note('Monte uma conta antes de conferir.', 'info'),
                  }
               const tried = (n: Note): Game => ({
                  ...g,
                  plays: {
                     ...g.plays,
                     [g.level]: { ...play, tries: play.tries + 1 },
                  },
                  note: n,
               })
               const res = evaluate(play.root)
               if (!res.ok) return { ...g, note: note(res.error) }
               const used = countDigits(play.root)
               if (used !== count)
                  return tried(
                     note(
                        `Use exatamente ${countWord(count)} algarismos ${digit}. Você usou ${used}.`
                     )
                  )
               if (!isTarget(res.value, target))
                  return tried(
                     note(
                        `Essa conta dá ${formatValue(res.value).slice(2)}. O alvo é ${target}.`
                     )
                  )
               return {
                  ...g,
                  plays: {
                     ...g.plays,
                     [g.level]: {
                        ...play,
                        solved: true,
                        tries: play.tries + 1,
                     },
                  },
                  note: null,
                  celebrating: true,
               }
            }
         }
      }
   }
}
