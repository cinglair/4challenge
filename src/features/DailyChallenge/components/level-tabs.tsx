import type { Level } from '../services/models'
import type { Plays } from '../types'
import { LEVELS } from '../utils'

interface LevelTabsProps {
   level: Level
   plays: Plays
   onLevelChange: (level: Level) => void
}

export function LevelTabs({ level, plays, onLevelChange }: LevelTabsProps) {
   return (
      <nav className="levels" role="tablist" aria-label="Nível">
         {LEVELS.map((l) => (
            <button
               key={l.id}
               role="tab"
               aria-selected={l.id === level}
               className="level"
               onClick={() => onLevelChange(l.id)}
            >
               {l.label}
               {plays[l.id].solved && (
                  <svg
                     className="tick"
                     viewBox="0 0 16 16"
                     aria-label="resolvido"
                  >
                     <path d="M3 8.5l3.2 3.2L13 4.8" />
                  </svg>
               )}
               {plays[l.id].revealed && !plays[l.id].solved && (
                  <svg
                     className="tick miss"
                     viewBox="0 0 16 16"
                     aria-label="solução vista"
                  >
                     <path d="M4 4l8 8M12 4l-8 8" />
                  </svg>
               )}
            </button>
         ))}
      </nav>
   )
}
