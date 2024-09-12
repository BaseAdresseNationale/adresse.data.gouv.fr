import { keyBy } from 'lodash'

let communesIndex: Record<string, any> = {}
let ready = false

async function getRemoteFeatures(url: string) {
  const response = await fetch(url)
  const responseJson = await response.json()

  return responseJson.features
}

export async function prepareContoursCommunes() {
  console.log('Loading contours communes…')

  const communesFeatures = await getRemoteFeatures('http://etalab-datasets.geo.data.gouv.fr/contours-administratifs/2024/geojson/communes-100m.geojson')

  communesIndex = keyBy([...communesFeatures], f => f.properties.code)
  ready = true

  console.log('Contours communes ready')
}

export function getContourCommune(codeCommune: string) {
  if (!ready) {
    throw new Error('Contours communes not ready')
  }

  return communesIndex[codeCommune]
}
