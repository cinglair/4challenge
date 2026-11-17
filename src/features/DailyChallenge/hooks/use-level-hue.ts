import { useEffect } from 'react'

import type { Level } from '../services/models'
import { LEVELS } from '../utils'

/** O fundo acompanha a fase: a matiz é uma variável CSS animável. */
export function useLevelHue(level: Level) {
   const hue = LEVELS.find((l) => l.id === level)!.hue

   useEffect(() => {
      document.documentElement.style.setProperty('--h', String(hue))
   }, [hue])
}
