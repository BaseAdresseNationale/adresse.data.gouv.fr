import React from 'react'
import PropTypes from 'prop-types'

import theme from '../../styles/theme'

const trads = {
  context: 'Contexte',
  name: 'Nom',
  street: 'Voie',
  housenumber: 'Numéro',
  postcode: 'Code postal',
  citycode: 'Code INSEE',
  type: 'Type',
  city: 'Commune'
}

const types = {
  street: 'Rue',
  housenumber: 'Numéro',
  municipality: 'Commune'
}

const getProperties = (key, properties) => {
  const trad = Object.keys(types).includes(properties[key]) ? types[properties[key]] : properties[key]
  if (trad) {
    return (
      <div key={key}>
        <b>{trads[key]} :</b> {trad}
      </div>
    )
  }
}

const Feature = ({properties}) => (
  <div className='container'>
    <div>
      {Object.keys(trads).map(key => getProperties(key, properties))}
    </div>

    <style jsx>{`
      .container {
        border-color: ${theme.border};
        background-color: ${theme.colors.white};
        padding: 8px;
        border-radius: 2px;
        font-size: 12px;
        line-height: 15px;
        border: 1px solid $black;
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
