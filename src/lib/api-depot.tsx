import { customFetch } from '@/lib/fetch'
import { ClientApiDepotWithChefDeFileType, Habilitation, Revision } from '@/types/api-depot.types'
import { getDataset } from './api-data-gouv'
import { BANCommune } from '@/types/api-ban.types'
import { env } from 'next-runtime-env'
import Tooltip from '@/components/Tooltip'
import Link from 'next/link'

if (!env('NEXT_PUBLIC_API_DEPOT_URL')) {
  throw new Error('NEXT_PUBLIC_API_DEPOT_URL is not defined')
}

export async function getHabilitation(habilitationId: string, opts = { useProxy: true }): Promise<Habilitation> {
  const baseUrl = opts.useProxy ? '/api/proxy-api-depot' : `${env('NEXT_PUBLIC_API_DEPOT_URL')}`
  const fetchOptions = opts.useProxy ? {} : { headers: { Authorization: `Token ${env('API_DEPOT_TOKEN')}` } }

  return customFetch(`${baseUrl}/habilitations/${habilitationId}`, fetchOptions)
}

export function createHabilitation(codeCommune: string): Promise<Habilitation> {
  return customFetch(`/api/proxy-api-depot/communes/${codeCommune}/habilitations`, { method: 'POST' })
}

export function sendHabilitationPinCode(habilitationId: string, email: string) {
  return customFetch(`/api/proxy-api-depot/habilitations/${habilitationId}/authentication/email/send-pin-code`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
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
  return customFetch(`${env('NEXT_PUBLIC_API_DEPOT_URL')}/revisions/${revisionId}`)
}

export async function getCurrentRevision(codeCommune: string): Promise<Revision | undefined> {
  return customFetch(`${env('NEXT_PUBLIC_API_DEPOT_URL')}/communes/${codeCommune}/current-revision`)
}

export async function getCurrentRevisionFile(codeCommune: string): Promise<any> {
  const options: RequestInit = {
    mode: 'cors',
    method: 'GET',
  }

  return fetch(`${env('NEXT_PUBLIC_API_DEPOT_URL')}/communes/${codeCommune}/current-revision/files/bal/download`, options)
}

export async function getRevisions(codeCommune: string): Promise<Revision[]> {
  const revisions = await customFetch(`${env('NEXT_PUBLIC_API_DEPOT_URL')}/communes/${codeCommune}/revisions`)

  return revisions.sort((a: Revision, b: Revision) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  })
}

export async function getEmailsCommune(codeCommune: string): Promise<string[]> {
  return await customFetch(`${env('NEXT_PUBLIC_API_DEPOT_URL')}/communes/${codeCommune}/emails`)
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

  // Force content type to be text/csv
  // To fix application/vnd.ms-excel issue on Windows and Firefox
  const blobFile = new Blob([file as Blob], {
    type: 'text/csv',
  })

  const _file = new File([blobFile], file.name, {
    type: 'text/csv',
  })

  await customFetch(`/api/proxy-api-depot/revisions/${revision.id}/files/bal`, {
    method: 'PUT',
    headers: { 'Content-Type': 'text/csv' },
    body: _file,
  })

  const computedRevision = await customFetch(`/api/proxy-api-depot/revisions/${revision.id}/compute`, {
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
  return `${env('NEXT_PUBLIC_API_DEPOT_URL')}/revisions/${revisionId}/files/bal/download`
}

export const getCurrentRevisionDownloadUrl = (codeCommune: string) => {
  return `${env('NEXT_PUBLIC_API_DEPOT_URL')}/communes/${codeCommune}/current-revision/files/bal/download`
}

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
    try {
      const dataset = await getDataset(sourceId)
      source = dataset?.organization?.name
    }
    catch (error) {
      console.error(`Error fetching dataset ${sourceId} for commune ${commune.codeCommune}: ${error}`)
    }
  }
  else if (modeDePublication === 'Mes Adresses') {
    source = `Commune de ${commune.nomCommune}`
  }
  else {
    source = revision.client.nom
  }

  return [
    revision.isCurrent ? <Tooltip message="Révision courante"><span className="fr-icon-success-line" aria-hidden="true" /></Tooltip> : '',
    revision.publishedAt,
    modeDePublication,
    source,
    <a className="fr-btn" key={revision.id} href={getRevisionDownloadUrl(revision.id)} download><span className="fr-icon-download-line" aria-hidden="true" /></a>,
    <Link key={revision.id} style={{ color: 'var(--text-action-high-blue-france)' }} href={`/outils/validateur-bal?file=${getRevisionDownloadUrl(revision.id)}`}>Rapport de validation</Link>,
  ]
}

export const getClientWithChefDeFile = async (clientId: string): Promise<ClientApiDepotWithChefDeFileType> => {
  const client = await customFetch(`${env('NEXT_PUBLIC_API_DEPOT_URL')}/clients/${clientId}`)
  const chefDeFile = await customFetch(`${env('NEXT_PUBLIC_API_DEPOT_URL')}/chefs-de-file/${(client as any).chefDeFileId}`)

  return { ...client, chefDeFile }
}

export const getFirstRevisionsByClient = async (clientId: string): Promise<any> => {
  const revisions = await customFetch(`${env('NEXT_PUBLIC_API_DEPOT_URL')}/revisions/client/${clientId}`)

  return revisions
}

export const getUrlProConnect = (
  habiliationId: string,
  redirectUrl: string
): string => {
  return `${env('NEXT_PUBLIC_API_DEPOT_URL')}/habilitations/${habiliationId}/authentication/proconnect?redirectUrl=${redirectUrl}`
}