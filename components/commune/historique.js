import PropTypes from 'prop-types'
import {RefreshCw} from 'react-feather'
import {orderBy} from 'lodash'

import Section from '@/components/section'
import HistoriqueItem from './historique-item'

function Historique({revisions, communeName, codeCommune, hasHistoryAdresses}) {
  const sortRevisionsByDate = revisions && orderBy(revisions, [
    function (revision) {
      return new Date(revision.updatedAt)
    }
  ], ['desc'])

  return (
    <Section title='Historiques mises à jours de la Base Adresse Locale'>
      {hasHistoryAdresses ? (
        <div className='historique-wrapper'>
          <h4><RefreshCw size={25} /> Retrouvez les cinq dernières mise à jour</h4>
          <div className='historique-items'>
            {sortRevisionsByDate.slice(0, 5).map(revision => <HistoriqueItem key={revision._id} balData={revision} communeName={communeName} codeCommune={codeCommune} />)}
          </div>
        </div>
      ) : (
        <p>Retrouvez bientôt l’historique des dépôts et révisions de la Base Adresse Locale de la commune.</p>
      )}

      <style jsx>{`
        .historique-wrapper {
          text-align: center;
          margin-top: 2em;
        }

        h4 {
          margin: 3em 0 2em 0;
          display: flex;
          justify-content: center;
          gap: 10px;
        }

        .historique-items {
          display: flex;
          flex-direction: column;
          gap: 1em;
        }

        p {
          font-style: italic;
          text-align: center;
        }
      `}</style>
    </Section>
  )
}

Historique.propTypes = {
  revisions: PropTypes.array,
  communeName: PropTypes.string.isRequired,
  hasHistoryAdresses: PropTypes.bool.isRequired,
  codeCommune: PropTypes.string.isRequired
}

Historique.defaultType = {
  revisions: []
}

export default Historique
