import React from 'react'
import Link from 'next/link'
import PropTypes from 'prop-types'

import theme from '../../../styles/theme'

const Head = ({commune, nomVoie, voie, numero}) => {
  const {nom, code, departement} = commune
  return (
    <div className='head'>
      <div className='breadcrumb'>
        {numero && <span><b>{numero.numero}</b><span className='comma'>,</span></span>}
        <Link href={`/explore/commune/${code}/voie/${voie.codeVoie}`}><a><b> {nomVoie}</b></a></Link>
        <span className='comma'>,</span>
        <Link href={`/explore/commune/${code}`}><a><b>{nom}</b></a></Link>
      </div>
      <h4>{departement.nom} ({departement.code})</h4>
      <style jsx>{`
        .head {
          display: flex;
          justify-content: space-between;
          flex-flow: wrap;
          align-items: center;
          border-bottom: 2px solid ${theme.colors.black};
          margin: -3em 0 2em 0;
        }

        .breadcrumb {
          font-size: 22px;
          margin-top: -1.3em;
        }

        .comma {
          font-weight: bold;
          margin: 0px 5px 0px 5px;
        }

        h4 {
          marginTop: -0.8em;
        }
        `}</style>
    </div>
  )
}

Head.propTypes = {
  commune: PropTypes.shape({
    nom: PropTypes.string.isRequired,
    code: PropTypes.string.isRequired,
    departement: PropTypes.shape({
      nom: PropTypes.string.isRequired,
      code: PropTypes.string.isRequired
    }).isRequired
  }),
  nomVoie: PropTypes.string.isRequired,
  voie: PropTypes.string.isRequired,
  numero: PropTypes.string.isRequired
}

Head.defaultProps = {
  commune: null
}

export default Head
