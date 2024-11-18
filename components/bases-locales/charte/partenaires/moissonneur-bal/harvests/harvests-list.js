import PropTypes from 'prop-types'
import {useEffect, useState} from 'react'

import MoissonneurHarvestItem from './harvest-item'
import {getSourceHarvests} from '@/lib/moissonneur-bal'
import Pagination from 'react-js-pagination'
import Tooltip from '@/components/base-adresse-nationale/tooltip'

const LIMIT_HARVEST = 5

function MoissonneurHarvestList({sourceId}) {
  const [harvests, setHarvests] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalCount, setTotalCount] = useState(0)

  const fetchHarvests = async () => {
    if (sourceId) {
      const {results, count} = await getSourceHarvests(
        sourceId,
        currentPage,
        LIMIT_HARVEST
      )
      setHarvests(results)
      setTotalCount(count)
    }
  }

  const onPageChange = page => {
    setCurrentPage(page)
    fetchHarvests(page)
  }

  useEffect(() => {
    setCurrentPage(1)
    fetchHarvests()
  }, [sourceId])

  return (
    <section>
      <h5>Historique des Moissonnages</h5>
      <p>Dès que des modifications ont été détéctés, le nouveau fichier est récupérer pour remplacer l&apos;ancien.</p>
      {(harvests && harvests.length > 0) ?
        (
          <div>
            <div className='fr-table'>
              <table>
                <thead style={{width: '100%'}}>
                  <tr>
                    <th scope='col'>Date</th>
                    <th scope='col'>
                      <Tooltip message='Est-ce le fichier a bien été récupéré sur data.gouv.fr' width='200px'>
                        État du moissonnage
                      </Tooltip>
                    </th>
                    <th scope='col'>
                      <Tooltip message='Est-ce que le fichier récupéré est valide ? Est-ce qu’il comporte des différences par rapport au précédent.' width='200px'>
                        État de la mise à jour
                      </Tooltip>
                    </th>
                    <th scope='col'>Fichier moissonné</th>
                  </tr>
                </thead>

                <tbody>
                  {harvests.map(harvest => (
                    <MoissonneurHarvestItem key={harvest.id} {...harvest} />
                  ))}
                </tbody>
              </table>
            </div>
            <div className='pagination fr-mx-auto fr-my-2w'>
              <nav
                role='navigation'
                className='fr-pagination'
                aria-label='Pagination'
              >
                <Pagination
                  activePage={currentPage}
                  itemsCountPerPage={LIMIT_HARVEST}
                  totalItemsCount={totalCount}
                  pageRangeDisplayed={5}
                  onChange={onPageChange}
                  innerClass='fr-pagination__list'
                  activeLinkClass='pagination__active'
                  linkClass='fr-pagination__link'
                  linkClassFirst='fr-pagination__link--first'
                  linkClassPrev='fr-pagination__link--prev'
                  linkClassNext='fr-pagination__link--next'
                  linkClassLast='fr-pagination__link--last'
                />
              </nav>
            </div>
          </div>
        ) : (
          <p>Aucun moissonnage</p>
        )}

      <style global jsx>{`
        .pagination__active {
          text-decoration: none !important;
        }
        `}</style>
    </section>
  )
}

MoissonneurHarvestList.propTypes = {
  sourceId: PropTypes.string,
}

export default MoissonneurHarvestList
