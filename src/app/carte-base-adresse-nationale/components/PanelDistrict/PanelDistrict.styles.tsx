'use client'

import styled from 'styled-components'

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
