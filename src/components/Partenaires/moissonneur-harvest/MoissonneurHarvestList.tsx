'use client'

import { useCallback, useEffect, useState } from 'react'

import { getSourceHarvests } from '@/lib/api-moissonneur-bal'
import MoissonneurHarvestItem from './MoissonneurHarvestItem'
import Pagination from '@codegouvfr/react-dsfr/Pagination'
import Tooltip from '@/components/Tooltip'
import { HarvestMoissonneurType } from '@/types/api-moissonneur-bal.types'

const LIMIT_HARVEST = 5

interface MoissonneurHarvestListProps {
  sourceId: string
}

export default function MoissonneurHarvestList({ sourceId }: MoissonneurHarvestListProps) {
  const [harvests, setHarvests] = useState<HarvestMoissonneurType[]>()
  const [currentPage, setCurrentPage] = useState(1)
  const [totalCount, setTotalCount] = useState(0)

  const fetchHarvests = useCallback(async () => {
    if (sourceId) {
      const { results, count } = await getSourceHarvests(
        sourceId,
        currentPage,
        LIMIT_HARVEST
      )
      setHarvests(results)
      setTotalCount(count)
    }
  }, [currentPage, sourceId])

  /*   const onPageChange = (page) => {
    setCurrentPage(page)
    fetchHarvests(page)
  } */

  useEffect(() => {
    setCurrentPage(1)
    fetchHarvests()
  }, [fetchHarvests, sourceId])

  return (
    <section>
      <h5>Historique des Moissonnages</h5>
      <p>Dès que des modifications ont été détéctés, le nouveau fichier est récupérer pour remplacer l&apos;ancien.</p>
      {(harvests && harvests.length > 0)
        ? (
            <div>
              <div className="fr-table">
                <table>
                  <thead style={{ width: '100%' }}>
                    <tr>
                      <th scope="col">Date</th>
                      <th scope="col">
                        <Tooltip message="Est-ce le fichier a bien été récupéré sur data.gouv.fr">
                          État du moissonnage
                        </Tooltip>
                      </th>
                      <th scope="col">
                        <Tooltip message="Est-ce que le fichier récupéré est valide ? Est-ce qu’il comporte des différences par rapport au précédent.">
                          État de la mise à jour
                        </Tooltip>
                      </th>
                      <th scope="col">Fichier moissonné</th>
                    </tr>
                  </thead>

                  <tbody>
                    {harvests.map(harvest => (
                      <MoissonneurHarvestItem key={harvest._id} {...harvest} />
                    ))}
                  </tbody>
                </table>
              </div>
              <Pagination
                style={{ marginTop: '1rem' }}
                count={totalCount}
                defaultPage={currentPage}
                getPageLinkProps={pageNumber => ({ href: `#page=${pageNumber}` })}
              />
            </div>
          )
        : (
            <p>Aucun moissonnage</p>
          )}

    </section>
  )
}
