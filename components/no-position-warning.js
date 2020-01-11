import React from 'react'

import PropTypes from 'prop-types'

import {AlertTriangle} from 'react-feather'
import theme from '../styles/theme'
import Tag from './tag'

const NoPositionWarning = ({check, text}) => {
  if (check) {
    return (
      <Tag type='toponyme' />
    )
  }

  if (!check) {
    return (
      <div className='no-position-container'>
        <AlertTriangle className='alert-icon' />
        <span className='noPosition'>{text}</span>
        <Tag type='toponyme' />
        <style jsx>{`
          .no-position-container {
            display: flex;
            justify-content: center;
            align-items: center;
            color: ${theme.errorBorder};
          }

          .alert-icon, .noPosition {
            margin: 0 1em;
          }
        `}</style>
      </div>
    )
  }
}

NoPositionWarning.propTypes = {
  text: PropTypes.string.isRequired,
  check: PropTypes.object
}

export default NoPositionWarning
