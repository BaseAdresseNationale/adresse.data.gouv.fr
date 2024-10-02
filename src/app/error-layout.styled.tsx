'use client'

import styled from 'styled-components'

export const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column-reverse;
  align-items: center;
  justify-content: center;
  padding: 2rem 0;
  gap: 2rem;

  @media screen and (min-width: ${props => props.theme.breakpoints.md}) {
    flex-direction: row;
  }

  * {
    flex: 1;
  }

  img {
    max-width: 100%;
    height: auto;
    max-height: 100%;
  }
`
