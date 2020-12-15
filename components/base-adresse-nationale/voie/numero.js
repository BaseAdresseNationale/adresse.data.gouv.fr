import React from 'react'
import PropTypes from 'prop-types'
import Link from 'next/link'

import theme from '@/styles/theme'

function Numero({id, numero}) {
  return (
    <Link href={`${id}`}>
      <a>
        <div className='numero'>
          <b>{numero}</b>
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
  id: PropTypes.string.isRequired,
  numero: PropTypes.string.isRequired
}

export default Numero
