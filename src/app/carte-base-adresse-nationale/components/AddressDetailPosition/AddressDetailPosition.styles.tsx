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

export const PositionCoords = styled.strong`
  font-size: 0.85em;
  font-weight: normal;
  letter-spacing: 0.04em;
`

export const PositionActions = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  margin-bottom: -0.2rem;
`

export const PositionCoordValue = styled.span`
  white-space: nowrap;
`

export const PositionMarker = styled.i`
  display: inline-block;
  font-style: normal;
  font-size: var(--xl-size);
  width: var(--xl-size);
  text-align: right;
`
