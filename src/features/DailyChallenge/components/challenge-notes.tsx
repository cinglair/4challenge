import {
   AdSlot,
   HOW_TO_PLAY,
   Link,
   ROUTES,
   SiteNav,
   formatLongDate,
   shiftISODate,
} from '@/src/shared'

import type { Puzzle } from '../services/models'
import { FIRST_PUZZLE_DATE, byLevel, puzzleSentence } from '../utils'

interface ChallengeNotesProps {
   date: string
   today: string
   /** Os desafios do dia, quando já carregaram. */
   puzzles?: Puzzle[]
}

/**
 * Texto abaixo do jogo: os enunciados do dia por extenso, os dias vizinhos,
 * as regras e os links do site. É o conteúdo que os buscadores leem.
 */
export function ChallengeNotes({ date, today, puzzles }: ChallengeNotesProps) {
   const longDate = formatLongDate(date)
   const previous = date > FIRST_PUZZLE_DATE ? shiftISODate(date, -1) : null
   const next = date < today ? shiftISODate(date, 1) : null

   return (
      <div className="below prose">
         <section>
            <h2>
               {date === today ? 'Os desafios de hoje' : `Desafios de ${longDate}`}
            </h2>
            <p>
               {date === today
                  ? `Hoje, ${longDate}, são três desafios, um de cada nível:`
                  : `Neste dia foram três desafios, um de cada nível:`}
            </p>
            {puzzles && (
               <ul>
                  {byLevel(puzzles).map((puzzle) => (
                     <li key={puzzle.level}>{puzzleSentence(puzzle)}</li>
                  ))}
               </ul>
            )}
            <p className="day-links">
               {previous && (
                  <Link to={ROUTES.challenge(previous)}>← Dia anterior</Link>
               )}
               {next && (
                  <Link
                     to={next === today ? ROUTES.home : ROUTES.challenge(next)}
                  >
                     Dia seguinte →
                  </Link>
               )}
               <Link to={ROUTES.archive}>Todos os desafios</Link>
            </p>
         </section>

         <section>
            <h2>Como jogar</h2>
            {HOW_TO_PLAY.map((section, i) => (
               <div key={i}>
                  {section.heading && <h3>{section.heading}</h3>}
                  {section.paragraphs.map((paragraph, j) => (
                     <p key={j}>{paragraph}</p>
                  ))}
               </div>
            ))}
         </section>

         <AdSlot />
         <SiteNav />
      </div>
   )
}
