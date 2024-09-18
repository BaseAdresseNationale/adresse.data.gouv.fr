import { customFetch } from './fetch'

if (!process.env.NEXT_PUBLIC_DATAGOUV_URL) {
  throw new Error('NEXT_PUBLIC_DATAGOUV_URL is not defined')
}

export function getDataset(datasetId: string) {
  return customFetch(`${process.env.NEXT_PUBLIC_DATAGOUV_URL}/datasets/${datasetId}`)
}
