'use client'

import styled, { css } from 'styled-components'

export const ActionWrapper = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  margin: 0;
  padding: 0;
  list-style: none;
`

export const ActionList = styled.ul`
  display: block;
  padding: 0;
  margin: 0;
  list-style: none;
`

export const ActionMessage = styled.div<{ $isVisible?: boolean }>`
  font-size: 0.8rem;
  font-weight: 300;
  line-height: 1.5;
  color: var(--text-default-grey);
  margin: 0 1em 0 3em;
  border-left: 1px solid;
  padding: 0 1em;

  overflow: hidden;
  opacity: 1;
  max-height: 10rem;
  transition: max-height 0.3s ease, opacity 0.3s ease;

  ${
    ({ $isVisible }) => !$isVisible && css`
      opacity: 0;
      max-height: 0;
    `
  }

  a {
      font-size: inherit;
  }

`
