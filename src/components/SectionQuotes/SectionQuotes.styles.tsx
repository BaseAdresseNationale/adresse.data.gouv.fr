'use client'

import styled from 'styled-components'

export const QuoteWrapper = styled.div`
  gap: 1rem;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;

  @media screen and (min-width: 1024px) {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(calc(50% - 1rem), 1fr));
    grid-gap: 1rem;
  }
`

export const QuoteWrapperFooter = styled.footer`
  padding: 3rem 0 1rem;
  display: flex;
  justify-content: center;
  gap: 1rem;
  flex-direction: column;
  align-items: flex-start;


  @media screen and (min-width: 768px) {
    flex-direction: row;
    align-items: center;
  }
`
