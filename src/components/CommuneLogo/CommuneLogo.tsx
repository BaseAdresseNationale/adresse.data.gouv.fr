'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'

import { getCommuneFlagProxy } from '@/lib/api-blasons-communes'

/** Hauteur standard du logo (carré ou rectangle) */
export const COMMUNE_LOGO_SIZE = 80

/** Largeur max pour les logos rectangulaires (tout visible, pas de crop) */
export const COMMUNE_LOGO_MAX_WIDTH = 320

/** Taille réduite (ex: liste admin) */
export const COMMUNE_LOGO_SIZE_SMALL = 28

/** Page commune : carré 80×80, rectangle max 80×320 */
export const COMMUNE_LOGO_PAGE_PRESET = { size: 80, maxWidth: 320 }

/** Panel district : carré 80×80, rectangle max 80×140 */
export const COMMUNE_LOGO_PANEL_PRESET = { size: 80, maxWidth: 140 }

const DEFAULT_LOGO_SRC = '/commune/default-logo.svg'

interface CommuneLogoProps {
  src?: string | null
  codeCommune?: string
  alt?: string
  size?: number
  maxWidth?: number
}

/** État « vide » : réserve la place, pas d’image encore */
function emptySlot(size: number, maxWidth: number) {
  return (
    <div
      style={{
        height: size,
        maxWidth,
        minWidth: size,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        borderRadius: 8,
        backgroundColor: 'transparent',
      }}
      aria-hidden
    />
  )
}

function logoWrapper(size: number, maxWidth: number, children: ReactNode) {
  return (
    <div
      style={{
        height: size,
        maxWidth,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'visible',
        borderRadius: 8,
        backgroundColor: 'white',
      }}
    >
      {children}
    </div>
  )
}

const imgStyleBase = (size: number, maxWidth: number) => ({
  height: size,
  width: 'auto' as const,
  maxWidth,
  objectFit: 'contain' as const,
})

/**
 * `next/image` + URLs externes + `unoptimized` : `onLoad` / `onLoadingComplete` peuvent ne jamais partir
 * → opacité bloquée à 0. `<img>` natif : `onLoad` / `onError` fiables (panel carte, etc.).
 *
 * Principe : **vide** (chargement) → **logo réel** → **défaut** si échec.
 */
export default function CommuneLogo({
  src,
  codeCommune,
  alt = 'Logo de la commune',
  size = COMMUNE_LOGO_SIZE,
  maxWidth = COMMUNE_LOGO_MAX_WIDTH,
}: CommuneLogoProps) {
  const hasExplicitSrc = typeof src === 'string' && src.trim().length > 0
  const resolveByCode = Boolean(codeCommune) && !hasExplicitSrc

  const [annuaireUrl, setAnnuaireUrl] = useState<string | null>(null)
  const [doneForCode, setDoneForCode] = useState<string | null>(null)
  const [loadError, setLoadError] = useState(false)
  const [explicitReady, setExplicitReady] = useState(false)
  const [remoteImageReady, setRemoteImageReady] = useState(false)
  const explicitImgRef = useRef<HTMLImageElement>(null)
  const remoteImgRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    setLoadError(false)
    setExplicitReady(false)
  }, [src, codeCommune])

  useEffect(() => {
    setRemoteImageReady(false)
  }, [annuaireUrl])

  useEffect(() => {
    if (!hasExplicitSrc) return
    const el = explicitImgRef.current
    if (el?.complete && el.naturalWidth > 0) setExplicitReady(true)
  }, [src, loadError, hasExplicitSrc])

  useEffect(() => {
    if (!annuaireUrl || loadError) return
    const el = remoteImgRef.current
    if (el?.complete && el.naturalWidth > 0) setRemoteImageReady(true)
  }, [annuaireUrl, loadError])

  useEffect(() => {
    if (!resolveByCode || !codeCommune) return
    if (doneForCode === codeCommune) return

    let cancelled = false

    getCommuneFlagProxy(codeCommune)
      .then((url) => {
        if (cancelled) return
        setAnnuaireUrl(url?.trim() ? url : null)
        setDoneForCode(codeCommune)
      })
      .catch(() => {
        if (cancelled) return
        setAnnuaireUrl(null)
        setDoneForCode(codeCommune)
      })

    return () => {
      cancelled = true
    }
  }, [codeCommune, resolveByCode, doneForCode])

  const base = imgStyleBase(size, maxWidth)

  // --- `src` explicite (ex. panel carte) : vide → `<img>` → défaut si erreur ---
  if (hasExplicitSrc) {
    const displaySrc = loadError ? DEFAULT_LOGO_SRC : src!.trim()
    const showImage = explicitReady || loadError

    return logoWrapper(
      size,
      maxWidth,
      <div
        style={{
          position: 'relative',
          height: size,
          maxWidth,
          minWidth: size,
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {!showImage && emptySlot(size, maxWidth)}
        {/* eslint-disable-next-line @next/next/no-img-element -- onLoad fiable pour URLs externes (panel) */}
        <img
          ref={explicitImgRef}
          src={displaySrc}
          alt={alt}
          decoding="async"
          onLoad={() => setExplicitReady(true)}
          onError={() => {
            setLoadError(true)
            setExplicitReady(true)
          }}
          style={{
            ...base,
            opacity: showImage ? 1 : 0,
            position: showImage ? 'relative' : 'absolute',
            left: showImage ? undefined : 0,
            top: showImage ? undefined : 0,
            pointerEvents: showImage ? undefined : ('none' as const),
          }}
        />
      </div>,
    )
  }

  // --- Résolution par code : vide (fetch) → URL → défaut ---
  if (resolveByCode) {
    if (doneForCode !== codeCommune) {
      return emptySlot(size, maxWidth)
    }

    if (!annuaireUrl || loadError) {
      return logoWrapper(
        size,
        maxWidth,
        // eslint-disable-next-line @next/next/no-img-element
        <img src={DEFAULT_LOGO_SRC} alt={alt} decoding="async" style={base} />
      )
    }

    const remoteReady = remoteImageReady || loadError

    return logoWrapper(
      size,
      maxWidth,
      <div
        style={{
          position: 'relative',
          height: size,
          maxWidth,
          minWidth: size,
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {!remoteReady && emptySlot(size, maxWidth)}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          ref={remoteImgRef}
          src={annuaireUrl}
          alt={alt}
          decoding="async"
          onLoad={() => setRemoteImageReady(true)}
          onError={() => setLoadError(true)}
          style={{
            ...base,
            opacity: remoteReady ? 1 : 0,
            position: remoteReady ? 'relative' : 'absolute',
            left: remoteReady ? undefined : 0,
            top: remoteReady ? undefined : 0,
            pointerEvents: remoteReady ? undefined : ('none' as const),
          }}
        />
      </div>,
    )
  }

  return logoWrapper(
    size,
    maxWidth,
    // eslint-disable-next-line @next/next/no-img-element
    <img src={DEFAULT_LOGO_SRC} alt={alt} decoding="async" style={base} />
  )
}
