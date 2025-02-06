'use client'

import styled from 'styled-components'

export const PanelHeaderWrapper = styled.div`
  font-size: 0.65rem;

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    font-size: 1rem;
  }
`
