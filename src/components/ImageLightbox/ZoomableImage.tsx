'use client'

import Image, { type ImageProps } from 'next/image'
import { useImageLightbox } from './ImageLightboxProvider'
import styles from './ZoomableImage.module.css'

interface ZoomableImageProps extends ImageProps {
  buttonLabel?: string
  buttonClassName?: string
  buttonStyle?: React.CSSProperties
}

function resolveImageSource(src: ImageProps['src']) {
  if (typeof src === 'string') {
    return src
  }

  if ('src' in src) {
    return src.src
  }

  return src.default.src
}

export default function ZoomableImage({
  alt,
  src,
  buttonLabel = 'Agrandir l\'image',
  buttonClassName,
  buttonStyle,
  ...imageProps
}: ZoomableImageProps) {
  const { openImage } = useImageLightbox()

  return (
    <button
      type="button"
      onClick={() => openImage({ src: resolveImageSource(src), alt })}
      className={[styles.zoomableButton, buttonClassName].filter(Boolean).join(' ')}
      style={buttonStyle}
      aria-label={`${buttonLabel}: ${alt}`}
    >
      <Image {...imageProps} src={src} alt={alt} />
      <span className={styles.indicator} aria-hidden="true">
        <span className="fr-icon fr-icon-search-line" aria-hidden="true" />
      </span>
      <span className={styles.srOnly}>{buttonLabel}</span>
    </button>
  )
}
