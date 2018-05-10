import React from 'react'
import PropTypes from 'prop-types'
import Router from 'next/router'

import withFetch from '../../hoc/with-fetch'

import VoiesTable from './voies-table'

class VoiesCommune extends React.Component {
  constructor(props) {
    super(props)
    this.handleSelect = this.handleSelect.bind(this)
  }

  handleSelect(voie) {
    Router.push(
      `/commune/voie?codeVoie=${voie.codeVoie}`,
      `/explore/commune/${voie.codeCommune}/voie/${voie.codeVoie}`)
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

VoiesCommune.propTypes = {
  voies: PropTypes.array
}

VoiesCommune.defaultProps = {
  voies: []
}

export default withFetch(data => ({
  voies: data.voies
}))(VoiesCommune)
