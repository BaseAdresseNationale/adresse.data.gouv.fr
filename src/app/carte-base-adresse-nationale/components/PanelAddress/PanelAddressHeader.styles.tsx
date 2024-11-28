'use client'

import styled from 'styled-components'
import Image from 'next/image'

export const AddressLabelWrapper = styled.div`
  font-size: 1.5rem;
`

export const AddressPostCode = styled.span`
  display: block;
  font-size: .7em;
  line-height: 1.5;
`

export const AddressNumberAndMicroTopoLabel = styled.span`
  display: block;
  font-size: 1.5rem;
  font-size: 1em;
  line-height: 1.25;
  font-weight: 700;
  margin-bottom: 0.5rem;
`

export const AddressMicroTopoLabelAlt = styled.span`
  display: block;
  font-size: 0.95rem;
  line-height: 1;
  font-weight: 700;
  margin-bottom: 0.5rem;
`

export const AddressMicroTopoLabelFlag = styled(Image).attrs({
  width: 24,
  height: 24,
})`
  width: 1em;
  height: 1em;
  border-radius: 50%;
  vertical-align: -0.1em;
`

export const AddressDistrictLabelPrefix = styled.span`
  display: block;
  font-size: .6em;
  line-height: 1;
  margin-bottom: 0.25rem;
`

export const AddressDistrictLabel = styled.span<{ $historique?: boolean }>`
  display: block;
  font-size: 0.7em;
  line-height: 1.25;
  font-weight: ${({ $historique }) => $historique ? '400' : '700'};
  margin-bottom: 0rem;
`
