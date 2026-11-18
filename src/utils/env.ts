import { unstable_noStore as noStore } from 'next/cache'

export const PUBLIC_ENV_KEY = '__ENV'

/**
 * Lit une variable d'environnement à l'exécution (et non au build).
 * - Serveur : toute variable de process.env (y compris les secrets, qui ne sont jamais envoyés au client).
 * - Navigateur : uniquement les variables NEXT_PUBLIC_* injectées dans window.__ENV par <PublicEnvScript />.
 */
export function env(key: string): string | undefined {
  if (typeof window !== 'undefined') {
    if (!key.startsWith('NEXT_PUBLIC_')) {
      throw new Error(`Environment variable '${key}' is not public and cannot be accessed in the browser.`)
    }
    return (window as unknown as Record<string, Record<string, string | undefined>>)[PUBLIC_ENV_KEY]?.[key]
  }

  // Empêche le rendu statique de figer la valeur au moment du build
  noStore()
  return process.env[key]
}
