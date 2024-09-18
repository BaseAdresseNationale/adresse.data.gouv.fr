import { APIEtablissementPublicMairie } from '@/types/api-etablissement-public.types'
import { customFetch } from './fetch'

if (!process.env.NEXT_PUBLIC_API_ETABLISSEMENTS_PUBLIC) {
  throw new Error('NEXT_PUBLIC_API_ETABLISSEMENTS_PUBLIC is not defined')
}

export async function getMairiePageURL(codeCommune: string) {
  // Documentation : https://api-lannuaire.service-public.fr/explore/dataset/api-lannuaire-administration/information/
  const route = 'catalog/datasets/api-lannuaire-administration/records'
  const query = `select=nom,url_service_public&where=code_insee_commune="${codeCommune}" and pivot LIKE "mairie"`
  const url = `${process.env.NEXT_PUBLIC_API_ETABLISSEMENTS_PUBLIC}/${route}?${query}`

  const response: { results: APIEtablissementPublicMairie[] } = await customFetch(url)
  if (!response?.results || response.results.length === 0) {
    return null
  }

  const mainMarie = response.results.find(result => !result.nom.toLowerCase().includes('mairie déléguée'))
  const rawMairie = mainMarie || response.results[0]

  return rawMairie.url_service_public
}
