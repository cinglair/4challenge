import { describe, expect, it } from 'vitest'

import type { Puzzle } from '../services/models'
import type { Game, Key } from '../types'
import {
   countDigits,
   createInitialGame,
   emptyPlays,
   gameReducer,
   toText,
} from '../utils'

const puzzle: Puzzle = {
   id: '2026-01-01-easy',
   date: '2026-01-01',
   level: 'easy',
   target: 16,
   digit: 4,
   count: 4,
}

const type = (game: Game, keys: Key[]) =>
   keys.reduce((g, key) => gameReducer(g, { type: 'key', key, puzzle }), game)

const start = () => createInitialGame(emptyPlays())

describe('gameReducer', () => {
   it('resolve o desafio com a conta certa e conta a tentativa', () => {
      const g = type(start(), [
         'digit',
         '+',
         'digit',
         '+',
         'digit',
         '+',
         'digit',
         'check',
      ])
      expect(g.plays.easy).toMatchObject({ solved: true, tries: 1 })
      expect(g.note).toBeNull()
   })

   it('recusa a conta com a quantidade errada de algarismos', () => {
      const g = type(start(), ['digit', '*', 'digit', 'check'])
      expect(g.plays.easy).toMatchObject({ solved: false, tries: 1 })
      expect(g.note?.text).toBe(
         'Use exatamente quatro algarismos 4. Você usou 2.'
      )
   })

   it('recusa a conta que não dá o alvo', () => {
      const g = type(start(), [
         'digit',
         '+',
         'digit',
         '+',
         'digit',
         '-',
         'digit',
         'check',
      ])
      expect(g.plays.easy.solved).toBe(false)
      expect(g.note?.text).toBe('Essa conta dá 8. O alvo é 16.')
   })

   it('bloqueia teclas de níveis mais altos', () => {
      const g = type(start(), ['digit', 'pow', 'fact'])
      expect(g.plays.easy.root).toEqual([{ k: 'digit', v: 4 }])
      expect(g.note).toMatchObject({
         tone: 'info',
         text: 'O fatorial entra no nível Difícil.',
      })
   })

   it('a fração leva o termo à esquerda para o numerador', () => {
      const g = type(start(), ['digit', '+', 'digit', 'digit', 'frac', 'digit'])
      expect(toText(g.plays.easy.root)).toBe('4 mais  (44) sobre (4) ')
      expect(g.cursor.path).toEqual([{ i: 2, slot: 'den' }])
   })

   it('apagar no início de uma estrutura desfaz a estrutura e mantém o conteúdo', () => {
      let g = type(start(), ['group', 'digit', 'digit', 'left', 'left', 'del'])
      expect(g.plays.easy.root).toEqual([
         { k: 'digit', v: 4 },
         { k: 'digit', v: 4 },
      ])
      expect(g.cursor).toEqual({ path: [], index: 0 })
      g = type(g, ['clear'])
      expect(countDigits(g.plays.easy.root)).toBe(0)
   })

   it('não edita um desafio já resolvido', () => {
      const solved = type(start(), [
         'digit',
         '+',
         'digit',
         '+',
         'digit',
         '+',
         'digit',
         'check',
      ])
      expect(type(solved, ['del', 'clear'])).toBe(solved)
   })

   it('trocar de nível põe o cursor no fim da conta daquele nível', () => {
      const g = gameReducer(type(start(), ['digit', 'digit']), {
         type: 'level',
         level: 'hard',
      })
      expect(g.level).toBe('hard')
      expect(g.cursor).toEqual({ path: [], index: 0 })
   })
})
