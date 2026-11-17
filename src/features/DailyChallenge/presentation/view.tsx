import type { ReactNode } from 'react'

import { Stage } from '../components'
import type { Level } from '../services/models'

interface DailyChallengeViewProps {
   level: Level
   digit: number
   headerComponent: ReactNode
   levelTabsComponent: ReactNode
   briefComponent: ReactNode
   editorComponent: ReactNode
   statusComponent: ReactNode
   actionsComponent: ReactNode
}

export function DailyChallengeView({
   level,
   digit,
   headerComponent,
   levelTabsComponent,
   briefComponent,
   editorComponent,
   statusComponent,
   actionsComponent,
}: DailyChallengeViewProps) {
   return (
      <Stage level={level} digit={digit}>
         {headerComponent}
         {levelTabsComponent}
         {briefComponent}
         {editorComponent}
         {statusComponent}
         {actionsComponent}
      </Stage>
   )
}
