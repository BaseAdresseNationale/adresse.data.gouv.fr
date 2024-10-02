'use client'

import { Breadcrumb as BreadcrumbDSFR } from '@codegouvfr/react-dsfr/Breadcrumb'
import { MainNavigationProps } from '@codegouvfr/react-dsfr/MainNavigation'
import { usePathname } from 'next/navigation'
import { ReactNode, useMemo } from 'react'
import { navEntries } from './Header'
import styled from 'styled-components'

import type { RegisteredLinkProps } from '@codegouvfr/react-dsfr/link'

type Segment = {
  label: ReactNode
  linkProps: RegisteredLinkProps
}

export const BreadcrumbWrapper = styled.div.attrs({ className: 'fr-container ' })`
  > nav {
    margin-bottom: 1rem;
    margin-top: 1.5rem;
  }
`

function getSegments(entries: MainNavigationProps.Item[], pathname: string): Segment[] {
  for (const entry of entries) {
    const { menuLinks, text: label, linkProps } = entry

    if (linkProps?.href === pathname) {
      return [{
        label,
        linkProps,
      }]
    }

    if (menuLinks) {
      const segments = getSegments(menuLinks, pathname)
      if (segments.length) {
        return linkProps
          ? [{
              label,
              linkProps,
            }, ...segments]
          : segments
      }
    }
  }

  return []
}

export default function Breadcrumb(
  {
    currentPageLabel,
    segments: _segments,
  }: {
    currentPageLabel?: ReactNode
    segments?: Segment[]
  }
) {
  const pathname = usePathname()

  const segments = useMemo(
    () => (
      _segments
        ? [..._segments, { label: currentPageLabel, linkProps: { href: pathname || '' } }]
        : !pathname || pathname === '/'
            ? []
            : getSegments(navEntries, pathname)
    ),
    [_segments, currentPageLabel, pathname]
  )

  return (
    segments.length > 0
      ? (
          <BreadcrumbWrapper className="fr-container">
            <BreadcrumbDSFR
              segments={segments.slice(0, segments.length - 1)}
              currentPageLabel={
                currentPageLabel
                || (segments && segments[segments.length - 1].label)
              }
              homeLinkProps={{
                href: '/',
              }}
            />
          </BreadcrumbWrapper>
        )
      : null
  )
}
