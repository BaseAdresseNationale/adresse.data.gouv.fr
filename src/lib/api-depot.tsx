import { customFetch } from '@/lib/fetch'
import { Habilitation, Revision } from '@/types/api-depot.types'
import { getDataset } from './api-data-gouv'
import { BANCommune } from '@/types/api-ban.types'

if (!process.env.NEXT_PUBLIC_API_DEPOT_URL) {
  throw new Error('NEXT_PUBLIC_API_DEPOT_URL is not defined')
}

export async function getHabilitation(habilitationId: string, opts = { useProxy: true }): Promise<Habilitation> {
  const baseUrl = opts.useProxy ? '/api/proxy-api-depot' : `${process.env.NEXT_PUBLIC_API_DEPOT_URL}`
  const fetchOptions = opts.useProxy ? {} : { headers: { Authorization: `Token ${process.env.API_DEPOT_TOKEN}` } }

  return customFetch(`${baseUrl}/habilitations/${habilitationId}`, fetchOptions)
}

export function createHabilitation(codeCommune: string): Promise<Habilitation> {
  return customFetch(`/api/proxy-api-depot/communes/${codeCommune}/habilitations`, { method: 'POST' })
}

export function sendHabilitationPinCode(habilitationId: string) {
  return customFetch(`/api/proxy-api-depot/habilitations/${habilitationId}/authentication/email/send-pin-code`, {
    method: 'POST',
  })
}

export function validateHabilitationPinCode(habilitationId: string, code: string) {
  return customFetch(`/api/proxy-api-depot/habilitations/${habilitationId}/authentication/email/validate-pin-code`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code }),
  })
}

export async function getRevision(revisionId: string): Promise<Revision> {
  return customFetch(`${process.env.NEXT_PUBLIC_API_DEPOT_URL}/revisions/${revisionId}`)
}

export async function getCurrentRevision(codeCommune: string): Promise<Revision | undefined> {
  return customFetch(`${process.env.NEXT_PUBLIC_API_DEPOT_URL}/communes/${codeCommune}/current-revision`)
}

export async function getRevisions(codeCommune: string): Promise<Revision[]> {
  const revisions = await customFetch(`${process.env.NEXT_PUBLIC_API_DEPOT_URL}/communes/${codeCommune}/revisions`)

  return revisions.sort((a: Revision, b: Revision) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  })
}

export async function createRevision(codeCommune: string, file: File): Promise<Revision> {
  const revision: Revision = await customFetch(`/api/proxy-api-depot/communes/${codeCommune}/revisions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      context: {},
    }),
  })

  await customFetch(`/api/proxy-api-depot/revisions/${revision._id}/files/bal`, {
    method: 'PUT',
    headers: { 'Content-Type': 'text/csv' },
    body: file,
  })

  const computedRevision = await customFetch(`/api/proxy-api-depot/revisions/${revision._id}/compute`, {
    method: 'POST',
  })

  return computedRevision
}

export function publishRevision(revisionId: string, body: string) {
  return customFetch(`/api/proxy-api-depot/revisions/${revisionId}/publish`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body,
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