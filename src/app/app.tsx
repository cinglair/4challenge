import { useMemo } from 'react'

import {
   ChallengeArchive,
   DailyChallenge,
   isPlayableDate,
} from '@/src/features/DailyChallenge'
import { NotFoundPage, StaticPage } from '@/src/features/Pages'
import {
   ConsentBanner,
   ROUTES,
   STATIC_PAGES,
   challengeDateOf,
   localISODate,
   usePathname,
} from '@/src/shared'

import { GlobalProviders } from './global-providers'

export function App() {
   return (
      <GlobalProviders>
         <Page />
         <ConsentBanner />
      </GlobalProviders>
   )
}

/** A página do endereço atual. */
function Page() {
   const pathname = usePathname()
   const today = useMemo(() => localISODate(new Date()), [])

   if (pathname === ROUTES.home) return <DailyChallenge />
   if (pathname === ROUTES.archive) return <ChallengeArchive />

   const page = STATIC_PAGES.find((p) => p.path === pathname)
   if (page) return <StaticPage key={page.path} page={page} />

   const date = challengeDateOf(pathname)
   if (date && isPlayableDate(date, today)) return <DailyChallenge date={date} />

   return <NotFoundPage />
}
