import { customFetch } from '@/lib/fetch'
import { Revision } from '@/types/api-depot.types'

if (!process.env.NEXT_PUBLIC_API_DEPOT_URL) {
  throw new Error('NEXT_PUBLIC_API_DEPOT_URL is not defined')
}

export async function getRevisions(codeCommune: string): Promise<Revision[]> {
  const revisions = await customFetch(`${process.env.NEXT_PUBLIC_API_DEPOT_URL}/communes/${codeCommune}/revisions`)

  return revisions.sort((a: Revision, b: Revision) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  })
}

export const getRevisionDownloadUrl = (revisionId: string) => {
  return `${process.env.NEXT_PUBLIC_API_DEPOT_URL}/revisions/${revisionId}/files/bal/download`
}
