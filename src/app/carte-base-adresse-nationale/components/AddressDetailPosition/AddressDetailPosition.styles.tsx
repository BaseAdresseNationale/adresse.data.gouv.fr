'use client'

import styled from 'styled-components'

export const PositionWrapper = styled.div`
  display: flex;
  gap: 0.5rem;
`

export const PositionDetails = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`

export const PositionDetailEntryType = styled.span`
  display: inline-block;

  &::first-letter {
    text-transform: uppercase;
  }
`

export const PositionType = styled.span`
  font-size: 0.9rem;
  font-weight: bold;
`

export const PositionActions = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  margin-bottom: -0.2rem;
`
