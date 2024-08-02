import { PartenaireDeLaCharteTypeEnum, PartenaireDeLaChartType } from '@/types/partenaire.types'
import { customFetch } from './fetch'

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
}

export async function getPartenairesDeLaCharte(queryObject: PartenairesDeLaCharteQuery): Promise<PartenaireDeLaChartType[]> {
  const url = new URL(`${process.env.NEXT_PUBLIC_BAL_ADMIN_API_URL}/partenaires-de-la-charte`)
  Object.keys(queryObject).forEach(key => url.searchParams.append(key, queryObject[key]))

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

// TODO fix type
export async function candidateToPartenairesDeLaCharte(candidacy: any) {
  const request = `${process.env.NEXT_PUBLIC_BAL_ADMIN_API_URL}/partenaires-de-la-charte/candidate`

  return customFetch(request, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(candidacy),
  })
}

// export async function getBalEvents() {
//   try {
//     const response = await fetch(`${process.env.NEXT_PUBLIC_BAL_ADMIN_API_URL}/events`)
//     if (!response.ok) {
//       throw new Error('Error while fetching bal events')
//     }

//     return response.json()
//   }
//   catch (error) {
//     console.error(error)
//     return []
//   }
// }
