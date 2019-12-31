import React from 'react'
import Link from 'next/link'
import PropTypes from 'prop-types'

import theme from '../../../styles/theme'

const Head = ({commune, voie, numero}) => {
  const {nom, code, departement} = commune
  return (
    <div className='head'>
      <div className='breadcrumb'>
        {numero ? (
          <>
            <span>{numero}<span className='comma'>,</span></span>
            <Link
              href={`/explore/commune/voie?codeCommune=${code}&idVoie=${voie.idVoie}`}
              as={`/explore/commune/${code}/voie/${voie.idVoie}`}
            >
              <a>{voie.nomVoie}</a>
            </Link>
          </>
        ) : (
          <span>{voie.nomVoie}</span>
        )}
        <span className='comma'>,</span>
        <Link href={`/explore/commune/${code}`}><a>{nom}</a></Link>
      </div>

      <h4>{departement.nom} ({departement.code})</h4>
      <style jsx>{`
        .head {
          display: flex;
          justify-content: space-between;
          flex-flow: wrap;
          align-items: center;
          border-bottom: 2px solid ${theme.colors.black};
          margin: -6em 0 2em 0;
        }

        .breadcrumb {
          font-size: 22px;
          font-weight: bold;
          margin-top: -1.3em;
        }

        .comma {
          margin: 0px 5px;
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
  voie: PropTypes.object.isRequired,
  numero: PropTypes.string
}

Head.defaultProps = {
  commune: null,
  numero: null
}

export default Head
