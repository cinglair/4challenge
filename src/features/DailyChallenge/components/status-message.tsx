import type { Evaluation, Note, Row } from '../types'
import { toText } from '../utils'
import { MathRow } from './math-row'

interface StatusMessageProps {
   note: Note | null
   solved: boolean
   live: Evaluation | null
   /** Dica à mostra: a conta parcial, `null` se não há solução, `undefined` se escondida. */
   hint?: Row | null
}

/** Aviso do jogo; na falta dele, a dica pedida ou o erro da conta em andamento. */
export function StatusMessage({
   note,
   solved,
   live,
   hint,
}: StatusMessageProps) {
   let content: React.ReactNode = ' '
   if (note) content = note.text
   else if (solved) content = ''
   else if (hint)
      content = (
         <span className="clue" aria-label={'Dica: ' + toText(hint)}>
            <span className="clue-label">Dica</span>
            <span className="clue-expr" aria-hidden="true">
               <MathRow row={hint} path={[]} cursor={null} />
            </span>
         </span>
      )
   else if (hint === null) content = 'Ainda não há dica para este desafio.'
   else if (live && !live.ok) content = live.error

   return (
      <p className={'status' + (note ? ' ' + note.tone : '')} role="status">
         {content}
      </p>
   )
}
