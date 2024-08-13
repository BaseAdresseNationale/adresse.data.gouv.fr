import getConfig from 'next/config'

import HttpError from './http-error'
// Import sharp from 'sharp'

const {NEXT_PUBLIC_API_ETABLISSEMENTS_PUBLIC: API_ETABLISSEMENTS_PUBLIC} = getConfig().publicRuntimeConfig
// Const {NEXT_API_URL_INCUBATEUR: API_URL_INCUBATEUR} = process.env
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
  if (!response?.results || response.results.length === 0) {
    return null
  }

  const mainMarie = response.results.find(result => !result.nom.toLowerCase().includes('mairie déléguée'))
  const rawMairie = mainMarie || response.results[0]
  const mairie = formatMairie(rawMairie)
  return mairie
}
/*
// Function to convert SVG to PNG
async function svgToPng(svgBuffer) {
  try {
    const pngBuffer = await sharp(svgBuffer).png().toBuffer()
    return `data:image/png;base64,${pngBuffer.toString('base64')}`
  } catch (error) {
    console.error('Error converting SVG to PNG:', error)
    throw error
  }
}

// Function to decode ArrayBuffer and handle the content
function decodeArrayBuffer(buffer) {
  return Buffer.from(buffer).toString('utf8')
}

// Function to get the commune logo by INSEE code
export async function getCommuneLogo(codeInsee) {
  const url = `${API_URL_INCUBATEUR}/commune/logo/${codeInsee}`
  console.log(url)

  try {
    const response = await fetch(url)
    if (response.status !== 200) {
      return null
    }

    const contentType = response.headers.get('content-type')
    const buffer = await response.arrayBuffer()

    // Decode ArrayBuffer to string
    const decodedString = decodeArrayBuffer(buffer)

    // Check if the content is Base64-encoded
    if (decodedString.startsWith('data:image/svg+xml;base64,')) {
      const base64Data = decodedString.replace('data:image/svg+xml;base64,', '')
      const svgBuffer = Buffer.from(base64Data, 'base64')

      // Convert SVG to PNG if needed
      try {
        const pngDataUrl = await svgToPng(svgBuffer)
        return pngDataUrl
      } catch (conversionError) {
        console.error('Error converting SVG to PNG:', conversionError)
        return `data:image/svg+xml;base64,${base64Data}`
      }
    }

    if (contentType.startsWith('image/')) {
      return decodedString
    }

    return null
  } catch (error) {
    console.error('Error fetching or processing logo:', error)
    return null
  }
}
*/
