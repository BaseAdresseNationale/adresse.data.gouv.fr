'use client'

import parse, { domToReact, Element, HTMLReactParserOptions } from 'html-react-parser'
import ZoomableImage from '@/components/ImageLightbox/ZoomableImage'

import { TextWrapper } from './HtmlViewer.styles'

interface HtmlViewerProps {
  html: string
  isStyled?: boolean
  enableImageZoom?: boolean
}

export default function HtmlViewer({ html, isStyled = true, enableImageZoom = false }: HtmlViewerProps) {
  const parserOptions: HTMLReactParserOptions = {
    replace: (node) => {
      if (!(node instanceof Element)) {
        return
      }

      if (node.name === 'video') {
        return (
          <video controls>
            {domToReact(node.children as never, parserOptions)}
          </video>
        )
      }

      if (!enableImageZoom || node.name !== 'img' || !node.attribs?.src) {
        return
      }

      if (node.parent?.type === 'tag' && node.parent.name === 'a') {
        return
      }

      const src = node.attribs.src
      const alt = node.attribs.alt || 'Image de contenu'

      return (
        <ZoomableImage
          src={src}
          alt={alt}
          width={0}
          height={0}
          sizes="100vw"
          style={{ width: '100%', height: 'auto' }}
          buttonClassName="html-viewer__zoomable-image"
          buttonLabel="Agrandir l'image"
        />
      )
    }
  }

  return html && (
    isStyled
      ? <TextWrapper>{parse(html, parserOptions)}</TextWrapper>
      : <div>{parse(html, parserOptions)}</div>
  )
}
