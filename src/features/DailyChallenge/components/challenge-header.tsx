import { formatDateLabel } from '../utils'

export function ChallengeHeader({ date }: { date: string }) {
   return (
      <header className="top">
         <span className="brand">algarismos</span>
         <time dateTime={date}>{formatDateLabel(new Date())}</time>
      </header>
   )
}
