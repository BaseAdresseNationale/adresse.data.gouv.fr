'use client'

import { useDOMRef } from '@/hooks/useDOMRef'
import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import styled from 'styled-components'

interface TooltipProps {
  children: React.ReactNode
  message: string | React.ReactNode
  style?: React.CSSProperties
  placement?: 'top' | 'bottom' | 'left' | 'right'
}

const StyledTooltip = styled.span<{ $top?: number, $left?: number }>`
  display: block;
  position: fixed;
  top: ${({ $top }) => $top ? `${$top}px` : '0'};
  left: ${({ $left }) => $left ? `${$left}px` : '0'};
  z-index: 1000;
  background-color: #fff;
  padding: 0.5rem;
  border-radius: 0.1rem;
  color: var(--text-default-grey);
  font-size: 0.8rem;
  filter: drop-shadow(var(--overlap-shadow));
  max-width: 200px;

  &:before {
    content: "";
    position: absolute;
    border-width: 5px;
    border-style: solid;
  }

  &.bottom {
    transform: translateX(-50%);
    &:before {
      border-color: transparent transparent #fff transparent;
      bottom: 100%;
      left: 50%;
      transform: translateX(-50%);
    }
  }

  &.top {
    transform: translate(-50%, -100%);
    &:before {
      top: 100%;
      left: 50%;
      transform: translateX(-50%);
      border-color: #fff transparent transparent transparent;
    }
  }

  &.left {
    transform: translate(-100%, -50%);
    &:before {
      top: 50%;
      left: 100%;
      transform: translateY(-50%);
      border-color: transparent transparent transparent #fff;
    }
  }

  &.right {
    transform: translateY(-50%);
    &:before {
      top: 50%;
      right: 100%;
      transform: translateY(-50%);
      border-color: transparent #fff transparent transparent;
    }
  }
`

function getTooltipPosition(el: Element | null, placement: 'top' | 'bottom' | 'left' | 'right') {
  if (!el) {
    return { top: 0, left: 0 }
  }

  const rect = el.getBoundingClientRect()
  switch (placement) {
    case 'top':
      return {
        top: rect.top - 10,
        left: rect.left + (rect.width / 2),
      }
    case 'bottom':
      return {
        top: rect.bottom + 10,
        left: rect.left + (rect.width / 2),
      }
    case 'left':
      return {
        top: rect.top + (rect.height / 2),
        left: rect.left - 10,
      }
    case 'right':
      return {
        top: rect.top + (rect.height / 2),
        left: rect.right + 10,
      }
  }
}

export default function Tooltip({ children, message, style, placement: initialPlacement = 'top' }: TooltipProps) {
  const [id] = useState(Math.random().toString(36).substring(7))
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 })
  const [isHovered, setIsHovered] = useState(false)
  const [placement, setPlacement] = useState(initialPlacement)
  const [containerRef, setContainerRef] = useDOMRef<HTMLDivElement>()
  const [tooltipRef, setTooltipRef] = useDOMRef<HTMLSpanElement>()

  useEffect(() => {
    const handleScroll = () => setIsHovered(false)
    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  // Place tooltip
  useEffect(() => {
    if (containerRef) {
      const { top, left } = getTooltipPosition(containerRef, placement)
      setTooltipPosition({ top, left })
    }
  }, [containerRef, placement, isHovered])

  // Change tooltip placement if it's out of the screen
  useEffect(() => {
    if (!tooltipRef) {
      return
    }

    const rect = tooltipRef.getBoundingClientRect()
    if (rect.x < 0) {
      setPlacement('right')
    }
    if (rect.right > window.innerWidth) {
      setPlacement('left')
    }
    if (rect.y < 0) {
      setPlacement('bottom')
    }
    if (rect.bottom > window.innerHeight) {
      setPlacement('top')
    }
  }, [tooltipRef])

  const tooltipElem = (
    <StyledTooltip ref={setTooltipRef} className={placement} id={id} role="tooltip" aria-hidden="true" style={style} $top={tooltipPosition.top} $left={tooltipPosition.left}>
      {message}
    </StyledTooltip>
  )

  return (
    <>
      <div aria-describedby={id} ref={setContainerRef} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
        {children}
      </div>
      {isHovered && containerRef && createPortal(tooltipElem, document.body, id)}
    </>
  )
}
