import React from 'react'
import PropTypes from 'prop-types'
import Link from 'next/link'

import theme from '@/styles/theme'

import {getNumeroComplet} from '@/lib/ban'

function Numero({id, numero, suffixe}) {
  return (
    <Link href={`/base-adresse-nationale?id=${id}`} as={`/base-adresse-nationale/${id}`}>
      <a>
        <div className='numero'>
          <b>{getNumeroComplet({numero, suffixe})}</b>
        </div>

        <style jsx>{`
          a {
            text-decoration: none;
            color: ${theme.darkText};
          }

          .numero {
            display: grid;
            grid-template-columns: 2fr 1fr 24px;
            align-items: center;
            grid-gap: 0.5em;
            padding: 0.2em 0 0 0.2em;
            cursor: pointer;
          }

          .numero:hover {
            background-color: ${theme.primary};
            color: #fff;
          }
          `}</style>
      </a>
    </Link>
  )
}

Numero.propTypes = {
  suffixe: null
}

Numero.propTypes = {
  id: PropTypes.string.isRequired,
  suffixe: PropTypes.string,
  numero: PropTypes.string.isRequired
}

export default Numero
