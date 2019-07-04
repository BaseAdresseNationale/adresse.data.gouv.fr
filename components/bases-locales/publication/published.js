import React from 'react'
import PropTypes from 'prop-types'

import theme from '../../../styles/theme'

import ButtonLink from '../../button-link'

const Published = React.memo(({publicationUrl}) => {
  return (
    <div className='published'>
      <h1>Votre Base Adresse Locale a bien été publiée !</h1>
      <div className='valid'>✓</div>
      {publicationUrl ?
        <ButtonLink href={publicationUrl}>
          Voir les adresses
        </ButtonLink> : null}

      <style jsx>{`
        .published {
          display: flex;
          flex-direction: column;
          align-items: center;
          background-color: ${theme.successBg};
          color: ${theme.successBorder};
          padding: 2em;
          text-align: center;
        }

        .valid {
          border-radius: 100%;
          background-color: ${theme.successBorder};
          margin: 1em;
          color: #fff;
          width: 80px;
          height: 80px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: -webkit-xxx-large;
        }

        a {
          color: ${theme.successBorder};
        }
      `}</style>
    </div>
  )
})

Published.propTypes = {
  publicationUrl: PropTypes.string.isRequired
}

export default Published
