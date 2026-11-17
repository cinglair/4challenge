import type { ReactNode } from 'react'

import type { Key } from '../types'

const Box = ({
   x,
   y,
   w,
   h,
}: {
   x: number
   y: number
   w: number
   h: number
}) => <rect x={x} y={y} width={w} height={h} rx="1.5" strokeDasharray="2.4 2" />

const KEY_ICONS: Partial<Record<Key, ReactNode>> = {
   frac: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
         <Box x={8} y={2.5} w={8} h={6.5} />
         <path d="M4.5 12h15" />
         <Box x={8} y={15} w={8} h={6.5} />
      </svg>
   ),
   pow: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
         <Box x={3.5} y={9} w={10} h={11.5} />
         <Box x={15.5} y={3} w={5.5} h={6.5} />
      </svg>
   ),
   sqrt: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
         <path d="M2.5 13.5l2.5-1 3 7.5L12 4.5h9.5" />
         <Box x={13} y={9} w={7} h={9} />
      </svg>
   ),
   del: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
         <path d="M8.5 5.5H21v13H8.5L3 12z" />
         <path d="M12 9.5l5 5M17 9.5l-5 5" />
      </svg>
   ),
   left: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
         <path d="M14.5 6l-6 6 6 6" />
      </svg>
   ),
   right: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
         <path d="M9.5 6l6 6-6 6" />
      </svg>
   ),
}

/** Ícone da tecla; cai no texto quando a tecla não tem desenho próprio. */
export function KeyIcon({ name, fallback }: { name: Key; fallback?: string }) {
   return KEY_ICONS[name] ?? fallback
}
