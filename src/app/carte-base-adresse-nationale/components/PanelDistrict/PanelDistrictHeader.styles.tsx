'use client'

import styled from 'styled-components'

import { mainInfo, PanelHeaderWrapper } from '../Panel'

export const DistrictHeaderWrapper = styled(PanelHeaderWrapper)`
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 1.25rem;
`

export const DistrictHeader = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`

export const DistrictLogoWrapper = styled.div`
  position: relative;

  img {
    max-width: 100%;
    width: auto;
    height: auto;
    height: 5em;
  }
`

export const DistrictLabelWrapper = styled.div``

export const DistrictLabelPrefix = styled.span`
  display: block;
  font-size: .8em;
  font-weight: 300;
  line-height: 1;
  margin-bottom: 0.25rem;
`

export const DistrictLabel = styled.span`
  ${mainInfo}
  display: block;
  margin-bottom: 0.5rem;
  line-height: 1;
`

export const DistrictLabelCode = styled.span`
  display: block;
  margin-bottom: 0.5rem;
  font-size: 0.9em;
  font-weight: 700;
`
