import { useMemo } from 'react'

import {
   Link,
   PageShell,
   ROUTES,
   formatLongDate,
   localISODate,
   useDocumentHead,
} from '@/src/shared'

import { useReleasedPuzzlesQuery } from '../services'
import type { Puzzle } from '../services/models'
import { puzzleSummary } from '../utils'

export const ARCHIVE_TITLE = 'Todos os desafios'
export const ARCHIVE_DESCRIPTION =
   'O arquivo do algarism.io: todos os desafios diários de matemática já publicados, dia a dia, para jogar quando quiser.'

/** Arquivo: todos os dias já liberados, do mais recente para o mais antigo. */
export function ChallengeArchive() {
   const today = useMemo(() => localISODate(new Date()), [])
   const { data: puzzles, isError } = useReleasedPuzzlesQuery(today)

   useDocumentHead({
      title: ARCHIVE_TITLE,
      description: ARCHIVE_DESCRIPTION,
      path: ROUTES.archive,
   })

   const days = useMemo(() => {
      const map = new Map<string, Puzzle[]>()
      for (const puzzle of puzzles ?? [])
         map.set(puzzle.date, [...(map.get(puzzle.date) ?? []), puzzle])
      return [...map] // a consulta já vem do dia mais recente para o mais antigo
   }, [puzzles])

   return (
      <PageShell heading={ARCHIVE_TITLE}>
         <p>
            Todo dia saem três desafios novos, um de cada nível. Os anteriores
            continuam abertos: escolha um dia para jogar.
         </p>
         {isError && (
            <p role="status">
               Não foi possível carregar os desafios. Recarregue a página para
               tentar de novo.
            </p>
         )}
         {!puzzles && !isError && <p role="status">Buscando os desafios…</p>}
         <ul className="archive">
            {days.map(([date, list]) => (
               <li key={date}>
                  <Link
                     to={date === today ? ROUTES.home : ROUTES.challenge(date)}
                  >
                     {formatLongDate(date)}
                     {date === today && ' (hoje)'}
                  </Link>
                  <span>{puzzleSummary(list)}</span>
               </li>
            ))}
         </ul>
      </PageShell>
   )
}
