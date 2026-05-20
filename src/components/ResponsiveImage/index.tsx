import Image from 'next/image'
import { ZoomableImage } from '@/components/ImageLightbox'

export interface ResponsiveImageProps {
  src: string
  alt: string
  style?: React.CSSProperties
  className?: string
  zoomable?: boolean
}

export default function ResponsiveImage({ src, alt, style, className, zoomable = false }: ResponsiveImageProps) {
  if (zoomable) {
    return (
      <ZoomableImage
        src={src}
        alt={alt}
        width={0}
        height={0}
        className={className}
        sizes="100vw"
        style={{ width: '100%', height: 'auto', ...style }}
      />
    )
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={0}
      height={0}
      className={className}
      sizes="100vw"
      style={{ width: '100%', height: 'auto', ...style }}
    />
  )
}
