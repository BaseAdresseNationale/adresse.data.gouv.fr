import React from 'react'
import PropTypes from 'prop-types'

import FaGroup from 'react-icons/lib/fa/group'
import FaArrowsAlt from 'react-icons/lib/fa/arrows-alt'

const Metrics = ({population, surface}) => (
  <div className='metrics'>
    {/* <div className='metric'>
      <FaGroup size={30} />
      <div>{population.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} habitants</div>
    </div> */}
    {/* <div className='metric'>
      <FaArrowsAlt size={30} />
      <div>{(surface / 100).toFixed(5)} km²</div>
    </div> */}
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
  population: PropTypes.number.isRequired,
  surface: PropTypes.number.isRequired
}

export default Metrics
