'use client'

import { useEffect, useRef } from 'react'
import { useImageLightbox } from '@/components/ImageLightbox'

import { TextWrapper } from './HtmlViewer.styles'

interface HtmlViewerProps {
  html: string
  isStyled?: boolean
  enableImageZoom?: boolean
}

export default function HtmlViewer({ html, isStyled = true, enableImageZoom = false }: HtmlViewerProps) {
  const wrapperElement = useRef(null)
  const { openImage } = useImageLightbox()

  useEffect(() => {
    const element = wrapperElement.current as unknown as HTMLElement | null

    element?.querySelectorAll('video').forEach((video: HTMLVideoElement) => {
      video.controls = true
    })

    if (!enableImageZoom) {
      return
    }

    const imageElements = Array.from(element?.querySelectorAll('img') || []) as HTMLImageElement[]
    const cleanups: Array<() => void> = []

    imageElements.forEach((img) => {
      if (!img.src || img.closest('a')) {
        return
      }

      img.classList.add('html-viewer__zoomable-image')
      img.setAttribute('role', 'button')
      img.setAttribute('tabindex', '0')
      img.setAttribute('aria-label', `Agrandir l'image${img.alt ? `: ${img.alt}` : ''}`)

      const onOpen = () => {
        openImage({ src: img.currentSrc || img.src, alt: img.alt || 'Image de contenu' })
      }

      const onKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          onOpen()
        }
      }

      img.addEventListener('click', onOpen)
      img.addEventListener('keydown', onKeyDown)

      cleanups.push(() => {
        img.removeEventListener('click', onOpen)
        img.removeEventListener('keydown', onKeyDown)
      })
    })

    return () => {
      cleanups.forEach((cleanup) => cleanup())
    }
  }, [html, openImage, enableImageZoom])

  return html && (
    isStyled
      ? <TextWrapper ref={wrapperElement} dangerouslySetInnerHTML={{ __html: html }} />
      : <div ref={wrapperElement} dangerouslySetInnerHTML={{ __html: html }} />
  )
}
