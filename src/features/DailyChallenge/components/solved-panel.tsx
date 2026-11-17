import { useCountdownToMidnight } from '../hooks/use-countdown'

interface SolvedPanelProps {
   tries: number
   allSolved: boolean
   nextLevelLabel?: string
   onNextLevel: () => void
}

export function SolvedPanel({
   tries,
   allSolved,
   nextLevelLabel,
   onNextLevel,
}: SolvedPanelProps) {
   return (
      <section className="done">
         <h2>{allSolved ? 'Os três de hoje estão resolvidos' : 'Resolvido'}</h2>
         <p>
            {tries === 1 ? 'De primeira.' : `Em ${tries} tentativas.`}{' '}
            {allSolved && <Countdown />}
         </p>
         {nextLevelLabel && (
            <button className="primary" onClick={onNextLevel}>
               Jogar o {nextLevelLabel}
            </button>
         )}
      </section>
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
