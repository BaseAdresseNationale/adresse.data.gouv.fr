'use client'

import { useEffect, useRef } from 'react'
import Script from 'next/script'
import { env } from 'next-runtime-env'
import { PanoramaxControls } from './PanoramaxControls'

export interface PanoramaxSelection {
  pictureId: string
  sequenceId?: string
}

interface PanoramaxViewerProps {
  selection: PanoramaxSelection
  mode?: 'viewer-main' | 'map-main'
  onToggleMode?: () => void
  onClose: () => void
  onPictureChange?: (pos: { lng: number, lat: number }) => void
}

export default function PanoramaxViewer({ selection, mode = 'viewer-main', onToggleMode, onClose, onPictureChange }: PanoramaxViewerProps) {
  const hostRef = useRef<HTMLDivElement>(null)
  const onChangeRef = useRef(onPictureChange)
  const endpoint = env('NEXT_PUBLIC_PANORAMAX_ENDPOINT') 
  const isMain = mode === 'viewer-main'
  const containerStyle: React.CSSProperties = isMain
    ? {
        position: 'absolute',
        inset: 0,
        zIndex: 10,
        background: '#000',
        overflow: 'hidden',
      }
    : {
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
      }

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
      viewer.setAttribute('picture', selection.pictureId)
      if (selection.sequenceId) viewer.setAttribute('sequence', selection.sequenceId)
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
    <div style={containerStyle}>
      <Script id="panoramax-viewer-script" src='https://cdn.jsdelivr.net/npm/@panoramax/web-viewer@5.2.0/build/cjs/index_photoviewer.js' strategy="afterInteractive" />
      {!isMain && onToggleMode && (
        <PanoramaxControls mode={mode} onToggleMode={onToggleMode} onClose={onClose} />
      )}
      <div ref={hostRef} style={{ width: '100%', height: '100%' }} />
    </div>
  )
}