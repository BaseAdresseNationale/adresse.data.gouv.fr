import { env } from 'next-runtime-env'

function trimTrailingSlash(value: string) {
  return value.replace(/\/+$/, '')
}

type DeploiementBalBackendMode = 'suivi-ban' | 'adresse-local'

const DEPLOIEMENT_BAL_BACKEND_MODE: DeploiementBalBackendMode = 'suivi-ban'

const SUIVI_BAN_STATS_PATH = '/deploiement-bal/stats'
const SUIVI_BAN_TILES_PATH = '/tiles/deploiement-bal/{z}/{x}/{y}.pbf'

const ADRESSE_LOCAL_STATS_PATH = '/deploiement-stats'
const ADRESSE_LOCAL_TILES_PATH = '/deploiement-stats/{z}/{x}/{y}.pbf'

export function getSuiviBanApiBase() {
  const configuredBase = (env('NEXT_PUBLIC_SUIVI_BAN_API_URL') || 'https://suivi-ban.mut-dev.ign.fr/api').trim()
  if (configuredBase) {
    return trimTrailingSlash(configuredBase)
  }

  throw new Error('NEXT_PUBLIC_SUIVI_BAN_API_URL is required')
}

function buildApiUrl(base: string, path: string) {
  return new URL(`${base}${path}`)
}

export function getSuiviBanStatsUrl(codesCommune: string[] = []) {
  if (DEPLOIEMENT_BAL_BACKEND_MODE === 'adresse-local') {
    const searchParams = new URLSearchParams()
    if (codesCommune.length > 0) {
      searchParams.set('codesCommune', codesCommune.join(','))
    }
    const queryString = searchParams.toString()
    return queryString ? `/api${ADRESSE_LOCAL_STATS_PATH}?${queryString}` : `/api${ADRESSE_LOCAL_STATS_PATH}`
  }

  const base = getSuiviBanApiBase()
  const url = buildApiUrl(base, SUIVI_BAN_STATS_PATH)
  if (codesCommune.length > 0) {
    url.searchParams.set('codesCommune', codesCommune.join(','))
  }
  return url.toString()
}

export function getSuiviBanTilesTemplateUrl() {
  if (DEPLOIEMENT_BAL_BACKEND_MODE === 'suivi-ban') {
    return `${getSuiviBanApiBase()}${SUIVI_BAN_TILES_PATH}`
  }
  return `/api${ADRESSE_LOCAL_TILES_PATH}`
}
