import React from 'react'
import PropTypes from 'prop-types'

function formatNumber(nb) {
  return nb.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
}

function roundNb(nb) {
  return nb ? Math.round(nb * 100) : null
}

const BanStats = ({properties}) => {
  const total = formatNumber(properties.total)
  const banV0Only = formatNumber(properties['ban-v0-only'])
  const banLOOnly = formatNumber(properties['ban-lo-only'])
  const both = formatNumber(properties.both)
  const pseudoAdresse = formatNumber(properties['pseudo-adresse'])
  const banV0OnlyRatio = roundNb(properties['ban-v0-only-ratio'])
  const banLOOnlyRatio = roundNb(properties['ban-lo-only-ratio'])

  return (
    <div>
      <h3>{properties.nom} - {properties.code}</h3>
      <p>
        <b>{total}</b> adresses uniques
      </p>
      {properties.total > 0 && (
        <ul>
          <li><b>{banV0Only}</b> présentes uniquement dans la BAN v0 {banV0OnlyRatio && (<b>{banV0OnlyRatio}%</b>)}</li>
          <li><b>{banLOOnly}</b> présentes uniquement dans la BAN LO {banLOOnlyRatio && (<b>{banLOOnlyRatio}%</b>)}</li>
          <li><b>{both}</b> présentes dans la BAN v0 et la BAN LO</li>
          <li><b>{pseudoAdresse}</b> pseudo-adresses</li>
        </ul>
      )}
    </div>
  )
}

BanStats.propTypes = {
  properties: PropTypes.shape({
    nom: PropTypes.string.isRequired,
    code: PropTypes.string.isRequired,
    total: PropTypes.number,
    both: PropTypes.number,
    'ban-v0-only': PropTypes.number,
    'ban-lo-only': PropTypes.number,
    'pseudo-adresse': PropTypes.number,
    'ban-v0-only-ratio': PropTypes.number,
    'ban-lo-only-ratio': PropTypes.number
  }).isRequired
}

export default BanStats
