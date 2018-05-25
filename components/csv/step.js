import React from 'react'
import PropTypes from 'prop-types'

import theme from '../../styles/theme'

const Step = ({title, children}) => {
  return (
    <div>
      <h2 className={`${children ? '' : 'disabled'}`}>{title}</h2>
      {children}
      <style jsx>{`
        .disabled {
          color: ${theme.colors.lightGrey}
        }
      `}</style>
    </div>
  )
}

Step.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node
}

Step.defaultProps = {
  children: null
}

export default Step
