import { customFetch } from './fetch'

if (!process.env.NEXT_PUBLIC_API_BAN_URL) {
  throw new Error('NEXT_PUBLIC_API_BAN_URL is not defined')
}

export function getStats() {
  return customFetch(`${process.env.NEXT_PUBLIC_API_BAN_URL}/ban/stats`)
}
