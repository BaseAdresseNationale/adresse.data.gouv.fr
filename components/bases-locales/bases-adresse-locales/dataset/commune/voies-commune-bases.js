import React from 'react'
import PropTypes from 'prop-types'
import Router from 'next/router'

import VoiesTableBases from './voies-table-bases'

class VoiesCommuneBases extends React.Component {
  static propTypes = {
    voies: PropTypes.array,
    query: PropTypes.object
  }

  static defaultProps = {
    voies: [],
    query: []
  }

  handleSelect = voie => {
    Router.push(
      `/bases-locales/jeux-de-donnees/${this.props.query.id}/${this.props.query.communes[0]}/${voie.codeVoie}`
    )
  }

  render() {
    const {voies} = this.props

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
