import PropTypes from 'prop-types'
import {RefreshCw} from 'react-feather'

import Section from '@/components/section'
import HistoriqueItem from './historique-item'

function Historique({revisions, communeName}) {
  const sortRevisionsByDate = revisions && revisions.sort((a, b) => {
    a = new Date(a.updatedAt)
    b = new Date(b.updatedAt)
    return a > b ? -1 : (a < b ? 1 : 0)
  })

  return (
    <Section title='Historiques des dépôts et révisions de la BAL'>
      {revisions.length > 0 ? (
        <div className='historique-wrapper'>
          <h4><RefreshCw size={25} /> Retrouvez les cinq dernières mise à jour</h4>
          <div className='historique-items'>
            {sortRevisionsByDate.slice(0, 5).map(revision => <HistoriqueItem key={revision._id} balData={revision} communeName={communeName} />)}
          </div>
        </div>
      ) : (
        <div className='unavailable'>
          <p>Il n’y a pas d’historique pour cette commune.</p>
        </div>
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

        .unavailable p {
          font-style: italic;
          text-align: center;
        }
      `}</style>
    </Section>
  )
}

Historique.propTypes = {
  revisions: PropTypes.array,
  communeName: PropTypes.string.isRequired
}

Historique.defaultType = {
  revisions: []
}

export default Historique
