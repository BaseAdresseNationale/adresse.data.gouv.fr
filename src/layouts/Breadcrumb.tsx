'use client'

import { Breadcrumb as _Breadcrumb } from '@codegouvfr/react-dsfr/Breadcrumb'
import { MainNavigationProps } from '@codegouvfr/react-dsfr/MainNavigation'
import { usePathname } from 'next/navigation'
import { useMemo } from 'react'
import { navEntries } from './Header'
import styled from 'styled-components'

const StyledWrapper = styled.div`
  > nav {
    margin-bottom: 1rem;
  }
`

function getSegments(entries: MainNavigationProps.Item[], pathname: string): { label: string, linkProps: { href: string } }[] {
  for (const entry of entries) {
    const { menuLinks, text, linkProps } = entry

    if (linkProps?.href === pathname) {
      return [{
        label: text as string,
        linkProps: linkProps as { href: string },
      }]
    }

    if (menuLinks) {
      const segments = getSegments(menuLinks, pathname)
      if (segments.length) {
        return linkProps
          ? [{
              label: text as string,
              linkProps: linkProps as { href: string },
            }, ...segments]
          : segments
      }
    }
  }

  return []
}

export default function Breadcrumb() {
  const pathname = usePathname()

  const segments = useMemo(
    () => pathname === '/' ? [] : getSegments(navEntries, pathname),
    [pathname]
  )

  return (
    segments.length > 0
      ? (
          <StyledWrapper className="fr-container">
            <_Breadcrumb
              segments={segments.slice(0, segments.length - 1)}
              currentPageLabel={segments[segments.length - 1].label}
              homeLinkProps={{
                href: '/',
              }}
            />
          </StyledWrapper>
        )
      : null
  )
}
