import React from 'react'
import PropTypes from 'prop-types'

import colors from '../../styles/colors'

const ContributeIcon = ({color, size}) => (
  <div className='circle'>
    <svg xmlns='http://www.w3.org/2000/svg'
      width={size}
      height={size}
      viewBox='0 0 24 24'
      fill='none'
      stroke={color || colors.black}
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
      className='feather feather-edit-3'
    >
      <path d='M12 20h9' />
      <path d='M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z' />
    </svg>

    <style jsx>{`
      .circle {}
      `}</style>
  </div>
)

ContributeIcon.defaultProps = {
  color: '#000',
  size: 72
}

ContributeIcon.propTypes = {
  color: PropTypes.string,
  size: PropTypes.number
}

export default ContributeIcon
