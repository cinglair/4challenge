import type { Evaluation, Note } from '../types'

interface StatusMessageProps {
   note: Note | null
   solved: boolean
   live: Evaluation | null
}

/** Aviso do jogo ou, na falta dele, o erro da conta em andamento. */
export function StatusMessage({ note, solved, live }: StatusMessageProps) {
   return (
      <p className={'status' + (note ? ' ' + note.tone : '')} role="status">
         {note?.text ?? (solved ? '' : live && !live.ok ? live.error : ' ')}
      </p>
   )
}
