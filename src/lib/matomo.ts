import { push as matomoPush } from '@socialgouv/matomo-next'

export const matomoTrackEvent = (category: string, ...args: any[]) => {
  matomoPush(['trackEvent', `${process.env.NODE_ENV !== 'production' ? 'DEVMODE - ' : ''}${category}`, ...args])
}
