/*
 * Dados do site usados pelo app e pela pré-renderização (scripts/prerender.mjs).
 * Este arquivo e o `pages.ts` rodam também no Node, sem o Vite: só imports
 * relativos e nada de `import.meta.env`.
 */

export const SITE_URL = 'https://algarism.io'
export const SITE_NAME = 'algarism.io'
export const SITE_TAGLINE = 'o desafio diário dos algarismos'
export const SITE_DESCRIPTION =
   'Um desafio de matemática por dia: forme o número-alvo usando um único algarismo.'
/** E-mail público de contato (páginas Contato, Privacidade e Termos). */
export const CONTACT_EMAIL = 'cinglair.llo@gmail.com'

/** Caminhos das páginas; todos terminam em "/" (é assim que os arquivos são servidos). */
export const ROUTES = {
   home: '/',
   archive: '/arquivo/',
   about: '/sobre/',
   privacy: '/privacidade/',
   terms: '/termos/',
   contact: '/contato/',
   challenge: (date: string) => `/desafio/${date}/`,
} as const

/** Links do rodapé, na ordem em que aparecem. */
export const SITE_NAV = [
   { to: ROUTES.home, label: 'Desafio de hoje' },
   { to: ROUTES.archive, label: 'Todos os desafios' },
   { to: ROUTES.about, label: 'Sobre' },
   { to: ROUTES.privacy, label: 'Privacidade' },
   { to: ROUTES.terms, label: 'Termos' },
   { to: ROUTES.contact, label: 'Contato' },
] as const

/** "/sobre" e "/sobre/" são a mesma página. */
export const normalizePath = (path: string) =>
   path.endsWith('/') ? path : path + '/'

const CHALLENGE_PATH = /^\/desafio\/(\d{4}-\d{2}-\d{2})\/$/

/** A data (AAAA-MM-DD) de um caminho "/desafio/AAAA-MM-DD/", ou `null`. */
export function challengeDateOf(path: string): string | null {
   const iso = CHALLENGE_PATH.exec(normalizePath(path))?.[1]
   if (!iso) return null
   const [y, m, d] = iso.split('-').map(Number)
   const date = new Date(Date.UTC(y, m - 1, d))
   // recusa datas que não existem, como 2026-02-31
   return date.getUTCMonth() === m - 1 && date.getUTCDate() === d ? iso : null
}

/** Ex.: "17 de novembro de 2026" (não depende do fuso de quem lê). */
export function formatLongDate(iso: string): string {
   const [y, m, d] = iso.split('-').map(Number)
   return new Intl.DateTimeFormat('pt-BR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      timeZone: 'UTC',
   }).format(new Date(Date.UTC(y, m - 1, d)))
}

/** Soma dias a uma data AAAA-MM-DD. */
export function shiftISODate(iso: string, days: number): string {
   const [y, m, d] = iso.split('-').map(Number)
   return new Date(Date.UTC(y, m - 1, d + days)).toISOString().slice(0, 10)
}

export * from './pages'
