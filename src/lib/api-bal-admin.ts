import { CandidatePartenaireDeLaCharteType, PartenaireDeLaCharteTypeEnum, PartenaireDeLaChartType } from '@/types/partenaire.types'
import { customFetch } from './fetch'
import { EventType } from '@/types/events.types'

if (!process.env.NEXT_PUBLIC_BAL_ADMIN_API_URL) {
  throw new Error('NEXT_PUBLIC_BAL_ADMIN_API_URL is not defined in the environment')
}

export async function getOnePartenairesDeLaCharte(id: string): Promise<PartenaireDeLaChartType> {
  const url = new URL(`${process.env.NEXT_PUBLIC_BAL_ADMIN_API_URL}/partenaires-de-la-charte/${id}`)

  return customFetch(url)
}

interface PartenairesDeLaCharteQuery {
  codeDepartement?: string[]
  services?: string[]
  type?: PartenaireDeLaCharteTypeEnum
  search?: string
}

export interface PaginatedPartenairesDeLaCharte {
  total: number
  totalCommunes: number
  totalOrganismes: number
  totalEntreprises: number
  data: PartenaireDeLaChartType[]
}

export const DEFAULT_PARTENAIRES_DE_LA_CHARTE_LIMIT = 8

export async function getPartenairesDeLaCharte(queryObject: PartenairesDeLaCharteQuery, page: number = 1, limit: number = DEFAULT_PARTENAIRES_DE_LA_CHARTE_LIMIT): Promise<{ total: number, totalCommunes: number, totalOrganismes: number, totalEntreprises: number, data: PartenaireDeLaChartType[] }> {
  const url = new URL(`${process.env.NEXT_PUBLIC_BAL_ADMIN_API_URL}/partenaires-de-la-charte/paginated`)
  url.searchParams.append('page', page.toString())
  url.searchParams.append('limit', limit.toString())
  Object.keys(queryObject).forEach(key => url.searchParams.append(key, queryObject[key as keyof PartenairesDeLaCharteQuery] as string))

  return customFetch(url)
}

export async function getPartenairesDeLaCharteServices(): Promise<string[]> {
  return customFetch(`${process.env.NEXT_PUBLIC_BAL_ADMIN_API_URL}/partenaires-de-la-charte/services`)
}

export async function getRandomPartenairesDeLaCharte(limit: number) {
  const url = new URL(`${process.env.NEXT_PUBLIC_BAL_ADMIN_API_URL}/partenaires-de-la-charte/random`)
  if (limit) {
    url.searchParams.append('limit', limit.toString())
  }

  return customFetch(url)
}

export async function candidateToPartenairesDeLaCharte(candidacy: CandidatePartenaireDeLaCharteType) {
  const request = `${process.env.NEXT_PUBLIC_BAL_ADMIN_API_URL}/partenaires-de-la-charte/candidate`

  return customFetch(request, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(candidacy),
  })
}

export async function getBalEvents(): Promise<EventType[]> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BAL_ADMIN_API_URL}/events`)
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
