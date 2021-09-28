import PropTypes from 'prop-types'
import React from 'react'
import copy from 'copy-to-clipboard'

import theme from '../../../styles/theme'

import Code from '../code'

import Loader from '../../loader'
import InputExample from './input-example'

function Result({example, results, isLoading}) {
  return (
    <div className='result-container'>
      <InputExample value={example} copy={copy} />
      {isLoading ?
        <div className='loading-pre'>
          <div className='loading-code'>
            <div className='centered'>
              <Loader />
            </div>
          </div>
        </div> :
        <Code code={JSON.stringify(results, null, 2)} />}
      <style jsx>{`
        .result-container {
          display: flex;
          flex-direction: column;
        }

        .centered {
          margin: auto;
        }

        .loading-pre {
          background: ${theme.colors.white};
          border: 1px solid ${theme.backgroundGrey};
          border-radius: 5px;
          width: 100%;
          padding: 1em;
          margin: 1em 0;
        }

        .loading-code {
          width: 100%;
          height: 360px;
          background: ${theme.backgroundGrey};
          display: flex;
          justify-content: center;
        }
      `}</style>
    </div>
  )
}

Result.propTypes = {
  example: PropTypes.string.isRequired,
  results: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object
  ]),
  isLoading: PropTypes.bool
}

Result.defaultProps = {
  isLoading: true,
  results: null
}

export default Result
