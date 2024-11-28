'use client'

import styled from 'styled-components'

export const MapSearchResultsWrapper = styled.div`
  min-height: 200%;
  padding: 1rem;
  scroll-snap-align: start;

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    width: 100%;
    min-height: 100%;
    margin-top: 0;
  }
`

export const MapSearchResultsHead = styled.div``
export const MapSearchResultsBody = styled.div``
