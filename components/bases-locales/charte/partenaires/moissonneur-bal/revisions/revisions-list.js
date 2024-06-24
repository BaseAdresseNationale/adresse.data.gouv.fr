import PropTypes from 'prop-types'

import {useEffect, useState} from 'react'
import {getSourceRevisions} from '@/lib/moissonneur-bal'
import MoissonneurRevisionItem from './revision-item'
import Tooltip from '@/components/base-adresse-nationale/tooltip'

function MoissonneurRevisionsList({sourceId}) {
  const [revisions, setRevisions] = useState(null)

  const fetchRevisions = async () => {
    if (sourceId) {
      const results = await getSourceRevisions(sourceId)
      setRevisions(results)
    }
  }

  useEffect(() => {
    fetchRevisions()
  }, [sourceId])

  return (
    <section>
      <h5>Revisions par commune</h5>
      <p>Le fichier récupéré est découpé en BAL par commune.<br />
        Si des adresses ont été modifiées pour une commune, alors une nouvelle revision de la BAL est publiée dans le référentiel national (BAN)</p>
      {(revisions && revisions.length > 0) ? (
        <div className='fr-table'>
          <table>
            <thead>
              <tr>
                <th scope='col'>Code Commune</th>
                <th scope='col'>Date</th>
                <th scope='col'>
                  <Tooltip message='Nombre de ligne totale du fichier / nombre de ligne comportant des erreurs dans celui-ci' width='200px'>
                    Nbr ligne /erreur
                  </Tooltip>
                  Nombre ligne / erreur(s)
                </th>
                <th scope='col'>
                  <Tooltip message='Est-ce que la nouvelle BAL créée est valide ? est-ce qu’elle comporte des différences par rapport à la BAN ?' width='200px'>
                    Etat de la mise à jour
                  </Tooltip>
                  Status
                </th>
                <th scope='col'>
                  <Tooltip message='Lors d’une mise à jours, est-ce que celle-ci remonte bien dans la BAN' width='200px'>
                    Etat de la publication
                  </Tooltip>
                  Publication
                </th>
                <th scope='col'>Fichier</th>
              </tr>
            </thead>

            <tbody>
              {revisions.map(revision => (
                <MoissonneurRevisionItem key={revision._id} {...revision} />
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>Aucune revision</p>
      )}
    </section>
  )
}

MoissonneurRevisionsList.propTypes = {
  sourceId: PropTypes.string,
}

export default MoissonneurRevisionsList
