import { PaginatedSignalements, SignalementStatusEnum, SignalementTypeEnum } from '@/types/api-signalement.types'
import { addSearchParams, customFetch } from './fetch'
import { env } from 'next-runtime-env'

if (!env('NEXT_PUBLIC_API_SIGNALEMENT')) {
  throw new Error('NEXT_PUBLIC_API_SIGNALEMENT is not defined')
}

export function getSignalements(options?: {
  status?: SignalementStatusEnum[]
  types?: SignalementTypeEnum[]
  sourceIds?: string[]
  codeCommunes?: string[]
}, limit: number = 10,
page: number = 1): Promise<PaginatedSignalements> {
  const url = new URL(`${env('NEXT_PUBLIC_API_SIGNALEMENT')}/signalements`)
  url.searchParams.append('page', page.toString())
  url.searchParams.append('limit', limit.toString())
  addSearchParams(url, options)

  return customFetch(url)
}

export function isSignalementDisabledForCommune(codeCommune: string): Promise<boolean> {
  const url = new URL(`${env('NEXT_PUBLIC_API_SIGNALEMENT')}/settings/communes-disabled/${codeCommune}`)

  return customFetch(url)
}
