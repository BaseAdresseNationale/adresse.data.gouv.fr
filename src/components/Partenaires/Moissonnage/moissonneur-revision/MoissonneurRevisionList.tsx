'use client'

import Tooltip from '@/components/Tooltip'
import { getSourceRevisions } from '@/lib/api-moissonneur-bal'
import { useEffect, useState } from 'react'
import MoissonneurRevisionItem from './MoissonneurRevisionItem'
import { RevisionMoissoneurType } from '@/types/api-moissonneur-bal.types'

interface MoissonneurRevisionsListProps {
  sourceId: string
}

function MoissonneurRevisionsList({ sourceId }: MoissonneurRevisionsListProps) {
  const [revisions, setRevisions] = useState<RevisionMoissoneurType[]>([])

  useEffect(() => {
    const fetchRevisions = async () => {
      if (sourceId) {
        const results = await getSourceRevisions(sourceId)
        setRevisions(results)
      }
    }

    fetchRevisions()
  }, [sourceId])

  return (
    <section>
      <h5>Revisions par commune</h5>
      <p>Le fichier récupéré est découpé en BAL par commune.<br />
        Si des adresses ont été modifiées pour une commune, alors une nouvelle revision de la BAL est publiée dans le référentiel national (BAN)
      </p>
      {(revisions && revisions.length > 0)
        ? (
            <div className="fr-table" style={{ overflowX: 'auto' }}>
              <table>
                <thead>
                  <tr>
                    <th scope="col">Commune</th>
                    <th scope="col">Date</th>
                    <th scope="col">
                      Rapport de validation
                    </th>
                    <th scope="col">
                      Etat de la mise à jour
                    </th>
                    <th scope="col">Fichier</th>
                  </tr>
                </thead>

                <tbody>
                  {revisions.map(revision => (
                    <MoissonneurRevisionItem key={revision.id} {...revision} />
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

export default MoissonneurRevisionsList
