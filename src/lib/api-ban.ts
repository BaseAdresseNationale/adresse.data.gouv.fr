import { customFetch } from './fetch'
import getConfig from 'next/config'

const { publicRuntimeConfig } = getConfig()

if (!publicRuntimeConfig.NEXT_PUBLIC_API_BAN_URL) {
  throw new Error('NEXT_PUBLIC_API_BAN_URL is not defined')
}

export function getStats() {
  return customFetch(`${publicRuntimeConfig.NEXT_PUBLIC_API_BAN_URL}/ban/stats`)
}
