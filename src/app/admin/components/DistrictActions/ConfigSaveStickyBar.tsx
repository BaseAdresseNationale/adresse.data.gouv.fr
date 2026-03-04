'use client'

import React, { useEffect, useRef } from 'react'
import { Button } from '@codegouvfr/react-dsfr/Button'
import { StickyActions } from './DistrictActions.styles'
import type { SaveMessage } from '../useDistrictConfigSave'

const SUCCESS_AUTO_DISMISS_MS = 4000

export interface ConfigSaveStickyBarProps {
  hasUnsavedChanges: boolean
  onReset: () => void
  message: SaveMessage | null
  setMessage: (msg: SaveMessage | null) => void
  isSaving: boolean
  saveProgress: number
  onSave: () => void
  saveDisabled?: boolean
  saveDisabledAriaLabel?: string
}

export function ConfigSaveStickyBar({
  hasUnsavedChanges,
  onReset,
  message,
  setMessage,
  isSaving,
  saveProgress,
  onSave,
  saveDisabled = false,
  saveDisabledAriaLabel,
}: ConfigSaveStickyBarProps) {
  const stickyBarRef = useRef<HTMLDivElement>(null)
  const hadUnsavedChangesRef = useRef(false)

  useEffect(() => {
    if (hasUnsavedChanges && !hadUnsavedChangesRef.current) {
      hadUnsavedChangesRef.current = true
      const t = setTimeout(() => {
        stickyBarRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
      }, 150)
      return () => clearTimeout(t)
    }
    if (!hasUnsavedChanges) hadUnsavedChangesRef.current = false
  }, [hasUnsavedChanges])

  useEffect(() => {
    if (message?.type === 'success') {
      const timer = setTimeout(() => setMessage(null), SUCCESS_AUTO_DISMISS_MS)
      return () => clearTimeout(timer)
    }
  }, [message, setMessage])

  const visible = hasUnsavedChanges || isSaving || saveProgress > 0 || message
  if (!visible) return null

  return (
    <StickyActions ref={stickyBarRef} role="region" aria-label="Actions de la configuration">
      {(isSaving || saveProgress > 0) && (
        <div className="sticky-saving">
          <p className="sticky-saving__label">
            <span className="fr-icon fr-icon-refresh-line fr-icon--sm" aria-hidden="true" />
            Enregistrement en cours…
          </p>
          <div
            className="sticky-progress"
            role="progressbar"
            aria-valuenow={Math.round(saveProgress)}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Progression de l'enregistrement"
          >
            <div className="sticky-progress__bar" style={{ width: `${saveProgress}%` }} />
          </div>
        </div>
      )}

      {!isSaving && saveProgress === 0 && message && (
        <div
          className={`sticky-message sticky-message--${message.type}`}
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >
          <span
            className={`fr-icon ${message.type === 'success' ? 'fr-icon-checkbox-circle-line' : 'fr-icon-error-warning-line'} fr-icon--sm`}
            aria-hidden="true"
          />
          <span className="fr-text--sm">{message.text}</span>
          {message.type === 'error' && (
            <Button
              type="button"
              priority="tertiary no outline"
              iconId="fr-icon-close-line"
              size="small"
              className="sticky-message__close"
              onClick={() => setMessage(null)}
              title="Fermer le message d'erreur"
            >
              Fermer
            </Button>
          )}
        </div>
      )}

      {!isSaving && saveProgress === 0 && !message && hasUnsavedChanges && (
        <>
          <div className="sticky-left">
            <span className="fr-badge fr-badge--sm fr-badge--blue-france sticky-left__badge">
              Non enregistré
            </span>
            <span className="fr-text--sm fr-text-mention--grey sticky-left__hint">
              Modifiez d&apos;autres réglages si besoin, puis enregistrez.
            </span>
          </div>
          <div className="sticky-btns">
            <Button
              type="button"
              priority="secondary"
              onClick={onReset}
              size="small"
            >
              Annuler
            </Button>
            <Button
              type="button"
              priority="primary"
              iconId="fr-icon-save-line"
              disabled={saveDisabled}
              onClick={onSave}
              size="small"
              aria-label={saveDisabled ? saveDisabledAriaLabel : 'Enregistrer les modifications'}
            >
              Enregistrer les modifications
            </Button>
          </div>
        </>
      )}
    </StickyActions>
  )
}
