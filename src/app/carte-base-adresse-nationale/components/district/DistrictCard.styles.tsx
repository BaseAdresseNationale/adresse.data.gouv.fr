'use client'

import styled from 'styled-components'

export const DistrictHeaderWrapper = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 1.25rem;
  margin-top: 2rem;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 4px solid var(--border-active-blue-france);
`

export const DistrictLogoWrapper = styled.div`
`

export const DistrictLabelWrapper = styled.div`
`

export const DistrictLabelPrefix = styled.span`
  display: block;
  margin-bottom: 0.25rem;
  font-size: 0.8rem;
  line-height: 1;
`

export const DistrictLabel = styled.span.attrs({ className: 'fr-link' })`
  display: block;
  margin-bottom: 0.5rem;
  font-size: 1.5rem;
  font-weight: 700;
  line-height: 1.25;
`

export const DistrictLabelCode = styled.span`
  display: block;
  margin-bottom: 0.5rem;
  font-size: 0.8em;
  font-weight: 700;
`

export const DistrictDetailsWrapper = styled.ul`
  padding: 0;
  margin: 2rem 0;
  font-size: 0.9rem;
  line-height: 1.5;
`

export const DistrictDetailsItem = styled.li`
  display: block;
  margin-bottom: 0.2em;

  b {
    font-weight: 500;
    font-size: 1.1em;
  }

  &::before {
    width: 1.25em;
    height: 1.25em;
    margin-right: 0.5em;
    vertical-align: -0.25rem;
  }
`
