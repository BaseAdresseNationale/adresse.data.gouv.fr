import React from 'react'
import PropTypes from 'prop-types'

import theme from '../../../styles/theme'

const Codes = ({code, codesPostaux, departement, region, population}) => (
  <div className='codes'>
    <div><b>Code commune</b> : {code}</div>
    {codesPostaux.length > 1 ?
      <div>
        <b>Codes postaux</b> :
        <div>
          {codesPostaux.join(', ')}
        </div>
      </div> :
      <div><b>Code postal</b> : {codesPostaux[0]}</div>}
    <div><b>Département</b> : {departement.nom} ({departement.code})</div>
    <div><b>Région</b> : {region.nom} ({region.code})</div>
    <div><b>Habitants</b> : {population.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}</div>
    <style jsx>{`
      .codes {
        display: grid;
        text-align: center;
        grid-template-columns: repeat(5, 1fr);
        background-color: ${theme.primary};
        color: ${theme.colors.white};
        margin-top: -1em;
        padding: 1em 2em;
      }

      @media (max-width: 749px) {
        .codes {
          grid-template-columns: 50% 50%;
        }
      }
      `}</style>
  </div>
)

Codes.propTypes = {
  codesPostaux: PropTypes.array.isRequired,
  code: PropTypes.string.isRequired,
  departement: PropTypes.shape({
    nom: PropTypes.string.isRequired,
    code: PropTypes.string.isRequired
  }).isRequired,
  region: PropTypes.shape({
    nom: PropTypes.string.isRequired,
    code: PropTypes.string.isRequired
  }).isRequired
}

export default Codes
