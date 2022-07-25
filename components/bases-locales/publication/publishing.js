import {useState} from 'react'
import PropTypes from 'prop-types'
import {ArrowUpCircle, AlertOctagon} from 'react-feather'

import theme from '@/styles/theme'

import Notification from '@/components/notification'
import Button from '@/components/button'

import User from './user'

function Publishing({user, commune, hasConflit, publication}) {
  const [isConfirmed, setIsConfirmed] = useState(false)

  return (
    <div>
      <User user={user} commune={commune} />

      <div className='message'>
        <p className='publish-message'>La Base Adresse Locale de votre commune <b>{commune.nom} ({commune.code})</b> est maintenant <b className='ready-to-publish'>prête à être publiée</b></p>

        {hasConflit && (
          <Notification type='warning'>
            <div className='alert-content'>
              <h4><AlertOctagon alt aria-hidden /> Une autre Base Adresses Locale est déjà synchronisée avec la Base Adresses Nationale.</h4>
              <p>En choisissant de publier, votre Base Adresse Locale <b>remplacera celle actuellement en place</b>.</p>
            </div>
          </Notification>
        )}

        <div>
          {hasConflit && (
            <div className='confirm-publication'>
              <input type='checkbox' value={isConfirmed} onChange={() => setIsConfirmed(!isConfirmed)} />
              <label>Je comprend que ma Base Adresse Locale remplacera celle actuellement synchronisée avec la Base Adresses Nationale</label>
            </div>
          )}

          <Button size='large' disabled={hasConflit && !isConfirmed} onClick={publication}>
            <div className='publish-button-content'><ArrowUpCircle size={25} alt aria-hidden /> Publier</div>
          </Button>
        </div>
      </div>

      <style jsx>{`
        .message {
          text-align: center;
          background: ${theme.colors.lighterGrey};
          margin: 1em 0;
          padding: 2em;
        }

        .publish-message {
          font-size: 18px;
        }

        .ready-to-publish {
          color: ${theme.primary};
          text-decoration: underline;
          font-size: 20px;
        }

        .confirm-publication {
          display: flex;
          justify-content: center;
          margin-bottom: 2em;
        }

        .publish-button-content {
          display: flex;
          gap: 1em;
        }

        .alert-content {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        h4 {
          color: ${theme.warningBorder};
          display: flex;
          gap: 10px;
          margin: 0;
        }
      `}</style>
    </div>
  )
}

Publishing.propTypes = {
  user: PropTypes.object.isRequired,
  commune: PropTypes.shape({
    nom: PropTypes.string.isRequired,
    code: PropTypes.string.isRequired
  }).isRequired,
  hasConflit: PropTypes.bool.isRequired,
  publication: PropTypes.func.isRequired
}

export default Publishing
