'use client'

import styled from 'styled-components'
import Image from 'next/image'

export const MicroToponymHeaderWrapper = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 1.25rem;
  margin-top: 2rem;
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 4px solid var(--border-active-blue-france);
`

export const MicroToponymLabelWrapper = styled.div`
`

export const MicroToponymLabel = styled.span`
  display: block;
  margin-bottom: 0.5rem;
  font-size: 1.5rem;
  font-weight: 700;
  line-height: 1.25;

`
export const MicroToponymLabelAlt = styled.span`
  display: block;
  margin-bottom: 0.5rem;
  font-size: 0.95rem;
  font-weight: 700;
  line-height: 1;
`

const flagSize = '1.3em'

export const MicroToponymLabelFlag = styled(Image).attrs({
  width: 24,
  height: 24,
})`
  width: ${flagSize};
  height: ${flagSize};
  margin: -0.3em 0 -0.1em;
  vertical-align: -0.1em;
  border: 1px solid #fff;
  border-radius: 50%;
  box-shadow: 0 0 0.3rem -0.1rem rgba(0, 0, 0, 0.7);
`

export const MicroToponymDistrictLabelPrefix = styled.span`
  display: block;
  margin-bottom: 0.25rem;
  font-size: 0.8rem;
  line-height: 1;
`

export const MicroToponymDistrictLabel = styled.span.attrs({ className: 'fr-link' })`
  display: block;
  margin-bottom: 0rem;
  font-size: 0.8rem;
  font-weight: 700;
  line-height: 1.25;
`
