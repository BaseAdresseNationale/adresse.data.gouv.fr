import Image from 'next/image'

export interface ResponsiveImageProps {
  src: string
  alt: string
}

export default function ResponsiveImage({ src, alt }: ResponsiveImageProps) {
  return (
    <Image
      src={src}
      alt={alt}
      width={0}
      height={0}
      sizes="100vw"
      style={{ width: '100%', height: 'auto' }}
    />
  )
}
