import React from 'react'
import PropTypes from 'prop-types'

import colors from '../../styles/colors'

// No "tools" icon provided by react-feather
const ToolsIcon = ({color, size}) => (
  <div className='circle'>
    {/* Source SVG : https://feathericons.com */}
    <svg xmlns='http://www.w3.org/2000/svg'
      width={size}
      height={size}
      viewBox='0 0 24 24'
      fill='none'
      stroke={color || colors.black}
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
      className='feather feather-tool'
    >
      <path d='M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z' />
    </svg>

  </div>
)

ToolsIcon.defaultProps = {
  color: '#000',
  size: 48
}

ToolsIcon.propTypes = {
  color: PropTypes.string,
  size: PropTypes.number
}

export default ToolsIcon
