import { DailyChallenge } from '@/src/features/DailyChallenge'

import { GlobalProviders } from './global-providers'

export function App() {
   return (
      <GlobalProviders>
         <DailyChallenge />
      </GlobalProviders>
   )
}
