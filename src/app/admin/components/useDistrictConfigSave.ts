import { useCallback, useEffect, useRef, useState } from 'react'

import { type BANCommune } from '@/types/api-ban.types'
import { type UserInfo } from '@/hooks/useAuth'
import { customFetch } from '@/lib/fetch'
import { getCommuneWithoutCache } from '@/lib/api-ban'

const NO_QUICK_ERROR_MS = 20000
const POLL_INTERVAL_MS = 10000
const POLL_MAX_MS = 10 * 60 * 1000
const ESTIMATED_DURATION_BASE_MS = 25000
const ESTIMATED_DURATION_PER_NUMERO_MS = 1.2
const ESTIMATED_DURATION_MAX_MS = 120000

function estimateDurationMs(nbNumeros: number): number {
  return Math.min(
    ESTIMATED_DURATION_MAX_MS,
    ESTIMATED_DURATION_BASE_MS + nbNumeros * ESTIMATED_DURATION_PER_NUMERO_MS,
  )
}

export type SaveMessageType = 'success' | 'error' | 'info'

export interface SaveMessage {
  text: string
  type: SaveMessageType
}

interface UseDistrictConfigSaveParams {
  district?: BANCommune | null
  userInfo?: UserInfo | null
  config: BANCommune['config']
  configState: BANCommune['config']
  onUpdateConfig: (config: BANCommune['config']) => void
  setCurrentConfig: (config: string) => void
  onBeforeSave?: () => void
  onSuccess?: () => void
}

export function useDistrictConfigSave({
  district,
  userInfo,
  config,
  configState,
  onUpdateConfig,
  setCurrentConfig,
  onBeforeSave,
  onSuccess,
}: UseDistrictConfigSaveParams) {
  const [message, setMessage] = useState<SaveMessage | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [saveProgress, setSaveProgress] = useState(0)
  const progressIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const pollIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const isPollingRef = useRef(false)

  const clearTimers = useCallback(() => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current)
      progressIntervalRef.current = null
    }
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current)
      pollIntervalRef.current = null
    }
  }, [])

  const handleSaveError = useCallback((error: unknown) => {
    clearTimers()
    setSaveProgress(100)
    setIsSaving(false)
    setTimeout(() => setSaveProgress(0), 600)
    const detail = error && typeof error === 'object' && 'message' in error
      ? ` (${String((error as { message?: string }).message ?? '')})`
      : ''
    setMessage({
      text: `Une erreur est survenue lors de l'enregistrement.${detail}`,
      type: 'error',
    })
  }, [clearTimers])

  const saveDistrictConfig = useCallback(async (newConfig: BANCommune['config'], originalConfig: BANCommune['config']) => {
    if (!userInfo || !district) return

    const body = {
      districtID: district.banId,
      config: newConfig,
      originalConfig,
    }

    await customFetch('/api/addressing-certification-enable', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })
  }, [district, userInfo])

  const pushConfigUpdate = useCallback(() => {
    const newConfig = { ...configState }
    const codeCommune = district?.codeCommune
    if (!codeCommune) {
      setMessage({ text: 'Commune inconnue.', type: 'error' })
      return
    }

    clearTimers()
    const requestSentAt = Date.now()
    const estimatedDurationMs = estimateDurationMs(district?.nbNumeros ?? 0)
    setSaveProgress(0)
    setMessage(null)
    setIsSaving(true)
    onBeforeSave?.()

    progressIntervalRef.current = setInterval(() => {
      const elapsed = Date.now() - requestSentAt
      const progress = Math.min(89, (90 * elapsed) / estimatedDurationMs)
      setSaveProgress(progress >= 89 ? 90 : progress)
    }, 400)

    const savePromise = saveDistrictConfig(newConfig, config)
    const noQuickErrorPromise = new Promise<'accepted'>((resolve) => {
      setTimeout(() => resolve('accepted'), NO_QUICK_ERROR_MS)
    })

    Promise.race([
      savePromise.then(() => 'accepted' as const),
      noQuickErrorPromise,
    ])
      .then(() => {
        savePromise.catch(handleSaveError)
        const pollStart = Date.now()
        pollIntervalRef.current = setInterval(async () => {
          if (isPollingRef.current) return
          if (Date.now() - pollStart > POLL_MAX_MS) {
            clearTimers()
            setIsSaving(false)
            setTimeout(() => setSaveProgress(0), 600)
            setMessage({
              text: 'Échec de l’enregistrement.',
              type: 'error',
            })
            return
          }

          isPollingRef.current = true
          try {
            const data = await getCommuneWithoutCache(codeCommune) as { composedAt?: string, dateRevision?: string }
            const updatedAt = data?.composedAt ?? data?.dateRevision
            if (updatedAt && new Date(updatedAt).getTime() > requestSentAt) {
              clearTimers()
              setSaveProgress(100)
              onUpdateConfig(newConfig)
              setCurrentConfig(JSON.stringify(newConfig))
              setIsSaving(false)
              setTimeout(() => setSaveProgress(0), 600)
              setMessage({
                text: 'Modifications enregistrées',
                type: 'success',
              })
              onSuccess?.()
            }
          }
          catch {
          }
          finally {
            isPollingRef.current = false
          }
        }, POLL_INTERVAL_MS)
      })
      .catch(handleSaveError)
  }, [
    clearTimers,
    config,
    configState,
    district?.codeCommune,
    district?.nbNumeros,
    handleSaveError,
    onBeforeSave,
    onSuccess,
    onUpdateConfig,
    saveDistrictConfig,
    setCurrentConfig,
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
