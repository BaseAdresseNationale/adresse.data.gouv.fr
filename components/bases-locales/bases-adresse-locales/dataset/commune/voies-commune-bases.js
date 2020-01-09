import React from 'react'
import PropTypes from 'prop-types'
import Router from 'next/router'

import VoiesTableBases from './voies-table-bases'

class VoiesCommuneBases extends React.Component {
  static propTypes = {
    query: PropTypes.object,
    commune: PropTypes.object
  }

  static defaultProps = {
    query: [],
    commune: []
  }

  handleSelect = voie => {
    if (voie.numerosCount === 0 && !voie.position) {
      return null
    }

    Router.push(
      `/bases-locales/jeux-de-donnees/${this.props.query.id}/${this.props.commune.code}/${voie.codeVoie}`
    )
  }

  render() {
    const {voies} = this.props.commune

    return (
      <div className='voies'>
        <VoiesTableBases voies={voies} onSelect={this.handleSelect} />
        <style jsx>{`
          .voies {
            margin-top: 2em;
          }
          `}</style>
      </div>
    )
  }
}

export default VoiesCommuneBases
