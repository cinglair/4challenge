import type { ReactNode } from 'react'

import { Stage } from '../components'
import type { Level } from '../services/models'

interface DailyChallengeViewProps {
   level: Level
   headerComponent: ReactNode
   levelTabsComponent: ReactNode
   briefComponent: ReactNode
   mascotComponent: ReactNode
   editorComponent: ReactNode
   statusComponent: ReactNode
   actionsComponent: ReactNode
   notesComponent: ReactNode
}

export function DailyChallengeView({
   level,
   headerComponent,
   levelTabsComponent,
   briefComponent,
   mascotComponent,
   editorComponent,
   statusComponent,
   actionsComponent,
   notesComponent,
}: DailyChallengeViewProps) {
   return (
      <Stage level={level} below={notesComponent}>
         {headerComponent}
         {levelTabsComponent}
         <div className="hero">
            {briefComponent}
            {mascotComponent}
         </div>
         {editorComponent}
         {statusComponent}
         {actionsComponent}
      </Stage>
   )
}
