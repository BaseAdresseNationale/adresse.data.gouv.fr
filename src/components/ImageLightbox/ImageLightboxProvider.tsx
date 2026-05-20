'use client'

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
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

const ImageLightboxContext = createContext<ImageLightboxContextValue | null>(null)

interface ImageLightboxProviderProps {
  children: ReactNode
}

const modal = createModal({
  id: 'image-lightbox-modal',
  isOpenedByDefault: false,
})

const LightboxModalStyle = createGlobalStyle`
  .image-lightbox-modal .fr-container,
  .image-lightbox-modal .fr-grid-row > div {
    width: auto;
    max-width: calc(100vw - 1rem);
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
  }

  .image-lightbox-modal .fr-modal__header {
    position: absolute;
    top: 0.75rem;
    right: 0.75rem;
    z-index: 2;
    padding: 0;
  }

  .image-lightbox-modal .fr-btn--close {
    margin-left: auto;
  }

  .image-lightbox-modal .fr-modal__content {
    padding: 3.5rem 1rem 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    width: auto;
    max-width: calc(100vw - 1rem);
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
    .image-lightbox-modal .fr-modal__content {
      padding: 4rem 2rem 2rem;
    }
  }
`

export default function ImageLightboxProvider({ children }: ImageLightboxProviderProps) {
  const [activeImage, setActiveImage] = useState<LightboxImage | null>(null)

  const openImage = useCallback((image: LightboxImage) => {
    setActiveImage(image)
    modal.open()
  }, [])

  useIsModalOpen(modal, {
    onConceal: () => setActiveImage(null),
  })

  const value = useMemo(() => ({ openImage }), [openImage])

  return (
    <ImageLightboxContext.Provider value={value}>
      <LightboxModalStyle />
      {children}
      <modal.Component
        className="image-lightbox-modal"
        size="large"
        title={activeImage?.alt || 'Agrandissement de l\'image'}
      >
        {activeImage && (
          <img
            src={activeImage.src}
            alt={activeImage.alt}
            style={{
              maxWidth: 'calc(100vw - 3rem)',
              maxHeight: 'calc(100vh - 3rem)',
              width: 'auto',
              height: 'auto',
              objectFit: 'contain',
              display: 'block',
              margin: '0 auto',
            }}
          />
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
