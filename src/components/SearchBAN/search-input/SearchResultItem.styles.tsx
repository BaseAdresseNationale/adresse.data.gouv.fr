'use client'

import styled, { css } from 'styled-components'

export const Item = styled.div<{ $isHighlighted?: boolean }>`
  padding: 0.5em;
  display: flex;
  flex-flow: column;
  justify-content: flex-start;
  align-items: flex-start;

  ${css`
      @container (min-width: 400px) {
        & {
          flex-flow: row;
          justify-content: space-between;
          align-items: center;
        }
    }
  `}

  ${({ $isHighlighted }) => $isHighlighted && css`
    background-color: var(--background-alt-blue-france-hover);
    color: var(--text-inverted-grey);
  `}

  &:hover {
    cursor: pointer;
  }

  &.item-highlighted {
    background-color: var(--background-alt-blue-france-hover);
    color: var(--text-inverted-grey);
  }
`

export const ItemLabel = styled.div`
  font-weight: 600;
`

export const ItemDetails = styled.div``
