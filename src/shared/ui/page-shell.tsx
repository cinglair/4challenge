import type { ReactNode } from 'react'

import { Link } from '../router'
import { ROUTES } from '../site'
import { SiteNav } from './site-nav'

import './page.css'

interface PageShellProps {
   heading: string
   children: ReactNode
}

/** Moldura das páginas de texto: logo que volta ao jogo, o conteúdo e o rodapé. */
export function PageShell({ heading, children }: PageShellProps) {
   return (
      <div className="page">
         <header className="page-top">
            <Link to={ROUTES.home} aria-label="algarism.io: desafio de hoje">
               <img
                  src="/logo-algarism.webp"
                  alt="algarism.io"
                  width={720}
                  height={192}
               />
            </Link>
         </header>
         <main className="prose">
            <h1>{heading}</h1>
            {children}
         </main>
         <SiteNav />
      </div>
   )
}
