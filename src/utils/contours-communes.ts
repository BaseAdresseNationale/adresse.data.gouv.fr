import { writeFileSync, readFile, existsSync } from 'fs'
import { keyBy } from 'lodash'
import { getCachedData } from './cache'

const FILE_PATH = 'public/communes-index.json'

export async function downloadContoursCommunes() {
  if (existsSync(FILE_PATH)) {
    console.log('Contours communes already downloaded')
    return
  }

  console.log('Downloading contours communes…')

  const response = await fetch('http://etalab-datasets.geo.data.gouv.fr/contours-administratifs/2024/geojson/communes-100m.geojson')
  const responseJson = await response.json()
  const communesIndex = JSON.stringify(keyBy([...responseJson.features], f => f.properties.code))
  writeFileSync(FILE_PATH, communesIndex)

  console.log('Contours communes ready')
}

async function readCommunesIndex() {
  const fileData: Buffer = await new Promise((resove, reject) => {
    readFile(FILE_PATH, (err, data) => {
      if (err) {
        reject(err)
      }
      resove(data)
    })
  })

  return JSON.parse(fileData.toString())
}

export async function getContourCommune(codeCommune: string) {
  const communeIndex = await getCachedData('communes-index', readCommunesIndex)
  return communeIndex[codeCommune]
}