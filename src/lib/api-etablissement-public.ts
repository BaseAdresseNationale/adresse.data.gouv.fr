import { APIEtablissementPublicMairie } from '@/types/api-etablissement-public.types'
import { customFetch } from './fetch'
import { env } from 'next-runtime-env'
if (!env('NEXT_PUBLIC_API_ETABLISSEMENTS_PUBLIC')) {
  throw new Error('NEXT_PUBLIC_API_ETABLISSEMENTS_PUBLIC is not defined')
}

export async function getMairiePageURL(codeCommune: string) {
  // Documentation : https://api-lannuaire.service-public.fr/explore/dataset/api-lannuaire-administration/information/
  const route = 'catalog/datasets/api-lannuaire-administration/records'
  const query = `select=nom,url_service_public&where=code_insee_commune="${codeCommune}" and pivot LIKE "mairie"`
  const url = `${env('NEXT_PUBLIC_API_ETABLISSEMENTS_PUBLIC')}/${route}?${query}`

  const response: { results: APIEtablissementPublicMairie[] } = await customFetch(url)
  if (!response?.results || response.results.length === 0) {
    return null
  }

  const mainMarie = response.results.find(result => !result.nom.toLowerCase().includes('mairie déléguée'))
  const rawMairie = mainMarie || response.results[0]

  return rawMairie.url_service_public
}

interface MairieResponse {
  nom: string
  telephone?: string
  adresse_courriel?: string
  plage_ouverture?: string
}

interface FormattedMairie {
  nom: string
  telephone?: string
  email?: string
  horaires?: FormattedOpeningRange[]
}

interface FormattedOpeningRange {
  du: string
  au: string
  heures: OpeningHourRange[]
}

interface OpeningHourRange {
  de: string
  a: string
}

const formatMairie = (rawMairie: MairieResponse): FormattedMairie => {
  return {
    nom: rawMairie.nom,
    telephone: rawMairie.telephone ? JSON.parse(rawMairie.telephone)[0]?.valeur : undefined,
    email: rawMairie.adresse_courriel,
    horaires: rawMairie.plage_ouverture
      ? JSON.parse(rawMairie.plage_ouverture).map(formatOpeningRange)
      : undefined,
  }
}

const formatOpeningRange = (openingRange: any): FormattedOpeningRange => {
  return {
    du: openingRange.nom_jour_debut,
    au: openingRange.nom_jour_fin,
    heures: formatOpeningHourRange(openingRange),
  }
}

const formatOpeningHourRange = (openingRange: any): OpeningHourRange[] => {
  const totalTimeRange = Object.entries(openingRange).filter(([key]) => key.includes('valeur_heure_debut')).length
  const openingTimeRanges: OpeningHourRange[] = []

  for (let i = 1; i <= totalTimeRange; i++) {
    openingTimeRanges.push({
      de: openingRange[`valeur_heure_debut_${i}`],
      a: openingRange[`valeur_heure_fin_${i}`],
    })
  }

  return openingTimeRanges
}

export async function getMairie(codeCommune: string): Promise<FormattedMairie | null> {
  // Documentation : https://api-lannuaire.service-public.fr/explore/dataset/api-lannuaire-administration/information/
  const route = 'catalog/datasets/api-lannuaire-administration/records'
  const query = `select=plage_ouverture,nom,telephone,adresse_courriel&where=code_insee_commune="${codeCommune}" and pivot LIKE "mairie"`
  const url = `${env('NEXT_PUBLIC_API_ETABLISSEMENTS_PUBLIC')}/${route}?${query}`

  const response: { results: MairieResponse[] } = await customFetch(url)
  if (!response?.results || response.results.length === 0) {
    return null
  }

  const mainMarie = response.results.find(result => !result.nom.toLowerCase().includes('mairie déléguée'))
  const rawMairie = mainMarie || response.results[0]
  const mairie = formatMairie(rawMairie)
  return mairie
}
