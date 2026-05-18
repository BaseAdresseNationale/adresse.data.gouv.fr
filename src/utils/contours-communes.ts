import { keyBy } from 'lodash'
import { getCachedData } from './cache'
import { getRootPath } from './path'
import path from 'path'

function getFilePath() {
  const root_path = getRootPath()
  const directory_path = path.join(root_path, 'data')
  const file_name = 'communes-index.json'
  const file_path = path.join(directory_path, file_name)
  return { directory_path, file_name, file_path }
}

export async function downloadContoursCommunes() {
  const { access, mkdir, writeFile } = await import(/* webpackIgnore: true */ 'fs/promises')

  const { directory_path, file_path } = getFilePath()
  const hasDirectory = await access(directory_path).then(() => true).catch(() => false)
  if (!hasDirectory) {
    console.log('Creating data directory…')
    await mkdir(directory_path, { recursive: true })
  }
  const hasFile = await access(file_path).then(() => true).catch(() => false)
  if (hasFile) {
    console.log('Contours communes already downloaded')
    return
  }

  console.log('Downloading contours communes…')

  const response = await fetch('http://etalab-datasets.geo.data.gouv.fr/contours-administratifs/2025/geojson/communes-100m-2025-01-08.geojson', { cache: 'force-cache' })
  const responseJson = await response.json()
  const communesIndex = JSON.stringify(keyBy([...responseJson.features], (f: any) => f.properties.code))
  await writeFile(file_path, communesIndex)

  console.log('Contours communes ready')
}

async function readCommunesIndex() {
  const { readFile } = await import(/* webpackIgnore: true */ 'fs/promises')

  const { file_path } = getFilePath()

  const fileData = await readFile(file_path)

  return JSON.parse(fileData.toString())
}

export async function getContourCommune(codeCommune: string) {
  const communeIndex = await getCachedData('communes-index', readCommunesIndex)
  return communeIndex[codeCommune]
}
