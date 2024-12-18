'use client'

import styled from 'styled-components'

export const PlotsListTitle = styled.b`
  font-size: 1em;
  font-weight: 700;
  margin: 1em 0 .5em;
  display: block;
`

export const PlotsListWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  flex-flow: wrap;
`

export const Plot = styled.div`
  padding: 0 8px;
  margin: 2px 4px;
  background-color: var(--background-alt-blue-france);
  color: var(--text-action-high-blue-france);
  border-radius: 4px;
  font-size: 0.875rem;
  font-weight: 600;
`

export const PlotsRest = styled.div`
  padding: 0 8px;
  margin: 2px 4px;
  font-size: 0.875rem;
  font-weight: 600;
`
