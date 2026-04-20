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

export interface SaveMessage {
  text: string
  type: SaveMessageType
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

  const pushConfigUpdate = useCallback(async () => {
    const newConfig = { ...configState }
    if (typeof newConfig.certificateIssuerDetails === 'string') {
      newConfig.certificateIssuerDetails = sanitizeCertificateIssuerDetails(newConfig.certificateIssuerDetails)
    }
    const districtID = district?.banId
    if (!districtID || !userInfo) return

    const certEnabled = newConfig.certificate != null && newConfig.certificate !== CertificateTypeEnum.DISABLED
    if (certEnabled) {
      const attestationErr = getCertificateAttestationPlaceholderError(newConfig.certificateAttestationText)
      if (attestationErr) {
        setMessage({ text: attestationErr, type: 'error' })
        return
      }
      const certPreviewErr = validateBeforeCertificateSave?.() ?? null
      if (certPreviewErr) {
        setMessage({ text: certPreviewErr, type: 'error' })
        return
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
    }
    catch (error) {
      handleSaveError(error)
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
