import { BaseAdresseLocale } from '@/types/api-mes-adresses.types'
import { customFetch } from './fetch'

if (!process.env.NEXT_PUBLIC_BAL_API_URL) {
  throw new Error('NEXT_PUBLIC_BAL_API_URL is not defined')
}

export async function getStatsBals(fields: string[], codeCommunes: string[]): Promise<Partial<BaseAdresseLocale>[]> {
  const url = new URL(`${process.env.NEXT_PUBLIC_BAL_API_URL}/stats/bals`)
  url.searchParams.append('fields', fields.join(','))
  return customFetch(url, {
    method: 'POST',
    body: JSON.stringify({
      codeCommunes,
    }),
  })
}

export async function getBalsStatus() {
  return customFetch(`${process.env.NEXT_PUBLIC_BAL_API_URL}/stats/bals/status`)
}
