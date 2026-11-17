import { useEffect, useRef, useState } from 'react'

import { parseISODate } from '@/src/shared'

import {
   WEEKDAYS,
   buildMonthGrid,
   compareMonth,
   dayProgress,
   formatDateLabel,
   formatMonthLabel,
   formatShortDate,
   loadPlays,
   monthOf,
   shiftMonth,
} from '../utils'

interface ChallengeCalendarProps {
   /** Dia em jogo (AAAA-MM-DD). */
   date: string
   today: string
   onDateChange: (date: string) => void
}

const PROGRESS_LABEL = {
   none: '',
   partial: ', em andamento',
   done: ', resolvido',
} as const

/** Data do desafio no topo; abre um calendário para jogar outros dias. */
export function ChallengeCalendar({
   date,
   today,
   onDateChange,
}: ChallengeCalendarProps) {
   const [open, setOpen] = useState(false)
   const [month, setMonth] = useState(() => monthOf(date))
   const wrapRef = useRef<HTMLDivElement>(null)

   // Fecha ao clicar fora ou apertar Esc.
   useEffect(() => {
      if (!open) return
      const onPointerDown = (e: PointerEvent) => {
         if (!wrapRef.current?.contains(e.target as Node)) setOpen(false)
      }
      const onKeyDown = (e: KeyboardEvent) => {
         if (e.key === 'Escape') setOpen(false)
      }
      document.addEventListener('pointerdown', onPointerDown)
      document.addEventListener('keydown', onKeyDown)
      return () => {
         document.removeEventListener('pointerdown', onPointerDown)
         document.removeEventListener('keydown', onKeyDown)
      }
   }, [open])

   const toggle = () => {
      if (!open) setMonth(monthOf(date))
      setOpen(!open)
   }
   const pick = (iso: string) => {
      setOpen(false)
      if (iso !== date) onDateChange(iso)
   }

   const label = formatDateLabel(parseISODate(date))
   const isLastMonth = compareMonth(month, monthOf(today)) >= 0

   return (
      <div className="calendar" ref={wrapRef}>
         <button
            type="button"
            className="calendar-trigger"
            aria-haspopup="dialog"
            aria-expanded={open}
            aria-label={`${label}. Escolher outro dia`}
            onClick={toggle}
         >
            <svg viewBox="0 0 24 24" aria-hidden="true">
               <rect x="3.5" y="5" width="17" height="15.5" rx="3" />
               <path d="M3.5 10h17M8 3v4M16 3v4" />
            </svg>
            <time dateTime={date}>{formatShortDate(parseISODate(date))}</time>
         </button>

         {open && (
            <div
               className="calendar-pop"
               role="dialog"
               aria-label="Escolher o dia do desafio"
            >
               <div className="calendar-nav">
                  <button
                     type="button"
                     aria-label="Mês anterior"
                     onClick={() => setMonth(shiftMonth(month, -1))}
                  >
                     <svg viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M14.5 6l-6 6 6 6" />
                     </svg>
                  </button>
                  <span className="calendar-month" aria-live="polite">
                     {formatMonthLabel(month)}
                  </span>
                  <button
                     type="button"
                     aria-label="Próximo mês"
                     disabled={isLastMonth}
                     onClick={() => setMonth(shiftMonth(month, 1))}
                  >
                     <svg viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M9.5 6l6 6-6 6" />
                     </svg>
                  </button>
               </div>

               <div className="calendar-grid">
                  {WEEKDAYS.map((w, i) => (
                     <span
                        className="calendar-weekday"
                        aria-hidden="true"
                        key={i}
                     >
                        {w}
                     </span>
                  ))}
                  {buildMonthGrid(month).map((iso, i) => {
                     if (!iso) return <span key={'blank' + i} />
                     const future = iso > today
                     const progress = future
                        ? 'none'
                        : dayProgress(loadPlays(iso))
                     return (
                        <button
                           type="button"
                           key={iso}
                           className={
                              'calendar-day' + (iso === today ? ' today' : '')
                           }
                           data-progress={progress}
                           aria-pressed={iso === date}
                           aria-label={
                              formatDateLabel(parseISODate(iso)) +
                              PROGRESS_LABEL[progress]
                           }
                           disabled={future}
                           onClick={() => pick(iso)}
                        >
                           {Number(iso.slice(8))}
                        </button>
                     )
                  })}
               </div>

               {date !== today && (
                  <button
                     type="button"
                     className="calendar-today"
                     onClick={() => pick(today)}
                  >
                     Voltar para hoje
                  </button>
               )}
            </div>
         )}
      </div>
   )
}
