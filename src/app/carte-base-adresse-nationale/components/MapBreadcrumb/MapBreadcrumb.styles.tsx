'use client'

import styled, { css } from 'styled-components'
import Link from 'next/link'

export const MapBreadcrumbWrapper = styled.div`
  padding: 0 1rem;
  pointer-events: all;
`

const MapBreadcrumbEntryStyle = css<{ $noWrap?: boolean }>`
  vertical-align: 0.25rem;
  overflow-wrap: anywhere;
  white-space: ${({ $noWrap }) => ($noWrap ? 'nowrap' : 'normal')};
`

export const MapBreadcrumbEntry = styled.span.attrs({
  className: 'fr-breadcrumb',
})<{ $noWrap?: boolean }>`
  ${MapBreadcrumbEntryStyle}
`

export const MapBreadcrumbEntryLink = styled(Link).attrs({
  className: 'fr-breadcrumb__link',
})<{ $noWrap?: boolean }>`
  ${MapBreadcrumbEntryStyle}
`
