import { customFetch } from './fetch'

export const getNewsletters = () => {
  return customFetch(`/api/brevo-newsletters`, { method: 'GET', headers: { 'Content-Type': 'application/json' },
  })
}

export const newsletterOptIn = (email: string) => {
  return customFetch(`/api/brevo-newsletters`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  })
}
