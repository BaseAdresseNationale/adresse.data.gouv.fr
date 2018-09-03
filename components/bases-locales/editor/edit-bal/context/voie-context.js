import React from 'react'
import PropTypes from 'prop-types'

import VoieItem from '../item/voie-item'
import ClosablePanel from '../closable-panel'
import NumerosList from '../numeros-list'

class VoieContext extends React.Component {
  static propTypes = {
    commune: PropTypes.object.isRequired,
    voie: PropTypes.shape({
      nomVoie: PropTypes.string.isRequired,
      numeros: PropTypes.array
    }).isRequired
  }

  render() {
    const {commune, voie} = this.props

    return (
      <div>
        <ClosablePanel title={voie.nomVoie} handleClose={actions.previousContext}>
          <VoieItem
            commune={commune}
            voie={voie}
            itemActions={actions}
          />
        </ClosablePanel>

        {(voie.numeros && voie.numeros.length > 0) ? (
          <div className='voies'>
            <b>Numéros de : {voie.nomVoie}</b>
            <NumerosList
              numeros={voie.numeros}
              itemActions={action}
            />
          </div>
        ) : (
          <div>Aucun numéro</div>
        )}

        <style jsx>{`
            .voies {
              margin: 2em 0;
            }
        `}</style>
      </div>

    )
  }
}

export default VoieContext
