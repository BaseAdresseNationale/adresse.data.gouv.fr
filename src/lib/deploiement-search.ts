import type { DeploiementBALSearchResult } from '@/hooks/useStatsDeploiement'

type SearchType = DeploiementBALSearchResult['type']

type SearchValue = {
  code?: string
  nom?: string
  centre?: { type: string, coordinates: number[] }
  contour?: { type: string, coordinates: number[][][] }
}

function hasCenter(value: SearchValue | null | undefined): value is SearchValue & { code: string, nom: string, centre: { type: string, coordinates: number[] } } {
  return Boolean(
    value
    && value.code
    && value.nom
    && value.centre
    && Array.isArray(value.centre.coordinates)
    && value.centre.coordinates.length >= 2
  )
}

export const mapToSearchResult = (values: Array<SearchValue | null | undefined>, type: SearchType): DeploiementBALSearchResult[] => {
  if (type === 'EPCI') {
    return values
      .filter(hasCenter)
      .filter(({ contour }) => Boolean(contour))
      .map(({ code, nom, centre, contour }) => ({
        code,
        type,
        nom,
        center: { type: centre.type, coordinates: [centre.coordinates[0], centre.coordinates[1]] as [number, number] },
        contour: contour!,
      }))
  }

  return values
    .filter(hasCenter)
    .map(({ code, nom, centre }) => ({
      code,
      type,
      nom,
      center: { type: centre.type, coordinates: [centre.coordinates[0], centre.coordinates[1]] as [number, number] },
    }))
}
