
import getConfig from 'next/config'

const {NEXT_PUBLIC_MOISSONNEUR_BAL_API_URL: MOISSONNEUR_BAL_API_URL} = getConfig().publicRuntimeConfig

if (!MOISSONNEUR_BAL_API_URL) {
  throw new Error('MOISSONNEUR_BAL_API_URL is not defined in the environment')
}

export async function getOrganization(id) {
  const url = new URL(`${MOISSONNEUR_BAL_API_URL}/organizations/${id}`)

  const response = await fetch(url)

  if (!response.ok) {
    throw new Error('Error while fetching partners')
  }

  return response.json()
}

export async function getOrganizationSources(id) {
  const url = new URL(`${MOISSONNEUR_BAL_API_URL}/organizations/${id}/sources`)

  const response = await fetch(url)

  if (!response.ok) {
    throw new Error('Error while fetching partners')
  }

  return response.json()
}

export async function getSourceHarvests(id, page = 1, limit = 20) {
  const url = `${MOISSONNEUR_BAL_API_URL}/sources/${id}/harvests?` + new URLSearchParams({
    limit: String(limit),
    offset: String(limit * (page - 1)),
  })

  const response = await fetch(url)

  if (!response.ok) {
    throw new Error('Error while fetching partners')
  }

  return response.json()
}

export async function getSourceRevisions(id) {
  const url = new URL(`${MOISSONNEUR_BAL_API_URL}/sources/${id}/last-updated-revisions`)

  const response = await fetch(url)

  if (!response.ok) {
    throw new Error('Error while fetching partners')
  }

  return response.json()
}

export function getFileLink(fileId) {
  return `${MOISSONNEUR_BAL_API_URL}/files/${fileId}/download`
}
