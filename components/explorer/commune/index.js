import React from 'react'

import theme from '../../../styles/theme'

import Head from './head'
import Codes from './codes'
import Metrics from './metrics'
import Map from './map'

const Commune = props => (
  <div>
    <Head {...props} />

    <div className='head'>
      <Codes {...props} />
    </div>

    <div className='map'>
      <Metrics {...props} />
      <Map {...props} />
    </div>

    <style jsx>{`
      .head {
        background-color: ${theme.primary};
        color: ${theme.colors.white};
      }

      .map {
        display: flex;
        flex-direction: row;
      }

      .map > div {
        width: 30%;
      }

      @media (max-width: 749px) {
        .map {
          display: flex;
          flex-direction: column;
        }
      }
      `}</style>
  </div>
)

export default Commune
