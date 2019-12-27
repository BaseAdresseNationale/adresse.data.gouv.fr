import React from 'react'
import PropTypes from 'prop-types'

import colors from '../../styles/colors'

const DownloadIcon = ({color, size}) => (
  <div className='circle'>
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width={size}
      height={size}
      viewBox='0 0 24 24'
      fill='none'
      stroke={color || colors.black}
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
    >
      <path d='M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4' />
      <polyline points='7 10 12 15 17 10' />
      <line x1='12' y1='15' x2='12' y2='3' />
    </svg>

    <style jsx>{`
      .circle {}
      `}</style>
  </div>
)

DownloadIcon.defaultProps = {
  color: '#000',
  size: 72
}

DownloadIcon.propTypes = {
  color: PropTypes.string,
  size: PropTypes.number
}

export default DownloadIcon
