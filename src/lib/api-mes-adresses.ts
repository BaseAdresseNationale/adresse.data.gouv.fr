import { BaseAdresseLocale } from '@/types/api-mes-adresses.types'
import { customFetch } from './fetch'
import { env } from 'next-runtime-env'

if (!env('NEXT_PUBLIC_BAL_API_URL')) {
  throw new Error('NEXT_PUBLIC_BAL_API_URL is not defined')
}

export async function getStatsBals(fields: string[], codeCommunes: string[]): Promise<Partial<BaseAdresseLocale>[]> {
  const url = new URL(`${env('NEXT_PUBLIC_BAL_API_URL')}/stats/bals`)
  for (const field of fields) {
    url.searchParams.append('fields', field)
  }
  const body = JSON.stringify({ codeCommunes })
  return customFetch(url, {
    method: 'POST',
    body,
    headers: {
      'Content-Type': 'application/json',
    },
  })
}

export async function getBalsStatus() {
  return customFetch(`${env('NEXT_PUBLIC_BAL_API_URL')}/stats/bals/status`)
}
