import type { PointerEvent, ReactNode } from 'react'

import type { Cursor, Row, Slot, Step } from '../types'
import { OP_GLYPH, getSlot, samePath } from '../utils'

interface MathRowProps {
   row: Row
   path: Step[]
   cursor: Cursor | null // null = somente leitura
   onPlace?: (c: Cursor) => void
}

/** Desenha uma linha da expressão (e, recursivamente, as linhas internas). */
export function MathRow({ row, path, cursor, onPlace }: MathRowProps) {
   const active = cursor !== null && samePath(cursor.path, path)

   // Clique/toque: põe o cursor antes ou depois do nó mais próximo.
   const onPointerDown = (e: PointerEvent<HTMLSpanElement>) => {
      if (!onPlace) return
      e.stopPropagation()
      let index = row.length
      for (const el of Array.from(e.currentTarget.children) as HTMLElement[]) {
         if (el.dataset.i === undefined) continue
         const r = el.getBoundingClientRect()
         if (e.clientX < r.left + r.width / 2) {
            index = Number(el.dataset.i)
            break
         }
      }
      onPlace({ path, index })
   }

   if (!row.length) {
      return (
         <span className="row" onPointerDown={onPointerDown}>
            {path.length ? (
               <span className={'empty' + (active ? ' on' : '')} />
            ) : (
               active && <i className="caret" />
            )}
         </span>
      )
   }

   const kids: ReactNode[] = []
   row.forEach((node, i) => {
      if (active && cursor.index === i)
         kids.push(<i className="caret" key="caret" />)
      if (node.k === 'pow' && (i === 0 || row[i - 1].k === 'op'))
         kids.push(<span className="empty" key={'base' + i} />)
      const sub = (slot: Slot) => (
         <MathRow
            row={getSlot(node, slot)}
            path={[...path, { i, slot }]}
            cursor={cursor}
            onPlace={onPlace}
         />
      )
      switch (node.k) {
         case 'digit':
            kids.push(
               <span className="tk" data-i={i} key={i}>
                  {node.v}
               </span>
            )
            break
         case 'op':
            kids.push(
               <span className="tk op" data-i={i} key={i}>
                  {OP_GLYPH[node.v]}
               </span>
            )
            break
         case 'fact':
            kids.push(
               <span className="tk" data-i={i} key={i}>
                  !
               </span>
            )
            break
         case 'frac':
            kids.push(
               <span className="frac" data-i={i} key={i}>
                  <span className="num">{sub('num')}</span>
                  <span className="bar" />
                  <span className="den">{sub('den')}</span>
               </span>
            )
            break
         case 'pow':
            // Depois de parênteses altos, o expoente sobe até o topo da linha.
            kids.push(
               <span
                  className={
                     'pow' + (i > 0 && row[i - 1].k === 'group' ? ' hi' : '')
                  }
                  data-i={i}
                  key={i}
               >
                  {sub('exp')}
               </span>
            )
            break
         case 'sqrt':
            kids.push(
               <span className="sqrt" data-i={i} key={i}>
                  <span className="stretch rad">
                     <svg
                        viewBox="0 0 100 100"
                        preserveAspectRatio="none"
                        aria-hidden="true"
                     >
                        <path d="M4 60 L24 54 L50 97 L92 1 L100 1" />
                     </svg>
                  </span>
                  <span className="sqrt-body">{sub('body')}</span>
               </span>
            )
            break
         case 'hole':
            kids.push(
               node.of === 'digit' ? (
                  <span className="empty" data-i={i} key={i} />
               ) : (
                  <span className="tk op unknown" data-i={i} key={i}>
                     ?
                  </span>
               )
            )
            break
         case 'group':
            kids.push(
               <span className="group" data-i={i} key={i}>
                  <Paren />
                  <span className="group-body">{sub('body')}</span>
                  <Paren right />
               </span>
            )
            break
      }
   })
   if (active && cursor.index === row.length)
      kids.push(<i className="caret" key="caret" />)

   return (
      <span className="row" onPointerDown={onPointerDown}>
         {kids}
      </span>
   )
}

function Paren({ right }: { right?: boolean }) {
   return (
      <span className={'stretch paren' + (right ? ' r' : '')}>
         <svg
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            aria-hidden="true"
         >
            <path d="M82 2 Q-12 50 82 98" />
         </svg>
      </span>
   )
}
