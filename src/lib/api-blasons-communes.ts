import { env } from 'next-runtime-env'

const BAL_BLASON_BUCKET_URL
  = `https://${env('NEXT_PUBLIC_BAL_BLASONS_BUCKET_S3') || 'base-adresse-locale-prod-blasons-communes.s3.fr-par.scw.cloud'}`

export const getCommuneFlagProxy = async (codeCommune: string): Promise<string> => {
  const base = env('NEXT_PUBLIC_API_ANNUAIRE_DES_COLLECTIVITES') || 'https://api.collectivite.fr/api'
  if (base) {
    try {
      const response = await fetch(`${base}/commune/logo/${codeCommune}`, { cache: 'force-cache' })
      const url = await response.json()
      const { logo: urlLogo, blason: urlBlason } = url
      // On récupère le logo de la commune
      if (response.ok && urlLogo) {
        return urlLogo
      }
      // Sinon le blason de la commune
      if (response.ok && urlBlason) {
        return urlBlason
      }
    }
    catch {
      // CORS ou erreur réseau → fallback S3
    }
  }
  // Pas de fetch HEAD : CORS bloque côté client. L'img charge directement l'URL S3.
  return `${BAL_BLASON_BUCKET_URL}/${codeCommune}.svg`
}
