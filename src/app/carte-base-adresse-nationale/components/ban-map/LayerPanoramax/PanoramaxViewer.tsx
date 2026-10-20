'use client'

import { useEffect, useRef } from 'react'
import Script from 'next/script'
import { env } from 'next-runtime-env'

export interface PanoramaxSelection {
  pictureId: string
  sequenceId?: string
}

interface PanoramaxViewerProps {
  selection: PanoramaxSelection
  onClose: () => void
  onPictureChange?: (pos: { lng: number, lat: number }) => void
}

export default function PanoramaxViewer({ selection, onClose, onPictureChange }: PanoramaxViewerProps) {
  const hostRef = useRef<HTMLDivElement>(null)
  const onChangeRef = useRef(onPictureChange)
  const endpoint = env('NEXT_PUBLIC_PANORAMAX_ENDPOINT') 

  if (!endpoint) {
    throw new Error('NEXT_PUBLIC_PANORAMAX_ENDPOINT is not defined in the environment variables')
  }

  useEffect(() => {
    onChangeRef.current = onPictureChange
  }, [onPictureChange])

  useEffect(() => {
    const host = hostRef.current
    if (!host) return

    let cancelled = false
    let viewer: HTMLElement | null = null

    const onPictureLoaded = (event: Event) => {
      const detail = (event as CustomEvent).detail
      if (typeof detail?.lon === 'number' && typeof detail?.lat === 'number') {
        onChangeRef.current?.({ lng: detail.lon, lat: detail.lat })
      }
    }

    customElements.whenDefined('pnx-photo-viewer').then(() => {
      if (cancelled) return
      viewer = document.createElement('pnx-photo-viewer')
      viewer.setAttribute('endpoint', endpoint)
      if (selection.sequenceId) viewer.setAttribute('sequence', selection.sequenceId)
      viewer.setAttribute('picture', selection.pictureId)
      viewer.setAttribute('widgets', 'false')
      viewer.setAttribute('url-parameters', 'false')
      viewer.style.cssText = 'display:block;width:100%;height:100%'
      viewer.addEventListener('psv:picture-loaded', onPictureLoaded)
      host.appendChild(viewer)
    })

    return () => {
      cancelled = true
      viewer?.removeEventListener('psv:picture-loaded', onPictureLoaded)
      viewer?.remove()
    }
  }, [selection.sequenceId, selection.pictureId, endpoint])

  return (
    <div
      style={{
        position: 'absolute',
        top: 16,
        right: 16,
        width: 'min(480px, calc(100% - 32px))',
        height: 320,
        zIndex: 10,
        background: '#000',
        borderRadius: 8,
        overflow: 'hidden',
        boxShadow: '0 4px 16px rgba(0,0,0,.35)',
      }}
    >
      <Script id="panoramax-viewer-script" src='https://cdn.jsdelivr.net/npm/@panoramax/web-viewer@5.2.0/build/cjs/index_photoviewer.js' strategy="afterInteractive" />
      <button
        type="button"
        onClick={onClose}
        aria-label="Fermer la vue Panoramax"
        style={{ position: 'absolute', top: 8, left: 8, zIndex: 11 }}
        className="fr-btn fr-btn--sm fr-btn--secondary fr-icon-close-line"
      />
      <div ref={hostRef} style={{ width: '100%', height: '100%' }} />
    </div>
  )
}