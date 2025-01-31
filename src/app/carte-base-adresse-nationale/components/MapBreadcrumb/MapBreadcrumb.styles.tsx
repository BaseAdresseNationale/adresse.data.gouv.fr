'use client'

import styled from 'styled-components'

export const MapBreadcrumbWrapper = styled.div`
  padding: 0 1rem;
  pointer-events: all;
`

export const MapBreadcrumbEntry = styled.span.attrs({
  className: 'fr-breadcrumb',
})`
  vertical-align: 0.25rem;
  white-space: nowrap;
`
