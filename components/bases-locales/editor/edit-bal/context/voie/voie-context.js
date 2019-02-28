import React from 'react'
import PropTypes from 'prop-types'

import Notification from '../../../../../notification'
import Button from '../../../../../button'

import NumerosList from './numeros-list'
import ToponymeContext from './toponyme-context'

class VoieContext extends React.Component {
  static propTypes = {
    commune: PropTypes.shape({
      nom: PropTypes.string.isRequired,
      code: PropTypes.string.isRequired
    }).isRequired,
    voie: PropTypes.shape({
      nomVoie: PropTypes.string.isRequired,
      numeros: PropTypes.object,
      position: PropTypes.object
    }).isRequired,
    actions: PropTypes.shape({
      addItem: PropTypes.func.isRequired,
      cancelChange: PropTypes.func.isRequired,
      select: PropTypes.func.isRequired
    }).isRequired
  }

  render() {
    const {commune, voie, actions} = this.props
    const {numeros} = voie
    const hasNumeros = numeros && Object.keys(numeros).length > 0
    const newName = voie.modified && voie.modified.nomVoie

    return (
      <div>
        {newName && (
          <Notification type='info'>
            <div>
              <p>Anciennement nommée <b>{voie.nomVoie}</b>, vous avez renommé cette voie.</p>
              <Button
                size='small'
                onClick={() => actions.cancelChange(voie)}
              >
                Revenir au nom original
              </Button>
            </div>
          </Notification>
        )}

        {voie.position ? (
          <ToponymeContext
            voie={voie}
            actions={actions}
          />
        ) : (
          <div>
            {hasNumeros ? (
              <NumerosList
                codeCommune={commune.code}
                codeVoie={voie.codeVoie}
                numeros={numeros}
                actions={actions}
              />
            ) : (
              <Notification type='warning'>
                Cette voie ne possède aucune adresse. Vous pouvez ajouter une adresse depuis la carte.
              </Notification>
            )}
          </div>
        )}
      </div>
    )
  }
}

export default VoieContext
