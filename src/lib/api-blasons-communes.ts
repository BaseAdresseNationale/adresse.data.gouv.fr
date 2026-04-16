import { env } from 'next-runtime-env'

const BAL_BLASON_BUCKET_URL
  = `https://${env('NEXT_PUBLIC_BAL_BLASONS_BUCKET_S3') || 'base-adresse-locale-prod-blasons-communes.s3.fr-par.scw.cloud'}`

const isWikimediaUrl = (url: string): boolean =>
  /wikimedia|wikidata|wikipedia\.org/i.test(url)

// Côté client uniquement : annuaire (navigateur) puis fallback S3.
export const getCommuneFlagProxy = async (codeCommune: string): Promise<string> => {
  const base = env('NEXT_PUBLIC_API_ANNUAIRE_DES_COLLECTIVITES') || 'https://api.collectivite.fr/api'
  if (base) {
    try {
      const response = await fetch(`${base}/commune/logo/${codeCommune}`, { cache: 'force-cache' })
      const url = await response.text()
      const isValidUrl = Boolean(
        url && (url.startsWith('http') || url.startsWith('data:image')),
      )
      if (response.ok && isValidUrl && !isWikimediaUrl(url)) {
        return url
      }
    }
    catch {
      // CORS ou erreur réseau → fallback S3
    }
  }
  // Pas de fetch HEAD : CORS bloque côté client. L'img charge directement l'URL S3.
  return `${BAL_BLASON_BUCKET_URL}/${codeCommune}.svg`
}
