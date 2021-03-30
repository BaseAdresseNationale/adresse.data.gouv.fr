import React from 'react'
import PropTypes from 'prop-types'

import colors from '@/styles/colors'
import {Users} from 'react-feather'

import PostalCodes from '../postal-codes'

function Details({nbVoies, nbLieuxDits, nbNumeros, codesPostaux, population}) {
  return (
    <div className='details'>
      <div className='number-of-wrapper'>
        <div className='number-of-container'>
          <div>
            {nbVoies > 0 ? (nbVoies > 1 ? `${nbVoies} voies répertoriées` : '1 voie répertoriée') : 'Aucune voie répertoriée'}
          </div>
          <div>
            {nbLieuxDits > 0 ? (nbLieuxDits > 1 ? `${nbLieuxDits} lieux-dits répertoriés` : '1 lieu-dit répertorié') : 'Aucun lieu-dit répertorié'}
          </div>
          <div>
            {nbNumeros > 0 ? (nbNumeros > 1 ? `${nbNumeros} numéros répertoriés` : '1 numéro répertorié') : 'Aucun numéros répertorié'}
          </div>
        </div>
      </div>
      <div className='commune-general'>
        <PostalCodes codes={codesPostaux} />
        <div className='with-icon'>
          <Users /> <div><b>{population}</b> habitants</div>
        </div>
      </div>

      <style jsx>{`
        .details {
          display: grid;
          grid-gap: 1em;
        }

        .with-icon {
          display: flex;
        }

        .with-icon > div {
          margin-left: 0.4em;
        }

        .number-of-wrapper {
          display: flex;
          margin: 1em 0 1em 0;
          border-left: solid 3px ${colors.lightBlue}
        }

        .number-of-container {
          display: flex;
          flex-direction: column;
          padding-left: 10px;
        }

        .number-of-container > div {
          font-style: italic;
          font-size: 16px;
          color: ${colors.almostBlack};
        }

        .commune-general {
          display: flex;
          justify-content: space-between;
        }
      `}</style>
    </div>
  )
}

Details.propTypes = {
  nbVoies: PropTypes.number.isRequired,
  nbLieuxDits: PropTypes.number.isRequired,
  nbNumeros: PropTypes.number.isRequired,
  population: PropTypes.number.isRequired,
  codesPostaux: PropTypes.array.isRequired
}
export default Details
