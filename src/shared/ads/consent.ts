import { useSyncExternalStore } from 'react'

/*
 * Anúncios (Google AdSense) e o consentimento de cookies que eles exigem.
 * Sem `VITE_ADSENSE_CLIENT` nada disto aparece: o site não usa cookies e o
 * aviso de consentimento não tem por que existir.
 */

/** Identificador do editor no AdSense, no formato "ca-pub-0000000000000000". */
export const ADSENSE_CLIENT = import.meta.env.VITE_ADSENSE_CLIENT || ''
/** Bloco de anúncio exibido abaixo do jogo. */
export const ADSENSE_SLOT = import.meta.env.VITE_ADSENSE_SLOT || ''
export const adsEnabled = ADSENSE_CLIENT !== ''

export type Consent = 'granted' | 'denied' | null

const STORE_KEY = 'algarismos:consent'
const listeners = new Set<() => void>()

function readConsent(): Consent {
   try {
      const value = localStorage.getItem(STORE_KEY)
      return value === 'granted' || value === 'denied' ? value : null
   } catch {
      return null
   }
}

/** Guarda a escolha; `null` apaga, e o aviso volta a aparecer. */
export function setConsent(consent: Consent) {
   try {
      if (consent) localStorage.setItem(STORE_KEY, consent)
      else localStorage.removeItem(STORE_KEY)
   } catch {
      /* sem armazenamento: a escolha vale só até recarregar */
   }
   current = consent
   listeners.forEach((listener) => listener())
}

let current = readConsent()

function subscribe(listener: () => void) {
   listeners.add(listener)
   return () => {
      listeners.delete(listener)
   }
}

export function useConsent(): Consent {
   return useSyncExternalStore(subscribe, () => current)
}
