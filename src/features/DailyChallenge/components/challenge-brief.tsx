import type { Puzzle } from '../services/models'
import { countWord } from '../utils'

interface ChallengeBriefProps {
   puzzle: Puzzle
   used: number
}

/** Enunciado do desafio e as peças que mostram quantos algarismos já foram usados. */
export function ChallengeBrief({ puzzle, used }: ChallengeBriefProps) {
   const { target, digit, count } = puzzle

   return (
      <section className="brief" aria-live="polite">
         <p className="ask">Forme</p>
         <p className="target">{target}</p>
         <p className="ask">
            com {countWord(count)} algarismos {digit}
         </p>
         <div
            className={'tiles' + (used > count ? ' over' : '')}
            role="img"
            aria-label={`${used} de ${count} usados`}
         >
            {Array.from({ length: count }, (_, i) => (
               <span key={i} className={'tile' + (i < used ? ' used' : '')}>
                  {digit}
               </span>
            ))}
            {used > count && <span className="extra">+{used - count}</span>}
         </div>
      </section>
   )
}
