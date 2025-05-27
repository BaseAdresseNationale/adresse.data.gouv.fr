import { PaginatedSignalements, SignalementCommuneStatus, SignalementStatusEnum, SignalementTypeEnum } from '@/types/api-signalement.types'
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

export const getSignalementSourceId = (): string => {
  const sourceId = env('NEXT_PUBLIC_MES_SIGNALEMENTS_SOURCE_ID')
  if (!sourceId) {
    throw new Error('REACT_APP_MES_SIGNALEMENTS_SOURCE_ID is not defined')
  }

  return sourceId
}

export async function getSignalementCommuneStatus(
  codeCommune: string,
): Promise<SignalementCommuneStatus> {
  const url = new URL(`${env('NEXT_PUBLIC_API_SIGNALEMENT')}/settings/commune-status/${codeCommune}`)

  url.searchParams.append('sourceId', getSignalementSourceId())

  return customFetch(url)
}
