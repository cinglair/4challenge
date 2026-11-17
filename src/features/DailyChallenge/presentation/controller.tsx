import { useMemo, useRef } from 'react'

import { localISODate } from '@/src/shared'

import {
   ChallengeBrief,
   ChallengeHeader,
   ExpressionEditor,
   Keypad,
   LevelTabs,
   SolvedPanel,
   Stage,
   StatusMessage,
} from '../components'
import { useChallengeInput, useGame, useLevelHue } from '../hooks'
import { useDailyPuzzlesQuery } from '../services'
import { LEVELS, countDigits, evaluate, isTarget } from '../utils'
import { DailyChallengeView } from './view'

export function DailyChallengeController() {
   const today = useMemo(() => localISODate(new Date()), [])
   const { data: puzzles, isError } = useDailyPuzzlesQuery(today)
   const { game, dispatch } = useGame(today)
   const editorRef = useRef<HTMLDivElement>(null)

   const puzzle = puzzles?.find((p) => p.level === game.level) ?? null
   const play = game.plays[game.level]

   useLevelHue(game.level)
   const { tap, onKeyDown } = useChallengeInput({ puzzle, dispatch, editorRef })

   if (isError) {
      return (
         <Stage level={game.level}>
            <p className="lead">
               Não foi possível carregar os desafios de hoje. Recarregue a
               página para tentar de novo.
            </p>
         </Stage>
      )
   }

   if (!puzzle) {
      return (
         <Stage level={game.level}>
            <p className="lead" role="status">
               Buscando os desafios de hoje…
            </p>
         </Stage>
      )
   }

   const used = countDigits(play.root)
   const live = play.root.length ? evaluate(play.root) : null
   const hit =
      live?.ok === true &&
      isTarget(live.value, puzzle.target) &&
      used === puzzle.count
   const allSolved = LEVELS.every((l) => game.plays[l.id].solved)
   const nextLevel = LEVELS.find((l) => !game.plays[l.id].solved)

   return (
      <DailyChallengeView
         level={game.level}
         digit={puzzle.digit}
         headerComponent={<ChallengeHeader date={today} />}
         levelTabsComponent={
            <LevelTabs
               level={game.level}
               plays={game.plays}
               onLevelChange={(level) => dispatch({ type: 'level', level })}
            />
         }
         briefComponent={<ChallengeBrief puzzle={puzzle} used={used} />}
         editorComponent={
            <ExpressionEditor
               editorRef={editorRef}
               puzzleId={puzzle.id}
               root={play.root}
               cursor={game.cursor}
               solved={play.solved}
               live={live}
               hit={hit}
               badStamp={game.note?.tone === 'bad' ? game.note.stamp : 0}
               onKeyDown={onKeyDown}
               onPlace={(cursor) => dispatch({ type: 'place', cursor })}
            />
         }
         statusComponent={
            <StatusMessage note={game.note} solved={play.solved} live={live} />
         }
         actionsComponent={
            play.solved ? (
               <SolvedPanel
                  tries={play.tries}
                  allSolved={allSolved}
                  nextLevelLabel={nextLevel?.label}
                  onNextLevel={() =>
                     nextLevel &&
                     dispatch({ type: 'level', level: nextLevel.id })
                  }
               />
            ) : (
               <Keypad
                  level={game.level}
                  digit={puzzle.digit}
                  canClear={play.root.length > 0}
                  onTap={tap}
               />
            )
         }
      />
   )
}
