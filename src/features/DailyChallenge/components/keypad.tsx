import type { Level } from '../services/models'
import type { Key } from '../types'
import { LOCKED_NOTE, NEEDS, PAD, RANK } from '../utils'
import { KeyIcon } from './key-icons'

interface KeypadProps {
   level: Level
   digit: number
   canClear: boolean
   onTap: (key: Key) => void
}

export function Keypad({
   level,
   digit,
   canClear,
   onTap,
}: KeypadProps) {
   return (
      <div className="pad">
         {PAD.map(({ key, label, text }) => {
            const needs = NEEDS[key]
            const locked = !!needs && RANK[level] < RANK[needs]
            return (
               <button
                  key={key}
                  className={
                     'key' +
                     (key === 'digit' ? ' digit' : '') +
                     (locked ? ' locked' : '')
                  }
                  aria-label={key === 'digit' ? `Algarismo ${digit}` : label}
                  aria-disabled={locked}
                  title={locked && needs ? LOCKED_NOTE[needs] : label}
                  onPointerDown={
                     (e) => e.preventDefault() /* o foco fica no editor */
                  }
                  onClick={() => onTap(key)}
               >
                  {key === 'digit' ? (
                     digit
                  ) : (
                     <KeyIcon name={key} fallback={text} />
                  )}
               </button>
            )
         })}
         <button
            className="link"
            onClick={() => onTap('clear')}
            disabled={!canClear}
         >
            Limpar
         </button>
         <button className="primary" onClick={() => onTap('check')}>
            Verificar resultado
         </button>
      </div>
   )
}
