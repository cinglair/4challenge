import { useEffect, useReducer } from 'react'

import {
   createInitialGame,
   emptyPlays,
   gameReducer,
   loadPlays,
   savePlays,
} from '../utils'

/** Estado do jogo do dia, com o progresso guardado no navegador. */
export function useGame(date: string) {
   const [game, dispatch] = useReducer(gameReducer, date, (d) =>
      createInitialGame(loadPlays(d) ?? emptyPlays())
   )

   useEffect(() => {
      savePlays(date, game.plays)
   }, [date, game.plays])

   return { game, dispatch }
}
