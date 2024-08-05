'use client'

import styled from 'styled-components'

export const CardContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1rem;

  & > div {
    flex: 1 1 300px;
  }
`
