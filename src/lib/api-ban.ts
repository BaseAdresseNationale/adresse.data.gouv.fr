import { BANCommune, BANVoie, BANAddress, BANConfig } from '@/types/api-ban.types'
import { BANStats } from '@/types/api-ban.types'
import { customFetch } from './fetch'
import { env } from 'next-runtime-env'

const API_BAN_SEARCH_URL = env('NEXT_PUBLIC_API_BAN_URL')

if (!API_BAN_SEARCH_URL) {
  throw new Error('NEXT_PUBLIC_API_BAN_URL is not defined')
}

export function getAddress(idAddress: string) {
  return customFetch(`${API_BAN_SEARCH_URL}/lookup/${idAddress}`)
}

export function getBanItem(idBanItem: string, signal?: AbortSignal): Promise<BANCommune | BANVoie | BANAddress> {
  return customFetch(`${API_BAN_SEARCH_URL}/lookup/${idBanItem}`, signal ? { signal } : {})
}

export function getStats(): Promise<BANStats> {
  return customFetch(`${API_BAN_SEARCH_URL}/ban/stats`)
}

export function getCommune(codeCommune: string, signal?: AbortSignal): Promise<BANCommune> {
  return customFetch(`${API_BAN_SEARCH_URL}/lookup/${codeCommune}`, signal ? { signal } : {})
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
  return customFetch(`${API_BAN_SEARCH_URL}/api-fantoir/departements/${departementCode}/communes`)
}

export function getVoiesFantoir(communeCode: string) {
  return customFetch(`${API_BAN_SEARCH_URL}/api-fantoir/communes/${communeCode}/voies`)
}

export function getVoieFantoir(voieCode: string) {
  return customFetch(`${API_BAN_SEARCH_URL}/api-fantoir/voies/${voieCode}`)
}

export async function getIdDistrictByCodeCommune(codeCommune: string) {
  const response = await customFetch(`${API_BAN_SEARCH_URL}/api/district/cog/${codeCommune}`)
  const mainDistrict = response.response?.find((d: any) => d.meta?.insee?.isMain === true)
  return mainDistrict?.meta?.insee?.mainId || null
}

/**
 * Côté serveur (token présent) : config BAN complète.
 * Côté client : GET /api/district-config — config complète si session `userinfo` avec SIREN
 * de la commune du district, sinon uniquement certificate et defaultBalLang.
 */
export async function getDistrictConfigByCodeCommune(codeCommune: string): Promise<BANConfig | null> {
  try {
    const districtId = await getIdDistrictByCodeCommune(codeCommune)
    if (!districtId) return null

    const isServer = typeof window === 'undefined'
    const token = isServer ? env('BAN_API_TOKEN') : null

    if (token) {
      const res = await fetch(`${API_BAN_SEARCH_URL}/api/district-config/${districtId}`, {
        headers: { Authorization: `Token ${token}` },
        cache: 'no-store',
      })
      if (!res.ok) return null
      const data = await res.json().catch(() => null)
      const payload = data?.response ?? data
      return (payload?.config as BANConfig) ?? null
    }
    else {
      const res = await fetch(`/api/district-config/${districtId}`, { credentials: 'same-origin' })
      if (!res.ok) return null
      const data = await res.json().catch(() => null)
      return (data?.config as BANConfig) ?? null
    }
  }
  catch {
    return null
  }
}

export interface StatutCommune {
  cog: string
  status: 'error' | 'warning' | 'success'
  label: string
  nomCommune?: string
  dateRevision?: string
  idRevision?: string
  nbVoies?: number
  nbNumeros?: number
  nbLieuxDits?: number
  nbNumerosCertifies?: number
  tauxCertifies?: number
}

export async function getStatutsCommunes(cogs: string[]): Promise<StatutCommune[]> {
  if (cogs.length === 0) return []
  try {
    const response = await customFetch(`${API_BAN_SEARCH_URL}/api/alerts/statuts-communes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cogs }),
    })
    const statuts = response?.response?.statuts ?? response?.statuts ?? []
    return Array.isArray(statuts) ? statuts : []
  }
  catch (error) {
    console.error('Error fetching statuts-communes:', error)
    return []
  }
}
