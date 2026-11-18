import { useEffect, useSyncExternalStore } from 'react'

import { SITE_NAME, SITE_URL, normalizePath } from '../site'

/* Roteador mínimo sobre a History API: o site tem poucas páginas, todas estáticas. */

const listeners = new Set<() => void>()

function subscribe(listener: () => void) {
   listeners.add(listener)
   window.addEventListener('popstate', listener)
   return () => {
      listeners.delete(listener)
      window.removeEventListener('popstate', listener)
   }
}

/** Vai para outra página do site sem recarregar. */
export function navigate(to: string, { replace = false } = {}) {
   if (normalizePath(to) === normalizePath(window.location.pathname)) return
   window.history[replace ? 'replaceState' : 'pushState'](null, '', to)
   window.scrollTo(0, 0)
   listeners.forEach((listener) => listener())
}

/** Caminho atual, sempre terminado em "/". */
export function usePathname(): string {
   return normalizePath(
      useSyncExternalStore(subscribe, () => window.location.pathname)
   )
}

interface DocumentHead {
   /** Título da página; o nome do site é acrescentado, a não ser em `fullTitle`. */
   title: string
   fullTitle?: boolean
   description: string
   path: string
}

function setMeta(selector: string, attribute: string, value: string) {
   document.head.querySelector(selector)?.setAttribute(attribute, value)
}

/** Mantém título, descrição e URL canônica em dia ao navegar dentro do app. */
export function useDocumentHead({
   title,
   fullTitle = false,
   description,
   path,
}: DocumentHead) {
   useEffect(() => {
      const text = fullTitle ? title : `${title} — ${SITE_NAME}`
      const url = SITE_URL + path
      document.title = text
      setMeta('meta[name="description"]', 'content', description)
      setMeta('link[rel="canonical"]', 'href', url)
      setMeta('meta[property="og:title"]', 'content', text)
      setMeta('meta[property="og:description"]', 'content', description)
      setMeta('meta[property="og:url"]', 'content', url)
      setMeta('meta[name="twitter:title"]', 'content', text)
      setMeta('meta[name="twitter:description"]', 'content', description)
   }, [title, fullTitle, description, path])
}
