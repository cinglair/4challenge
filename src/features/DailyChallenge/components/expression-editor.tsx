import { useEffect, useRef, type KeyboardEvent, type RefObject } from 'react'

import type { Cursor, Evaluation, Row } from '../types'
import { endCursor, formatValue, toText } from '../utils'
import { MathRow } from './math-row'

interface ExpressionEditorProps {
   editorRef: RefObject<HTMLDivElement | null>
   /** Muda a cada desafio, para o editor retomar o foco. */
   puzzleId: string
   root: Row
   cursor: Cursor
   solved: boolean
   live: Evaluation | null
   hit: boolean
   /** Mostra o valor da conta enquanto ela é montada. */
   showResult: boolean
   onToggleResult: () => void
   /** Carimbo do último aviso de erro; 0 quando não há. */
   badStamp: number
   onKeyDown: (e: KeyboardEvent) => void
   onPlace: (cursor: Cursor) => void
}

export function ExpressionEditor({
   editorRef,
   puzzleId,
   root,
   cursor,
   solved,
   live,
   hit,
   showResult,
   onToggleResult,
   badStamp,
   onKeyDown,
   onPlace,
}: ExpressionEditorProps) {
   const scrollRef = useRef<HTMLDivElement>(null)

   // Mantém o cursor visível quando a conta passa da largura da tela.
   useEffect(() => {
      const box = scrollRef.current
      const mark = box?.querySelector<HTMLElement>('.caret, .empty.on')
      if (!box || !mark) return
      const a = box.getBoundingClientRect()
      const b = mark.getBoundingClientRect()
      if (b.left < a.left + 20) box.scrollLeft -= a.left + 20 - b.left
      else if (b.right > a.right - 20)
         box.scrollLeft += b.right - (a.right - 20)
   }, [cursor, root])

   useEffect(() => {
      if (!solved) editorRef.current?.focus({ preventScroll: true })
   }, [editorRef, puzzleId, solved])

   // Resposta errada: o editor balança uma vez.
   useEffect(() => {
      if (
         !badStamp ||
         window.matchMedia('(prefers-reduced-motion: reduce)').matches
      )
         return
      editorRef.current?.animate(
         [
            { transform: 'translateX(0)' },
            { transform: 'translateX(-6px)' },
            { transform: 'translateX(5px)' },
            { transform: 'translateX(-3px)' },
            { transform: 'translateX(0)' },
         ],
         { duration: 320, easing: 'ease' }
      )
   }, [editorRef, badStamp])

   return (
      <div
         ref={editorRef}
         className={'editor' + (solved ? ' solved' : '')}
         tabIndex={solved ? -1 : 0}
         role="textbox"
         aria-label={'Sua conta: ' + (toText(root) || 'vazia')}
         aria-readonly={solved}
         onKeyDown={onKeyDown}
         onPointerDown={(e) => {
            if (solved) return
            const r = e.currentTarget
               .querySelector('.row')!
               .getBoundingClientRect()
            onPlace(
               e.clientX < r.left ? { path: [], index: 0 } : endCursor(root)
            )
         }}
      >
         <div className="scroll" ref={scrollRef}>
            <div className="expr">
               <MathRow
                  row={root}
                  path={[]}
                  cursor={solved ? null : cursor}
                  onPlace={solved ? undefined : onPlace}
               />
               {!root.length && (
                  <span className="hint">Escreva sua conta aqui</span>
               )}
            </div>
         </div>
         {live?.ok && (solved || showResult) && (
            <output className={'value' + (hit || solved ? ' hit' : '')}>
               {formatValue(live.value)}
            </output>
         )}
         {!solved && (
            <button
               type="button"
               className="reveal"
               role="switch"
               aria-checked={showResult}
               aria-label="Mostrar resultado"
               title={showResult ? 'Esconder resultado' : 'Mostrar resultado'}
               onPointerDown={(e) => {
                  e.stopPropagation() // não move o cursor da conta
                  e.preventDefault() // o foco fica no editor
               }}
               onKeyDown={(e) => e.stopPropagation()}
               onClick={onToggleResult}
            >
               <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M2.5 12s3.5-6.5 9.5-6.5 9.5 6.5 9.5 6.5-3.5 6.5-9.5 6.5S2.5 12 2.5 12z" />
                  <circle cx="12" cy="12" r="2.8" />
                  {!showResult && <path d="M4.5 4.5l15 15" />}
               </svg>
            </button>
         )}
      </div>
   )
}
