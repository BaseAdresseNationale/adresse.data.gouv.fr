import { Commune } from '@/types/api-geo.types'
import { customFetch } from './fetch'

if (!process.env.NEXT_PUBLIC_API_GEO_URL) {
  throw new Error('NEXT_PUBLIC_API_GEO_URL is not defined')
}

export function getDepartements() {
  return customFetch(`${process.env.NEXT_PUBLIC_API_GEO_URL}/departements`)
}

export function isCodeDepNaive(token: string) {
  if (['2A', '2B'].includes(token)) {
    return true
  }

  return token.match(/^\d{2,3}$/)
}

export function getCommunes(args: any): Promise<Commune[]> {
  const { q, fields, limit, boost, type } = args
  const code = q.match(/^\d{5}$/) ? q : undefined
  let url = code ? `${process.env.NEXT_PUBLIC_API_GEO_URL}/communes?code=${code}` : `${process.env.NEXT_PUBLIC_API_GEO_URL}/communes?nom=${encodeURIComponent(q)}`

  if (fields) {
    url += `&fields=${fields.join(',')}`
  }

  if (limit) {
    url += `&limit=${limit}`
  }

  if (boost) {
    url += `&boost=${boost}`
  }

  if (type) {
    url += `&type=${type}`
  }

  return customFetch(url)
}
