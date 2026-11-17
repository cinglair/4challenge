import { useMemo, useRef, useState } from 'react'

import { localISODate } from '@/src/shared'

import {
   ChallengeBrief,
   ChallengeHeader,
   ExpressionEditor,
   Keypad,
   LevelTabs,
   OwlMascot,
   SolvedPanel,
   Stage,
   StatusMessage,
} from '../components'
import { useChallengeInput, useGame, useLevelHue } from '../hooks'
import { useDailyPuzzlesQuery } from '../services'
import {
   LEVELS,
   countDigits,
   evaluate,
   isTarget,
   maskSolution,
   solvePuzzle,
} from '../utils'
import { DailyChallengeView } from './view'

export function DailyChallengeController() {
   const today = useMemo(() => localISODate(new Date()), [])
   const [date, setDate] = useState(today)
   const [showResult, setShowResult] = useState(false)

   // A chave recomeça o jogo (estado e progresso salvo) a cada troca de dia.
   return (
      <ChallengeSession
         key={date}
         date={date}
         today={today}
         onDateChange={setDate}
         showResult={showResult}
         onToggleResult={() => setShowResult((v) => !v)}
      />
   )
}

interface ChallengeSessionProps {
   date: string
   today: string
   onDateChange: (date: string) => void
   showResult: boolean
   onToggleResult: () => void
}

/** O jogo de um dia. */
function ChallengeSession({
   date,
   today,
   onDateChange,
   showResult,
   onToggleResult,
}: ChallengeSessionProps) {
   const { data: puzzles, isError } = useDailyPuzzlesQuery(date)
   const { game, dispatch } = useGame(date)
   const editorRef = useRef<HTMLDivElement>(null)

   const puzzle = puzzles?.find((p) => p.level === game.level) ?? null
   const play = game.plays[game.level]

   useLevelHue(game.level)
   const { tap, onKeyDown } = useChallengeInput({ puzzle, dispatch, editorRef })

   // Dica: parte de uma solução, calculada só quando o jogador pede.
   const hinted = !!play.hinted && !play.solved
   const hint = useMemo(() => {
      if (!hinted || !puzzle) return undefined
      const solution = solvePuzzle(puzzle)
      return solution ? maskSolution(solution) : null
   }, [hinted, puzzle])

   const header = (
      <ChallengeHeader date={date} today={today} onDateChange={onDateChange} />
   )

   if (isError) {
      return (
         <Stage level={game.level}>
            {header}
            <OwlMascot mood="oops" />
            <p className="lead">
               Não foi possível carregar os desafios deste dia. Recarregue a
               página para tentar de novo.
            </p>
         </Stage>
      )
   }

   if (!puzzle) {
      return (
         <Stage level={game.level}>
            {header}
            <OwlMascot />
            <p className="lead" role="status">
               Buscando os desafios…
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
   const badStamp = game.note?.tone === 'bad' ? game.note.stamp : 0

   return (
      <DailyChallengeView
         level={game.level}
         headerComponent={header}
         levelTabsComponent={
            <LevelTabs
               level={game.level}
               plays={game.plays}
               onLevelChange={(level) => dispatch({ type: 'level', level })}
            />
         }
         briefComponent={<ChallengeBrief puzzle={puzzle} used={used} />}
         mascotComponent={
            // a chave repete a animação a cada novo erro
            <OwlMascot
               key={badStamp}
               mood={
                  play.solved
                     ? game.celebrating
                        ? 'cheer'
                        : 'happy'
                     : badStamp
                       ? 'oops'
                       : 'idle'
               }
            />
         }
         editorComponent={
            <ExpressionEditor
               editorRef={editorRef}
               puzzleId={puzzle.id}
               root={play.root}
               cursor={game.cursor}
               solved={play.solved}
               live={live}
               hit={hit}
               showResult={showResult}
               onToggleResult={onToggleResult}
               badStamp={badStamp}
               onKeyDown={onKeyDown}
               onPlace={(cursor) => dispatch({ type: 'place', cursor })}
            />
         }
         statusComponent={
            <StatusMessage
               note={game.note}
               solved={play.solved}
               live={live}
               hint={hint}
            />
         }
         actionsComponent={
            play.solved ? (
               <SolvedPanel
                  tries={play.tries}
                  allSolved={allSolved}
                  showCountdown={date === today}
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
                  hinted={hinted}
                  onHint={() => {
                     dispatch({ type: 'hint' })
                     editorRef.current?.focus({ preventScroll: true })
                  }}
                  onTap={tap}
               />
            )
         }
      />
   )
}
