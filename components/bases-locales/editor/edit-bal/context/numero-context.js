import React from 'react'
import PropTypes from 'prop-types'

import Head from './head'

class NumeroContext extends React.Component {
  static propTypes = {
    commune: PropTypes.shape({
      code: PropTypes.string.isRequired
    }).isRequired,
    voie: PropTypes.shape({
      nomVoie: PropTypes.string.isRequired
    }).isRequired,
    numero: PropTypes.shape({
      numeroComplet: PropTypes.string.isRequired
    }).isRequired,
    actions: PropTypes.shape({
      select: PropTypes.func.isRequired
    }).isRequired
  }

  render() {
    const {commune, voie, numero, actions} = this.props

    return (
      <div>
        <Head
          name={numero.numeroComplet}
          parent={voie.nomVoie}
          previous={() => actions.select(commune.code)}
        />

        <style jsx>{`
            .voies {
              margin: 2em 0;
            }
        `}</style>
      </div>
    )
  }
}

export default NumeroContext
