import { BANCommune, BANVoie, BANAddress } from '@/types/api-ban.types'
import { BANStats } from '@/types/api-ban.types'
import { customFetch } from './fetch'
import { env } from 'next-runtime-env'

const API_BAN_SEARCH_URL = env('NEXT_PUBLIC_API_BAN_URL')

if (!API_BAN_SEARCH_URL) {
  throw new Error('NEXT_PUBLIC_API_BAN_URL is not defined')
}

export function getAddress(idAddress: string) {
  return customFetch(`${API_BAN_SEARCH_URL}/lookup/${idAddress}`, { cache: 'force-cache' })
}

export function getBanItem(idBanItem: string, signal?: AbortSignal): Promise<BANCommune | BANVoie | BANAddress> {
  return customFetch(`${API_BAN_SEARCH_URL}/lookup/${idBanItem}`, signal ? { signal, cache: 'force-cache' } : { cache: 'force-cache' })
}

export function getStats(): Promise<BANStats> {
  return customFetch(`${API_BAN_SEARCH_URL}/ban/stats`, { cache: 'force-cache' })
}

export function getCommune(codeCommune: string, signal?: AbortSignal): Promise<BANCommune> {
  return customFetch(`${API_BAN_SEARCH_URL}/lookup/${codeCommune}`, signal ? { signal, cache: 'force-cache' } : { cache: 'force-cache' })
}

export function getCommuneWithoutCache(codeCommune: string, signal?: AbortSignal): Promise<BANCommune> {
  return customFetch(`${API_BAN_SEARCH_URL}/lookup/${codeCommune}`, {
    ...(signal && { signal }),
    cache: 'no-store',
  })
}

export function getAddressCSVLegacy(codeCommune: string) {
  return `${API_BAN_SEARCH_URL}/ban/communes/${codeCommune}/download/csv-legacy/adresses`
}

export function getLieuxDitsCSVLegacy(codeCommune: string) {
  return `${API_BAN_SEARCH_URL}/ban/communes/${codeCommune}/download/csv-legacy/lieux-dits`
}

export function getAdressesCsvBal(codeCommune: string, version = '1.3') {
  return `${API_BAN_SEARCH_URL}/ban/communes/${codeCommune}/download/csv-bal/adresses?version=${version}`
}

export function assemblageSources(voies: BANVoie[]) {
  const allSources = voies.map(voie => voie.sources).flat()
  const adressesSources = Array.from(new Set(allSources))

  const sources: Record<string, string> = {
    'cadastre': 'cadastre',
    'ftth': 'opérateurs THD',
    'insee-ril': 'INSEE',
    'ign-api-gestion-ign': 'IGN',
    'ign-api-gestion-laposte': 'La Poste',
    'ign-api-gestion-municipal_administration': 'Guichet Adresse',
    'ign-api-gestion-sdis': 'SDIS',
  }

  return adressesSources
    .filter(source => Boolean(sources[source]))
    .map(source => sources[source] || source)
}

export function getFilteredStats(codesCommune: string[]): Promise<BANStats> {
  return customFetch(`${API_BAN_SEARCH_URL}/ban/stats`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=UTF-8',
    },
    body: JSON.stringify({
      codesCommune: codesCommune || [],
    }),
  })
}

// Legacy : Fantoir :
export function getFantoir(departementCode: string) {
  return customFetch(`${API_BAN_SEARCH_URL}/api-fantoir/departements/${departementCode}/communes`, {cache: 'force-cache'})
}

export function getVoiesFantoir(communeCode: string) {
  return customFetch(`${API_BAN_SEARCH_URL}/api-fantoir/communes/${communeCode}/voies`, {cache: 'force-cache'})
}

export function getVoieFantoir(voieCode: string) {
  return customFetch(`${API_BAN_SEARCH_URL}/api-fantoir/voies/${voieCode}`, {cache: 'force-cache'})
}

export async function getIdDistrictByCodeCommune(codeCommune: string) {
  const response = await customFetch(`${API_BAN_SEARCH_URL}/api/district/cog/${codeCommune}`, {cache: 'force-cache'})
  const mainDistrict = response.response?.find((d: any) => d.meta?.insee?.isMain === true)
  return mainDistrict?.meta?.insee?.mainId || null
}
