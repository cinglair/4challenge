import { ChallengeCalendar } from './challenge-calendar'
import { HowToPlay } from './how-to-play'

interface ChallengeHeaderProps {
   /** Título da página, só para leitores de tela e buscadores. */
   title: string
   date: string
   today: string
   onDateChange: (date: string) => void
}

/** Cabeçalho: ajuda à esquerda e o calendário à direita (o nome fica no logo do rodapé). */
export function ChallengeHeader({
   title,
   date,
   today,
   onDateChange,
}: ChallengeHeaderProps) {
   return (
      <header className="top">
         <HowToPlay />
         <h1 className="sr-only">{title}</h1>
         <ChallengeCalendar
            date={date}
            today={today}
            onDateChange={onDateChange}
         />
      </header>
   )
}
