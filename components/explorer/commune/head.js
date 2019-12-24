import React from 'react'
import PropTypes from 'prop-types'

import theme from '../../../styles/theme'

const Head = ({nom, code, region, departement}) => (
  <div className='head'>
    <h2>{nom} - {code}</h2>
    <h4>Région : {region.nom}</h4>
    <h4>Département : {departement.nom} ({departement.code})</h4>
    <style jsx>{`
      .head {
        display: flex;
        justify-content: space-between;
        flex-flow: wrap;
        align-items: center;
        border-bottom: 2px solid ${theme.colors.black};
        margin: -3em 0 2em 0;
      }
      `}</style>
  </div>
)

Head.propTypes = {
  nom: PropTypes.string.isRequired,
  code: PropTypes.string.isRequired,
  region: PropTypes.shape({
    nom: PropTypes.string.isRequired,
    code: PropTypes.string.isRequired
  }).isRequired,
  departement: PropTypes.shape({
    nom: PropTypes.string.isRequired,
    code: PropTypes.string.isRequired
  }).isRequired
}

export default Head
