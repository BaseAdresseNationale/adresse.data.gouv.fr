let logoutFailed = false
const failureListeners = new Set<() => void>()

function setLogoutFailed(value: boolean): void {
  logoutFailed = value
  failureListeners.forEach(listener => listener())
}

export const hasLogoutFailed = (): boolean => logoutFailed

export function subscribeToLogoutFailure(listener: () => void): () => void {
  failureListeners.add(listener)
  return () => failureListeners.delete(listener)
}

export const dismissLogoutFailure = (): void => setLogoutFailed(false)

type LogoutRequest = { returnUrl: string, reason?: string }

async function requestLogoutRedirect({ returnUrl, reason }: LogoutRequest): Promise<string | null> {
  try {
    const response = await fetch('/api/logout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ returnUrl, reason }),
    })
    if (!response.ok) {
      console.error('Déconnexion refusée', response.status)
      return null
    }
    const { redirectUrl } = await response.json() as { redirectUrl?: unknown }
    return typeof redirectUrl === 'string' ? redirectUrl : null
  }
  catch (error) {
    console.error('Déconnexion impossible', error)
    return null
  }
}

// En cas d'échec le navigateur reste sur la page : seul le serveur efface les cookies HttpOnly, partir ferait croire à une déconnexion.
export async function logout({ returnUrl, reason }: LogoutRequest): Promise<void> {
  setLogoutFailed(false)
  const redirectUrl = await requestLogoutRedirect({ returnUrl, reason })
  if (redirectUrl) {
    window.location.assign(redirectUrl)
    return
  }
  setLogoutFailed(true)
}
