'use client'

import styled, { css } from 'styled-components'

export const TextWrapper = styled.div`
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: flex-start;
    gap: 1rem;

    div~fr-card {
      width: 588px;
      height: 256px;
      gap: 0px;
      border: 1px 0px 0px 0px;
      opacity: 0px;
    }
`

const gap = '1rem'
export const CardContainer = styled.div<{ $cols?: number }>`
  display: flex;
  flex-wrap: wrap;
  
  gap: ${gap};

  & > div {
    flex-grow: 1;
    flex-shrink: 1;
    flex-basis: ${({ $cols = 3 }) => css`calc(${(100 / $cols).toFixed(2)}% - ${gap})`};
    min-width: 250px;

    /* Ciblage du wrapper image pour aligner en haut */
    .fr-card__img {
      display: flex;
      align-items: flex-start;
    }
  }
`
