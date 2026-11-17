import { useState } from 'react'

import { useCountdownToMidnight } from '../hooks/use-countdown'
import type { Level } from '../services/models'
import { buildShareText } from '../utils'

interface SolvedPanelProps {
   level: Level
   date: string
   allSolved: boolean
   /** A contagem para os novos desafios só faz sentido no dia de hoje. */
   showCountdown: boolean
   nextLevelLabel?: string
   onNextLevel: () => void
}

export function SolvedPanel({
   level,
   date,
   allSolved,
   showCountdown,
   nextLevelLabel,
   onNextLevel,
}: SolvedPanelProps) {
   return (
      <section className="done">
         <h2>
            {allSolved
               ? showCountdown
                  ? 'Os três de hoje estão resolvidos'
                  : 'Os três deste dia estão resolvidos'
               : 'Resolvido'}
         </h2>
         {allSolved && showCountdown && (
            <p>
               <Countdown />
            </p>
         )}
         {nextLevelLabel && (
            <button className="primary" onClick={onNextLevel}>
               Jogar o {nextLevelLabel}
            </button>
         )}
         <ShareButton level={level} date={date} />
      </section>
   )
}

type ShareStatus = 'idle' | 'copied' | 'failed'

const SHARE_LABEL: Record<ShareStatus, string> = {
   idle: 'Compartilhar',
   copied: 'Copiado!',
   failed: 'Não deu para copiar',
}

/** Compartilha o acerto (nível e dia, sem a conta) ou copia a mensagem. */
function ShareButton({ level, date }: { level: Level; date: string }) {
   const [status, setStatus] = useState<ShareStatus>('idle')

   const share = async () => {
      const text = buildShareText(level, date)

      // Celular e alguns navegadores: abre a folha de compartilhamento do sistema.
      if (navigator.share) {
         try {
            await navigator.share({ text })
            return
         } catch (e) {
            if (e instanceof DOMException && e.name === 'AbortError') return // a pessoa desistiu
         }
      }

      try {
         await navigator.clipboard.writeText(text)
         setStatus('copied')
      } catch {
         setStatus('failed')
      }
      setTimeout(() => setStatus('idle'), 2200)
   }

   return (
      <button type="button" className="share" onClick={share}>
         <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 15V4M8 7.5L12 3.5l4 4M5 12.5V18a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-5.5" />
         </svg>
         <span aria-live="polite">{SHARE_LABEL[status]}</span>
      </button>
   )
}

function Countdown() {
   const clock = useCountdownToMidnight()

   return (
      <span>
         Novos desafios em <span className="clock">{clock}</span>.
      </span>
   )
}
