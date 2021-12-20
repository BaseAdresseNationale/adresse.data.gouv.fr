import React, {useState} from 'react'
import PropTypes from 'prop-types'

import theme from '@/styles/theme'

import Notification from '@/components/notification'
import Button from '@/components/button'

import User from './user'

const Publishing = React.memo(({user, commune, hasConflit, publication}) => {
  const [isConfirmed, setIsConfirmed] = useState(false)

  return (
    <div>
      <User user={user} commune={commune} />

      <div className='message'>
        <p>La Base Adresse Locale de votre commune</p>
        <p><b>{commune.nom} - {commune.code}</b></p>
        <p>est prête à être publiée</p>

        {hasConflit && (
          <Notification type='error'>
            <div>
              <p>Une autre Base Adresses Locale est <b>déjà synchronisée avec la Base Adresses Nationale</b>.</p>
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
          <Button disabled={hasConflit && !isConfirmed} onClick={publication}>Publier</Button>
        </div>
      </div>

      <style jsx>{`
        .message {
          text-align: center;
          background: ${theme.colors.lighterGrey};
          margin: 1em 0;
          padding: 2em;
        }

        .confirm-publication {
          display: flex;
          justify-content: center;
        }
        `}</style>
    </div>
  )
})

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
