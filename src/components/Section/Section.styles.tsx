'use client'

import styled, { css } from 'styled-components'

export const SectionBlock = styled.section<{ $isVisible?: boolean }>`
  ${({ $isVisible }) => typeof $isVisible === 'boolean' && css`
    max-height: 100%;
    opacity: 1;
    overflow-y: hidden;
    transition: ease .5s;
    transition-property: max-height opacity;
  `}
  ${({ $isVisible }) => $isVisible === false && css`
    max-height: 0;
    opacity: 0;
  `}
`

export const SectionFooter = styled.footer`
  padding: 3rem 0 1rem;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 1rem;
`
