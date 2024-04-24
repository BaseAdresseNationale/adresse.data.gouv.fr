import getConfig from 'next/config'

import HttpError from './http-error'

const {NEXT_PUBLIC_API_ETABLISSEMENTS_PUBLIC: API_ETABLISSEMENTS_PUBLIC} = getConfig().publicRuntimeConfig

if (!API_ETABLISSEMENTS_PUBLIC) {
  throw new Error('API_ETABLISSEMENTS_PUBLIC is not defined in the environment')
}

export async function _fetch(url) {
  const options = {
    mode: 'cors',
    method: 'GET'
  }

  const response = await fetch(url, options)
  const contentType = response.headers.get('content-type')

  if (!response.ok) {
    throw new HttpError(response)
  }

  if (response.ok && contentType && contentType.includes('application/json')) {
    return response.json()
  }

  throw new Error('Une erreur est survenue')
}

const formatMairie = rawMairie => {
  return {
    nom: rawMairie.nom,
    telephone: rawMairie.telephone ? JSON.parse(rawMairie.telephone)[0]?.valeur : undefined,
    email: rawMairie.adresse_courriel,
    horaires: rawMairie.plage_ouverture ? JSON.parse(rawMairie.plage_ouverture).map(openingRange => formatOpeningRange(openingRange)) : undefined
  }
}

const formatOpeningRange = openingRange => {
  return {
    du: openingRange.nom_jour_debut,
    au: openingRange.nom_jour_fin,
    heures: formatOpeningHourRange(openingRange)
  }
}

const formatOpeningHourRange = openingRange => {
  const totalTimeRange = Object.entries(openingRange).filter(([key, value]) => key.includes('valeur_heure_debut') && value).length
  const openingTimeRanges = []
  for (let i = 1; i <= totalTimeRange; i++) {
    openingTimeRanges.push({
      de: openingRange[`valeur_heure_debut_${i}`],
      a: openingRange[`valeur_heure_fin_${i}`]
    })
  }

  return openingTimeRanges
}

export async function getMairie(codeCommune) {
  // Documentation : https://api-lannuaire.service-public.fr/explore/dataset/api-lannuaire-administration/information/
  const route = 'catalog/datasets/api-lannuaire-administration/records'
  const query = `select=plage_ouverture,nom,telephone,adresse_courriel&where=code_insee_commune="${codeCommune}" and pivot LIKE "mairie"`
  const url = `${API_ETABLISSEMENTS_PUBLIC}/${route}?${query}`

  const response = await _fetch(url)
  const rawMairie = response?.results?.[0]
  if (!rawMairie) {
    return null
  }

  const mairie = formatMairie(rawMairie)
  return mairie
}
