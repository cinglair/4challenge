import { ChallengeCalendar } from './challenge-calendar'
import { HowToPlay } from './how-to-play'

interface ChallengeHeaderProps {
   date: string
   today: string
   onDateChange: (date: string) => void
}

/** Cabeçalho: ajuda à esquerda e o calendário à direita (o nome fica no logo do rodapé). */
export function ChallengeHeader({
   date,
   today,
   onDateChange,
}: ChallengeHeaderProps) {
   return (
      <header className="top">
         <HowToPlay />
         <h1 className="sr-only">algarism.io</h1>
         <ChallengeCalendar
            date={date}
            today={today}
            onDateChange={onDateChange}
         />
      </header>
   )
}
