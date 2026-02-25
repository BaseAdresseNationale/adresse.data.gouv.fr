import { BANCommune } from '@/types/api-ban.types'
import { PaginatedSignalements } from '@/types/api-signalement.types'
import { PartenaireDeLaChartType } from '@/types/partenaire.types'

type GetCommuneAchievementsParams = {
  commune: BANCommune
  partenairesDeLaCharte?: PartenaireDeLaChartType[]
  paginatedSignalements?: PaginatedSignalements
}

export interface CommuneAchievements {
  hasPublishedBAL: boolean
  hasAbove50PercentCertifiedNumbers: boolean
  has100PercentCertifiedNumbers: boolean
  hasRegionalLanguage: boolean
  hasProcessedSignalement: boolean
  isPartenaireDeLaCharte: boolean
  hasStableID: boolean
}

export const getCommuneAchievements = ({ commune, partenairesDeLaCharte, paginatedSignalements }: GetCommuneAchievementsParams): CommuneAchievements => {
  const communeHasBAL = commune.typeComposition !== 'assemblage'
  const certificationPercentage = Math.ceil(commune.nbNumerosCertifies / commune.nbNumeros * 100)
  const communeHasRegionalLanguage = commune.voies
    .filter(voie => Boolean(voie.nomVoieAlt))
    .some(voie => Object.keys(voie.nomVoieAlt).length >= 1)
  const hasProcessedSignalement = Boolean(paginatedSignalements && paginatedSignalements.total >= 1)
  const isPartenaireDeLaCharte = Boolean(partenairesDeLaCharte?.find(partenaire => partenaire.codeCommune === commune.codeCommune))
  const hasStableID = Boolean(commune.banId)

  return {
    hasPublishedBAL: communeHasBAL,
    hasAbove50PercentCertifiedNumbers: certificationPercentage >= 50,
    has100PercentCertifiedNumbers: certificationPercentage === 100,
    hasRegionalLanguage: communeHasRegionalLanguage,
    hasProcessedSignalement: hasProcessedSignalement,
    isPartenaireDeLaCharte: isPartenaireDeLaCharte,
    hasStableID,
  }
}
