import React from 'react'
import PropTypes from 'prop-types'

const Metrics = ({population}) => (
  <div className='metrics'>
    <div className='metric'>
      <div>{population.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} habitants</div>
    </div>
    <style jsx>{`
      .metrics {
        display: flex;
        flex-direction: row;
        justify-content: space-around;
      }

      .metric {
        text-align: center;
        padding: 1em;
      }

        `}</style>
  </div>
)

Metrics.propTypes = {
  population: PropTypes.number.isRequired
}

export default Metrics
