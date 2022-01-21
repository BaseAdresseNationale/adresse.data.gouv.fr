import PropTypes from 'prop-types'
import {RefreshCw, Edit2} from 'react-feather'

import Section from '@/components/section'
import ButtonLink from '@/components/button-link'
import HistoriqueItem from './historique-item'

function Historique({revisions, communeName}) {
  const sortRevisionsByDate = revisions && revisions.sort((a, b) => {
    a = new Date(a.updatedAt)
    b = new Date(b.updatedAt)
    return a > b ? -1 : (a < b ? 1 : 0)
  })

  return (
    <Section color='grey' title='Historiques des dépôts et révisions de la BAL'>
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
          <ButtonLink
            isExternal
            size='large'
            target='_blank'
            rel='noreferrer'
            href='https://mes-adresses.data.gouv.fr/new'
          >
            Créer votre Base Adresse Locale <Edit2 style={{verticalAlign: 'bottom', marginLeft: '3px'}} />
          </ButtonLink>
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

        .unavailable {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1em;
        }

        .unavailable p {
          font-style: italic;
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
