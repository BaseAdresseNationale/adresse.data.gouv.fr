import Link from 'next/link'

import {
  MapBreadcrumbWrapper,
  MapBreadcrumbEntry,
} from './MapBreadcrumb.styles'

interface MapBreadcrumbPathSegment {
  label: string
  linkProps?: {
    href: string
    target?: string
  }
}
export interface MapBreadcrumbPath extends Array<string | MapBreadcrumbPathSegment> {}

export interface MapBreadcrumbProps {
  path: MapBreadcrumbPath
}

function MapBreadcrumb({ path = [] }: MapBreadcrumbProps) {
  return path && path.length
    ? (
        <div>
          <MapBreadcrumbWrapper>
            <ol className="fr-breadcrumb__list">
              {path.map((segment, index) => {
                if (typeof segment === 'string') {
                  return (
                    <li key={index}>
                      <MapBreadcrumbEntry>{segment}</MapBreadcrumbEntry>
                    </li>
                  )
                }

                return (
                  <li key={index}>
                    <Link
                      className="fr-breadcrumb__link"
                      href={segment.linkProps?.href as unknown as URL}
                      target={segment.linkProps?.target}
                    >
                      {segment.label}
                    </Link>
                  </li>
                )
              }
              )}
            </ol>
          </MapBreadcrumbWrapper>
        </div>
      )
    : null
}

export default MapBreadcrumb
