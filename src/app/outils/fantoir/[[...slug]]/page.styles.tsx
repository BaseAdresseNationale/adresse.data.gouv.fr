'use client'

import styled from 'styled-components'

export const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: center;
`

export const Search = styled.div`
  padding: 1em 0;
`

export const CsvLink = styled.div`
  text-align: left;
  padding: .5em 0;

  & .fr-download {
    display: inline-block;
  }
`
