'use client'

import { useState } from 'react'
import styled, { css } from 'styled-components'

import { PanelDetailsItem } from './PanelDetailsItem'

const PanelDetailsItemDeskLabel = styled.a.attrs(({ onClick }) => ({
  className: 'fr-link fr-link--icon-right fr-icon-question-line',
  href: '#',
  onClick: (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    onClick?.(e)
  },
}))`
  &:not(.dsfr) {
    cursor: pointer;
    font-weight: bold;
    font-size: inherit;
    line-height: inherit;
    color: inherit;
    background: none;
  }

  &:not(.dsfr):after {
    color: var(--text-default-grey);
    margin-left: 0.25em;
    margin-bottom: -0.1em;
    --icon-size: 0.9em;
  }
`

const PanelDetailsDesc = styled.div<{ $isOpen?: boolean }>`
  display: block;
  font-size: 0.9em;
  font-style: italic;
  line-height: 1.5rem;
  padding-right: 1em;
  color: var(--text-mention-grey);

  overflow: hidden;
  max-height: 5rem;
  transition: max-height 0.3s ease;

  ${({ $isOpen }) => !$isOpen && css`
    max-height: 0;
  `}
`

interface PanelDetailsItemWithDescProps extends React.HTMLAttributes<HTMLLIElement> {
  message: React.ReactNode
  desc: React.ReactNode
}

export const PanelDetailsItemWithDesc = ({
  message,
  desc,
  className,
  ...props
}: PanelDetailsItemWithDescProps) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <PanelDetailsItem
      {...props}
      className={
        `${className || ''} `
        + `isIsolated `
        + `${className}`
      }
    >
      <div>
        <PanelDetailsItemDeskLabel onClick={() => setIsOpen(!isOpen)}>
          {message}
        </PanelDetailsItemDeskLabel>
        <PanelDetailsDesc $isOpen={isOpen}>
          {desc}
        </PanelDetailsDesc>
      </div>
    </PanelDetailsItem>
  )
}
