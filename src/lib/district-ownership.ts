import type { Identity } from '@/lib/identity'

/**
 * Résolution du SIREN de la commune associée à un district BAN (cache + API Geo).
 * Utilisé pour vérifier qu’un utilisateur authentifié agit pour la bonne commune.
 */

type Cached = { siren: string, expiresAt: number }
const ownershipCache = new Map<string, Cached>()
const CACHE_TTL_MS = 5 * 60 * 1000

export function getCachedCommuneSirenForDistrict(districtId: string): string | null {
  const entry = ownershipCache.get(districtId)
  if (!entry || Date.now() > entry.expiresAt) {
    ownershipCache.delete(districtId)
    return null
  }
  return entry.siren
}

export function setCachedCommuneSirenForDistrict(districtId: string, siren: string) {
  ownershipCache.set(districtId, { siren, expiresAt: Date.now() + CACHE_TTL_MS })
}

export type ResolveDistrictCommuneSirenResult =
  | { status: 'ok', siren: string }
  | { status: 'forbidden' }
  | { status: 'unavailable' }

/**
 * Résout le SIREN INSEE de la commune du district (cog → API Geo).
 */
export async function resolveCommuneSirenForDistrictId(
  districtId: string,
  banUrl: string,
  geoUrl: string,
): Promise<ResolveDistrictCommuneSirenResult> {
  const cached = getCachedCommuneSirenForDistrict(districtId)
  if (cached) return { status: 'ok', siren: cached }

  let districtRes: Response
  try {
    districtRes = await fetch(`${banUrl}/api/district/${districtId}`, { cache: 'no-store' })
  }
  catch {
    return { status: 'unavailable' }
  }

  if (!districtRes.ok) {
    return districtRes.status >= 500 ? { status: 'unavailable' } : { status: 'forbidden' }
  }

  const districtData = await districtRes.json().catch(() => null)
  const codeCommune = (
    (typeof districtData?.response?.meta?.insee?.cog === 'string' && districtData.response.meta.insee.cog)
    || (typeof districtData?.meta?.insee?.cog === 'string' && districtData.meta.insee.cog)
    || null
  )
  if (!codeCommune) {
    return { status: 'unavailable' }
  }

  let geoRes: Response
  try {
    geoRes = await fetch(`${geoUrl}/communes/${codeCommune}`, { cache: 'no-store' })
  }
  catch {
    return { status: 'unavailable' }
  }

  if (!geoRes.ok) {
    return { status: 'unavailable' }
  }

  const geoData = await geoRes.json().catch(() => null)
  const siren = typeof geoData?.siren === 'string' ? geoData.siren : ''
  if (!siren) {
    return { status: 'unavailable' }
  }

  setCachedCommuneSirenForDistrict(districtId, siren)
  return { status: 'ok', siren }
}

/** SIREN des 9 premiers caractères du SIRET de l'agent connecté. */
export function getSirenFromIdentity(identity: Identity | null): string | null {
  const siret = identity?.siret ?? ''
  const siren = siret.slice(0, 9)
  return siren.length === 9 ? siren : null
}
