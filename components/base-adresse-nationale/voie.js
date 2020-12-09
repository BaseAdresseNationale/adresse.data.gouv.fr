import React from 'react'
import PropTypes from 'prop-types'
import {ChevronDown, ChevronUp} from 'react-feather'

import theme from '@/styles/theme'

import NumerosList from './numeros-list'

function Voie({idVoie, nomVoie, nbNumeros, numeros, handleClick}) {
  return (
    <div id={idVoie} onClick={handleClick}>
      <div className={`voie ${numeros ? 'selected' : ''}`}>
        <div><b>{nomVoie}</b></div>
        <div>{nbNumeros} numéros</div>
        <div>{numeros ? <ChevronDown /> : <ChevronUp />}</div>
      </div>
      {numeros && (
        <div className='numeros-list'>
          <NumerosList numeros={numeros} />
        </div>
      )}

      <style jsx>{`
        .voie {
          display: grid;
          grid-template-columns: 2fr 1fr 24px;
          align-items: center;
          grid-gap: 0.5em;
          padding: 0.2em 0 0 0.2em;
          cursor: pointer;
        }

        .voie:hover, .selected {
          background-color: ${theme.primary};
          color: #fff;
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
  numeros: null
}

Voie.propTypes = {
  idVoie: PropTypes.string.isRequired,
  nomVoie: PropTypes.string.isRequired,
  nbNumeros: PropTypes.number.isRequired,
  numeros: PropTypes.array,
  handleClick: PropTypes.func.isRequired
}

export default Voie
