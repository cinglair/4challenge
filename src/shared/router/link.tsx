import type { AnchorHTMLAttributes, MouseEvent } from 'react'

import { navigate } from './router'

interface LinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
   to: string
}

/** Link interno: navega sem recarregar, mas continua sendo um `<a>` de verdade. */
export function Link({ to, onClick, ...props }: LinkProps) {
   const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
      onClick?.(e)
      // deixa o navegador cuidar de "abrir em nova aba" e afins
      if (
         e.defaultPrevented ||
         e.button !== 0 ||
         e.metaKey ||
         e.ctrlKey ||
         e.shiftKey ||
         e.altKey
      )
         return
      e.preventDefault()
      navigate(to)
   }
   return <a href={to} onClick={handleClick} {...props} />
}
