import type { ReactNode } from 'react'

import type { Level } from '../services/models'
import { AboutFooter } from './about-footer'

interface StageProps {
   level: Level
   children: ReactNode
}

/** Palco da tela: fundo que muda com o nível, com o conteúdo centralizado. */
export function Stage({ level, children }: StageProps) {
   return (
      <div className="stage" data-level={level}>
         <div className="col">
            <main>{children}</main>
            <AboutFooter />
         </div>
      </div>
   )
}
