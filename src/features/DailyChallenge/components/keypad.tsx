import type { Level } from '../services/models'
import type { Key } from '../types'
import { LOCKED_NOTE, NEEDS, PAD, RANK } from '../utils'
import { KeyIcon } from './key-icons'

interface KeypadProps {
   level: Level
   digit: number
   canClear: boolean
   hinted: boolean
   onHint: () => void
   onTap: (key: Key) => void
}

export function Keypad({
   level,
   digit,
   canClear,
   hinted,
   onHint,
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
         <button
            className="link clue-toggle"
            aria-pressed={hinted}
            title={hinted ? 'Esconder a dica' : 'Mostrar parte de uma solução'}
            onPointerDown={
               (e) => e.preventDefault() /* o foco fica no editor */
            }
            onClick={onHint}
         >
            <svg viewBox="0 0 24 24" aria-hidden="true">
               <path d="M9.5 18h5M10.5 21h3M12 3a6 6 0 0 0-3.6 10.8c.7.5 1.1 1.3 1.1 2.2h5c0-.9.4-1.7 1.1-2.2A6 6 0 0 0 12 3z" />
            </svg>
            Dica
         </button>
         <button className="primary" onClick={() => onTap('check')}>
            Verificar resultado
         </button>
      </div>
   )
}
