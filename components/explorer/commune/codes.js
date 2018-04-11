import React from 'react'
import PropTypes from 'prop-types'

const Codes = ({code, codesPostaux, departement, region}) => (
  <div className='codes'>
    <div><b>Code commune</b> : {code}</div>
    {codesPostaux.length > 1 ?
      <div>
        <b>Codes postaux</b> :
        <ul>
          {codesPostaux.map(code => <li key={code}>{code}</li>)}
        </ul>
      </div> :
      <div><b>Code postal</b> : {codesPostaux[0]}</div>
    }
    <div><b>Département</b> : {departement.nom} ({departement.code})</div>
    <div><b>Région</b> : {region.nom} ({region.code})</div>
    <style jsx>{`
      .codes {
        display: grid;
        grid-column: 1 / 1;
        grid-row: 1;
        align-items: center;
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
