import type { ReactNode } from 'react'

import type { Level } from '../services/models'

interface StageProps {
   level: Level
   digit?: number
   children: ReactNode
}

/** Palco da tela: fundo que muda com o nível e o algarismo-fantasma. */
export function Stage({ level, digit, children }: StageProps) {
   return (
      <div className="stage" data-level={level}>
         {digit !== undefined && (
            <span className="ghost" aria-hidden="true">
               {digit}
            </span>
         )}
         <main className="col">{children}</main>
      </div>
   )
}
