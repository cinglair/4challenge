import type { ReactNode } from 'react'

import type { Level } from '../services/models'
import { AboutFooter } from './about-footer'

interface StageProps {
   level: Level
   children: ReactNode
   /** Conteúdo de texto que vem depois da primeira tela (a do jogo). */
   below?: ReactNode
}

/** Palco da tela: fundo que muda com o nível, com o conteúdo centralizado. */
export function Stage({ level, children, below }: StageProps) {
   return (
      <div className="stage" data-level={level}>
         <div className="col">
            <main>{children}</main>
            <AboutFooter />
         </div>
         {below}
      </div>
   )
}
