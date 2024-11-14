'use client'

import styled from 'styled-components'
import Image from 'next/image'

export const AddressHeaderWrapper = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 1.25rem;
  margin-top: 2rem;
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 4px solid var(--border-active-blue-france);
`

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

export const AddressDetailsWrapper = styled.ul`
  padding: 0;
  line-height: 1.5;
  font-size: 0.9rem;
  margin: 2rem 0;
`

export const AddressDetailsItem = styled.li`
  display: flex;
  flex-direction: row;
  margin-bottom: 0.2em;

  b {
    font-weight: 500;
    font-weight: normal;
    font-size: 1.1em;
  }

  &::before {
    margin-right: 0.5em;
    width: 1.25em;
    height: 1.25em;
    vertical-align: -0.25rem;
  }
`

export const AddressDetailsItemValue = styled.pre`
  font-size: small;
  font-weight: 700;
  margin-bottom: 0.5rem;
  white-space: pre-line;
`
