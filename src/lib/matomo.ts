import { push as matomoPush } from '@socialgouv/matomo-next'
import { env } from 'next-runtime-env'

export const matomoTrackEvent = (category: string, ...args: any[]) => {
  matomoPush(['trackEvent', `${env('NODE_ENV') !== 'production' ? 'DEVMODE - ' : ''}${category}`, ...args])
}
