'use client'

import { useEffect, useState } from 'react'

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

  useEffect(() => {
    const changeCurrentPage = (page: number) => {
      setCurrentPage(page)
    }
    const fetchHarvests = async () => {
      const { results, count } = await getSourceHarvests(
        sourceId,
        currentPage,
        LIMIT_HARVEST
      )
      setHarvests(results)
      setTotalCount(count)
    }

    if (!sourceId) {
      return
    }

    changeCurrentPage(currentPage)
    fetchHarvests()
  }, [sourceId, currentPage])

  return (
    <section>
      <h5>Historique des Moissonnages</h5>
      <p>Dès que des modifications sont détéctées, le nouveau fichier est récupéré pour remplacer l&apos;ancien.</p>
      {(harvests && harvests.length > 0)
        ? (
            <div>
              <div className="fr-table" style={{ overflowX: 'auto' }}>
                <table>
                  <thead style={{ width: '100%' }}>
                    <tr>
                      <th scope="col">Date</th>
                      <th scope="col">État du moissonnage</th>
                      <th scope="col">Fichier moissonné</th>
                    </tr>
                  </thead>

                  <tbody>
                    {harvests.map(harvest => (
                      <MoissonneurHarvestItem key={harvest.id} {...harvest} />
                    ))}
                  </tbody>
                </table>
              </div>
              <Pagination
                style={{ marginTop: '1rem' }}
                count={totalCount}
                defaultPage={currentPage}
                getPageLinkProps={pageNumber => ({ href: `#page=${pageNumber}`, onClick: () => setCurrentPage(pageNumber) })}
              />
            </div>
          )
        : (
            <p>Aucun moissonnage</p>
          )}
    </section>
  )
}
