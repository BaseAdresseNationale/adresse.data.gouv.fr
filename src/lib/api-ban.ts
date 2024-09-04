import { BANCommune } from '@/types/api-ban.types'
import { customFetch } from './fetch'

if (!process.env.NEXT_PUBLIC_API_BAN_URL) {
  throw new Error('NEXT_PUBLIC_API_BAN_URL is not defined')
}

export function getStats() {
  return customFetch(`${process.env.NEXT_PUBLIC_API_BAN_URL}/ban/stats`)
}

export function getCommune(codeCommune: string): Promise<BANCommune> {
  return customFetch(`${process.env.NEXT_PUBLIC_API_BAN_URL}/lookup/${codeCommune}`)
}

export function getAddressCSVLegacy(codeCommune: string) {
  return `${process.env.NEXT_PUBLIC_API_BAN_URL}/ban/communes/${codeCommune}/download/csv-legacy/adresses`
}

export function getLieuxDitsCSVLegacy(codeCommune: string) {
  return `${process.env.NEXT_PUBLIC_API_BAN_URL}/ban/communes/${codeCommune}/download/csv-legacy/lieux-dits`
}

export function getAdressesCsvBal(codeCommune: string, version = '1.3') {
  return `${process.env.NEXT_PUBLIC_API_BAN_URL}/ban/communes/${codeCommune}/download/csv-bal/adresses?version=${version}`
}
