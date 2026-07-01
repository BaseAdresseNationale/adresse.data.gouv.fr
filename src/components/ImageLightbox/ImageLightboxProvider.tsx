'use client'

import Image from 'next/image'
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { createModal } from '@codegouvfr/react-dsfr/Modal'
import { useIsModalOpen } from '@codegouvfr/react-dsfr/Modal/useIsModalOpen'
import { createGlobalStyle } from 'styled-components'

interface LightboxImage {
  src: string
  alt: string
}

interface ImageLightboxContextValue {
  openImage: (image: LightboxImage) => void
}

interface ImageLightboxProviderProps {
  children: ReactNode
}

interface ImageDimensions {
  width: number
  height: number
}

interface ViewportSize {
  width: number
  height: number
}

const ImageLightboxContext = createContext<ImageLightboxContextValue | null>(null)

const modal = createModal({
  id: 'image-lightbox-modal',
  isOpenedByDefault: false,
})

const MAX_LIGHTBOX_UPSCALE = 1.75
const MOBILE_MAX_LIGHTBOX_UPSCALE = 1.35
const FALLBACK_VIEWPORT_WIDTH = 1280
const FALLBACK_VIEWPORT_HEIGHT = 900
const LIGHTBOX_FRAME_PADDING_X = 16
const LIGHTBOX_FRAME_PADDING_Y = 24

const LightboxModalStyle = createGlobalStyle`
  .image-lightbox-modal .fr-container,
  .image-lightbox-modal .fr-grid-row > div {
    width: auto;
    max-width: 100vw;
  }

  .image-lightbox-modal .fr-grid-row {
    display: flex;
    justify-content: center;
  }

  .image-lightbox-modal .fr-modal__body {
    width: auto;
    max-width: calc(100vw - 1rem);
    max-height: calc(100vh - 1rem);
    padding: 0;
    overflow: hidden;
  }

  .image-lightbox-modal .fr-modal__header {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    z-index: 2;
    padding: 0;
  }

  .image-lightbox-modal .fr-btn--close {
    margin-left: auto;
    background-color: var(--background-default-grey-hover);
    border-radius: 999px;
  }

  .image-lightbox-modal .fr-modal__content {
    padding: 3.25rem 1rem 1.75rem;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    max-height: calc(100vh - 1rem);
    overflow: hidden;
    box-sizing: border-box;
  }

  .image-lightbox-modal .fr-modal__title {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }

  @media (min-width: 48rem) {
    .image-lightbox-modal .fr-modal__header {
      top: 0.75rem;
      right: 0.75rem;
    }

    .image-lightbox-modal .fr-modal__content {
      padding: 4rem 2rem 2rem;
    }
  }
`

const LightboxImage = createGlobalStyle`
  .image-lightbox-modal__image-wrapper {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0 auto;
  }

  .image-lightbox-modal__image-frame {
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--background-default-grey);
    border-radius: 0.5rem;
    padding: 0.5rem 0.5rem 1rem;
    box-sizing: border-box;
    max-width: 100%;
    max-height: 100%;
  }

  .image-lightbox-modal__image {
    width: 100%;
    height: 100%;
    display: block;
    object-fit: contain;
  }
`

