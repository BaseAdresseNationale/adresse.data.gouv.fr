import React from 'react'
import PropTypes from 'prop-types'
import Link from 'next/link'

import theme from '@/styles/theme'

import {getNumeroComplet} from '@/lib/ban'
import Certification from '../certification'

function Numero({id, numero, suffixe, lieuDitComplementNom, isCertified}) {
  return (
    <Link href={`/base-adresse-nationale?id=${id}`} as={`/base-adresse-nationale/${id}`}>
      <a>
        <div className='numero'>
          <b>{getNumeroComplet({numero, suffixe})}</b> {lieuDitComplementNom}
        </div>
        <div className='certification'>
          <Certification
            isCertified={isCertified}
            certifiedMessage='Cette adresse est certifiée par la commune'
            iconSize={18}
            tooltipDirection='left'
          />
        </div>

        <style jsx>{`
          a {
            text-decoration: none;
            color: ${theme.darkText};
            display: flex;
            justify-content: space-between;
            align-items: center;
          }

          a:hover {
            background-color: ${theme.primary};
            color: #fff;
          }

          .numero {
            display: grid;
            grid-template-columns: 2fr 1fr 24px;
            align-items: center;
            grid-gap: 0.5em;
            padding: 0.2em 0 0 0.2em;
            cursor: pointer;
          }

          .certification {
            margin-right: 0.2em;
          }
          `}</style>
      </a>
    </Link>
  )
}

Numero.propTypes = {
  suffixe: null,
  lieuDitComplementNom: null
}

Numero.propTypes = {
  id: PropTypes.string.isRequired,
  suffixe: PropTypes.string,
  numero: PropTypes.string.isRequired,
  lieuDitComplementNom: PropTypes.string,
  isCertified: PropTypes.bool.isRequired
}

export default Numero
