/**
 * Redirige vers la déconnexion (suppression des cookies + ProConnect) lorsque la session
 * est expirée (401). À appeler depuis les flux authentifiés (favoris, notifications, etc.)
 */
export const SESSION_EXPIRED_REASON = 'session_expired'

export function redirectToLogoutOnSessionExpired(returnUrl?: string): void {
  if (typeof window === 'undefined') return
  const base = `${window.location.origin}/api/logout`
  const params = new URLSearchParams({
    returnUrl: returnUrl || '/admin',
    reason: SESSION_EXPIRED_REASON,
  })
  window.location.href = `${base}?${params.toString()}`
}
