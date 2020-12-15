import React from 'react'
import PropTypes from 'prop-types'
import Link from 'next/link'

import theme from '@/styles/theme'

import Tag from '@/components/tag'

function Voie({id, type, nomVoie, nbNumeros}) {
  return (
    <Link href={`${id}`}>
      <a>
        <div className='voie'>
          <div>
            <div><b>{nomVoie}</b></div>
            <div className='numeros'>{nbNumeros} numéros</div>
          </div>
          {type === 'lieu-dit' && <Tag type='lieu-dit' />}
        </div>

        <style jsx>{`
          a {
            text-decoration: none;
            color: ${theme.darkText};
          }

          .voie {
            display: grid;
            grid-template-columns: 2fr 1fr 24px;
            align-items: center;
            grid-gap: 0.5em;
            padding: 0.2em 0 0 0.2em;
            cursor: pointer;
          }

          .voie:hover {
            background-color: ${theme.primary};
            color: #fff;
          }

          .numeros {
            font-size: small;
          }
          `}</style>
      </a>
    </Link>
  )
}

Voie.propTypes = {
  id: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['voie', 'lieu-dit']),
  nomVoie: PropTypes.string.isRequired,
  nbNumeros: PropTypes.number.isRequired
}

export default Voie
