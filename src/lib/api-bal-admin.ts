import { CandidatePartenaireDeLaCharteType, PartenaireDeLaCharteTypeEnum, PartenaireDeLaChartType } from '@/types/partenaire.types'
import { EventType, ParticipantType } from '@/types/events.types'
import { addSearchParams, customFetch } from './fetch'
import { env } from 'next-runtime-env'

if (!env('NEXT_PUBLIC_BAL_ADMIN_API_URL')) {
  throw new Error('NEXT_PUBLIC_BAL_ADMIN_API_URL is not defined in the environment')
}

export async function getOnePartenairesDeLaCharte(id: string): Promise<PartenaireDeLaChartType> {
  const url = new URL(`${env('NEXT_PUBLIC_BAL_ADMIN_API_URL')}/partenaires-de-la-charte/${id}`)

  return customFetch(url)
}

interface PartenairesDeLaCharteQuery {
  codeDepartement?: string[]
  services?: string[]
  type?: PartenaireDeLaCharteTypeEnum
  search?: string
  withoutPictures?: boolean
}

export interface PaginatedPartenairesDeLaCharte {
  total: number
  totalCommunes: number
  totalOrganismes: number
  totalEntreprises: number
  data: PartenaireDeLaChartType[]
}

export const DEFAULT_PARTENAIRES_DE_LA_CHARTE_LIMIT = 8

export async function getPartenairesDeLaCharte(queryObject: PartenairesDeLaCharteQuery, page: number = 1, limit: number = DEFAULT_PARTENAIRES_DE_LA_CHARTE_LIMIT): Promise<PaginatedPartenairesDeLaCharte> {
  const url = new URL(`${env('NEXT_PUBLIC_BAL_ADMIN_API_URL')}/partenaires-de-la-charte/paginated`)
  url.searchParams.append('page', page.toString())
  url.searchParams.append('limit', limit.toString())
  addSearchParams(url, queryObject)

  return customFetch(url)
}

export async function getPartenairesDeLaCharteServices(queryObject: PartenairesDeLaCharteQuery): Promise<Record<string, number>> {
  const url = new URL(`${env('NEXT_PUBLIC_BAL_ADMIN_API_URL')}/partenaires-de-la-charte/services`)
  addSearchParams(url, queryObject)

  return customFetch(url)
}

export async function getRandomPartenairesDeLaCharte(limit: number) {
  const url = new URL(`${env('NEXT_PUBLIC_BAL_ADMIN_API_URL')}/partenaires-de-la-charte/random`)
  if (limit) {
    url.searchParams.append('limit', limit.toString())
  }

  return customFetch(url)
}

export async function candidateToPartenairesDeLaCharte(candidacy: CandidatePartenaireDeLaCharteType) {
  const request = `${env('NEXT_PUBLIC_BAL_ADMIN_API_URL')}/partenaires-de-la-charte/candidate`

  return customFetch(request, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(candidacy),
  })
}

export async function registrationToEvent(eventId: string, participant: ParticipantType) {
  const request = `${env('NEXT_PUBLIC_BAL_ADMIN_API_URL')}/events/${eventId}/participants`

  return customFetch(request, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(participant),
  })
}

export async function getBalEvents(): Promise<EventType[]> {
  try {
    const response = await fetch(`${env('NEXT_PUBLIC_BAL_ADMIN_API_URL')}/events`)
    if (!response.ok) {
      throw new Error('Error while fetching bal events')
    }

    return response.json()
  }
  catch (error) {
    console.error(error)
    return []
  }
}
