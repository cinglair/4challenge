import type { Plays } from '../types'

/* Progresso do dia guardado no navegador, inclusive se a dica foi pedida. */

export const emptyPlays = (): Plays => ({
   easy: { root: [], solved: false, tries: 0, hinted: false },
   medium: { root: [], solved: false, tries: 0, hinted: false },
   hard: { root: [], solved: false, tries: 0, hinted: false },
})

const storeKey = (date: string) => `algarismos:v1:${date}`

export function loadPlays(date: string): Plays | null {
   try {
      const raw = localStorage.getItem(storeKey(date))
      return raw ? { ...emptyPlays(), ...(JSON.parse(raw) as Plays) } : null
   } catch {
      return null
   }
}

export function savePlays(date: string, plays: Plays) {
   try {
      localStorage.setItem(storeKey(date), JSON.stringify(plays))
   } catch {
      /* sem armazenamento: o jogo segue só em memória */
   }
}
