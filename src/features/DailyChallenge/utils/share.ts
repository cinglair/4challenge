import { SITE_URL, parseISODate } from '@/src/shared'

import type { Level } from '../services/models'
import { LEVELS } from './constants'

/**
 * Mensagem para compartilhar um acerto. Diz o nível e o dia, nunca a conta:
 * quem recebe ainda tem o desafio inteiro pela frente.
 */
export function buildShareText(level: Level, date: string): string {
   const label = LEVELS.find((l) => l.id === level)!.label
   const day = new Intl.DateTimeFormat('pt-BR', {
      day: 'numeric',
      month: 'long',
   }).format(parseISODate(date))
   return `Resolvi o desafio ${label} do dia ${day} no algarism.io 🦉 Você consegue?\n${SITE_URL}`
}
