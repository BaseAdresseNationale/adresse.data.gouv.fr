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
                  // élément dernier
                  const isLastSegment = index === path.length - 1
                  // le segment est un numéro
                  const isAddressNumberSegment = segment.startsWith('Numéro ')
                  // élément précédent
                  const previousSegment = index > 0 ? path[index - 1] : undefined
                  // Vérifie si c'est un élément cliquable permet d'identifier que c'est une voie et non un nom  de commune
                  const followsClickableSegment = previousSegment && typeof previousSegment !== 'string'

                  return (
                    <li key={index}>
                      {/* Applique le style de retour à la ligne ($allowWrap) UNIQUEMENT si :
                          1. C'est le dernier élément
                          2. Il suit un lien cliquable (donc c'est une Voie ou un Numéro)
                          3. Ce N'EST PAS un numéro (on veut garder les numéros sur une seule ligne)
                      */}
                      <MapBreadcrumbEntry $allowWrap={Boolean(isLastSegment && followsClickableSegment && !isAddressNumberSegment)}>
                        {segment}
                      </MapBreadcrumbEntry>
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
