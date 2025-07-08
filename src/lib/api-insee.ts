import { env } from 'next-runtime-env'
import { CommunePrecedente } from '@/types/api-insee.types'

if (!env('NEXT_PUBLIC_API_INSEE_URL')) {
  throw new Error('NEXT_PUBLIC_API_INSEE_URL is not defined')
}
export const getCommunesPrecedentes = async (code: string): Promise<CommunePrecedente[]> => {
  const url = new URL(`${env('NEXT_PUBLIC_API_INSEE_URL')}/metadonnees/geo/commune/${code}/precedents`)

  const response = await fetch(url, {
    headers: {
      'accept': 'application/json',
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    if (response.status === 404) {
      return []
    }

    throw new Error(`Failed to fetch communes precedentes: ${response.statusText}`)
  }

  const communesPrecedentes = await response.json() as CommunePrecedente[]

  return communesPrecedentes
}
