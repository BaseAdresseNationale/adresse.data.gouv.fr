'use client'

import { useCallback, useDeferredValue, useEffect, useId, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Button } from '@codegouvfr/react-dsfr/Button'
import { Alert } from '@codegouvfr/react-dsfr/Alert'

type CertificatePdfPreviewButtonProps = {
  codeCommune: string
  nomCommune: string
  certificateShowLogo: boolean
  certificateIssuerDetails: string
  certificateAttestationText: string
  communePopulation?: number
  disabled?: boolean
  triggerPriority?: 'primary' | 'secondary'
  onPdfDisplayed?: () => void
  /** `id` du bouton d’ouverture (lien depuis la barre d’enregistrement). */
  previewOpenButtonId?: string
  /** Enregistrement depuis le modal : renvoie `true` si succès (fermeture du modal). */
  onRequestSaveFromPreview?: () => Promise<boolean>
  /** Désactive « Enregistrer » dans le modal (ex. aucune modification locale à envoyer). */
  saveFromPreviewDisabled?: boolean
}

const OVERLAY_Z = 2147483000
const PREFETCH_DEBOUNCE_MS = 600

export function CertificatePdfPreviewButtonClean({
  codeCommune,
  nomCommune,
  certificateShowLogo,
  certificateIssuerDetails,
  certificateAttestationText,
  communePopulation,
  disabled = false,
  triggerPriority = 'secondary',
  onPdfDisplayed,
  previewOpenButtonId,
  onRequestSaveFromPreview,
  saveFromPreviewDisabled = false,
}: CertificatePdfPreviewButtonProps) {
  const [mounted, setMounted] = useState(false)
  const [open, setOpen] = useState(false)
  const [modalLoading, setModalLoading] = useState(false)
  const [prefetching, setPrefetching] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [saveFromModalBusy, setSaveFromModalBusy] = useState(false)

  const requestBody = useMemo(
    () => ({
      codeCommune,
      nomCommune,
      certificateShowLogo,
      certificateIssuerDetails,
      certificateAttestationText,
      communePopulation,
    }),
    [
      certificateAttestationText,
      certificateIssuerDetails,
      certificateShowLogo,
      codeCommune,
      nomCommune,
      communePopulation,
    ],
  )

  const previewKey = useMemo(() => JSON.stringify(requestBody), [requestBody])

  const deferredPreviewKey = useDeferredValue(previewKey)

  const bgAbortRef = useRef<AbortController | null>(null)
  const modalAbortRef = useRef<AbortController | null>(null)
  const skipPrefetchDebounceRef = useRef(true)
  const lastSuccessKeyRef = useRef<string | null>(null)
  const previewKeyRef = useRef(previewKey)
  previewKeyRef.current = previewKey
  const panelRef = useRef<HTMLDivElement>(null)
  const titleId = useId()

  const runFetch = useCallback(
    async (signal: AbortSignal, requestKey: string, options?: { silent?: boolean }): Promise<boolean> => {
      const silent = options?.silent === true
      const res = await fetch('/api/certificate-config-preview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        signal,
        body: JSON.stringify(requestBody),
      })
      const contentType = res.headers.get('Content-Type') ?? ''
      if (signal.aborted) return false
      if (!res.ok) {
        if (requestKey !== previewKeyRef.current) return false
        const errJson = await res.json().catch(() => ({}))
        if (!silent) {
          setError(typeof errJson?.error === 'string' ? errJson.error : `Erreur ${res.status}`)
        }
        return false
      }
      if (!contentType.includes('pdf')) {
        if (requestKey !== previewKeyRef.current) return false
        if (!silent) {
          setError('La réponse du serveur n’est pas un PDF.')
        }
        return false
      }
      const buf = await res.arrayBuffer()
      if (signal.aborted) return false
      if (requestKey !== previewKeyRef.current) return false
      const blob = new Blob([buf], { type: 'application/pdf' })
      const url = URL.createObjectURL(blob)
      setPreviewUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev)
        return url
      })
      lastSuccessKeyRef.current = requestKey
      setError(null)
      return true
    },
    [requestBody],
  )

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    return () => {
      bgAbortRef.current?.abort()
      modalAbortRef.current?.abort()
      setPreviewUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev)
        return null
      })
    }
  }, [])

  useEffect(() => {
    if (disabled) {
      bgAbortRef.current?.abort()
      setPrefetching(false)
      return
    }

    const delay = skipPrefetchDebounceRef.current ? 0 : PREFETCH_DEBOUNCE_MS
    skipPrefetchDebounceRef.current = false

    const timer = window.setTimeout(() => {
      bgAbortRef.current?.abort()
      const ac = new AbortController()
      bgAbortRef.current = ac
      const keyAtStart = previewKeyRef.current
      setPrefetching(true)
      void (async () => {
        try {
          const ok = await runFetch(ac.signal, keyAtStart, { silent: true })
          if (!ac.signal.aborted && ok) {
            setError(null)
          }
        }
        catch {
        }
        finally {
          if (!ac.signal.aborted) {
            setPrefetching(false)
          }
        }
      })()
    }, delay)

    return () => {
      window.clearTimeout(timer)
      bgAbortRef.current?.abort()
    }
  }, [disabled, deferredPreviewKey, runFetch])

  const closeModal = useCallback(() => {
    setOpen(false)
    setModalLoading(false)
    modalAbortRef.current?.abort()
    modalAbortRef.current = null
    setError(null)
  }, [])

  const handleSaveFromModal = useCallback(async () => {
    if (!onRequestSaveFromPreview) return
    setSaveFromModalBusy(true)
    try {
      const ok = await onRequestSaveFromPreview()
      if (ok) closeModal()
    }
    finally {
      setSaveFromModalBusy(false)
    }
  }, [closeModal, onRequestSaveFromPreview])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeModal()
    }
    document.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [open, closeModal])

  useEffect(() => {
    if (open && previewUrl && !modalLoading && panelRef.current) {
      panelRef.current.focus()
    }
  }, [open, previewUrl, modalLoading])

  const pdfDisplayedOnceRef = useRef(false)
  useEffect(() => {
    if (!open) pdfDisplayedOnceRef.current = false
  }, [open])
  useEffect(() => {
    if (open && previewUrl && !modalLoading && !pdfDisplayedOnceRef.current) {
      pdfDisplayedOnceRef.current = true
      onPdfDisplayed?.()
    }
  }, [open, previewUrl, modalLoading, onPdfDisplayed])

  const openPdfInNewTab = useCallback(() => {
    if (!previewUrl) return
    window.open(previewUrl, '_blank', 'noopener,noreferrer')
  }, [previewUrl])

  const handleOpen = useCallback(() => {
    setError(null)
    setOpen(true)
    const keyAtOpen = previewKeyRef.current

    if (lastSuccessKeyRef.current === keyAtOpen && previewUrl) {
      setModalLoading(false)
      return
    }

    setModalLoading(true)
    bgAbortRef.current?.abort()
    modalAbortRef.current?.abort()
    const ac = new AbortController()
    modalAbortRef.current = ac

    void (async () => {
      try {
        const ok = await runFetch(ac.signal, keyAtOpen)
        if (ac.signal.aborted) return
        if (!ok) {
          setModalLoading(false)
          return
        }
        setModalLoading(false)
      }
      catch (e) {
        if (ac.signal.aborted || (e instanceof DOMException && e.name === 'AbortError')) return
        setError('Impossible de générer l’aperçu du certificat.')
        setModalLoading(false)
      }
    })()
  }, [previewUrl, runFetch])

  const modal = open && mounted && (
    <div
      role="presentation"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: OVERLAY_Z,
        background: 'rgba(22, 22, 22, 0.64)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) closeModal()
      }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="fr-background-default--grey"
        style={{
          width: 'min(1200px, calc(100vw - 2rem))',
          maxHeight: 'min(94vh, 980px)',
          overflow: 'auto',
          borderRadius: '4px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.24)',
          outline: 'none',
          backgroundColor: 'var(--background-default-grey)',
        }}
        tabIndex={-1}
      >
        <div className="fr-container fr-container--fluid fr-p-3w">
          <div className="fr-grid-row fr-grid-row--gutters fr-grid-row--middle fr-mb-2w">
            <div className="fr-col">
              <h1 id={titleId} className="fr-h4 fr-mb-1w">
                Aperçu du certificat
              </h1>
              <p className="fr-text--xs fr-mb-0" style={{ maxWidth: '42rem' }}>
                Pour agrandir, ouvrez le fichier dans un nouvel onglet.
              </p>
            </div>
            <div className="fr-col-auto">
              <ul className="fr-btns-group fr-btns-group--inline-md fr-btns-group--right fr-btns-group--icon-left fr-mb-0">
                {previewUrl && !modalLoading && (
                  <li>
                    <Button
                      type="button"
                      priority="secondary"
                      iconId="fr-icon-external-link-line"
                      size="small"
                      onClick={openPdfInNewTab}
                    >
                      Nouvel onglet
                    </Button>
                  </li>
                )}
                {previewUrl && !modalLoading && onRequestSaveFromPreview && (
                  <li>
                    <Button
                      type="button"
                      priority="primary"
                      iconId="fr-icon-save-line"
                      size="small"
                      disabled={saveFromModalBusy || saveFromPreviewDisabled}
                      title={
                        saveFromPreviewDisabled && !saveFromModalBusy
                          ? 'Aucune modification à enregistrer. Changez la configuration puis enregistrez, ou utilisez le bouton en bas de page.'
                          : undefined
                      }
                      onClick={handleSaveFromModal}
                    >
                      {saveFromModalBusy ? 'Enregistrement…' : 'Enregistrer les modifications'}
                    </Button>
                  </li>
                )}
                <li>
                  <Button type="button" priority="secondary" size="small" onClick={closeModal}>
                    Fermer
                  </Button>
                </li>
              </ul>
            </div>
          </div>

          {modalLoading && (
            <p className="fr-text--sm fr-mb-2w" role="status">
              Génération de l’aperçu…
            </p>
          )}

          {error && (
            <Alert severity="error" small className="fr-mb-2w" description={error} />
          )}

          {previewUrl && !modalLoading && (
            <div
              className="fr-mb-0"
              style={{
                background: 'var(--background-default-grey)',
                borderRadius: '2px',
              }}
            >
              <object
                data={previewUrl}
                type="application/pdf"
                title="Aperçu du certificat d’adressage"
                style={{
                  width: '100%',
                  minHeight: 'min(75vh, 800px)',
                  border: '1px solid var(--border-default-grey)',
                  background: 'var(--background-default-grey)',
                  display: 'block',
                }}
              >
                <iframe
                  key={previewUrl}
                  title="Aperçu du certificat d’adressage"
                  src={previewUrl}
                  width="100%"
                  height={720}
                  style={{
                    minHeight: '65vh',
                    border: '1px solid var(--border-default-grey)',
                    background: 'var(--background-default-grey)',
                    display: 'block',
                  }}
                />
              </object>
            </div>
          )}
        </div>
      </div>
    </div>
  )

  const buttonHint = prefetching ? 'Mise à jour de l’aperçu…' : null

  return (
    <>
      <div className="fr-mt-1w fr-grid-row fr-grid-row--middle fr-grid-row--gutters">
        <div className="fr-col-auto">
          <Button
            type="button"
            priority={triggerPriority}
            iconId="fr-icon-eye-line"
            size="small"
            disabled={disabled || open}
            onClick={handleOpen}
            nativeButtonProps={previewOpenButtonId ? { id: previewOpenButtonId } : undefined}
          >
            {modalLoading && open ? 'Génération…' : 'Aperçu du certificat (modèle officiel)'}
          </Button>
        </div>
        {buttonHint && (
          <div className="fr-col fr-text--xs fr-text-mention--grey" aria-live="polite">
            {buttonHint}
          </div>
        )}
      </div>
      {mounted && modal ? createPortal(modal, document.body) : null}
    </>
  )
}
