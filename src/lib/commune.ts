import { BANCommune } from '@/types/api-ban.types'
import { getSignalements } from './api-signalement'
import { getPartenairesDeLaCharte } from './api-bal-admin'
import { SignalementStatusEnum } from '@/types/api-signalement.types'

export interface CommuneAchievements {
  hasPublishedBAL: boolean
  hasAbove50PercentCertifiedNumbers: boolean
  has100PercentCertifiedNumbers: boolean
  hasRegionalLanguage: boolean
  hasProcessedSignalement: boolean
  isPartenaireDeLaCharte: boolean
  hasStableID: boolean
}

export const getCommuneAchievements = async (commune: BANCommune): Promise<CommuneAchievements> => {
  const [
    paginatedSignalementsResponse,
    paginatedPartenairesDeLaCharteResponse,
  ] = await Promise.allSettled([
    getSignalements({ codeCommunes: [commune.codeCommune], status: [SignalementStatusEnum.PROCESSED, SignalementStatusEnum.IGNORED] }, 1, 1),
    getPartenairesDeLaCharte({ search: commune.nomCommune }, 1, 1),
  ])

  const paginatedSignalements = paginatedSignalementsResponse.status === 'fulfilled' ? paginatedSignalementsResponse.value : undefined
  const paginatedPartenairesDeLaCharte = paginatedPartenairesDeLaCharteResponse.status === 'fulfilled' ? paginatedPartenairesDeLaCharteResponse.value : undefined

  const communeHasBAL = commune.typeComposition !== 'assemblage'
  const certificationPercentage = Math.ceil(commune.nbNumerosCertifies / commune.nbNumeros * 100)
  const communeHasRegionalLanguage = commune.voies.some(voie => Object.keys(voie.nomVoieAlt).length >= 1)
  const hasProcessedSignalement = Boolean(paginatedSignalements && paginatedSignalements.total >= 1)
  const isPartenaireDeLaCharte = Boolean(paginatedPartenairesDeLaCharte?.data.find(partenaire => partenaire.codeCommune === commune.codeCommune))
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
