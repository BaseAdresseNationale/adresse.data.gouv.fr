'use client'

import { useEffect, useRef } from 'react'

import { TextWrapper } from './HtmlViewer.styles'

export default function HtmlViewer({ html, isStyled = true }: { html: string, isStyled?: boolean }) {
  const wrapperElement = useRef(null)

  useEffect(() => {
    (wrapperElement.current as unknown as HTMLElement)?.querySelectorAll('video').forEach((video: HTMLVideoElement) => {
      video.controls = true
    })
  }, [])

  return html && (
    isStyled
      ? <TextWrapper ref={wrapperElement} dangerouslySetInnerHTML={{ __html: html }} />
      : <div ref={wrapperElement} dangerouslySetInnerHTML={{ __html: html }} />
  )
}
