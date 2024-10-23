'use client'

import styled from 'styled-components'

export const ItemHeader = styled.div`
  background-color: var(--background-contrast-grey);
  color: var(--text-label-blue-france);
  padding: 0.2em;
  font-weight: 600;
`

export const SearchResultHeader = styled.div.attrs<{ $header: React.ReactNode }>(({ $header }) => ({
  children: <ItemHeader>{$header}</ItemHeader>,
}))
