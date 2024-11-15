'use client'

import styled, { css } from 'styled-components'

export const SectionBlock = styled.section<{ $isVisible?: boolean }>`
  ${({ $isVisible }) => typeof $isVisible === 'boolean' && css`
    max-height: 3000px;
    opacity: 1;
    overflow-y: hidden;
    transition: max-height ease-in .5s,
      opacity ease-in .5s;
  `}
  ${({ $isVisible }) => $isVisible === false && css`
    max-height: 0;
    opacity: 0;
    transition: max-height ease-out .5s,
      opacity ease-in-out .5s;
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
