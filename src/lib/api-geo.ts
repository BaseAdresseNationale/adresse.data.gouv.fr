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
  const { q, departement, fields, limit, boost, type } = args
  const codeDepFilter = departement ? `&codeDepartement=${departement}` : ''
  const nom = departement ? q.split(' ').filter((t: string) => !isCodeDepNaive(t)).join(' ') : q
  let url = `${process.env.NEXT_PUBLIC_API_GEO_URL}/communes?nom=${encodeURIComponent(nom)}${codeDepFilter}`

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
