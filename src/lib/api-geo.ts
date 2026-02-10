import { Commune, Departement, EPCI } from '@/types/api-geo.types'
import { customFetch } from './fetch'
import { env } from 'next-runtime-env'

if (!env('NEXT_PUBLIC_API_GEO_URL')) {
  throw new Error('NEXT_PUBLIC_API_GEO_URL is not defined')
}

export function getDepartements(): Promise<Departement[]> {
  return customFetch(`${env('NEXT_PUBLIC_API_GEO_URL')}/departements`)
}

export function getDepartementByCode(code: string) {
  return customFetch(`${env('NEXT_PUBLIC_API_GEO_URL')}/departements/${code}`)
}

export function isCodeDepNaive(token: string) {
  if (['2A', '2B'].includes(token)) {
    return true
  }

  return token.match(/^\d{2,3}$/)
}

export function getCommune(code: string): Promise<Commune> {
  return customFetch(`${env('NEXT_PUBLIC_API_GEO_URL')}/communes/${code}`)
}

export function getEPCI(code: string, fields?: string[]): Promise<EPCI> {
  const url = new URL(`${env('NEXT_PUBLIC_API_GEO_URL')}/epcis/${code}`)

  if (fields) {
    url.searchParams.append('fields', fields.toString())
  }

  return customFetch(url)
}

export function getCommunes(args: any): Promise<Commune[]> {
  const { q, fields, limit, boost, type } = args
  const code = q.match(/^\d{5}$/) ? q : undefined
  let url = code ? `${env('NEXT_PUBLIC_API_GEO_URL')}/communes?code=${code}` : `${env('NEXT_PUBLIC_API_GEO_URL')}/communes?nom=${encodeURIComponent(q)}`

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

export function getEpcis({ q, limit, fields }: { q: string, limit: number, fields: string[] }): Promise<EPCI[]> {
  const url = new URL(`${env('NEXT_PUBLIC_API_GEO_URL')}/epcis`)

  if (q) {
    url.searchParams.append('nom', q)
  }

  if (fields) {
    url.searchParams.append('fields', fields.toString())
  }

  if (limit) {
    url.searchParams.append('limit', limit.toString())
  }

  return customFetch(url.toString())
}

export function getEpciCommunes(code: string): Promise<Commune[]> {
  return customFetch(`${env('NEXT_PUBLIC_API_GEO_URL')}/epcis/${code}/communes`)
}

export function getCommunesBySiren(siren: string): Promise<Commune[]> {
  return customFetch(`${env('NEXT_PUBLIC_API_GEO_URL')}/communes?siren=${siren}`)
}

export function getDepartementCommunes(code: string): Promise<Commune[]> {
  return customFetch(`${env('NEXT_PUBLIC_API_GEO_URL')}/departements/${code}/communes`)
}
