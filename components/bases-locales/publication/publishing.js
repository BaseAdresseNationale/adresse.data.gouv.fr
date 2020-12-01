import React from 'react'
import PropTypes from 'prop-types'

import theme from '@/styles/theme'

import Button from '@/components/button'

import User from './user'

const Publishing = React.memo(({user, commune, publication}) => {
  return (
    <div>
      <User user={user} />

      <div className='message'>
        <p>La Base Adresse Locale de votre commune</p>
        <p><b>{commune.nom} - {commune.code}</b></p>
        <p>est prête à être publiée</p>
        <Button onClick={publication}>Publier</Button>
      </div>

      <style jsx>{`
        .message {
          text-align: center;
          background: ${theme.colors.lighterGrey};
          margin: 1em 0;
          padding: 2em;
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
  publication: PropTypes.func.isRequired
}

export default Publishing
