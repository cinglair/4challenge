import { ChallengeCalendar } from './challenge-calendar'

interface ChallengeHeaderProps {
   date: string
   today: string
   onDateChange: (date: string) => void
}

export function ChallengeHeader({
   date,
   today,
   onDateChange,
}: ChallengeHeaderProps) {
   return (
      <header className="top">
         <span className="brand">algarismos</span>
         <ChallengeCalendar
            date={date}
            today={today}
            onDateChange={onDateChange}
         />
      </header>
   )
}
