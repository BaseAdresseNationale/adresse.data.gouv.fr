import { customFetch } from '@/lib/fetch'
import { Revision } from '@/types/api-depot.types'
import { getDataset } from './api-data-gouv'
import { BANCommune } from '@/types/api-ban.types'

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

const frDateFormatter = new Intl.DateTimeFormat('fr', { day: 'numeric', month: 'long', year: 'numeric' })

export const getRevisionDetails = async (revision: Revision, commune: BANCommune) => {
  let modeDePublication = '-'
  if (revision?.context?.extras?.sourceId) {
    modeDePublication = 'Moissonneur'
  }
  else if (revision?.context?.extras?.balId) {
    modeDePublication = 'Mes Adresses'
  }
  else {
    modeDePublication = 'API Dépôt'
  }

  let source = '-'
  if (modeDePublication === 'Moissonneur') {
    const sourceId = revision?.context?.extras?.sourceId
    const id: string[] = sourceId.split('-')
    const dataset = await getDataset(id[1])
    source = dataset?.organization?.name
  }
  else if (modeDePublication === 'Mes Adresses') {
    source = `Commune de ${commune.nomCommune}`
  }
  else {
    source = revision.client.nom
  }

  return [
    `le ${frDateFormatter.format(new Date(revision.createdAt))} à ${new Date(revision.createdAt).toLocaleTimeString().split(':').slice(0, 2).join(':')}`,
    modeDePublication,
    source,
    <a key={revision._id} href={getRevisionDownloadUrl(revision._id)} download>Fichier CSV</a>,
  ]
}
