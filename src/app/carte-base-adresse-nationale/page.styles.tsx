'use client'

import styled from 'styled-components'

export const MapSearchResultsWrapper = styled.div`
  min-height: 200%;
  padding: 5rem 1rem 1rem;
  background-color: var(--background-default-grey);
  scroll-snap-align: start;
  pointer-events: auto;

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    min-height: 100%;
    margin-top: 0;
  }
`
