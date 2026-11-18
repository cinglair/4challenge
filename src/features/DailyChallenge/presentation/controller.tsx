import { useMemo, useRef, useState } from 'react'

import {
   ROUTES,
   SITE_DESCRIPTION,
   SITE_NAME,
   SITE_TAGLINE,
   formatLongDate,
   localISODate,
   navigate,
   useDocumentHead,
} from '@/src/shared'

import {
   ChallengeBrief,
   ChallengeHeader,
   ExpressionEditor,
   Keypad,
   LevelTabs,
   OwlMascot,
   RevealedPanel,
   SolvedPanel,
   Stage,
   StatusMessage,
} from '../components'
import { useChallengeInput, useGame, useLevelHue } from '../hooks'
import {
   useDailyPuzzlesQuery,
   usePuzzleHintQuery,
   usePuzzleSolutionQuery,
} from '../services'
import {
   LEVELS,
   challengeDescription,
   challengeTitle,
   countDigits,
   evaluate,
   isClosed,
   isTarget,
} from '../utils'
import { DailyChallengeView } from './view'

interface DailyChallengeControllerProps {
   /** Dia da URL (/desafio/AAAA-MM-DD/); a página inicial joga o de hoje. */
   date?: string
}

export function DailyChallengeController({
   date: routeDate,
}: DailyChallengeControllerProps) {
   const today = useMemo(() => localISODate(new Date()), [])
   const date = routeDate ?? today
   const [showResult, setShowResult] = useState(false)

   // A chave recomeça o jogo (estado e progresso salvo) a cada troca de dia.
   return (
      <ChallengeSession
         key={date}
         date={date}
         today={today}
         isHome={!routeDate}
         onDateChange={(d) =>
            navigate(d === today ? ROUTES.home : ROUTES.challenge(d))
         }
         showResult={showResult}
         onToggleResult={() => setShowResult((v) => !v)}
      />
   )
}

interface ChallengeSessionProps {
   date: string
   today: string
   /** Página inicial (e não a página própria de um dia). */
   isHome: boolean
   onDateChange: (date: string) => void
   showResult: boolean
   onToggleResult: () => void
}

/** O jogo de um dia. */
function ChallengeSession({
   date,
   today,
   isHome,
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

   // Dica: o começo de uma solução, buscado no banco só quando o jogador pede.
   const hinted = !!play.hinted && !isClosed(play)
   const hintQuery = usePuzzleHintQuery(date, game.level, hinted)
   const hint = !hinted ? undefined : hintQuery.isError ? null : hintQuery.data

   // Solução: o jogador desistiu; a conta dele dá lugar a uma solução possível.
   const revealed = !!play.revealed && !play.solved
   const solutionQuery = usePuzzleSolutionQuery(date, game.level, revealed)

   const longDate = formatLongDate(date)
   const pageTitle = isHome
      ? `${SITE_NAME} — ${SITE_TAGLINE}`
      : challengeTitle(longDate)
   useDocumentHead({
      title: pageTitle,
      fullTitle: isHome,
      description: isHome
         ? SITE_DESCRIPTION
         : challengeDescription(longDate, puzzles ?? []),
      path: isHome ? ROUTES.home : ROUTES.challenge(date),
   })

   const header = (
      <ChallengeHeader
         title={pageTitle}
         date={date}
         today={today}
         onDateChange={onDateChange}
      />
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

   const root = revealed ? (solutionQuery.data ?? []) : play.root
   const used = countDigits(root)
   const live = root.length ? evaluate(root) : null
   const hit =
      live?.ok === true &&
      isTarget(live.value, puzzle.target) &&
      used === puzzle.count
   const allSolved = LEVELS.every((l) => game.plays[l.id].solved)
   const nextLevel = LEVELS.find((l) => !isClosed(game.plays[l.id]))
   const goToNextLevel = () =>
      nextLevel && dispatch({ type: 'level', level: nextLevel.id })
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
                     : revealed
                       ? 'cry'
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
               root={root}
               cursor={game.cursor}
               solved={play.solved}
               revealed={revealed}
               placeholder={
                  !revealed
                     ? undefined
                     : solutionQuery.isError
                       ? 'Não foi possível carregar a solução.'
                       : 'Buscando a solução…'
               }
               live={live}
               hit={hit && !revealed}
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
               closed={isClosed(play)}
               live={live}
               hint={hint}
               hinted={hinted}
               onHint={() => {
                  dispatch({ type: 'hint' })
                  editorRef.current?.focus({ preventScroll: true })
               }}
               onReveal={() => dispatch({ type: 'reveal' })}
            />
         }
         actionsComponent={
            play.solved ? (
               <SolvedPanel
                  level={game.level}
                  date={date}
                  allSolved={allSolved}
                  showCountdown={date === today}
                  nextLevelLabel={nextLevel?.label}
                  onNextLevel={goToNextLevel}
               />
            ) : revealed ? (
               <RevealedPanel
                  showCountdown={date === today}
                  nextLevelLabel={nextLevel?.label}
                  onNextLevel={goToNextLevel}
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
