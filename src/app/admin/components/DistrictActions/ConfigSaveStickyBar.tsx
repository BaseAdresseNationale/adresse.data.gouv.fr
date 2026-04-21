'use client'

import { useEffect, useLayoutEffect, useRef } from 'react'
import { Button } from '@codegouvfr/react-dsfr/Button'
import { StickyActions } from './DistrictActions.styles'
import type { SaveMessage } from '../useDistrictConfigSave'

function StickyMessageContent({
  message,
  onDismiss,
}: {
  message: SaveMessage
  onDismiss: () => void
}) {
  const extraActions = message.actions ?? []
  return (
    <>
      <span className="sticky-message__text fr-text--sm">{message.text}</span>
      <div className="sticky-message__actions fr-mt-2w fr-mt-md-0">
        <ul className="fr-btns-group fr-btns-group--inline fr-btns-group--icon-left fr-btns-group--sm fr-mb-0">
          {extraActions.map((action, index) => (
            <li key={`${action.label}-${index}`}>
              <Button
                type="button"
                priority="secondary"
                size="small"
                iconId="fr-icon-eye-line"
                onClick={action.onClick}
              >
                {action.label}
              </Button>
            </li>
          ))}
          <li>
            <Button
              type="button"
              priority="secondary"
              size="small"
              iconId="fr-icon-close-line"
              onClick={onDismiss}
              title="Masquer ce message"
            >
              Fermer
            </Button>
          </li>
        </ul>
      </div>
    </>
  )
}

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
  const hadUnsavedScrollDoneRef = useRef(false)

  useEffect(() => {
    if (message?.type === 'success') {
      const timer = setTimeout(() => setMessage(null), SUCCESS_AUTO_DISMISS_MS)
      return () => clearTimeout(timer)
    }
  }, [message, setMessage])

  useLayoutEffect(() => {
    if (!hasUnsavedChanges) {
      hadUnsavedScrollDoneRef.current = false
      return
    }
    if (hadUnsavedScrollDoneRef.current) return
    hadUnsavedScrollDoneRef.current = true
    const ae = document.activeElement
    if (ae instanceof HTMLTextAreaElement || ae instanceof HTMLSelectElement) return
    if (ae instanceof HTMLElement && ae.isContentEditable) return
    if (ae instanceof HTMLInputElement) {
      const t = ae.type
      const nonTextEntry = ['button', 'checkbox', 'radio', 'submit', 'reset', 'file', 'hidden', 'image', 'color'].includes(t)
      if (!nonTextEntry) return
    }
    const el = stickyBarRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const vh = window.innerHeight
    const intersects = rect.top < vh && rect.bottom > 0
    if (!intersects) {
      el.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    }
  }, [hasUnsavedChanges])

  useLayoutEffect(() => {
    if (message?.type !== 'error') return
    stickyBarRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }, [message])

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
          {message.type === 'success'
            ? <span className="fr-text--sm">{message.text}</span>
            : (
                <div className="sticky-message__body sticky-message__body--error">
                  <StickyMessageContent
                    message={message}
                    onDismiss={() => setMessage(null)}
                  />
                </div>
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
