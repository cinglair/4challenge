import { DailyChallengeController } from './controller'

import '../styles.css'

export { ChallengeArchive } from './archive'

interface DailyChallengeProps {
   /** Dia em jogo (AAAA-MM-DD); sem ele, o de hoje. */
   date?: string
}

export function DailyChallenge({ date }: DailyChallengeProps) {
   return <DailyChallengeController date={date} />
}
