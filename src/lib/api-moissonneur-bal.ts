import { customFetch } from '@/lib/fetch'
import { ExtendedSourceMoissoneurType, HarvestMoissonneurType, OrganizationMoissoneurType, RevisionMoissoneurType } from '@/types/api-moissonneur-bal.types'
import { env } from 'next-runtime-env'

if (!env('NEXT_PUBLIC_MOISSONNEUR_BAL_API_URL')) {
  throw new Error('NEXT_PUBLIC_MOISSONNEUR_BAL_API_URL is not defined in the environment')
}

export async function getOrganization(id: string): Promise<OrganizationMoissoneurType> {
  const url = new URL(`${env('NEXT_PUBLIC_MOISSONNEUR_BAL_API_URL')}/organizations/${id}`)

  return customFetch(url, { cache: 'force-cache' })
}

export async function getOrganizationSources(id: string): Promise<ExtendedSourceMoissoneurType[]> {
  const url = new URL(`${env('NEXT_PUBLIC_MOISSONNEUR_BAL_API_URL')}/organizations/${id}/sources`)

  return customFetch(url, { cache: 'force-cache' })
}

export async function getSourceHarvests(id: string, page = 1, limit = 20): Promise<{ results: HarvestMoissonneurType[], count: number }> {
  const url = `${env('NEXT_PUBLIC_MOISSONNEUR_BAL_API_URL')}/sources/${id}/harvests?` + new URLSearchParams({
    limit: String(limit),
    offset: String(limit * (page - 1)),
  })

  return customFetch(url, { cache: 'force-cache' })
}

export async function getSourceRevisions(id: string): Promise<RevisionMoissoneurType[]> {
  const url = new URL(`${env('NEXT_PUBLIC_MOISSONNEUR_BAL_API_URL')}/sources/${id}/last-updated-revisions`)

  return customFetch(url, { cache: 'force-cache' })
}

export function getFileLink(id: string) {
  return `${env('NEXT_PUBLIC_MOISSONNEUR_BAL_API_URL')}/files/${id}/download`
}
