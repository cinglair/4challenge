import type { Dispatch, KeyboardEvent, RefObject } from 'react'

import type { Puzzle } from '../services/models'
import type { GameAction, Key } from '../types'
import { KEYBOARD } from '../utils'

interface UseChallengeInputParams {
   puzzle: Puzzle | null
   dispatch: Dispatch<GameAction>
   editorRef: RefObject<HTMLDivElement | null>
}

/** Liga o teclado da tela e o teclado físico às ações do jogo. */
export function useChallengeInput({
   puzzle,
   dispatch,
   editorRef,
}: UseChallengeInputParams) {
   const press = (key: Key) => {
      if (puzzle) dispatch({ type: 'key', key, puzzle })
   }

   const tap = (key: Key) => {
      press(key)
      editorRef.current?.focus({ preventScroll: true }) // o teclado físico continua valendo
   }

   const onKeyDown = (e: KeyboardEvent) => {
      if (!puzzle || e.metaKey || e.ctrlKey || e.altKey) return
      if (/^[0-9]$/.test(e.key)) {
         e.preventDefault()
         if (Number(e.key) === puzzle.digit) press('digit')
         else dispatch({ type: 'wrongDigit', puzzle })
         return
      }
      const key = KEYBOARD[e.key]
      if (key) {
         e.preventDefault()
         press(key)
      }
   }

   return { press, tap, onKeyDown }
}
