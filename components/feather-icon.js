/* eslint-disable react/no-danger */
import React from 'react'
import PropTypes from 'prop-types'
import feather from 'feather-icons'

const FeatherIcon = ({icon, color, size, ...otherProps}) => {
  const width = size
  const height = size

  if (icon) {
    return (
      <svg style={{width, height, verticalAlign: 'middle'}} dangerouslySetInnerHTML={{
        __html: feather.icons[icon].toSvg({color, width, height, ...otherProps})}}
      />
    )
  }
}

FeatherIcon.propTypes = {
  icon: PropTypes.string.isRequired,
  color: PropTypes.string,
  size: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
}

FeatherIcon.defaultProps = {
  color: 'currentColor',
  size: '24'
}

export default FeatherIcon

