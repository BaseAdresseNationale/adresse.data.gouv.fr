'use client'

import styled from 'styled-components'

export const DistrictMicroToponymListInfo = styled.div.attrs({ className: 'ri-information-line' })`
  display: block;
  margin: 1.5rem 0;
  font-size: 0.9em;
  font-style: italic;
  line-height: 1.5rem;
  color: var(--text-mention-grey);

  &::before {
    width: 1.25em;
    height: 1.25em;
    margin-right: 0.25em;
    vertical-align: -0.25rem;
  }
`

export const ClearInputButton = styled.button`
  position: absolute;
  right: 2rem;
  height: calc(100% - 2px);
  padding-top: 2px;
  width: 2rem;
`
