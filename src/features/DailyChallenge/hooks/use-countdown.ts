import { useEffect, useState } from 'react'

import { pad2 } from '@/src/shared'

/** Tempo até a meia-noite local, no formato HH:MM:SS. */
export function useCountdownToMidnight(): string {
   const [now, setNow] = useState(() => Date.now())

   useEffect(() => {
      const id = setInterval(() => setNow(Date.now()), 1000)
      return () => clearInterval(id)
   }, [])

   const midnight = new Date(now)
   midnight.setHours(24, 0, 0, 0)
   const s = Math.max(0, Math.floor((midnight.getTime() - now) / 1000))

   return `${pad2(Math.floor(s / 3600))}:${pad2(Math.floor(s / 60) % 60)}:${pad2(s % 60)}`
}
