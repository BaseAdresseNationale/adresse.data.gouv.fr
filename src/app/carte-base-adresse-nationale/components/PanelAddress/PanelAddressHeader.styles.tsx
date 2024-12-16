'use client'

import styled, { css } from 'styled-components'

export const AddressLabelWrapper = styled.div`
  font-size: 1rem;
`

export const AddressNumber = styled.span`
  font-size: 1.55em;
  line-height: 1;
  font-weight: 300;
`
export const AddressNumberSuffix = styled.span`
  font-size: 0.75em;
  vertical-align: top;
  margin-left: 0.15em;
`

export const AddressMicroTopoLabel = styled.span<{ $isOnNewLine: boolean }>`
  font-size: 1em;
  ${({ $isOnNewLine }) => $isOnNewLine && css`display: block;`}
`
