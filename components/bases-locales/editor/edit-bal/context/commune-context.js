import React from 'react'
import PropTypes from 'prop-types'

import CommuneItem from '../item/commune-item'
import ClosablePanel from '../closable-panel'
import VoiesList from '../voies-list'

import {FormContext} from '..'

class CommuneContext extends React.Component {
  static propTypes = {
    commune: PropTypes.shape({
      nom: PropTypes.string.isRequired,
      voies: PropTypes.object.isRequired
    }).isRequired
  }

  render() {
    const {commune} = this.props

    return (
      <div>
        <FormContext.Consumer>
          {context => (
            <ClosablePanel
              title={`Commune de ${commune.nom}`}
              handleClose={() => context.select(null)}
            >
              <CommuneItem commune={commune} {...context} />
            </ClosablePanel>
          )}
        </FormContext.Consumer>

        <div className='voies'>
          <b>Voies de : {commune.nom}</b>
          <VoiesList
            commune={commune}
            voies={commune.voies}
          />
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
