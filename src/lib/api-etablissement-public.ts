import { APIEtablissementPublicMairie } from '@/types/api-etablissement-public.types'
import { customFetch } from './fetch'

if (!process.env.NEXT_PUBLIC_API_ETABLISSEMENTS_PUBLIC) {
  throw new Error('NEXT_PUBLIC_API_ETABLISSEMENTS_PUBLIC is not defined')
}

const formatMairie = (rawMairie: any) => {
  return {
    nom: rawMairie.nom,
    telephone: rawMairie.telephone ? JSON.parse(rawMairie.telephone)[0]?.valeur : undefined,
    email: rawMairie.adresse_courriel,
    horaires: rawMairie.plage_ouverture ? JSON.parse(rawMairie.plage_ouverture).map((openingRange: any) => formatOpeningRange(openingRange)) : undefined,
  }
}

const formatOpeningRange = (openingRange: any) => {
  return {
    du: openingRange.nom_jour_debut,
    au: openingRange.nom_jour_fin,
    heures: formatOpeningHourRange(openingRange),
  }
}

const formatOpeningHourRange = (openingRange: any) => {
  const totalTimeRange = Object.entries(openingRange).filter(([key, value]) => key.includes('valeur_heure_debut') && value).length
  const openingTimeRanges = []
  for (let i = 1; i <= totalTimeRange; i++) {
    openingTimeRanges.push({
      de: openingRange[`valeur_heure_debut_${i}`],
      a: openingRange[`valeur_heure_fin_${i}`],
    })
  }

  return openingTimeRanges
}

export async function getMairie(codeCommune: string) {
  // Documentation : https://api-lannuaire.service-public.fr/explore/dataset/api-lannuaire-administration/information/
  const route = 'catalog/datasets/api-lannuaire-administration/records'
  const query = `select=plage_ouverture,nom,telephone,adresse_courriel&where=code_insee_commune="${codeCommune}" and pivot LIKE "mairie"`
  const url = `${process.env.NEXT_PUBLIC_API_ETABLISSEMENTS_PUBLIC}/${route}?${query}`

  const response = await customFetch(url)
  if (!response?.results || response.results.length === 0) {
    return null
  }

  const mainMarie = response.results.find((result: APIEtablissementPublicMairie) => !result.nom.toLowerCase().includes('mairie déléguée'))
  const rawMairie: APIEtablissementPublicMairie = mainMarie || response.results[0]
  const mairie = formatMairie(rawMairie)
  return mairie
}
