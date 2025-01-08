import React from 'react'
import Link from 'next/link'

interface BreadcrumbFantoirProps {
  rootPath: string
  nomDepartement?: string
  codeDepartement?: string
  nomCommune?: string
  codeCommune?: string
}

function BreadcrumbFantoir({ rootPath, nomDepartement, codeDepartement, nomCommune, codeCommune }: BreadcrumbFantoirProps) {
  return (
    <nav role="navigation" className="fr-breadcrumb" aria-label="vous êtes ici :">
      <button className="fr-breadcrumb__button" aria-expanded="false" aria-controls="breadcrumb-1">Voir le fil d’Ariane</button>
      <div className="fr-collapse" id="breadcrumb-1">
        <ol className="fr-breadcrumb__list">
          <li>
            {
              nomDepartement && codeDepartement
                ? (
                    <Link
                      className="fr-breadcrumb__link"
                      href={`${rootPath}/`}
                    >
                      Explorateur Fantoir
                    </Link>
                  )
                : (<a className="fr-breadcrumb__link" aria-current="page">Explorateur Fantoir</a>)
            }
          </li>

          {
            nomDepartement && codeDepartement && (
              <>
                <li>
                  {
                    nomCommune && codeCommune
                      ? (
                          <Link
                            className="fr-breadcrumb__link"
                            href={`${rootPath}/${codeDepartement}/`}
                          >
                            {nomDepartement} ({codeDepartement})
                          </Link>
                        )
                      : (<a className="fr-breadcrumb__link" aria-current="page">{nomDepartement} ({codeDepartement})</a>)
                  }
                </li>

                {
                  nomCommune && codeCommune && (
                    <li>
                      <a className="fr-breadcrumb__link" aria-current="page">{nomCommune} ({codeCommune})</a>
                    </li>
                  )
                }
              </>
            )
          }
        </ol>
      </div>
    </nav>
  )
}

export default BreadcrumbFantoir
