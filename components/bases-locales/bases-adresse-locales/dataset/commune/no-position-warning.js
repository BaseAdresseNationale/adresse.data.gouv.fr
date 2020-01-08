import React from 'react'

import PropTypes from 'prop-types'

import {AlertTriangle} from 'react-feather'
import Tag from '../../../../tag'

const NoPositionWarning = ({check, text}) => {
  if (check) {
    return (
      <Tag type='toponyme' />
    )
  }

  if (!check) {
    return (
      <div className='no-position-container'>
        <AlertTriangle className='alert-icon' color='red' />
        <span className='noPosition'>{text}</span>
        <Tag type='toponyme' />
        <style jsx>{`
          .no-position-container {
            display: flex;
            justify-content: center;
            align-items: center;
          }

          .alert-icon, .noPosition {
            margin: 0 1em;
          }

          .noPosition {
            color: red;
          }
        `}</style>
      </div>
    )
  }
}

NoPositionWarning.propTypes = {
  text: PropTypes.string.isRequired,
  check: PropTypes.object.isRequired
}

export default NoPositionWarning
