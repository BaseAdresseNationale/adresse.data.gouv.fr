import React from 'react'
import PropTypes from 'prop-types'

import Head from '.'
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
            <Head
              name={commune.nom}
              parent='Communes'
              previous={() => context.actions.select(null)}
            />
          )}
        </FormContext.Consumer>

        <div className='voies'>
          <b>Voies de : {commune.nom}</b>
          <VoiesList
            voies={commune.voies}
            codeCommune={commune.code}
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
