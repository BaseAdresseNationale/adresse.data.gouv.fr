'use client'

import React, { useId } from 'react'

export interface SaveProgressBarProps {
  value: number
  label?: string
  ariaLabel?: string
  className?: string
}

export function SaveProgressBar({
  value,
  label = 'Enregistrement en cours…',
  ariaLabel = 'Enregistrement en cours',
  className = '',
}: SaveProgressBarProps) {
  const percent = Math.min(100, Math.max(0, value))
  const labelId = useId()
  const wrapperClassName = ['fr-mb-3w', className].filter(Boolean).join(' ')

  return (
    <div className={wrapperClassName}>
      {label && (
        <p id={labelId} className="fr-text--sm fr-mb-1w">
          {label}
        </p>
      )}
      <div
        role="progressbar"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label ? undefined : ariaLabel}
        aria-labelledby={label ? labelId : undefined}
        aria-valuetext={`${Math.round(percent)}%`}
      >
        <div
          style={{
            height: 6,
            backgroundColor: 'var(--background-contrast-grey)',
            borderRadius: 3,
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${percent}%`,
              backgroundColor: 'var(--background-action-high-blue-france)',
              borderRadius: 3,
              transition: 'width 0.3s ease-out',
            }}
          />
        </div>
      </div>
    </div>
  )
}
