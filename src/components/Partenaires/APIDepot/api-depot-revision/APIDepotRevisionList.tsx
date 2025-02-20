'use client'

import Tooltip from '@/components/Tooltip'
import APIDepotRevisionItem from './APIDepotRevisionItem'
import { Revision } from '@/types/api-depot.types'

interface APIDepotRevisionsListProps {
  revisions: Pick<Revision, 'id' | 'codeCommune' | 'status' | 'isCurrent' | 'publishedAt' | 'validation'>[]
}

function APIDepotRevisionsList({ revisions }: APIDepotRevisionsListProps) {
  return (
    <section>
      <h5>Revisions par commune</h5>
      {(revisions && revisions.length > 0)
        ? (
            <div className="fr-table">
              <table>
                <thead>
                  <tr>
                    <th scope="col"></th>
                    <th scope="col">Commune</th>
                    <th scope="col">Date de publication</th>
                    <th scope="col">
                      <Tooltip message="Nombre de ligne totale du fichier / nombre de ligne comportant des erreurs dans celui-ci">
                        Nbr ligne /erreur
                      </Tooltip>
                      Nombre ligne / erreur(s)
                    </th>
                    <th scope="col">Fichier</th>
                  </tr>
                </thead>

                <tbody>
                  {revisions.map(revision => (
                    <APIDepotRevisionItem key={revision.id} {...revision} />
                  ))}
                </tbody>
              </table>
            </div>
          )
        : (
            <p>Aucune revision</p>
          )}
    </section>
  )
}

export default APIDepotRevisionsList
