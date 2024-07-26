'use client'

import Image from 'next/image'
import {
  BlocksRenderer,
  type BlocksContent,
} from '@strapi/blocks-react-renderer'

export default function BlockRendererClient({
  content,
}: {
  readonly content: BlocksContent
}) {
  if (!content) {
    return null
  }

  return (
    <BlocksRenderer
      content={content}
      blocks={{
        image: ({ image }) => (
          <Image
            src={image.url}
            width={image.width}
            height={image.height}
            alt={image.alternativeText || ''}
          />
        ),
      }}
    />
  )
}
