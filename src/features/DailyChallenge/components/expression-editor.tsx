import {
   useEffect,
   useLayoutEffect,
   useRef,
   type KeyboardEvent,
   type RefObject,
} from 'react'

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
   /** A conta à mostra é a solução pedida pelo jogador, não a dele. */
   revealed?: boolean
   /** Texto da caixa vazia. */
   placeholder?: string
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

/** Até quanto a conta pode encolher (fração do tamanho normal). */
const MIN_FIT = 0.5

export function ExpressionEditor({
   editorRef,
   puzzleId,
   root,
   cursor,
   solved,
   revealed = false,
   placeholder = 'Escreva sua conta aqui',
   live,
   hit,
   showResult,
   onToggleResult,
   badStamp,
   onKeyDown,
   onPlace,
}: ExpressionEditorProps) {
   const scrollRef = useRef<HTMLDivElement>(null)
   const exprRef = useRef<HTMLDivElement>(null)
   const locked = solved || revealed // não aceita mais jogadas

   // Conta comprida: a fonte encolhe aos poucos até caber; abaixo do mínimo, a caixa rola.
   useLayoutEffect(() => {
      const box = scrollRef.current
      const expr = exprRef.current
      if (!box || !expr) return
      const fit = () => {
         expr.style.fontSize = '' // mede no tamanho cheio
         let scale = 1
         // algumas medidas não acompanham a fonte (o cursor, as bordas), então
         // uma conta só não basta: repete até caber ou chegar ao mínimo
         for (let pass = 0; pass < 4; pass++) {
            if (expr.offsetWidth <= box.clientWidth || scale <= MIN_FIT) break
            scale = Math.max(
               MIN_FIT,
               (scale * box.clientWidth) / expr.offsetWidth - 0.005
            )
            expr.style.fontSize = `${scale}em`
         }
      }
      fit()
      // o espaço muda com a janela e quando o resultado aparece ao lado
      const observer = new ResizeObserver(fit)
      observer.observe(box)
      return () => observer.disconnect()
   }, [root])

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
      if (!locked) editorRef.current?.focus({ preventScroll: true })
   }, [editorRef, puzzleId, locked])

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
         className={
            'editor' + (solved ? ' solved' : revealed ? ' revealed' : '')
         }
         tabIndex={locked ? -1 : 0}
         role="textbox"
         aria-label={
            (revealed ? 'Uma solução: ' : 'Sua conta: ') +
            (toText(root) || 'vazia')
         }
         aria-readonly={locked}
         onKeyDown={onKeyDown}
         onPointerDown={(e) => {
            if (locked) return
            const r = e.currentTarget
               .querySelector('.row')!
               .getBoundingClientRect()
            onPlace(
               e.clientX < r.left ? { path: [], index: 0 } : endCursor(root)
            )
         }}
      >
         <div className="scroll" ref={scrollRef}>
            <div className="expr" ref={exprRef}>
               <MathRow
                  row={root}
                  path={[]}
                  cursor={locked ? null : cursor}
                  onPlace={locked ? undefined : onPlace}
               />
               {!root.length && <span className="hint">{placeholder}</span>}
            </div>
         </div>
         {live?.ok && (locked || showResult) && (
            <output className={'value' + (hit || solved ? ' hit' : '')}>
               {formatValue(live.value)}
            </output>
         )}
         {!locked && (
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
