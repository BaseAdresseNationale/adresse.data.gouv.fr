import React from 'react'
import PropTypes from 'prop-types'

import CommuneItem from '../item/commune-item'
import ClosablePanel from '../closable-panel'
import VoiesList from '../voies-list'

import {ItemContext} from '..'

class CommuneContext extends React.Component {
  static propTypes = {
    commune: PropTypes.shape({
      nom: PropTypes.string.isRequired,
      voies: PropTypes.array.isRequired
    }).isRequired
  }

  render() {
    const {commune} = this.props

    return (
      <div>
        <h2>Contexte</h2>
        <div>
          <ItemContext.Consumer>
            {actions => (
              <ClosablePanel
                title={`Commune de ${commune.nom}`}
                handleClose={() => actions.previousContext(null)}
              >
                <CommuneItem commune={commune} itemActions={actions} />
              </ClosablePanel>
            )}
          </ItemContext.Consumer>

          <div className='voies'>
            <b>Voies de : {commune.nom}</b>
            <VoiesList
              commune={commune}
              voies={commune.voies}
            />
          </div>
        </div>

        <style jsx>{`
          .voies {
            margin: 2em 0;
          }
        `}</style>
      </div>
    )
  }
}

export default CommuneContext
