import React from 'react'
import PropTypes from 'prop-types'

import theme from '@/styles/theme'

import Tag from '@/components/tag'

function Voie({type, nomVoie, nbNumeros, handleClick}) {
  return (
    <div onClick={handleClick}>
      <div className='voie'>
        <div>
          <div><b>{nomVoie}</b></div>
          <div className='numeros'>{nbNumeros} numéros</div>
        </div>
        {type === 'lieu-dit' && <Tag type='lieu-dit' />}
      </div>

      <style jsx>{`
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

        .numeros-list {
          padding-left: 1em;
          background-color: ${theme.secondary};
        }
        `}</style>
    </div>
  )
}

Voie.propTypes = {
  type: PropTypes.oneOf(['voie', 'lieu-dit']),
  nomVoie: PropTypes.string.isRequired,
  nbNumeros: PropTypes.number.isRequired,
  handleClick: PropTypes.func.isRequired
}

export default Voie
