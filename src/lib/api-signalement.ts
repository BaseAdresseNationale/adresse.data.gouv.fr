import { PaginatedSignalements, SignalementCommuneStatus, SignalementStatusEnum, SignalementTypeEnum } from '@/types/api-signalement.types'
import { addSearchParams, customFetch } from './fetch'
import { env } from 'next-runtime-env'

const getSignalementApiBaseUrl = (): string | null => {
  return env('NEXT_PUBLIC_API_SIGNALEMENT') || null
}

export function getSignalements(options?: {
  status?: SignalementStatusEnum[]
  types?: SignalementTypeEnum[]
  sourceIds?: string[]
  codeCommunes?: string[]
}, limit: number = 10,
  page: number = 1): Promise<PaginatedSignalements> {
  const apiBaseUrl = getSignalementApiBaseUrl()
  if (!apiBaseUrl) {
    throw new Error('NEXT_PUBLIC_API_SIGNALEMENT is not defined')
  }

  const url = new URL(`${apiBaseUrl}/signalements`)
  url.searchParams.append('page', page.toString())
  url.searchParams.append('limit', limit.toString())
  addSearchParams(url, options)

  return customFetch(url, { cache: 'force-cache' })
}

export const getSignalementSourceId = (): string | null => {
  const sourceId = env('NEXT_PUBLIC_MES_SIGNALEMENTS_SOURCE_ID')
  return sourceId || null
}

export async function getSignalementCommuneStatus(
  codeCommune: string,
): Promise<SignalementCommuneStatus> {
  const apiBaseUrl = getSignalementApiBaseUrl()
  const sourceId = getSignalementSourceId()

  if (!apiBaseUrl || !sourceId) {
    return {
      disabled: true,
      message: 'Le service de signalement n\'est pas configuré.',
    }
  }

  const url = new URL(`${apiBaseUrl}/settings/commune-status/${codeCommune}`)

  url.searchParams.append('sourceId', sourceId)

  return customFetch(url, { cache: 'force-cache' })
}
