import React from 'react'
import PropTypes from 'prop-types'
import Router from 'next/router'

import withFetch from '../../hoc/with-fetch'

import VoiesTable from './voies-table'

class VoiesCommune extends React.Component {
  static propTypes = {
    voies: PropTypes.array
  }

  static defaultProps = {
    voies: []
  }

  handleSelect = voie => {
    Router.push(
      `/commune/voie?codeVoie=${voie.codeVoie}`,
      `/explore/commune/${voie.codeCommune}/voie/${voie.codeVoie}`
    )
  }

  render() {
    const {voies} = this.props

    return (
      <div className='voies'>
        <VoiesTable voies={voies} onSelect={this.handleSelect} />
        <style jsx>{`
          .voies {
            margin-top: 2em;
          }
          `}</style>
      </div>
    )
  }
}

export default withFetch(data => ({
  voies: data.voies
}))(VoiesCommune)
