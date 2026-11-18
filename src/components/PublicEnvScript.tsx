import { connection } from 'next/server'
import { PUBLIC_ENV_KEY } from '@/utils/env'

/** Expose au navigateur les seules variables NEXT_PUBLIC_* lues à l'exécution du serveur. */
export async function PublicEnvScript() {
  await connection()

  const publicEnv = Object.fromEntries(
    Object.entries(process.env).filter(([key]) => key.startsWith('NEXT_PUBLIC_')),
  )
  // Échappe '<' pour qu'une valeur ne puisse pas fermer la balise <script>
  const json = JSON.stringify(publicEnv).replace(/</g, '\\u003c')

  return <script dangerouslySetInnerHTML={{ __html: `window['${PUBLIC_ENV_KEY}'] = ${json}` }} />
}
