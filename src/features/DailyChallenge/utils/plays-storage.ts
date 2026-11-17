import type { Plays } from '../types'

/* Progresso do dia guardado no navegador (troque por sua API de usuário). */

export const emptyPlays = (): Plays => ({
   easy: { root: [], solved: false, tries: 0 },
   medium: { root: [], solved: false, tries: 0 },
   hard: { root: [], solved: false, tries: 0 },
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
