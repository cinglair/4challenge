import type { ReactNode } from 'react'

import type { Level } from '../services/models'

interface StageProps {
   level: Level
   children: ReactNode
}

/** Palco da tela: fundo que muda com o nível, com o conteúdo centralizado. */
export function Stage({ level, children }: StageProps) {
   return (
      <div className="stage" data-level={level}>
         <main className="col">{children}</main>
      </div>
   )
}
