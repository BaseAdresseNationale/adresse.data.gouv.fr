'use client'

import styled, { css } from 'styled-components'

export const TextWrapper = styled.div`
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: flex-start;
    gap: 1rem;

    article {
      flex: 65;

      img {
        max-width: 100%;
      }
    }

    aside {
      flex: 35;
      min-width: 300px;
    }
`

const gap = '1rem'
export const CardContainer = styled.div<{ $cols?: number }>`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: ${gap};

  & > div {
    flex-grow: 1;
    flex-shrink: 1;
    flex-basis: ${({ $cols = 3 }) => css`calc(${(100 / $cols).toFixed(2)}% - ${gap})`};
    min-width: 250px;
  }
`
