import { useCountdownToMidnight } from '../hooks/use-countdown'

interface SolvedPanelProps {
   tries: number
   allSolved: boolean
   /** A contagem para os novos desafios só faz sentido no dia de hoje. */
   showCountdown: boolean
   nextLevelLabel?: string
   onNextLevel: () => void
}

export function SolvedPanel({
   tries,
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
         <p>
            {tries === 1 ? 'De primeira.' : `Em ${tries} tentativas.`}{' '}
            {allSolved && showCountdown && <Countdown />}
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
