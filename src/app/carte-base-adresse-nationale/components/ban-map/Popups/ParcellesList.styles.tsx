'use client'

import styled from 'styled-components'

import theme from '@/theme'

export const ParcellesWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  flex-flow: wrap;
`

export const Parcelle = styled.div`
  padding: 0 8px;
  margin: 2px 4px;
  background-color: ${theme.colors.primary.bg};
  color: ${theme.colors.primary.main};
  border-radius: 4px;
  font-weight: 600;
`
