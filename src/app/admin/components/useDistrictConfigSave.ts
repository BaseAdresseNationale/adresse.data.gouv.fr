import { useCallback, useEffect, useRef, useState } from 'react'

import {
  getCertificateAttestationPlaceholderError,
  sanitizeCertificateIssuerDetails,
} from '@/lib/certificate-issuer-config'
import { type BANCommune, type BANConfig, CertificateTypeEnum } from '@/types/api-ban.types'
import { type UserInfo } from '@/hooks/useAuth'
import { customFetch } from '@/lib/fetch'
import { redirectToLogoutOnSessionExpired } from '@/utils/sessionExpired'

export type SaveMessageType = 'success' | 'error' | 'info'

export interface SaveMessageAction {
  label: string
  onClick: () => void
}

export interface SaveMessage {
  text: string
  type: SaveMessageType
  /** Boutons d’appel à l’action (ex. ouvrir l’aperçu PDF si enregistrement refusé) */
  actions?: readonly SaveMessageAction[]
}

interface UseDistrictConfigSaveParams {
  district?: BANCommune | null
  userInfo?: UserInfo | null
  configState: BANConfig
  onUpdateConfig: (config: BANConfig) => void
  setCurrentConfig: (config: string) => void
  onBeforeSave?: () => void
  onSuccess?: () => void
  validateBeforeCertificateSave?: () => string | null
  /** Enrichit le message d’erreur lorsque l’aperçu certificat est obligatoire (bouton vers l’aperçu). */
  enrichCertificatePreviewError?: (message: string) => SaveMessage
}

export function useDistrictConfigSave({
  district,
  userInfo,
  configState,
  onUpdateConfig,
  setCurrentConfig,
  onBeforeSave,
  onSuccess,
  validateBeforeCertificateSave,
  enrichCertificatePreviewError,
}: UseDistrictConfigSaveParams) {
  const [message, setMessage] = useState<SaveMessage | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [saveProgress, setSaveProgress] = useState(0)
  const progressIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const clearTimers = useCallback(() => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current)
      progressIntervalRef.current = null
    }
  }, [])

  const handleSaveError = useCallback((error: unknown) => {
    if (error && typeof error === 'object' && 'status' in error && (error as { status: number }).status === 401) {
      redirectToLogoutOnSessionExpired()
      return
    }
    clearTimers()
    setSaveProgress(100)
    setIsSaving(false)
    setTimeout(() => setSaveProgress(0), 600)

    if (error && typeof error === 'object' && 'status' in error) {
      const status = (error as { status: number }).status
      if (status === 403) {
        setMessage({ text: 'La commune ne remplit pas les conditions techniques requises (identifiant BAN requis).', type: 'error' })
        return
      }
      if (status === 404) {
        setMessage({ text: 'District ou commune introuvable.', type: 'error' })
        return
      }
    }

    const detail = error && typeof error === 'object' && 'message' in error
      ? ` (${String((error as { message?: string }).message ?? '')})`
      : ''
    setMessage({
      text: `Une erreur est survenue lors de l'enregistrement.${detail}`,
      type: 'error',
    })
  }, [clearTimers])

  /** Retourne `true` seulement si la configuration a bien été enregistrée (ex. fermer l’aperçu PDF). */
  const pushConfigUpdate = useCallback(async (): Promise<boolean> => {
    const newConfig = { ...configState }
    if (typeof newConfig.certificateIssuerDetails === 'string') {
      newConfig.certificateIssuerDetails = sanitizeCertificateIssuerDetails(newConfig.certificateIssuerDetails)
    }
    const districtID = district?.banId
    if (!districtID || !userInfo) return false

    const certEnabled = newConfig.certificate != null && newConfig.certificate !== CertificateTypeEnum.DISABLED
    if (certEnabled) {
      const attestationErr = getCertificateAttestationPlaceholderError(newConfig.certificateAttestationText)
      if (attestationErr) {
        setMessage({ text: attestationErr, type: 'error' })
        return false
      }
      const certPreviewErr = validateBeforeCertificateSave?.() ?? null
      if (certPreviewErr) {
        setMessage(enrichCertificatePreviewError?.(certPreviewErr) ?? { text: certPreviewErr, type: 'error' })
        return false
      }
    }

    clearTimers()
    setSaveProgress(0)
    setMessage(null)
    setIsSaving(true)
    onBeforeSave?.()

    const startedAt = Date.now()
    progressIntervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startedAt
      setSaveProgress(Math.min(85, (85 * elapsed) / 3000))
    }, 100)

    try {
      const data = await customFetch('/api/addressing-certification-enable', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ districtID, config: newConfig }),
      }) as { response?: { config?: BANConfig } }

      const updatedConfig = data?.response?.config ?? newConfig
      clearTimers()
      setSaveProgress(100)
      onUpdateConfig(updatedConfig)
      setCurrentConfig(JSON.stringify(updatedConfig))
      setIsSaving(false)
      setTimeout(() => setSaveProgress(0), 600)
      setMessage({ text: 'Modifications enregistrées', type: 'success' })
      onSuccess?.()
      return true
    }
    catch (error) {
      handleSaveError(error)
      return false
    }
  }, [
    clearTimers,
    configState,
    district?.banId,
    handleSaveError,
    onBeforeSave,
    onSuccess,
    onUpdateConfig,
    setCurrentConfig,
    userInfo,
    validateBeforeCertificateSave,
    enrichCertificatePreviewError,
  ])

  useEffect(() => () => {
    clearTimers()
  }, [clearTimers])

  return {
    message,
    setMessage,
    isSaving,
    saveProgress,
    pushConfigUpdate,
  }
}
