import { customFetch } from './fetch'
import { keyBy, groupBy } from 'lodash'
import { getContourCommune } from '../utils/contours-communes'
import { DeploiementBALSearchResult } from '@/hooks/useStatsDeploiement'
import { env } from 'next-runtime-env'

if (!env('NEXT_PUBLIC_API_BAN_URL')) {
  throw new Error('NEXT_PUBLIC_API_BAN_URL is not defined in the environment')
}

if (!env('NEXT_PUBLIC_API_DEPOT_URL')) {
  throw new Error('NEXT_PUBLIC_API_DEPOT_URL is not defined in the environment')
}

if (!env('NEXT_PUBLIC_BAL_API_URL')) {
  throw new Error('NEXT_PUBLIC_BAL_API_URL is not defined in the environment')
}

function spaceThousands(number: number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
}

function getPercentage(value: number, totalValue: number) {
  const percentage = (value * 100) / totalValue
  const roundedPercentage = Math.floor(percentage * 10) / 10
  return (roundedPercentage ? String(roundedPercentage).replace('.', ',') : roundedPercentage) || 0
}

type RevisionSummary = {
  _id: string
  codeCommune: string
  client: {
    _id: string
    id: string
    nom: string
    mandataire: string
  }
  publishedAt: string
}

type CommuneSummary = {
  codeCommune: string
  departement: string
  nbLieuxDits: number
  nbNumeros: number
  nbVoies: number
  nomCommune: string
  population: number
  region: string
  typeComposition: string
  analyseAdressage: {
    nbAdressesAttendues: number
    ratio: number
    deficitAdresses: boolean
  }
  nbNumerosCertifies: number
  composedAt: string
  dateRevision: string
  idRevision: string
}

export async function fetchStatsData() {
  const currentRevisions: RevisionSummary[] = await customFetch(`${env('NEXT_PUBLIC_API_DEPOT_URL')}/current-revisions`)
  const communesSummary: CommuneSummary[] = await customFetch(`${env('NEXT_PUBLIC_API_BAN_URL')}/api/communes-summary`)
  const bals = await customFetch(`${env('NEXT_PUBLIC_BAL_API_URL')}/stats/bals?fields=id&fields=commune&fields=status`, { method: 'POST' })

  return { currentRevisions, communesSummary, bals }
}

function computeStatusBals(bals: { status: 'published' | 'replaced' | 'draft' }[] = []) {
  if (bals.map(b => b.status).includes('published')) {
    return 'published'
  }

  if (bals.map(b => b.status).includes('replaced')) {
    return 'replaced'
  }

  if (bals.map(b => b.status).includes('draft')) {
    return 'draft'
  }

  return 'unknown'
}

export function createFeature(communeWithContour: any, currentRevisionsIndex: Record<string, RevisionSummary>, communesSummaryIndex: Record<string, any>, communesBalsIndex: Record<string, any>) {
  const { properties: { code, nom }, geometry } = communeWithContour
  const revisions = currentRevisionsIndex[code]
  const summary = communesSummaryIndex[code]
  const nbNumeros = spaceThousands(summary.nbNumeros)
  const certificationPercentage = getPercentage(summary.nbNumerosCertifies, summary.nbNumeros)
  const hasBAL = summary.typeComposition === 'bal'
  const statusBals = computeStatusBals(communesBalsIndex[code])

  const feature = {
    type: 'Feature',
    properties: {
      nom,
      code,
      nbNumeros,
      hasBAL,
      certificationPercentage,
      ...((hasBAL && revisions)
        ? {
            idClient: revisions.client._id || '',
            nomClient: revisions.client.nom || '',
          }
        : {}),
      statusBals,
    },
    geometry,
  }

  return feature
}

export async function computeStats({ currentRevisions, communesSummary, bals }: { currentRevisions: RevisionSummary[], communesSummary: CommuneSummary[], bals: any }, codesCommune: string[]) {
  const currentRevisionsIndex = keyBy(currentRevisions, 'codeCommune')
  const communesSummaryIndex = keyBy(communesSummary, 'codeCommune')
  const communesBalsIndex = groupBy(bals, 'commune')

  const communes = codesCommune?.length > 0 ? new Set(codesCommune) : new Set([...currentRevisions.map(c => c.codeCommune), ...communesSummary.map(c => c.codeCommune)])

  let communesWithContours = []
  for (const codeCommune of communes) {
    const communeWithContours = await getContourCommune(codeCommune)
    if (communeWithContours) {
      communesWithContours.push(communeWithContours)
    }
  }

  return {
    type: 'FeatureCollection',
    features: communesWithContours
      .filter(communeWithContour => communesSummaryIndex[communeWithContour.properties.code])
      .map(communeWithContour => createFeature(communeWithContour, currentRevisionsIndex, communesSummaryIndex, communesBalsIndex)),
  }
}

export const mapToSearchResult = (values: any[], type: DeploiementBALSearchResult['type']): DeploiementBALSearchResult[] => values.map(({ code, nom, centre, contour }) => ({ code, type, nom, center: centre, contour }))
