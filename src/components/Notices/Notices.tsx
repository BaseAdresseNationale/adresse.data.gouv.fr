'use client'

import { useState, useEffect } from 'react'
import NoticeDSFR from '@codegouvfr/react-dsfr/Notice'

import { NoticeWrapper, NoticeMessage } from './Notices.styles'

interface NoticeProps {
  data: {
    text: string
    link?: {
      href: string
      target?: string
    }
  }[]
  duration?: number
  className?: string
}

function Notice({
  data = [],
  duration = 4000,
  className,
}: NoticeProps) {
  const [titleId, setTitleId] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      if (data.length) {
        setTitleId((titleId + 1) % data.length)
      }
    }, duration)
    return () => clearInterval(interval)
  }, [data, duration, titleId])

  const { text, link } = data?.[titleId] || {}
  const title = text && (data.length > 1 ? `(${titleId + 1}/${data.length}) ${text}` : text)

  return title && (
    <NoticeWrapper className={className}>
      <NoticeDSFR
        title={<NoticeMessage {...(link ? { as: 'a', ...link } : {})}>{title}</NoticeMessage>}
        isClosable
      />
    </NoticeWrapper>
  )
}

export default Notice