export default function ImageLightboxProvider({ children }: ImageLightboxProviderProps) {
  const [activeImage, setActiveImage] = useState<LightboxImage | null>(null)
  const [activeImageDimensions, setActiveImageDimensions] = useState<ImageDimensions | null>(null)
  const [viewportSize, setViewportSize] = useState<ViewportSize>({
    width: FALLBACK_VIEWPORT_WIDTH,
    height: FALLBACK_VIEWPORT_HEIGHT,
  })
  const activeImageAlt = activeImage?.alt?.trim() || 'Image agrandie'

  useEffect(() => {
    const handleViewportResize = () => {
      setViewportSize({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    handleViewportResize()
    window.addEventListener('resize', handleViewportResize)

    return () => {
      window.removeEventListener('resize', handleViewportResize)
    }
  }, [])

  const openImage = useCallback((image: LightboxImage) => {
    setActiveImage(image)
    setActiveImageDimensions(null)
    modal.open()
  }, [])

  useIsModalOpen(modal, {
    onConceal: () => {
      setActiveImage(null)
      setActiveImageDimensions(null)
    },
  })

  const renderedImageSize = useMemo(() => {
    const isMobileViewport = viewportSize.width < 768
    const horizontalChrome = isMobileViewport ? 24 : 96
    const verticalChrome = isMobileViewport ? 164 : 220

    const maxFrameWidth = Math.max(viewportSize.width - horizontalChrome, 220)
    const maxFrameHeight = Math.max(viewportSize.height - verticalChrome, 180)
    const maxImageWidth = Math.max(maxFrameWidth - LIGHTBOX_FRAME_PADDING_X, 180)
    const maxImageHeight = Math.max(maxFrameHeight - LIGHTBOX_FRAME_PADDING_Y, 140)

    if (!activeImageDimensions) {
      const defaultRatio = 16 / 9

      if (maxImageWidth / maxImageHeight > defaultRatio) {
        const imageHeight = Math.round(maxImageHeight)
        const imageWidth = Math.round(maxImageHeight * defaultRatio)

        return {
          imageWidth,
          imageHeight,
          frameWidth: imageWidth + LIGHTBOX_FRAME_PADDING_X,
          frameHeight: imageHeight + LIGHTBOX_FRAME_PADDING_Y,
        }
      }

      const imageWidth = Math.round(maxImageWidth)
      const imageHeight = Math.round(maxImageWidth / defaultRatio)

      return {
        imageWidth,
        imageHeight,
        frameWidth: imageWidth + LIGHTBOX_FRAME_PADDING_X,
        frameHeight: imageHeight + LIGHTBOX_FRAME_PADDING_Y,
      }
    }

    const isVeryTallImage = activeImageDimensions.height / activeImageDimensions.width > 1.35
    const isVeryLargeImage = activeImageDimensions.height > 1600
    const verticalSafetyFactor = isVeryTallImage || isVeryLargeImage ? 0.88 : 0.95
    const safeImageHeight = Math.round(maxImageHeight * verticalSafetyFactor)

    const fitScale = Math.min(
      maxImageWidth / activeImageDimensions.width,
      safeImageHeight / activeImageDimensions.height,
    )

    const maxUpscale = isMobileViewport ? MOBILE_MAX_LIGHTBOX_UPSCALE : MAX_LIGHTBOX_UPSCALE
    const scale = Math.min(fitScale, maxUpscale)

    const imageWidth = Math.max(1, Math.round(activeImageDimensions.width * scale))
    const imageHeight = Math.max(1, Math.round(activeImageDimensions.height * scale))

    return {
      imageWidth,
      imageHeight,
      frameWidth: imageWidth + LIGHTBOX_FRAME_PADDING_X,
      frameHeight: imageHeight + LIGHTBOX_FRAME_PADDING_Y,
    }
  }, [activeImageDimensions, viewportSize.height, viewportSize.width])

  const value = useMemo(() => ({ openImage }), [openImage])

  return (
    <ImageLightboxContext.Provider value={value}>
      <LightboxModalStyle />
      <LightboxImage />
      {children}
      <modal.Component
        className="image-lightbox-modal"
        size="large"
        title={`Agrandissement de l'image : ${activeImageAlt}`}
      >
        {activeImage && (
          <div className="image-lightbox-modal__image-wrapper">
            <div
              className="image-lightbox-modal__image-frame"
              style={{ width: `${renderedImageSize.frameWidth}px`, height: `${renderedImageSize.frameHeight}px` }}
            >
              <Image
                src={activeImage.src}
                alt={activeImageAlt}
                width={activeImageDimensions?.width || renderedImageSize.imageWidth}
                height={activeImageDimensions?.height || renderedImageSize.imageHeight}
                sizes="100vw"
                priority
                className="image-lightbox-modal__image"
                onLoadingComplete={(imageElement) => {
                  const width = imageElement.naturalWidth
                  const height = imageElement.naturalHeight

                  if (!width || !height) {
                    return
                  }

                  setActiveImageDimensions((previousDimensions) => {
                    if (previousDimensions?.width === width && previousDimensions?.height === height) {
                      return previousDimensions
                    }

                    return { width, height }
                  })
                }}
              />
            </div>
          </div>
        )}
      </modal.Component>
    </ImageLightboxContext.Provider>
  )
}

export function useImageLightbox() {
  const context = useContext(ImageLightboxContext)

  if (!context) {
    throw new Error('useImageLightbox must be used within ImageLightboxProvider')
  }

  return context
}
