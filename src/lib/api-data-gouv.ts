import { customFetch } from './fetch'
import { env } from 'next-runtime-env'

if (!env('NEXT_PUBLIC_DATAGOUV_URL')) {
  throw new Error('NEXT_PUBLIC_DATAGOUV_URL is not defined')
}

export function getDataset(datasetId: string) {
  return customFetch(`${env('NEXT_PUBLIC_DATAGOUV_URL')}/datasets/${datasetId}`)
}
