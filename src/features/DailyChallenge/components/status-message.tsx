import type { Evaluation, Note, Row } from '../types'
import { toText } from '../utils'
import { MathRow } from './math-row'

interface StatusMessageProps {
   note: Note | null
   /** Nível encerrado (resolvido ou com a solução à mostra): sem aviso nem chip. */
   closed: boolean
   live: Evaluation | null
   /** Dica à mostra: a conta parcial, `null` se não há solução, `undefined` se escondida. */
   hint?: Row | null
   /** A dica já está à mostra: o chip passa a oferecer a solução. */
   hinted: boolean
   onHint: () => void
   onReveal: () => void
}

/** Aviso do jogo (ou a dica pedida, ou o erro da conta em andamento) e o chip de dica/solução. */
export function StatusMessage({
   note,
   closed,
   live,
   hint,
   hinted,
   onHint,
   onReveal,
}: StatusMessageProps) {
   let content: React.ReactNode = ''
   if (note) content = note.text
   else if (closed) content = ''
   else if (hint)
      content = (
         <span className="clue" aria-label={'Dica: ' + toText(hint)}>
            <span className="clue-expr" aria-hidden="true">
               <MathRow row={hint} path={[]} cursor={null} />
            </span>
         </span>
      )
   else if (hint === null) content = 'Ainda não há dica para este desafio.'
   else if (live && !live.ok) content = live.error

   return (
      <div className={'status' + (note ? ' ' + note.tone : '')}>
         <p className="status-text" role="status">
            {content}
         </p>
         {!closed && (
            // primeiro a dica; com ela à mostra, o mesmo chip oferece a solução
            <button
               className="clue-toggle"
               title={
                  hinted
                     ? 'Desistir e ver uma solução'
                     : 'Mostrar o começo de uma solução'
               }
               onPointerDown={
                  (e) => e.preventDefault() /* o foco fica no editor */
               }
               onClick={hinted ? onReveal : onHint}
            >
               <svg viewBox="0 0 24 24" aria-hidden="true">
                  {hinted ? (
                     <>
                        <path d="M2.5 12s3.5-6.5 9.5-6.5 9.5 6.5 9.5 6.5-3.5 6.5-9.5 6.5S2.5 12 2.5 12z" />
                        <circle cx="12" cy="12" r="2.8" />
                     </>
                  ) : (
                     <path d="M9.5 18h5M10.5 21h3M12 3a6 6 0 0 0-3.6 10.8c.7.5 1.1 1.3 1.1 2.2h5c0-.9.4-1.7 1.1-2.2A6 6 0 0 0 12 3z" />
                  )}
               </svg>
               {hinted ? 'Ver solução' : 'Dica'}
            </button>
         )}
      </div>
   )
}
