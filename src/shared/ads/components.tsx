import { useEffect, useRef } from 'react'

import { Link } from '../router'
import { ROUTES } from '../site'
import {
   ADSENSE_CLIENT,
   ADSENSE_SLOT,
   adsEnabled,
   setConsent,
   useConsent,
} from './consent'

import './ads.css'

declare global {
   interface Window {
      adsbygoogle?: unknown[]
   }
}

const SCRIPT_ID = 'adsbygoogle-js'

function loadAdsScript() {
   if (document.getElementById(SCRIPT_ID)) return
   const script = document.createElement('script')
   script.id = SCRIPT_ID
   script.async = true
   script.crossOrigin = 'anonymous'
   script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`
   document.head.appendChild(script)
}

/** Aviso de cookies: só existe quando há anúncios e a pessoa ainda não escolheu. */
export function ConsentBanner() {
   const consent = useConsent()
   if (!adsEnabled || consent !== null) return null

   return (
      <aside className="consent" aria-label="Aviso de cookies">
         <p>
            Usamos cookies do Google para exibir anúncios, que ajudam a manter o
            jogo gratuito. Saiba mais na{' '}
            <Link to={ROUTES.privacy}>Política de Privacidade</Link>.
         </p>
         <div className="consent-actions">
            <button type="button" onClick={() => setConsent('denied')}>
               Recusar
            </button>
            <button
               type="button"
               className="consent-accept"
               onClick={() => setConsent('granted')}
            >
               Aceitar
            </button>
         </div>
      </aside>
   )
}

/** Reabre o aviso de cookies, para a pessoa mudar de ideia. */
export function CookiePreferencesButton() {
   if (!adsEnabled) return null
   return (
      <button type="button" onClick={() => setConsent(null)}>
         Preferências de cookies
      </button>
   )
}

/**
 * Bloco de anúncio, com a altura já reservada para a página não pular quando
 * ele carrega. Só aparece com o AdSense configurado e os cookies aceitos.
 */
export function AdSlot() {
   const consent = useConsent()
   const insRef = useRef<HTMLModElement>(null)
   const active = adsEnabled && ADSENSE_SLOT !== '' && consent === 'granted'

   useEffect(() => {
      const ins = insRef.current
      // cada bloco só pode ser pedido uma vez (o modo estrito roda o efeito duas)
      if (!active || !ins || ins.dataset.requested) return
      ins.dataset.requested = 'true'
      loadAdsScript()
      ;(window.adsbygoogle ??= []).push({})
   }, [active])

   if (!active) return null

   return (
      <aside className="ad" aria-label="Publicidade">
         <span className="ad-label">Publicidade</span>
         <ins
            ref={insRef}
            className="adsbygoogle"
            style={{ display: 'block' }}
            data-ad-client={ADSENSE_CLIENT}
            data-ad-slot={ADSENSE_SLOT}
            data-ad-format="auto"
            data-full-width-responsive="true"
         />
      </aside>
   )
}
