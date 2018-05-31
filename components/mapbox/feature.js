import React from 'react'
import PropTypes from 'prop-types'

const types = {
  locality: 'Lieu-dit',
  street: 'Voie',
  housenumber: 'Numéro'
}

const Feature = ({properties}) => (
  <div className='container'>
    <div>
      <h4>{types[properties.type]}</h4>
      <div>{properties.name}</div>
      <div>{properties.postcode} {properties.city}</div>
      <div>Code INSEE : {properties.citycode}</div>
      <div>Contexte : {properties.context}</div>
    </div>

    <style jsx>{`
      .container {
        padding: 8px;
        border-radius: 2px;
        font-size: 12px;
        line-height: 15px;
      }
    `}</style>
  </div>
)

Feature.propTypes = {
  properties: PropTypes.shape({
    street: PropTypes.string,
    housenumber: PropTypes.string,
    context: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    postcode: PropTypes.string.isRequired,
    citycode: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    city: PropTypes.string.isRequired
  }).isRequired
}

export default Feature
