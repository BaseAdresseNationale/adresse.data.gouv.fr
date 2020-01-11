import React from 'react'
import PropTypes from 'prop-types'
import Router from 'next/router'

import withFetch from '../../hoc/with-fetch'

import VoiesTable from './voies-table'

const VoiesCommune = ({voies, code}) => {
  const handleSelect = voie => {
    Router.push(
      `/commune/voie?idVoie=${voie.idVoie}`,
      `/explore/commune/${code}/voie/${voie.idVoie}`
    )
  }

  return (
    <div className='voies'>
      <VoiesTable voies={voies} onSelect={handleSelect} />
      <style jsx>{`
        .voies {
          margin-top: 2em;
        }
        `}</style>
    </div>
  )
}

VoiesCommune.propTypes = {
  voies: PropTypes.array,
  code: PropTypes.string.isRequired
}

VoiesCommune.defaultProps = {
  voies: []
}

export default withFetch(data => ({
  voies: data.voies
}))(VoiesCommune)
