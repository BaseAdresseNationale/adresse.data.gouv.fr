import React from 'react'
import PropTypes from 'prop-types'

import theme from '@/styles/theme'

function Codes({code, codesPostaux, population}) {
  return (
    <div className='codes'>
      <div><b>Code commune</b> : {code}</div>
      {codesPostaux.length > 1 ?
        <div id='codesFlex'>
          <b>Codes postaux</b> :
          <div>
            {codesPostaux.join(', ')}
          </div>
        </div> :
        <div><b>Code postal</b> : {codesPostaux[0]}</div>}
      <div><b>Habitants</b> : {population.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}</div>
      <style jsx>{`
      .codes {
        display: flex;
        justify-content: space-between;
        flex-flow: wrap;
        align-items: center;
        background-color: ${theme.primary};
        color: ${theme.colors.white};
        margin-top: -1em;
        padding: 1em 2em;
      }

      #codesFlex {
        text-align: center;
      }

      @media (max-width: 749px) {
        .codes {
          grid-template-columns: 50% 50%;
        }
      }
      `}</style>
    </div>
  )
}

Codes.propTypes = {
  codesPostaux: PropTypes.array.isRequired,
  population: PropTypes.number.isRequired,
  code: PropTypes.string.isRequired
}

export default Codes
