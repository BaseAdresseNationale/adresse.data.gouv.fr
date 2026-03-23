import {
  MapBreadcrumbWrapper,
  MapBreadcrumbEntry,
  MapBreadcrumbEntryLink,
} from './MapBreadcrumb.styles'

interface MapBreadcrumbPathSegment {
  label: string
  linkProps?: {
    href: string
    target?: string
  }
  type?: 'Region' | 'Departement' | 'Province' | 'District' | 'Toponyme' | 'Address' | 'Other'
}
export interface MapBreadcrumbPath extends Array<MapBreadcrumbPathSegment> {}

export interface MapBreadcrumbProps {
  path: MapBreadcrumbPath
}

function MapBreadcrumb({ path = [] }: MapBreadcrumbProps) {
  const noWrapTypes = ['Departement', 'Province', 'Address'] as const
  return path && path.length
    ? (
        <div>
          <MapBreadcrumbWrapper>
            <ol className="fr-breadcrumb__list">
              {path.map((segment, index) => {
                if (!segment?.linkProps) {
                  return (
                    <li key={index}>
                      <MapBreadcrumbEntry $noWrap={noWrapTypes.includes(segment.type as typeof noWrapTypes[number])}>
                        {segment.label}
                      </MapBreadcrumbEntry>
                    </li>
                  )
                }

                return (
                  <li key={index}>
                    <MapBreadcrumbEntryLink
                      $noWrap={noWrapTypes.includes(segment.type as typeof noWrapTypes[number])}
                      href={segment.linkProps?.href as unknown as URL}
                      target={segment.linkProps?.target}
                    >
                      {segment.label}
                    </MapBreadcrumbEntryLink>
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
