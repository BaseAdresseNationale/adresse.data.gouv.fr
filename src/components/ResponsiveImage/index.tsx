import Image from 'next/image'

export interface ResponsiveImageProps {
  src: string
  alt: string
  style?: React.CSSProperties
  className?: string
}

export default function ResponsiveImage({ src, alt, style, className }: ResponsiveImageProps) {
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
