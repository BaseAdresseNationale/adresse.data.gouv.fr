import { writeFileSync, readFile, existsSync, mkdirSync } from 'fs'
import { keyBy } from 'lodash'
import { getCachedData } from './cache'
import { fileURLToPath } from 'url'
import path from 'path'

function getFilePath() {
  const __filename = fileURLToPath(import.meta.url)
  const __dirname = path.dirname(__filename)
  const root_path = path.resolve(__dirname, '../..')
  const directory_path = `${root_path}/data`
  const file_name = 'communes-index.json'
  const file_path = `${directory_path}/${file_name}`
  return { directory_path, file_name, file_path }
}

export async function downloadContoursCommunes() {
  const { directory_path, file_path } = getFilePath()
  if (!existsSync(directory_path)) {
    console.log('Creating data directory…')
    mkdirSync(directory_path, { recursive: true })
  }
  if (existsSync(file_path)) {
    console.log('Contours communes already downloaded')
    return
  }

  console.log('Downloading contours communes…')

  const response = await fetch('http://etalab-datasets.geo.data.gouv.fr/contours-administratifs/2024/geojson/communes-100m.geojson')
  const responseJson = await response.json()
  const communesIndex = JSON.stringify(keyBy([...responseJson.features], f => f.properties.code))
  writeFileSync(file_path, communesIndex)

  console.log('Contours communes ready')
}

async function readCommunesIndex() {
  const { file_path } = getFilePath()

  const fileData: Buffer = await new Promise((resove, reject) => {
    readFile(file_path, (err, data) => {
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
