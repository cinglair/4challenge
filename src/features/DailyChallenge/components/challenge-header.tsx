import { ChallengeCalendar } from './challenge-calendar'
import { HowToPlay } from './how-to-play'

interface ChallengeHeaderProps {
   date: string
   today: string
   onDateChange: (date: string) => void
}

/** Cabeçalho: ajuda à esquerda, o nome no centro e o calendário à direita. */
export function ChallengeHeader({
   date,
   today,
   onDateChange,
}: ChallengeHeaderProps) {
   return (
      <header className="top">
         <HowToPlay />
         <h1 className="brand">
            algarism<span>.io</span>
         </h1>
         <ChallengeCalendar
            date={date}
            today={today}
            onDateChange={onDateChange}
         />
      </header>
   )
}
