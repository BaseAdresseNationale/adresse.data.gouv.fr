'use client'

import { useState } from 'react'

interface TooltipProps {
  children: React.ReactNode
  message: string | React.ReactNode
  style?: React.CSSProperties
}

export default function Tooltip({ children, message, style }: TooltipProps) {
  const [id] = useState(Math.random().toString(36).substring(7))

  return (
    <>
      <div aria-describedby={id}>
        {children}
      </div>
      <span className="fr-tooltip fr-placement" id={id} role="tooltip" aria-hidden="true" style={style}>
        {message}
      </span>
    </>
  )
}
