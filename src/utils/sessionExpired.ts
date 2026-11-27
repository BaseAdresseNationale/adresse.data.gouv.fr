import { logout } from '@/utils/logout'

/**
 * Redirige vers la déconnexion (révocation, suppression des cookies + ProConnect) lorsque la session
 * est expirée (401). À appeler depuis les flux authentifiés (favoris, notifications, etc.)
 */
export const SESSION_EXPIRED_REASON = 'session_expired'

export function redirectToLogoutOnSessionExpired(returnUrl?: string): void {
  if (typeof window === 'undefined') return
  void logout({ returnUrl: returnUrl || '/admin', reason: SESSION_EXPIRED_REASON })
}
