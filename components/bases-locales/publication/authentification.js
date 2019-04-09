import React from 'react'
import PropTypes from 'prop-types'

import theme from '../../../styles/theme'

import Button from '../../button'

const Authentification = React.memo(({mail, sendMail, franceConnect, publicationRequest}) => {
  return (
    <div>
      <div>
        <h3>Vous êtes habilité</h3>
        <div className='section'>
          {mail && (
            <div className='action column'>
              <p>Je suis un agent de la commune</p>
              <p>Adresse email de la mairie : <b>{mail}</b></p>
              <Button onClick={sendMail}>Recevoir l’email de validation</Button>
            </div>
          )}

          <div className='action column'>
            <p>Je suis élu de la commune</p>
            <Button onClick={franceConnect}>FranceConnect</Button>
          </div>
        </div>
      </div>

      <div>
        <h3>Vous n’êtes pas habilité</h3>
        <div className='section column'>
          <p>Je n’ai pas d’habilitation mais je suis en contact avec un élu ou le secrétariat de la commune</p>
          <Button onClick={publicationRequest}>Demander la publication</Button>
        </div>
      </div>

      <style jsx>{`
        .column {
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .section {
          display: flex;
          justify-content: space-around;
          align-items: center;
          text-align: center;
          border-radius: 2px;
          padding: 1em;
          background: ${theme.colors.lighterGrey};
          box-shadow: 0 1px 4px 0 ${theme.boxShadow};
        }
        `}</style>
    </div>
  )
})

Authentification.propTypes = {
  mail: PropTypes.string,
  franceConnect: PropTypes.func.isRequired,
  sendMail: PropTypes.func.isRequired,
  publicationRequest: PropTypes.func.isRequired
}

Authentification.defaultProps = {
  mail: null
}

export default Authentification
